import { ObjectId } from 'mongodb';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { recordAudit } from '@/lib/audit';
import { requireSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { error, json, options } from '@/lib/http';
import { uploadFile } from '@/lib/storage';

export const runtime = 'nodejs';

const companyInput = z.object({ name: z.string().trim().min(1), address: z.string().trim().min(1), mobile: z.string().trim().optional(), email: z.string().trim().email().optional() });
const contactInput = z.object({ name: z.string().trim().min(1), type: z.enum(['Engineer', 'Buyer']), companyId: z.string(), mobileNumber: z.string().trim().optional(), email: z.string().trim().email() });
const jobInput = z.object({ name: z.string().trim().min(1), description: z.string().trim().optional(), companyId: z.string(), buyerId: z.string().optional(), engineerId: z.string().optional(), jobDate: z.string().datetime().optional(), price: z.coerce.number().nonnegative() });
const templateInput = z.object({ documentType: z.enum(['Quotation', 'Invoice', 'Delivery Note']), file: z.string().min(1), originalFilename: z.string().trim().refine((filename) => filename.toLowerCase().endsWith('.docx'), 'Only .docx templates are accepted.') });

type RouteContext = { params: Promise<{ segments: string[] }> };

function id(value: string) {
  return ObjectId.isValid(value) ? new ObjectId(value) : null;
}

function publicRecord(record: Record<string, unknown> | null) {
  if (!record) return null;
  const fields = { ...record };
  const identifier = fields._id;
  delete fields._id;
  delete fields.password;
  delete fields.passwordHash;
  return { ...fields, id: identifier instanceof ObjectId ? identifier.toHexString() : identifier };
}

function validJson<T>(schema: z.ZodType<T>, body: unknown) {
  const parsed = schema.safeParse(body);
  return parsed.success ? parsed.data : null;
}

async function resolvedJobs() {
  const database = await db();
  const jobs = await database.collection('jobs').find().sort({ jobDate: -1 }).toArray();
  const companyIds = [...new Set(jobs.map((job) => job.companyId?.toHexString()).filter(Boolean))].map((value) => new ObjectId(value));
  const contactIds = [...new Set(jobs.flatMap((job) => [job.buyerId?.toHexString(), job.engineerId?.toHexString()]).filter(Boolean))].map((value) => new ObjectId(value));
  const companies = await database.collection('companies').find({ _id: { $in: companyIds } }).toArray();
  const contacts = await database.collection('contacts').find({ _id: { $in: contactIds } }).toArray();
  const companyById = new Map(companies.map((company) => [company._id.toHexString(), publicRecord(company)]));
  const contactById = new Map(contacts.map((contact) => [contact._id.toHexString(), publicRecord(contact)]));
  return jobs.map((job) => ({ ...publicRecord(job), company: companyById.get(job.companyId.toHexString()), buyer: job.buyerId ? contactById.get(job.buyerId.toHexString()) : null, engineer: job.engineerId ? contactById.get(job.engineerId.toHexString()) : null }));
}

export async function OPTIONS(request: NextRequest) {
  return options(request);
}

export async function GET(request: NextRequest, context: RouteContext) {
  const segments = await context.params.then((params) => params.segments);
  if (segments[0] === 'health') return json(request, { status: 'ok' });

  const session = await requireSession(request);
  if (!session) return error(request, 'Authentication is required.', 401);
  const database = await db();

  if (segments[0] === 'profile') {
    return json(request, { id: session.userId, name: session.name, email: session.email });
  }

  if (segments[0] === 'dashboard') {
    const [companyCount, contactCount, jobCount, recentJobs, recentDocuments] = await Promise.all([
      database.collection('companies').countDocuments(),
      database.collection('contacts').countDocuments(),
      database.collection('jobs').countDocuments(),
      database.collection('jobs').find().sort({ createdAt: -1 }).limit(7).toArray(),
      database.collection('systemDocuments').find().sort({ createdAt: -1 }).limit(7).toArray(),
    ]);
    return json(request, { counts: { companies: companyCount, contacts: contactCount, jobs: jobCount }, recentJobs: (await resolvedJobs()).filter((job) => recentJobs.some((recent) => recent._id.equals(id(String(job.id))!))), recentDocuments: recentDocuments.map(publicRecord) });
  }

  if (segments[0] === 'companies') {
    if (segments.length === 1) return json(request, (await database.collection('companies').find().sort({ createdAt: -1 }).toArray()).map(publicRecord));
    const companyId = id(segments[1]);
    if (!companyId) return error(request, 'Invalid company id.', 400);
    const company = await database.collection('companies').findOne({ _id: companyId });
    if (!company) return error(request, 'Company not found.', 404);
    if (segments[2] === 'contacts') return json(request, (await database.collection('contacts').find({ companyId }).sort({ name: 1 }).toArray()).map(publicRecord));
    return json(request, publicRecord(company));
  }

  if (segments[0] === 'contacts') return json(request, (await database.collection('contacts').find().sort({ createdAt: -1 }).toArray()).map(publicRecord));

  if (segments[0] === 'jobs') {
    const jobs = await resolvedJobs();
    if (segments.length === 1) return json(request, jobs);
    const job = jobs.find((item) => item.id === segments[1]);
    if (!job) return error(request, 'Job not found.', 404);
    if (segments[2] === 'audit') return json(request, (await database.collection('auditEvents').find({ jobId: id(segments[1])! }).sort({ createdAt: -1 }).toArray()).map(publicRecord));
    if (segments[2] === 'documents') return json(request, { system: (await database.collection('systemDocuments').find({ jobId: id(segments[1])! }).toArray()).map(publicRecord), supporting: (await database.collection('supportingDocuments').find({ jobId: id(segments[1])! }).toArray()).map(publicRecord) });
    return json(request, job);
  }

  if (segments[0] === 'templates') return json(request, (await database.collection('documentTemplates').find().sort({ uploadedAt: -1 }).toArray()).map(publicRecord));
  return error(request, 'Route not found.', 404);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const segments = await context.params.then((params) => params.segments);

  const session = await requireSession(request);
  if (!session) return error(request, 'Authentication is required.', 401);
  const database = await db();

  if (segments[0] === 'uploads') {
    const form = await request.formData();
    const file = form.get('file');
    const kind = form.get('kind');
    if (!(file instanceof File)) return error(request, 'A file is required.');
    if (kind === 'template' && !file.name.toLowerCase().endsWith('.docx')) return error(request, 'Only .docx templates are accepted.');
    const key = `${kind === 'template' ? 'templates' : 'jobs'}/${new ObjectId().toHexString()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    return json(request, { key, url: await uploadFile(key, file), originalFilename: file.name }, { status: 201 });
  }

  if (segments[0] === 'companies') {
    const body = validJson(companyInput, await request.json());
    if (!body) return error(request, 'Invalid company data.');
    const result = await database.collection('companies').insertOne({ ...body, createdAt: new Date(), updatedAt: new Date() });
    await recordAudit(database, session, { entityType: 'company', entityId: result.insertedId.toHexString(), action: 'Company created' });
    return json(request, publicRecord(await database.collection('companies').findOne({ _id: result.insertedId })), { status: 201 });
  }

  if (segments[0] === 'contacts') {
    const body = validJson(contactInput, await request.json());
    const companyId = body ? id(body.companyId) : null;
    if (!body || !companyId) return error(request, 'Invalid contact data.');
    const result = await database.collection('contacts').insertOne({ ...body, companyId, createdAt: new Date(), updatedAt: new Date() });
    await recordAudit(database, session, { entityType: 'contact', entityId: result.insertedId.toHexString(), action: 'Contact created' });
    return json(request, publicRecord(await database.collection('contacts').findOne({ _id: result.insertedId })), { status: 201 });
  }

  if (segments[0] === 'jobs') {
    const body = validJson(jobInput, await request.json());
    const companyId = body ? id(body.companyId) : null;
    if (!body || !companyId) return error(request, 'Invalid job data.');
    const buyerId = body.buyerId ? id(body.buyerId) : undefined;
    const engineerId = body.engineerId ? id(body.engineerId) : undefined;
    if ((body.buyerId && !buyerId) || (body.engineerId && !engineerId)) return error(request, 'Invalid contact id.');
    const result = await database.collection('jobs').insertOne({ ...body, companyId, buyerId, engineerId, jobDate: body.jobDate ? new Date(body.jobDate) : new Date(), createdAt: new Date(), updatedAt: new Date() });
    await recordAudit(database, session, { entityType: 'job', entityId: result.insertedId.toHexString(), jobId: result.insertedId.toHexString(), action: 'Job created' });
    return json(request, (await resolvedJobs()).find((job) => job.id === result.insertedId.toHexString()), { status: 201 });
  }

  if (segments[0] === 'templates') {
    const body = validJson(templateInput, await request.json());
    if (!body) return error(request, 'Invalid template data.');
    await database.collection('documentTemplates').deleteOne({ documentType: body.documentType });
    const result = await database.collection('documentTemplates').insertOne({ ...body, uploadedAt: new Date() });
    await recordAudit(database, session, { entityType: 'template', entityId: result.insertedId.toHexString(), action: `${body.documentType} template uploaded` });
    return json(request, publicRecord(await database.collection('documentTemplates').findOne({ _id: result.insertedId })), { status: 201 });
  }
  return error(request, 'Route not found.', 404);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const segments = await context.params.then((params) => params.segments);
  const session = await requireSession(request);
  if (!session) return error(request, 'Authentication is required.', 401);
  const database = await db();

  if (segments[0] === 'profile') {
    return error(request, 'Update account details through Better Auth.', 405);
  }

  const resourceId = id(segments[1]);
  if (!resourceId) return error(request, 'Invalid record id.', 400);

  if (segments[0] === 'companies') {
    const body = validJson(companyInput.partial(), await request.json());
    if (!body || Object.keys(body).length === 0) return error(request, 'Invalid company data.');
    await database.collection('companies').updateOne({ _id: resourceId }, { $set: { ...body, updatedAt: new Date() } });
    await recordAudit(database, session, { entityType: 'company', entityId: resourceId.toHexString(), action: 'Company updated' });
    return json(request, publicRecord(await database.collection('companies').findOne({ _id: resourceId })));
  }

  if (segments[0] === 'contacts') {
    const body = validJson(contactInput.partial(), await request.json());
    if (!body || Object.keys(body).length === 0) return error(request, 'Invalid contact data.');
    const companyId = body.companyId ? id(body.companyId) : undefined;
    if (body.companyId && !companyId) return error(request, 'Invalid company id.');
    await database.collection('contacts').updateOne({ _id: resourceId }, { $set: { ...body, companyId, updatedAt: new Date() } });
    await recordAudit(database, session, { entityType: 'contact', entityId: resourceId.toHexString(), action: 'Contact updated' });
    return json(request, publicRecord(await database.collection('contacts').findOne({ _id: resourceId })));
  }

  if (segments[0] === 'jobs') {
    const body = validJson(jobInput.partial(), await request.json());
    if (!body || Object.keys(body).length === 0) return error(request, 'Invalid job data.');
    const companyId = body.companyId ? id(body.companyId) : undefined;
    const buyerId = body.buyerId ? id(body.buyerId) : undefined;
    const engineerId = body.engineerId ? id(body.engineerId) : undefined;
    if ((body.companyId && !companyId) || (body.buyerId && !buyerId) || (body.engineerId && !engineerId)) return error(request, 'Invalid related record id.');
    await database.collection('jobs').updateOne({ _id: resourceId }, { $set: { ...body, companyId, buyerId, engineerId, jobDate: body.jobDate ? new Date(body.jobDate) : undefined, updatedAt: new Date() } });
    await recordAudit(database, session, { entityType: 'job', entityId: resourceId.toHexString(), jobId: resourceId.toHexString(), action: 'Job updated' });
    return json(request, (await resolvedJobs()).find((job) => job.id === resourceId.toHexString()));
  }
  return error(request, 'Route not found.', 404);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const segments = await context.params.then((params) => params.segments);
  const session = await requireSession(request);
  if (!session) return error(request, 'Authentication is required.', 401);
  const database = await db();
  const resourceId = id(segments[1]);
  if (!resourceId) return error(request, 'Invalid record id.', 400);
  const collection = segments[0] === 'companies' ? 'companies' : segments[0] === 'contacts' ? 'contacts' : segments[0] === 'jobs' ? 'jobs' : segments[0] === 'templates' ? 'documentTemplates' : null;
  if (!collection) return error(request, 'Route not found.', 404);
  const result = await database.collection(collection).deleteOne({ _id: resourceId });
  if (!result.deletedCount) return error(request, 'Record not found.', 404);
  await recordAudit(database, session, { entityType: collection === 'documentTemplates' ? 'template' : segments[0].slice(0, -1) as 'company' | 'contact' | 'job', entityId: resourceId.toHexString(), jobId: segments[0] === 'jobs' ? resourceId.toHexString() : undefined, action: `${segments[0].slice(0, -1)} deleted` });
  return json(request, { deleted: true });
}

import { Db, ObjectId } from 'mongodb';
import { Session } from './auth';

export async function recordAudit(db: Db, session: Session, input: { entityType: 'company' | 'contact' | 'job' | 'template' | 'document'; entityId: string; jobId?: string; action: string }) {
  await db.collection('auditEvents').insertOne({
    entityType: input.entityType,
    entityId: new ObjectId(input.entityId),
    jobId: input.jobId ? new ObjectId(input.jobId) : undefined,
    action: input.action,
    // Better Auth uses string user IDs, so audit entries retain that value as-is.
    actorId: session.userId,
    actorName: session.name,
    createdAt: new Date(),
  });
}

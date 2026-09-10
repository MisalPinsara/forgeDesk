const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

type ApiError = { error?: string };

export type CompanyInput = { name: string; address: string; mobile?: string; email?: string };
export type ContactInput = { name: string; type: 'Engineer' | 'Buyer'; companyId: string; mobileNumber?: string; email: string };
export type JobInput = { name: string; description?: string; companyId: string; buyerId?: string; engineerId?: string; jobDate?: string; price: number };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...init.headers },
  });
  const body = await response.json().catch(() => ({})) as ApiError & T;
  if (!response.ok) throw new Error(body.error || 'The request could not be completed.');
  return body as T;
}

export const api = {
  profile: () => request<{ id: string; name: string; email: string }>('/profile'),
  dashboard: () => request('/dashboard'),
  companies: () => request('/companies'),
  company: (id: string) => request(`/companies/${id}`),
  createCompany: (input: CompanyInput) => request('/companies', { method: 'POST', body: JSON.stringify(input) }),
  updateCompany: (id: string, input: Partial<CompanyInput>) => request(`/companies/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  deleteCompany: (id: string) => request(`/companies/${id}`, { method: 'DELETE' }),
  contacts: () => request('/contacts'),
  createContact: (input: ContactInput) => request('/contacts', { method: 'POST', body: JSON.stringify(input) }),
  updateContact: (id: string, input: Partial<ContactInput>) => request(`/contacts/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  jobs: () => request('/jobs'),
  job: (id: string) => request(`/jobs/${id}`),
  createJob: (input: JobInput) => request('/jobs', { method: 'POST', body: JSON.stringify(input) }),
  updateJob: (id: string, input: Partial<JobInput>) => request(`/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  deleteJob: (id: string) => request(`/jobs/${id}`, { method: 'DELETE' }),
  jobAudit: (id: string) => request(`/jobs/${id}/audit`),
  templates: () => request('/templates'),
  async uploadTemplate(file: File, documentType: 'Quotation' | 'Invoice' | 'Delivery Note') {
    const form = new FormData();
    form.set('file', file);
    form.set('kind', 'template');
    const uploaded = await request<{ url: string; originalFilename: string }>('/uploads', { method: 'POST', body: form });
    return request('/templates', { method: 'POST', body: JSON.stringify({ documentType, file: uploaded.url, originalFilename: uploaded.originalFilename }) });
  },
};

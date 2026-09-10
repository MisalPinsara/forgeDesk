import { Modal, Select } from './Ui';

type Job = {
  name: string;
  description: string;
  company: string;
  price: string;
  buyer: string;
  engineer: string;
  date: string;
};

export function JobFormModal({ job, onClose }: { job?: Job; onClose: () => void }) {
  const isEditing = Boolean(job);
  return <Modal title={isEditing ? 'Update job' : 'Create job'} description={isEditing ? 'Update this workshop job record.' : 'Add a job and associate it with an existing company and contacts.'} onClose={onClose}><form className="mt-6" onSubmit={(event) => { event.preventDefault(); onClose(); }}><div className="grid gap-5 md:grid-cols-2"><div className="md:col-span-2"><label className="label" htmlFor="job-name">Job name *</label><input id="job-name" className="field" defaultValue={job?.name} required /></div><div className="md:col-span-2"><label className="label" htmlFor="job-description">Description</label><textarea id="job-description" className="field h-28 py-3" defaultValue={job?.description} /></div><div><label className="label" htmlFor="job-company">Company *</label><Select id="job-company" defaultValue={job?.company} options={['Select a company', 'Apex Precision Eng.', 'Vanguard Marine Ltd.']} /></div><div><label className="label" htmlFor="job-price">Price *</label><input id="job-price" className="field" defaultValue={job?.price} min="0" step="0.01" required type="number" /></div><div><label className="label" htmlFor="job-buyer">Buyer</label><Select id="job-buyer" defaultValue={job?.buyer} options={['No buyer', 'David Miller']} /></div><div><label className="label" htmlFor="job-engineer">Engineer</label><Select id="job-engineer" defaultValue={job?.engineer} options={['No engineer', 'Marcus Chen']} /></div><div><label className="label" htmlFor="job-date">Job date</label><input id="job-date" className="field bg-surface-subtle text-muted" readOnly value={job?.date ?? '18 May 2026'} /></div></div><div className="mt-6 flex justify-end gap-3"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{isEditing ? 'Update job' : 'Create job'}</button></div></form></Modal>;
}

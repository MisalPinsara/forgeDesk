import { Modal } from './Ui';

type Company = {
  name: string;
  address: string;
  mobile: string;
  email: string;
};

export function CompanyFormModal({ company, onClose }: { company?: Company; onClose: () => void }) {
  const isEditing = Boolean(company);
  return <Modal title={isEditing ? 'Update company' : 'Create company'} description={isEditing ? 'Update this client company record.' : 'Add a client company to the directory.'} onClose={onClose}><form className="mt-6" onSubmit={(event) => { event.preventDefault(); onClose(); }}><div className="grid gap-5 md:grid-cols-2"><div><label className="label" htmlFor="company-name">Company name *</label><input id="company-name" className="field" defaultValue={company?.name} required /></div><div><label className="label" htmlFor="company-address">Address *</label><input id="company-address" className="field" defaultValue={company?.address} required /></div><div><label className="label" htmlFor="company-mobile">Mobile no.</label><input id="company-mobile" className="field" defaultValue={company?.mobile} type="tel" /></div><div><label className="label" htmlFor="company-email">Company email</label><input id="company-email" className="field" defaultValue={company?.email} type="email" /></div></div><div className="mt-6 flex justify-end gap-3"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{isEditing ? 'Update company' : 'Create company'}</button></div></form></Modal>;
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CompanyFormModal } from '../components/CompanyFormModal';
import { Card, Icon, PageHeader, Select } from '../components/Ui';

const companies = [['Apex Precision Eng.', 'Unit 4, Riverside Industrial Estate', '14 May 2026'], ['Vanguard Marine Ltd.', 'Harbour Road, Southampton', '10 May 2026'], ['Solent Machining Co.', 'Mill Lane, Portsmouth', '08 May 2026']];

export default function CompaniesList() {
  const [isCreating, setIsCreating] = useState(false);
  return <div className="space-y-6"><PageHeader title="Companies" description="Manage client company records and their contacts." action={<button className="primary-button" type="button" onClick={() => setIsCreating(true)}><Icon>add</Icon>New company</button>} />
    {isCreating && <CompanyFormModal onClose={() => setIsCreating(false)} />}
    <div className="grid gap-3 md:grid-cols-[1fr_220px]"><input className="field" placeholder="Search companies by name" /><Select options={['Newest first', 'Oldest first', 'Name A-Z', 'Name Z-A']} /></div><Card className="overflow-hidden p-0"><div className="divide-y divide-outline/60">{companies.map(([name, address, date]) => <Link key={name} to="/companies/1" className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-surface-subtle"><div><p className="font-semibold text-ink">{name}</p><p className="mt-1 text-sm text-muted">{address}</p></div><div className="flex items-center gap-4 text-sm text-muted"><time className="hidden sm:block">Created {date}</time><Icon className="text-primary">chevron_right</Icon></div></Link>)}</div><div className="flex items-center justify-between border-t border-outline/60 px-6 py-4 text-sm text-muted"><span>Showing 3 companies</span><div className="flex gap-2"><button className="secondary-button h-8 px-3">Previous</button><button className="secondary-button h-8 px-3">Next</button></div></div></Card></div>;
}

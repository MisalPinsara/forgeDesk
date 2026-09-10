import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobFormModal } from '../components/JobFormModal';
import { Card, Icon, PageHeader, Select } from '../components/Ui';

const jobs = [['Turbine housing CNC re-bore', 'Apex Precision Eng.', '18 May 2026', '$4,850.00'], ['Flange assembly batch B-12', 'Vanguard Marine Ltd.', '17 May 2026', '$12,400.00'], ['Hydraulic ram seals replacement', 'Apex Precision Eng.', '17 May 2026', '$1,920.00']];

export default function JobsList() {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  return <div className="space-y-6"><PageHeader title="Jobs" description="Create, find, and manage workshop jobs." action={<button className="primary-button" type="button" onClick={() => setIsCreating(true)}><Icon>add</Icon>New job</button>} />
    {isCreating && <JobFormModal onClose={() => setIsCreating(false)} />}
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"><input className="field xl:col-span-2" placeholder="Search jobs, companies, contacts, or document references" /><Select options={['All companies', 'Apex Precision Eng.']} /><Select options={['All contacts', 'All buyers', 'All engineers']} /><Select options={['Newest first', 'Oldest first', 'Job name A-Z', 'Price high to low']} /></div><Card className="overflow-hidden p-0"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-outline/70 bg-surface-subtle text-muted"><tr><th className="px-6 py-3 font-semibold">Job</th><th className="px-6 py-3 font-semibold">Company</th><th className="px-6 py-3 font-semibold">Date</th><th className="px-6 py-3 text-right font-semibold">Price</th></tr></thead><tbody className="divide-y divide-outline/60">{jobs.map(([name, company, date, price]) => <tr key={name} className="cursor-pointer transition hover:bg-surface-subtle focus:bg-surface-subtle" role="link" tabIndex={0} onClick={() => navigate('/jobs/1')} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate('/jobs/1'); }}><td className="px-6 py-4 font-semibold text-ink">{name}</td><td className="px-6 py-4 text-muted">{company}</td><td className="px-6 py-4 text-muted">{date}</td><td className="px-6 py-4 text-right font-medium">{price}</td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-outline/60 px-6 py-4 text-sm text-muted"><span>Showing 3 jobs</span><div className="flex gap-2"><button className="secondary-button h-8 px-3" type="button">Previous</button><button className="secondary-button h-8 px-3" type="button">Next</button></div></div></Card></div>;
}

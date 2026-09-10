import { useState } from 'react';
import { Card, Icon, PageHeader, Select } from '../components/Ui';
import { api } from '../lib/api';

const templates = [['Quotation', 'quotation-template.docx', '16 May 2026'], ['Invoice', 'invoice-template.docx', '12 May 2026'], ['Delivery Note', 'delivery-note-template.docx', '10 May 2026']];

export default function DocumentTemplates() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [documentType, setDocumentType] = useState<'Quotation' | 'Invoice' | 'Delivery Note'>('Quotation');
  const [isUploading, setIsUploading] = useState(false);
  const selectFile = (file?: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.docx')) {
      setSelectedFile(null);
      setError('Only .docx files are accepted.');
      return;
    }
    setSelectedFile(file);
    setError('');
  };

  return <div className="space-y-6"><PageHeader title="Document templates" description="Upload one active Word template for each document type." /><div className="grid gap-6 lg:grid-cols-[1fr_360px]"><Card className="overflow-hidden p-0"><div className="border-b border-outline/70 px-6 py-4"><h2 className="text-lg font-semibold">Active templates</h2></div><div className="divide-y divide-outline/60">{templates.map(([type, file, date]) => <div key={type} className="flex items-center justify-between gap-4 px-6 py-4"><div><p className="font-semibold text-ink">{type}</p><p className="mt-0.5 text-sm text-muted">{file} · Uploaded {date}</p></div><button className="icon-button text-danger" type="button" aria-label={`Delete ${type} template`}><Icon>delete</Icon></button></div>)}</div></Card><Card><h2 className="text-lg font-semibold">Upload template</h2><p className="mt-1 text-sm text-muted">Only one active Word template is stored for each document type.</p><form className="mt-5 space-y-4" onSubmit={async (event) => { event.preventDefault(); if (!selectedFile) { setError('Choose a .docx file before uploading.'); return; } setIsUploading(true); setError(''); try { await api.uploadTemplate(selectedFile, documentType); setSelectedFile(null); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to upload the template.'); } finally { setIsUploading(false); } }}><div><label className="label" htmlFor="type">Document type</label><Select id="type" options={['Quotation', 'Invoice', 'Delivery Note']} onChange={(value) => setDocumentType(value as 'Quotation' | 'Invoice' | 'Delivery Note')} /></div><div><span className="label">Word template</span><label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline bg-surface-subtle/40 px-5 text-center transition hover:border-primary-container hover:bg-surface-subtle" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]); }}><Icon className="text-[28px] text-muted">cloud_upload</Icon><p className="mt-3 text-sm font-semibold text-ink">{selectedFile ? selectedFile.name : 'Choose a file or drag & drop it here'}</p><p className="mt-1 text-xs text-muted">Only .docx Word templates are accepted</p><span className="secondary-button mt-4 h-9 px-3">Browse file</span><input className="hidden" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" type="file" onChange={(event) => selectFile(event.target.files?.[0])} /></label>{error && <p className="mt-2 text-sm text-danger" role="alert">{error}</p>}</div><button className="primary-button w-full" disabled={isUploading} type="submit"><Icon>upload</Icon>{isUploading ? 'Uploading…' : 'Upload template'}</button></form></Card></div></div>;
}

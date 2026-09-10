import { useEffect, useRef, useState, type ReactNode } from 'react';

export function Icon({ children, className = '' }: { children: string; className?: string }) {
  return <span className={`material-symbols-outlined text-[20px] leading-none ${className}`}>{children}</span>;
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>{description && <p className="mt-1 text-sm text-muted">{description}</p>}</div>{action}</div>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function Modal({ title, description, onClose, children }: { title: string; description?: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 !mt-0 flex items-center justify-center bg-ink/30 p-4 md:left-64" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-xl border border-outline bg-surface p-6 shadow-xl"><div className="flex items-start justify-between gap-4"><div><h2 id="modal-title" className="text-xl font-semibold text-ink">{title}</h2>{description && <p className="mt-1 text-sm text-muted">{description}</p>}</div><button className="icon-button" type="button" aria-label={`Close ${title} form`} onClick={onClose}><Icon>close</Icon></button></div>{children}</section></div>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-lg border border-dashed border-outline bg-surface-subtle/60 p-6 text-center"><p className="font-semibold text-ink">{title}</p><p className="mt-1 text-sm text-muted">{description}</p></div>;
}

type SelectOption = { label: string; value: string };

export function Select({ id, options, defaultValue, className = '', ariaLabel, onChange }: { id?: string; options: Array<string | SelectOption>; defaultValue?: string; className?: string; ariaLabel?: string; onChange?: (value: string) => void }) {
  const normalizedOptions = options.map((option) => typeof option === 'string' ? { label: option, value: option } : option);
  const [selected, setSelected] = useState(defaultValue ?? normalizedOptions[0]?.value ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const dropdown = useRef<HTMLDivElement>(null);
  const selectedOption = normalizedOptions.find((option) => option.value === selected) ?? normalizedOptions[0];

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => { if (!dropdown.current?.contains(event.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  return <div ref={dropdown} className={`relative ${className}`}><button id={id} type="button" className="field flex items-center justify-between text-left" aria-label={ariaLabel} aria-expanded={isOpen} aria-haspopup="listbox" onClick={() => setIsOpen((open) => !open)}><span className="truncate">{selectedOption?.label}</span><Icon className={`ml-6 shrink-0 text-[18px] text-ink transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</Icon></button>{isOpen && <div role="listbox" className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-outline bg-surface py-1 shadow-lg">{normalizedOptions.map((option) => <button key={option.value} type="button" role="option" aria-selected={selected === option.value} className={`w-full px-3 py-2 text-left text-sm ${selected === option.value ? 'bg-surface-muted font-semibold text-primary' : 'text-ink hover:bg-surface-subtle'}`} onClick={() => { setSelected(option.value); onChange?.(option.value); setIsOpen(false); }}>{option.label}</button>)}</div>}</div>;
}

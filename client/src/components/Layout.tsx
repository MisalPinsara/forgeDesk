import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() { return <div className="min-h-screen bg-background text-ink"><Sidebar /><main className="mx-auto min-h-screen max-w-7xl px-5 py-8 md:ml-64 md:px-8"><Outlet /></main></div>; }

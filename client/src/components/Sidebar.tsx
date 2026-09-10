import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Icon } from './Ui';
import { authClient } from '../lib/auth-client';

const navItems = [['/dashboard', 'Dashboard', 'dashboard'], ['/jobs', 'Jobs', 'construction'], ['/documents', 'Templates', 'description'], ['/companies', 'Companies', 'business'], ['/engineers-buyers', 'Engineers & Buyers', 'group'], ['/profile', 'Profile', 'account_circle']] as const;

export function Sidebar() {
  const navigate = useNavigate();
  async function signOut() {
    await authClient.signOut();
    navigate('/', { replace: true });
  }
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between bg-sidebar p-4 md:flex"><div><Link to="/dashboard" className="mb-8 flex items-center gap-3 px-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-danger text-on-primary"><Icon>precision_manufacturing</Icon></span><span><span className="block text-lg font-bold text-sidebar-text">WJDMS</span><span className="block text-xs text-sidebar-text/60">Workshop management</span></span></Link><nav className="space-y-1">{navItems.map(([path, label, icon]) => <NavLink key={path} to={path} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? 'bg-primary-container font-semibold text-on-primary' : 'text-sidebar-text/70 hover:bg-white/5 hover:text-sidebar-text'}`}><Icon>{icon}</Icon>{label}</NavLink>)}</nav></div><button type="button" onClick={signOut} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-sidebar-text/70 transition hover:bg-white/5 hover:text-sidebar-text"><Icon>logout</Icon>Log out</button></aside>;
}

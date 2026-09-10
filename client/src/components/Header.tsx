import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Icon } from './Ui';
import { authClient } from '../lib/auth-client';

const mobileItems = [['/dashboard', 'Dashboard'], ['/jobs', 'Jobs'], ['/documents', 'Templates'], ['/companies', 'Companies'], ['/engineers-buyers', 'Engineers & Buyers'], ['/profile', 'Profile']] as const;

export function Header() {
  const navigate = useNavigate();
  async function signOut() {
    await authClient.signOut();
    navigate('/', { replace: true });
  }
  return <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-outline/60 bg-surface/90 px-5 backdrop-blur md:justify-end md:px-8">
    <details className="relative md:hidden"><summary className="icon-button list-none" aria-label="Open navigation"><Icon>menu</Icon></summary><nav className="absolute left-0 top-11 w-56 rounded-xl border border-outline/70 bg-surface p-2 shadow-card">{mobileItems.map(([path, label]) => <NavLink key={path} to={path} className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-surface-muted font-semibold text-primary' : 'text-ink hover:bg-surface-subtle'}`}>{label}</NavLink>)}<button type="button" onClick={signOut} className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-surface-subtle">Log out</button></nav></details>
    <Link to="/profile" className="icon-button" aria-label="Open profile"><Icon>account_circle</Icon></Link>
  </header>;
}

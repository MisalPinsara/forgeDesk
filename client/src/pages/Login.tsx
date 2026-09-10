import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Ui';
import { authClient } from '../lib/auth-client';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setIsSubmitting(true);
    setError('');
    try {
      const result = await authClient.signIn.email({
        email: String(values.get('email')),
        password: String(values.get('password')),
      });
      if (result.error) throw new Error(result.error.message || 'Unable to sign in.');
      navigate('/dashboard');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-background p-6"><div className="w-full max-w-md"><div className="mb-8 text-center"><div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger text-on-primary shadow-card"><Icon className="text-[28px]">precision_manufacturing</Icon></div><h1 className="text-3xl font-bold text-ink">WJDMS</h1><p className="mt-1 text-sm text-muted">Workshop Job & Document Management System</p></div><section className="card"><h2 className="text-xl font-semibold text-ink">Sign in</h2><p className="mt-1 text-sm text-muted">Enter your account details to continue.</p><form className="mt-6 space-y-4" onSubmit={submit}><div><label className="label" htmlFor="email">Email</label><input className="field" id="email" name="email" autoComplete="username" placeholder="name@company.com" required type="email" /></div><div><label className="label" htmlFor="password">Password</label><input className="field" id="password" name="password" autoComplete="current-password" placeholder="Enter your password" required type="password" /></div>{error && <p className="text-sm text-danger" role="alert">{error}</p>}<button className="primary-button mt-2 w-full" disabled={isSubmitting} type="submit">{isSubmitting ? 'Signing in…' : <>Sign in <Icon>arrow_forward</Icon></>}</button></form></section></div></main>;
}

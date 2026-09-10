import { useState, type FormEvent } from 'react';
import { Card, Modal, PageHeader } from '../components/Ui';
import { authClient } from '../lib/auth-client';

export default function Profile() {
  const { data: session, refetch } = authClient.useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const profile = { name: session?.user.name || 'Workshop user', email: session?.user.email || '' };

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get('name')).trim();
    const result = await authClient.updateUser({ name });
    if (result.error) return setError(result.error.message || 'Unable to update your profile.');
    await refetch();
    setError('');
    setIsEditing(false);
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const currentPassword = String(values.get('currentPassword'));
    const newPassword = String(values.get('newPassword'));
    if (newPassword !== String(values.get('confirmPassword'))) return setError('The new passwords do not match.');
    const result = await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
    if (result.error) return setError(result.error.message || 'Unable to change your password.');
    setError('');
    setIsChangingPassword(false);
  }

  return <div className="space-y-6"><PageHeader title="Profile" description="Your account information." />
    {isEditing && <Modal title="Edit profile" description="Update your display name." onClose={() => { setIsEditing(false); setError(''); }}><form className="mt-6 space-y-5" onSubmit={updateProfile}><div><label className="label" htmlFor="profile-name">Name</label><input id="profile-name" name="name" className="field" defaultValue={profile.name} required /></div><div><label className="label" htmlFor="profile-email">Email</label><input id="profile-email" className="field bg-surface-subtle" defaultValue={profile.email} readOnly type="email" /><p className="mt-2 text-xs text-muted">Email changes require a verified email workflow.</p></div>{error && <p className="text-sm text-danger" role="alert">{error}</p>}<div className="flex justify-end gap-3"><button className="secondary-button" type="button" onClick={() => setIsEditing(false)}>Cancel</button><button className="primary-button" type="submit">Save changes</button></div></form></Modal>}
    {isChangingPassword && <Modal title="Change password" description="Enter your current password to set a new one." onClose={() => { setIsChangingPassword(false); setError(''); }}><form className="mt-6 space-y-5" onSubmit={changePassword}><div><label className="label" htmlFor="current-password">Current password</label><input id="current-password" name="currentPassword" className="field" required type="password" /></div><div><label className="label" htmlFor="new-password">New password</label><input id="new-password" name="newPassword" className="field" minLength={12} required type="password" /></div><div><label className="label" htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" name="confirmPassword" className="field" minLength={12} required type="password" /></div>{error && <p className="text-sm text-danger" role="alert">{error}</p>}<div className="flex justify-end gap-3"><button className="secondary-button" type="button" onClick={() => setIsChangingPassword(false)}>Cancel</button><button className="primary-button" type="submit">Update password</button></div></form></Modal>}
    <Card><div><h2 className="text-3xl font-bold tracking-tight text-ink">{profile.name}</h2><p className="mt-1 text-muted">Workshop user</p><div className="mt-5 flex flex-wrap gap-3"><button className="primary-button" type="button" onClick={() => setIsEditing(true)}>Edit profile</button><button className="secondary-button" type="button" onClick={() => setIsChangingPassword(true)}>Change password</button></div></div><dl className="mt-10 grid gap-7 border-t border-outline/70 pt-10 sm:grid-cols-2"><div><dt className="text-sm text-muted">Name</dt><dd className="mt-2 font-medium text-ink">{profile.name}</dd></div><div><dt className="text-sm text-muted">Email</dt><dd className="mt-2 font-medium text-ink">{profile.email}</dd></div></dl></Card></div>;
}

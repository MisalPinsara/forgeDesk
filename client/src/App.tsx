import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JobsList from './pages/JobsList';
import JobDetails from './pages/JobDetails';
import DocumentTemplates from './pages/DocumentTemplates';
import CompaniesList from './pages/CompaniesList';
import CompanyDetails from './pages/CompanyDetails';
import EngineersBuyers from './pages/EngineersBuyers';
import Profile from './pages/Profile';
import { authClient } from './lib/auth-client';

function ProtectedLayout() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <main className="flex min-h-screen items-center justify-center bg-background text-sm text-muted">Loading your workspace…</main>;
  if (!session) return <Navigate to="/" replace />;
  return <Layout />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/documents" element={<DocumentTemplates />} />
          <Route path="/companies" element={<CompaniesList />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />
          <Route path="/engineers-buyers" element={<EngineersBuyers />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

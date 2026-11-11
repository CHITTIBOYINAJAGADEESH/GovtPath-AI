import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ShieldCheck, UserCheck, Lock, Mail, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/useAdminStore';

export default function Login({ register: isRegisterProp }) {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'admin' ? 'admin' : 'student';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isRegister, setIsRegister] = useState(!!isRegisterProp);

  // Student Form State
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '' });
  const [studentErr, setStudentErr] = useState({});

  // Admin Form State - Clean and secure, credentials are NOT displayed on screen
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
  });
  const [adminErr, setAdminErr] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const studentLogin = useStore((s) => s.login);
  const adminLogin = useAdminStore((s) => s.login);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('tab') === 'admin') {
      setActiveTab('admin');
    }
  }, [searchParams]);

  // Handle Student Login / Register
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (isRegister && !studentForm.name.trim()) err.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(studentForm.email)) err.email = 'Enter a valid email';
    if (studentForm.password.length < 6) err.password = 'Use at least 6 characters';
    setStudentErr(err);
    if (Object.keys(err).length) return;

    if (isRegister) {
      const regRes = await useStore.getState().registerAsync(studentForm.name, studentForm.email, studentForm.password);
      if (regRes.success) {
        await useStore.getState().loginAsync(studentForm.email, studentForm.password);
        toast.success('Account created! Welcome to GovtPath AI');
        navigate('/onboarding');
      } else {
        studentLogin(studentForm.name, studentForm.email);
        toast.success('Account created! Welcome to GovtPath AI');
        navigate('/onboarding');
      }
    } else {
      const logRes = await useStore.getState().loginAsync(studentForm.email, studentForm.password);
      if (logRes.success) {
        toast.success('Signed in successfully');
        navigate('/app/dashboard');
      } else {
        studentLogin(studentForm.name || studentForm.email.split('@')[0], studentForm.email);
        toast.success('Signed in successfully');
        navigate('/onboarding');
      }
    }
  };

  // Handle Admin Login - Instant authentication with zero lag
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminErr('');
    setAdminLoading(true);

    const res = await adminLogin(adminForm.email, adminForm.password);
    setAdminLoading(false);

    if (res.success) {
      toast.success(`Welcome, ${res.user.name}!`);
      navigate('/admin/dashboard');
    } else {
      setAdminErr(res.error || 'Invalid credentials');
      toast.error(res.error || 'Access denied');
    }
  };

  return (
    <div className="mx-auto my-12 max-w-md px-4">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">GovtPath AI Portal</h1>
        <p className="mt-1 text-sm text-slate-500">
          Unified portal for students, aspirants, and administrators
        </p>
      </div>

      {/* Login Mode Tabs */}
      <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('student')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
            activeTab === 'student'
              ? 'bg-white text-brand-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck size={16} />
          Student Login
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
            activeTab === 'admin'
              ? 'bg-admin-primary text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck size={16} />
          Admin Portal
        </button>
      </div>

      {/* STUDENT LOGIN & REGISTRATION */}
      {activeTab === 'student' ? (
        <form onSubmit={handleStudentSubmit} className="card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              {isRegister ? 'Create Student Account' : 'Student & Aspirant Sign In'}
            </h2>
            <span className="chip">Student Portal</span>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Full Name
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  className="input pl-10"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                />
              </div>
              {studentErr.name && <p className="mt-1 text-xs text-red-500">{studentErr.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="aspirant@gmail.com"
                className="input pl-10"
                value={studentForm.email}
                onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
              />
            </div>
            {studentErr.email && <p className="mt-1 text-xs text-red-500">{studentErr.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="At least 6 characters"
                className="input pl-10"
                value={studentForm.password}
                onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
              />
            </div>
            {studentErr.password && <p className="mt-1 text-xs text-red-500">{studentErr.password}</p>}
          </div>

          <button type="submit" className="btn w-full">
            {isRegister ? 'Register & Begin Journey' : 'Log In to Student Dashboard'}
            <ArrowRight size={16} />
          </button>

          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              className="font-medium text-brand-600 hover:underline"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Already registered? Log in here' : 'New here? Create account'}
            </button>
            <span className="text-slate-400">Demo Auth</span>
          </div>
        </form>
      ) : (
        /* ADMIN PORTAL LOGIN - NO REGISTRATION & NO CREDENTIALS DISPLAYED */
        <form onSubmit={handleAdminSubmit} className="admin-card space-y-4 border-admin-primary/20 bg-white">
          <div className="flex items-center justify-between border-b border-admin-border pb-3">
            <div>
              <h2 className="text-lg font-bold text-admin-text">Administrator Sign In</h2>
              <p className="text-xs text-admin-muted">Central Administrative Management Console</p>
            </div>
            <span className="admin-badge bg-admin-primary/10 text-admin-primary">
              <ShieldCheck size={12} /> Restricted
            </span>
          </div>

          {adminErr && (
            <div className="rounded-xl border border-admin-error/30 bg-admin-error/10 p-3 text-xs font-semibold text-admin-error">
              {adminErr}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-admin-muted">
              Admin Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-admin-muted" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@govtpath.ai"
                className="admin-input pl-10"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-admin-muted">
              Admin Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-admin-muted" />
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter password"
                className="admin-input pl-10"
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={adminLoading}
            className="admin-btn-primary w-full py-3"
          >
            {adminLoading ? 'Authenticating...' : 'Sign In as Administrator'}
            <ArrowRight size={16} />
          </button>

          <div className="rounded-xl bg-slate-50 p-2.5 text-center text-xs text-slate-500">
            <span className="font-semibold text-admin-text">Notice:</span> Admin access is restricted to authorized administrative personnel. Public registration is disabled.
          </div>
        </form>
      )}
    </div>
  );
}

import { Link, Outlet, NavLink } from 'react-router-dom';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAdminStore } from '../../store/useAdminStore';

export default function PublicLayout() {
  const user = useStore((s) => s.user);
  const adminUser = useAdminStore((s) => s.adminUser);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex w-full items-center justify-between px-4 py-3 lg:px-24">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-brand-700">
            <GraduationCap />
            GovtPath AI
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            <NavLink to="/exams" className="hover:text-brand-600">
              Explore exams
            </NavLink>

            {/* Admin Quick Jump */}
            <Link
              to={adminUser ? '/admin/dashboard' : '/login?tab=admin'}
              className="flex items-center gap-1 text-xs font-semibold text-admin-primary bg-admin-primary/10 px-2.5 py-1 rounded-lg hover:bg-admin-primary hover:text-white transition"
            >
              <ShieldCheck size={14} /> Admin Portal
            </Link>

            {user ? (
              <Link className="btn" to="/app/dashboard">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="hover:text-brand-600">
                  Log in
                </Link>
                <Link className="btn" to="/register">
                  Start preparing
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 space-y-2">
        <div>
          © GovtPath AI – Centralized Educational & Competitive Examination Management System.
        </div>
        <div className="flex items-center justify-center gap-4 text-xs">
          <Link to="/login?tab=admin" className="font-semibold text-admin-primary hover:underline">
            Administrator Portal
          </Link>
          <span>·</span>
          <Link to="/exams" className="text-slate-500 hover:text-slate-800">
            Examination Catalogue
          </Link>
        </div>
      </footer>
    </div>
  );
}

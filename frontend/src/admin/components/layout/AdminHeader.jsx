import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import { notificationService } from '../../../services/admin/systemServices';

export default function AdminHeader({ onMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, logout, setGlobalSearchOpen, dateRangeFilter, setDateRangeFilter } = useAdminStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const dateFilterRef = useRef(null);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (dateFilterRef.current && !dateFilterRef.current.contains(e.target)) setDateFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs from pathname
  const pathSegments = location.pathname
    .replace(/^\/admin/, '')
    .split('/')
    .filter(Boolean);

  const breadcrumbs = [
    { label: 'Admin', to: '/admin/dashboard' },
    ...pathSegments.map((segment, idx) => {
      const formatted = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
      const to = `/admin/${pathSegments.slice(0, idx + 1).join('/')}`;
      return { label: formatted, to };
    }),
  ];

  const notifications = notificationService.getAllNotifications().slice(0, 4);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-admin-border bg-white px-4 lg:px-8">
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Open mobile menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-admin-border text-admin-muted hover:bg-slate-50 hover:text-admin-text lg:hidden"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-admin-muted">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <span key={crumb.to} className="flex items-center gap-1.5">
                {idx > 0 && <span className="text-slate-300">/</span>}
                {isLast ? (
                  <span className="font-semibold text-admin-text">{crumb.label}</span>
                ) : (
                  <Link to={crumb.to} className="hover:text-admin-primary transition">
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      {/* Center: Global Search Trigger Button */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          type="button"
          onClick={() => setGlobalSearchOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-admin-border bg-[#F7F8FC] px-3.5 py-2 text-xs text-admin-muted hover:border-slate-300 hover:bg-slate-100 transition"
        >
          <span className="flex items-center gap-2">
            <Search size={14} className="text-admin-muted" />
            <span>Search exams, questions, students, jobs...</span>
          </span>
          <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 border border-slate-200">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Date Filter Dropdown */}
        <div className="relative" ref={dateFilterRef}>
          <button
            type="button"
            onClick={() => setDateFilterOpen(!dateFilterOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-admin-border bg-white px-3 py-1.5 text-xs font-semibold text-admin-text hover:bg-slate-50 transition"
          >
            <Calendar size={13} className="text-admin-primary" />
            <span className="hidden sm:inline">{dateRangeFilter}</span>
            <ChevronDown size={12} className="text-admin-muted" />
          </button>

          {dateFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-admin-border bg-white py-1 shadow-admin-dropdown z-50">
              {['Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Custom Date Range'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setDateRangeFilter(opt);
                    setDateFilterOpen(false);
                  }}
                  className={`flex w-full items-center px-3 py-2 text-xs text-left font-medium transition ${
                    dateRangeFilter === opt
                      ? 'bg-admin-primary/10 text-admin-primary font-bold'
                      : 'text-admin-text hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="View notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-admin-border text-admin-muted hover:bg-slate-50 hover:text-admin-text transition"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-admin-primary ring-2 ring-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-admin-border bg-white p-2 shadow-admin-dropdown z-50">
              <div className="flex items-center justify-between border-b border-admin-border px-3 py-2">
                <span className="text-xs font-bold text-admin-text">System Alerts</span>
                <span className="rounded-full bg-admin-primary/10 px-2 py-0.5 text-[10px] font-bold text-admin-primary">
                  {notifications.length} New
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 hover:bg-slate-50 rounded-xl transition">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-admin-primary/10 text-admin-primary">
                        <Info size={11} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold text-admin-text">{n.title}</div>
                        <div className="line-clamp-2 text-[11px] text-admin-muted mt-0.5">{n.message}</div>
                        <span className="mt-1 block text-[10px] text-slate-400">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-admin-border pt-1">
                <Link
                  to="/admin/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="block text-center text-xs font-semibold text-admin-primary py-1.5 hover:underline"
                >
                  View all announcements &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-xl border border-admin-border p-1.5 hover:bg-slate-50 transition"
          >
            <img
              src={
                adminUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
              }
              alt="Admin Profile"
              className="h-7 w-7 rounded-lg object-cover"
            />
            <div className="hidden text-left xl:block">
              <span className="block text-xs font-bold leading-tight text-admin-text">
                {adminUser?.name || 'Jagadeesh C.'}
              </span>
              <span className="block text-[10px] leading-tight text-admin-muted">
                {adminUser?.role || 'Super Admin'}
              </span>
            </div>
            <ChevronDown size={12} className="text-admin-muted hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-admin-border bg-white p-2 shadow-admin-dropdown z-50">
              <div className="border-b border-admin-border px-3 py-2.5">
                <span className="block text-xs font-bold text-admin-text">{adminUser?.name}</span>
                <span className="block truncate text-[11px] text-admin-muted">{adminUser?.email}</span>
                <span className="mt-1 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {adminUser?.role || 'Super Admin'} Access
                </span>
              </div>

              <div className="py-1 space-y-0.5 text-xs">
                <Link
                  to="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-admin-text hover:bg-slate-50 transition"
                >
                  <Settings size={14} className="text-admin-muted" />
                  Admin Settings
                </Link>
                <Link
                  to="/admin/roles"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-admin-text hover:bg-slate-50 transition"
                >
                  <User size={14} className="text-admin-muted" />
                  Role Permissions
                </Link>
                <Link
                  to="/app/dashboard"
                  target="_blank"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-admin-secondary hover:bg-blue-50 transition"
                >
                  <ExternalLink size={14} />
                  Student Portal View
                </Link>
              </div>

              <div className="border-t border-admin-border pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                    navigate('/login?tab=admin');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-admin-error hover:bg-red-50 transition"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

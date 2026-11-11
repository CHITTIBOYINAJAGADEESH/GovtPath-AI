import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Map,
  PenLine,
  LogOut,
  BookOpen,
  ClipboardList,
  BarChart3,
  Bot,
  CalendarDays,
  BriefcaseBusiness,
  Bookmark,
  Settings,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAdminStore } from '../../store/useAdminStore';

const nav = [
  ['/app/dashboard', 'Dashboard', LayoutDashboard],
  ['/app/explore-exams', 'Explore exams', Compass],
  ['/app/my-exams', 'My examinations', GraduationCap],
  ['/app/roadmap', 'AI Roadmap', Map],
  ['/app/learning', 'Syllabus & learning', BookOpen],
  ['/app/practice', 'Daily practice', PenLine],
  ['/app/mock-tests', 'Mock tests', ClipboardList],
  ['/app/results', 'Results', BarChart3],
  ['/app/analytics', 'Analytics', BarChart3],
  ['/app/ai-tutor', 'AI tutor', Bot],
  ['/app/planner', 'Study planner', CalendarDays],
  ['/app/government-jobs', 'Government jobs', BriefcaseBusiness],
  ['/app/saved', 'Saved items', Bookmark],
  ['/app/settings', 'Settings', Settings],
];

export default function StudentSidebar({ onNavigate }) {
  const { logout } = useStore();
  const { adminUser } = useAdminStore();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col gap-1 overflow-y-auto p-4">
      <div className="mb-4 px-3 font-extrabold text-brand-700">GovtPath AI</div>
      {nav.map(([to, label, Icon]) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
              isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}

      <div className="mt-auto pt-3 border-t border-slate-100 space-y-1">
        <Link
          to={adminUser ? '/admin/dashboard' : '/login?tab=admin'}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-admin-primary hover:bg-admin-primary/10 transition"
        >
          <ShieldCheck size={16} />
          Admin Console
        </Link>

        <button
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 transition"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  GraduationCap,
  PlusCircle,
  FolderTree,
  Inbox,
  Workflow,
  BookOpen,
  Layers,
  ListTree,
  FileText,
  HelpCircle,
  UploadCloud,
  FileQuestion,
  Award,
  Sparkles,
  Sliders,
  MapPin,
  MessageSquareShare,
  Users,
  LineChart,
  Briefcase,
  BellRing,
  CheckSquare,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  ShieldAlert,
  History,
  Settings,
  LogOut,
  ChevronDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import { examManagementService } from '../../../services/admin/examManagementService';

const NAV_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'EXAM MANAGEMENT',
    items: [
      { to: '/admin/exams', label: 'Exam Catalogue', icon: GraduationCap },
      { to: '/admin/exams/new', label: 'Add Examination', icon: PlusCircle },
      { to: '/admin/categories', label: 'Exam Categories', icon: FolderTree },
      { to: '/admin/custom-exams', label: 'Custom Exam Requests', icon: Inbox, badge: 'requests' },
      { to: '/admin/patterns', label: 'Examination Patterns', icon: Workflow },
    ],
  },
  {
    title: 'SYLLABUS MANAGEMENT',
    items: [
      { to: '/admin/syllabus', label: 'All Syllabus', icon: BookOpen },
      { to: '/admin/subjects', label: 'Subjects', icon: Layers },
      { to: '/admin/topics', label: 'Chapters & Topics', icon: ListTree },
      { to: '/admin/learning-resources', label: 'Learning Resources', icon: FileText },
    ],
  },
  {
    title: 'ASSESSMENT MANAGEMENT',
    items: [
      { to: '/admin/questions', label: 'Question Bank', icon: HelpCircle },
      { to: '/admin/questions/new', label: 'Add Questions', icon: PlusCircle },
      { to: '/admin/questions/bulk-import', label: 'Bulk Import', icon: UploadCloud },
      { to: '/admin/mock-tests', label: 'Mock Tests', icon: FileQuestion },
      { to: '/admin/test-results', label: 'Test Results', icon: Award },
    ],
  },
  {
    title: 'AI MANAGEMENT',
    items: [
      { to: '/admin/ai-roadmaps', label: 'Roadmap Templates', icon: Sparkles },
      { to: '/admin/ai-rules', label: 'Roadmap Rules', icon: Sliders },
      { to: '/admin/generated-roadmaps', label: 'Generated Roadmaps', icon: MapPin },
      { to: '/admin/ai-feedback', label: 'AI Feedback', icon: MessageSquareShare },
    ],
  },
  {
    title: 'STUDENT MANAGEMENT',
    items: [
      { to: '/admin/students', label: 'All Students', icon: Users },
      { to: '/admin/student-performance', label: 'Student Performance', icon: LineChart },
    ],
  },
  {
    title: 'RECRUITMENT',
    items: [
      { to: '/admin/jobs', label: 'Government Jobs', icon: Briefcase },
      { to: '/admin/job-notifications', label: 'Job Notifications', icon: BellRing },
    ],
  },
  {
    title: 'PLATFORM MANAGEMENT',
    items: [
      { to: '/admin/content', label: 'Content Management', icon: FileText },
      { to: '/admin/notifications', label: 'Notifications', icon: BellRing },
      { to: '/admin/review', label: 'Review Queue', icon: CheckSquare, badge: 'reviews' },
      { to: '/admin/feedback', label: 'Feedback', icon: MessageSquareShare },
    ],
  },
  {
    title: 'ANALYTICS',
    items: [
      { to: '/admin/analytics', label: 'Platform Analytics', icon: BarChart3 },
      { to: '/admin/exam-analytics', label: 'Exam Analytics', icon: PieChart },
      { to: '/admin/reports', label: 'Performance Reports', icon: FileSpreadsheet },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { to: '/admin/roles', label: 'Admin Roles & Permissions', icon: ShieldAlert },
      { to: '/admin/audit-logs', label: 'Audit Logs', icon: History },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar({ onNavigate }) {
  const { sidebarCollapsed, toggleSidebar, logout, adminUser } = useAdminStore();
  const navigate = useNavigate();

  // Collapsible accordion for section groups
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (title) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Dynamic badge counts
  let pendingRequestsCount = 0;
  try {
    const reqs = examManagementService.getCustomExamRequests();
    pendingRequestsCount = reqs.filter((r) => r.status === 'Pending' || r.status === 'Under Review').length;
  } catch (err) {
    pendingRequestsCount = 2;
  }

  const handleLogout = () => {
    logout();
    navigate('/login?tab=admin');
  };

  return (
    <div className="flex h-full flex-col bg-white border-r border-admin-border text-admin-text select-none">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-admin-border px-4">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-admin-primary to-admin-secondary text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="truncate">
              <span className="block font-bold tracking-tight text-slate-900 text-sm leading-tight">
                GovtPath AI
              </span>
              <span className="block text-[11px] font-medium text-admin-primary leading-tight">
                Admin Console
              </span>
            </div>
          </div>
        )}

        {sidebarCollapsed && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-admin-primary text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-admin-border text-admin-muted hover:bg-slate-50 hover:text-admin-text transition"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_SECTIONS.map((section) => {
          const isCollapsed = collapsedSections[section.title];

          return (
            <div key={section.title} className="space-y-1">
              {/* Group Title */}
              {!sidebarCollapsed ? (
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-admin-muted hover:text-admin-text transition"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      isCollapsed ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </button>
              ) : (
                <div className="my-2 border-t border-slate-100" />
              )}

              {/* Items in section */}
              {(!isCollapsed || sidebarCollapsed) && (
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onNavigate}
                        title={sidebarCollapsed ? item.label : undefined}
                        className={({ isActive }) =>
                          `group flex items-center gap-3 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all duration-150 ${
                            isActive
                              ? 'bg-admin-primary text-white shadow-sm shadow-admin-primary/20'
                              : 'text-slate-600 hover:bg-[#F7F8FC] hover:text-admin-text'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              size={17}
                              className={`shrink-0 transition-colors ${
                                isActive ? 'text-white' : 'text-admin-muted group-hover:text-admin-primary'
                              }`}
                            />
                            {!sidebarCollapsed && (
                              <span className="flex-1 truncate">{item.label}</span>
                            )}
                            {!sidebarCollapsed && item.badge === 'requests' && pendingRequestsCount > 0 && (
                              <span
                                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                                  isActive
                                    ? 'bg-white text-admin-primary'
                                    : 'bg-admin-primary/10 text-admin-primary'
                                }`}
                              >
                                {pendingRequestsCount}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Admin User Footer & Student App Switch */}
      <div className="border-t border-admin-border p-3 space-y-2">
        <NavLink
          to="/app/dashboard"
          target="_blank"
          className="flex items-center justify-between rounded-xl border border-admin-border bg-[#F7F8FC] px-3 py-2 text-xs font-semibold text-admin-text hover:bg-slate-100 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink size={14} className="text-admin-secondary" />
            {!sidebarCollapsed && 'Open Student View'}
          </span>
          {!sidebarCollapsed && (
            <span className="text-[10px] uppercase font-bold text-admin-muted">Live</span>
          )}
        </NavLink>

        <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src={
                adminUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
              }
              alt="Admin"
              className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
            />
            {!sidebarCollapsed && (
              <div className="truncate">
                <span className="block truncate text-xs font-bold text-admin-text">
                  {adminUser?.name || 'Jagadeesh C.'}
                </span>
                <span className="block truncate text-[10px] text-admin-muted">
                  {adminUser?.role || 'Super Admin'}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-admin-muted hover:bg-red-50 hover:text-admin-error transition"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

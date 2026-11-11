import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, GraduationCap, Users, HelpCircle, Briefcase, ChevronRight, FileText } from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import { examManagementService } from '../../../services/admin/examManagementService';
import { studentManagementService } from '../../../services/admin/studentManagementService';
import { questionManagementService } from '../../../services/admin/questionManagementService';
import { jobManagementService } from '../../../services/admin/jobManagementService';

export default function GlobalSearchModal() {
  const { globalSearchOpen, setGlobalSearchOpen } = useAdminStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      }
      if (e.key === 'Escape' && globalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  if (!globalSearchOpen) return null;

  const exams = examManagementService.getAllExams();
  const students = studentManagementService.getAllStudents();
  const questions = questionManagementService.getAllQuestions();
  const jobs = jobManagementService.getAllJobs();

  const q = query.trim().toLowerCase();

  const matchedExams = q ? exams.filter(e => `${e.name} ${e.org} ${e.category}`.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchedStudents = q ? students.filter(s => `${s.name} ${s.email}`.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchedJobs = q ? jobs.filter(j => `${j.title} ${j.organization}`.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchedQuestions = q ? questions.filter(qu => `${qu.question} ${qu.subject}`.toLowerCase().includes(q)).slice(0, 3) : [];

  const handleSelect = (to) => {
    setGlobalSearchOpen(false);
    setQuery('');
    navigate(to);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-admin-border bg-white shadow-2xl"
        >
          {/* Search Header */}
          <div className="flex items-center border-b border-admin-border px-4 py-3">
            <Search className="h-5 w-5 text-admin-muted" />
            <input
              type="text"
              autoFocus
              placeholder="Search examinations, students, questions, jobs, or admin pages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent px-3 text-sm text-admin-text placeholder-admin-muted focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-admin-muted hover:text-admin-text mr-2"
              >
                <X size={16} />
              </button>
            )}
            <kbd className="hidden sm:inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-500">
              ESC
            </kbd>
          </div>

          {/* Quick Page Links when empty */}
          {!query && (
            <div className="p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                Quick Navigation
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Exam Catalogue', to: '/admin/exams', icon: GraduationCap },
                  { label: 'All Students', to: '/admin/students', icon: Users },
                  { label: 'Question Bank', to: '/admin/questions', icon: HelpCircle },
                  { label: 'Government Jobs', to: '/admin/jobs', icon: Briefcase },
                  { label: 'Platform Analytics', to: '/admin/analytics', icon: FileText },
                  { label: 'Audit Logs', to: '/admin/audit-logs', icon: FileText },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.to}
                      onClick={() => handleSelect(item.to)}
                      className="flex items-center gap-2.5 rounded-xl border border-admin-border/60 p-2.5 text-left text-admin-text hover:bg-slate-50 hover:border-admin-primary/40 transition"
                    >
                      <Icon size={16} className="text-admin-primary" />
                      <span className="font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && (
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {matchedExams.length === 0 &&
                matchedStudents.length === 0 &&
                matchedJobs.length === 0 &&
                matchedQuestions.length === 0 && (
                  <div className="py-8 text-center text-sm text-admin-muted">
                    No results found for &ldquo;{query}&rdquo;.
                  </div>
                )}

              {matchedExams.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                    Examinations
                  </span>
                  <div className="mt-1.5 space-y-1">
                    {matchedExams.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => handleSelect(`/admin/exams?q=${e.name}`)}
                        className="flex w-full items-center justify-between rounded-xl p-2 text-left hover:bg-slate-50 transition"
                      >
                        <div>
                          <div className="text-xs font-bold text-admin-text">{e.name}</div>
                          <div className="text-[11px] text-admin-muted">{e.org} · {e.category}</div>
                        </div>
                        <ChevronRight size={14} className="text-admin-muted" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedStudents.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                    Students
                  </span>
                  <div className="mt-1.5 space-y-1">
                    {matchedStudents.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSelect(`/admin/students?q=${s.name}`)}
                        className="flex w-full items-center justify-between rounded-xl p-2 text-left hover:bg-slate-50 transition"
                      >
                        <div>
                          <div className="text-xs font-bold text-admin-text">{s.name}</div>
                          <div className="text-[11px] text-admin-muted">{s.email} · {s.primaryExamName}</div>
                        </div>
                        <ChevronRight size={14} className="text-admin-muted" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedJobs.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                    Recruitment Notifications
                  </span>
                  <div className="mt-1.5 space-y-1">
                    {matchedJobs.map((j) => (
                      <button
                        key={j.id}
                        onClick={() => handleSelect(`/admin/jobs?q=${j.title}`)}
                        className="flex w-full items-center justify-between rounded-xl p-2 text-left hover:bg-slate-50 transition"
                      >
                        <div>
                          <div className="text-xs font-bold text-admin-text">{j.title}</div>
                          <div className="text-[11px] text-admin-muted">{j.organization} · {j.location}</div>
                        </div>
                        <ChevronRight size={14} className="text-admin-muted" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal Footer */}
          <div className="border-t border-admin-border bg-slate-50 px-4 py-2 text-right text-[11px] text-admin-muted">
            Press <kbd className="font-mono font-semibold">ESC</kbd> to exit
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

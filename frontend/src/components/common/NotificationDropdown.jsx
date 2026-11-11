import { useState } from 'react';
import { Bell, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { notificationService } from '../../services/admin/systemServices';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const { plannerTasks, attempts } = useStore();

  const announcements = notificationService.getAllNotifications().slice(0, 3);
  const pending = plannerTasks.filter((task) => !task.completed).slice(0, 2);
  const latest = attempts[0];
  const count = announcements.length + pending.length + (latest ? 1 : 0);

  return (
    <div className="relative">
      <button
        className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition"
        aria-label={`Notifications${count ? `, ${count} updates` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Bell size={19} />
        {count > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-30 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="flex items-center justify-between px-2 py-1 border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-800">Notifications & Alerts</h2>
            <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
              {count} updates
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
            {/* Admin Platform Announcements */}
            {announcements.map((notif) => (
              <div key={notif.id} className="p-2 hover:bg-slate-50 rounded-lg transition">
                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                  <div>
                    <span className="block text-xs font-semibold text-slate-800">{notif.title}</span>
                    <span className="block text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {notif.message}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Planner tasks */}
            {pending.map((task) => (
              <Link
                key={task.id}
                onClick={() => setOpen(false)}
                to="/app/planner"
                className="block rounded-lg p-2 text-xs hover:bg-slate-50"
              >
                <span className="block font-medium text-slate-800">{task.title}</span>
                <span className="text-[11px] text-slate-500">Planned for {task.date}</span>
              </Link>
            ))}

            {latest && (
              <Link
                onClick={() => setOpen(false)}
                to="/app/results"
                className="block rounded-lg p-2 text-xs hover:bg-slate-50"
              >
                <span className="block font-medium text-slate-800">Latest Test Result</span>
                <span className="text-[11px] text-slate-500">
                  {latest.title} · {latest.score}/{latest.maxScore}
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

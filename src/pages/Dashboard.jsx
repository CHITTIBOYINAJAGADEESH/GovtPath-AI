
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useStore } from '../store/useStore';
import { usePrimary } from '../hooks';
import { percent } from '../services/roadmapService';
import { getExam } from '../services/examService';

export default function Dashboard() {
  const {
    user,
    progress,
    activity,
    attempts,
    plannerTasks,
    updateTask,
    selected,
    custom,
    primary,
    setPrimary,
    toggleTopic,
    addExam,
    removeExam
  } = useStore();

  const { exam, roadmap } = usePrimary();

  // Examination list
  const exams = selected
    .map(id => getExam(id, custom))
    .filter(Boolean);

  // Activity calculations
  const mine = activity.filter(a => a.exam === primary);

  const correct = mine.filter(a => a.correct).length;

  const acc = mine.length
    ? Math.round((correct / mine.length) * 100)
    : 0;

  const studyHours = (
    activity.reduce(
      (sum, item) => sum + (item.seconds || 0),
      0
    ) +
    attempts.reduce(
      (sum, attempt) => sum + (attempt.durationSeconds || 0),
      0
    )
  ) / 3600;

  // Study streak
  const activeDates = new Set([
    ...activity.map(item =>
      format(new Date(item.t), 'yyyy-MM-dd')
    ),
    ...attempts.map(item =>
      format(new Date(item.date), 'yyyy-MM-dd')
    )
  ]);

  let cursor = new Date();
  let streak = 0;

  if (!activeDates.has(format(cursor, 'yyyy-MM-dd'))) {
    cursor = subDays(cursor, 1);
  }

  while (
    streak < 365 &&
    activeDates.has(format(cursor, 'yyyy-MM-dd'))
  ) {
    streak++;
    cursor = subDays(cursor, 1);
  }

  // Weekly questions
  const week = Array.from({ length: 7 }, (_, k) => {
    const d = subDays(new Date(), 6 - k);

    return {
      day: format(d, 'EEE'),
      questions: mine.filter(a =>
        isSameDay(new Date(a.t), d)
      ).length
    };
  });

  // Roadmap progress
  const next = roadmap?.topics
    .filter(t => !progress[t.id])
    .slice(0, 3) || [];

  const p = roadmap
    ? percent(roadmap.topics, progress)
    : 0;

  // Today's planner tasks
  const todaysTasks = plannerTasks.filter(
    task => task.date === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome, {user?.name || 'Student'}
      </h1>

      {/* MY EXAMINATIONS */}
      <section className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">
              My examinations
            </h2>
            <p className="text-sm text-slate-500">
              Choose the exams that shape your study plan and practice.
            </p>
          </div>

          <Link className="btn" to="/app/explore-exams">
            Explore exams
          </Link>
        </div>

        {exams.length ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {exams.map(examItem => (
              <article className="card" key={examItem.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="chip">
                      {examItem.categoryLabel}
                    </span>

                    <h3 className="mt-3 text-lg font-semibold">
                      {examItem.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {examItem.org} · {examItem.qualification}
                    </p>
                  </div>

                  {primary === examItem.id && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      Primary
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link className="btn-ghost" to="/app/roadmap">
                    Open roadmap
                  </Link>

                  <Link className="btn-ghost" to="/app/learning">
                    Study syllabus
                  </Link>

                  {primary !== examItem.id && (
                    <button
                      className="btn"
                      onClick={() => {
                        setPrimary(examItem.id);
                        toast.success(
                          `${examItem.name} is now your primary exam`
                        );
                      }}
                    >
                      Set primary
                    </button>
                  )}
                </div>

                <button
                  className="mt-4 inline-flex items-center gap-2 text-sm text-red-600"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Remove ${examItem.name} from My examinations?`
                      )
                    ) {
                      removeExam(examItem.id);
                      toast.success('Exam removed');
                    }
                  }}
                >
                  <Trash2 size={15} />
                  Remove exam
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="card mt-5 text-center">
            <h3 className="font-semibold">
              No examinations selected yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add an exam to get a personalized roadmap and practice questions.
            </p>

            <Link
              className="btn mt-4"
              to="/app/explore-exams"
            >
              Browse examination catalogue
            </Link>
          </div>
        )}

        {/* QUICK ADD EXAMS */}
        <div className="card mt-5">
          <h3 className="font-semibold">
            Quick add a popular exam
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ['jee-main', 'JEE Main'],
              ['neet-ug', 'NEET UG'],
              ['ssc-cgl', 'SSC CGL'],
              ['ibps-po', 'IBPS PO']
            ].map(([id, name]) => (
              <button
                key={id}
                disabled={selected.includes(id)}
                className="btn-ghost disabled:opacity-50"
                onClick={() => {
                  addExam(id);
                  toast.success(`${name} added`);
                }}
              >
                {selected.includes(id) && <Check size={15} />}
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRIMARY EXAM DASHBOARD */}
      {!exam ? (
        <div className="card mt-5 text-center">
          <p>You haven't picked an exam yet.</p>

          <Link
            className="btn mt-3"
            to="/app/explore-exams"
          >
            Explore exams
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            Primary exam:

            <select
              className="input w-auto"
              value={primary}
              onChange={e => setPrimary(e.target.value)}
            >
              {selected.map(id => (
                <option key={id} value={id}>
                  {getExam(id, custom)?.name}
                </option>
              ))}
            </select>
          </div>

          {/* STATISTICS */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ['Syllabus complete', `${p}%`],
              ['Questions attempted', mine.length],
              ['Accuracy', `${acc}%`],
              ['Study time', `${studyHours.toFixed(1)}h`],
              ['Study streak', `${streak} days`]
            ].map(([label, value]) => (
              <div className="card" key={label}>
                <div className="text-2xl font-bold">
                  {value}
                </div>

                <div className="text-xs text-slate-500">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* TASKS AND CHART */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="card">
              <h2 className="font-semibold">
                Today's tasks
              </h2>

              {todaysTasks.map(task => (
                <label
                  key={task.id}
                  className="mt-2 flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      updateTask(task.id, {
                        completed: !task.completed,
                        completedAt: task.completed
                          ? null
                          : Date.now()
                      })
                    }
                  />

                  <span
                    className={
                      task.completed
                        ? 'text-slate-400 line-through'
                        : ''
                    }
                  >
                    {task.title}
                  </span>

                  <span className="ml-auto text-xs text-slate-500">
                    {task.type}
                  </span>
                </label>
              ))}

              {next.length ? (
                next.map(t => (
                  <label
                    key={t.id}
                    className="mt-2 flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={!!progress[t.id]}
                      onChange={() => toggleTopic(t.id)}
                    />

                    {t.subject}: {t.name}

                    <span className="ml-auto text-xs text-slate-500">
                      ~{t.hours}h
                    </span>
                  </label>
                ))
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  All roadmap topics complete. Time for mocks and revision.
                </p>
              )}

              <Link
                to="/app/planner"
                className="mt-3 inline-block text-sm text-brand-600"
              >
                Open study planner
              </Link>
            </div>

            {/* WEEKLY PERFORMANCE */}
            <div className="card">
              <h2 className="font-semibold">
                Questions this week
              </h2>

              <div className="mt-2 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={week}>
                    <XAxis dataKey="day" fontSize={11} />
                    <YAxis
                      allowDecimals={false}
                      fontSize={11}
                      width={24}
                    />
                    <Tooltip />

                    <Bar
                      dataKey="questions"
                      fill="#5b5bd6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RECOMMENDATION */}
          <div className="card mt-4 bg-brand-50">
            <b>Recommended next step:</b>

            {' '}
            {mine.length < 3
              ? 'Answer a few practice questions to calibrate your accuracy.'
              : 'Keep going – revisit weaker subjects in the roadmap.'}

            {' '}

            <Link
              className="text-brand-600 underline"
              to="/app/practice"
            >
              Practise now
            </Link>

            <p className="mt-1 text-xs text-slate-500">
              Readiness figures are demo indicators, not predictions of rank or selection.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

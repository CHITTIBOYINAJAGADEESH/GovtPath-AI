import { useState } from 'react';
import { MapPin, Sparkles, Eye, CheckCircle2, Calendar } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

const sampleGenerated = [
  {
    id: 'rdm-101',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@gmail.com',
    examName: 'GATE (Engineering)',
    targetDate: '2027-02-14',
    totalWeeks: 32,
    completionRate: 68,
    dailyHours: 4,
    status: 'Active',
    generatedAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'rdm-102',
    studentName: 'Deepika Rao',
    studentEmail: 'deepika.rao@outlook.com',
    examName: 'UPSC Civil Services Exam',
    targetDate: '2027-05-28',
    totalWeeks: 52,
    completionRate: 84,
    dailyHours: 6,
    status: 'Active',
    generatedAt: '2026-06-20T14:15:00Z',
  },
  {
    id: 'rdm-103',
    studentName: 'Sai Krishna Murthy',
    studentEmail: 'sai.krishna@gmail.com',
    examName: 'IBPS PO',
    targetDate: '2026-12-10',
    totalWeeks: 16,
    completionRate: 52,
    dailyHours: 3.5,
    status: 'Active',
    generatedAt: '2026-09-02T08:45:00Z',
  },
  {
    id: 'rdm-104',
    studentName: 'Rajesh Varma',
    studentEmail: 'rajesh.varma@gmail.com',
    examName: 'SSC CGL',
    targetDate: '2027-01-18',
    totalWeeks: 20,
    completionRate: 75,
    dailyHours: 4,
    status: 'Active',
    generatedAt: '2026-07-01T09:15:00Z',
  },
  {
    id: 'rdm-105',
    studentName: 'Neha Gupta',
    studentEmail: 'neha.gupta@yahoo.com',
    examName: 'CAT (Management)',
    targetDate: '2026-11-29',
    totalWeeks: 24,
    completionRate: 88,
    dailyHours: 5,
    status: 'Active',
    generatedAt: '2026-05-18T16:30:00Z',
  },
];

export default function GeneratedRoadmaps() {
  const [roadmaps] = useState(sampleGenerated);
  const [inspectTarget, setInspectTarget] = useState(null);

  const columns = [
    {
      header: 'Student Aspirant',
      key: 'studentName',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted">{row.studentEmail}</span>
        </div>
      ),
    },
    {
      header: 'Examination',
      key: 'examName',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800">{val}</span>,
    },
    {
      header: 'Progress %',
      key: 'completionRate',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-admin-primary rounded-full" style={{ width: `${val}%` }} />
          </div>
          <span className="font-bold text-slate-800">{val}%</span>
        </div>
      ),
    },
    {
      header: 'Timeline & Pace',
      key: 'totalWeeks',
      sortable: true,
      render: (val, row) => (
        <span className="text-slate-600 font-mono text-[11px]">
          {val} Weeks · {row.dailyHours}h/day
        </span>
      ),
    },
    {
      header: 'Target Date',
      key: 'targetDate',
      sortable: true,
      render: (val) => <span className="font-mono text-xs">{val}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => setInspectTarget(row)}
          title="Inspect Roadmap Progress"
          className="p-1 text-admin-muted hover:text-admin-primary rounded-lg hover:bg-slate-100 transition"
        >
          <Eye size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Generated Student Roadmaps
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Real-time monitor of student study plans, completion rates, target dates, and adherence pacing.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={roadmaps}
        searchKey="studentName"
        searchPlaceholder="Search by student name or email..."
        exportFilename="student-generated-roadmaps.csv"
      />

      {inspectTarget && (
        <Modal
          isOpen={!!inspectTarget}
          onClose={() => setInspectTarget(null)}
          title="Student AI Study Roadmap"
          subtitle={`${inspectTarget.studentName} · ${inspectTarget.examName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4">
              <div>
                <span className="text-admin-muted text-[10px] uppercase font-bold block">Overall Progress</span>
                <span className="text-xl font-black text-admin-primary">{inspectTarget.completionRate}%</span>
              </div>
              <div>
                <span className="text-admin-muted text-[10px] uppercase font-bold block">Schedule Duration</span>
                <span className="text-xl font-black text-slate-800">{inspectTarget.totalWeeks} Wks</span>
              </div>
              <div>
                <span className="text-admin-muted text-[10px] uppercase font-bold block">Target Exam Date</span>
                <span className="text-sm font-bold text-slate-800 font-mono mt-1 block">{inspectTarget.targetDate}</span>
              </div>
            </div>

            <div className="rounded-xl border border-admin-border p-4 space-y-2">
              <span className="font-bold text-admin-text text-sm block">Roadmap Highlights</span>
              <p className="text-slate-600 leading-relaxed">
                The student is currently in the Core Concepts phase. Weekly milestone adherence is on track with an average daily study allocation of {inspectTarget.dailyHours} hours.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectTarget(null)}
                className="admin-btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

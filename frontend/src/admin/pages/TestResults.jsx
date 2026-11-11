import { useState, useMemo } from 'react';
import { Award, Users, BarChart3, Clock, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

const initialAttempts = [
  {
    id: 'att-101',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@gmail.com',
    examName: 'GATE (Engineering)',
    testTitle: 'GATE Full-Length Simulation Test #2',
    score: 84,
    maxScore: 100,
    accuracy: 91.5,
    percentile: 98.4,
    rank: 14,
    totalTakers: 840,
    timeTaken: '142 mins',
    date: '2026-11-11T14:30:00Z',
    status: 'Completed',
  },
  {
    id: 'att-102',
    studentName: 'Deepika Rao',
    studentEmail: 'deepika.rao@outlook.com',
    examName: 'UPSC Civil Services Exam',
    testTitle: 'UPSC GS Paper 1 Prelims National Simulation',
    score: 118,
    maxScore: 200,
    accuracy: 78.0,
    percentile: 94.2,
    rank: 62,
    totalTakers: 1120,
    timeTaken: '115 mins',
    date: '2026-11-10T11:00:00Z',
    status: 'Completed',
  },
  {
    id: 'att-103',
    studentName: 'Rajesh Varma',
    studentEmail: 'rajesh.varma@gmail.com',
    examName: 'SSC CGL',
    testTitle: 'SSC CGL Tier 1 All-India Mock Test #1',
    score: 154,
    maxScore: 200,
    accuracy: 84.5,
    percentile: 91.8,
    rank: 120,
    totalTakers: 2450,
    timeTaken: '58 mins',
    date: '2026-11-09T16:20:00Z',
    status: 'Completed',
  },
  {
    id: 'att-104',
    studentName: 'Sai Krishna Murthy',
    studentEmail: 'sai.krishna@gmail.com',
    examName: 'IBPS PO',
    testTitle: 'IBPS PO Prelims Speed & Accuracy Drill',
    score: 38,
    maxScore: 50,
    accuracy: 82.0,
    percentile: 88.5,
    rank: 210,
    totalTakers: 1800,
    timeTaken: '19 mins',
    date: '2026-11-08T09:45:00Z',
    status: 'Completed',
  },
  {
    id: 'att-105',
    studentName: 'Meera Nambiar',
    studentEmail: 'meera.nambiar@gmail.com',
    examName: 'NEET UG',
    testTitle: 'NEET UG Biology & Physics Diagnostic Mock',
    score: 540,
    maxScore: 720,
    accuracy: 79.2,
    percentile: 87.0,
    rank: 390,
    totalTakers: 3100,
    timeTaken: '185 mins',
    date: '2026-11-07T12:00:00Z',
    status: 'Completed',
  },
];

export default function TestResults() {
  const [attempts] = useState(initialAttempts);
  const [inspectAttempt, setInspectAttempt] = useState(null);

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
      header: 'Mock Test Title',
      key: 'testTitle',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-800 line-clamp-1">{val}</div>
          <span className="text-[11px] text-admin-muted font-mono">{row.examName}</span>
        </div>
      ),
    },
    {
      header: 'Score',
      key: 'score',
      sortable: true,
      render: (val, row) => (
        <span className="font-bold text-admin-text">
          {val} / {row.maxScore}
        </span>
      ),
    },
    {
      header: 'Accuracy',
      key: 'accuracy',
      sortable: true,
      render: (val) => (
        <span className="font-mono text-emerald-600 font-bold">{val}%</span>
      ),
    },
    {
      header: 'National Percentile',
      key: 'percentile',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-black text-admin-primary">{val}%ile</span>
          <span className="block text-[10px] text-admin-muted">
            Rank #{row.rank} of {row.totalTakers}
          </span>
        </div>
      ),
    },
    {
      header: 'Time Spent',
      key: 'timeTaken',
      render: (val) => <span className="text-slate-600 font-mono text-[11px]">{val}</span>,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => setInspectAttempt(row)}
          title="Inspect Attempt Details"
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
            Student Test Results
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Real-time score audit, national percentiles, and rank standing across all mock examinations.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={attempts}
        searchKey="studentName"
        searchPlaceholder="Search attempts by student name or test title..."
        exportFilename="student-test-attempts.csv"
      />

      {/* Inspect Modal */}
      {inspectAttempt && (
        <Modal
          isOpen={!!inspectAttempt}
          onClose={() => setInspectAttempt(null)}
          title="Mock Test Attempt Breakdown"
          subtitle={`${inspectAttempt.studentName} · ${inspectAttempt.testTitle}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-admin-muted block">Score Achieved</span>
                <span className="text-xl font-black text-slate-800">{inspectAttempt.score} <span className="text-xs font-normal text-slate-500">/ {inspectAttempt.maxScore}</span></span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-admin-muted block">Percentile</span>
                <span className="text-xl font-black text-admin-primary">{inspectAttempt.percentile}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-admin-muted block">Accuracy</span>
                <span className="text-xl font-black text-emerald-600">{inspectAttempt.accuracy}%</span>
              </div>
            </div>

            <div className="rounded-xl border border-admin-border p-4 space-y-2">
              <span className="font-bold text-admin-text text-sm block">Attempt Parameters</span>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>National Rank: <strong>#{inspectAttempt.rank} out of {inspectAttempt.totalTakers} takers</strong></div>
                <div>Time Taken: <strong>{inspectAttempt.timeTaken}</strong></div>
                <div>Exam: <strong>{inspectAttempt.examName}</strong></div>
                <div>Date: <strong>{new Date(inspectAttempt.date).toLocaleString()}</strong></div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectAttempt(null)}
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

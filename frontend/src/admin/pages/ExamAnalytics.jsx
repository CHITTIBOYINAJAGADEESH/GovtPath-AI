import { useState } from 'react';
import { PieChart as PieChartIcon, TrendingUp, Layers, GraduationCap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';

const examMetrics = [
  { id: 'jee-main', name: 'JEE Main', stream: 'Engineering', enrollees: 4210, syllabusAvg: 68, questionVolume: 1240, difficultyIndex: 'High', passProjection: '72%' },
  { id: 'neet-ug', name: 'NEET UG', stream: 'Medical', enrollees: 3840, syllabusAvg: 64, questionVolume: 980, difficultyIndex: 'High', passProjection: '68%' },
  { id: 'upsc-civil-services-exam', name: 'UPSC Civil Services', stream: 'Civil Services', enrollees: 3120, syllabusAvg: 58, questionVolume: 2150, difficultyIndex: 'Very High', passProjection: '45%' },
  { id: 'ssc-cgl', name: 'SSC CGL', stream: 'Staff Selection', enrollees: 2890, syllabusAvg: 74, questionVolume: 1850, difficultyIndex: 'Medium', passProjection: '76%' },
  { id: 'ibps-po', name: 'IBPS PO', stream: 'Banking', enrollees: 2410, syllabusAvg: 71, questionVolume: 1420, difficultyIndex: 'Medium-Hard', passProjection: '71%' },
  { id: 'gate', name: 'GATE (Engineering)', stream: 'Higher Education', enrollees: 1980, syllabusAvg: 66, questionVolume: 890, difficultyIndex: 'High', passProjection: '65%' },
];

export default function ExamAnalytics() {
  const columns = [
    {
      header: 'Examination',
      key: 'name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted font-mono">{row.stream}</span>
        </div>
      ),
    },
    {
      header: 'Enrolled Aspirants',
      key: 'enrollees',
      sortable: true,
      render: (val) => <span className="font-bold text-admin-primary">{val?.toLocaleString()}</span>,
    },
    {
      header: 'Avg Syllabus Progress',
      key: 'syllabusAvg',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${val}%` }} />
          </div>
          <span className="font-bold text-slate-700">{val}%</span>
        </div>
      ),
    },
    {
      header: 'Question Bank Size',
      key: 'questionVolume',
      sortable: true,
      render: (val) => <span className="font-mono text-xs">{val} questions</span>,
    },
    {
      header: 'Difficulty Index',
      key: 'difficultyIndex',
      render: (val) => <Badge variant={val.includes('High') ? 'Hard' : 'Medium'}>{val}</Badge>,
    },
    {
      header: 'Target Pass Projection',
      key: 'passProjection',
      sortable: true,
      render: (val) => <span className="font-bold text-emerald-600">{val}</span>,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-admin-text tracking-tight">
          Examination Stream Analytics
        </h1>
        <p className="text-xs text-admin-muted mt-1">
          Stream-by-stream performance breakdown, syllabus completion velocities, and question bank density.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={examMetrics}
        searchKey="name"
        searchPlaceholder="Search examination metrics..."
        exportFilename="examination-stream-analytics.csv"
      />
    </div>
  );
}

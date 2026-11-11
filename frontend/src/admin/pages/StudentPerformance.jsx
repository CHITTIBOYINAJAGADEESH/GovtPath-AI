import { useState, useMemo } from 'react';
import {
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import StatsCard from '../components/common/StatsCard';
import Badge from '../components/common/Badge';
import { studentManagementService } from '../../services/admin/studentManagementService';
import { useAdminStore } from '../../store/useAdminStore';

const mockPerformanceHistory = [
  { week: 'W1', score: 58, studyHours: 18 },
  { week: 'W2', score: 64, studyHours: 22 },
  { week: 'W3', score: 62, studyHours: 20 },
  { week: 'W4', score: 71, studyHours: 26 },
  { week: 'W5', score: 76, studyHours: 28 },
  { week: 'W6', score: 82, studyHours: 30 },
];

export default function StudentPerformance() {
  const { dataVersion } = useAdminStore();
  const students = useMemo(() => {
    return studentManagementService.getAllStudents();
  }, [dataVersion]);

  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-101');

  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  const subjectData = useMemo(() => {
    return [
      { subject: 'Quant / Maths', accuracy: selectedStudent?.avgMockScore ? Math.round(selectedStudent.avgMockScore * 0.95) : 75 },
      { subject: 'Reasoning', accuracy: selectedStudent?.avgMockScore ? Math.min(96, Math.round(selectedStudent.avgMockScore * 1.1)) : 85 },
      { subject: 'Core Technical', accuracy: selectedStudent?.avgMockScore ? Math.round(selectedStudent.avgMockScore) : 78 },
      { subject: 'General Awareness', accuracy: selectedStudent?.avgMockScore ? Math.round(selectedStudent.avgMockScore * 0.88) : 68 },
    ];
  }, [selectedStudent]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Student Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Student Learning Performance
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Diagnostic analytics, test scores trajectory, weak area diagnosis, and syllabus velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-admin-text">Student:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="admin-select py-1.5 px-3 text-xs font-semibold w-64"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.primaryExamName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Student Banner */}
      {selectedStudent && (
        <div className="admin-card flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-white to-admin-primary/5">
          <div className="flex items-center gap-4">
            <img
              src={selectedStudent.avatar}
              alt={selectedStudent.name}
              className="h-16 w-16 rounded-2xl object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-admin-text">{selectedStudent.name}</h2>
                <Badge variant={selectedStudent.accountStatus}>{selectedStudent.accountStatus}</Badge>
              </div>
              <div className="text-xs text-admin-muted mt-0.5">
                Target: <strong className="text-slate-800">{selectedStudent.primaryExamName}</strong> · Level: {selectedStudent.preparationLevel}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Streak: <strong className="text-amber-600">{selectedStudent.streakDays} Days 🔥</strong> · Registered: {new Date(selectedStudent.registeredAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-admin-muted block">Study Hours</span>
              <span className="text-lg font-black text-slate-800">{selectedStudent.studyHoursTotal}h</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-admin-muted block">Syllabus</span>
              <span className="text-lg font-black text-admin-primary">{selectedStudent.syllabusProgress}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-admin-muted block">Avg Score</span>
              <span className="text-lg font-black text-emerald-600">{selectedStudent.avgMockScore}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mock Test Score Progress */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-admin-text">Test Score Trajectory</h3>
              <p className="text-[11px] text-admin-muted">Weekly score progression and study hours correlation</p>
            </div>
            <Badge variant="brand">Last 6 Weeks</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPerformanceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF2" vertical={false} />
                <XAxis dataKey="week" stroke="#737D91" fontSize={11} tickLine={false} />
                <YAxis stroke="#737D91" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8EAF2',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="score" name="Mock Score %" stroke="#6955E8" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="studyHours" name="Study Hours" stroke="#17B897" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Accuracy */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-admin-text">Subject-Wise Accuracy %</h3>
              <p className="text-[11px] text-admin-muted">Relative proficiency across test sections</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF2" vertical={false} />
                <XAxis dataKey="subject" stroke="#737D91" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#737D91" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8EAF2',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="accuracy" name="Accuracy %" fill="#477BEE" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weak & Strong Topics Diagnosis */}
      {selectedStudent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="admin-card border-red-100">
            <div className="flex items-center gap-2 border-b border-red-100 pb-3 mb-3 text-admin-error font-bold text-sm">
              <AlertCircle size={16} /> Diagnostic Weak Points (High Error Rate)
            </div>
            <div className="space-y-2">
              {selectedStudent.weakTopics?.map((w, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-red-50/60 p-2.5">
                  <span className="font-semibold text-slate-800">{w}</span>
                  <span className="text-[11px] font-bold text-admin-error">Under 65% accuracy</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card border-emerald-100">
            <div className="flex items-center gap-2 border-b border-emerald-100 pb-3 mb-3 text-emerald-700 font-bold text-sm">
              <CheckCircle2 size={16} /> High Proficiency Strong Disciplines
            </div>
            <div className="space-y-2">
              {selectedStudent.strongSubjects?.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-emerald-50/60 p-2.5">
                  <span className="font-semibold text-slate-800">{s}</span>
                  <span className="text-[11px] font-bold text-emerald-700">Above 85% accuracy</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

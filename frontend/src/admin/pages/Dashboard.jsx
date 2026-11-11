import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  BookOpen,
  HelpCircle,
  FileQuestion,
  Award,
  Sparkles,
  Inbox,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import StatsCard from '../components/common/StatsCard';
import Badge from '../components/common/Badge';
import { adminService } from '../../services/admin/adminService';
import { examManagementService } from '../../services/admin/examManagementService';
import { studentManagementService } from '../../services/admin/studentManagementService';
import { auditService } from '../../services/admin/systemServices';
import { statsApi } from '../../api/client';
import { useAdminStore } from '../../store/useAdminStore';
import {
  registrationTrends,
  platformActivityHourly,
  categoryDistribution,
  popularExams,
  mockTestActivityTrends,
  studentEngagementStats,
  contentRequiringVerification,
} from '../../data/admin/dashboardData';

const COLORS = ['#6955E8', '#477BEE', '#17B897', '#F4A640', '#E45B69', '#8b5cf6'];

export default function Dashboard() {
  const { dateRangeFilter, dataVersion } = useAdminStore();
  const [backendKpis, setBackendKpis] = useState(null);

  useEffect(() => {
    statsApi.getDashboardKPIs().then(setBackendKpis).catch(() => {});
  }, [dataVersion]);

  // Dynamic live KPIs recalculated from PostgreSQL backend and live models
  const kpis = useMemo(() => {
    const local = adminService.getDynamicKPIs();
    if (!backendKpis) return local;
    return {
      ...local,
      ...backendKpis,
    };
  }, [dataVersion, backendKpis]);

  const recentStudents = useMemo(() => {
    return studentManagementService.getAllStudents().slice(0, 5);
  }, [dataVersion]);

  const recentAuditLogs = useMemo(() => {
    return auditService.getAllLogs().slice(0, 5);
  }, [dataVersion]);

  const pendingApprovalsList = useMemo(() => {
    return examManagementService.getCustomExamRequests()
      .filter((r) => r.status === 'Pending' || r.status === 'Under Review')
      .slice(0, 4);
  }, [dataVersion]);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">Platform Dashboard</h1>
          <p className="text-xs text-admin-muted mt-1">
            Real-time operational metrics and comprehensive control overview · Viewing {dateRangeFilter}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/exams/new" className="admin-btn-primary text-xs">
            + Add Examination
          </Link>
          <Link to="/admin/custom-exams" className="admin-btn-outline text-xs">
            Review Submissions ({kpis.pendingApprovals})
          </Link>
        </div>
      </div>

      {/* SECTION: 10 KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatsCard
          title="Total Students"
          value={kpis.totalStudents}
          trend="+14.2%"
          trendPositive={true}
          icon={Users}
          color="#6955E8"
          subtitle="Enrolled aspirants"
        />
        <StatsCard
          title="Active Students"
          value={kpis.activeStudents}
          trend="+8.5%"
          trendPositive={true}
          icon={CheckCircle2}
          color="#17B897"
          subtitle="Active this month"
        />
        <StatsCard
          title="Examinations"
          value={kpis.totalExaminations}
          trend="+4 new"
          trendPositive={true}
          icon={GraduationCap}
          color="#477BEE"
          subtitle="In catalogue"
        />
        <StatsCard
          title="Subjects"
          value={kpis.totalSubjects}
          icon={Layers}
          color="#8b5cf6"
          subtitle="Mapped disciplines"
        />
        <StatsCard
          title="Syllabus Topics"
          value={kpis.totalSyllabusTopics}
          icon={BookOpen}
          color="#F4A640"
          subtitle="Curated learning units"
        />
        <StatsCard
          title="Total Questions"
          value={kpis.totalQuestions}
          trend="+250"
          trendPositive={true}
          icon={HelpCircle}
          color="#06b6d4"
          subtitle="Question bank"
        />
        <StatsCard
          title="Mock Tests"
          value={kpis.publishedMockTests}
          icon={FileQuestion}
          color="#18A878"
          subtitle="Published tests"
        />
        <StatsCard
          title="Completed Mocks"
          value={kpis.completedMockTests}
          trend="+18%"
          trendPositive={true}
          icon={Award}
          color="#477BEE"
          subtitle="Student attempts"
        />
        <StatsCard
          title="Pending Approvals"
          value={kpis.pendingApprovals}
          icon={Inbox}
          color="#E45B69"
          trend={kpis.pendingApprovals > 0 ? 'Requires action' : 'All clear'}
          trendPositive={kpis.pendingApprovals === 0}
          subtitle="Custom exam requests"
        />
        <StatsCard
          title="AI Roadmaps"
          value={kpis.aiRoadmapsGenerated}
          trend="+22%"
          trendPositive={true}
          icon={Sparkles}
          color="#6955E8"
          subtitle="Generated schedules"
        />
      </div>

      {/* SECTION 1 & 2: CHARTS ROW (Registrations & Hourly Platform Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Student Registration Trends (Line Chart) */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-admin-text">Student Registration Trends</h2>
              <p className="text-[11px] text-admin-muted">Daily registrations vs active users</p>
            </div>
            <Badge variant="brand">Last 7 Days</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF2" vertical={false} />
                <XAxis dataKey="date" stroke="#737D91" fontSize={11} tickLine={false} />
                <YAxis stroke="#737D91" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8EAF2',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  name="New Registrations"
                  stroke="#6955E8"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  name="Active Aspirants"
                  stroke="#17B897"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Platform Activity (Bar Chart) */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-admin-text">Hourly Platform Activity</h2>
              <p className="text-[11px] text-admin-muted">Practice questions, mock test attempts & roadmaps</p>
            </div>
            <Badge variant="brand">24 Hour Distribution</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformActivityHourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF2" vertical={false} />
                <XAxis dataKey="hour" stroke="#737D91" fontSize={11} tickLine={false} />
                <YAxis stroke="#737D91" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8EAF2',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="practiceQuestions" name="Questions Solved" fill="#6955E8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mockAttempts" name="Mock Attempts" fill="#477BEE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 3 & 4: CATEGORY BREAKDOWN & POPULAR EXAMS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Examination Category Distribution (Pie / Donut Chart) */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-admin-text">Exam Category Share</h2>
              <p className="text-[11px] text-admin-muted">Percentage breakdown of catalogue</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8EAF2',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
            {categoryDistribution.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate text-slate-600 text-[11px]">{cat.name}</span>
                <span className="ml-auto font-bold text-slate-800 text-[11px]">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Popular Examinations Table */}
        <div className="admin-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-admin-text">Most Enrolled Examinations</h2>
              <p className="text-[11px] text-admin-muted">Top exams by active student roadmaps and engagement</p>
            </div>
            <Link to="/admin/exams" className="text-xs font-semibold text-admin-primary hover:underline flex items-center gap-1">
              View Catalogue <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-admin-muted border-b border-admin-border">
                <tr>
                  <th className="px-3 py-2.5 font-bold">Examination</th>
                  <th className="px-3 py-2.5 font-bold">Category</th>
                  <th className="px-3 py-2.5 font-bold text-right">Enrollees</th>
                  <th className="px-3 py-2.5 font-bold text-right">Roadmaps</th>
                  <th className="px-3 py-2.5 font-bold text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {popularExams.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-50 transition">
                    <td className="px-3 py-2.5 font-bold text-admin-text">{ex.name}</td>
                    <td className="px-3 py-2.5 text-slate-500">{ex.category}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-slate-700">{ex.enrollees.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">{ex.activeRoadmaps.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-emerald-600">{ex.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 5, 6, 7: RECENT REGISTRATIONS, ADMIN TIMELINE, PENDING APPROVALS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 5. Recent Student Registrations */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-3">
            <h2 className="text-sm font-bold text-admin-text">Recent Registrations</h2>
            <Link to="/admin/students" className="text-xs text-admin-primary hover:underline">
              All Students
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentStudents.map((s) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="truncate">
                    <div className="text-xs font-bold text-admin-text truncate">{s.name}</div>
                    <div className="text-[11px] text-admin-muted truncate">{s.primaryExamName}</div>
                  </div>
                </div>
                <Badge variant={s.accountStatus}>{s.accountStatus}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Recent Admin Activities (Audit Trail) */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-3">
            <h2 className="text-sm font-bold text-admin-text">Recent Audit Trail</h2>
            <Link to="/admin/audit-logs" className="text-xs text-admin-primary hover:underline">
              Full Logs
            </Link>
          </div>

          <div className="space-y-3">
            {recentAuditLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 text-xs">
                <div className="mt-1 h-2 w-2 rounded-full bg-admin-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-admin-text truncate">{log.description}</div>
                  <div className="text-[11px] text-admin-muted flex items-center gap-1 mt-0.5">
                    <span>{log.adminName}</span> · <span>{log.module}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Pending Examination Approvals */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-3">
            <h2 className="text-sm font-bold text-admin-text">Pending Approvals</h2>
            <Link to="/admin/custom-exams" className="text-xs text-admin-primary hover:underline">
              Review All
            </Link>
          </div>

          {pendingApprovalsList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">All submissions reviewed!</div>
          ) : (
            <div className="space-y-3">
              {pendingApprovalsList.map((req) => (
                <div key={req.id} className="rounded-xl border border-admin-border p-3 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-admin-text truncate">{req.examName}</span>
                    <Badge variant={req.status}>{req.status}</Badge>
                  </div>
                  <div className="text-[11px] text-admin-muted mt-1">
                    Submitted by: <strong className="text-slate-700">{req.studentName}</strong> ({req.conductingOrg})
                  </div>
                  <div className="mt-2.5 flex items-center justify-end">
                    <Link
                      to="/admin/custom-exams"
                      className="text-[11px] font-bold text-admin-primary hover:underline flex items-center gap-1"
                    >
                      Review & Approve <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 8, 9, 10: CONTENT REQUIRING VERIFICATION, MOCK TEST AREA CHART, STUDENT ENGAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 8. Content Requiring Verification */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-3">
            <h2 className="text-sm font-bold text-admin-text">Content Awaiting Verification</h2>
            <Link to="/admin/review" className="text-xs text-admin-primary hover:underline">
              Review Queue
            </Link>
          </div>

          <div className="space-y-2.5">
            {contentRequiringVerification.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-100 p-2.5 hover:bg-slate-50 transition text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 truncate">{item.title}</span>
                  <Badge variant={item.priority}>{item.priority}</Badge>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.type} · by {item.submittedBy}</span>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Recent Mock Test Activity (Area Chart) */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-3">
            <div>
              <h2 className="text-sm font-bold text-admin-text">Mock Test Volume</h2>
              <p className="text-[11px] text-admin-muted">Weekly mock test attempts</p>
            </div>
            <Badge variant="brand">Attempts</Badge>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTestActivityTrends}>
                <defs>
                  <linearGradient id="mockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#477BEE" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#477BEE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF2" vertical={false} />
                <XAxis dataKey="day" stroke="#737D91" fontSize={11} tickLine={false} />
                <YAxis stroke="#737D91" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8EAF2',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="attempts" stroke="#477BEE" strokeWidth={2} fillOpacity={1} fill="url(#mockGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 10. Student Performance Overview (Bar Chart) */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-3">
            <div>
              <h2 className="text-sm font-bold text-admin-text">Subject Accuracy %</h2>
              <p className="text-[11px] text-admin-muted">Platform-wide student average score</p>
            </div>
            <Link to="/admin/student-performance" className="text-xs text-admin-primary hover:underline">
              Detailed Analytics
            </Link>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentEngagementStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF2" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#737D91" fontSize={10} />
                <YAxis dataKey="subject" type="category" width={95} stroke="#737D91" fontSize={9.5} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8EAF2',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="accuracy" fill="#17B897" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

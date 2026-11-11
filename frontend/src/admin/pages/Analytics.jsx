import { useState } from 'react';
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Download,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Sparkles,
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
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import StatsCard from '../components/common/StatsCard';
import ExportButton from '../components/common/ExportButton';
import Badge from '../components/common/Badge';

const studentGrowthData = [
  { month: 'Jun', total: 6400, active: 4200 },
  { month: 'Jul', total: 7800, active: 5100 },
  { month: 'Aug', total: 9500, active: 6400 },
  { month: 'Sep', total: 11200, active: 7800 },
  { month: 'Oct', total: 13100, active: 8900 },
  { month: 'Nov', total: 14250, active: 9840 },
];

const mockAnalytics = [
  { test: 'JEE Main CBT #1', avgScore: 168, takers: 3420, passRate: 74 },
  { test: 'SSC CGL Tier 1', avgScore: 134, takers: 4120, passRate: 68 },
  { test: 'UPSC Prelims GS-1', avgScore: 92, takers: 2950, passRate: 54 },
  { test: 'IBPS PO Prelims', avgScore: 32, takers: 2100, passRate: 62 },
];

const COLORS = ['#6955E8', '#477BEE', '#17B897', '#F4A640', '#E45B69'];

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('Last 6 Months');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Platform Analytics & Intelligence
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Student retention cohorts, examination popularity distributions, assessment performance, and learning velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton data={studentGrowthData} filename="student-growth-analytics.csv" label="Export Cohort Data" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Active Rate"
          value="69.1%"
          trend="+4.2%"
          trendPositive={true}
          icon={Users}
          color="#6955E8"
          subtitle="9,840 of 14,250 registered"
        />
        <StatsCard
          title="Avg Mock Test Score"
          value="74.5%"
          trend="+2.1%"
          trendPositive={true}
          icon={Award}
          color="#17B897"
          subtitle="Across 68.9K test attempts"
        />
        <StatsCard
          title="Syllabus Completion"
          value="62.8%"
          trend="+5.8%"
          trendPositive={true}
          icon={BookOpen}
          color="#477BEE"
          subtitle="Average across all roadmaps"
        />
        <StatsCard
          title="Roadmap Generation"
          value="18,450"
          trend="+22%"
          trendPositive={true}
          icon={Sparkles}
          color="#F4A640"
          subtitle="Simulated study schedules"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Enrolment Cohorts */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-admin-text">Student Base Growth</h2>
              <p className="text-[11px] text-admin-muted">Total registered vs Monthly Active Aspirants (MAU)</p>
            </div>
            <Badge variant="brand">{timeframe}</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF2" vertical={false} />
                <XAxis dataKey="month" stroke="#737D91" fontSize={11} tickLine={false} />
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
                <Line type="monotone" dataKey="total" name="Total Aspirants" stroke="#6955E8" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="active" name="Active MAU" stroke="#17B897" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assessment Benchmark */}
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-admin-border pb-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-admin-text">Assessment Benchmarks</h2>
              <p className="text-[11px] text-admin-muted">Average pass rates and participant volume per mock test</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF2" vertical={false} />
                <XAxis dataKey="test" stroke="#737D91" fontSize={10} tickLine={false} />
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
                <Bar dataKey="passRate" name="Pass Rate %" fill="#477BEE" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgScore" name="Avg Score" fill="#17B897" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

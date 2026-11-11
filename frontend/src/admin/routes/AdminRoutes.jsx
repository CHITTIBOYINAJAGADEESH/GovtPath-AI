import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminGuard from '../components/common/AdminGuard';

const page = (name) => lazy(() => import(`../pages/${name}.jsx`));

const Dashboard = page('Dashboard');
const Exams = page('Exams');
const AddEditExam = page('AddEditExam');
const Categories = page('Categories');
const CustomExams = page('CustomExams');
const ExamPatterns = page('ExamPatterns');

const Syllabus = page('Syllabus');
const Subjects = page('Subjects');
const Topics = page('Topics');
const LearningResources = page('LearningResources');

const Questions = page('Questions');
const AddEditQuestion = page('AddEditQuestion');
const BulkImport = page('BulkImport');
const MockTests = page('MockTests');
const TestResults = page('TestResults');

const RoadmapTemplates = page('RoadmapTemplates');
const RoadmapRules = page('RoadmapRules');
const GeneratedRoadmaps = page('GeneratedRoadmaps');
const AIFeedback = page('AIFeedback');

const Students = page('Students');
const StudentPerformance = page('StudentPerformance');

const Jobs = page('Jobs');
const JobNotifications = page('JobNotifications');

const Content = page('Content');
const Notifications = page('Notifications');
const ReviewQueue = page('ReviewQueue');
const Feedback = page('Feedback');

const Analytics = page('Analytics');
const ExamAnalytics = page('ExamAnalytics');
const Reports = page('Reports');

const Roles = page('Roles');
const AuditLogs = page('AuditLogs');
const Settings = page('Settings');

export default function AdminRoutes() {
  return (
    <AdminGuard>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center bg-[#F7F8FC]">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-6 shadow-admin-card border border-admin-border">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-admin-primary border-t-transparent" />
              <span className="text-xs font-bold text-admin-text">Loading Admin Console...</span>
            </div>
          </div>
        }
      >
        <Routes>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            
            {/* Main */}
            <Route path="dashboard" element={<Dashboard />} />

            {/* Exam Management */}
            <Route path="exams" element={<Exams />} />
            <Route path="exams/new" element={<AddEditExam />} />
            <Route path="exams/edit/:examId" element={<AddEditExam />} />
            <Route path="categories" element={<Categories />} />
            <Route path="custom-exams" element={<CustomExams />} />
            <Route path="patterns" element={<ExamPatterns />} />

            {/* Syllabus Management */}
            <Route path="syllabus" element={<Syllabus />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="topics" element={<Topics />} />
            <Route path="learning-resources" element={<LearningResources />} />

            {/* Assessment Management */}
            <Route path="questions" element={<Questions />} />
            <Route path="questions/new" element={<AddEditQuestion />} />
            <Route path="questions/edit/:questionId" element={<AddEditQuestion />} />
            <Route path="questions/bulk-import" element={<BulkImport />} />
            <Route path="mock-tests" element={<MockTests />} />
            <Route path="test-results" element={<TestResults />} />

            {/* AI Management */}
            <Route path="ai-roadmaps" element={<RoadmapTemplates />} />
            <Route path="ai-rules" element={<RoadmapRules />} />
            <Route path="generated-roadmaps" element={<GeneratedRoadmaps />} />
            <Route path="ai-feedback" element={<AIFeedback />} />

            {/* Student Management */}
            <Route path="students" element={<Students />} />
            <Route path="student-performance" element={<StudentPerformance />} />

            {/* Recruitment */}
            <Route path="jobs" element={<Jobs />} />
            <Route path="job-notifications" element={<JobNotifications />} />

            {/* Platform Management */}
            <Route path="content" element={<Content />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="review" element={<ReviewQueue />} />
            <Route path="feedback" element={<Feedback />} />

            {/* Analytics */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="exam-analytics" element={<ExamAnalytics />} />
            <Route path="reports" element={<Reports />} />

            {/* System */}
            <Route path="roles" element={<Roles />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="settings" element={<Settings />} />

            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </AdminGuard>
  );
}

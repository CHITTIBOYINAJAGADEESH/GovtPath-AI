import { lazy, Suspense, useEffect } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { syncExamsFromBackend } from './services/examService';
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';

const page = (name) => lazy(() => import(`./pages/${name}.jsx`));
const Landing = page('Landing');
const Explore = page('Explore');
const ExamDetail = page('ExamDetail');
const Login = page('Login');
const Dashboard = page('Dashboard');
const Roadmap = page('Roadmap');
const Practice = page('Practice');
const MyExams = page('MyExams');
const Learning = page('Learning');
const MockTests = page('MockTests');
const TestAttempt = page('TestAttempt');
const Results = page('Results');
const Analytics = page('Analytics');
const AITutor = page('AITutor');
const Planner = page('Planner');
const GovernmentJobs = page('GovernmentJobs');
const Saved = page('Saved');
const Settings = page('Settings');
const Onboarding = page('Onboarding');

// Admin portal route module
const AdminRoutes = lazy(() => import('./admin/routes/AdminRoutes'));

function Guard({ children }) {
  return useStore((state) => state.user) ? children : <Navigate to="/login" replace />;
}

export default function App() {
  useEffect(() => {
    syncExamsFromBackend();
  }, []);

  return (
    <Suspense
      fallback={
        <div className="p-10">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Portal Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/exams" element={<Explore />} />
            <Route path="/exams/:examId" element={<ExamDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login register />} />
            <Route
              path="/onboarding"
              element={
                <Guard>
                  <Onboarding />
                </Guard>
              }
            />
          </Route>

          {/* Student App Portal Routes */}
          <Route
            path="/app"
            element={
              <Guard>
                <AppLayout />
              </Guard>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="explore-exams" element={<Explore />} />
            <Route path="my-exams" element={<MyExams />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="learning" element={<Learning />} />
            <Route path="practice" element={<Practice />} />
            <Route path="mock-tests" element={<MockTests />} />
            <Route path="mock-tests/:testId/attempt" element={<TestAttempt />} />
            <Route path="results" element={<Results />} />
            <Route path="results/:attemptId" element={<Results />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="ai-tutor" element={<AITutor />} />
            <Route path="planner" element={<Planner />} />
            <Route path="government-jobs" element={<GovernmentJobs />} />
            <Route path="saved" element={<Saved />} />
            <Route path="settings" element={<Settings />} />
            <Route path="exams/:examId" element={<ExamDetail />} />
          </Route>

          {/* Admin Management Portal Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="p-16 text-center">
                Page not found.{' '}
                <Link className="text-brand-600 underline" to="/">
                  Go home
                </Link>
              </div>
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

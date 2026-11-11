import { useState } from 'react';
import { FileSpreadsheet, Download, Calendar, Filter, FileText } from 'lucide-react';
import ExportButton from '../components/common/ExportButton';
import { studentManagementService } from '../../services/admin/studentManagementService';
import { examManagementService } from '../../services/admin/examManagementService';
import { mockTestManagementService } from '../../services/admin/mockTestManagementService';
import { auditService } from '../../services/admin/systemServices';

export default function Reports() {
  const [reportType, setReportType] = useState('students');

  const students = studentManagementService.getAllStudents();
  const exams = examManagementService.getAllExams();
  const mockTests = mockTestManagementService.getAllMockTests();
  const auditLogs = auditService.getAllLogs();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-admin-text tracking-tight">
          Performance & Compliance Reports
        </h1>
        <p className="text-xs text-admin-muted mt-1">
          Generate comprehensive audit, learner progression, and catalog compliance reports with instant CSV download.
        </p>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report 1 */}
        <div className="admin-card space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-bold text-sm text-admin-text block">Student Performance Summary</span>
              <p className="text-xs text-admin-muted mt-0.5">
                Full export of registered students, target exams, study hours, syllabus %, and diagnostic scores.
              </p>
            </div>
            <FileSpreadsheet className="text-admin-primary shrink-0" size={24} />
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500 font-mono">{students.length} Student Records</span>
            <ExportButton data={students} filename="student-performance-report.csv" label="Download Report" />
          </div>
        </div>

        {/* Report 2 */}
        <div className="admin-card space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-bold text-sm text-admin-text block">Examination Catalogue Directory</span>
              <p className="text-xs text-admin-muted mt-0.5">
                Complete audit of official examinations, conducting bodies, regional scopes, and eligibility criteria.
              </p>
            </div>
            <FileSpreadsheet className="text-admin-secondary shrink-0" size={24} />
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500 font-mono">{exams.length} Examination Records</span>
            <ExportButton data={exams} filename="examination-catalogue-report.csv" label="Download Report" />
          </div>
        </div>

        {/* Report 3 */}
        <div className="admin-card space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-bold text-sm text-admin-text block">Mock Assessment Benchmarks</span>
              <p className="text-xs text-admin-muted mt-0.5">
                Test configurations, duration settings, negative marking rules, attempts count, and average scores.
              </p>
            </div>
            <FileSpreadsheet className="text-emerald-600 shrink-0" size={24} />
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500 font-mono">{mockTests.length} Assessment Records</span>
            <ExportButton data={mockTests} filename="assessment-benchmark-report.csv" label="Download Report" />
          </div>
        </div>

        {/* Report 4 */}
        <div className="admin-card space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-bold text-sm text-admin-text block">Administrative Audit Trail</span>
              <p className="text-xs text-admin-muted mt-0.5">
                Chronological log of administrative actions, approvals, syllabus edits, and security events.
              </p>
            </div>
            <FileSpreadsheet className="text-amber-500 shrink-0" size={24} />
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500 font-mono">{auditLogs.length} Log Entries</span>
            <ExportButton data={auditLogs} filename="administrative-audit-trail.csv" label="Download Report" />
          </div>
        </div>
      </div>
    </div>
  );
}

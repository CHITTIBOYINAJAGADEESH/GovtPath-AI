import { useState, useMemo } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  MessageSquare,
  FileText,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { examManagementService } from '../../services/admin/examManagementService';
import { reviewService } from '../../services/admin/systemServices';
import { useAdminStore } from '../../store/useAdminStore';

export default function ReviewQueue() {
  const { dataVersion, refreshData } = useAdminStore();
  const [inspectItem, setInspectItem] = useState(null);
  const [reviewNote, setReviewNote] = useState('');

  // Aggregate pending items across modules
  const queueItems = useMemo(() => {
    const customExams = examManagementService.getCustomExamRequests();
    const feedbacks = reviewService.getAllFeedback();

    const items = [
      ...customExams.map((ce) => ({
        id: ce.id,
        title: `Custom Exam: ${ce.examName}`,
        module: 'Custom Exams',
        submittedBy: ce.studentName,
        submittedAt: ce.submittedAt,
        status: ce.status,
        details: `${ce.conductingOrg} · ${ce.qualification} · ${ce.syllabusSummary}`,
        raw: ce,
      })),
      ...feedbacks.map((fb) => ({
        id: fb.id,
        title: `${fb.type}: ${fb.subject}`,
        module: 'Student Feedback',
        submittedBy: fb.studentName,
        submittedAt: fb.date,
        status: fb.status,
        details: fb.message,
        raw: fb,
      })),
    ];

    return items;
  }, [dataVersion]);

  const handleAction = (status) => {
    if (!inspectItem) return;

    if (inspectItem.module === 'Custom Exams') {
      examManagementService.updateCustomExamStatus(inspectItem.id, {
        status,
        adminComments: reviewNote,
      });
    } else {
      reviewService.updateFeedbackStatus(inspectItem.id, {
        status,
        adminNotes: reviewNote,
      });
    }

    refreshData();
    toast.success(`Marked as ${status}`);
    setInspectItem(null);
    setReviewNote('');
  };

  const columns = [
    {
      header: 'Queue Item',
      key: 'title',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted line-clamp-1">{row.details}</span>
        </div>
      ),
    },
    {
      header: 'Module Stream',
      key: 'module',
      sortable: true,
      render: (val) => <Badge variant="brand">{val}</Badge>,
    },
    {
      header: 'Submitted By',
      key: 'submittedBy',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800">{val}</span>,
    },
    {
      header: 'Submission Time',
      key: 'submittedAt',
      sortable: true,
      render: (val) => (
        <span className="font-mono text-[11px] text-slate-500">
          {new Date(val).toLocaleDateString()}
        </span>
      ),
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
          onClick={() => {
            setInspectItem(row);
            setReviewNote('');
          }}
          title="Review Item"
          className="px-2.5 py-1 bg-admin-primary/10 text-admin-primary hover:bg-admin-primary hover:text-white rounded-lg text-xs font-semibold transition"
        >
          Review
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Centralized Review Queue
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Single moderation workspace for custom examination proposals, content reports, and student inquiries.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={queueItems}
        searchKey="title"
        searchPlaceholder="Search review queue..."
        exportFilename="review-queue-moderation.csv"
      />

      {inspectItem && (
        <Modal
          isOpen={!!inspectItem}
          onClose={() => setInspectItem(null)}
          title={`Moderation: ${inspectItem.title}`}
          subtitle={`Submitted by ${inspectItem.submittedBy} · ${inspectItem.module}`}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-admin-border bg-slate-50 p-4">
              <span className="font-bold text-admin-muted uppercase text-[10px] block mb-1">
                Item Overview & Payload:
              </span>
              <p className="text-slate-800 leading-relaxed text-sm">{inspectItem.details}</p>
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">
                Moderator Review Notes / Audit Reason
              </label>
              <textarea
                rows={2}
                placeholder="State evaluation notes, citations, or instructions..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                className="admin-input"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => handleAction('Rejected')}
                className="admin-btn-danger"
              >
                Reject Submission
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAction('Needs Changes')}
                  className="admin-btn-outline text-amber-700 border-amber-200"
                >
                  Request Changes
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('Approved')}
                  className="admin-btn-primary bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 size={14} /> Approve & Publish
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

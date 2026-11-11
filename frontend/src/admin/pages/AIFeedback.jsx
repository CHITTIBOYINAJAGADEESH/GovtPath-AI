import { useState, useMemo } from 'react';
import { MessageSquareShare, Star, CheckCircle, Clock, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { reviewService } from '../../services/admin/systemServices';
import { useAdminStore } from '../../store/useAdminStore';

export default function AIFeedback() {
  const { dataVersion, refreshData } = useAdminStore();
  const [inspectFeedback, setInspectFeedback] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const feedbackList = useMemo(() => {
    return reviewService.getAllFeedback().filter((f) => f.type.includes('AI'));
  }, [dataVersion]);

  const handleResolve = () => {
    if (!inspectFeedback) return;
    try {
      reviewService.updateFeedbackStatus(inspectFeedback.id, {
        status: 'Resolved',
        adminNotes: adminNotes || inspectFeedback.adminNotes,
      });
      refreshData();
      toast.success('Feedback marked as resolved');
      setInspectFeedback(null);
    } catch (err) {
      toast.error('Failed to update feedback');
    }
  };

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
      header: 'Feedback Stream',
      key: 'type',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800">{val}</span>,
    },
    {
      header: 'Rating',
      key: 'rating',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-1 text-amber-500 font-bold">
          <Star size={13} className="fill-amber-400" />
          <span>{val} / 5</span>
        </div>
      ),
    },
    {
      header: 'Target Examination',
      key: 'exam',
      sortable: true,
      render: (val) => <span className="text-slate-600 font-medium">{val}</span>,
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
            setInspectFeedback(row);
            setAdminNotes(row.adminNotes || '');
          }}
          title="Inspect Feedback"
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
            AI Tutor & Roadmap Feedback
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Student evaluations, prompt satisfaction ratings, and model refinement requests.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={feedbackList}
        searchKey="studentName"
        searchPlaceholder="Search feedback..."
        exportFilename="ai-tutor-feedback.csv"
      />

      {inspectFeedback && (
        <Modal
          isOpen={!!inspectFeedback}
          onClose={() => setInspectFeedback(null)}
          title={`Feedback: ${inspectFeedback.subject}`}
          subtitle={`From ${inspectFeedback.studentName} · Rating: ${inspectFeedback.rating}/5`}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl bg-slate-50 border border-admin-border p-4">
              <span className="font-bold text-admin-muted uppercase text-[10px] block mb-1">
                Student Commentary:
              </span>
              <p className="text-slate-800 text-sm leading-relaxed">{inspectFeedback.message}</p>
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">
                Engineering Notes / Follow-up Action
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Action taken or prompt tuning details..."
                className="admin-input"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-admin-muted">
                Status: <strong>{inspectFeedback.status}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectFeedback(null)}
                  className="admin-btn-outline"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleResolve}
                  className="admin-btn-primary bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle size={14} /> Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

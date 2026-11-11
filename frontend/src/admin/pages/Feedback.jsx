import { useState, useMemo } from 'react';
import { MessageSquare, Star, CheckCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { reviewService } from '../../services/admin/systemServices';
import { useAdminStore } from '../../store/useAdminStore';

export default function Feedback() {
  const { dataVersion, refreshData } = useAdminStore();
  const [inspectItem, setInspectItem] = useState(null);

  const feedbackList = useMemo(() => {
    return reviewService.getAllFeedback();
  }, [dataVersion]);

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
      header: 'Category / Subject',
      key: 'subject',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800">{val}</span>
          <span className="block text-[11px] text-admin-muted">{row.type}</span>
        </div>
      ),
    },
    {
      header: 'Rating',
      key: 'rating',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center gap-1 font-bold text-amber-500">
          <Star size={13} className="fill-amber-400" /> {val} / 5
        </span>
      ),
    },
    {
      header: 'Examination',
      key: 'exam',
      render: (val) => <span>{val}</span>,
    },
    {
      header: 'Sentiment',
      key: 'sentiment',
      render: (val) => (
        <Badge variant={val === 'Positive' ? 'Verified' : val === 'Negative' ? 'Suspended' : 'Pending'}>
          {val}
        </Badge>
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
          onClick={() => setInspectItem(row)}
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
            Student Feedback & Experience
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Ratings, platform bug reports, tutor satisfaction, and student suggestions.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={feedbackList}
        searchKey="studentName"
        searchPlaceholder="Search feedback..."
        exportFilename="student-feedback.csv"
      />

      {inspectItem && (
        <Modal
          isOpen={!!inspectItem}
          onClose={() => setInspectItem(null)}
          title={`Feedback: ${inspectItem.subject}`}
          subtitle={`From ${inspectItem.studentName} (${inspectItem.exam})`}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <span className="font-bold text-admin-muted uppercase text-[10px] block mb-1">
                Student Feedback:
              </span>
              <p className="text-slate-800 leading-relaxed text-sm">{inspectItem.message}</p>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectItem(null)}
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

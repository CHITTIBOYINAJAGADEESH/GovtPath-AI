import { useState, useMemo } from 'react';
import { BellRing, Plus, Send, Trash2, Calendar, Users, Eye, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { notificationService } from '../../services/admin/systemServices';
import { useAdminStore } from '../../store/useAdminStore';

export default function Notifications() {
  const { dataVersion, refreshData } = useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    message: '',
    category: 'Examination Updates',
    targetAudience: 'All Registered Aspirants',
    priority: 'Normal',
    actionUrl: '/app/dashboard',
  });

  const notificationsList = useMemo(() => {
    return notificationService.getAllNotifications();
  }, [dataVersion]);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Announcement headline is required');
    if (!form.message.trim()) return toast.error('Message body is required');

    try {
      notificationService.createNotification(form);
      refreshData();
      toast.success('Announcement broadcasted to student portal!');
      setModalOpen(false);
      setForm({
        title: '',
        message: '',
        category: 'Examination Updates',
        targetAudience: 'All Registered Aspirants',
        priority: 'Normal',
        actionUrl: '/app/dashboard',
      });
    } catch (err) {
      toast.error('Failed to dispatch notification');
    }
  };

  const handleDelete = (id) => {
    notificationService.deleteNotification(id);
    refreshData();
    toast.success('Notification removed');
  };

  const columns = [
    {
      header: 'Announcement',
      key: 'title',
      sortable: true,
      render: (val, row) => (
        <div className="max-w-md">
          <div className="font-bold text-admin-text">{val}</div>
          <p className="text-[11px] text-admin-muted line-clamp-1 mt-0.5">{row.message}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      sortable: true,
      render: (val) => <Badge variant="brand">{val}</Badge>,
    },
    {
      header: 'Target Audience',
      key: 'targetAudience',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-700">{val}</span>,
    },
    {
      header: 'Delivery & Open Rate',
      key: 'deliveredCount',
      sortable: true,
      render: (val, row) => (
        <span className="font-mono text-[11px] text-slate-600">
          {val?.toLocaleString() || 0} sent ({row.openRate || '0%'} open)
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
          onClick={() => handleDelete(row.id)}
          title="Delete Announcement"
          className="p-1 text-admin-muted hover:text-admin-error rounded-lg hover:bg-red-50 transition"
        >
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Notification & Announcement Manager
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Dispatch announcements, mock test alerts, and syllabus refresh updates directly to students.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="admin-btn-primary text-xs"
        >
          <Send size={14} /> Create Announcement
        </button>
      </div>

      <DataTable
        columns={columns}
        data={notificationsList}
        searchKey="title"
        searchPlaceholder="Search notifications..."
        exportFilename="platform-notifications.csv"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Platform Announcement"
        subtitle="Broadcast announcement to student portal and mobile notification center"
      >
        <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-admin-text mb-1">Headline *</label>
            <input
              type="text"
              required
              placeholder="e.g. UPSC CSE 2027 Prelims Notification Released"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Message Body *</label>
            <textarea
              rows={3}
              required
              placeholder="Provide concise details, instructions, or action items..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="admin-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="admin-select"
              >
                {['Examination Updates', 'Mock Tests', 'Syllabus Changes', 'General Alerts'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">Target Audience</label>
              <select
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                className="admin-select"
              >
                <option value="All Registered Aspirants">All Registered Aspirants</option>
                <option value="Engineering Students">Engineering Students</option>
                <option value="UPSC Candidates">UPSC Candidates</option>
                <option value="Banking Aspirants">Banking Aspirants</option>
                <option value="SSC Candidates">SSC Candidates</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="admin-btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary">
              <Send size={14} /> Broadcast Now
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import { BellRing, Plus, Send, AlertTriangle, Calendar, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

const sampleAlerts = [
  {
    id: 'alert-1',
    title: 'Application Deadline Tomorrow: APPSC Group 2 Executive Services',
    department: 'APPSC',
    state: 'Andhra Pradesh',
    severity: 'Urgent',
    deadline: '2026-11-30',
    broadcastChannel: 'In-App + Push',
    sentTo: 14200,
    status: 'Dispatched',
  },
  {
    id: 'alert-2',
    title: 'Exam Date Postponed: RRB ALP CBT-1 to January 2027',
    department: 'Ministry of Railways',
    state: 'All India',
    severity: 'High',
    deadline: '2027-01-15',
    broadcastChannel: 'In-App Banner',
    sentTo: 18790,
    status: 'Dispatched',
  },
  {
    id: 'alert-3',
    title: 'Admit Card Released: SBI PO Preliminary Examination',
    department: 'State Bank of India',
    state: 'All India',
    severity: 'Normal',
    deadline: '2026-11-20',
    broadcastChannel: 'In-App Notification',
    sentTo: 9400,
    status: 'Dispatched',
  },
];

export default function JobNotifications() {
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: 'UPSC',
    state: 'All India',
    severity: 'Urgent',
    deadline: '',
    broadcastChannel: 'In-App Banner + Push',
  });

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Alert title is required');

    const newAlert = {
      ...form,
      id: `alert-${Date.now()}`,
      sentTo: 12500,
      status: 'Dispatched',
    };
    setAlerts([newAlert, ...alerts]);
    toast.success('Urgent job notification dispatched to all students!');
    setModalOpen(false);
  };

  const columns = [
    {
      header: 'Alert Notification',
      key: 'title',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted">
            {row.department} · {row.state}
          </span>
        </div>
      ),
    },
    {
      header: 'Severity',
      key: 'severity',
      sortable: true,
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Deadline Date',
      key: 'deadline',
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-slate-700">{val || 'Immediate'}</span>,
    },
    {
      header: 'Broadcast Reach',
      key: 'sentTo',
      sortable: true,
      render: (val, row) => (
        <span className="font-bold text-admin-primary">
          {val?.toLocaleString()} aspirants
        </span>
      ),
    },
    {
      header: 'Delivery Status',
      key: 'status',
      render: (val) => <Badge variant="Verified">{val}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Recruitment Alert Broadcasts
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Dispatch high-priority vacancy alerts, admit card drops, and application deadline countdowns.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="admin-btn-primary text-xs"
        >
          <Send size={14} /> Dispatch Alert
        </button>
      </div>

      <DataTable
        columns={columns}
        data={alerts}
        searchKey="title"
        searchPlaceholder="Search job alerts..."
        exportFilename="recruitment-alerts.csv"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast Urgent Job Alert"
        subtitle="Push flash alert to student dashboard banner and notification center"
      >
        <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-admin-text mb-1">Alert Headline *</label>
            <input
              type="text"
              required
              placeholder="e.g. Last 24 Hours to Apply: SSC CGL 2026 Registration Closing"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Department / Body</label>
              <input
                type="text"
                placeholder="e.g. Staff Selection Commission"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block font-semibold text-admin-text mb-1">Regional Scope</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Severity</label>
              <select
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
                className="admin-select"
              >
                <option value="Urgent">Urgent (Red Banner)</option>
                <option value="High">High Priority</option>
                <option value="Normal">Normal Notice</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-admin-text mb-1">Deadline Date</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="admin-input"
              />
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
              <Send size={14} /> Send Broadcast
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

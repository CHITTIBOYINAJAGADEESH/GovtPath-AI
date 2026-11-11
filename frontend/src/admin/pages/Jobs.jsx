import { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Eye,
  Calendar,
  CheckCircle2,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { jobManagementService } from '../../services/admin/jobManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function Jobs() {
  const { dataVersion, refreshData } = useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    title: '',
    department: '',
    organization: '',
    qualification: 'Bachelor Degree',
    ageLimit: '18 to 32 years',
    vacancies: '1000+',
    location: 'All India',
    state: 'All India',
    applicationStartDate: '2026-12-01',
    applicationClosingDate: '2026-12-31',
    applicationWindow: '01 Dec 2026 – 31 Dec 2026',
    url: 'https://upsc.gov.in',
    applyUrl: 'https://upsconline.nic.in',
    status: 'Verified',
    isImportant: true,
  });

  const jobsList = useMemo(() => {
    return jobManagementService.getAllJobs();
  }, [dataVersion]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Job title is required');
    if (!form.organization.trim()) return toast.error('Organization is required');

    try {
      if (editingJob) {
        jobManagementService.updateJob(editingJob.id, form);
        toast.success(`Updated job notice: ${form.title}`);
      } else {
        jobManagementService.createJob(form);
        toast.success(`Published government recruitment notice: ${form.title}`);
      }
      refreshData();
      setModalOpen(false);
    } catch (err) {
      toast.error('Failed to save job notice');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    try {
      jobManagementService.deleteJob(deleteTarget.id);
      refreshData();
      toast.success('Job notice deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  const columns = [
    {
      header: 'Recruitment Title',
      key: 'title',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted">
            {row.organization} · {row.department}
          </span>
        </div>
      ),
    },
    {
      header: 'Vacancies / Scope',
      key: 'vacancies',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-800">{val || 'Not specified'}</span>
          <span className="block text-[10px] text-admin-muted">{row.location}</span>
        </div>
      ),
    },
    {
      header: 'Application Window',
      key: 'applicationWindow',
      render: (val) => <span className="text-slate-600 font-mono text-[11px]">{val}</span>,
    },
    {
      header: 'Qualification',
      key: 'qualification',
      render: (val) => <span className="text-slate-700 line-clamp-1 max-w-xs">{val}</span>,
    },
    {
      header: 'Verification Status',
      key: 'status',
      sortable: true,
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={row.url}
            target="_blank"
            rel="noreferrer"
            title="Official Portal"
            className="p-1 text-admin-muted hover:text-admin-primary rounded-lg hover:bg-slate-100 transition"
          >
            <ExternalLink size={15} />
          </a>
          <button
            type="button"
            title="Edit Notice"
            onClick={() => {
              setEditingJob(row);
              setForm(row);
              setModalOpen(true);
            }}
            className="p-1 text-admin-muted hover:text-admin-secondary rounded-lg hover:bg-slate-100 transition"
          >
            <Edit size={15} />
          </button>
          <button
            type="button"
            title="Delete Notice"
            onClick={() => setDeleteTarget(row)}
            className="p-1 text-admin-muted hover:text-admin-error rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'Verified', label: 'Verified' },
        { value: 'Pending Verification', label: 'Pending Verification' },
        { value: 'Updated', label: 'Updated' },
        { value: 'Expired', label: 'Expired' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Government Job Notifications
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Publish official recruitment notices verified against Gazette publications for student discovery.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingJob(null);
            setForm({
              title: '',
              department: 'General Administration',
              organization: '',
              qualification: 'Graduate',
              ageLimit: '18 to 32 years',
              vacancies: '500+',
              location: 'All India',
              state: 'All India',
              applicationStartDate: '2026-12-01',
              applicationClosingDate: '2026-12-31',
              applicationWindow: '01 Dec 2026 – 31 Dec 2026',
              url: 'https://',
              applyUrl: 'https://',
              status: 'Verified',
              isImportant: true,
            });
            setModalOpen(true);
          }}
          className="admin-btn-primary text-xs"
        >
          <Plus size={14} /> Add Job Notification
        </button>
      </div>

      <DataTable
        columns={columns}
        data={jobsList}
        searchKey="title"
        searchPlaceholder="Search jobs by title or organization..."
        filterOptions={filterOptions}
        exportFilename="govtpath-job-notifications.csv"
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingJob ? 'Edit Job Notification' : 'Publish Government Recruitment Notice'}
        subtitle="Manage recruitment vacancy details, dates, and official URLs"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-admin-text mb-1">Recruitment Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Assistant Central Intelligence Officer (ACIO Grade II)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Recruiting Organization *</label>
              <input
                type="text"
                required
                placeholder="e.g. Intelligence Bureau / Ministry of Home Affairs"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block font-semibold text-admin-text mb-1">Department</label>
              <input
                type="text"
                placeholder="e.g. Directorate General"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Vacancies Count</label>
              <input
                type="text"
                placeholder="e.g. 995 Posts"
                value={form.vacancies}
                onChange={(e) => setForm({ ...form, vacancies: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block font-semibold text-admin-text mb-1">Location / State</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block font-semibold text-admin-text mb-1">Age Limit</label>
              <input
                type="text"
                value={form.ageLimit}
                onChange={(e) => setForm({ ...form, ageLimit: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Minimum Qualification</label>
              <input
                type="text"
                value={form.qualification}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block font-semibold text-admin-text mb-1">Application Dates Summary</label>
              <input
                type="text"
                value={form.applicationWindow}
                onChange={(e) => setForm({ ...form, applicationWindow: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Official Portal URL</label>
              <input
                type="url"
                required
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="admin-input font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-admin-text mb-1">Application Form Link</label>
              <input
                type="url"
                value={form.applyUrl}
                onChange={(e) => setForm({ ...form, applyUrl: e.target.value })}
                className="admin-input font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Verification Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="admin-select w-44"
              >
                <option value="Verified">Verified Official</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Updated">Updated</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="isImp"
                checked={form.isImportant}
                onChange={(e) => setForm({ ...form, isImportant: e.target.checked })}
                className="rounded border-slate-300 text-admin-primary focus:ring-admin-primary"
              />
              <label htmlFor="isImp" className="font-semibold text-admin-text cursor-pointer">
                Mark as Featured / High Priority Alert
              </label>
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
              {editingJob ? 'Save Changes' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Notification"
        message={`Are you sure you want to delete recruitment notice "${deleteTarget?.title}"?`}
      />
    </div>
  );
}

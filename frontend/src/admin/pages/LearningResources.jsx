import { useState, useMemo } from 'react';
import {
  FileText,
  Video,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Download,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { contentManagementService } from '../../services/admin/contentManagementService';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function LearningResources() {
  const { dataVersion, refreshData } = useAdminStore();
  const exams = examManagementService.getAllExams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    title: '',
    type: 'PDF Notes',
    examId: 'jee-main',
    subject: 'Physics',
    topic: 'Mechanics',
    language: 'English',
    url: 'https://cdn.govtpath.ai/resources/sample-material.pdf',
    fileSize: '3.4 MB',
    author: 'GovtPath AI Faculty',
    description: '',
    status: 'Published',
  });

  const resourcesList = useMemo(() => {
    return contentManagementService.getAllResources();
  }, [dataVersion]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Resource title is required');

    const matchedExam = exams.find((x) => x.id === form.examId);
    const payload = {
      ...form,
      examName: matchedExam ? matchedExam.name : form.examId,
      verified: true,
    };

    try {
      if (editingResource) {
        contentManagementService.updateResource(editingResource.id, payload);
        toast.success(`Updated resource: ${form.title}`);
      } else {
        contentManagementService.createResource(payload);
        toast.success(`Published learning resource: ${form.title}`);
      }
      refreshData();
      setModalOpen(false);
    } catch (err) {
      toast.error('Failed to save resource');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    try {
      contentManagementService.deleteResource(deleteTarget.id);
      refreshData();
      toast.success('Resource deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to delete resource');
    }
  };

  const columns = [
    {
      header: 'Resource Title',
      key: 'title',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted">
            {row.examName} · {row.subject} ({row.topic})
          </span>
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
          {val.includes('Video') ? <Video size={13} className="text-red-500" /> : <FileText size={13} className="text-admin-primary" />}
          {val}
        </span>
      ),
    },
    {
      header: 'Language',
      key: 'language',
      sortable: true,
      render: (val) => <span>{val}</span>,
    },
    {
      header: 'Engagement',
      key: 'views',
      sortable: true,
      render: (val, row) => (
        <span className="text-slate-600 font-mono text-[11px]">
          {val?.toLocaleString() || 0} views · {row.downloads || 0} downloads
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
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={row.url}
            target="_blank"
            rel="noreferrer"
            title="Open Resource URL"
            className="p-1 text-admin-muted hover:text-admin-primary rounded-lg hover:bg-slate-100 transition"
          >
            <ExternalLink size={15} />
          </a>
          <button
            type="button"
            title="Edit Resource"
            onClick={() => {
              setEditingResource(row);
              setForm(row);
              setModalOpen(true);
            }}
            className="p-1 text-admin-muted hover:text-admin-secondary rounded-lg hover:bg-slate-100 transition"
          >
            <Edit size={15} />
          </button>
          <button
            type="button"
            title="Delete Resource"
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
      key: 'type',
      label: 'Type',
      options: [
        { value: 'PDF Notes', label: 'PDF Notes' },
        { value: 'Video Lessons', label: 'Video Lessons' },
        { value: 'Revision Notes', label: 'Revision Notes' },
        { value: 'Articles', label: 'Articles' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Learning Resources
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Curate downloadable notes, video lectures, formula sheets, and study materials for students.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingResource(null);
            setForm({
              title: '',
              type: 'PDF Notes',
              examId: exams[0]?.id || 'jee-main',
              subject: 'Physics',
              topic: 'Mechanics',
              language: 'English',
              url: 'https://cdn.govtpath.ai/resources/study-material.pdf',
              fileSize: '4.2 MB',
              author: 'GovtPath AI Faculty',
              description: 'Formula summary and high-yield solved examples.',
              status: 'Published',
            });
            setModalOpen(true);
          }}
          className="admin-btn-primary text-xs"
        >
          <Plus size={14} /> Add Resource
        </button>
      </div>

      <DataTable
        columns={columns}
        data={resourcesList}
        searchKey="title"
        searchPlaceholder="Search study materials..."
        filterOptions={filterOptions}
        exportFilename="learning-resources.csv"
      />

      {/* Add / Edit Resource Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingResource ? 'Edit Learning Resource' : 'Add Learning Resource'}
        subtitle="Manage study material, URLs and student accessibility"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-admin-text mb-1">Resource Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kinematics Comprehensive Formula Sheet & Problem Sets"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Content Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="admin-select"
              >
                {['PDF Notes', 'Video Lessons', 'Articles', 'Revision Notes', 'Practice Materials'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">Target Examination</label>
              <select
                value={form.examId}
                onChange={(e) => setForm({ ...form, examId: e.target.value })}
                className="admin-select"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Subject</label>
              <input
                type="text"
                placeholder="e.g. Physics"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block font-semibold text-admin-text mb-1">Topic</label>
              <input
                type="text"
                placeholder="e.g. Mechanics"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Resource URL / Link</label>
            <input
              type="url"
              required
              placeholder="https://cdn.govtpath.ai/notes.pdf"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="admin-input font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Language</label>
              <input
                type="text"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block font-semibold text-admin-text mb-1">Author / Faculty</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
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
              {editingResource ? 'Save Changes' : 'Publish Resource'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Resource"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
}

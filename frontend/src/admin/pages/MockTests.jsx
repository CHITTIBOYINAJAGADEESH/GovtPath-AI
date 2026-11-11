import { useState, useMemo } from 'react';
import {
  FileQuestion,
  Plus,
  Trash2,
  Edit,
  Eye,
  Clock,
  Award,
  Users,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { mockTestManagementService } from '../../services/admin/mockTestManagementService';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function MockTests() {
  const { dataVersion, refreshData } = useAdminStore();
  const exams = examManagementService.getAllExams();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [previewTest, setPreviewTest] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    title: '',
    examId: 'jee-main',
    type: 'Full-length',
    subject: 'All Subjects',
    durationMinutes: 180,
    totalMarks: 300,
    passingMarks: 90,
    negativeMarking: true,
    negativeMarkValue: 1,
    positiveMarkValue: 4,
    questionLimit: 30,
    instructions: 'Each correct answer gives +4 marks; each incorrect answer deducts 1 mark.',
    status: 'Published',
    visibility: 'Public',
  });

  const mockTestsList = useMemo(() => {
    return mockTestManagementService.getAllMockTests();
  }, [dataVersion]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Mock test title is required');

    try {
      if (editingTest) {
        mockTestManagementService.updateMockTest(editingTest.id, form);
        toast.success(`Updated mock test: ${form.title}`);
      } else {
        mockTestManagementService.createMockTest(form);
        toast.success(`Published mock test: ${form.title}`);
      }
      refreshData();
      setModalOpen(false);
    } catch (err) {
      toast.error('Failed to save mock test');
    }
  };

  const handleTogglePublish = (test) => {
    try {
      const updated = mockTestManagementService.togglePublishStatus(test.id);
      refreshData();
      toast.success(`Mock test status updated to ${updated.status}`);
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    try {
      mockTestManagementService.deleteMockTest(deleteTarget.id);
      refreshData();
      toast.success('Mock test deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to delete mock test');
    }
  };

  const columns = [
    {
      header: 'Test Title',
      key: 'title',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted">
            {row.examId?.toUpperCase()} · {row.subject}
          </span>
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-700">{val}</span>,
    },
    {
      header: 'Duration / Marks',
      key: 'durationMinutes',
      sortable: true,
      render: (val, row) => (
        <span className="font-mono text-xs text-slate-700">
          {val} mins · {row.totalMarks} Marks ({row.questionLimit} Qs)
        </span>
      ),
    },
    {
      header: 'Attempts',
      key: 'attemptsCount',
      sortable: true,
      render: (val, row) => (
        <span className="text-slate-600 font-mono text-[11px]">
          {val?.toLocaleString() || 0} attempts (Avg: {row.avgScore || 0})
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val, row) => (
        <button
          type="button"
          onClick={() => handleTogglePublish(row)}
          title="Click to toggle publish status"
          className="cursor-pointer"
        >
          <Badge variant={val}>{val}</Badge>
        </button>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            title="Preview Mock Test"
            onClick={() => setPreviewTest(row)}
            className="p-1 text-admin-muted hover:text-admin-primary rounded-lg hover:bg-slate-100 transition"
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            title="Edit Test Configuration"
            onClick={() => {
              setEditingTest(row);
              setForm(row);
              setModalOpen(true);
            }}
            className="p-1 text-admin-muted hover:text-admin-secondary rounded-lg hover:bg-slate-100 transition"
          >
            <Edit size={15} />
          </button>
          <button
            type="button"
            title="Delete Mock Test"
            onClick={() => setDeleteTarget(row)}
            className="p-1 text-admin-muted hover:text-admin-error rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Mock Examinations Suite
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Build timed practice simulations, sectional tests, and national rank quizzes ({mockTestsList.length} total).
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTest(null);
            setForm({
              title: '',
              examId: exams[0]?.id || 'jee-main',
              type: 'Full-length',
              subject: 'All Subjects',
              durationMinutes: 180,
              totalMarks: 300,
              passingMarks: 90,
              negativeMarking: true,
              negativeMarkValue: 1,
              positiveMarkValue: 4,
              questionLimit: 30,
              instructions: 'Timed simulation test. Negative marking applies.',
              status: 'Published',
              visibility: 'Public',
            });
            setModalOpen(true);
          }}
          className="admin-btn-primary text-xs"
        >
          <Plus size={14} /> Create Mock Test
        </button>
      </div>

      <DataTable
        columns={columns}
        data={mockTestsList}
        searchKey="title"
        searchPlaceholder="Search mock tests..."
        exportFilename="govtpath-mock-tests.csv"
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTest ? 'Edit Mock Test' : 'Create New Mock Test'}
        subtitle="Configure duration, questions limit, scoring metrics and visibility"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-admin-text mb-1">Test Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. JEE Main Full-Length Simulation Mock Test #4"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block font-semibold text-admin-text mb-1">Category / Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="admin-select"
              >
                {[
                  'Full-length',
                  'Sectional',
                  'Chapter-Wise',
                  'Topic-Wise',
                  'Daily quiz',
                  'Weekly Test',
                  'Previous-Year Test',
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Duration (Mins)</label>
              <input
                type="number"
                min={5}
                max={360}
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block font-semibold text-admin-text mb-1">Total Marks</label>
              <input
                type="number"
                min={10}
                value={form.totalMarks}
                onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block font-semibold text-admin-text mb-1">Questions Limit</label>
              <input
                type="number"
                min={1}
                value={form.questionLimit}
                onChange={(e) => setForm({ ...form, questionLimit: Number(e.target.value) })}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Instructions</label>
            <textarea
              rows={2}
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              className="admin-input"
            />
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
              {editingTest ? 'Save Changes' : 'Publish Mock Test'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      {previewTest && (
        <Modal
          isOpen={!!previewTest}
          onClose={() => setPreviewTest(null)}
          title={`Preview: ${previewTest.title}`}
          subtitle={`Type: ${previewTest.type} · ${previewTest.durationMinutes} mins · ${previewTest.totalMarks} Marks`}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
              <span className="font-bold text-admin-text text-sm block">Instructions for Aspirant:</span>
              <p className="text-slate-600 leading-relaxed">{previewTest.instructions}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-admin-border p-3">
                <span className="text-admin-muted text-[10px] uppercase font-bold block">Scoring Rule</span>
                <span className="font-bold text-slate-800">+{previewTest.positiveMarkValue || 4} marks / correct</span>
                <span className="block text-red-500 font-mono text-[11px]">-{previewTest.negativeMarkValue || 1} for wrong answer</span>
              </div>
              <div className="rounded-xl border border-admin-border p-3">
                <span className="text-admin-muted text-[10px] uppercase font-bold block">Total Question Pool</span>
                <span className="font-bold text-slate-800">{previewTest.questionLimit} Questions</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewTest(null)}
                className="admin-btn-outline"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Mock Test"
        message={`Are you sure you want to delete mock test "${deleteTarget?.title}"?`}
      />
    </div>
  );
}

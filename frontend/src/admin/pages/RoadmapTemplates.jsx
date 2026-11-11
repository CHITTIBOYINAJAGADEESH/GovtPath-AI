import { useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit,
  Eye,
  Clock,
  Layers,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { roadmapManagementService } from '../../services/admin/roadmapManagementService';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function RoadmapTemplates() {
  const { dataVersion, refreshData } = useAdminStore();
  const exams = examManagementService.getAllExams();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [inspectTemplate, setInspectTemplate] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    title: '',
    examId: 'jee-main',
    category: 'engineering',
    targetLevel: 'Beginner to Advanced',
    durationWeeks: 24,
    recommendedDailyHours: 4,
    status: 'Published',
    topicPriority: 'High weightage first',
    revisionFrequency: 'Weekly on Sundays',
    mockFrequency: 'Bi-weekly during Core Phase',
  });

  const templatesList = useMemo(() => {
    return roadmapManagementService.getAllTemplates();
  }, [dataVersion]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Template title is required');

    const matchedExam = exams.find((x) => x.id === form.examId);
    const payload = {
      ...form,
      examName: matchedExam ? matchedExam.name : form.examId,
      rules: {
        topicPriority: form.topicPriority,
        revisionFrequency: form.revisionFrequency,
        mockFrequency: form.mockFrequency,
        adaptivePacing: true,
      },
      phases: [
        { name: 'Foundation Phase', weeks: 'Weeks 1–6', description: 'Core syllabus basics and conceptual checks.' },
        { name: 'Core Learning Phase', weeks: 'Weeks 7–16', description: 'Intensive topic-wise problem solving.' },
        { name: 'Advanced Revision', weeks: 'Weeks 17–20', description: 'Previous years papers and weak area drills.' },
        { name: 'Mock Test Practice', weeks: 'Weeks 21–24', description: 'Full-length timed computer based simulations.' },
      ],
    };

    try {
      if (editingTemplate) {
        roadmapManagementService.updateTemplate(editingTemplate.id, payload);
        toast.success(`Updated roadmap template: ${form.title}`);
      } else {
        roadmapManagementService.createTemplate(payload);
        toast.success(`Published AI roadmap template: ${form.title}`);
      }
      refreshData();
      setModalOpen(false);
    } catch (err) {
      toast.error('Failed to save template');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    try {
      roadmapManagementService.deleteTemplate(deleteTarget.id);
      refreshData();
      toast.success('Template deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to delete template');
    }
  };

  const columns = [
    {
      header: 'Template Title',
      key: 'title',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted font-mono">{row.examName}</span>
        </div>
      ),
    },
    {
      header: 'Target Level',
      key: 'targetLevel',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-700">{val}</span>,
    },
    {
      header: 'Duration / Pace',
      key: 'durationWeeks',
      sortable: true,
      render: (val, row) => (
        <span className="text-slate-700 font-mono text-xs">
          {val} Weeks ({row.recommendedDailyHours}h/day)
        </span>
      ),
    },
    {
      header: 'Generated Roadmaps',
      key: 'generatedCount',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-admin-primary">
          {val?.toLocaleString() || 0} students
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
          <button
            type="button"
            title="Inspect Template"
            onClick={() => setInspectTemplate(row)}
            className="p-1 text-admin-muted hover:text-admin-primary rounded-lg hover:bg-slate-100 transition"
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            title="Edit Template"
            onClick={() => {
              setEditingTemplate(row);
              setForm({
                ...row,
                topicPriority: row.rules?.topicPriority || 'High weightage first',
                revisionFrequency: row.rules?.revisionFrequency || 'Weekly',
                mockFrequency: row.rules?.mockFrequency || 'Bi-weekly',
              });
              setModalOpen(true);
            }}
            className="p-1 text-admin-muted hover:text-admin-secondary rounded-lg hover:bg-slate-100 transition"
          >
            <Edit size={15} />
          </button>
          <button
            type="button"
            title="Delete Template"
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
            AI Roadmap Templates
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Design master preparation templates that power the student AI study schedule generator.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTemplate(null);
            setForm({
              title: '',
              examId: exams[0]?.id || 'jee-main',
              category: 'engineering',
              targetLevel: 'Beginner to Advanced',
              durationWeeks: 24,
              recommendedDailyHours: 4,
              status: 'Published',
              topicPriority: 'High weightage first',
              revisionFrequency: 'Weekly on Sundays',
              mockFrequency: 'Bi-weekly during Core Phase',
            });
            setModalOpen(true);
          }}
          className="admin-btn-primary text-xs"
        >
          <Plus size={14} /> Create Template
        </button>
      </div>

      <DataTable
        columns={columns}
        data={templatesList}
        searchKey="title"
        searchPlaceholder="Search roadmap templates..."
        exportFilename="ai-roadmap-templates.csv"
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTemplate ? 'Edit Roadmap Template' : 'Create Roadmap Template'}
        subtitle="Configure preparation phases, study milestones and rules"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-admin-text mb-1">Template Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. 6-Month Intensive JEE Main Roadmap"
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
              <label className="block font-semibold text-admin-text mb-1">Preparation Level</label>
              <select
                value={form.targetLevel}
                onChange={(e) => setForm({ ...form, targetLevel: e.target.value })}
                className="admin-select"
              >
                <option value="Beginner">Beginner (Foundations first)</option>
                <option value="Intermediate">Intermediate (Balanced pace)</option>
                <option value="Advanced">Advanced (High speed & problem solving)</option>
                <option value="Beginner to Advanced">Beginner to Advanced (Comprehensive)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Duration (Weeks)</label>
              <input
                type="number"
                min={4}
                max={104}
                value={form.durationWeeks}
                onChange={(e) => setForm({ ...form, durationWeeks: Number(e.target.value) })}
                className="admin-input"
              />
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">Daily Study Hours</label>
              <input
                type="number"
                min={1}
                max={16}
                value={form.recommendedDailyHours}
                onChange={(e) => setForm({ ...form, recommendedDailyHours: Number(e.target.value) })}
                className="admin-input"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-3">
            <span className="font-bold text-admin-text block">Rule-Based Pacing Settings</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-admin-text mb-1">Topic Priority</label>
                <input
                  type="text"
                  value={form.topicPriority}
                  onChange={(e) => setForm({ ...form, topicPriority: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block font-semibold text-admin-text mb-1">Revision Cadence</label>
                <input
                  type="text"
                  value={form.revisionFrequency}
                  onChange={(e) => setForm({ ...form, revisionFrequency: e.target.value })}
                  className="admin-input"
                />
              </div>
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
              {editingTemplate ? 'Save Template' : 'Publish Template'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Inspect Modal */}
      {inspectTemplate && (
        <Modal
          isOpen={!!inspectTemplate}
          onClose={() => setInspectTemplate(null)}
          title={inspectTemplate.title}
          subtitle={`Exam: ${inspectTemplate.examName} · ${inspectTemplate.durationWeeks} Weeks`}
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-admin-text uppercase text-[10px] block">
                Preparation Phases & Milestones
              </span>
              <div className="space-y-2">
                {inspectTemplate.phases?.map((p, idx) => (
                  <div key={idx} className="rounded-xl border border-admin-border bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">{p.name}</span>
                      <span className="font-mono text-admin-primary font-bold text-[11px]">{p.weeks}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{p.description}</p>
                    {p.milestone && (
                      <div className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                        Milestone: {p.milestone}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectTemplate(null)}
                className="admin-btn-outline"
              >
                Close
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
        title="Delete Roadmap Template"
        message={`Are you sure you want to delete template "${deleteTarget?.title}"?`}
      />
    </div>
  );
}

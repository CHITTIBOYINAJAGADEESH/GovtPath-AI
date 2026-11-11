import { useState, useMemo } from 'react';
import { Layers, Plus, Trash2, Edit, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { syllabusManagementService } from '../../services/admin/syllabusManagementService';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function Subjects() {
  const { dataVersion, refreshData } = useAdminStore();
  const exams = examManagementService.getAllExams();
  const [selectedExamId, setSelectedExamId] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ examId: 'jee-main', name: '', weightage: 25 });

  const allSubjects = useMemo(() => {
    const syllabuses = syllabusManagementService.getAllSyllabuses();
    const result = [];
    Object.entries(syllabuses).forEach(([examId, syl]) => {
      syl.subjects?.forEach((sub, idx) => {
        let topicCount = 0;
        sub.chapters?.forEach((ch) => {
          topicCount += ch.topics?.length || 0;
        });
        result.push({
          id: sub.id || `${examId}-sub-${idx}`,
          examId,
          examName: exams.find((e) => e.id === examId)?.name || examId,
          name: sub.name,
          chaptersCount: sub.chapters?.length || 1,
          topicsCount: topicCount,
          weightage: sub.weightage || 25,
          status: 'Active',
        });
      });
    });
    return result;
  }, [dataVersion, exams]);

  const filteredSubjects = useMemo(() => {
    if (selectedExamId === 'all') return allSubjects;
    return allSubjects.filter((s) => s.examId === selectedExamId);
  }, [allSubjects, selectedExamId]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Subject name is required');
    try {
      syllabusManagementService.addSubject(form.examId, form);
      refreshData();
      toast.success(`Subject "${form.name}" added successfully`);
      setModalOpen(false);
      setForm({ examId: 'jee-main', name: '', weightage: 25 });
    } catch (err) {
      toast.error('Failed to create subject');
    }
  };

  const columns = [
    {
      header: 'Subject Name',
      key: 'name',
      sortable: true,
      render: (val) => <span className="font-bold text-admin-text">{val}</span>,
    },
    {
      header: 'Assigned Examination',
      key: 'examName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800">{val}</span>
          <span className="block text-[11px] text-admin-muted font-mono">{row.examId}</span>
        </div>
      ),
    },
    {
      header: 'Modules / Chapters',
      key: 'chaptersCount',
      sortable: true,
      render: (val) => <span>{val} Modules</span>,
    },
    {
      header: 'Total Topics',
      key: 'topicsCount',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-admin-primary">{val} topics</span>
      ),
    },
    {
      header: 'Weightage',
      key: 'weightage',
      sortable: true,
      render: (val) => <span>{val}%</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant="Active">{val}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">Subjects Management</h1>
          <p className="text-xs text-admin-muted mt-1">
            Global repository of examination subjects, modules, and percentage weightages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="admin-select py-1.5 px-3 text-xs w-52"
          >
            <option value="all">All Examinations</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="admin-btn-primary text-xs"
          >
            <Plus size={14} /> Add Subject
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredSubjects}
        searchKey="name"
        searchPlaceholder="Search subjects by name or examination..."
        exportFilename="govtpath-subjects.csv"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Subject"
        subtitle="Map subject to examination catalogue"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-admin-text mb-1">Target Examination *</label>
            <select
              value={form.examId}
              onChange={(e) => setForm({ ...form, examId: e.target.value })}
              className="admin-select"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Subject Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Quantitative Aptitude & Data Interpretation"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Weightage (%)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={form.weightage}
              onChange={(e) => setForm({ ...form, weightage: Number(e.target.value) })}
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
              Save Subject
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

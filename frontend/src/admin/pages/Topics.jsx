import { useState, useMemo } from 'react';
import { ListTree, Plus, Clock, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { syllabusManagementService } from '../../services/admin/syllabusManagementService';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function Topics() {
  const { dataVersion, refreshData } = useAdminStore();
  const exams = examManagementService.getAllExams();
  const [selectedExam, setSelectedExam] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const allTopics = useMemo(() => {
    const syllabuses = syllabusManagementService.getAllSyllabuses();
    const result = [];
    Object.entries(syllabuses).forEach(([examId, syl]) => {
      syl.subjects?.forEach((sub) => {
        sub.chapters?.forEach((ch) => {
          ch.topics?.forEach((t) => {
            result.push({
              id: t.id,
              examId,
              examName: exams.find((e) => e.id === examId)?.name || examId,
              subjectName: sub.name,
              chapterName: ch.name,
              name: t.name,
              difficulty: t.difficulty || 'Medium',
              estimatedHours: t.estimatedHours || 6,
              status: t.status || 'Published',
            });
          });
        });
      });
    });
    return result;
  }, [dataVersion, exams]);

  const filteredTopics = useMemo(() => {
    if (selectedExam === 'all') return allTopics;
    return allTopics.filter((t) => t.examId === selectedExam);
  }, [allTopics, selectedExam]);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    try {
      syllabusManagementService.deleteTopic(deleteTarget.examId, deleteTarget.id);
      refreshData();
      toast.success('Topic removed');
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to remove topic');
    }
  };

  const columns = [
    {
      header: 'Topic Name',
      key: 'name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted">
            {row.subjectName} · {row.chapterName}
          </span>
        </div>
      ),
    },
    {
      header: 'Examination',
      key: 'examName',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800">{val}</span>,
    },
    {
      header: 'Difficulty',
      key: 'difficulty',
      sortable: true,
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Study Time',
      key: 'estimatedHours',
      sortable: true,
      render: (val) => (
        <span className="text-slate-600 font-mono text-[11px]">{val} Hours</span>
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
        <div className="flex items-center justify-end">
          <button
            type="button"
            title="Delete Topic"
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
      key: 'difficulty',
      label: 'Difficulty',
      options: [
        { value: 'Easy', label: 'Easy' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Hard', label: 'Hard' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Chapters & Topics
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Browse, inspect difficulty parameters and manage all individual syllabus topics ({filteredTopics.length} total).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="admin-select py-1.5 px-3 text-xs w-56"
          >
            <option value="all">All Examinations</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredTopics}
        searchKey="name"
        searchPlaceholder="Search topics by title..."
        filterOptions={filterOptions}
        exportFilename="govtpath-topics.csv"
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Syllabus Topic"
        message={`Are you sure you want to remove topic "${deleteTarget?.name}"?`}
      />
    </div>
  );
}

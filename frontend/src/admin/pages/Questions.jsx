import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit,
  UploadCloud,
  FileQuestion,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { questionManagementService } from '../../services/admin/questionManagementService';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function Questions() {
  const { dataVersion, refreshData } = useAdminStore();
  const exams = examManagementService.getAllExams();
  const [selectedExam, setSelectedExam] = useState('all');
  const [inspectQuestion, setInspectQuestion] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const questionsList = useMemo(() => {
    return questionManagementService.getAllQuestions();
  }, [dataVersion]);

  const filteredQuestions = useMemo(() => {
    if (selectedExam === 'all') return questionsList;
    return questionsList.filter((q) => q.examId === selectedExam);
  }, [questionsList, selectedExam]);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    try {
      questionManagementService.deleteQuestion(deleteTarget.id);
      refreshData();
      toast.success('Question deleted from bank');
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to delete question');
    }
  };

  const columns = [
    {
      header: 'Question',
      key: 'question',
      sortable: true,
      render: (val, row) => (
        <div className="max-w-md">
          <div className="font-bold text-admin-text line-clamp-2">{val}</div>
          <span className="text-[11px] text-admin-muted">
            {row.examId?.toUpperCase()} · {row.subject} ({row.topic})
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
      header: 'Difficulty',
      key: 'difficulty',
      sortable: true,
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Marks',
      key: 'marks',
      sortable: true,
      render: (val, row) => (
        <span className="font-mono text-xs">
          +{val} / {row.negativeMarks}
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
            title="Inspect Question"
            onClick={() => setInspectQuestion(row)}
            className="p-1 text-admin-muted hover:text-admin-primary rounded-lg hover:bg-slate-100 transition"
          >
            <Eye size={15} />
          </button>
          <Link
            to={`/admin/questions/edit/${row.id}`}
            title="Edit Question"
            className="p-1 text-admin-muted hover:text-admin-secondary rounded-lg hover:bg-slate-100 transition"
          >
            <Edit size={15} />
          </Link>
          <button
            type="button"
            title="Delete Question"
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
    {
      key: 'type',
      label: 'Type',
      options: [
        { value: 'Single Correct MCQ', label: 'Single Correct MCQ' },
        { value: 'Multiple Correct MCQ', label: 'Multiple Correct MCQ' },
        { value: 'Numerical Answer', label: 'Numerical Answer' },
        { value: 'True/False', label: 'True/False' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">Question Bank</h1>
          <p className="text-xs text-admin-muted mt-1">
            Central repository of practice and examination questions ({filteredQuestions.length} records available).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="admin-select py-1.5 px-3 text-xs w-52"
          >
            <option value="all">All Examinations</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          <Link to="/admin/questions/bulk-import" className="admin-btn-outline text-xs">
            <UploadCloud size={14} /> Bulk Import
          </Link>

          <Link to="/admin/questions/new" className="admin-btn-primary text-xs">
            <Plus size={14} /> Add Question
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredQuestions}
        searchKey="question"
        searchPlaceholder="Search questions by text or subject..."
        filterOptions={filterOptions}
        exportFilename="govtpath-questions-bank.csv"
        bulkActions={(ids, clear) => (
          <button
            type="button"
            onClick={() => {
              ids.forEach((id) => questionManagementService.deleteQuestion(id));
              refreshData();
              clear();
              toast.success(`Deleted ${ids.length} questions`);
            }}
            className="admin-btn-danger text-xs py-1 px-3"
          >
            Delete Selected ({ids.length})
          </button>
        )}
      />

      {/* Inspect Modal */}
      {inspectQuestion && (
        <Modal
          isOpen={!!inspectQuestion}
          onClose={() => setInspectQuestion(null)}
          title="Question Details"
          subtitle={`ID: ${inspectQuestion.id} · ${inspectQuestion.examId?.toUpperCase()} (${inspectQuestion.subject})`}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-admin-border bg-slate-50 p-4 font-semibold text-slate-800 text-sm leading-relaxed">
              {inspectQuestion.question}
            </div>

            {inspectQuestion.options && inspectQuestion.options.length > 0 && (
              <div>
                <span className="font-bold text-admin-muted uppercase text-[10px] block mb-2">
                  Answer Options
                </span>
                <div className="space-y-2">
                  {inspectQuestion.options.map((opt, i) => {
                    const isCorrect = i === inspectQuestion.correctAnswer;
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-xl border p-3 ${
                          isCorrect
                            ? 'border-emerald-300 bg-emerald-50/70 text-emerald-900 font-bold'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full border flex items-center justify-center text-[10px] bg-white font-mono">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </span>
                        {isCorrect && (
                          <Badge variant="Verified" className="bg-emerald-100 text-emerald-800">
                            Correct Answer
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {inspectQuestion.explanation && (
              <div className="rounded-xl border border-admin-primary/20 bg-admin-primary/5 p-3 text-slate-700">
                <span className="font-bold text-admin-primary block mb-1">Explanation / Solution:</span>
                <p className="leading-relaxed">{inspectQuestion.explanation}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
              <div>Difficulty: <strong className="text-slate-800">{inspectQuestion.difficulty}</strong></div>
              <div>Marks: <strong className="text-slate-800">+{inspectQuestion.marks} / {inspectQuestion.negativeMarks}</strong></div>
              <div>Source: <strong className="text-slate-800">{inspectQuestion.sourceReference}</strong></div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Question"
        message="Are you sure you want to permanently delete this question from the question bank?"
      />
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Layers, Plus, Edit, Trash2, Clock, Award, ShieldAlert, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

const initialPatterns = [
  {
    id: 'pat-jee-main',
    examId: 'jee-main',
    examName: 'JEE Main',
    stages: ['Computer Based Test (CBT)'],
    totalPapers: 1,
    durationMinutes: 180,
    totalMarks: 300,
    negativeMarking: 'Yes (-1 for incorrect)',
    markingScheme: '+4 for correct, -1 for incorrect, 0 unattempted',
    sections: 'Section A: 20 MCQs; Section B: 10 Numerical (Any 5 to attempt)',
    status: 'Verified',
  },
  {
    id: 'pat-upsc-cse',
    examId: 'upsc-civil-services-exam',
    examName: 'UPSC Civil Services Exam',
    stages: ['Stage 1: Prelims', 'Stage 2: Mains Written', 'Stage 3: Personality Test'],
    totalPapers: 9,
    durationMinutes: 120,
    totalMarks: 2025,
    negativeMarking: 'Yes (1/3rd in Prelims)',
    markingScheme: 'Prelims: GS-1 (200m), CSAT (200m Qualifying). Mains: 1750m + Interview 275m',
    sections: 'GS Papers 1 to 4, Essay, Two Optional Papers, Language papers (Qualifying)',
    status: 'Verified',
  },
  {
    id: 'pat-ssc-cgl',
    examId: 'ssc-cgl',
    examName: 'SSC CGL',
    stages: ['Tier 1 (Screening)', 'Tier 2 (Selection & Skill Test)'],
    totalPapers: 2,
    durationMinutes: 60,
    totalMarks: 390,
    negativeMarking: 'Yes (0.50 in Tier 1; 1 mark in Tier 2)',
    markingScheme: 'Tier 1: 100 Qs / 200 Marks. Tier 2: Mathematical, Reasoning, English, GA, Computer, Typing',
    sections: 'Section I (Maths+Reasoning), Section II (English+GA), Section III (Computer+Typing)',
    status: 'Verified',
  },
  {
    id: 'pat-neet-ug',
    examId: 'neet-ug',
    examName: 'NEET UG',
    stages: ['Pen & Paper OMR Examination'],
    totalPapers: 1,
    durationMinutes: 200,
    totalMarks: 720,
    negativeMarking: 'Yes (-1 mark for wrong answer)',
    markingScheme: '+4 correct, -1 incorrect, 180 questions out of 200 to attempt',
    sections: 'Physics (45 Qs), Chemistry (45 Qs), Botany (45 Qs), Zoology (45 Qs)',
    status: 'Verified',
  },
];

export default function ExamPatterns() {
  const { dataVersion } = useAdminStore();
  const [patterns, setPatterns] = useState(initialPatterns);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPattern, setEditingPattern] = useState(null);

  const [form, setForm] = useState({
    examId: 'jee-main',
    examName: 'JEE Main',
    stages: 'Stage 1: Preliminary CBT',
    totalPapers: 1,
    durationMinutes: 180,
    totalMarks: 300,
    negativeMarking: 'Yes (-1 for wrong answer)',
    markingScheme: '+4 correct, -1 incorrect',
    sections: 'Section A (MCQ), Section B (Numerical)',
    status: 'Verified',
  });

  const exams = examManagementService.getAllExams();

  const handleSave = (e) => {
    e.preventDefault();
    const matchedExam = exams.find((x) => x.id === form.examId);
    const stagesArray = typeof form.stages === 'string'
      ? form.stages.split(',').map((s) => s.trim()).filter(Boolean)
      : form.stages;

    const payload = {
      ...form,
      examName: matchedExam ? matchedExam.name : form.examName,
      stages: stagesArray,
      id: editingPattern ? editingPattern.id : `pat-${Date.now()}`,
    };

    if (editingPattern) {
      setPatterns(patterns.map((p) => (p.id === editingPattern.id ? payload : p)));
      toast.success('Pattern updated');
    } else {
      setPatterns([payload, ...patterns]);
      toast.success('Pattern created');
    }

    setModalOpen(false);
  };

  const columns = [
    {
      header: 'Examination',
      key: 'examName',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted font-mono">{row.examId}</span>
        </div>
      ),
    },
    {
      header: 'Exam Stages',
      key: 'stages',
      render: (val) => (
        <span className="text-slate-600 line-clamp-1">
          {Array.isArray(val) ? val.join(' → ') : val}
        </span>
      ),
    },
    {
      header: 'Total Marks',
      key: 'totalMarks',
      sortable: true,
      render: (val) => <span className="font-bold text-slate-800">{val} Marks</span>,
    },
    {
      header: 'Duration',
      key: 'durationMinutes',
      sortable: true,
      render: (val) => <span>{val} mins</span>,
    },
    {
      header: 'Negative Marking',
      key: 'negativeMarking',
      render: (val) => <span className="text-admin-muted">{val}</span>,
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
            onClick={() => {
              setEditingPattern(row);
              setForm({
                ...row,
                stages: Array.isArray(row.stages) ? row.stages.join(', ') : row.stages,
              });
              setModalOpen(true);
            }}
            className="p-1 text-admin-muted hover:text-admin-secondary rounded-lg hover:bg-slate-100 transition"
          >
            <Edit size={15} />
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
            Examination Patterns
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Configure examination stages, section breakdowns, negative marking rules and duration limits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingPattern(null);
            setForm({
              examId: exams[0]?.id || 'jee-main',
              examName: exams[0]?.name || 'JEE Main',
              stages: 'Preliminary Screening, Main Examination, Interview',
              totalPapers: 1,
              durationMinutes: 180,
              totalMarks: 300,
              negativeMarking: 'Yes (-1 mark)',
              markingScheme: '+4 correct, -1 incorrect',
              sections: 'Section 1 (MCQ), Section 2 (Subjective/Numerical)',
              status: 'Verified',
            });
            setModalOpen(true);
          }}
          className="admin-btn-primary text-xs"
        >
          <Plus size={15} /> Add Exam Pattern
        </button>
      </div>

      <DataTable
        columns={columns}
        data={patterns}
        searchKey="examName"
        searchPlaceholder="Search examination patterns..."
        exportFilename="examination-patterns.csv"
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPattern ? 'Edit Examination Pattern' : 'Create Examination Pattern'}
        subtitle="Manage structure, question marking and duration"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-admin-text mb-1">Select Examination *</label>
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
            <label className="block font-semibold text-admin-text mb-1">
              Examination Stages (Comma separated)
            </label>
            <input
              type="text"
              required
              value={form.stages}
              onChange={(e) => setForm({ ...form, stages: e.target.value })}
              placeholder="Stage 1: Prelims, Stage 2: Mains, Stage 3: Interview"
              className="admin-input"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Duration (Mins)</label>
              <input
                type="number"
                min={10}
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
              <label className="block font-semibold text-admin-text mb-1">Total Papers</label>
              <input
                type="number"
                min={1}
                value={form.totalPapers}
                onChange={(e) => setForm({ ...form, totalPapers: Number(e.target.value) })}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Negative Marking Rule</label>
            <input
              type="text"
              value={form.negativeMarking}
              onChange={(e) => setForm({ ...form, negativeMarking: e.target.value })}
              placeholder="e.g. Yes (1/3rd deduction for incorrect answers)"
              className="admin-input"
            />
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Marking Scheme Summary</label>
            <input
              type="text"
              value={form.markingScheme}
              onChange={(e) => setForm({ ...form, markingScheme: e.target.value })}
              placeholder="+4 for correct, -1 for incorrect, 0 for unattempted"
              className="admin-input"
            />
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Sectional Breakdown</label>
            <textarea
              rows={2}
              value={form.sections}
              onChange={(e) => setForm({ ...form, sections: e.target.value })}
              placeholder="Detailed description of sections, question counts, and choices..."
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
              {editingPattern ? 'Update Pattern' : 'Save Pattern'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

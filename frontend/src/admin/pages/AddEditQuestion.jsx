import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { questionManagementService } from '../../services/admin/questionManagementService';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function AddEditQuestion() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { refreshData } = useAdminStore();
  const isEditing = !!questionId;

  const exams = examManagementService.getAllExams();

  const [form, setForm] = useState({
    examId: 'jee-main',
    subject: 'Physics',
    chapter: 'Mechanics',
    topic: 'Laws of Motion',
    question: '',
    type: 'Single Correct MCQ',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'Medium',
    marks: 4,
    negativeMarks: -1,
    language: 'English',
    sourceReference: 'Standard Syllabus Practice',
    status: 'Published',
  });

  useEffect(() => {
    if (isEditing) {
      const existing = questionManagementService.getQuestionById(questionId);
      if (existing) {
        setForm({
          ...existing,
          options: existing.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: existing.correctAnswer !== undefined ? existing.correctAnswer : 0,
        });
      } else {
        toast.error('Question not found');
        navigate('/admin/questions');
      }
    }
  }, [questionId, isEditing, navigate]);

  const handleOptionChange = (idx, value) => {
    const updated = [...form.options];
    updated[idx] = value;
    setForm({ ...form, options: updated });
  };

  const addOption = () => {
    if (form.options.length >= 6) return toast.error('Maximum 6 options allowed');
    setForm({
      ...form,
      options: [...form.options, `Option ${String.fromCharCode(65 + form.options.length)}`],
    });
  };

  const removeOption = (idx) => {
    if (form.options.length <= 2) return toast.error('Minimum 2 options required');
    const updated = form.options.filter((_, i) => i !== idx);
    let newCorrect = form.correctAnswer;
    if (newCorrect >= updated.length) newCorrect = updated.length - 1;
    setForm({ ...form, options: updated, correctAnswer: newCorrect });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.question.trim()) return toast.error('Question text is required');
    if (!form.explanation.trim()) return toast.error('Explanation is required');

    try {
      if (isEditing) {
        questionManagementService.updateQuestion(questionId, form);
        toast.success('Question updated successfully');
      } else {
        questionManagementService.createQuestion(form);
        toast.success('Question added to question bank');
      }
      refreshData();
      navigate('/admin/questions');
    } catch (err) {
      toast.error('Failed to save question');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/questions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-admin-muted hover:text-admin-text transition"
        >
          <ArrowLeft size={14} /> Back to Question Bank
        </Link>
      </div>

      <div className="admin-card">
        <div className="border-b border-admin-border pb-4 mb-6">
          <h1 className="text-xl font-black text-admin-text tracking-tight">
            {isEditing ? 'Edit Question' : 'Author New Question'}
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Configure question formulation, MCQ choices, correct key, scoring metrics and solution derivation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Target Classification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Examination *</label>
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
              <label className="block font-semibold text-admin-text mb-1">Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mathematics"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="admin-input"
              />
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">Chapter</label>
              <input
                type="text"
                placeholder="e.g. Calculus"
                value={form.chapter}
                onChange={(e) => setForm({ ...form, chapter: e.target.value })}
                className="admin-input"
              />
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">Topic</label>
              <input
                type="text"
                placeholder="e.g. Derivatives"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block font-semibold text-admin-text mb-1">
              Question Formulation / Premise *
            </label>
            <textarea
              rows={4}
              required
              placeholder="State the complete problem, equations, or scenario..."
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="admin-input"
            />
          </div>

          {/* Question Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Question Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="admin-select"
              >
                {['Single Correct MCQ', 'Multiple Correct MCQ', 'Numerical Answer', 'True/False', 'Match the Following'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="admin-select"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Options Builder */}
          {form.type.includes('MCQ') && (
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-admin-text">
                  Answer Options & Correct Key Selection
                </span>
                <button
                  type="button"
                  onClick={addOption}
                  className="admin-btn-outline text-xs px-2.5 py-1 text-admin-primary"
                >
                  <Plus size={13} /> Add Option
                </button>
              </div>

              <div className="space-y-2">
                {form.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswerKey"
                      checked={form.correctAnswer === i}
                      onChange={() => setForm({ ...form, correctAnswer: i })}
                      className="h-4 w-4 text-admin-primary focus:ring-admin-primary cursor-pointer"
                    />
                    <span className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center font-mono font-bold text-slate-600 shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + i)} text`}
                      className="admin-input flex-1"
                    />
                    {form.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="text-admin-muted hover:text-admin-error p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-admin-muted">
                Select the radio button corresponding to the correct answer choice.
              </p>
            </div>
          )}

          {/* Explanation */}
          <div className="border-t border-slate-100 pt-4">
            <label className="block font-semibold text-admin-text mb-1">
              Detailed Explanation / Step-by-Step Derivation *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explain the concept, theorem, and why the selected answer is correct..."
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              className="admin-input"
            />
          </div>

          {/* Marks & References */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Positive Marks</label>
              <input
                type="number"
                min={1}
                value={form.marks}
                onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })}
                className="admin-input"
              />
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">Negative Marks</label>
              <input
                type="number"
                max={0}
                step={0.25}
                value={form.negativeMarks}
                onChange={(e) => setForm({ ...form, negativeMarks: Number(e.target.value) })}
                className="admin-input"
              />
            </div>

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
              <label className="block font-semibold text-admin-text mb-1">Source Reference</label>
              <input
                type="text"
                value={form.sourceReference}
                onChange={(e) => setForm({ ...form, sourceReference: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <Link to="/admin/questions" className="admin-btn-outline">
              Cancel
            </Link>
            <button type="submit" className="admin-btn-primary">
              <Save size={15} />
              {isEditing ? 'Save Changes' : 'Add to Question Bank'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

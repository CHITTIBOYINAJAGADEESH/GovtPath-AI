import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileCode,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { questionManagementService } from '../../services/admin/questionManagementService';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

const SAMPLE_JSON = `[
  {
    "question": "What is the unit of electric potential difference?",
    "subject": "Physics",
    "chapter": "Electrodynamics",
    "topic": "Current Electricity",
    "difficulty": "Easy",
    "options": ["Ampere", "Volt", "Ohm", "Coulomb"],
    "correctAnswer": 1,
    "explanation": "Electric potential difference is measured in Volts (V), which is Joules per Coulomb.",
    "marks": 4,
    "negativeMarks": -1
  },
  {
    "question": "Which article of the Indian Constitution provides for the Election Commission?",
    "subject": "General Studies",
    "chapter": "Polity",
    "topic": "Constitutional Bodies",
    "difficulty": "Medium",
    "options": ["Article 324", "Article 356", "Article 280", "Article 368"],
    "correctAnswer": 0,
    "explanation": "Article 324 vests the superintendence, direction, and control of elections in an Election Commission.",
    "marks": 2,
    "negativeMarks": -0.66
  }
]`;

export default function BulkImport() {
  const navigate = useNavigate();
  const { refreshData } = useAdminStore();
  const exams = examManagementService.getAllExams();

  const [selectedExam, setSelectedExam] = useState('jee-main');
  const [inputRaw, setInputRaw] = useState(SAMPLE_JSON);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [parseError, setParseError] = useState('');

  const handleValidate = () => {
    setParseError('');
    try {
      const data = JSON.parse(inputRaw);
      if (!Array.isArray(data)) {
        throw new Error('Input must be a JSON array of question objects.');
      }
      if (data.length === 0) {
        throw new Error('The array is empty.');
      }
      // Check each item
      data.forEach((item, idx) => {
        if (!item.question) throw new Error(`Record #${idx + 1} is missing "question" field.`);
        if (!item.options || !Array.isArray(item.options)) throw new Error(`Record #${idx + 1} must have an "options" array.`);
      });
      setParsedQuestions(data);
      toast.success(`Validated ${data.length} questions successfully!`);
    } catch (err) {
      setParseError(err.message || 'Invalid JSON format');
      setParsedQuestions([]);
      toast.error('Validation failed');
    }
  };

  const handleImport = () => {
    if (parsedQuestions.length === 0) {
      return toast.error('Please validate the question dataset first');
    }

    try {
      questionManagementService.bulkImportQuestions(parsedQuestions, selectedExam);
      refreshData();
      toast.success(`Imported ${parsedQuestions.length} questions into Question Bank!`);
      navigate('/admin/questions');
    } catch (err) {
      toast.error('Bulk import failed');
    }
  };

  const downloadSampleJson = () => {
    const blob = new Blob([SAMPLE_JSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-questions-template.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded sample JSON template');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/questions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-admin-muted hover:text-admin-text transition"
        >
          <ArrowLeft size={14} /> Back to Question Bank
        </Link>
      </div>

      <div className="admin-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-admin-border pb-4">
          <div>
            <h1 className="text-xl font-black text-admin-text tracking-tight">
              Bulk Import Questions
            </h1>
            <p className="text-xs text-admin-muted mt-1">
              Batch import hundreds of questions into the central assessment database using JSON or CSV format.
            </p>
          </div>

          <button
            type="button"
            onClick={downloadSampleJson}
            className="admin-btn-outline text-xs self-start sm:self-auto"
          >
            <Download size={14} /> Download Sample Template
          </button>
        </div>

        {/* Target Examination Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-admin-text mb-1">
              Target Default Examination
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="admin-select"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.id})
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-slate-600">
            <span className="font-bold text-slate-800 block mb-0.5">Note:</span>
            If an individual question record specifies an &ldquo;examId&rdquo;, it will override this default examination.
          </div>
        </div>

        {/* Raw Editor */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-admin-text flex items-center gap-1.5">
              <FileCode size={14} className="text-admin-primary" />
              JSON Dataset Input
            </label>
            <button
              type="button"
              onClick={() => setInputRaw(SAMPLE_JSON)}
              className="text-admin-primary font-bold hover:underline"
            >
              Reset to Sample Data
            </button>
          </div>

          <textarea
            rows={10}
            value={inputRaw}
            onChange={(e) => {
              setInputRaw(e.target.value);
              setParsedQuestions([]);
            }}
            className="admin-input font-mono text-xs bg-slate-900 text-emerald-400 placeholder-slate-500"
          />

          {parseError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-admin-error font-semibold flex items-center gap-2">
              <AlertTriangle size={16} /> {parseError}
            </div>
          )}
        </div>

        {/* Validation Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleValidate}
            className="admin-btn-outline text-xs"
          >
            Validate Syntax & Structure
          </button>

          {parsedQuestions.length > 0 && (
            <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
              <CheckCircle2 size={14} /> Ready to import {parsedQuestions.length} questions
            </span>
          )}
        </div>

        {/* Preview Table */}
        {parsedQuestions.length > 0 && (
          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-admin-text">
              Preview Parsed Records ({parsedQuestions.length})
            </h2>
            <div className="max-h-60 overflow-y-auto rounded-xl border border-admin-border divide-y divide-slate-100 text-xs">
              {parsedQuestions.map((q, idx) => (
                <div key={idx} className="p-3 bg-white hover:bg-slate-50 transition">
                  <div className="font-bold text-slate-800">
                    #{idx + 1}: {q.question}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Subject: {q.subject || 'Default'} · Options: {q.options?.length || 4} · Correct: Option {String.fromCharCode(65 + (q.correctAnswer || 0))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={handleImport}
                className="admin-btn-primary"
              >
                <UploadCloud size={15} /> Confirm & Import into Question Bank
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

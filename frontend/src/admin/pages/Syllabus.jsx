import { useState, useMemo } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Clock,
  Layers,
  FileText,
  Video,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { syllabusManagementService } from '../../services/admin/syllabusManagementService';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function Syllabus() {
  const { dataVersion, refreshData } = useAdminStore();
  const exams = examManagementService.getAllExams();
  const [selectedExamId, setSelectedExamId] = useState('jee-main');

  const [expandedSubjects, setExpandedSubjects] = useState({ Physics: true, Mathematics: true });
  const [addTopicModal, setAddTopicModal] = useState(false);
  const [addSubjectModal, setAddSubjectModal] = useState(false);
  const [targetSubject, setTargetSubject] = useState(null);
  const [deleteTopicTarget, setDeleteTopicTarget] = useState(null);

  // Forms
  const [topicForm, setTopicForm] = useState({
    name: '',
    difficulty: 'Medium',
    estimatedHours: 6,
    subtopics: 'Core Principles, Worked Examples, Practice Problems',
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    weightage: 25,
    chapterName: '',
  });

  const activeSyllabus = useMemo(() => {
    return syllabusManagementService.getSyllabusByExam(selectedExamId);
  }, [selectedExamId, dataVersion]);

  const toggleSubject = (name) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleAddTopicSubmit = (e) => {
    e.preventDefault();
    if (!topicForm.name.trim()) return toast.error('Topic name is required');
    if (!targetSubject) return;

    try {
      syllabusManagementService.addTopic(selectedExamId, targetSubject.name, {
        name: topicForm.name,
        difficulty: topicForm.difficulty,
        estimatedHours: topicForm.estimatedHours,
        subtopics: topicForm.subtopics.split(',').map((s) => s.trim()).filter(Boolean),
      });

      refreshData();
      toast.success(`Topic "${topicForm.name}" added to ${targetSubject.name}!`);
      setAddTopicModal(false);
      setTopicForm({ name: '', difficulty: 'Medium', estimatedHours: 6, subtopics: '' });
    } catch (err) {
      toast.error('Failed to add topic');
    }
  };

  const handleAddSubjectSubmit = (e) => {
    e.preventDefault();
    if (!subjectForm.name.trim()) return toast.error('Subject name is required');

    try {
      syllabusManagementService.addSubject(selectedExamId, subjectForm);
      refreshData();
      toast.success(`Subject "${subjectForm.name}" added to syllabus!`);
      setAddSubjectModal(false);
      setSubjectForm({ name: '', weightage: 25, chapterName: '' });
    } catch (err) {
      toast.error('Failed to add subject');
    }
  };

  const handleDeleteTopicConfirm = () => {
    if (!deleteTopicTarget) return;
    try {
      syllabusManagementService.deleteTopic(selectedExamId, deleteTopicTarget.id);
      refreshData();
      toast.success('Topic removed from syllabus');
      setDeleteTopicTarget(null);
    } catch (err) {
      toast.error('Failed to delete topic');
    }
  };

  const handlePublishToggle = () => {
    const newStatus = activeSyllabus.status === 'Published' ? 'Draft' : 'Published';
    syllabusManagementService.updateSyllabusStatus(selectedExamId, newStatus);
    refreshData();
    toast.success(`Syllabus status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Exam Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Syllabus & Curriculum Management
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Build and update hierarchical syllabus tree: Exam → Subject → Chapter → Topic → Resources
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-admin-text">Examination:</span>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="admin-select py-1.5 px-3 text-xs font-semibold w-56"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setAddSubjectModal(true)}
            className="admin-btn-primary text-xs"
          >
            <Plus size={14} /> Add Subject
          </button>
        </div>
      </div>

      {/* Syllabus Meta Card */}
      <div className="admin-card flex flex-wrap items-center justify-between gap-4 py-3.5">
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-admin-muted text-[10px] uppercase font-bold block">Version</span>
            <span className="font-bold text-slate-800">v{activeSyllabus.version || '1.0'}</span>
          </div>
          <div>
            <span className="text-admin-muted text-[10px] uppercase font-bold block">Status</span>
            <Badge variant={activeSyllabus.status}>{activeSyllabus.status}</Badge>
          </div>
          <div>
            <span className="text-admin-muted text-[10px] uppercase font-bold block">Subjects</span>
            <span className="font-bold text-slate-800">{activeSyllabus.subjects?.length || 0}</span>
          </div>
          <div>
            <span className="text-admin-muted text-[10px] uppercase font-bold block">Verification</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={12} /> Source Verified
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePublishToggle}
            className={`admin-btn-outline text-xs ${
              activeSyllabus.status === 'Published'
                ? 'text-amber-700 hover:bg-amber-50'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {activeSyllabus.status === 'Published' ? 'Unpublish to Draft' : 'Publish to Student Portal'}
          </button>
        </div>
      </div>

      {/* Syllabus Hierarchy Tree */}
      <div className="space-y-4">
        {(!activeSyllabus.subjects || activeSyllabus.subjects.length === 0) && (
          <div className="admin-card py-12 text-center text-admin-muted text-xs">
            No subjects configured for this examination yet. Click &ldquo;+ Add Subject&rdquo; to begin.
          </div>
        )}

        {activeSyllabus.subjects?.map((subj) => {
          const isExpanded = expandedSubjects[subj.name];

          // Compute total topics in subject
          const allTopics = [];
          subj.chapters?.forEach((ch) => {
            ch.topics?.forEach((t) => allTopics.push(t));
          });

          return (
            <div
              key={subj.id || subj.name}
              className="admin-card overflow-hidden transition-all duration-200"
            >
              {/* Subject Row */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => toggleSubject(subj.name)}
                  className="flex items-center gap-2.5 text-left font-bold text-admin-text text-sm hover:text-admin-primary transition"
                >
                  {isExpanded ? (
                    <ChevronDown size={18} className="text-admin-muted" />
                  ) : (
                    <ChevronRight size={18} className="text-admin-muted" />
                  )}
                  <span>{subj.name}</span>
                  <span className="text-xs font-normal text-admin-muted">
                    ({allTopics.length} topics · {subj.weightage || 25}% weightage)
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetSubject(subj);
                      setAddTopicModal(true);
                    }}
                    className="admin-btn-outline text-xs px-2.5 py-1 text-admin-primary border-admin-primary/20"
                  >
                    <Plus size={13} /> Add Topic
                  </button>
                </div>
              </div>

              {/* Chapters & Topics List */}
              {isExpanded && (
                <div className="pt-3 space-y-4">
                  {subj.chapters?.map((chap) => (
                    <div key={chap.id || chap.name} className="space-y-2">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                        Module: {chap.name}
                      </div>

                      <div className="divide-y divide-slate-100 rounded-xl border border-admin-border bg-slate-50/50">
                        {chap.topics?.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">
                            No topics yet in this module.
                          </div>
                        ) : (
                          chap.topics?.map((topic) => (
                            <div
                              key={topic.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-white transition text-xs gap-2"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-admin-text flex items-center gap-2">
                                  <span>{topic.name}</span>
                                  <Badge variant={topic.difficulty}>{topic.difficulty}</Badge>
                                </div>
                                {topic.subtopics && topic.subtopics.length > 0 && (
                                  <div className="text-[11px] text-admin-muted mt-1 truncate">
                                    Subtopics: {topic.subtopics.join(' · ')}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-4 shrink-0">
                                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                                  <Clock size={12} /> {topic.estimatedHours || 4}h study
                                </span>

                                <button
                                  type="button"
                                  onClick={() => setDeleteTopicTarget(topic)}
                                  title="Delete Topic"
                                  className="text-admin-muted hover:text-admin-error p-1 rounded-lg hover:bg-red-50 transition"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Topic Modal */}
      <Modal
        isOpen={addTopicModal}
        onClose={() => setAddTopicModal(false)}
        title={`Add Topic to ${targetSubject?.name}`}
        subtitle={`Exam: ${selectedExamId}`}
      >
        <form onSubmit={handleAddTopicSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-admin-text mb-1">Topic Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Electromagnetic Waves & Poynting Vector"
              value={topicForm.name}
              onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
              className="admin-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Difficulty</label>
              <select
                value={topicForm.difficulty}
                onChange={(e) => setTopicForm({ ...topicForm, difficulty: e.target.value })}
                className="admin-select"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">
                Estimated Study Hours
              </label>
              <input
                type="number"
                min={1}
                max={40}
                value={topicForm.estimatedHours}
                onChange={(e) => setTopicForm({ ...topicForm, estimatedHours: Number(e.target.value) })}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">
              Subtopics (Comma separated)
            </label>
            <textarea
              rows={2}
              placeholder="Maxwell equations, Wave equation, Energy density derivation"
              value={topicForm.subtopics}
              onChange={(e) => setTopicForm({ ...topicForm, subtopics: e.target.value })}
              className="admin-input"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setAddTopicModal(false)}
              className="admin-btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary">
              Add Topic
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Subject Modal */}
      <Modal
        isOpen={addSubjectModal}
        onClose={() => setAddSubjectModal(false)}
        title={`Add Subject to ${selectedExamId}`}
      >
        <form onSubmit={handleAddSubjectSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-admin-text mb-1">Subject Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. General Science & Technology"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Weightage (%)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={subjectForm.weightage}
              onChange={(e) => setSubjectForm({ ...subjectForm, weightage: Number(e.target.value) })}
              className="admin-input"
            />
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Initial Chapter Name</label>
            <input
              type="text"
              placeholder="e.g. Fundamental Units & Foundations"
              value={subjectForm.chapterName}
              onChange={(e) => setSubjectForm({ ...subjectForm, chapterName: e.target.value })}
              className="admin-input"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setAddSubjectModal(false)}
              className="admin-btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary">
              Create Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Topic Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTopicTarget}
        onClose={() => setDeleteTopicTarget(null)}
        onConfirm={handleDeleteTopicConfirm}
        title="Remove Syllabus Topic"
        message={`Are you sure you want to remove topic "${deleteTopicTarget?.name}"?`}
      />
    </div>
  );
}

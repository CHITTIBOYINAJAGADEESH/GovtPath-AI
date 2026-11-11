import { questions as initialQuestionsMap } from '../../data/questions';
import { getStoredData, setStoredData, logAdminAction, STORAGE_KEYS } from './adminStorage';
import { questionsApi } from '../../api/client';

// Flatten initial questions map into unified questions array
const flattenInitialQuestions = (map) => {
  const result = [];
  Object.entries(map).forEach(([examId, list]) => {
    list.forEach((item, idx) => {
      result.push({
        id: item.id || `q-${examId}-${idx + 1}`,
        examId,
        subject: item.subject || 'General Aptitude',
        chapter: 'Core Chapter',
        topic: item.topic || 'General Topic',
        question: item.q,
        type: 'Single Correct MCQ',
        options: item.o || ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: item.a !== undefined ? item.a : 0,
        explanation: item.e || 'Standard derivation applies.',
        difficulty: idx % 3 === 0 ? 'Hard' : idx % 2 === 0 ? 'Medium' : 'Easy',
        marks: 4,
        negativeMarks: -1,
        language: 'English',
        sourceReference: `${examId.toUpperCase()} Official Practice Sheet`,
        status: 'Published',
        createdAt: '2026-10-01T10:00:00Z',
      });
    });
  });
  return result;
};

export const questionManagementService = {
  getAllQuestions() {
    const stored = getStoredData(STORAGE_KEYS.QUESTIONS, null);
    if (!stored) {
      const flat = flattenInitialQuestions(initialQuestionsMap);
      setStoredData(STORAGE_KEYS.QUESTIONS, flat);
      return flat;
    }
    return stored;
  },

  getQuestionById(id) {
    const list = this.getAllQuestions();
    return list.find(q => q.id === id);
  },

  createQuestion(qData) {
    const list = this.getAllQuestions();
    const id = qData.id || `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newQuestion = {
      ...qData,
      id,
      status: qData.status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newQuestion, ...list];
    setStoredData(STORAGE_KEYS.QUESTIONS, updated);

    // Sync to PostgreSQL backend
    questionsApi.create({
      exam: qData.examId,
      question_text: qData.question,
      question_type: qData.type || 'Single Correct MCQ',
      options: qData.options || [],
      correct_answer: String(qData.correctAnswer ?? '0'),
      explanation: qData.explanation || '',
      difficulty: qData.difficulty || 'Medium',
      marks: Number(qData.marks || 4),
      negative_marks: Math.abs(Number(qData.negativeMarks || 1)),
      status: qData.status || 'Published',
      source_reference: qData.sourceReference || 'Admin Added',
    }).catch(() => {});

    logAdminAction({
      action: 'CREATE',
      module: 'Questions',
      recordId: id,
      description: `Added new ${newQuestion.type} for ${newQuestion.examId} (${newQuestion.subject})`,
    });

    return newQuestion;
  },

  updateQuestion(id, patch) {
    const list = this.getAllQuestions();
    const idx = list.findIndex(q => q.id === id);
    if (idx === -1) throw new Error('Question not found');

    const updated = {
      ...list[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    setStoredData(STORAGE_KEYS.QUESTIONS, list);

    logAdminAction({
      action: 'UPDATE',
      module: 'Questions',
      recordId: id,
      description: `Updated question in ${updated.examId} (${updated.subject})`,
    });

    return updated;
  },

  deleteQuestion(id) {
    const list = this.getAllQuestions();
    const filtered = list.filter(q => q.id !== id);
    setStoredData(STORAGE_KEYS.QUESTIONS, filtered);

    logAdminAction({
      action: 'DELETE',
      module: 'Questions',
      recordId: id,
      description: `Deleted question ID: ${id}`,
    });

    return true;
  },

  bulkImportQuestions(records, examId = 'jee-main') {
    const list = this.getAllQuestions();
    const formatted = records.map((r, i) => ({
      id: `bulk-${Date.now()}-${i}`,
      examId: r.examId || examId,
      subject: r.subject || 'General Aptitude',
      chapter: r.chapter || 'Unit 1',
      topic: r.topic || 'General Practice',
      question: r.question || r.q || 'Sample imported question',
      type: r.type || 'Single Correct MCQ',
      options: Array.isArray(r.options) ? r.options : (r.o || ['Option A', 'Option B', 'Option C', 'Option D']),
      correctAnswer: r.correctAnswer !== undefined ? Number(r.correctAnswer) : (r.a !== undefined ? Number(r.a) : 0),
      explanation: r.explanation || r.e || 'Imported verified answer explanation.',
      difficulty: r.difficulty || 'Medium',
      marks: Number(r.marks) || 4,
      negativeMarks: Number(r.negativeMarks) || -1,
      language: r.language || 'English',
      sourceReference: r.sourceReference || 'Bulk Import Module',
      status: 'Published',
      createdAt: new Date().toISOString(),
    }));

    const updated = [...formatted, ...list];
    setStoredData(STORAGE_KEYS.QUESTIONS, updated);

    // Sync to PostgreSQL backend
    const backendItems = formatted.map(item => ({
      exam: item.examId,
      question_text: item.question,
      question_type: item.type || 'Single Correct MCQ',
      options: item.options || [],
      correct_answer: String(item.correctAnswer ?? '0'),
      explanation: item.explanation || '',
      difficulty: item.difficulty || 'Medium',
      marks: Number(item.marks || 4),
      negative_marks: Math.abs(Number(item.negativeMarks || 1)),
      status: item.status || 'Published',
      source_reference: item.sourceReference || 'Bulk Imported',
    }));
    questionsApi.bulkImport(backendItems).catch(() => {});

    logAdminAction({
      action: 'IMPORT',
      module: 'Questions',
      recordId: `batch-${Date.now()}`,
      description: `Bulk imported ${formatted.length} questions into question bank.`,
    });

    return formatted;
  },
};

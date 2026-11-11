import { syllabuses as initialSyllabuses, fallbackSyllabus } from '../../data/syllabuses';
import { getStoredData, setStoredData, logAdminAction, STORAGE_KEYS } from './adminStorage';

// Convert flat or nested initial syllabuses into structured rich syllabus representation
const buildRichSyllabusMap = (raw) => {
  const result = {};
  Object.entries(raw).forEach(([examId, subjectsObj]) => {
    result[examId] = {
      examId,
      version: '1.2',
      status: 'Published',
      lastVerified: '2026-10-15',
      subjects: Object.entries(subjectsObj).map(([subjectName, topicsList], sIdx) => ({
        id: `subj-${examId}-${sIdx + 1}`,
        name: subjectName,
        weightage: 100 / Math.max(1, Object.keys(subjectsObj).length),
        chapters: [
          {
            id: `chap-${examId}-${sIdx + 1}-1`,
            name: `${subjectName} Core Units`,
            topics: (Array.isArray(topicsList) ? topicsList : []).map((top, tIdx) => ({
              id: `${examId}:${subjectName}:${typeof top === 'string' ? top : top.name || 'Topic'}`,
              name: typeof top === 'string' ? top : top.name,
              difficulty: tIdx % 3 === 0 ? 'Hard' : tIdx % 2 === 0 ? 'Medium' : 'Easy',
              estimatedHours: 4 + (tIdx % 5) * 2,
              status: 'Published',
              learningResourcesCount: 2,
              subtopics: [
                'Fundamental definitions and principles',
                'Worked practice examples',
                'Previous year exam questions (PYQ)',
              ],
            })),
          },
        ],
      })),
    };
  });
  return result;
};

export const syllabusManagementService = {
  getAllSyllabuses() {
    const rawMap = getStoredData(STORAGE_KEYS.SYLLABUSES, null);
    if (!rawMap) {
      const rich = buildRichSyllabusMap(initialSyllabuses);
      setStoredData(STORAGE_KEYS.SYLLABUSES, rich);
      return rich;
    }
    return rawMap;
  },

  getSyllabusByExam(examId) {
    const all = this.getAllSyllabuses();
    if (all[examId]) return all[examId];

    // Generate fallback structure if none exists
    const fallback = fallbackSyllabus();
    const created = buildRichSyllabusMap({ [examId]: fallback })[examId];
    all[examId] = created;
    setStoredData(STORAGE_KEYS.SYLLABUSES, all);
    return created;
  },

  // Add Subject
  addSubject(examId, subjectData) {
    const all = this.getAllSyllabuses();
    const syl = this.getSyllabusByExam(examId);

    const newSubject = {
      id: `subj-${examId}-${Date.now()}`,
      name: subjectData.name,
      weightage: subjectData.weightage || 25,
      chapters: [
        {
          id: `chap-${Date.now()}`,
          name: subjectData.chapterName || `${subjectData.name} Module 1`,
          topics: (subjectData.topics || []).map((t, i) => ({
            id: `${examId}:${subjectData.name}:${t}`,
            name: t,
            difficulty: 'Medium',
            estimatedHours: 6,
            status: 'Published',
            learningResourcesCount: 0,
            subtopics: [],
          })),
        },
      ],
    };

    syl.subjects.push(newSubject);
    syl.version = (parseFloat(syl.version || '1.0') + 0.1).toFixed(1);
    all[examId] = syl;
    setStoredData(STORAGE_KEYS.SYLLABUSES, all);

    logAdminAction({
      action: 'CREATE',
      module: 'Syllabus',
      recordId: `${examId}:${newSubject.name}`,
      description: `Added subject "${newSubject.name}" to ${examId} syllabus.`,
    });

    return syl;
  },

  // Add Topic
  addTopic(examId, subjectName, topicData) {
    const all = this.getAllSyllabuses();
    const syl = this.getSyllabusByExam(examId);

    let subj = syl.subjects.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
    if (!subj) {
      subj = {
        id: `subj-${Date.now()}`,
        name: subjectName,
        weightage: 20,
        chapters: [{ id: `chap-${Date.now()}`, name: `${subjectName} Chapter 1`, topics: [] }],
      };
      syl.subjects.push(subj);
    }

    if (!subj.chapters || subj.chapters.length === 0) {
      subj.chapters = [{ id: `chap-${Date.now()}`, name: 'General Chapter', topics: [] }];
    }

    const newTopic = {
      id: `${examId}:${subjectName}:${topicData.name}`,
      name: topicData.name,
      difficulty: topicData.difficulty || 'Medium',
      estimatedHours: Number(topicData.estimatedHours) || 6,
      status: topicData.status || 'Published',
      learningResourcesCount: topicData.resources ? topicData.resources.length : 0,
      subtopics: topicData.subtopics || ['Key theorems', 'Standard practice questions'],
    };

    subj.chapters[0].topics.push(newTopic);
    syl.version = (parseFloat(syl.version || '1.0') + 0.1).toFixed(1);
    all[examId] = syl;
    setStoredData(STORAGE_KEYS.SYLLABUSES, all);

    logAdminAction({
      action: 'CREATE',
      module: 'Syllabus',
      recordId: newTopic.id,
      description: `Added topic "${newTopic.name}" under ${subjectName} in ${examId}.`,
    });

    return newTopic;
  },

  // Delete Topic
  deleteTopic(examId, topicId) {
    const all = this.getAllSyllabuses();
    const syl = this.getSyllabusByExam(examId);

    syl.subjects.forEach(subj => {
      subj.chapters?.forEach(chap => {
        chap.topics = chap.topics.filter(t => t.id !== topicId);
      });
    });

    all[examId] = syl;
    setStoredData(STORAGE_KEYS.SYLLABUSES, all);

    logAdminAction({
      action: 'DELETE',
      module: 'Syllabus',
      recordId: topicId,
      description: `Deleted topic ${topicId} from ${examId}.`,
    });

    return syl;
  },

  updateSyllabusStatus(examId, status) {
    const all = this.getAllSyllabuses();
    const syl = this.getSyllabusByExam(examId);
    syl.status = status;
    all[examId] = syl;
    setStoredData(STORAGE_KEYS.SYLLABUSES, all);

    logAdminAction({
      action: 'UPDATE',
      module: 'Syllabus',
      recordId: examId,
      description: `Updated ${examId} syllabus status to ${status}.`,
    });

    return syl;
  },
};

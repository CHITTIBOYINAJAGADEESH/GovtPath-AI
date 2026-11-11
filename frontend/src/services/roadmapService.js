import { getExamSyllabusMap, fallbackSyllabus } from '../data/syllabuses';

// Local rule-based generator (NOT a real AI model). Output depends on exam syllabus + preferences.
export function generateRoadmap(exam, prefs) {
  const syl = exam.syllabus || getExamSyllabusMap(exam.id) || fallbackSyllabus();
  const targetTime = prefs.targetDate ? new Date(`${prefs.targetDate}T00:00:00`).getTime() : NaN;
  const weeksUntilTarget = Math.ceil((targetTime - Date.now()) / (7 * 24 * 60 * 60 * 1000));
  const totalWeeks = Math.max(4, Math.min(104, Number.isFinite(weeksUntilTarget) ? weeksUntilTarget : (prefs.months || 6) * 4));
  const learnWeeks = Math.floor(totalWeeks * 0.7);
  const mult = { Beginner: 1.3, Intermediate: 1, Advanced: 0.8 }[prefs.level] || 1;
  const subjects = Object.entries(syl).map(([name, topics]) => ({
    name,
    topics: (Array.isArray(topics) ? topics : []).map(t => ({
      id: `${exam.id}:${name}:${typeof t === 'string' ? t : t.name}`,
      name: typeof t === 'string' ? t : t.name,
      subject: name,
    })),
  }));

  const performance = prefs.subjectPerformance || {};
  if (Object.keys(performance).length) {
    subjects.sort((a, b) => (performance[a.name] ?? 1) - (performance[b.name] ?? 1));
  }

  const studyDays = prefs.studyDays?.length ? prefs.studyDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const max = Math.max(...subjects.map(s => s.topics.length), 1);
  const order = [];
  for (let i = 0; i < max; i++) {
    subjects.forEach(s => s.topics[i] && order.push(s.topics[i]));
  }

  order.forEach((t, i) => {
    t.week = 1 + Math.floor((i * learnWeeks) / Math.max(1, order.length));
    t.day = studyDays[i % studyDays.length];
    t.hours = Math.max(2, Math.round((8 * mult * 3) / (prefs.hours || 3)));
  });

  const h = Math.ceil(learnWeeks / 2);
  const phases = [
    { name: 'Foundation', weeks: `1–${h}` },
    { name: 'Core concepts', weeks: `${h + 1}–${learnWeeks}` },
    { name: 'Practice & revision', weeks: `${learnWeeks + 1}–${totalWeeks - 2}` },
    { name: 'Mocks & final prep', weeks: `${totalWeeks - 1}–${totalWeeks}` },
  ];

  return { subjects, topics: order, phases, totalWeeks, targetDate: prefs.targetDate || null, studyDays };
}

export const percent = (topics, progress) => (topics && topics.length ? Math.round((topics.filter(t => progress && progress[t.id]).length / topics.length) * 100) : 0);

import { exams as staticExams } from '../data/exams';
import { examManagementService } from './admin/examManagementService';
import { examsApi } from '../api/client';

export const syncExamsFromBackend = async () => {
  try {
    const list = await examsApi.getAll();
    if (list && list.length > 0) {
      const normalized = list.map(b => ({
        id: b.slug,
        name: b.name,
        category: b.category_name?.toLowerCase() || 'general',
        categoryLabel: b.category_name || 'General',
        org: b.conducting_body,
        qualification: b.qualification,
        level: b.level,
        state: b.state,
        officialWebsite: b.official_website,
        applicationWebsite: b.application_portal,
        desc: b.description,
        pattern: b.pattern,
        verified: true,
        status: b.status,
      }));
      examManagementService.syncFromBackend(normalized);
      return normalized;
    }
  } catch (err) {
    // fallback to stored/local exams
  }
};

export const allExams = (custom = []) => {
  try {
    const adminExams = examManagementService.getAllExams();
    const source = adminExams && adminExams.length ? adminExams : staticExams;
    // Merge custom exams ensuring no duplicate IDs
    const existingIds = new Set(source.map(e => e.id));
    const extraCustom = (custom || []).filter(c => !existingIds.has(c.id));
    return [...extraCustom, ...source];
  } catch (err) {
    return [...(custom || []), ...staticExams];
  }
};

export const getExam = (id, custom = []) => allExams(custom).find(e => e.id === id);

export function filterExams(list, { q = '', category = 'all', state = '' }) {
  const s = q.trim().toLowerCase();
  return list.filter(e => {
    const matchCat = category === 'all' || e.category === category;
    const matchState = !state || state === 'all' || e.state === state;
    const matchSearch = !s || `${e.name} ${e.org} ${e.categoryLabel || ''}`.toLowerCase().includes(s);
    return matchCat && matchState && matchSearch;
  });
}

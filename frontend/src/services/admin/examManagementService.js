import { exams as initialExams, categories as initialCategoriesRaw } from '../../data/exams';
import { initialCategories } from '../../data/categories';
import { initialExamRequests } from '../../data/admin/examRequests';
import { getStoredData, setStoredData, logAdminAction, STORAGE_KEYS } from './adminStorage';
import { examsApi } from '../../api/client';

export const examManagementService = {
  // Examinations
  getAllExams() {
    return getStoredData(STORAGE_KEYS.EXAMS, initialExams);
  },

  syncFromBackend(backendExams) {
    if (!Array.isArray(backendExams) || backendExams.length === 0) return;
    const current = this.getAllExams();
    const idMap = new Map();
    backendExams.forEach(e => idMap.set(e.id, e));
    current.forEach(e => {
      if (!idMap.has(e.id)) idMap.set(e.id, e);
    });
    const merged = Array.from(idMap.values());
    setStoredData(STORAGE_KEYS.EXAMS, merged);
    return merged;
  },

  getExamById(id) {
    const list = this.getAllExams();
    return list.find(e => e.id === id);
  },

  createExam(examData) {
    const list = this.getAllExams();
    const id = examData.id || examData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newExam = {
      ...examData,
      id,
      verified: examData.verified ?? true,
      userAdded: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newExam, ...list];
    setStoredData(STORAGE_KEYS.EXAMS, updated);

    // Sync to PostgreSQL backend
    examsApi.create({
      slug: id,
      name: newExam.name,
      conducting_body: newExam.conductingBody || newExam.conducting_body || 'Official Board',
      level: newExam.level || 'National',
      state: newExam.state || 'All India',
      qualification: newExam.qualification || 'Graduate',
      age_eligibility: newExam.ageLimit || newExam.age_eligibility || '21-32 years',
      official_website: newExam.officialWebsite || newExam.official_website || '',
      application_portal: newExam.applicationWebsite || newExam.application_portal || '',
      pattern: newExam.pattern || '',
      description: newExam.description || '',
      status: newExam.status || 'Active',
      is_popular: !!newExam.popular,
    }).catch(() => {});

    logAdminAction({
      action: 'CREATE',
      module: 'Exams',
      recordId: id,
      description: `Created new examination: ${newExam.name} (${newExam.categoryLabel || newExam.category})`,
    });

    return newExam;
  },

  updateExam(id, patch) {
    const list = this.getAllExams();
    const index = list.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Exam not found');

    const updatedExam = {
      ...list[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updatedExam;
    setStoredData(STORAGE_KEYS.EXAMS, list);

    // Sync to PostgreSQL backend
    examsApi.update(id, patch).catch(() => {});

    logAdminAction({
      action: 'UPDATE',
      module: 'Exams',
      recordId: id,
      description: `Updated examination details: ${updatedExam.name}`,
    });

    return updatedExam;
  },

  deleteExam(id) {
    const list = this.getAllExams();
    const target = list.find(e => e.id === id);
    const filtered = list.filter(e => e.id !== id);
    setStoredData(STORAGE_KEYS.EXAMS, filtered);

    // Sync to PostgreSQL backend
    examsApi.delete(id).catch(() => {});

    logAdminAction({
      action: 'DELETE',
      module: 'Exams',
      recordId: id,
      description: `Deleted examination: ${target ? target.name : id}`,
    });

    return true;
  },

  toggleExamStatus(id) {
    const exam = this.getExamById(id);
    if (!exam) return null;
    const newStatus = exam.status === 'Inactive' ? 'Active' : 'Inactive';
    return this.updateExam(id, { status: newStatus });
  },

  // Categories
  getAllCategories() {
    return getStoredData(STORAGE_KEYS.CATEGORIES, initialCategories);
  },

  createCategory(categoryData) {
    const list = this.getAllCategories();
    const id = categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory = {
      ...categoryData,
      id,
      examCount: categoryData.examCount || 0,
      active: categoryData.active ?? true,
    };
    const updated = [...list, newCategory];
    setStoredData(STORAGE_KEYS.CATEGORIES, updated);

    logAdminAction({
      action: 'CREATE',
      module: 'Categories',
      recordId: id,
      description: `Created new category: ${newCategory.name}`,
    });

    return newCategory;
  },

  updateCategory(id, patch) {
    const list = this.getAllCategories();
    const index = list.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    list[index] = { ...list[index], ...patch };
    setStoredData(STORAGE_KEYS.CATEGORIES, list);

    logAdminAction({
      action: 'UPDATE',
      module: 'Categories',
      recordId: id,
      description: `Updated category: ${list[index].name}`,
    });

    return list[index];
  },

  deleteCategory(id) {
    const list = this.getAllCategories();
    const filtered = list.filter(c => c.id !== id);
    setStoredData(STORAGE_KEYS.CATEGORIES, filtered);

    logAdminAction({
      action: 'DELETE',
      module: 'Categories',
      recordId: id,
      description: `Deleted category ID: ${id}`,
    });

    return true;
  },

  // Custom Examination Requests
  getCustomExamRequests() {
    return getStoredData(STORAGE_KEYS.CUSTOM_EXAMS, initialExamRequests);
  },

  updateCustomExamStatus(requestId, { status, adminComments, adminName = 'Jagadeesh Chittiboyina' }) {
    const requests = this.getCustomExamRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const target = requests[reqIndex];
    const newHistory = [
      ...(target.reviewHistory || []),
      {
        status,
        comment: adminComments || `Status updated to ${status}`,
        timestamp: new Date().toISOString(),
        adminName,
      },
    ];

    requests[reqIndex] = {
      ...target,
      status,
      adminComments: adminComments || target.adminComments,
      reviewHistory: newHistory,
      updatedAt: new Date().toISOString(),
    };

    setStoredData(STORAGE_KEYS.CUSTOM_EXAMS, requests);

    // If APPROVED, automatically add to the main examination catalogue!
    if (status === 'Approved') {
      const slug = target.examName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = this.getExamById(slug);
      if (!existing) {
        this.createExam({
          id: slug,
          name: target.examName,
          category: target.category,
          categoryLabel: target.category.toUpperCase(),
          org: target.conductingOrg,
          qualification: target.qualification,
          level: target.level,
          state: target.state || 'All India',
          officialWebsite: target.officialWebsite,
          desc: `${target.examName} (${target.conductingOrg}) - Approved from student submission.`,
          verified: true,
          status: 'Active',
          source: 'Student Submission (Approved)',
        });
      }
    }

    logAdminAction({
      action: status.toUpperCase(),
      module: 'Custom Exams',
      recordId: requestId,
      description: `${status} custom examination request: ${target.examName} (${target.studentName})`,
    });

    return requests[reqIndex];
  },
};

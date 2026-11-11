import { getStoredData, setStoredData, logAdminAction, STORAGE_KEYS } from './adminStorage';
import { questionManagementService } from './questionManagementService';
import { mockTestsApi } from '../../api/client';

export const initialMockTests = [
  {
    id: 'mock-jee-01',
    examId: 'jee-main',
    title: 'JEE Main Full-Length Simulation Mock Test #1',
    type: 'Full-length',
    durationMinutes: 180,
    totalMarks: 300,
    passingMarks: 90,
    negativeMarking: true,
    negativeMarkValue: 1,
    positiveMarkValue: 4,
    questionLimit: 30,
    status: 'Published',
    visibility: 'Public',
    subject: 'All Subjects (PCM)',
    instructions: 'Each correct answer yields +4 marks; each incorrect yields -1 mark. Scientific calculator not allowed.',
    attemptsCount: 3420,
    avgScore: 168.5,
    createdAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'mock-jee-sec-01',
    examId: 'jee-main',
    title: 'Physics Mechanics Intensive Sectional Test',
    type: 'Sectional',
    durationMinutes: 45,
    totalMarks: 100,
    passingMarks: 35,
    negativeMarking: true,
    negativeMarkValue: 1,
    positiveMarkValue: 4,
    questionLimit: 15,
    status: 'Published',
    visibility: 'Public',
    subject: 'Physics',
    instructions: 'Focus on kinematics, friction, dynamics and energy conservation theorems.',
    attemptsCount: 1840,
    avgScore: 58.2,
    createdAt: '2026-10-15T14:30:00Z',
  },
  {
    id: 'mock-ssc-01',
    examId: 'ssc-cgl',
    title: 'SSC CGL Tier 1 All-India Mock Test #1',
    type: 'Full-length',
    durationMinutes: 60,
    totalMarks: 200,
    passingMarks: 120,
    negativeMarking: true,
    negativeMarkValue: 0.5,
    positiveMarkValue: 2,
    questionLimit: 25,
    status: 'Published',
    visibility: 'Public',
    subject: 'All Sections (Quant, GA, English, Reasoning)',
    instructions: '60 minutes total duration. 0.50 negative marking for wrong answers.',
    attemptsCount: 4120,
    avgScore: 134.8,
    createdAt: '2026-10-18T11:00:00Z',
  },
  {
    id: 'mock-upsc-01',
    examId: 'upsc-civil-services-exam',
    title: 'UPSC GS Paper 1 Prelims National Simulation',
    type: 'Full-length',
    durationMinutes: 120,
    totalMarks: 200,
    passingMarks: 95,
    negativeMarking: true,
    negativeMarkValue: 0.66,
    positiveMarkValue: 2,
    questionLimit: 30,
    status: 'Published',
    visibility: 'Public',
    subject: 'General Studies I',
    instructions: 'Negative marking of 1/3rd (0.66) for each incorrect question.',
    attemptsCount: 2950,
    avgScore: 92.4,
    createdAt: '2026-10-22T09:00:00Z',
  },
  {
    id: 'mock-ibps-01',
    examId: 'ibps-po',
    title: 'IBPS PO Prelims Speed & Accuracy Drill',
    type: 'Daily quiz',
    durationMinutes: 20,
    totalMarks: 50,
    passingMarks: 20,
    negativeMarking: true,
    negativeMarkValue: 0.25,
    positiveMarkValue: 1,
    questionLimit: 10,
    status: 'Published',
    visibility: 'Public',
    subject: 'Reasoning & Quant',
    instructions: 'Designed to simulate 20-minute sectional timing caps.',
    attemptsCount: 2100,
    avgScore: 32.1,
    createdAt: '2026-10-25T16:00:00Z',
  },
];

export const mockTestManagementService = {
  getAllMockTests() {
    return getStoredData(STORAGE_KEYS.MOCK_TESTS, initialMockTests);
  },

  getMockTestById(id) {
    const list = this.getAllMockTests();
    return list.find(t => t.id === id);
  },

  createMockTest(testData) {
    const list = this.getAllMockTests();
    const id = testData.id || `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newTest = {
      ...testData,
      id,
      attemptsCount: 0,
      avgScore: 0,
      status: testData.status || 'Published',
      createdAt: new Date().toISOString(),
    };
    const updated = [newTest, ...list];
    setStoredData(STORAGE_KEYS.MOCK_TESTS, updated);

    // Sync to PostgreSQL backend
    mockTestsApi.create({
      title: newTest.title,
      exam: newTest.examId,
      category: newTest.type === 'Full-length' ? 'Full-Length Tests' : 'Subject-Wise Tests',
      duration_minutes: Number(newTest.durationMinutes || 120),
      total_marks: Number(newTest.totalMarks || 200),
      passing_marks: Number(newTest.passingMarks || 70),
      negative_marking: Number(newTest.negativeMarkValue || 0.66),
      instructions: newTest.instructions || '',
      status: newTest.status || 'Published',
    }).catch(() => {});

    logAdminAction({
      action: 'CREATE',
      module: 'Mock Tests',
      recordId: id,
      description: `Created mock test: "${newTest.title}" for ${newTest.examId}`,
    });

    return newTest;
  },

  updateMockTest(id, patch) {
    const list = this.getAllMockTests();
    const idx = list.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Mock test not found');

    const updated = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    list[idx] = updated;
    setStoredData(STORAGE_KEYS.MOCK_TESTS, list);

    logAdminAction({
      action: 'UPDATE',
      module: 'Mock Tests',
      recordId: id,
      description: `Updated mock test: "${updated.title}"`,
    });

    return updated;
  },

  deleteMockTest(id) {
    const list = this.getAllMockTests();
    const target = list.find(t => t.id === id);
    const filtered = list.filter(t => t.id !== id);
    setStoredData(STORAGE_KEYS.MOCK_TESTS, filtered);

    logAdminAction({
      action: 'DELETE',
      module: 'Mock Tests',
      recordId: id,
      description: `Deleted mock test: ${target ? target.title : id}`,
    });

    return true;
  },

  togglePublishStatus(id) {
    const test = this.getMockTestById(id);
    if (!test) return null;
    const newStatus = test.status === 'Published' ? 'Unpublished' : 'Published';
    return this.updateMockTest(id, { status: newStatus });
  },
};

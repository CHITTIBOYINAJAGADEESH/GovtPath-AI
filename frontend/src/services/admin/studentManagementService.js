import { initialStudents } from '../../data/admin/students';
import { getStoredData, setStoredData, logAdminAction, STORAGE_KEYS } from './adminStorage';

export const studentManagementService = {
  getAllStudents() {
    return getStoredData(STORAGE_KEYS.STUDENTS, initialStudents);
  },

  getStudentById(id) {
    const list = this.getAllStudents();
    return list.find(s => s.id === id);
  },

  updateStudent(id, patch) {
    const list = this.getAllStudents();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Student not found');

    const updated = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    list[idx] = updated;
    setStoredData(STORAGE_KEYS.STUDENTS, list);

    logAdminAction({
      action: 'UPDATE',
      module: 'Students',
      recordId: id,
      description: `Updated student profile: ${updated.name} (${updated.email})`,
    });

    return updated;
  },

  toggleAccountStatus(id) {
    const student = this.getStudentById(id);
    if (!student) return null;
    const newStatus = student.accountStatus === 'Active' ? 'Suspended' : 'Active';
    return this.updateStudent(id, { accountStatus: newStatus });
  },

  createStudent(studentData) {
    const list = this.getAllStudents();
    const id = studentData.id || `std-${Date.now()}`;
    const newStudent = {
      ...studentData,
      id,
      registeredAt: new Date().toISOString(),
      studyHoursTotal: 0,
      syllabusProgress: 0,
      mockTestsAttempted: 0,
      avgMockScore: 0,
      streakDays: 0,
      accountStatus: studentData.accountStatus || 'Active',
    };
    const updated = [newStudent, ...list];
    setStoredData(STORAGE_KEYS.STUDENTS, updated);

    logAdminAction({
      action: 'CREATE',
      module: 'Students',
      recordId: id,
      description: `Created student record: ${newStudent.name}`,
    });

    return newStudent;
  },

  deleteStudent(id) {
    const list = this.getAllStudents();
    const target = list.find(s => s.id === id);
    const filtered = list.filter(s => s.id !== id);
    setStoredData(STORAGE_KEYS.STUDENTS, filtered);

    logAdminAction({
      action: 'DELETE',
      module: 'Students',
      recordId: id,
      description: `Deleted student: ${target ? target.name : id}`,
    });

    return true;
  },
};

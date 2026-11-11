// Centralized LocalStorage persistence and event synchronization utility
export const STORAGE_KEYS = {
  EXAMS: 'govtpath_admin_exams',
  CATEGORIES: 'govtpath_admin_categories',
  CUSTOM_EXAMS: 'govtpath_admin_custom_exams',
  SYLLABUSES: 'govtpath_admin_syllabuses',
  QUESTIONS: 'govtpath_admin_questions',
  MOCK_TESTS: 'govtpath_admin_mock_tests',
  ROADMAP_TEMPLATES: 'govtpath_admin_roadmap_templates',
  JOBS: 'govtpath_admin_jobs',
  STUDENTS: 'govtpath_admin_students',
  LEARNING_RESOURCES: 'govtpath_admin_learning_resources',
  NOTIFICATIONS: 'govtpath_admin_notifications',
  AUDIT_LOGS: 'govtpath_admin_audit_logs',
  ROLES: 'govtpath_admin_roles',
  SETTINGS: 'govtpath_admin_settings',
  FEEDBACK: 'govtpath_admin_feedback',
  ADMIN_AUTH: 'govtpath_admin_auth_user',
};

export function getStoredData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

export function setStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Dispatch custom event for real-time reactivity in the same window
    window.dispatchEvent(new CustomEvent('govtpath_data_updated', { detail: { key, data } }));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// Add an audit log entry automatically whenever administrative actions occur
export function logAdminAction({ action, module, recordId, description, status = 'Success', adminName, adminEmail }) {
  try {
    const logs = getStoredData(STORAGE_KEYS.AUDIT_LOGS, []);
    const authUser = getStoredData(STORAGE_KEYS.ADMIN_AUTH, null);
    
    const newLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminName: adminName || (authUser ? authUser.name : 'Jagadeesh Chittiboyina'),
      adminEmail: adminEmail || (authUser ? authUser.email : 'jagadeeshchittiboyina07@gmail.com'),
      role: authUser ? authUser.role : 'Super Admin',
      action,
      module,
      recordId: String(recordId || ''),
      description,
      status,
      timestamp: new Date().toISOString(),
      ipAddress: '103.24.188.12 (Demo)',
    };

    const updatedLogs = [newLog, ...logs];
    setStoredData(STORAGE_KEYS.AUDIT_LOGS, updatedLogs);
    return newLog;
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

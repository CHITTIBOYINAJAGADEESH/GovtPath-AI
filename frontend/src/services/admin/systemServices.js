import { initialNotifications } from '../../data/notifications';
import { initialRoles } from '../../data/roles';
import { initialAuditLogs } from '../../data/admin/auditLogs';
import { initialFeedback } from '../../data/feedback';
import { initialAdminUsers } from '../../data/admin/adminUsers';
import { getStoredData, setStoredData, logAdminAction, STORAGE_KEYS } from './adminStorage';

// Notification Management Service
export const notificationService = {
  getAllNotifications() {
    return getStoredData(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  },
  createNotification(data) {
    const list = this.getAllNotifications();
    const id = data.id || `notif-${Date.now()}`;
    const newNotif = {
      ...data,
      id,
      deliveredCount: 0,
      openRate: '0%',
      createdAt: new Date().toISOString(),
      status: data.status || 'Published',
    };
    const updated = [newNotif, ...list];
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, updated);

    logAdminAction({
      action: 'BROADCAST',
      module: 'Notifications',
      recordId: id,
      description: `Dispatched platform announcement: "${newNotif.title}"`,
    });

    return newNotif;
  },
  deleteNotification(id) {
    const list = this.getAllNotifications();
    const filtered = list.filter(n => n.id !== id);
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, filtered);
    return true;
  },
};

// Roles & Permissions Service
export const roleService = {
  getAllRoles() {
    return getStoredData(STORAGE_KEYS.ROLES, initialRoles);
  },
  getAllAdminUsers() {
    return getStoredData('govtpath_admin_staff', initialAdminUsers);
  },
  createRole(data) {
    const list = this.getAllRoles();
    const id = data.id || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newRole = { ...data, id, usersCount: 0 };
    const updated = [...list, newRole];
    setStoredData(STORAGE_KEYS.ROLES, updated);
    logAdminAction({
      action: 'CREATE',
      module: 'Roles & Permissions',
      recordId: id,
      description: `Created new admin role: ${newRole.name}`,
    });
    return newRole;
  },
  updateRole(id, patch) {
    const list = this.getAllRoles();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...patch };
      setStoredData(STORAGE_KEYS.ROLES, list);
      logAdminAction({
        action: 'UPDATE',
        module: 'Roles & Permissions',
        recordId: id,
        description: `Updated permissions for role: ${list[idx].name}`,
      });
      return list[idx];
    }
  },
};

// Audit Logs Service
export const auditService = {
  getAllLogs() {
    return getStoredData(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  },
  filterLogs({ module = 'all', action = 'all', search = '' }) {
    const list = this.getAllLogs();
    return list.filter(log => {
      const matchModule = module === 'all' || log.module.toLowerCase() === module.toLowerCase();
      const matchAction = action === 'all' || log.action.toLowerCase() === action.toLowerCase();
      const matchSearch = !search || 
        `${log.adminName} ${log.description} ${log.recordId} ${log.module}`.toLowerCase().includes(search.toLowerCase());
      return matchModule && matchAction && matchSearch;
    });
  },
};

// Review Queue & Feedback Service
export const reviewService = {
  getAllFeedback() {
    return getStoredData(STORAGE_KEYS.FEEDBACK, initialFeedback);
  },
  updateFeedbackStatus(id, { status, adminNotes }) {
    const list = this.getAllFeedback();
    const idx = list.findIndex(f => f.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], status, adminNotes };
      setStoredData(STORAGE_KEYS.FEEDBACK, list);
      logAdminAction({
        action: 'RESOLVE',
        module: 'Review Queue',
        recordId: id,
        description: `Marked feedback #${id} as ${status}`,
      });
      return list[idx];
    }
  },
};

// Settings Service
export const defaultPlatformSettings = {
  general: {
    platformName: 'GovtPath AI',
    tagline: 'All-in-one Competitive Examination & Govt Jobs Preparation Portal',
    contactEmail: 'support@govtpath.ai',
    supportPhone: '+91 1800 123 4567',
    defaultLanguage: 'English',
    maintenanceMode: false,
  },
  appearance: {
    primaryColor: '#6955E8',
    secondaryColor: '#477BEE',
    accentColor: '#17B897',
    sidebarCollapsedByDefault: false,
    compactTables: false,
    enableFramerMotion: true,
  },
  examinations: {
    autoApproveCustomExams: false,
    allowGuestExamBrowsing: true,
    requireSyllabusVerification: true,
    defaultPrepTargetMonths: 6,
  },
  notifications: {
    emailAlertsForNewExams: true,
    instantReviewQueueAlerts: true,
    dailyDigestSummary: true,
  },
};

export const settingsService = {
  getSettings() {
    return getStoredData(STORAGE_KEYS.SETTINGS, defaultPlatformSettings);
  },
  saveSettings(patch) {
    const current = this.getSettings();
    const updated = {
      ...current,
      ...patch,
      general: { ...current.general, ...(patch.general || {}) },
      appearance: { ...current.appearance, ...(patch.appearance || {}) },
      examinations: { ...current.examinations, ...(patch.examinations || {}) },
      notifications: { ...current.notifications, ...(patch.notifications || {}) },
    };
    setStoredData(STORAGE_KEYS.SETTINGS, updated);
    logAdminAction({
      action: 'UPDATE',
      module: 'Settings',
      recordId: 'platform_config',
      description: 'Updated system administrative configuration.',
    });
    return updated;
  },
};

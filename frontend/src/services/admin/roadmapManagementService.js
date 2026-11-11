import { initialRoadmapTemplates } from '../../data/roadmapTemplates';
import { getStoredData, setStoredData, logAdminAction, STORAGE_KEYS } from './adminStorage';

export const roadmapManagementService = {
  getAllTemplates() {
    return getStoredData(STORAGE_KEYS.ROADMAP_TEMPLATES, initialRoadmapTemplates);
  },

  getTemplateById(id) {
    const list = this.getAllTemplates();
    return list.find(t => t.id === id);
  },

  createTemplate(data) {
    const list = this.getAllTemplates();
    const id = data.id || `tmpl-${Date.now()}`;
    const newTemplate = {
      ...data,
      id,
      version: '1.0',
      status: data.status || 'Published',
      generatedCount: 0,
      rating: 5.0,
      lastUpdated: new Date().toISOString(),
    };
    const updated = [newTemplate, ...list];
    setStoredData(STORAGE_KEYS.ROADMAP_TEMPLATES, updated);

    logAdminAction({
      action: 'CREATE',
      module: 'AI Roadmaps',
      recordId: id,
      description: `Created AI roadmap template: ${newTemplate.title}`,
    });

    return newTemplate;
  },

  updateTemplate(id, patch) {
    const list = this.getAllTemplates();
    const idx = list.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Template not found');

    const updated = {
      ...list[idx],
      ...patch,
      lastUpdated: new Date().toISOString(),
    };
    list[idx] = updated;
    setStoredData(STORAGE_KEYS.ROADMAP_TEMPLATES, list);

    logAdminAction({
      action: 'UPDATE',
      module: 'AI Roadmaps',
      recordId: id,
      description: `Updated roadmap template: ${updated.title}`,
    });

    return updated;
  },

  deleteTemplate(id) {
    const list = this.getAllTemplates();
    const target = list.find(t => t.id === id);
    const filtered = list.filter(t => t.id !== id);
    setStoredData(STORAGE_KEYS.ROADMAP_TEMPLATES, filtered);

    logAdminAction({
      action: 'DELETE',
      module: 'AI Roadmaps',
      recordId: id,
      description: `Deleted roadmap template: ${target ? target.title : id}`,
    });

    return true;
  },
};

import { initialLearningResources } from '../../data/learningResources';
import { getStoredData, setStoredData, logAdminAction, STORAGE_KEYS } from './adminStorage';

export const contentManagementService = {
  getAllResources() {
    return getStoredData(STORAGE_KEYS.LEARNING_RESOURCES, initialLearningResources);
  },

  getResourceById(id) {
    const list = this.getAllResources();
    return list.find(r => r.id === id);
  },

  createResource(data) {
    const list = this.getAllResources();
    const id = data.id || `res-${Date.now()}`;
    const newResource = {
      ...data,
      id,
      views: 0,
      downloads: 0,
      rating: 5.0,
      status: data.status || 'Published',
      verified: data.verified ?? true,
      createdAt: new Date().toISOString(),
    };
    const updated = [newResource, ...list];
    setStoredData(STORAGE_KEYS.LEARNING_RESOURCES, updated);

    logAdminAction({
      action: 'CREATE',
      module: 'Learning Content',
      recordId: id,
      description: `Uploaded resource: ${newResource.title} (${newResource.type})`,
    });

    return newResource;
  },

  updateResource(id, patch) {
    const list = this.getAllResources();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Resource not found');

    const updated = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    list[idx] = updated;
    setStoredData(STORAGE_KEYS.LEARNING_RESOURCES, list);

    logAdminAction({
      action: 'UPDATE',
      module: 'Learning Content',
      recordId: id,
      description: `Updated resource: ${updated.title}`,
    });

    return updated;
  },

  deleteResource(id) {
    const list = this.getAllResources();
    const target = list.find(r => r.id === id);
    const filtered = list.filter(r => r.id !== id);
    setStoredData(STORAGE_KEYS.LEARNING_RESOURCES, filtered);

    logAdminAction({
      action: 'DELETE',
      module: 'Learning Content',
      recordId: id,
      description: `Deleted resource: ${target ? target.title : id}`,
    });

    return true;
  },
};

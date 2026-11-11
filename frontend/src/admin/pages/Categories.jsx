import { useState, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Layers,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function Categories() {
  const { dataVersion, refreshData } = useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    icon: 'FolderTree',
    description: '',
    subcategories: '',
    displayOrder: 1,
    active: true,
  });

  const categoriesList = useMemo(() => {
    return examManagementService.getAllCategories().sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [dataVersion]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({
      name: '',
      slug: '',
      icon: 'FolderTree',
      description: '',
      subcategories: 'National Level, State CETs',
      displayOrder: categoriesList.length + 1,
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name || cat.label,
      slug: cat.id || cat.slug,
      icon: cat.icon || 'FolderTree',
      description: cat.description || '',
      subcategories: Array.isArray(cat.subcategories) ? cat.subcategories.join(', ') : cat.subcategories || '',
      displayOrder: cat.displayOrder || 1,
      active: cat.active ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Category name is required');

    const subcats = form.subcategories
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      subcategories: subcats,
      label: form.name,
    };

    try {
      if (editingCategory) {
        examManagementService.updateCategory(editingCategory.id, payload);
        toast.success(`Updated category: ${form.name}`);
      } else {
        examManagementService.createCategory(payload);
        toast.success(`Created category: ${form.name}`);
      }
      refreshData();
      setModalOpen(false);
    } catch (err) {
      toast.error('Failed to save category');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    try {
      examManagementService.deleteCategory(deleteTarget.id);
      refreshData();
      toast.success('Category deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const toggleVisibility = (cat) => {
    try {
      examManagementService.updateCategory(cat.id, { active: !cat.active });
      refreshData();
      toast.success(`Visibility updated for ${cat.name || cat.label}`);
    } catch (err) {
      toast.error('Failed to update visibility');
    }
  };

  const columns = [
    {
      header: 'Order',
      key: 'displayOrder',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-slate-500">#{val}</span>,
    },
    {
      header: 'Category Name',
      key: 'name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val || row.label}</div>
          <span className="text-[11px] font-mono text-admin-muted">{row.id || row.slug}</span>
        </div>
      ),
    },
    {
      header: 'Description',
      key: 'description',
      render: (val) => <span className="text-slate-600 line-clamp-1 max-w-xs">{val || 'No description'}</span>,
    },
    {
      header: 'Subcategories',
      key: 'subcategories',
      render: (val) => (
        <span className="text-slate-600">
          {Array.isArray(val) ? `${val.length} streams` : 'Standard'}
        </span>
      ),
    },
    {
      header: 'Examinations',
      key: 'examCount',
      sortable: true,
      render: (val) => (
        <span className="font-semibold text-admin-primary">{val || 0} exams</span>
      ),
    },
    {
      header: 'Visibility',
      key: 'active',
      render: (val, row) => (
        <button
          type="button"
          onClick={() => toggleVisibility(row)}
          className="flex items-center gap-1 cursor-pointer"
        >
          {val ? (
            <Badge variant="Active">Visible</Badge>
          ) : (
            <Badge variant="Inactive">Hidden</Badge>
          )}
        </button>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            title="Edit Category"
            onClick={() => openEditModal(row)}
            className="p-1 text-admin-muted hover:text-admin-secondary rounded-lg hover:bg-slate-100 transition"
          >
            <Edit size={15} />
          </button>
          <button
            type="button"
            title="Delete Category"
            onClick={() => setDeleteTarget(row)}
            className="p-1 text-admin-muted hover:text-admin-error rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Examination Categories
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Organize examinations into primary streams, subcategories, display order and portal visibility.
          </p>
        </div>

        <button type="button" onClick={openCreateModal} className="admin-btn-primary text-xs">
          <Plus size={15} /> Add Category
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categoriesList}
        searchKey="name"
        searchPlaceholder="Search categories..."
        exportFilename="govtpath-categories.csv"
      />

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        subtitle="Manage category details and explore page presentation"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-admin-text mb-1">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. State Government / PSCs"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Unique Slug / ID</label>
            <input
              type="text"
              placeholder="e.g. state-psc"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="admin-input font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of this examination stream..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">
              Subcategories (Comma separated)
            </label>
            <input
              type="text"
              placeholder="Group 1 Gazetted, Group 2 Executive, Group 3 Ministerial"
              value={form.subcategories}
              onChange={(e) => setForm({ ...form, subcategories: e.target.value })}
              className="admin-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Display Order</label>
              <input
                type="number"
                min={1}
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                className="admin-input"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="catActive"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="rounded border-slate-300 text-admin-primary focus:ring-admin-primary"
              />
              <label htmlFor="catActive" className="font-semibold text-admin-text cursor-pointer">
                Visible in student exploration
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="admin-btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary">
              {editingCategory ? 'Update Category' : 'Save Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteTarget?.name || deleteTarget?.label}"?`}
      />
    </div>
  );
}

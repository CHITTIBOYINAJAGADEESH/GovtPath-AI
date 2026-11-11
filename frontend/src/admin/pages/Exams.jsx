import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle,
  XCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function Exams() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dataVersion, refreshData } = useAdminStore();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewDetailTarget, setViewDetailTarget] = useState(null);

  // Load live exams and categories from management service
  const examsList = useMemo(() => {
    return examManagementService.getAllExams();
  }, [dataVersion]);

  const categoriesList = useMemo(() => {
    return examManagementService.getAllCategories();
  }, [dataVersion]);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    try {
      examManagementService.deleteExam(deleteTarget.id);
      refreshData();
      toast.success(`Deleted examination: ${deleteTarget.name}`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to delete examination');
    }
  };

  const handleToggleStatus = (exam) => {
    try {
      const updated = examManagementService.toggleExamStatus(exam.id);
      refreshData();
      toast.success(`${exam.name} marked as ${updated.status}`);
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  const columns = [
    {
      header: 'Examination Name',
      key: 'name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text flex items-center gap-1.5">
            <span>{val}</span>
            {row.isPopular && <Star size={12} className="fill-amber-400 text-amber-400" />}
          </div>
          <span className="text-[11px] text-admin-muted font-mono">{row.id}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'categoryLabel',
      sortable: true,
      render: (val, row) => (
        <Badge variant="brand">{val || row.category}</Badge>
      ),
    },
    {
      header: 'Conducting Body',
      key: 'org',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-700">{val}</span>,
    },
    {
      header: 'Level / Region',
      key: 'level',
      sortable: true,
      render: (val, row) => (
        <span className="text-slate-600">
          {val} · {row.state || 'All India'}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (val, row) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(row)}
          title="Click to toggle status"
          className="cursor-pointer"
        >
          <Badge variant={val || 'Active'}>{val || 'Active'}</Badge>
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
            title="View Details"
            onClick={() => setViewDetailTarget(row)}
            className="p-1 text-admin-muted hover:text-admin-primary rounded-lg hover:bg-slate-100 transition"
          >
            <Eye size={15} />
          </button>
          <Link
            to={`/admin/exams/edit/${row.id}`}
            title="Edit Exam"
            className="p-1 text-admin-muted hover:text-admin-secondary rounded-lg hover:bg-slate-100 transition"
          >
            <Edit size={15} />
          </Link>
          <button
            type="button"
            title="Delete Exam"
            onClick={() => setDeleteTarget(row)}
            className="p-1 text-admin-muted hover:text-admin-error rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const filterOptions = [
    {
      key: 'category',
      label: 'Category',
      options: categoriesList.map((c) => ({ value: c.id, label: c.name || c.label })),
    },
    {
      key: 'state',
      label: 'State',
      options: [
        { value: 'All India', label: 'All India / National' },
        { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
        { value: 'Telangana', label: 'Telangana' },
      ],
    },
    {
      key: 'level',
      label: 'Level',
      options: [
        { value: 'Graduate', label: 'Graduate' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: '10th', label: '10th / Secondary' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Examination Catalogue
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Manage official competitive examinations, patterns, eligibility and live student visibility ({examsList.length} total)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/exams/new" className="admin-btn-primary text-xs">
            <Plus size={15} /> Add Examination
          </Link>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={examsList}
        searchKey="name"
        searchPlaceholder="Search examinations by name, ID or conducting body..."
        filterOptions={filterOptions}
        exportFilename="govtpath-examinations.csv"
        initialPageSize={10}
        bulkActions={(selectedIds, clear) => (
          <button
            type="button"
            onClick={() => {
              selectedIds.forEach((id) => examManagementService.deleteExam(id));
              refreshData();
              clear();
              toast.success(`Deleted ${selectedIds.length} examinations`);
            }}
            className="admin-btn-danger text-xs py-1 px-3"
          >
            Delete Selected ({selectedIds.length})
          </button>
        )}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Examination"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? It will no longer appear in the student catalogue or AI roadmaps.`}
      />

      {/* View Detail Modal */}
      {viewDetailTarget && (
        <Modal
          isOpen={!!viewDetailTarget}
          onClose={() => setViewDetailTarget(null)}
          title={viewDetailTarget.name}
          subtitle={`Catalogue ID: ${viewDetailTarget.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
              <div>
                <span className="text-admin-muted font-bold block uppercase text-[10px]">Category</span>
                <span className="font-semibold text-slate-800">{viewDetailTarget.categoryLabel || viewDetailTarget.category}</span>
              </div>
              <div>
                <span className="text-admin-muted font-bold block uppercase text-[10px]">Conducting Body</span>
                <span className="font-semibold text-slate-800">{viewDetailTarget.org}</span>
              </div>
              <div>
                <span className="text-admin-muted font-bold block uppercase text-[10px]">Level & Region</span>
                <span className="font-semibold text-slate-800">{viewDetailTarget.level} · {viewDetailTarget.state}</span>
              </div>
              <div>
                <span className="text-admin-muted font-bold block uppercase text-[10px]">Min Qualification</span>
                <span className="font-semibold text-slate-800">{viewDetailTarget.qualification}</span>
              </div>
            </div>

            <div>
              <span className="text-admin-muted font-bold block uppercase text-[10px] mb-1">Description</span>
              <p className="text-slate-700 bg-white border border-slate-200 rounded-xl p-3 leading-relaxed">
                {viewDetailTarget.desc}
              </p>
            </div>

            {viewDetailTarget.officialWebsite && (
              <div className="flex items-center gap-2 pt-2">
                <span className="font-semibold text-admin-muted">Official Portal:</span>
                <a
                  href={viewDetailTarget.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-admin-primary font-bold hover:underline flex items-center gap-1"
                >
                  {viewDetailTarget.officialWebsite} <ExternalLink size={12} />
                </a>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-[11px] text-admin-muted">
                Status: <strong className="text-slate-800">{viewDetailTarget.status || 'Active'}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewDetailTarget(null);
                    navigate(`/admin/exams/edit/${viewDetailTarget.id}`);
                  }}
                  className="admin-btn-primary text-xs"
                >
                  <Edit size={14} /> Edit Examination
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

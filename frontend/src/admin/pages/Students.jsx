import { useState, useMemo } from 'react';
import {
  Users,
  Eye,
  Edit,
  Trash2,
  ShieldAlert,
  UserCheck,
  UserX,
  Clock,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { studentManagementService } from '../../services/admin/studentManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function Students() {
  const { dataVersion, refreshData } = useAdminStore();
  const [inspectStudent, setInspectStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const studentsList = useMemo(() => {
    return studentManagementService.getAllStudents();
  }, [dataVersion]);

  const handleToggleStatus = (student) => {
    try {
      const updated = studentManagementService.toggleAccountStatus(student.id);
      refreshData();
      toast.success(`Account status updated to ${updated.accountStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    try {
      studentManagementService.deleteStudent(deleteTarget.id);
      refreshData();
      toast.success('Student record deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editStudent) return;
    try {
      studentManagementService.updateStudent(editStudent.id, editStudent);
      refreshData();
      toast.success('Student profile updated');
      setEditStudent(null);
    } catch (err) {
      toast.error('Failed to update student');
    }
  };

  const columns = [
    {
      header: 'Student Aspirant',
      key: 'name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar}
            alt={val}
            className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div>
            <div className="font-bold text-admin-text">{val}</div>
            <span className="text-[11px] text-admin-muted">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Primary Target Exam',
      key: 'primaryExamName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800">{val}</span>
          <span className="block text-[10px] text-admin-muted">
            {row.selectedExams?.length || 1} exams tracked
          </span>
        </div>
      ),
    },
    {
      header: 'Preparation Level',
      key: 'preparationLevel',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-700">{val}</span>,
    },
    {
      header: 'Learning Progress',
      key: 'syllabusProgress',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
            <span>{val}% Syllabus</span>
          </div>
          <span className="text-[10px] text-admin-muted">
            {row.studyHoursTotal}h study · {row.mockTestsAttempted} mocks
          </span>
        </div>
      ),
    },
    {
      header: 'Account Status',
      key: 'accountStatus',
      sortable: true,
      render: (val, row) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(row)}
          title="Click to toggle status"
          className="cursor-pointer"
        >
          <Badge variant={val}>{val}</Badge>
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
            title="View Full Profile"
            onClick={() => setInspectStudent(row)}
            className="p-1 text-admin-muted hover:text-admin-primary rounded-lg hover:bg-slate-100 transition"
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            title="Edit Details"
            onClick={() => setEditStudent({ ...row })}
            className="p-1 text-admin-muted hover:text-admin-secondary rounded-lg hover:bg-slate-100 transition"
          >
            <Edit size={15} />
          </button>
          <button
            type="button"
            title="Delete Account"
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
      key: 'accountStatus',
      label: 'Status',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Suspended', label: 'Suspended' },
      ],
    },
    {
      key: 'preparationLevel',
      label: 'Level',
      options: [
        { value: 'Beginner', label: 'Beginner' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Advanced', label: 'Advanced' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Student Management
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Directory of registered students, target examinations, study analytics and access management.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={studentsList}
        searchKey="name"
        searchPlaceholder="Search student by name or email..."
        filterOptions={filterOptions}
        exportFilename="govtpath-students.csv"
      />

      {/* Inspect Student Profile Modal */}
      {inspectStudent && (
        <Modal
          isOpen={!!inspectStudent}
          onClose={() => setInspectStudent(null)}
          title={inspectStudent.name}
          subtitle={`Student ID: ${inspectStudent.id} · Registered ${new Date(inspectStudent.registeredAt).toLocaleDateString()}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
              <img
                src={inspectStudent.avatar}
                alt={inspectStudent.name}
                className="h-16 w-16 rounded-2xl object-cover border border-slate-200"
              />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-admin-text">{inspectStudent.name}</h3>
                <div className="text-admin-muted">{inspectStudent.email} · {inspectStudent.phone}</div>
                <div className="flex items-center gap-2 pt-1">
                  <Badge variant={inspectStudent.accountStatus}>{inspectStudent.accountStatus}</Badge>
                  <span className="text-[11px] text-slate-500">{inspectStudent.education}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-admin-border p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-admin-muted block">Study Hours</span>
                <span className="text-xl font-black text-slate-800">{inspectStudent.studyHoursTotal}h</span>
              </div>
              <div className="rounded-xl border border-admin-border p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-admin-muted block">Syllabus Covered</span>
                <span className="text-xl font-black text-admin-primary">{inspectStudent.syllabusProgress}%</span>
              </div>
              <div className="rounded-xl border border-admin-border p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-admin-muted block">Avg Mock Score</span>
                <span className="text-xl font-black text-emerald-600">{inspectStudent.avgMockScore}%</span>
              </div>
            </div>

            <div className="rounded-xl border border-admin-border p-3 space-y-1">
              <span className="text-[10px] uppercase font-bold text-admin-muted block">Aspirant Goal</span>
              <p className="text-slate-700">{inspectStudent.studyGoals}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-red-100 bg-red-50/50 p-3">
                <span className="font-bold text-red-700 block mb-1">Identified Weak Areas:</span>
                <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                  {inspectStudent.weakTopics?.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                <span className="font-bold text-emerald-700 block mb-1">Top Strong Subjects:</span>
                <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                  {inspectStudent.strongSubjects?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectStudent(null)}
                className="admin-btn-outline"
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Student Modal */}
      {editStudent && (
        <Modal
          isOpen={!!editStudent}
          onClose={() => setEditStudent(null)}
          title={`Edit Student: ${editStudent.name}`}
          subtitle="Modify academic information and status"
        >
          <form onSubmit={handleEditSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Full Name</label>
              <input
                type="text"
                required
                value={editStudent.name}
                onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-admin-text mb-1">Education Background</label>
                <input
                  type="text"
                  value={editStudent.education}
                  onChange={(e) => setEditStudent({ ...editStudent, education: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-admin-text mb-1">Preparation Level</label>
                <select
                  value={editStudent.preparationLevel}
                  onChange={(e) => setEditStudent({ ...editStudent, preparationLevel: e.target.value })}
                  className="admin-select"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">Study Goals</label>
              <input
                type="text"
                value={editStudent.studyGoals}
                onChange={(e) => setEditStudent({ ...editStudent, studyGoals: e.target.value })}
                className="admin-input"
              />
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">Account Status</label>
              <select
                value={editStudent.accountStatus}
                onChange={(e) => setEditStudent({ ...editStudent, accountStatus: e.target.value })}
                className="admin-select"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setEditStudent(null)}
                className="admin-btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="admin-btn-primary">
                Save Profile
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student Record"
        message={`Are you sure you want to delete student account "${deleteTarget?.name}"? All roadmap and test history will be removed.`}
      />
    </div>
  );
}

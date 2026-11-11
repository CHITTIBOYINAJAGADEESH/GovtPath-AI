import { useState, useMemo } from 'react';
import { ShieldAlert, Plus, Check, X, Users, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { roleService } from '../../services/admin/systemServices';
import { useAdminStore } from '../../store/useAdminStore';

export default function Roles() {
  const { dataVersion, refreshData } = useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const rolesList = useMemo(() => {
    return roleService.getAllRoles();
  }, [dataVersion]);

  const adminStaff = useMemo(() => {
    return roleService.getAllAdminUsers();
  }, [dataVersion]);

  const columns = [
    {
      header: 'Role Name',
      key: 'name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted line-clamp-1">{row.description}</span>
        </div>
      ),
    },
    {
      header: 'Assigned Staff',
      key: 'usersCount',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-admin-primary">{val} admin users</span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: () => <Badge variant="Active">Active</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => {
            setSelectedRole(row);
            setModalOpen(true);
          }}
          className="px-2.5 py-1 bg-admin-primary/10 text-admin-primary hover:bg-admin-primary hover:text-white rounded-lg text-xs font-semibold transition"
        >
          View Permissions
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Admin Roles & Permissions
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Simulate role-based access control (RBAC), permission boundaries, and staff assignments.
          </p>
        </div>
      </div>

      {/* Admin Staff Table */}
      <div className="admin-card space-y-3">
        <h2 className="text-sm font-bold text-admin-text">Administrative Personnel</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-admin-muted border-b border-admin-border">
              <tr>
                <th className="px-3 py-2 font-bold">Admin Member</th>
                <th className="px-3 py-2 font-bold">Department</th>
                <th className="px-3 py-2 font-bold">Assigned Role</th>
                <th className="px-3 py-2 font-bold">Last Login</th>
                <th className="px-3 py-2 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 transition">
                  <td className="px-3 py-2.5 font-bold text-admin-text">
                    <div className="flex items-center gap-2">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="h-7 w-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div>{staff.name}</div>
                        <div className="text-[11px] font-normal text-admin-muted">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">{staff.department}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant={staff.role === 'Super Admin' ? 'brand' : 'normal'}>
                      {staff.role}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-slate-500 font-mono text-[11px]">
                    {new Date(staff.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Badge variant="Active">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Defined Roles Table */}
      <DataTable
        columns={columns}
        data={rolesList}
        searchKey="name"
        searchPlaceholder="Search roles..."
        exportFilename="admin-roles.csv"
      />

      {/* Permission Matrix Modal */}
      {selectedRole && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Role Permissions: ${selectedRole.name}`}
          subtitle={selectedRole.description}
        >
          <div className="space-y-4 text-xs">
            <span className="font-bold text-admin-text text-sm block">
              Granular Permission Boundaries
            </span>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-admin-border">
              {Object.entries(selectedRole.permissions || {}).map(([moduleKey, perms]) => (
                <div key={moduleKey} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition">
                  <span className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                    {moduleKey}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {perms.map((p) => (
                      <span
                        key={p}
                        className="rounded-md bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold border border-emerald-100"
                      >
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="admin-btn-outline"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useState, useMemo } from 'react';
import { History, Filter, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { auditService } from '../../services/admin/systemServices';
import { useAdminStore } from '../../store/useAdminStore';

export default function AuditLogs() {
  const { dataVersion } = useAdminStore();

  const logsList = useMemo(() => {
    return auditService.getAllLogs();
  }, [dataVersion]);

  const columns = [
    {
      header: 'Admin Member',
      key: 'adminName',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted">{row.adminEmail}</span>
        </div>
      ),
    },
    {
      header: 'Action',
      key: 'action',
      sortable: true,
      render: (val) => {
        const isCreate = val === 'CREATE' || val === 'PUBLISH' || val === 'APPROVE';
        const isDelete = val === 'DELETE' || val === 'REJECT';
        return (
          <span
            className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-md ${
              isCreate
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : isDelete
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {val}
          </span>
        );
      },
    },
    {
      header: 'Module',
      key: 'module',
      sortable: true,
      render: (val) => <Badge variant="brand">{val}</Badge>,
    },
    {
      header: 'Activity Description',
      key: 'description',
      render: (val, row) => (
        <div>
          <span className="font-medium text-slate-800">{val}</span>
          {row.recordId && (
            <span className="block text-[10px] text-slate-400 font-mono">
              Ref ID: {row.recordId}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Timestamp',
      key: 'timestamp',
      sortable: true,
      render: (val) => (
        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
          {new Date(val).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
  ];

  const filterOptions = [
    {
      key: 'module',
      label: 'Module',
      options: [
        { value: 'Exams', label: 'Exams' },
        { value: 'Custom Exams', label: 'Custom Exams' },
        { value: 'Syllabus', label: 'Syllabus' },
        { value: 'Questions', label: 'Questions' },
        { value: 'Mock Tests', label: 'Mock Tests' },
        { value: 'Students', label: 'Students' },
        { value: 'Jobs', label: 'Jobs' },
        { value: 'Notifications', label: 'Notifications' },
      ],
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        { value: 'CREATE', label: 'CREATE' },
        { value: 'UPDATE', label: 'UPDATE' },
        { value: 'DELETE', label: 'DELETE' },
        { value: 'APPROVE', label: 'APPROVE' },
        { value: 'PUBLISH', label: 'PUBLISH' },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Administrative Audit Logs
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Tamper-evident audit trail capturing modifications, approvals, catalogue updates, and authentication events.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={logsList}
        searchKey="description"
        searchPlaceholder="Search audit logs by description, admin, or record..."
        filterOptions={filterOptions}
        exportFilename="govtpath-audit-logs.csv"
      />
    </div>
  );
}

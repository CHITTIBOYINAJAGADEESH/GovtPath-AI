import { useState, useMemo } from 'react';
import { FileText, Video, BookOpen, Plus, ExternalLink, Trash2, Eye } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { contentManagementService } from '../../services/admin/contentManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function Content() {
  const { dataVersion, refreshData } = useAdminStore();
  const resources = useMemo(() => {
    return contentManagementService.getAllResources();
  }, [dataVersion]);

  const columns = [
    {
      header: 'Content Title',
      key: 'title',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted">
            {row.examName} · {row.subject}
          </span>
        </div>
      ),
    },
    {
      header: 'Category / Type',
      key: 'type',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-700">{val}</span>,
    },
    {
      header: 'Author / Faculty',
      key: 'author',
      sortable: true,
      render: (val) => <span>{val || 'GovtPath Team'}</span>,
    },
    {
      header: 'Views / Downloads',
      key: 'views',
      sortable: true,
      render: (val, row) => (
        <span className="font-mono text-[11px] text-slate-600">
          {val?.toLocaleString() || 0} views ({row.downloads || 0} DLs)
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noreferrer"
          title="Open Link"
          className="p-1 text-admin-muted hover:text-admin-primary rounded-lg hover:bg-slate-100 transition inline-block"
        >
          <ExternalLink size={15} />
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Educational Content Management
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Central repository for PDF notes, video masterclasses, articles, and exam cheat sheets ({resources.length} items).
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={resources}
        searchKey="title"
        searchPlaceholder="Search content by title or subject..."
        exportFilename="govtpath-content-materials.csv"
      />
    </div>
  );
}

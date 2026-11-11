import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExportButton({ data = [], filename = 'export.csv', label = 'Export CSV' }) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error('No data available to export');
      return;
    }

    try {
      // Extract keys from first object
      const keys = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object' || data[0][k] === null);
      const csvHeader = keys.join(',');
      const csvRows = data.map(item => {
        return keys
          .map(k => {
            const val = item[k] === null || item[k] === undefined ? '' : String(item[k]);
            const escaped = val.replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(',');
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [csvHeader, ...csvRows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${data.length} records successfully!`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export data');
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="admin-btn-outline text-xs px-3 py-2 flex items-center gap-1.5"
    >
      <Download size={14} className="text-admin-muted" />
      {label}
    </button>
  );
}

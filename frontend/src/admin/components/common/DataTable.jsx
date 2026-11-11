import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import ExportButton from './ExportButton';

export default function DataTable({
  columns = [],
  data = [],
  searchKey = 'name',
  searchPlaceholder = 'Search records...',
  filterOptions = [],
  actions,
  bulkActions,
  exportFilename = 'table-export.csv',
  initialPageSize = 10,
}) {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedIds, setSelectedIds] = useState([]);

  // Filtering & Search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search
      if (search) {
        const val = item[searchKey];
        const searchMatches =
          (val && String(val).toLowerCase().includes(search.toLowerCase())) ||
          (item.id && String(item.id).toLowerCase().includes(search.toLowerCase())) ||
          (item.title && String(item.title).toLowerCase().includes(search.toLowerCase()));
        if (!searchMatches) return false;
      }

      // Filter options
      for (const [key, filterVal] of Object.entries(activeFilters)) {
        if (filterVal && filterVal !== 'all' && item[key] !== filterVal) {
          return false;
        }
      }

      return true;
    });
  }, [data, search, searchKey, activeFilters]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((d) => d.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-admin-muted" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="admin-input pl-10 text-xs"
          />
        </div>

        {/* Filter Dropdowns and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((filter) => (
            <select
              key={filter.key}
              value={activeFilters[filter.key] || 'all'}
              onChange={(e) => {
                setActiveFilters({ ...activeFilters, [filter.key]: e.target.value });
                setPage(1);
              }}
              className="admin-select py-1.5 px-3 text-xs w-auto bg-white"
            >
              <option value="all">{filter.label}: All</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          <ExportButton data={filteredData} filename={exportFilename} />

          {actions}
        </div>
      </div>

      {/* Bulk actions banner if selected */}
      {selectedIds.length > 0 && bulkActions && (
        <div className="flex items-center justify-between rounded-xl border border-admin-primary/20 bg-admin-primary/5 px-4 py-2.5 text-xs">
          <span className="font-semibold text-admin-primary">
            {selectedIds.length} items selected
          </span>
          <div className="flex items-center gap-2">
            {bulkActions(selectedIds, () => setSelectedIds([]))}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-admin-border bg-white shadow-admin-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead className="border-b border-admin-border bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-admin-muted">
              <tr>
                {bulkActions && (
                  <th className="w-10 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 && selectedIds.length === paginatedData.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-admin-primary focus:ring-admin-primary"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key || col.header}
                    className={`px-4 py-3 ${
                      col.sortable ? 'cursor-pointer select-none hover:text-admin-text' : ''
                    } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'right' ? 'justify-end' : ''
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && <ArrowUpDown size={12} className="opacity-40" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (bulkActions ? 1 : 0)}
                    className="py-12 text-center text-admin-muted"
                  >
                    No matching records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => {
                  const isSelected = selectedIds.includes(row.id);
                  return (
                    <tr
                      key={row.id || idx}
                      className={`transition-colors hover:bg-slate-50/75 ${
                        isSelected ? 'bg-admin-primary/5' : ''
                      }`}
                    >
                      {bulkActions && (
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(row.id)}
                            className="rounded border-slate-300 text-admin-primary focus:ring-admin-primary"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key || col.header}
                          className={`px-4 py-3 ${
                            col.align === 'right'
                              ? 'text-right'
                              : col.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                          }`}
                        >
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-admin-border px-4 py-3 text-xs text-admin-muted gap-2">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
            >
              {[10, 20, 50, 100].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="hidden sm:inline">
              Showing {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
            </span>
          </div>

          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage(1)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-2 text-xs font-semibold text-admin-text">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(totalPages)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

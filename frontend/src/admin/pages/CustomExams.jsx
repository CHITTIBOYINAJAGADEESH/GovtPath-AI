import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  History,
  Eye,
  FileCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function CustomExams() {
  const { dataVersion, refreshData, adminUser } = useAdminStore();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewAction, setReviewAction] = useState(null); // 'Approve', 'Reject', 'Needs Changes'
  const [adminComment, setAdminComment] = useState('');

  const requestsList = useMemo(() => {
    return examManagementService.getCustomExamRequests();
  }, [dataVersion]);

  const handleOpenReview = (req, action) => {
    setSelectedRequest(req);
    setReviewAction(action);
    setAdminComment(req.adminComments || '');
  };

  const handleConfirmReview = () => {
    if (!selectedRequest || !reviewAction) return;

    try {
      examManagementService.updateCustomExamStatus(selectedRequest.id, {
        status: reviewAction,
        adminComments: adminComment,
        adminName: adminUser?.name || 'Jagadeesh Chittiboyina',
      });

      refreshData();
      toast.success(
        reviewAction === 'Approved'
          ? `Approved! "${selectedRequest.examName}" has been published to the student examination catalogue.`
          : `Request marked as ${reviewAction}.`
      );

      setSelectedRequest(null);
      setReviewAction(null);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const columns = [
    {
      header: 'Examination Request',
      key: 'examName',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-admin-text">{val}</div>
          <span className="text-[11px] text-admin-muted font-mono">{row.id} · {row.category}</span>
        </div>
      ),
    },
    {
      header: 'Submitted By',
      key: 'studentName',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-800">{val}</div>
          <div className="text-[11px] text-admin-muted">{row.studentEmail}</div>
        </div>
      ),
    },
    {
      header: 'Conducting Body',
      key: 'conductingOrg',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-700">{val}</span>,
    },
    {
      header: 'Submission Date',
      key: 'submittedAt',
      sortable: true,
      render: (val) => (
        <span className="text-slate-500 font-mono text-[11px]">
          {new Date(val).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Review Status',
      key: 'status',
      sortable: true,
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            title="Inspect Request"
            onClick={() => {
              setSelectedRequest(row);
              setReviewAction(null);
            }}
            className="p-1 text-admin-muted hover:text-admin-primary rounded-lg hover:bg-slate-100 transition"
          >
            <Eye size={15} />
          </button>

          {row.status !== 'Approved' && (
            <button
              type="button"
              title="Approve & Publish to Catalogue"
              onClick={() => handleOpenReview(row, 'Approved')}
              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold rounded-lg text-xs transition"
            >
              Approve
            </button>
          )}

          {row.status === 'Pending' && (
            <button
              type="button"
              title="Reject Submission"
              onClick={() => handleOpenReview(row, 'Rejected')}
              className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 font-semibold rounded-lg text-xs transition"
            >
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'Pending', label: 'Pending' },
        { value: 'Under Review', label: 'Under Review' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Rejected', label: 'Rejected' },
        { value: 'Needs Changes', label: 'Needs Changes' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            Custom Examination Approvals
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Review missing examinations submitted by students. Approving adds them directly to the official catalogue.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={requestsList}
        searchKey="examName"
        searchPlaceholder="Search custom examination requests..."
        filterOptions={filterOptions}
        exportFilename="custom-examination-requests.csv"
      />

      {/* Inspect & Review Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => {
            setSelectedRequest(null);
            setReviewAction(null);
          }}
          title={
            reviewAction
              ? `${reviewAction} Examination: ${selectedRequest.examName}`
              : `Review: ${selectedRequest.examName}`
          }
          subtitle={`Submission ID: ${selectedRequest.id} · Submitted by ${selectedRequest.studentName}`}
        >
          <div className="space-y-4 text-xs">
            {/* Submission Details */}
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5">
              <div>
                <span className="text-[10px] uppercase font-bold text-admin-muted block">Student Aspirant</span>
                <span className="font-bold text-slate-800">{selectedRequest.studentName} ({selectedRequest.studentEmail})</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-admin-muted block">Category</span>
                <span className="font-bold text-slate-800 uppercase">{selectedRequest.category}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-admin-muted block">Conducting Organization</span>
                <span className="font-semibold text-slate-700">{selectedRequest.conductingOrg}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-admin-muted block">Academic Level / State</span>
                <span className="font-semibold text-slate-700">{selectedRequest.level} · {selectedRequest.state || 'All India'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-admin-muted block">Minimum Qualification</span>
                <span className="font-semibold text-slate-700">{selectedRequest.qualification}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-admin-muted block">Current Status</span>
                <Badge variant={selectedRequest.status}>{selectedRequest.status}</Badge>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-admin-muted block mb-1">
                Submitted Syllabus & Topic Overview
              </span>
              <div className="rounded-xl border border-admin-border bg-white p-3 text-slate-700 leading-relaxed">
                {selectedRequest.syllabusSummary || 'No preliminary syllabus provided.'}
              </div>
            </div>

            {selectedRequest.officialWebsite && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-admin-muted">Official Portal:</span>
                <a
                  href={selectedRequest.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-admin-primary font-bold hover:underline flex items-center gap-1"
                >
                  {selectedRequest.officialWebsite} <ExternalLink size={12} />
                </a>
              </div>
            )}

            {/* Review History */}
            {selectedRequest.reviewHistory && selectedRequest.reviewHistory.length > 0 && (
              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] uppercase font-bold text-admin-muted flex items-center gap-1 mb-2">
                  <History size={12} /> Audit Trail & History
                </span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {selectedRequest.reviewHistory.map((h, i) => (
                    <div key={i} className="flex items-start justify-between rounded-lg bg-slate-50 p-2 text-[11px]">
                      <div>
                        <span className="font-bold text-slate-700">{h.adminName}: </span>
                        <span className="text-slate-600">{h.comment}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Comment Box */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block font-semibold text-admin-text mb-1">
                Admin Review Comments / Justification
              </label>
              <textarea
                rows={2}
                placeholder="Add verification notes, source citations, or feedback for the student..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="admin-input"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReviewAction('Needs Changes')}
                  className="admin-btn-outline text-amber-700 border-amber-200 hover:bg-amber-50"
                >
                  Request Changes
                </button>
                <button
                  type="button"
                  onClick={() => setReviewAction('Rejected')}
                  className="admin-btn-danger"
                >
                  Reject
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRequest(null);
                    setReviewAction(null);
                  }}
                  className="admin-btn-outline"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setReviewAction('Approved');
                    setTimeout(() => handleConfirmReview(), 50);
                  }}
                  className="admin-btn-primary bg-emerald-600 hover:bg-emerald-700"
                >
                  <FileCheck size={14} /> Approve & Add to Catalogue
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

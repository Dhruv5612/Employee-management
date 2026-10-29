import React, { useState, useEffect } from 'react';
import { leaveApi } from '../services/leaveApi.js';
import { employeeApi } from '../../employees/services/employeeApi.js';
import Button from '../../../components/common/Button.jsx';
import Modal from '../../../components/common/Modal.jsx';
import Input from '../../../components/common/Input.jsx';
import Select from '../../../components/common/Select.jsx';
import Loader from '../../../components/common/Loader.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import { useToast } from '../../../hooks/useToast.js';
import { useOutletContext } from 'react-router-dom';
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Plus,
  Calendar,
  Building2,
  AlertCircle,
  Filter,
  Check,
  X,
  FileText,
} from 'lucide-react';

export default function LeaveApprovalsPage() {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [filter, setFilter] = useState('Pending');
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  // Modal states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [reviewAction, setReviewAction] = useState('Approved'); // or 'Rejected'
  const [reviewComment, setReviewComment] = useState('');

  // New leave form
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
  });

  const { user } = useOutletContext() || {};
  const { success, error: toastError } = useToast();
  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes, empRes] = await Promise.all([
        leaveApi.listLeaves(filter),
        leaveApi.getLeaveStats(),
        employeeApi.listEmployees({ limit: 100 }),
      ]);

      let list = listRes || [];
      if (!isAdminOrHR) {
        const userEmail = user?.email?.toLowerCase();
        const userName = user?.name?.toLowerCase();
        list = list.filter(
          (l) =>
            (l.employeeEmail && l.employeeEmail.toLowerCase() === userEmail) ||
            (l.employeeName && l.employeeName.toLowerCase() === userName)
        );
        setStats({
          pending: list.filter((l) => l.status === 'Pending').length,
          approved: list.filter((l) => l.status === 'Approved').length,
          rejected: list.filter((l) => l.status === 'Rejected').length,
          total: list.length,
        });
      } else {
        setStats(statsRes || { pending: 0, approved: 0, rejected: 0, total: 0 });
      }

      setLeaves(list);
      setEmployees(empRes?.employees || []);
    } catch (err) {
      console.error(err);
      toastError('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleOpenReview = (leave, action) => {
    setSelectedLeave(leave);
    setReviewAction(action);
    setReviewComment(action === 'Approved' ? 'Approved after review.' : 'Declined due to operational constraints.');
    setIsReviewModalOpen(true);
  };

  const handleConfirmReview = async () => {
    if (!selectedLeave) return;
    try {
      await leaveApi.updateLeaveStatus(selectedLeave._id, {
        status: reviewAction,
        reviewComment,
        reviewedBy: user?.name || 'Administrator',
      });
      success(`Leave request ${reviewAction.toLowerCase()} successfully!`);
      setIsReviewModalOpen(false);
      fetchData();
    } catch (err) {
      toastError(err.message || 'Failed to update leave request');
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      toastError('Please fill in all required dates and reason');
      return;
    }

    if (isAdminOrHR && !formData.employeeId) {
      toastError('Please select an employee');
      return;
    }

    const emp = isAdminOrHR
      ? employees.find((e) => e.employeeId === formData.employeeId || e._id === formData.employeeId)
      : null;

    try {
      await leaveApi.createLeave({
        employeeId: emp?.employeeId || user?.employeeId || 'EMP-' + (user?._id?.slice(-4) || '1001'),
        employeeName: emp?.fullName || user?.name || 'Employee',
        employeeEmail: emp?.email || user?.email || '',
        department: emp?.department?.name || user?.department || 'Operations',
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days: Number(formData.days) || 1,
        reason: formData.reason,
      });
      success('Leave application submitted successfully!');
      setIsApplyModalOpen(false);
      setFormData({
        employeeId: '',
        leaveType: 'Casual Leave',
        startDate: '',
        endDate: '',
        days: 1,
        reason: '',
      });
      fetchData();
    } catch (err) {
      toastError('Failed to submit leave request');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#fef3c7',
              color: '#b45309',
            }}
          >
            <Clock size={12} /> Pending Approval
          </span>
        );
      case 'Approved':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#d1fae5',
              color: '#065f46',
            }}
          >
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#fee2e2',
              color: '#991b1b',
            }}
          >
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                backgroundColor: '#fef3c7',
                color: '#b45309',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <CalendarClock size={14} /> Time Off Management
            </span>
          </div>
          <h1 className="page-title">
            {isAdminOrHR ? 'Leave Approvals & Management' : 'My Leave Management'}
          </h1>
          <p className="page-subtitle">
            {isAdminOrHR
              ? 'Review, authorize, and track employee vacation, medical, and emergency leave requests'
              : 'View your personal leave history, track approval status, and submit time-off requests'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="primary" icon={Plus} onClick={() => setIsApplyModalOpen(true)}>
            Apply for Leave
          </Button>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              {isAdminOrHR ? 'Pending Action' : 'My Pending Leaves'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#b45309' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
            {stats.pending}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, marginTop: '0.25rem' }}>
            {isAdminOrHR ? 'Requires supervisor authorization' : 'Awaiting manager approval'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              {isAdminOrHR ? 'Approved Leaves' : 'My Approved Leaves'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#d1fae5', color: '#065f46' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
            {stats.approved}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '0.25rem' }}>
            {isAdminOrHR ? 'Approved for current period' : 'Authorized time-off granted'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              {isAdminOrHR ? 'Declined Requests' : 'My Declined Leaves'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b' }}>
              <XCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
            {stats.rejected}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: '0.25rem' }}>
            {isAdminOrHR ? 'Declined or withdrawn' : 'Declined applications'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              {isAdminOrHR ? 'Total Applications' : 'My Total Applications'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600, marginTop: '0.25rem' }}>
            {isAdminOrHR ? 'All recorded leaves' : 'Total filed by you'}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '1.25rem',
          paddingBottom: '0.25rem',
        }}
      >
        {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: filter === tab ? '#4f46e5' : 'transparent',
              color: filter === tab ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            <span>{tab}</span>
            {tab === 'Pending' && stats.pending > 0 && (
              <span
                style={{
                  backgroundColor: filter === tab ? '#ffffff' : '#fef3c7',
                  color: filter === tab ? '#4f46e5' : '#b45309',
                  borderRadius: '9999px',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                }}
              >
                {stats.pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem' }}>
            <Loader message="Loading leave applications..." />
          </div>
        ) : leaves.length === 0 ? (
          <EmptyState
            title={`No ${filter} Leave Requests`}
            description={`There are currently no leave requests with status "${filter}".`}
            actionLabel="Apply For Leave"
            onAction={() => setIsApplyModalOpen(true)}
          />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  {isAdminOrHR && <th style={{ textAlign: 'center' }}>Review Action</th>}
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#e0e7ff',
                            color: '#4338ca',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {leave.employeeName?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{leave.employeeName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{leave.employeeId}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                        {leave.department}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          backgroundColor: '#f1f5f9',
                          color: '#334155',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {leave.leaveType}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                        {leave.startDate} to {leave.endDate}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {leave.days} {leave.days === 1 ? 'day' : 'days'}
                      </div>
                    </td>

                    <td style={{ maxWidth: '240px' }}>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#475569',
                          lineHeight: '1.4',
                          whiteSpace: 'normal',
                        }}
                      >
                        {leave.reason}
                      </div>
                      {leave.reviewComment && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#6366f1',
                            marginTop: '0.25rem',
                            fontStyle: 'italic',
                          }}
                        >
                          <strong>{leave.reviewedBy}:</strong> {leave.reviewComment}
                        </div>
                      )}
                    </td>

                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{leave.appliedDate}</td>

                    <td>{getStatusBadge(leave.status)}</td>

                    {isAdminOrHR && (
                      <td style={{ textAlign: 'center' }}>
                        {leave.status === 'Pending' ? (
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenReview(leave, 'Approved')}
                              style={{
                                border: '1px solid #10b981',
                                backgroundColor: '#ecfdf5',
                                color: '#047857',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                              title="Approve leave request"
                            >
                              <Check size={14} /> Approve
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenReview(leave, 'Rejected')}
                              style={{
                                border: '1px solid #ef4444',
                                backgroundColor: '#fef2f2',
                                color: '#b91c1c',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                              title="Reject leave request"
                            >
                              <X size={14} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Reviewed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && selectedLeave && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title={`${reviewAction} Leave Request: ${selectedLeave.employeeName}`}
        >
          <div style={{ padding: '0.5rem 0' }}>
            <div
              style={{
                backgroundColor: reviewAction === 'Approved' ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${reviewAction === 'Approved' ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
              }}
            >
              <div>
                <strong>Employee:</strong> {selectedLeave.employeeName} ({selectedLeave.employeeId})
              </div>
              <div>
                <strong>Duration:</strong> {selectedLeave.startDate} to {selectedLeave.endDate} ({selectedLeave.days}{' '}
                days)
              </div>
              <div>
                <strong>Reason:</strong> {selectedLeave.reason}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Reviewer Comments / Note
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                }}
                placeholder="Add optional notes for the employee..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={reviewAction === 'Approved' ? 'primary' : 'danger'}
                onClick={handleConfirmReview}
              >
                Confirm {reviewAction}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title="Submit New Leave Request"
        >
          <form onSubmit={handleApplyLeave}>
            {isAdminOrHR ? (
              <div style={{ marginBottom: '1rem' }}>
                <Select
                  label="Select Employee"
                  value={formData.employeeId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                  options={employees.map((emp) => ({
                    value: emp.employeeId,
                    label: `${emp.fullName} (${emp.employeeId} - ${emp.department?.name || 'Dept'})`,
                  }))}
                  placeholder="Choose employee..."
                  required
                />
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>APPLICANT</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                  {user?.name || 'Employee'}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{user?.email}</div>
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <Select
                label="Leave Type"
                value={formData.leaveType}
                onChange={(e) => setFormData((prev) => ({ ...prev, leaveType: e.target.value }))}
                options={[
                  { value: 'Casual Leave', label: 'Casual Leave' },
                  { value: 'Sick Leave', label: 'Sick / Medical Leave' },
                  { value: 'Annual Vacation', label: 'Annual Vacation' },
                  { value: 'Emergency Leave', label: 'Emergency Leave' },
                  { value: 'Maternity/Paternity', label: 'Maternity / Paternity Leave' },
                ]}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <Input
                label="Total Days"
                type="number"
                min="1"
                max="90"
                value={formData.days}
                onChange={(e) => setFormData((prev) => ({ ...prev, days: e.target.value }))}
                required
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Reason for Leave
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                rows={3}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                }}
                placeholder="Specify reason for leave..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="outline" type="button" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit Request
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}


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
  Search,
  LayoutGrid,
  Table as TableIcon,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function LeaveApprovalsPage() {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [filter, setFilter] = useState('Pending');
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

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

  const getLeaveTypeStyle = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('sick') || t.includes('medical')) {
      return {
        bg: '#fff1f2',
        color: '#FCA5A5',
        border: '1px solid rgba(239, 68, 68, 0.30)',
        label: type || 'Sick Leave',
      };
    }
    if (t.includes('casual') || t.includes('personal')) {
      return {
        bg: 'rgba(198, 244, 50, 0.12)',
        color: '#C6F432',
        border: '1px solid rgba(198, 244, 50, 0.30)',
        label: type || 'Casual Leave',
      };
    }
    if (t.includes('annual') || t.includes('vacation') || t.includes('earned')) {
      return {
        bg: 'rgba(198, 244, 50, 0.12)',
        color: '#C6F432',
        border: '1px solid rgba(198, 244, 50, 0.30)',
        label: type || 'Annual Leave',
      };
    }
    if (t.includes('maternity') || t.includes('paternity')) {
      return {
        bg: '#fdf2f8',
        color: '#C6F432',
        border: '1px solid rgba(198, 244, 50, 0.25)',
        label: type || 'Parental Leave',
      };
    }
    return {
      bg: '#171918',
      color: '#E4E4E7',
      border: '1px solid rgba(255, 255, 255, 0.10)',
      label: type || 'Standard Leave',
    };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: 'rgba(250, 204, 21, 0.12)',
              color: '#FDE047',
              border: '1px solid rgba(250, 204, 21, 0.30)',
              boxShadow: '0 1px 3px rgba(245, 158, 11, 0.1)',
              whiteSpace: 'nowrap',
            }}
          >
            <Clock size={13} color="#FDE047" />
            <span>Pending Review</span>
          </span>
        );
      case 'Approved':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: 'rgba(198, 244, 50, 0.12)',
              color: '#C6F432',
              border: '1px solid rgba(198, 244, 50, 0.30)',
              boxShadow: '0 1px 3px rgba(16, 185, 129, 0.1)',
              whiteSpace: 'nowrap',
            }}
          >
            <CheckCircle2 size={13} color="#C6F432" />
            <span>Approved</span>
          </span>
        );
      case 'Rejected':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: 'rgba(239, 68, 68, 0.14)',
              color: '#FCA5A5',
              border: '1px solid rgba(239, 68, 68, 0.30)',
              boxShadow: '0 1px 3px rgba(239, 68, 68, 0.1)',
              whiteSpace: 'nowrap',
            }}
          >
            <XCircle size={13} color="#FCA5A5" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: '#171918',
              color: '#D4D4D8',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              whiteSpace: 'nowrap',
            }}
          >
            {status}
          </span>
        );
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
                backgroundColor: 'rgba(250, 204, 21, 0.14)',
                color: '#FDE047',
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
            <span style={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 600 }}>
              {isAdminOrHR ? 'Pending Action' : 'My Pending Leaves'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: 'rgba(250, 204, 21, 0.14)', color: '#FDE047' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.5rem' }}>
            {stats.pending}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#FDE047', fontWeight: 600, marginTop: '0.25rem' }}>
            {isAdminOrHR ? 'Requires supervisor authorization' : 'Awaiting manager approval'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 600 }}>
              {isAdminOrHR ? 'Approved Leaves' : 'My Approved Leaves'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: 'rgba(198, 244, 50, 0.14)', color: '#C6F432' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.5rem' }}>
            {stats.approved}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#C6F432', fontWeight: 600, marginTop: '0.25rem' }}>
            {isAdminOrHR ? 'Approved for current period' : 'Authorized time-off granted'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 600 }}>
              {isAdminOrHR ? 'Declined Requests' : 'My Declined Leaves'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.14)', color: '#FCA5A5' }}>
              <XCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.5rem' }}>
            {stats.rejected}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#FCA5A5', fontWeight: 600, marginTop: '0.25rem' }}>
            {isAdminOrHR ? 'Declined or withdrawn' : 'Declined applications'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 600 }}>
              {isAdminOrHR ? 'Total Applications' : 'My Total Applications'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: 'rgba(198, 244, 50, 0.14)', color: '#C6F432' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.5rem' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#C6F432', fontWeight: 600, marginTop: '0.25rem' }}>
            {isAdminOrHR ? 'All recorded leaves' : 'Total filed by you'}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
          marginBottom: '1.25rem',
          paddingBottom: '0.5rem',
        }}
      >
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: filter === tab ? '#C6F432' : '#161816',
                color: filter === tab ? '#0B0B0C' : '#A1A1AA',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease',
                boxShadow: filter === tab ? '0 2px 6px rgba(79, 70, 229, 0.3)' : 'none',
              }}
            >
              <span>{tab}</span>
              {tab === 'Pending' && stats.pending > 0 && (
                <span
                  style={{
                    backgroundColor: filter === tab ? '#0B0B0C' : 'rgba(250, 204, 21, 0.14)',
                    color: filter === tab ? '#C6F432' : '#FDE047',
                    borderRadius: '9999px',
                    padding: '0.1rem 0.5rem',
                    fontSize: '0.725rem',
                    fontWeight: 800,
                  }}
                >
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Box & View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#71717A' }}
            />
            <input
              type="text"
              placeholder="Search by name, reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                fontSize: '0.825rem',
                outline: 'none',
                backgroundColor: '#121314',
              }}
            />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#171918',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.7rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'table' ? '#C6F432' : 'transparent',
                color: viewMode === 'table' ? '#0B0B0C' : '#A1A1AA',
                fontWeight: 700,
                fontSize: '0.775rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.7rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'cards' ? '#C6F432' : 'transparent',
                color: viewMode === 'cards' ? '#0B0B0C' : '#A1A1AA',
                fontWeight: 700,
                fontSize: '0.775rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <LayoutGrid size={14} />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Bento Cards */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3.5rem' }}>
            <Loader message="Loading leave applications..." />
          </div>
        ) : leaves.length === 0 ? (
          <EmptyState
            title={`No ${filter} Leave Requests`}
            description={`There are currently no leave requests with status "${filter}".`}
            actionLabel="Apply For Leave"
            onAction={() => setIsApplyModalOpen(true)}
          />
        ) : viewMode === 'cards' ? (
          /* --- BENTO CARDS VIEW --- */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '1.25rem',
              padding: '1.25rem',
            }}
          >
            {leaves
              .filter((l) => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                return (
                  (l.employeeName && l.employeeName.toLowerCase().includes(q)) ||
                  (l.employeeId && l.employeeId.toLowerCase().includes(q)) ||
                  (l.department && l.department.toLowerCase().includes(q)) ||
                  (l.leaveType && l.leaveType.toLowerCase().includes(q)) ||
                  (l.reason && l.reason.toLowerCase().includes(q))
                );
              })
              .map((leave) => {
                const typeStyle = getLeaveTypeStyle(leave.leaveType);
                return (
                  <div
                    key={leave._id}
                    style={{
                      backgroundColor: '#121314',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                      padding: '1.25rem',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div>
                      {/* Top Header: Employee & Status */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, #C6F432, #C6F432)',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '1rem',
                              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                              flexShrink: 0,
                            }}
                          >
                            {leave.employeeName?.charAt(0) || 'E'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>{leave.employeeName}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                              <span
                                style={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.725rem',
                                  fontWeight: 600,
                                  backgroundColor: '#171918',
                                  color: '#D4D4D8',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  border: '1px solid rgba(255, 255, 255, 0.10)',
                                }}
                              >
                                {leave.employeeId}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>&bull; {leave.department || 'Operations'}</span>
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(leave.status)}
                      </div>

                      {/* Attribute Pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.85rem' }}>
                        <span
                          style={{
                            backgroundColor: typeStyle.bg,
                            color: typeStyle.color,
                            border: typeStyle.border,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                          }}
                        >
                          {leave.leaveType}
                        </span>
                        <span
                          style={{
                            backgroundColor: '#171918',
                            color: '#E4E4E7',
                            border: '1px solid rgba(255, 255, 255, 0.10)',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <Calendar size={13} color="#C6F432" />
                          <span>{leave.startDate} &rarr; {leave.endDate}</span>
                          <span
                            style={{
                              backgroundColor: 'rgba(198, 244, 50, 0.12)',
                              color: '#C6F432',
                              border: '1px solid rgba(198, 244, 50, 0.30)',
                              borderRadius: '9999px',
                              padding: '1px 6px',
                              fontSize: '0.7rem',
                            }}
                          >
                            {leave.days} {leave.days === 1 ? 'day' : 'days'}
                          </span>
                        </span>
                      </div>

                      {/* Reason Container */}
                      <div
                        style={{
                          backgroundColor: '#171918',
                          border: '1px solid rgba(255, 255, 255, 0.10)',
                          borderRadius: '8px',
                          padding: '0.65rem 0.85rem',
                          fontSize: '0.825rem',
                          color: '#E4E4E7',
                          lineHeight: '1.45',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#71717A', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          Reason for Request
                        </div>
                        &ldquo;{leave.reason}&rdquo;
                      </div>

                      {/* Review Comment if available */}
                      {leave.reviewComment && (
                        <div
                          style={{
                            backgroundColor: '#171918',
                            borderLeft: '3px solid #C6F432',
                            borderRadius: '0 6px 6px 0',
                            padding: '0.45rem 0.75rem',
                            fontSize: '0.775rem',
                            marginBottom: '0.75rem',
                          }}
                        >
                          <span style={{ fontWeight: 700, color: '#C6F432' }}>{leave.reviewedBy}:</span>{' '}
                          <span style={{ color: '#C6F432', fontStyle: 'italic' }}>{leave.reviewComment}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Timestamp and Action */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        paddingTop: '0.85rem',
                        marginTop: '0.5rem',
                        fontSize: '0.775rem',
                        color: '#A1A1AA',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} color="#71717A" /> Filed on {leave.appliedDate}
                      </span>

                      {isAdminOrHR && leave.status === 'Pending' && (
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenReview(leave, 'Approved')}
                            style={{
                              border: '1px solid #C6F432',
                              backgroundColor: 'rgba(198, 244, 50, 0.12)',
                              color: '#C6F432',
                              padding: '0.35rem 0.7rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Check size={13} /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenReview(leave, 'Rejected')}
                            style={{
                              border: '1px solid #F87171',
                              backgroundColor: 'rgba(239, 68, 68, 0.14)',
                              color: '#FCA5A5',
                              padding: '0.35rem 0.7rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <X size={13} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          /* --- HIGH-CLARITY TABLE VIEW --- */
          <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', minWidth: '1050px' }}>
              <thead>
                <tr>
                  <th style={{ minWidth: '220px' }}>Employee</th>
                  <th style={{ minWidth: '150px' }}>Department</th>
                  <th style={{ minWidth: '140px' }}>Leave Type</th>
                  <th style={{ minWidth: '200px' }}>Duration</th>
                  <th style={{ minWidth: '260px' }}>Reason & Notes</th>
                  <th style={{ minWidth: '130px' }}>Applied On</th>
                  <th style={{ minWidth: '150px' }}>Status</th>
                  {isAdminOrHR && <th style={{ minWidth: '160px', textAlign: 'center' }}>Review Action</th>}
                </tr>
              </thead>
              <tbody>
                {leaves
                  .filter((l) => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      (l.employeeName && l.employeeName.toLowerCase().includes(q)) ||
                      (l.employeeId && l.employeeId.toLowerCase().includes(q)) ||
                      (l.department && l.department.toLowerCase().includes(q)) ||
                      (l.leaveType && l.leaveType.toLowerCase().includes(q)) ||
                      (l.reason && l.reason.toLowerCase().includes(q))
                    );
                  })
                  .map((leave) => {
                    const typeStyle = getLeaveTypeStyle(leave.leaveType);
                    return (
                      <tr key={leave._id}>
                        {/* Employee Column */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: '#C6F432',
                                color: '#0B0B0C',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                                flexShrink: 0,
                              }}
                            >
                              {leave.employeeName?.charAt(0) || 'E'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.925rem' }}>
                                {leave.employeeName}
                              </div>
                              <span
                                style={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.725rem',
                                  fontWeight: 600,
                                  backgroundColor: '#171918',
                                  color: '#D4D4D8',
                                  padding: '2px 7px',
                                  borderRadius: '4px',
                                  border: '1px solid rgba(255, 255, 255, 0.10)',
                                  display: 'inline-block',
                                  marginTop: '3px',
                                }}
                              >
                                {leave.employeeId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Department Column */}
                        <td>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.3rem 0.65rem',
                              borderRadius: '6px',
                              backgroundColor: '#171918',
                              border: '1px solid rgba(255, 255, 255, 0.10)',
                              fontSize: '0.825rem',
                              fontWeight: 600,
                              color: '#E4E4E7',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Building2 size={13} color="#C6F432" />
                            {leave.department || 'Operations'}
                          </span>
                        </td>

                        {/* Leave Type Column */}
                        <td>
                          <span
                            style={{
                              backgroundColor: typeStyle.bg,
                              color: typeStyle.color,
                              border: typeStyle.border,
                              padding: '0.3rem 0.7rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              display: 'inline-block',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {leave.leaveType}
                          </span>
                        </td>

                        {/* Duration Column */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <Calendar size={13} color="#C6F432" />
                              <span>{leave.startDate}</span>
                              <span style={{ color: '#71717A' }}>&rarr;</span>
                              <span>{leave.endDate}</span>
                            </div>
                            <div>
                              <span
                                style={{
                                  display: 'inline-block',
                                  fontSize: '0.725rem',
                                  fontWeight: 700,
                                  color: '#C6F432',
                                  backgroundColor: 'rgba(198, 244, 50, 0.12)',
                                  border: '1px solid rgba(198, 244, 50, 0.30)',
                                  padding: '1px 8px',
                                  borderRadius: '9999px',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {leave.days} {leave.days === 1 ? 'day' : 'days'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Reason & Review Note Column */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '280px' }}>
                            <div
                              style={{
                                backgroundColor: '#171918',
                                border: '1px solid rgba(255, 255, 255, 0.10)',
                                borderRadius: '8px',
                                padding: '0.5rem 0.75rem',
                                fontSize: '0.825rem',
                                color: '#E4E4E7',
                                lineHeight: '1.45',
                                wordBreak: 'break-word',
                              }}
                            >
                              &ldquo;{leave.reason}&rdquo;
                            </div>
                            {leave.reviewComment && (
                              <div
                                style={{
                                  backgroundColor: '#171918',
                                  borderLeft: '3px solid #C6F432',
                                  borderRadius: '0 6px 6px 0',
                                  padding: '0.35rem 0.65rem',
                                  fontSize: '0.75rem',
                                }}
                              >
                                <span style={{ fontWeight: 700, color: '#C6F432' }}>{leave.reviewedBy}:</span>{' '}
                                <span style={{ color: '#C6F432', fontStyle: 'italic' }}>{leave.reviewComment}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Applied On Column */}
                        <td>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.775rem',
                              fontWeight: 600,
                              color: '#A1A1AA',
                              backgroundColor: '#171918',
                              border: '1px solid rgba(255, 255, 255, 0.10)',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Clock size={12} color="#71717A" />
                            {leave.appliedDate}
                          </span>
                        </td>

                        {/* Status Column */}
                        <td>{getStatusBadge(leave.status)}</td>

                        {/* Review Action Column */}
                        {isAdminOrHR && (
                          <td style={{ textAlign: 'center' }}>
                            {leave.status === 'Pending' ? (
                              <div style={{ display: 'inline-flex', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenReview(leave, 'Approved')}
                                  style={{
                                    border: '1px solid #C6F432',
                                    backgroundColor: 'rgba(198, 244, 50, 0.12)',
                                    color: '#C6F432',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.775rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    boxShadow: '0 1px 2px rgba(16, 185, 129, 0.1)',
                                  }}
                                  title="Approve leave request"
                                >
                                  <Check size={14} /> Approve
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenReview(leave, 'Rejected')}
                                  style={{
                                    border: '1px solid #F87171',
                                    backgroundColor: 'rgba(239, 68, 68, 0.14)',
                                    color: '#FCA5A5',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.775rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    boxShadow: '0 1px 2px rgba(239, 68, 68, 0.1)',
                                  }}
                                  title="Reject leave request"
                                >
                                  <X size={14} /> Reject
                                </button>
                              </div>
                            ) : (
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: '#71717A',
                                  backgroundColor: '#171918',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(255, 255, 255, 0.10)',
                                }}
                              >
                                Reviewed
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
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
                backgroundColor: reviewAction === 'Approved' ? '#f0fdf4' : 'rgba(239, 68, 68, 0.14)',
                border: `1px solid ${reviewAction === 'Approved' ? 'rgba(198, 244, 50, 0.30)' : 'rgba(239, 68, 68, 0.30)'}`,
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
                  border: '1px solid rgba(255, 255, 255, 0.14)',
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
                  backgroundColor: '#171918',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ color: '#A1A1AA', fontSize: '0.75rem', fontWeight: 600 }}>APPLICANT</div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
                  {user?.name || 'Employee'}
                </div>
                <div style={{ color: '#A1A1AA', fontSize: '0.8rem' }}>{user?.email}</div>
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
                  border: '1px solid rgba(255, 255, 255, 0.14)',
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


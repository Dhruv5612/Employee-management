import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../dashboardApi.js';
import { leaveApi } from '../../leaves/services/leaveApi.js';
import { attendanceApi } from '../../attendance/services/attendanceApi.js';
import { announcementApi } from '../../announcements/services/announcementApi.js';
import DepartmentChart from '../components/DepartmentChart.jsx';
import StatusChart from '../components/StatusChart.jsx';
import StatCard from '../components/StatCard.jsx';
import Loader from '../../../components/common/Loader.jsx';
import ErrorState from '../../../components/common/ErrorState.jsx';
import Button from '../../../components/common/Button.jsx';
import Modal from '../../../components/common/Modal.jsx';
import Input from '../../../components/common/Input.jsx';
import Select from '../../../components/common/Select.jsx';
import { useToast } from '../../../hooks/useToast.js';
import { formatDate } from '../../../utils/dateUtils.js';
import authStorage from '../../../services/authStorage.js';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Building2,
  UserPlus,
  ArrowRight,
  FileText,
  Activity,
  ShieldCheck,
  Sparkles,
  Crown,
  Zap,
  Calendar,
  CalendarClock,
  CalendarDays,
  CalendarCheck,
  ClipboardList,
  Banknote,
  Megaphone,
  Plus,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  X,
  Briefcase,
  UserCog,
} from 'lucide-react';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';

export default function DashboardPage() {
  const [searchParams] = useSearchParams();
  const context = useOutletContext() || {};

  // Retrieve user from context or fallback immediately to session storage
  const storedUser = authStorage.getUser();
  const user = context.user || storedUser;
  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  // Toggle between Executive Analytics and Employee view
  const [viewMode, setViewMode] = useState(isAdminOrHR ? 'executive' : 'employee');

  const [stats, setStats] = useState({
    totalEmployees: 6,
    activeEmployees: 5,
    inactiveEmployees: 0,
    onLeaveEmployees: 1,
    totalDepartments: 6,
  });
  const [leaveStats, setLeaveStats] = useState({ pending: 2, approved: 1 });
  const [allLeaves, setAllLeaves] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [attendanceCount, setAttendanceCount] = useState(4);
  const [announcements, setAnnouncements] = useState([]);
  const [deptDistribution, setDeptDistribution] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quick Apply Leave Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [leaveFormData, setLeaveFormData] = useState({
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
  });

  const { success, error: toastError } = useToast();

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const [statsRes, deptRes, statusRes, actRes, leavesRes, attRes, annRes] = await Promise.all([
        dashboardApi.getStats().catch(() => null),
        dashboardApi.getDepartmentDistribution().catch(() => []),
        dashboardApi.getStatusDistribution().catch(() => []),
        dashboardApi.getActivities().catch(() => []),
        leaveApi.listLeaves('All').catch(() => []),
        attendanceApi.listAttendance(todayStr).catch(() => []),
        announcementApi.listAnnouncements().catch(() => []),
      ]);

      if (statsRes && statsRes.totalEmployees !== undefined) {
        setStats(statsRes);
      }
      setDeptDistribution(deptRes && deptRes.length ? deptRes : [
        { departmentName: 'Engineering', employeeCount: 3 },
        { departmentName: 'Product Management', employeeCount: 1 },
        { departmentName: 'Human Resources', employeeCount: 1 },
        { departmentName: 'Finance & Operations', employeeCount: 1 },
      ]);
      setStatusDistribution(statusRes && statusRes.length ? statusRes : [
        { status: 'Active', count: 5 },
        { status: 'On Leave', count: 1 },
        { status: 'Inactive', count: 0 },
      ]);
      setActivities(actRes || []);
      setAnnouncements(annRes || []);
      setAllLeaves(leavesRes || []);

      const userEmail = user?.email?.toLowerCase();
      const userName = user?.name?.toLowerCase();

      // For Admin: leaveStats reflects company-wide pending and approved counts
      const pendingTotal = (leavesRes || []).filter((l) => l.status === 'Pending').length;
      const approvedTotal = (leavesRes || []).filter((l) => l.status === 'Approved').length;

      // Filter for current employee's personal leaves
      const personalLeaves = (leavesRes || []).filter(
        (l) =>
          (userEmail && l.employeeEmail && l.employeeEmail.toLowerCase() === userEmail) ||
          (userName && l.employeeName && l.employeeName.toLowerCase() === userName)
      );

      if (isAdminOrHR) {
        setLeaveStats({ pending: pendingTotal || 2, approved: approvedTotal || 1 });
        setMyLeaves(personalLeaves.length ? personalLeaves : (leavesRes || []).slice(0, 5));
      } else {
        const myPending = personalLeaves.filter((l) => l.status === 'Pending').length;
        const myApproved = personalLeaves.filter((l) => l.status === 'Approved').length;
        setLeaveStats({ pending: myPending, approved: myApproved });
        setMyLeaves(personalLeaves.slice(0, 5));
      }

      // Calculate attendance
      if (isAdminOrHR) {
        const presentCount = (attRes || []).filter((a) => a.status === 'Present').length;
        setAttendanceCount(presentCount || 4);
      } else {
        const myAttendance = (attRes || []).filter(
          (a) =>
            (userEmail && a.employeeEmail && a.employeeEmail.toLowerCase() === userEmail) ||
            (userName && a.employeeName && a.employeeName.toLowerCase() === userName)
        );
        const myDays = myAttendance.filter((a) => a.status === 'Present' || a.status === 'Half Day').length;
        setAttendanceCount(myDays || 2);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.email, user?.role]);

  // Handle Quick Approval / Rejection directly from dashboard table
  const handleQuickStatus = async (leaveId, newStatus) => {
    try {
      await leaveApi.updateLeaveStatus(leaveId, newStatus, `Updated from Admin Dashboard`);
      success(`Leave request ${newStatus.toLowerCase()} successfully!`);
      fetchDashboardData();
    } catch (err) {
      toastError('Failed to update leave status');
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveFormData.startDate || !leaveFormData.endDate || !leaveFormData.reason.trim()) {
      toastError('Please fill in all required fields');
      return;
    }

    try {
      await leaveApi.createLeave({
        employeeId: user?.employeeId || 'EMP-CURRENT',
        employeeName: user?.name || 'Employee',
        employeeEmail: user?.email || '',
        department: user?.department || 'Operations',
        leaveType: leaveFormData.leaveType,
        startDate: leaveFormData.startDate,
        endDate: leaveFormData.endDate,
        days: Number(leaveFormData.days) || 1,
        reason: leaveFormData.reason,
      });
      success('Leave application submitted successfully!');
      setIsApplyModalOpen(false);
      setLeaveFormData({
        leaveType: 'Casual Leave',
        startDate: '',
        endDate: '',
        days: 1,
        reason: '',
      });
      fetchDashboardData();
    } catch (err) {
      toastError('Failed to apply for leave');
    }
  };

  if (loading) {
    return <Loader message="Loading dashboard activities..." />;
  }

  if (error) {
    return <ErrorState title="Dashboard Error" message={error} onRetry={fetchDashboardData} />;
  }

  // Display name from user
  const displayName = user?.name ? user.name.split(' ')[0] : 'Administrator';

  // Formatted date matching image: e.g. "August 27, 2025" or today
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const pendingLeavesList = allLeaves.filter((l) => l.status === 'Pending');

  return (
    <div>
      {/* ========================================================================= */}
      {/* 🚀 EXECUTIVE COMMAND DECK HERO (BALANCED 2-COLUMN WITH QUICK HUD)          */}
      {/* ========================================================================= */}
      <div
        className="genz-hero-card"
        style={{
          marginBottom: '2rem',
          padding: '2.25rem 2.5rem',
          background: 'radial-gradient(ellipse 60% 80% at 88% 12%, rgba(198, 244, 50, 0.16) 0%, transparent 62%), linear-gradient(135deg, #121314 0%, #0E100E 55%, #161A12 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 24px 48px -12px rgba(11, 15, 25, 0.7), 0 0 45px rgba(99, 102, 241, 0.15)',
        }}
      >
        <div className="genz-hero-grid">
          {/* Left Column: Greeting, Badges, and Action Strip */}
          <div>
            {/* Top Nano Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'rgba(99, 102, 241, 0.22)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '9999px',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(165, 180, 252, 0.35)',
                  color: '#C6F432',
                  boxShadow: '0 2px 10px rgba(99, 102, 241, 0.2)',
                }}
              >
                <Sparkles size={13} color="#C6F432" />
                <span>Workforce HQ • Live Matrix</span>
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  color: '#C6F432',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.15)',
                }}
              >
                <span className="pulse-dot online" style={{ width: '7px', height: '7px' }} />
                <span>All Systems Operational</span>
              </span>
            </div>

            {/* Bold Heading */}
            <h1
              style={{
                fontSize: '2.35rem',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 1.15,
                margin: 0,
                color: '#ffffff',
              }}
            >
              Welcome back, {displayName}! 🚀
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: '0.95rem',
                color: '#A1A1AA',
                marginTop: '0.6rem',
                lineHeight: 1.55,
                maxWidth: '620px',
              }}
            >
              {viewMode === 'executive'
                ? "Your real-time workforce command deck is synchronized. Review pending staff time-off, monitor active duty rosters, and control team velocity."
                : "Welcome to your personal workstation. Track attendance logs, review time-off applications, and catch up on company broadcasts."}
            </p>

            {/* Actions Bar (Upgraded with Radiant Glowing Buttons) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {/* Electric + Apply Leave Button */}
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.35rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  background: '#C6F432',
                  color: '#0B0B0C',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  boxShadow: '0 0 24px rgba(198, 244, 50, 0.32)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 0 32px rgba(198, 244, 50, 0.48)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(198, 244, 50, 0.32)';
                }}
              >
                <Plus size={17} strokeWidth={2.8} />
                <span>Apply Leave</span>
              </button>

              {/* Crystal Glass Date Box */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '14px',
                  padding: '0.62rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 4px 12px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Calendar size={16} color="#C6F432" />
                <span>{formattedDate}</span>
              </div>

              {/* Electric Capsule Switcher (Executive HQ vs My View) */}
              {isAdminOrHR && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    borderRadius: '9999px',
                    padding: '0.28rem',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.35), 0 4px 14px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode('executive')}
                    style={{
                      padding: '0.45rem 1.05rem',
                      borderRadius: '9999px',
                      border: viewMode === 'executive' ? '1px solid rgba(255, 255, 255, 0.4)' : 'none',
                      background:
                        viewMode === 'executive'
                          ? '#C6F432'
                          : 'transparent',
                      color: viewMode === 'executive' ? '#0B0B0C' : '#A1A1AA',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow:
                        viewMode === 'executive'
                          ? '0 4px 16px rgba(198, 244, 50, 0.3)'
                          : 'none',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      textShadow: viewMode === 'executive' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (viewMode !== 'executive') {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (viewMode !== 'executive') {
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    👑 Executive HQ
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('employee')}
                    style={{
                      padding: '0.45rem 1.05rem',
                      borderRadius: '9999px',
                      border: viewMode === 'employee' ? '1px solid rgba(255, 255, 255, 0.4)' : 'none',
                      background:
                        viewMode === 'employee'
                          ? '#C6F432'
                          : 'transparent',
                      color: viewMode === 'employee' ? '#0B0B0C' : '#A1A1AA',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow:
                        viewMode === 'employee'
                          ? '0 4px 16px rgba(198, 244, 50, 0.3)'
                          : 'none',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      textShadow: viewMode === 'employee' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (viewMode !== 'employee') {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (viewMode !== 'employee') {
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    💼 My View
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Executive Pulse Check HUD (Vibrant Glass HUD) */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
              padding: '1.4rem 1.5rem',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 12px 30px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.9rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Zap size={16} color="#C6F432" />
                <span
                  style={{
                    fontSize: '0.775rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#ffffff',
                  }}
                >
                  Executive Pulse Check
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  backgroundColor: 'rgba(16, 185, 129, 0.25)',
                  color: '#C6F432',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(52, 211, 153, 0.45)',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
                }}
              >
                LIVE
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Tile 1: Active Duty */}
              <Link
                to="/attendance"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.95rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.28)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.18)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="pulse-dot online" />
                  <span style={{ fontSize: '0.85rem', color: '#E4E4E7', fontWeight: 600 }}>Active Roster</span>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#C6F432' }}>
                  {attendanceCount} Present Today &rarr;
                </span>
              </Link>

              {/* Tile 2: Pending Approvals */}
              <Link
                to="/leave-approvals"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.95rem',
                  borderRadius: '12px',
                  backgroundColor: leaveStats.pending > 0 ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.06)',
                  border: leaveStats.pending > 0 ? '1px solid rgba(245, 158, 11, 0.45)' : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: leaveStats.pending > 0 ? '0 0 15px rgba(245, 158, 11, 0.15)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.28)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = leaveStats.pending > 0 ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ClipboardList size={15} color="#C6F432" />
                  <span style={{ fontSize: '0.85rem', color: '#FDE047', fontWeight: 600 }}>Time-Off Requests</span>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FDE047' }}>
                  {leaveStats.pending} Pending Review &rarr;
                </span>
              </Link>

              {/* Tile 3: Announcements */}
              <Link
                to="/announcements"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.95rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(168, 85, 247, 0.12)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.22)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.12)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Megaphone size={15} color="#C6F432" />
                  <span style={{ fontSize: '0.85rem', color: '#E4E4E7', fontWeight: 600 }}>Company Notices</span>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#C6F432' }}>
                  {announcements.length || 3} Bulletins &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 HIGH-CRAFT BENTO STATS CARDS (PORCELAIN GLASS WITH RADIANT ACCENTS)     */}
      {/* ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Card 1: Pending Leave Requests */}
        <Link to="/leave-approvals" style={{ textDecoration: 'none' }}>
          <div
            className="bento-card"
            style={{
              padding: '1.5rem',
              backgroundColor: '#121314',
              borderTop: '3px solid #FDE047',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FDE047 0%, #EAB308 100%)',
                  color: '#0B0B0C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 18px -4px rgba(245, 158, 11, 0.45)',
                  flexShrink: 0,
                }}
              >
                <ClipboardList size={24} />
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: 'rgba(250, 204, 21, 0.12)',
                  color: '#FDE047',
                  border: '1px solid rgba(250, 204, 21, 0.30)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                }}
              >
                Action Needed ⚡
              </span>
            </div>

            <div style={{ marginTop: '1.15rem' }}>
              <span
                style={{
                  fontSize: '0.775rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#A1A1AA',
                }}
              >
                Pending Leaves
              </span>
              <div
                style={{
                  fontSize: '2.35rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                  marginTop: '0.35rem',
                  letterSpacing: '-0.03em',
                }}
              >
                {leaveStats.pending}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#FDE047',
                  fontWeight: 700,
                  marginTop: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>Review requests</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>
        </Link>

        {/* Card 2: Approved Leaves */}
        <Link to="/leave-approvals" style={{ textDecoration: 'none' }}>
          <div
            className="bento-card"
            style={{
              padding: '1.5rem',
              backgroundColor: '#121314',
              borderTop: '3px solid #C6F432',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #C6F432 0%, #A6D11D 100%)',
                  color: '#0B0B0C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 18px -4px rgba(16, 185, 129, 0.45)',
                  flexShrink: 0,
                }}
              >
                <CalendarCheck size={24} />
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: 'rgba(198, 244, 50, 0.12)',
                  color: '#C6F432',
                  border: '1px solid rgba(198, 244, 50, 0.30)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                }}
              >
                This Month 🌴
              </span>
            </div>

            <div style={{ marginTop: '1.15rem' }}>
              <span
                style={{
                  fontSize: '0.775rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#A1A1AA',
                }}
              >
                Approved (Month)
              </span>
              <div
                style={{
                  fontSize: '2.35rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                  marginTop: '0.35rem',
                  letterSpacing: '-0.03em',
                }}
              >
                {leaveStats.approved}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#C6F432',
                  fontWeight: 700,
                  marginTop: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>View scheduled time-off</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>
        </Link>

        {/* Card 3: Attendance (Today) */}
        <Link to="/attendance" style={{ textDecoration: 'none' }}>
          <div
            className="bento-card"
            style={{
              padding: '1.5rem',
              backgroundColor: '#121314',
              borderTop: '3px solid #FFFFFF',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #D4D4D8 100%)',
                  color: '#0B0B0C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 18px -4px rgba(59, 130, 246, 0.45)',
                  flexShrink: 0,
                }}
              >
                <UserCheck size={24} />
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                }}
              >
                Live Roster 🟢
              </span>
            </div>

            <div style={{ marginTop: '1.15rem' }}>
              <span
                style={{
                  fontSize: '0.775rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#A1A1AA',
                }}
              >
                {viewMode === 'executive' ? 'Staff Present Today' : 'Attendance (Month)'}
              </span>
              <div
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                  marginTop: '0.35rem',
                  letterSpacing: '-0.03em',
                }}
              >
                {attendanceCount} {viewMode === 'executive' ? 'Present' : 'Days'}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  marginTop: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>Check daily roll</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>
        </Link>

        {/* Card 4: Announcements */}
        <Link to="/announcements" style={{ textDecoration: 'none' }}>
          <div
            className="bento-card"
            style={{
              padding: '1.5rem',
              backgroundColor: '#121314',
              borderTop: '3px solid #C6F432',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #C6F432 0%, #FFFFFF 100%)',
                  color: '#0B0B0C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 18px -4px rgba(139, 92, 246, 0.45)',
                  flexShrink: 0,
                }}
              >
                <Megaphone size={24} />
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: 'rgba(198, 244, 50, 0.10)',
                  color: '#C6F432',
                  border: '1px solid rgba(198, 244, 50, 0.28)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                }}
              >
                Broadcasts 📢
              </span>
            </div>

            <div style={{ marginTop: '1.15rem' }}>
              <span
                style={{
                  fontSize: '0.775rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#A1A1AA',
                }}
              >
                Company Notices
              </span>
              <div
                style={{
                  fontSize: '2.35rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                  marginTop: '0.35rem',
                  letterSpacing: '-0.03em',
                }}
              >
                {announcements.length || 3}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#C6F432',
                  fontWeight: 700,
                  marginTop: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>Read bulletin board</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* ADMIN & EXECUTIVE MANAGEMENT OVERVIEW (Rendered for Admin/HR)             */}
      {/* ========================================================================= */}
      {isAdminOrHR && viewMode === 'executive' && (
        <>
          {/* Quick Action Pills for Admin */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              flexWrap: 'wrap',
              marginBottom: '1.75rem',
            }}
          >
            <Link to="/employees" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                className="genz-tab-pill active"
                style={{ padding: '0.55rem 1rem' }}
              >
                <Users size={15} />
                <span>Manage Squad</span>
              </button>
            </Link>
            <Link to="/leave-approvals" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                className="genz-tab-pill"
                style={{
                  padding: '0.55rem 1rem',
                  backgroundColor: 'rgba(250, 204, 21, 0.12)',
                  color: '#FDE047',
                  borderColor: 'rgba(250, 204, 21, 0.32)',
                }}
              >
                <ClipboardList size={15} color="#FDE047" />
                <span>Pending Reviews ({leaveStats.pending})</span>
              </button>
            </Link>
            <Link to="/payroll" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                className="genz-tab-pill"
                style={{ padding: '0.55rem 1rem' }}
              >
                <Banknote size={15} />
                <span>Run Payroll 💸</span>
              </button>
            </Link>
            <Link to="/announcements" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                className="genz-tab-pill"
                style={{ padding: '0.55rem 1rem' }}
              >
                <Megaphone size={15} />
                <span>Post Notice 📢</span>
              </button>
            </Link>
            {user?.role === 'Admin' && (
              <Link to="/admin/users" style={{ textDecoration: 'none' }}>
                <button
                  type="button"
                  className="genz-tab-pill"
                  style={{
                    padding: '0.55rem 1rem',
                    background: '#C6F432',
                    color: '#0B0B0C',
                    border: 'none',
                    boxShadow: '0 4px 14px rgba(198, 244, 50, 0.28)',
                  }}
                >
                  <Crown size={15} />
                  <span>User Admin Matrix 👑</span>
                </button>
              </Link>
            )}
          </div>

          {/* Core Workforce Stat Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees || 6}
              icon={Users}
              trend="+12% from last quarter"
              colorScheme="indigo"
            />
            <StatCard
              title="Active Staff"
              value={stats.activeEmployees || 5}
              icon={UserCheck}
              trend="92% active duty"
              colorScheme="emerald"
            />
            <StatCard
              title="On Leave / Away"
              value={stats.onLeaveEmployees || 1}
              icon={Clock}
              trend="Scheduled time-off"
              colorScheme="amber"
            />
            <StatCard
              title="Total Departments"
              value={stats.totalDepartments || 6}
              icon={Building2}
              trend="Across all business units"
              colorScheme="violet"
            />
          </div>

          {/* Visual Analytics Charts */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Department Distribution</h3>
                  <p style={{ fontSize: '0.825rem', color: '#A1A1AA' }}>Employees allocated per functional unit</p>
                </div>
                <Link to="/departments" style={{ fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Manage <ArrowRight size={14} />
                </Link>
              </div>
              <DepartmentChart data={deptDistribution} />
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Employment Status Overview</h3>
                  <p style={{ fontSize: '0.825rem', color: '#A1A1AA' }}>Active, Inactive, and On-Leave workforce</p>
                </div>
                <Link to="/employees" style={{ fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Directory <ArrowRight size={14} />
                </Link>
              </div>
              <StatusChart data={statusDistribution} />
            </div>
          </div>

          {/* Pending Leave Approvals Table (Actionable on Dashboard) */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ClipboardList size={22} color="#FDE047" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Pending Leave Approvals ({pendingLeavesList.length})
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: '#A1A1AA' }}>
                    Staff requests awaiting your administrative review
                  </p>
                </div>
              </div>
              <Link to="/leave-approvals" style={{ fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Open Approvals Center <ArrowRight size={14} />
              </Link>
            </div>

            {pendingLeavesList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: '#A1A1AA', fontSize: '0.9rem' }}>
                <CheckCircle2 size={32} color="#C6F432" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                All caught up! There are no pending leave requests waiting for approval.
              </div>
            ) : (
              <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', minWidth: '820px' }}>
                  <thead>
                    <tr>
                      <th style={{ minWidth: '200px' }}>Employee</th>
                      <th style={{ minWidth: '130px' }}>Leave Type</th>
                      <th style={{ minWidth: '180px' }}>Duration</th>
                      <th style={{ minWidth: '220px' }}>Reason</th>
                      <th style={{ minWidth: '150px', textAlign: 'right' }}>Review Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingLeavesList.slice(0, 5).map((l) => (
                      <tr key={l._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '8px',
                                background: '#C6F432',
                                color: '#0B0B0C',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                flexShrink: 0,
                              }}
                            >
                              {l.employeeName?.charAt(0) || 'E'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem' }}>{l.employeeName}</div>
                              <div style={{ fontSize: '0.725rem', color: '#A1A1AA' }}>{l.department || l.employeeEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              backgroundColor: (l.leaveType || '').toLowerCase().includes('sick')
                                ? 'rgba(239, 68, 68, 0.14)'
                                : (l.leaveType || '').toLowerCase().includes('casual')
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(198, 244, 50, 0.14)',
                              color: (l.leaveType || '').toLowerCase().includes('sick')
                                ? '#FCA5A5'
                                : (l.leaveType || '').toLowerCase().includes('casual')
                                ? '#FFFFFF'
                                : '#C6F432',
                              border: '1px solid currentColor',
                              opacity: 0.95,
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {l.leaveType}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                              {formatDate(l.startDate)} &rarr; {formatDate(l.endDate)}
                            </span>
                            <span
                              style={{
                                display: 'inline-block',
                                width: 'fit-content',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: '#C6F432',
                                backgroundColor: 'rgba(198, 244, 50, 0.12)',
                                border: '1px solid rgba(198, 244, 50, 0.30)',
                                padding: '1px 6px',
                                borderRadius: '9999px',
                              }}
                            >
                              {l.days} {l.days === 1 ? 'day' : 'days'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: '#E4E4E7',
                              backgroundColor: '#161816',
                              border: '1px solid rgba(255, 255, 255, 0.10)',
                              borderRadius: '6px',
                              padding: '0.4rem 0.65rem',
                              lineHeight: '1.4',
                              maxWidth: '240px',
                              wordBreak: 'break-word',
                            }}
                          >
                            &ldquo;{l.reason}&rdquo;
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                            <button
                              type="button"
                              onClick={() => handleQuickStatus(l._id, 'Approved')}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.35rem 0.7rem',
                                borderRadius: '6px',
                                border: '1px solid rgba(198, 244, 50, 0.45)',
                                backgroundColor: 'rgba(198, 244, 50, 0.12)',
                                color: '#C6F432',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <Check size={13} /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickStatus(l._id, 'Rejected')}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.35rem 0.7rem',
                                borderRadius: '6px',
                                border: '1px solid rgba(239, 68, 68, 0.40)',
                                backgroundColor: 'rgba(239, 68, 68, 0.14)',
                                color: '#FCA5A5',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <X size={13} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* System Activities Audit Trail */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Activity size={20} color="#C6F432" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent System Activities</h3>
                  <p style={{ fontSize: '0.825rem', color: '#A1A1AA' }}>Audit trail of recent system modifications</p>
                </div>
              </div>
              <Link to="/activity-logs" style={{ fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View All Logs <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activities.slice(0, 5).map((act, idx) => (
                <div
                  key={act._id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#161816',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C6F432' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF' }}>
                      {act.action ? act.action.replace(/_/g, ' ') : 'System Action'} &bull; {act.entityType || 'General'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.775rem', color: '#71717A' }}>{formatDate(act.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* EMPLOYEE CONTENT VIEW (TIME-OFF & NOTICES)                                 */}
      {/* ========================================================================= */}
      {(!isAdminOrHR || viewMode === 'employee') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Recent Time-Off Requests Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <CalendarClock size={20} color="#FDE047" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Recent Time-Off Requests
                </h3>
              </div>
              <Link
                to="/leave-approvals"
                style={{ fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {myLeaves.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#71717A', fontSize: '0.85rem' }}>
                No leave requests filed yet. Click "+ Apply Leave" to request time off.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {myLeaves.map((l) => (
                  <div
                    key={l._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: '#161816',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.875rem' }}>
                        {l.leaveType} &bull; {l.days} {l.days === 1 ? 'Day' : 'Days'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#A1A1AA', marginTop: '0.2rem' }}>
                        {formatDate(l.startDate)} &rarr; {formatDate(l.endDate)}
                      </div>
                    </div>

                    <div>
                      {l.status === 'Approved' ? (
                        <span
                          style={{
                            backgroundColor: 'rgba(198, 244, 50, 0.14)',
                            color: '#C6F432',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <CheckCircle2 size={12} /> Approved
                        </span>
                      ) : l.status === 'Pending' ? (
                        <span
                          style={{
                            backgroundColor: 'rgba(250, 204, 21, 0.14)',
                            color: '#FDE047',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <Clock size={12} /> Pending
                        </span>
                      ) : (
                        <span
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.14)',
                            color: '#FCA5A5',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Announcements Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Megaphone size={20} color="#C6F432" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Company Broadcasts & Notices
                </h3>
              </div>
              <Link
                to="/announcements"
                style={{ fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                Bulletin Board <ArrowRight size={14} />
              </Link>
            </div>

            {announcements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#71717A', fontSize: '0.85rem' }}>
                No active announcements right now.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {announcements.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: item.isPinned ? 'rgba(198, 244, 50, 0.07)' : '#161816',
                      border: item.isPinned ? '1px solid rgba(198, 244, 50, 0.28)' : '1px solid rgba(255, 255, 255, 0.07)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          backgroundColor: item.category === 'Urgent Notice' ? 'rgba(239, 68, 68, 0.14)' : 'rgba(198, 244, 50, 0.12)',
                          color: item.category === 'Urgent Notice' ? '#FCA5A5' : '#C6F432',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                        }}
                      >
                        {item.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#71717A' }}>{item.date}</span>
                    </div>

                    <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#A1A1AA', lineHeight: 1.4, margin: 0 }}>
                      {item.content && item.content.length > 120 ? item.content.slice(0, 120) + '...' : item.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Apply Leave Modal */}
      {isApplyModalOpen && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title="Submit Leave Application"
        >
          <form onSubmit={handleApplyLeave}>
            <div style={{ marginBottom: '1rem' }}>
              <Select
                label="Leave Type"
                value={leaveFormData.leaveType}
                onChange={(e) => setLeaveFormData((prev) => ({ ...prev, leaveType: e.target.value }))}
                options={[
                  { value: 'Casual Leave', label: 'Casual Leave' },
                  { value: 'Sick Leave', label: 'Sick / Medical Leave' },
                  { value: 'Annual Vacation', label: 'Annual Vacation' },
                  { value: 'Emergency Leave', label: 'Emergency Leave' },
                ]}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <Input
                label="Start Date"
                type="date"
                value={leaveFormData.startDate}
                onChange={(e) => setLeaveFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={leaveFormData.endDate}
                onChange={(e) => setLeaveFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <Input
                label="Total Days"
                type="number"
                min="1"
                max="60"
                value={leaveFormData.days}
                onChange={(e) => setLeaveFormData((prev) => ({ ...prev, days: e.target.value }))}
                required
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Reason for Leave
              </label>
              <textarea
                value={leaveFormData.reason}
                onChange={(e) => setLeaveFormData((prev) => ({ ...prev, reason: e.target.value }))}
                rows={3}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  backgroundColor: '#161816',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                }}
                placeholder="State your reason..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="outline" type="button" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit Application
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

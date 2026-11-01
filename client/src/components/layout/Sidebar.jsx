import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileSpreadsheet,
  Activity,
  UserCog,
  User,
  Settings,
  LogOut,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Shield,
  CalendarClock,
  CalendarDays,
  Banknote,
  Megaphone,
  ChevronRight,
  DollarSign,
  Clock,
  LayoutGrid,
  Building,
} from 'lucide-react';
import { authApi } from '../../features/auth/services/authApi.js';
import { isDemoMode, setDemoMode } from '../../services/apiClient.js';
import { useToast } from '../../hooks/useToast.js';

export default function Sidebar({ user, isOpen, onClose }) {
  const navigate = useNavigate();
  const { info } = useToast();
  const demoActive = isDemoMode();
  const isAdmin = user?.role === 'Admin';
  const isHR = user?.role === 'HR';

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/');
  };

  const handleToggleDemoMode = () => {
    const nextState = !demoActive;
    setDemoMode(nextState);
    info(
      nextState
        ? 'Switched to Demo Mode (using local browser storage mock)'
        : 'Switched to Production API Mode (connecting to Express + MongoDB)'
    );
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Branding from Image: Employee Management System in Orange */}
      <div
        className="sidebar-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1.25rem 1.25rem 1rem',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: 'rgba(249, 115, 22, 0.15)',
            color: '#f97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Building size={22} color="#f97316" />
        </div>
        <div>
          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#f97316',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}
          >
            Employee<br />Management<br />System
          </div>
        </div>
      </div>

      <nav className="sidebar-nav" style={{ padding: '1rem 0.75rem' }}>
        {/* Section Label: Main (from Image) */}
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#94a3b8',
            padding: '0.25rem 0.75rem 0.6rem',
          }}
        >
          Main
        </div>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <LayoutGrid size={18} />
          <span style={{ flex: 1 }}>Dashboard</span>
        </NavLink>

        <NavLink
          to="/leave-approvals"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <CalendarClock size={18} />
          <span style={{ flex: 1 }}>Leave Management</span>
          <ChevronRight size={15} style={{ opacity: 0.6 }} />
        </NavLink>

        <NavLink
          to="/payroll"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <DollarSign size={18} />
          <span style={{ flex: 1 }}>Payroll</span>
          <ChevronRight size={15} style={{ opacity: 0.6 }} />
        </NavLink>

        <NavLink
          to="/attendance"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <Clock size={18} />
          <span style={{ flex: 1 }}>Attendance</span>
          <ChevronRight size={15} style={{ opacity: 0.6 }} />
        </NavLink>

        <NavLink
          to="/announcements"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <Megaphone size={18} />
          <span style={{ flex: 1 }}>Announcements</span>
          <ChevronRight size={15} style={{ opacity: 0.6 }} />
        </NavLink>

        {/* Administration Links */}
        {(isAdmin || isHR) && (
          <>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#94a3b8',
                padding: '1rem 0.75rem 0.5rem',
              }}
            >
              Organization
            </div>

            <NavLink
              to="/employees"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Users size={18} />
              <span>Employees</span>
            </NavLink>

            <NavLink
              to="/departments"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Building2 size={18} />
              <span>Departments</span>
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <FileSpreadsheet size={18} />
              <span>Reports</span>
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <NavLink
              to="/activity-logs"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Activity size={18} />
              <span>Activity Logs</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <UserCog size={18} />
              <span>User Admin</span>
            </NavLink>
          </>
        )}

        <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.65rem 0' }} />

        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <User size={18} />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        <div style={{ marginTop: 'auto', padding: '1rem 0.5rem 0' }}>
          {/* Demo mode switcher */}
          <div
            onClick={handleToggleDemoMode}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: demoActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${demoActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)'}`,
              cursor: 'pointer',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
            }}
          >
            <div>
              <div style={{ fontSize: '0.775rem', fontWeight: 700, color: demoActive ? '#fbbf24' : '#cbd5e1' }}>
                {demoActive ? 'Demo Storage Mode' : 'Live API Mode'}
              </div>
              <div style={{ fontSize: '0.675rem', color: '#94a3b8' }}>
                {demoActive ? 'Using Local Browser Data' : 'Express + MongoDB'}
              </div>
            </div>
            {demoActive ? (
              <ToggleRight size={22} color="#f59e0b" />
            ) : (
              <ToggleLeft size={22} color="#64748b" />
            )}
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <Link
          to="/profile"
          className="sidebar-user-info"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="sidebar-avatar">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'EM'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#0f172a',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: '120px',
              }}
            >
              {user?.name || 'Administrator'}
            </div>
            <div
              style={{
                fontSize: '0.725rem',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Shield size={12} color="#f97316" />
              <span>{user?.role || 'Admin'}</span>
            </div>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}

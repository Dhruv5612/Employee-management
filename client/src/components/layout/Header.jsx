import React from 'react';
import { Menu, Plus, Bell, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs.jsx';
import Button from '../common/Button.jsx';
import { authApi } from '../../features/auth/services/authApi.js';

export default function Header({ user, onMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const canAdd = user?.role === 'Admin' || user?.role === 'HR';

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <header
      className="app-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div className="header-title-section" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onMenuToggle}
          style={{
            background: 'none',
            border: 'none',
            color: '#334155',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
          }}
          title="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>

        {location.pathname !== '/dashboard' && <Breadcrumbs />}
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* + Apply Leave Orange Button (from Image) */}
        <Link to="/leave-approvals?apply=true" style={{ textDecoration: 'none' }}>
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#f97316',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(249, 115, 22, 0.3)',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
          >
            <Plus size={16} />
            <span>Apply Leave</span>
          </button>
        </Link>

        {/* Logout Red Button (from Image) */}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(239, 68, 68, 0.3)',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
        >
          <span>Logout</span>
        </button>

        {/* Notification Bell Icon */}
        <Link
          to="/announcements"
          style={{
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            padding: '6px',
            borderRadius: '50%',
            position: 'relative',
          }}
          title="Announcements & Notifications"
        >
          <Bell size={20} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
            }}
          />
        </Link>

        {/* User Avatar Circle (from Image) */}
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: '2px solid #cbd5e1',
              cursor: 'pointer',
            }}
            title={user?.name || 'User Profile'}
          >
            {initial}
          </div>
        </Link>
      </div>
    </header>
  );
}

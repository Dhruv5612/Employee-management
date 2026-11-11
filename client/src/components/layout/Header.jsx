import React from 'react';
import { Menu, Plus, Bell, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs.jsx';
import Button from '../common/Button.jsx';
import { authApi } from '../../features/auth/services/authApi.js';
import authStorage from '../../services/authStorage.js';

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
    authStorage.clear();
    navigate('/signin');
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
        backgroundColor: 'rgba(11, 11, 12, 0.88)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
      }}
    >
      <div className="header-title-section" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onMenuToggle}
          style={{
            background: 'none',
            border: 'none',
            color: '#E4E4E7',
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
        {/* + Apply Leave Orange Button */}
        <Link to="/leave-approvals?apply=true" style={{ textDecoration: 'none' }}>
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#C6F432',
              color: '#0B0B0C',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.825rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(249, 115, 22, 0.35)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.35)';
            }}
          >
            <Plus size={16} />
            <span>Apply Leave</span>
          </button>
        </Link>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'rgba(239, 68, 68, 0.14)',
            color: '#FCA5A5',
            border: '1px solid rgba(239, 68, 68, 0.30)',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem',
            fontSize: '0.825rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.14)';
            e.currentTarget.style.color = '#FCA5A5';
          }}
        >
          <span>Logout</span>
        </button>

        {/* Notification Bell Icon */}
        <Link
          to="/announcements"
          style={{
            color: '#A1A1AA',
            display: 'flex',
            alignItems: 'center',
            padding: '7px',
            borderRadius: '10px',
            position: 'relative',
            backgroundColor: '#161816',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
          title="Announcements & Notifications"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#C6F432',
              boxShadow: '0 0 8px #C6F432',
            }}
          />
        </Link>

        {/* User Avatar Circle with Online Beacon */}
        <Link to="/profile" style={{ textDecoration: 'none', position: 'relative' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#C6F432',
              color: '#0B0B0C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.925rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.35)',
            }}
            title={user?.name || 'User Profile'}
          >
            {initial}
          </div>
          <span
            style={{
              position: 'absolute',
              bottom: '-1px',
              right: '-1px',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              backgroundColor: '#C6F432',
              border: '2px solid #0B0B0C',
            }}
          />
        </Link>
      </div>
    </header>
  );
}

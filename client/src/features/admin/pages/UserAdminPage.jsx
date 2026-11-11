import React, { useState, useEffect, useMemo } from 'react';
import { authApi } from '../../auth/services/authApi.js';
import Loader from '../../../components/common/Loader.jsx';
import ErrorState from '../../../components/common/ErrorState.jsx';
import Button from '../../../components/common/Button.jsx';
import ConfirmDialog from '../../../components/common/ConfirmDialog.jsx';
import Modal from '../../../components/common/Modal.jsx';
import Input from '../../../components/common/Input.jsx';
import { formatDate } from '../../../utils/dateUtils.js';
import { useToast } from '../../../hooks/useToast.js';
import authStorage from '../../../services/authStorage.js';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  Users,
  Search,
  Plus,
  Sparkles,
  Crown,
  Zap,
  Mail,
  Calendar,
  Copy,
  Check,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  ExternalLink,
  Key,
  SlidersHorizontal,
  X,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

// Gen Z Avatar Gradient Palette
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #52525B 0%, #27272A 100%)', // Indigo-Violet
  'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)', // Rose
  'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', // Cyan-Blue
  'linear-gradient(135deg, #C6F432 0%, #C6F432 100%)', // Emerald
  'linear-gradient(135deg, #FDE047 0%, #FDE047 100%)', // Amber
  'linear-gradient(135deg, #4D7C0F 0%, #365314 100%)', // Pink-Purple
];

function getAvatarGradient(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

export default function UserAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingNewUser, setIsSubmittingNewUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Viewer',
  });

  const { success, error: toastError, info } = useToast();

  // Retrieve current logged in user to prevent self-deletion or locking oneself out
  const currentLoggedInUser = authStorage.getUser();

  const fetchUsers = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await authApi.listUsers();
      setUsers(data || []);
      if (showRefreshIndicator) {
        success('Stream refreshed • Live synced! ⚡');
      }
    } catch (err) {
      setError(err.message || 'Failed to load user accounts');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await authApi.updateUserRole(userId, { role: newRole });
      success(`Updated role to ${newRole} ✨`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      toastError(err.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextState = !user.isActive;
    setUpdatingId(user._id);
    try {
      await authApi.updateUserRole(user._id, { isActive: nextState });
      success(
        nextState
          ? `Operator "${user.name}" activated! 🟢`
          : `Operator "${user.name}" paused! ⏸️`
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isActive: nextState } : u))
      );
    } catch (err) {
      toastError(err.message || 'Failed to toggle account status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await authApi.deleteUser(deleteTarget._id);
      success(`User account "${deleteTarget.name}" deleted successfully 🔥`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toastError(err.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyUserId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    info('User ID copied to clipboard! 📋');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleCopyInviteLink = () => {
    const origin = window.location.origin;
    const inviteUrl = `${origin}/signup`;
    navigator.clipboard.writeText(inviteUrl);
    success('Squad invite link copied to clipboard! 🚀 Send it to your teammate.');
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim() || !newUserData.password.trim()) {
      toastError('Please fill out all required fields');
      return;
    }
    if (newUserData.password.length < 6) {
      toastError('Password must be at least 6 characters');
      return;
    }

    setIsSubmittingNewUser(true);
    try {
      const res = await authApi.signup({
        name: newUserData.name.trim(),
        email: newUserData.email.trim().toLowerCase(),
        password: newUserData.password,
        role: newUserData.role,
      });

      const newUserObj = res?.user || {
        _id: 'usr_' + Date.now().toString(36),
        name: newUserData.name.trim(),
        email: newUserData.email.trim().toLowerCase(),
        role: newUserData.role,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      setUsers((prev) => [newUserObj, ...prev]);
      success(`Teammate "${newUserData.name}" joined the squad! 🎉`);
      setIsAddModalOpen(false);
      setNewUserData({
        name: '',
        email: '',
        password: '',
        role: 'Viewer',
      });
    } catch (err) {
      toastError(err.message || 'Failed to add user account');
    } finally {
      setIsSubmittingNewUser(false);
    }
  };

  const isCurrentUser = (user) => {
    if (!currentLoggedInUser) return false;
    const currentId = currentLoggedInUser.id || currentLoggedInUser._id;
    return (
      (currentId && user._id && currentId.toString() === user._id.toString()) ||
      (currentLoggedInUser.email &&
        user.email &&
        currentLoggedInUser.email.toLowerCase() === user.email.toLowerCase())
    );
  };

  // Metrics calculation
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.isActive).length;
  const adminCount = users.filter((u) => u.role === 'Admin').length;
  const hrCount = users.filter((u) => u.role === 'HR').length;
  const viewerCount = users.filter((u) => u.role === 'Viewer').length;
  const inactiveCount = totalCount - activeCount;

  // Filtered list based on search and role pills
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role / Status Filter
      if (selectedRoleFilter === 'Admin' && u.role !== 'Admin') return false;
      if (selectedRoleFilter === 'HR' && u.role !== 'HR') return false;
      if (selectedRoleFilter === 'Viewer' && u.role !== 'Viewer') return false;
      if (selectedRoleFilter === 'ACTIVE' && !u.isActive) return false;
      if (selectedRoleFilter === 'INACTIVE' && u.isActive) return false;

      // Search Query
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q)) ||
        (u._id && u._id.toLowerCase().includes(q))
      );
    });
  }, [users, searchQuery, selectedRoleFilter]);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* ========================================================================= */}
      {/* 🚀 GEN Z CYBER MATRIX HERO BANNER                                         */}
      {/* ========================================================================= */}
      <div className="genz-hero-card">
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Top Nano Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              flexWrap: 'wrap',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(198, 244, 50, 0.14)',
              }}
            >
              <Sparkles size={12} color="#FDE047" />
              <span>Team Access HQ • 2026 Edition</span>
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                fontWeight: 700,
                color: '#C6F432',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <span className="pulse-dot online" />
              <span>Realtime Auth Matrix</span>
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                fontWeight: 700,
                color: 'rgba(198, 244, 50, 0.30)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <ShieldCheck size={13} color="#C6F432" />
              <span>Role-Based Access Control</span>
            </span>
          </div>

          {/* Heading and Tagline */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.15,
                  margin: 0,
                  color: '#ffffff',
                }}
              >
                User Administration & Access Hub ✨
              </h1>
              <p
                style={{
                  fontSize: '0.975rem',
                  color: 'rgba(255, 255, 255, 0.14)',
                  marginTop: '0.65rem',
                  maxWidth: '680px',
                  lineHeight: 1.5,
                }}
              >
                Control team credentials, toggle operator active states, upgrade administrative
                privileges, and keep your squad synchronized with zero lag.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={() => fetchUsers(true)}
                disabled={isRefreshing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <RefreshCw
                  size={15}
                  style={{
                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                  }}
                />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyInviteLink}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Sparkles size={16} color="#FDE047" />
                <span>Invite Link</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#C6F432',
                  color: '#0B0B0C',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px -4px rgba(236, 72, 153, 0.5)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(236, 72, 153, 0.65)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(236, 72, 153, 0.5)';
                }}
              >
                <Plus size={18} />
                <span>Add Squad Member</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🎴 GEN Z BENTO STATS CARDS (INTERACTIVE FILTER SHORTCUTS)                  */}
      {/* ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Card 1: Total Squad */}
        <div
          className="bento-card"
          onClick={() => setSelectedRoleFilter('ALL')}
          style={{
            padding: '1.35rem 1.4rem',
            cursor: 'pointer',
            borderColor: selectedRoleFilter === 'ALL' ? '#C6F432' : undefined,
            backgroundColor: selectedRoleFilter === 'ALL' ? 'rgba(198, 244, 50, 0.08)' : '#121314',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total Accounts
              </span>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1, marginTop: '0.35rem' }}>
                {totalCount}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
                color: '#C6F432',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.85rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(198, 244, 50, 0.12)',
                color: '#C6F432',
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                fontWeight: 700,
              }}
            >
              🔥 The Full Squad
            </span>
            <span style={{ fontSize: '0.75rem', color: '#71717A' }}>100% indexed</span>
          </div>
        </div>

        {/* Card 2: Active Operators */}
        <div
          className="bento-card"
          onClick={() => setSelectedRoleFilter('ACTIVE')}
          style={{
            padding: '1.35rem 1.4rem',
            cursor: 'pointer',
            borderColor: selectedRoleFilter === 'ACTIVE' ? '#C6F432' : undefined,
            backgroundColor: selectedRoleFilter === 'ACTIVE' ? 'rgba(198, 244, 50, 0.08)' : '#121314',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Active Operators
              </span>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1, marginTop: '0.35rem' }}>
                {activeCount}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
                color: '#C6F432',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.85rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(198, 244, 50, 0.12)',
                color: '#C6F432',
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span className="pulse-dot online" />
              <span>Live & Active</span>
            </span>
            <span style={{ fontSize: '0.75rem', color: '#71717A' }}>
              {totalCount > 0 ? `${Math.round((activeCount / totalCount) * 100)}% uptime` : '100%'}
            </span>
          </div>
        </div>

        {/* Card 3: Administrators */}
        <div
          className="bento-card"
          onClick={() => setSelectedRoleFilter('Admin')}
          style={{
            padding: '1.35rem 1.4rem',
            cursor: 'pointer',
            borderColor: selectedRoleFilter === 'Admin' ? '#C6F432' : undefined,
            backgroundColor: selectedRoleFilter === 'Admin' ? 'rgba(198, 244, 50, 0.08)' : '#121314',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Super Admins
              </span>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1, marginTop: '0.35rem' }}>
                {adminCount}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
                color: '#C6F432',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Crown size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.85rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#C6F432',
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                fontWeight: 700,
              }}
            >
              👑 Full Root Access
            </span>
            <span style={{ fontSize: '0.75rem', color: '#71717A' }}>Strict Zero-Trust</span>
          </div>
        </div>

        {/* Card 4: HR & People Ops */}
        <div
          className="bento-card"
          onClick={() => setSelectedRoleFilter('HR')}
          style={{
            padding: '1.35rem 1.4rem',
            cursor: 'pointer',
            borderColor: selectedRoleFilter === 'HR' ? '#FDE047' : undefined,
            backgroundColor: selectedRoleFilter === 'HR' ? 'rgba(250, 204, 21, 0.10)' : '#121314',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                People & HR Ops
              </span>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1, marginTop: '0.35rem' }}>
                {hrCount}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
                color: '#FDE047',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.85rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(250, 204, 21, 0.14)',
                color: '#FDE047',
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                fontWeight: 700,
              }}
            >
              ✨ Staff & Dept Ops
            </span>
            <span style={{ fontSize: '0.75rem', color: '#71717A' }}>{viewerCount} viewers</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🎛️ CONTROL MATRIX: SEARCH, CATEGORY PILLS & VIEW MODE SWITCHER             */}
      {/* ========================================================================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          backgroundColor: '#121314',
          padding: '1rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        }}
      >
        {/* Search Bar with Keyboard Shortcut Badge */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            minWidth: '280px',
            flex: '1 1 320px',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.85rem',
              color: '#71717A',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search squad by name, email, or role..."
            style={{
              width: '100%',
              padding: '0.65rem 2.5rem 0.65rem 2.6rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              fontSize: '0.875rem',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              backgroundColor: '#171918',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#C6F432';
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)';
              e.target.style.backgroundColor = '#171918';
              e.target.style.boxShadow = 'none';
            }}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                color: '#71717A',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={16} />
            </button>
          ) : (
            <span
              style={{
                position: 'absolute',
                right: '0.75rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#71717A',
                backgroundColor: '#171918',
                padding: '0.15rem 0.4rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                pointerEvents: 'none',
              }}
            >
              ⌘K
            </span>
          )}
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            className={`genz-tab-pill ${selectedRoleFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedRoleFilter('ALL')}
          >
            <span>All</span>
            <span style={{ opacity: 0.75 }}>({totalCount})</span>
          </button>

          <button
            type="button"
            className={`genz-tab-pill ${selectedRoleFilter === 'Admin' ? 'active' : ''}`}
            onClick={() => setSelectedRoleFilter('Admin')}
          >
            <Crown size={13} color="#C6F432" />
            <span>Admins</span>
            <span style={{ opacity: 0.75 }}>({adminCount})</span>
          </button>

          <button
            type="button"
            className={`genz-tab-pill ${selectedRoleFilter === 'HR' ? 'active' : ''}`}
            onClick={() => setSelectedRoleFilter('HR')}
          >
            <Sparkles size={13} color="#FDE047" />
            <span>HR</span>
            <span style={{ opacity: 0.75 }}>({hrCount})</span>
          </button>

          <button
            type="button"
            className={`genz-tab-pill ${selectedRoleFilter === 'Viewer' ? 'active' : ''}`}
            onClick={() => setSelectedRoleFilter('Viewer')}
          >
            <span>Viewers</span>
            <span style={{ opacity: 0.75 }}>({viewerCount})</span>
          </button>

          <button
            type="button"
            className={`genz-tab-pill ${selectedRoleFilter === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setSelectedRoleFilter('ACTIVE')}
          >
            <span className="pulse-dot online" style={{ width: '6px', height: '6px' }} />
            <span>Active</span>
          </button>

          <button
            type="button"
            className={`genz-tab-pill ${selectedRoleFilter === 'INACTIVE' ? 'active' : ''}`}
            onClick={() => setSelectedRoleFilter('INACTIVE')}
          >
            <span>Paused</span>
          </button>
        </div>

        {/* View Mode Switcher (Bento Cards vs Data Table) */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#171918',
            padding: '0.25rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            title="Bento Cards View"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: viewMode === 'cards' ? '#C6F432' : 'transparent',
              color: viewMode === 'cards' ? '#0B0B0C' : '#A1A1AA',
              fontSize: '0.775rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <LayoutGrid size={15} />
            <span>Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('table')}
            title="Data Table View"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: viewMode === 'table' ? '#C6F432' : 'transparent',
              color: viewMode === 'table' ? '#0B0B0C' : '#A1A1AA',
              fontSize: '0.775rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <TableIcon size={15} />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📋 MAIN CONTENT: LOADING, ERROR, EMPTY, BENTO CARDS, OR TABLE              */}
      {/* ========================================================================= */}
      {loading ? (
        <div style={{ padding: '4rem 1rem' }}>
          <Loader message="Decrypting squad directory..." />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchUsers()} />
      ) : filteredUsers.length === 0 ? (
        <div
          style={{
            backgroundColor: '#121314',
            borderRadius: '20px',
            border: '2px dashed rgba(255, 255, 255, 0.14)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🛸</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            No squad members match your vibe check!
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#A1A1AA', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            No user accounts found matching &quot;{searchQuery || selectedRoleFilter}&quot;. Try adjusting your search query or clear the active filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedRoleFilter('ALL');
            }}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              background: '#FFFFFF',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* ========================================================================= */
        /* 🎴 BENTO CARDS VIEW                                                       */
        /* ========================================================================= */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredUsers.map((u) => {
            const isSelf = isCurrentUser(u);
            const avatarGrad = getAvatarGradient(u.name || 'User');
            const initials = u.name
              ? u.name
                .split(' ')
                .map((p) => p[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
              : 'OP';

            return (
              <div
                key={u._id}
                className="bento-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  border: isSelf ? '1.5px solid #C6F432' : undefined,
                  boxShadow: isSelf
                    ? '0 12px 28px -4px rgba(99, 102, 241, 0.18)'
                    : undefined,
                }}
              >
                {/* Card Top: Avatar, Name, Email, Status */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    {/* Avatar Ring */}
                    <div style={{ position: 'relative' }}>
                      <div
                        className="avatar-ring"
                        style={{
                          width: '54px',
                          height: '54px',
                          background: avatarGrad,
                          color: '#ffffff',
                          fontSize: '1.15rem',
                        }}
                      >
                        {initials}
                      </div>

                      {/* Status indicator on avatar corner */}
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: u.isActive ? '#C6F432' : '#F87171',
                          border: '2px solid #121314',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                        title={u.isActive ? 'Active Operator' : 'Account Suspended'}
                      />
                    </div>

                    {/* Role Pill Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {isSelf && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #C6F432 0%, #C6F432 100%)',
                            color: '#ffffff',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                          }}
                        >
                          ⚡ You
                        </span>
                      )}

                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor:
                            u.role === 'Admin'
                              ? '#f3e8ff'
                              : u.role === 'HR'
                                ? 'rgba(250, 204, 21, 0.14)'
                                : '#171918',
                          color:
                            u.role === 'Admin'
                              ? '#C6F432'
                              : u.role === 'HR'
                                ? '#FDE047'
                                : '#D4D4D8',
                          border: `1px solid ${u.role === 'Admin'
                              ? 'rgba(198, 244, 50, 0.25)'
                              : u.role === 'HR'
                                ? 'rgba(250, 204, 21, 0.30)'
                                : 'rgba(255, 255, 255, 0.10)'
                            }`,
                        }}
                      >
                        {u.role === 'Admin' ? (
                          <Crown size={12} color="#C6F432" />
                        ) : u.role === 'HR' ? (
                          <Sparkles size={12} color="#FDE047" />
                        ) : (
                          <Shield size={12} color="#D4D4D8" />
                        )}
                        <span>{u.role}</span>
                      </span>
                    </div>
                  </div>

                  {/* User Name & Work Email */}
                  <div>
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        lineHeight: 1.25,
                        margin: 0,
                      }}
                    >
                      {u.name}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginTop: '0.35rem',
                        color: '#A1A1AA',
                        fontSize: '0.85rem',
                      }}
                    >
                      <Mail size={14} color="#71717A" />
                      <span style={{ wordBreak: 'break-all' }}>{u.email}</span>
                    </div>

                    {/* Copyable User ID */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '0.65rem',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleCopyUserId(u._id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.10)',
                          backgroundColor: '#171918',
                          color: '#A1A1AA',
                          fontSize: '0.725rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'monospace',
                        }}
                        title="Click to copy full ID"
                      >
                        {copiedId === u._id ? (
                          <Check size={12} color="#C6F432" />
                        ) : (
                          <Copy size={12} color="#71717A" />
                        )}
                        <span>ID: {u._id ? u._id.slice(-8) : 'unknown'}</span>
                      </button>

                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.75rem',
                          color: '#71717A',
                        }}
                      >
                        <Calendar size={12} />
                        <span>Joined {formatDate(u.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Switcher Pill Bar */}
                <div
                  style={{
                    backgroundColor: '#171918',
                    borderRadius: '12px',
                    padding: '0.65rem 0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: '#71717A',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '0.45rem',
                    }}
                  >
                    Role Permissions
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.35rem' }}>
                    {['Admin', 'HR', 'Viewer'].map((roleOption) => {
                      const isSelected = u.role === roleOption;
                      return (
                        <button
                          key={roleOption}
                          type="button"
                          disabled={updatingId === u._id || isSelf}
                          onClick={() => handleRoleChange(u._id, roleOption)}
                          style={{
                            padding: '0.4rem 0.35rem',
                            borderRadius: '8px',
                            border: isSelected ? '1.5px solid #C6F432' : '1px solid rgba(255, 255, 255, 0.12)',
                            backgroundColor: isSelected ? '#C6F432' : 'transparent',
                            color: isSelected ? '#C6F432' : '#A1A1AA',
                            fontSize: '0.75rem',
                            fontWeight: isSelected ? 800 : 600,
                            cursor: isSelf ? 'not-allowed' : 'pointer',
                            boxShadow: isSelected ? '0 2px 6px rgba(99, 102, 241, 0.15)' : 'none',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {roleOption}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card Bottom Actions: Status Toggle & Delete */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {/* Status Switch with Gen Z Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <label className={`genz-switch ${isSelf ? 'disabled' : ''}`}>
                      <input
                        type="checkbox"
                        checked={Boolean(u.isActive)}
                        disabled={updatingId === u._id || isSelf}
                        onChange={() => handleToggleStatus(u)}
                      />
                      <span className="genz-slider" />
                    </label>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: u.isActive ? '#C6F432' : '#71717A',
                      }}
                    >
                      {u.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    disabled={updatingId === u._id || isSelf}
                    onClick={() => setDeleteTarget(u)}
                    title={isSelf ? 'Cannot delete your own account' : 'Delete user permanently'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.30)',
                      backgroundColor: 'rgba(239, 68, 68, 0.14)',
                      color: isSelf ? 'rgba(255, 255, 255, 0.14)' : '#FCA5A5',
                      fontSize: '0.775rem',
                      fontWeight: 700,
                      cursor: isSelf ? 'not-allowed' : 'pointer',
                      opacity: isSelf ? 0.5 : 1,
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelf) {
                        e.currentTarget.style.backgroundColor = '#F87171';
                        e.currentTarget.style.color = '#ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelf) {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.14)';
                        e.currentTarget.style.color = '#FCA5A5';
                      }
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================================= */
        /* 📊 DATA TABLE VIEW                                                        */
        /* ========================================================================= */
        <div
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '980px' }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '1.5rem', minWidth: '220px' }}>Operator Identity</th>
                  <th style={{ minWidth: '200px' }}>Work Email</th>
                  <th style={{ minWidth: '150px' }}>Role Access</th>
                  <th style={{ minWidth: '130px' }}>Active Status</th>
                  <th style={{ minWidth: '130px' }}>Registered</th>
                  <th style={{ textAlign: 'right', paddingRight: '1.5rem', minWidth: '220px', width: '220px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isSelf = isCurrentUser(u);
                  const avatarGrad = getAvatarGradient(u.name || 'User');
                  const initials = u.name
                    ? u.name
                      .split(' ')
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                    : 'OP';

                  return (
                    <tr
                      key={u._id}
                      style={{
                        backgroundColor: isSelf ? 'rgba(99, 102, 241, 0.03)' : undefined,
                      }}
                    >
                      <td style={{ paddingLeft: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div
                            className="avatar-ring"
                            style={{
                              width: '40px',
                              height: '40px',
                              background: avatarGrad,
                              color: '#ffffff',
                              fontSize: '0.9rem',
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.925rem' }}>
                                {u.name}
                              </span>
                              {isSelf && (
                                <span
                                  style={{
                                    fontSize: '0.675rem',
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #C6F432 0%, #C6F432 100%)',
                                    color: '#ffffff',
                                    padding: '0.1rem 0.45rem',
                                    borderRadius: '9999px',
                                  }}
                                >
                                  ⚡ You
                                </span>
                              )}
                            </div>
                            <div
                              onClick={() => handleCopyUserId(u._id)}
                              style={{
                                fontSize: '0.75rem',
                                color: '#71717A',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontFamily: 'monospace',
                              }}
                              title="Click to copy ID"
                            >
                              <span>#{u._id ? u._id.slice(-6) : ''}</span>
                              <Copy size={11} />
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.875rem', color: '#D4D4D8', fontWeight: 500 }}>
                          {u.email}
                        </span>
                      </td>

                      <td>
                        <select
                          value={u.role}
                          disabled={updatingId === u._id || isSelf}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.14)',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            backgroundColor: '#121314',
                            color: '#FFFFFF',
                            cursor: isSelf ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <option value="Admin">👑 Admin (Full Access)</option>
                          <option value="HR">✨ HR (Staff/Dept Ops)</option>
                          <option value="Viewer">👀 Viewer (Read Only)</option>
                        </select>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <label className={`genz-switch ${isSelf ? 'disabled' : ''}`}>
                            <input
                              type="checkbox"
                              checked={Boolean(u.isActive)}
                              disabled={updatingId === u._id || isSelf}
                              onChange={() => handleToggleStatus(u)}
                            />
                            <span className="genz-slider" />
                          </label>
                          <span
                            style={{
                              fontSize: '0.775rem',
                              fontWeight: 700,
                              color: u.isActive ? '#C6F432' : '#71717A',
                            }}
                          >
                            {u.isActive ? 'Active' : 'Paused'}
                          </span>
                        </div>
                      </td>

                      <td style={{ fontSize: '0.85rem', color: '#A1A1AA' }}>
                        {formatDate(u.createdAt)}
                      </td>

                      <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            type="button"
                            disabled={updatingId === u._id || isSelf}
                            onClick={() => handleToggleStatus(u)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.10)',
                              backgroundColor: '#121314',
                              color: '#E4E4E7',
                              fontSize: '0.775rem',
                              fontWeight: 700,
                              cursor: isSelf ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {u.isActive ? 'Pause' : 'Activate'}
                          </button>

                          <button
                            type="button"
                            disabled={updatingId === u._id || isSelf}
                            onClick={() => setDeleteTarget(u)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '8px',
                              border: '1px solid rgba(239, 68, 68, 0.30)',
                              backgroundColor: 'rgba(239, 68, 68, 0.14)',
                              color: isSelf ? 'rgba(255, 255, 255, 0.14)' : '#FCA5A5',
                              fontSize: '0.775rem',
                              fontWeight: 700,
                              cursor: isSelf ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 MODAL: ADD / INVITE SQUAD MEMBER                                        */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => !isSubmittingNewUser && setIsAddModalOpen(false)}
          title="Add Squad Member ✨"
        >
          <form onSubmit={handleCreateUser}>
            <div style={{ marginBottom: '1.25rem' }}>
              <Input
                label="Full Name"
                placeholder="e.g. Jordan Lee"
                value={newUserData.name}
                onChange={(e) =>
                  setNewUserData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <Input
                label="Work Email"
                type="email"
                placeholder="e.g. jordan.lee@company.com"
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <Input
                label="Initial Temporary Password"
                type="password"
                placeholder="Min. 6 characters"
                value={newUserData.password}
                onChange={(e) =>
                  setNewUserData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  marginBottom: '0.5rem',
                }}
              >
                Access Role Tier
              </label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                }}
              >
                {[
                  {
                    tier: 'Viewer',
                    label: 'Viewer',
                    desc: 'Read-only directory access',
                    icon: Shield,
                  },
                  {
                    tier: 'HR',
                    label: 'HR Lead',
                    desc: 'Staff & Leaves operations',
                    icon: Sparkles,
                  },
                  {
                    tier: 'Admin',
                    label: 'Admin',
                    desc: 'Full matrix command control',
                    icon: Crown,
                  },
                ].map(({ tier, label, desc, icon: Icon }) => {
                  const isSelected = newUserData.role === tier;
                  return (
                    <div
                      key={tier}
                      onClick={() =>
                        setNewUserData((prev) => ({ ...prev, role: tier }))
                      }
                      style={{
                        padding: '0.85rem',
                        borderRadius: '12px',
                        border: isSelected
                          ? '2px solid #C6F432'
                          : '1px solid rgba(255, 255, 255, 0.10)',
                        backgroundColor: isSelected ? 'rgba(198, 244, 50, 0.10)' : '#161816',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          marginBottom: '0.25rem',
                        }}
                      >
                        <Icon
                          size={15}
                          color={
                            isSelected
                              ? '#C6F432'
                              : tier === 'Admin'
                                ? '#C6F432'
                                : tier === 'HR'
                                  ? '#FDE047'
                                  : '#A1A1AA'
                          }
                        />
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: isSelected ? '#C6F432' : '#FFFFFF',
                          }}
                        >
                          {label}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#A1A1AA' }}>
                        {desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}
            >
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmittingNewUser}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmittingNewUser}
                style={{
                  background: '#C6F432',
                  color: '#0B0B0C',
                }}
              >
                {isSubmittingNewUser ? 'Deploying...' : 'Deploy Credentials 🚀'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* ⚠️ CONFIRM DIALOG: PERMANENT USER DELETION                                 */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => !isDeleting && setDeleteTarget(null)}
          onConfirm={handleDeleteUser}
          title="Delete Squad Member Account"
          message={`Are you sure you want to permanently delete the account for "${deleteTarget.name}" (${deleteTarget.email})? This action will immediately invalidate their sessions and credentials. This cannot be undone.`}
          confirmText="Yes, Permanently Delete 🔥"
          cancelText="Keep Account"
          isDestructive={true}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
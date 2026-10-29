import React, { useState, useEffect, useMemo } from 'react';
import { authApi } from '../../auth/services/authApi.js';
import Loader from '../../../components/common/Loader.jsx';
import ErrorState from '../../../components/common/ErrorState.jsx';
import Button from '../../../components/common/Button.jsx';
import ConfirmDialog from '../../../components/common/ConfirmDialog.jsx';
import SearchInput from '../../../components/common/SearchInput.jsx';
import { formatDate } from '../../../utils/dateUtils.js';
import { useToast } from '../../../hooks/useToast.js';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  UserCheck,
  Users,
  Search,
} from 'lucide-react';

export default function UserAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { success, error: toastError } = useToast();

  // Retrieve current logged in user to prevent self-deletion
  const currentLoggedInUser = (() => {
    try {
      const s = localStorage.getItem('user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.listUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load user accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await authApi.updateUserRole(userId, { role: newRole });
      success(`Updated role to ${newRole}`);
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
      success(`User account ${nextState ? 'activated' : 'deactivated'}`);
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
      success(`User account "${deleteTarget.name}" deleted successfully`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toastError(err.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
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

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">User Administration</h1>
          <p className="page-subtitle">
            Manage system credentials, assign roles, toggle account active states, and delete user accounts.
          </p>
        </div>
      </div>

      {/* Overview Metric Badges */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Accounts</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{users.length}</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Active Users</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              {users.filter((u) => u.isActive).length}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#fef3c7',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Administrators</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              {users.filter((u) => u.role === 'Admin').length}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, work email, or role..."
          onClear={() => setSearchQuery('')}
        />
        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Showing {filteredUsers.length} of {users.length} accounts
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <Loader message="Loading registered users..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchUsers} />
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            No user accounts found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>User Identity</th>
                  <th>Work Email</th>
                  <th>System Role</th>
                  <th>Account Status</th>
                  <th>Registered</th>
                  <th style={{ textAlign: 'right', width: '210px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isSelf = isCurrentUser(u);
                  return (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: isSelf ? '#ffedd5' : '#e0e7ff',
                              color: isSelf ? '#ea580c' : '#4338ca',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {u.name ? u.name.substring(0, 2).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</span>
                              {isSelf && (
                                <span
                                  style={{
                                    fontSize: '0.675rem',
                                    fontWeight: 700,
                                    backgroundColor: '#fff7ed',
                                    color: '#ea580c',
                                    border: '1px solid #fed7aa',
                                    padding: '0.1rem 0.4rem',
                                    borderRadius: '4px',
                                  }}
                                >
                                  You
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              ID: {u._id ? u._id.slice(-6) : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.875rem', color: '#475569' }}>{u.email}</span>
                      </td>

                      <td>
                        <select
                          value={u.role}
                          disabled={updatingId === u._id || isSelf}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.825rem',
                            fontWeight: 600,
                            backgroundColor: '#ffffff',
                            cursor: isSelf ? 'not-allowed' : 'pointer',
                          }}
                          title={isSelf ? 'You cannot alter your own admin privileges here' : 'Change user role'}
                        >
                          <option value="Admin">Admin (Full Control)</option>
                          <option value="HR">HR (Staff/Dept Operations)</option>
                          <option value="Viewer">Viewer (Read Only)</option>
                        </select>
                      </td>

                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            fontSize: '0.775rem',
                            fontWeight: 700,
                            backgroundColor: u.isActive ? '#ecfdf5' : '#fef2f2',
                            color: u.isActive ? '#065f46' : '#991b1b',
                            border: `1px solid ${u.isActive ? '#a7f3d0' : '#fecaca'}`,
                          }}
                        >
                          {u.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          <span>{u.isActive ? 'Active' : 'Deactivated'}</span>
                        </span>
                      </td>

                      <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {formatDate(u.createdAt)}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Button
                            variant={u.isActive ? 'outline' : 'secondary'}
                            size="sm"
                            disabled={updatingId === u._id || isSelf}
                            onClick={() => handleToggleStatus(u)}
                            title={isSelf ? 'Cannot deactivate your own account' : 'Toggle active state'}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            disabled={updatingId === u._id || isSelf}
                            onClick={() => setDeleteTarget(u)}
                            title={isSelf ? 'You cannot delete your own account' : 'Delete user'}
                            style={{
                              backgroundColor: isSelf ? '#f1f5f9' : '#ef4444',
                              color: isSelf ? '#94a3b8' : '#ffffff',
                              borderColor: isSelf ? '#e2e8f0' : '#ef4444',
                              cursor: isSelf ? 'not-allowed' : 'pointer',
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Permanent User Deletion */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => !isDeleting && setDeleteTarget(null)}
          onConfirm={handleDeleteUser}
          title="Delete User Account"
          message={`Are you sure you want to permanently delete the account for "${deleteTarget.name}" (${deleteTarget.email})? This action will immediately remove their login access and credentials. It cannot be undone.`}
          confirmText="Yes, Delete User"
          cancelText="Keep User"
          isDestructive={true}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { authApi } from '../../auth/services/authApi.js';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import { useToast } from '../../../hooks/useToast.js';
import {
  Lock,
  Bell,
  Sliders,
  Shield,
  Laptop,
  LogOut,
  Save,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useOutletContext() || {};
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    compactView: user?.preferences?.compactView ?? false,
  });
  const [prefLoading, setPrefLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      toastError('Current password is required');
      return;
    }
    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      toastError('New password must be at least 6 characters');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toastError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await authApi.changePassword(passwords.currentPassword, passwords.newPassword);
      success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toastError(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setPrefLoading(true);
    try {
      await authApi.updateProfile({ preferences });
      success('Workspace preferences updated');
    } catch (err) {
      toastError('Failed to update preferences');
    } finally {
      setPrefLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authApi.logout();
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Account & Settings</h1>
          <p className="page-subtitle">Configure security credentials, notification preferences, and active sessions</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Security & Password */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Lock size={20} color="#4f46e5" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Security & Password</h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Update your authentication credentials</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <Input
                label="Current Password"
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                placeholder="••••••••"
                required
              />

              <Input
                label="New Password"
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                placeholder="At least 6 characters"
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="••••••••"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type="submit" variant="primary" isLoading={passwordLoading}>
                Update Password
              </Button>
            </div>
          </form>
        </div>

        {/* Preferences */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Sliders size={20} color="#10b981" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Workspace Preferences</h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Customize your notification and layout options</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                  Email Notifications
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Receive email alerts for status changes and employee lifecycle updates
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences((p) => ({ ...p, emailNotifications: e.target.checked }))}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                  Compact Table Density
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Reduce table padding to fit more records on screen
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.compactView}
                onChange={(e) => setPreferences((p) => ({ ...p, compactView: e.target.checked }))}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <Button variant="secondary" onClick={handleSavePreferences} isLoading={prefLoading}>
              Save Preferences
            </Button>
          </div>
        </div>

        {/* Sessions & Sign Out */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Laptop size={20} color="#64748b" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Active Session</h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Current login details and device authorization</p>
            </div>
          </div>

          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>
                Current Browser Session
              </div>
              <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                Signed in as {user?.email} &bull; JWT Token Active
              </div>
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                color: '#10b981',
                backgroundColor: '#ecfdf5',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontWeight: 700,
              }}
            >
              Active Now
            </span>
          </div>

          <Button variant="danger" icon={LogOut} onClick={handleSignOut}>
            Sign Out of Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}

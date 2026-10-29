import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { authApi } from '../../auth/services/authApi.js';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import { useToast } from '../../../hooks/useToast.js';
import { User, Mail, Phone, ShieldCheck, CheckCircle2, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useOutletContext() || {};
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const updated = await authApi.updateProfile({ name, phone });
      localStorage.setItem('user', JSON.stringify({ ...user, ...updated }));
      success('Profile details updated successfully!');
      setTimeout(() => window.location.reload(), 400);
    } catch (err) {
      toastError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Personal Profile</h1>
          <p className="page-subtitle">View and update your personal identity and workspace contact info</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            paddingBottom: '1.75rem',
            marginBottom: '1.75rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
            }}
          >
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user?.name || 'Authorized User'}</h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: '#eef2ff',
                  color: '#4f46e5',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  border: '1px solid #c7d2fe',
                }}
              >
                {user?.role || 'Viewer'}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.2rem' }}>
              {user?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdate}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              required
            />

            <Input
              label="Work Email (Managed by Administrator)"
              value={user?.email || ''}
              disabled
              icon={Mail}
              helperText="Contact system administrator to alter work email"
            />

            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              icon={Phone}
            />

            <div className="form-group">
              <label className="form-label">System Role & Clearance</label>
              <div
                style={{
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#334155',
                }}
              >
                <ShieldCheck size={18} color="#10b981" />
                <span>{user?.role || 'Viewer'} Role Clearance</span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button type="submit" variant="primary" isLoading={isLoading} icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

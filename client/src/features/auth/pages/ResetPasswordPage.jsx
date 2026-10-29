import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/authApi.js';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import { useToast } from '../../../hooks/useToast.js';
import { Lock, Check, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: toastError } = useToast();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword(token, password);
      success(res.message || 'Password updated successfully!');
      navigate('/signin');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to reset password';
      setError(msg);
      toastError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Set New Password</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          Create a new secure password for your workspace account
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#991b1b',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleReset}>
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          icon={Lock}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          icon={Lock}
          required
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={Check}
          style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
        >
          Reset Password
        </Button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            to="/signin"
            style={{
              fontSize: '0.85rem',
              color: '#64748b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Return to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

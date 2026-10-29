import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../services/authApi.js';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import { useToast } from '../../../hooks/useToast.js';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const { error: toastError } = useToast();

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setSubmittedResult(res);
    } catch (err) {
      toastError(err.response?.data?.message || err.message || 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Forgot Password</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          We'll generate a secure reset link for your account
        </p>
      </div>

      {submittedResult ? (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <CheckCircle2 size={32} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#065f46', marginBottom: '0.5rem' }}>
            Reset Link Prepared
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {submittedResult.message}
          </p>

          {submittedResult.resetUrl && (
            <div
              style={{
                padding: '0.85rem',
                backgroundColor: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.825rem',
                color: '#334155',
              }}
            >
              <strong>Direct Reset Link:</strong>
              <div style={{ marginTop: '0.35rem' }}>
                <Link
                  to={submittedResult.resetUrl}
                  style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Click here to set a new password
                </Link>
              </div>
            </div>
          )}

          <Link to="/signin">
            <Button variant="outline" icon={ArrowLeft} style={{ width: '100%' }}>
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleRequest}>
          <Input
            label="Account Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@company.com"
            icon={Mail}
            required
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            icon={KeyRound}
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            Send Password Reset Link
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
      )}
    </div>
  );
}

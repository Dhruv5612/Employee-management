import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../services/authApi.js';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import Loader from '../../../components/common/Loader.jsx';
import { CheckCircle2, AlertCircle, ArrowLeft, MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [inputToken, setInputToken] = useState(token || '');
  const [loading, setLoading] = useState(Boolean(token));
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');

  const executeVerification = async (verifyToken) => {
    if (!verifyToken) return;
    setLoading(true);
    try {
      const res = await authApi.verifyEmail(verifyToken);
      setStatus('success');
      setMessage(res.message || 'Email has been verified successfully!');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || err.message || 'Email verification failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      executeVerification(token);
    }
  }, [token]);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Email Verification</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          Confirm your corporate email address
        </p>
      </div>

      {loading ? (
        <Loader message="Verifying authentication token..." />
      ) : status === 'success' ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <CheckCircle2 size={34} />
          </div>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#065f46', marginBottom: '0.5rem' }}>
            Verified Successfully
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.75rem' }}>
            {message}
          </p>
          <Link to="/signin">
            <Button variant="primary" style={{ width: '100%' }}>
              Proceed to Sign In
            </Button>
          </Link>
        </div>
      ) : status === 'error' ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={34} />
          </div>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.5rem' }}>
            Verification Problem
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.75rem' }}>
            {message}
          </p>
          <Link to="/signin">
            <Button variant="outline" icon={ArrowLeft} style={{ width: '100%' }}>
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeVerification(inputToken);
          }}
        >
          <Input
            label="Verification Code / Token"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            placeholder="Paste your verification token here..."
            icon={MailCheck}
            required
          />

          <Button
            type="submit"
            variant="primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            Verify Email
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

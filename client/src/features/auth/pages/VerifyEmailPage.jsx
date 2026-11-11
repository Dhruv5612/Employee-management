import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../services/authApi.js';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import Loader from '../../../components/common/Loader.jsx';
import { CheckCircle2, AlertCircle, ArrowLeft, MailCheck, Users } from 'lucide-react';

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
    <div className="auth-layout">
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="auth-card">
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: '#C6F432',
              color: '#0B0B0C',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.85rem',
              boxShadow: '0 8px 24px rgba(198,244,50,0.28)',
            }}>
              <Users size={24} strokeWidth={2.3} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>Email Verification</h3>
            <p style={{ fontSize: '0.85rem', color: '#A1A1AA', marginTop: '0.25rem' }}>
              Confirm your corporate email address
            </p>
          </div>

          {loading ? (
            <Loader message="Verifying authentication token..." />
          ) : status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '1.25rem 0' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(198, 244, 50, 0.14)',
                  border: '1px solid rgba(198, 244, 50, 0.35)',
                  color: '#C6F432',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <CheckCircle2 size={34} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#C6F432', marginBottom: '0.5rem' }}>
                Verified Successfully
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#E4E4E7', marginBottom: '1.75rem' }}>
                {message}
              </p>
              <Link to="/signin">
                <Button variant="primary" style={{ width: '100%' }}>
                  Proceed to Sign In
                </Button>
              </Link>
            </div>
          ) : status === 'error' ? (
            <div style={{ textAlign: 'center', padding: '1.25rem 0' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.14)',
                  border: '1px solid rgba(239, 68, 68, 0.30)',
                  color: '#FCA5A5',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={34} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FCA5A5', marginBottom: '0.5rem' }}>
                Verification Problem
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#A1A1AA', marginBottom: '1.75rem' }}>
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
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.75rem' }}
              >
                Verify Email
              </Button>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <Link
                  to="/signin"
                  style={{
                    fontSize: '0.85rem',
                    color: '#A1A1AA',
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
      </div>
    </div>
  );
}

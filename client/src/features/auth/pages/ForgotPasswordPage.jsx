import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi.js';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import { useToast } from '../../../hooks/useToast.js';
import {
  Mail,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  MailCheck,
  Check,
  Copy,
  Sparkles,
} from 'lucide-react';
import { isDemoMode, setDemoMode } from '../../../services/apiClient.js';

export default function ForgotPasswordPage() {
  // Flow steps: 'ASK_EMAIL' -> 'EMAIL_SENT'
  const [step, setStep] = useState('ASK_EMAIL');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [validationError, setValidationError] = useState('');

  // Result state after email dispatch
  const [submittedResult, setSubmittedResult] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [demoActive, setDemoActive] = useState(isDemoMode());

  const navigate = useNavigate();
  const { success, error: toastError, info } = useToast();

  // Resend countdown timer
  useEffect(() => {
    let timer;
    if (step === 'EMAIL_SENT' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const validateEmail = (val) => {
    const trimmed = (val || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed) {
      return 'Please enter your work email address';
    }
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleRequestReset = async (e) => {
    if (e) e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setValidationError(err);
      return;
    }

    setValidationError('');
    setErrorBanner('');
    setIsLoading(true);

    try {
      const res = await authApi.forgotPassword(email.trim());
      setSubmittedResult(res);
      setStep('EMAIL_SENT');
      setCountdown(60);

      if (res.delivered) {
        success(`Password reset email dispatched to ${email.trim()}! Please check your mailbox.`);
      } else {
        info(`Password reset instructions generated for ${email.trim()}.`);
      }
    } catch (err) {
      const backendMsg =
        err.response?.data?.message || err.message || 'Unable to request password reset. Please try again.';
      setErrorBanner(backendMsg);
      toastError(backendMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setErrorBanner('');

    try {
      const res = await authApi.forgotPassword(email.trim());
      setSubmittedResult(res);
      setCountdown(60);
      if (res.delivered) {
        success(`A fresh password reset email has been dispatched to ${email.trim()}!`);
      } else {
        info('New password reset link generated!');
      }
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.message || 'Failed to resend reset email.';
      toastError(backendMsg);
    } finally {
      setIsResending(false);
    }
  };

  const handleCopyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleMode = () => {
    const next = !demoActive;
    setDemoMode(next);
    setDemoActive(next);
    info(
      next
        ? 'Switched to Demo Storage Mode (Runs locally in your browser)'
        : 'Switched to Live API Mode (Connecting to backend server)'
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        padding: '3rem 1.5rem',
        backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(99, 102, 241, 0.22) 0%, transparent 65%)',
        overflowY: 'auto',
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px', margin: 'auto 0' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Link
            to="/signin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </Link>
        </div>

        {/* Main Card */}
        <div
          className="card"
          style={{
            width: '100%',
            padding: '2.5rem 2rem',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.55)',
            borderRadius: '1.25rem',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background:
                  step === 'EMAIL_SENT'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #4f46e5, #4338ca)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  step === 'EMAIL_SENT'
                    ? '0 10px 20px rgba(16, 185, 129, 0.35)'
                    : '0 10px 20px rgba(79, 70, 229, 0.35)',
                marginBottom: '1rem',
                transition: 'all 0.3s ease',
              }}
            >
              {step === 'EMAIL_SENT' ? <MailCheck size={30} /> : <KeyRound size={28} />}
            </div>

            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
              {step === 'EMAIL_SENT' ? 'Check Your Email' : 'Forgot Password?'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.5 }}>
              {step === 'EMAIL_SENT'
                ? 'We have sent password changing instructions directly to your email'
                : 'Enter your registered email address to receive a secure password reset link'}
            </p>
          </div>

          {/* Error Banner */}
          {errorBanner && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#991b1b',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
              }}
            >
              <ShieldAlert size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div style={{ fontWeight: 600 }}>{errorBanner}</div>
            </div>
          )}

          {/* ================= STEP 1: ASK EMAIL ID ================= */}
          {step === 'ASK_EMAIL' && (
            <form onSubmit={handleRequestReset} noValidate>
              <Input
                label="Registered Work Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="e.g. name@company.com"
                icon={Mail}
                error={validationError}
                autoFocus
                required
              />

              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  marginTop: '0.5rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.8rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                }}
              >
                <Sparkles size={16} color="#4f46e5" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  Enter the email associated with your workspace account. We will send you an exclusive password
                  reset link that expires in 60 minutes.
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                icon={KeyRound}
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
              >
                Send Password Reset Email
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
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#4f46e5')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                >
                  <ArrowLeft size={15} /> Remember your password? Sign In
                </Link>
              </div>
            </form>
          )}

          {/* ================= STEP 2: EMAIL SENT CONFIRMATION ================= */}
          {step === 'EMAIL_SENT' && (
            <div>
              {/* Highlight Box showing where mail was sent */}
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.825rem', color: '#166534', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Password reset link sent to:
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #86efac',
                    borderRadius: '8px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    wordBreak: 'break-all',
                  }}
                >
                  <Mail size={16} color="#16a34a" />
                  <span>{email.trim()}</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copied ? '#16a34a' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px',
                      marginLeft: '4px',
                    }}
                    title="Copy email to clipboard"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '0.75rem', lineHeight: 1.4 }}>
                  Please check your inbox (and spam/junk folder) and click the link in the email to set your new password.
                </p>
              </div>

              {/* Delivery notification badge */}
              <div
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  color: '#166534',
                  fontSize: '0.825rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Email sent!</strong> A password reset link has been dispatched to <strong>{email.trim()}</strong>. Please check your inbox or spam folder.
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.8rem',
                  color: '#475569',
                }}
              >
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Next Steps:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      1
                    </span>
                    <span>Open your mailbox for <strong>{email.trim()}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      2
                    </span>
                    <span>Find the email with subject <em>"Reset Your Password"</em></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      3
                    </span>
                    <span>Click the <strong>"Reset My Password"</strong> button in that email</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      4
                    </span>
                    <span>Link remains valid for 60 minutes for security</span>
                  </div>
                </div>
              </div>

              {/* Resend & Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={countdown > 0 || isResending}
                  isLoading={isResending}
                  icon={RefreshCw}
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  {countdown > 0 ? `Resend Reset Email in ${countdown}s` : 'Resend Reset Email'}
                </Button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('ASK_EMAIL');
                      setErrorBanner('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4f46e5',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    Try another email address
                  </button>

                  <Link
                    to="/signin"
                    style={{
                      fontSize: '0.825rem',
                      color: '#64748b',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <ArrowLeft size={14} /> Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/authApi.js';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import { useToast } from '../../../hooks/useToast.js';
import {
  Lock,
  Check,
  X,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  LogIn,
} from 'lucide-react';
import { isDemoMode, setDemoMode } from '../../../services/apiClient.js';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorBanner, setErrorBanner] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [demoActive, setDemoActive] = useState(isDemoMode());

  const { success, error: toastError, info } = useToast();

  // Password criteria indicators (8+ chars, alphabet, number, special char)
  const hasMinLength = password.length >= 8;
  const hasAlphabet = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const isCriteriaMet = hasMinLength && hasAlphabet && hasNumber && hasSpecial;
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  // Auto-redirect countdown on success
  useEffect(() => {
    let timer;
    if (isSuccess && redirectCountdown > 0) {
      timer = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isSuccess && redirectCountdown === 0) {
      navigate('/signin');
    }
    return () => clearInterval(timer);
  }, [isSuccess, redirectCountdown, navigate]);

  const validate = () => {
    const errs = {};

    if (!password) {
      errs.password = 'Please enter your new password';
    } else if (!hasMinLength) {
      errs.password = 'Password must be at least 8 characters';
    } else if (!hasAlphabet) {
      errs.password = 'Password must contain at least one alphabet letter';
    } else if (!hasNumber) {
      errs.password = 'Password must contain at least one number';
    } else if (!hasSpecial) {
      errs.password = 'Password must contain at least one special character';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your new password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleReset = async (e) => {
    if (e) e.preventDefault();
    if (!token) {
      setErrorBanner('Reset token is missing from the URL. Please request a new link.');
      return;
    }

    if (!validate()) return;

    setErrorBanner('');
    setIsLoading(true);

    try {
      const res = await authApi.resetPassword(token, password);
      setIsSuccess(true);
      success(res.message || 'Password updated successfully! You can now sign in.');
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to reset password. The link may have expired.';
      setErrorBanner(msg);
      toastError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    const next = !demoActive;
    setDemoMode(next);
    setDemoActive(next);
    info(
      next
        ? 'Switched to Demo Storage Mode (Runs locally in your browser)'
        : 'Switched to Live API Mode (Connecting to port 5001)'
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
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: isSuccess
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #4f46e5, #4338ca)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isSuccess
                  ? '0 10px 20px rgba(16, 185, 129, 0.35)'
                  : '0 10px 20px rgba(79, 70, 229, 0.35)',
                marginBottom: '1rem',
                transition: 'all 0.3s ease',
              }}
            >
              {isSuccess ? <CheckCircle2 size={30} /> : <ShieldCheck size={30} />}
            </div>

            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
              {isSuccess ? 'Password Reset Complete!' : 'Set New Password'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.5 }}>
              {isSuccess
                ? 'Your password has been securely updated. You can now log into your workspace.'
                : 'Create a new secure password for your workspace account'}
            </p>

            {/* Mode Switcher */}
            <div style={{ marginTop: '0.75rem' }}>
              <button
                type="button"
                onClick={toggleMode}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  border: `1px solid ${demoActive ? '#f59e0b' : '#10b981'}`,
                  backgroundColor: demoActive ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                  color: demoActive ? '#b45309' : '#047857',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                title="Click to toggle between Live API and Local Demo Storage Mode"
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: demoActive ? '#f59e0b' : '#10b981',
                  }}
                />
                {demoActive ? 'Demo Storage Mode' : 'Live API Mode'}
                <span style={{ fontSize: '0.65rem', opacity: 0.75 }}>(Click to switch)</span>
              </button>
            </div>
          </div>

          {/* Success State View */}
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  color: '#166534',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                  Ready to Sign In!
                </div>
                <div style={{ fontSize: '0.85rem', color: '#15803d' }}>
                  Redirecting to sign in page in <strong>{redirectCountdown}</strong> seconds...
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={() => navigate('/signin')}
                icon={LogIn}
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
              >
                Go to Sign In Now
              </Button>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleReset} noValidate>
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
                  <div>
                    <div style={{ fontWeight: 600 }}>{errorBanner}</div>
                    {errorBanner.toLowerCase().includes('expired') && (
                      <div style={{ marginTop: '0.35rem' }}>
                        <Link
                          to="/forgot-password"
                          style={{ color: '#b91c1c', fontWeight: 700, textDecoration: 'underline' }}
                        >
                          Click here to request a new reset link &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* New Password */}
              <Input
                label="New Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                placeholder="Min 8 characters, letter, number, symbol"
                icon={Lock}
                error={errors.password}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                required
              />

              {/* Password Criteria Feedback Checklist */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  marginTop: '-0.35rem',
                  marginBottom: '1rem',
                  fontSize: '0.75rem',
                }}
              >
                <div style={{ color: '#64748b', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Password Requirements:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: hasMinLength ? '#16a34a' : '#64748b',
                      fontWeight: hasMinLength ? 600 : 400,
                    }}
                  >
                    {hasMinLength ? <Check size={13} color="#16a34a" /> : <X size={13} color="#94a3b8" />}
                    <span>8+ characters</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: hasAlphabet ? '#16a34a' : '#64748b',
                      fontWeight: hasAlphabet ? 600 : 400,
                    }}
                  >
                    {hasAlphabet ? <Check size={13} color="#16a34a" /> : <X size={13} color="#94a3b8" />}
                    <span>Alphabet (letter)</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: hasNumber ? '#16a34a' : '#64748b',
                      fontWeight: hasNumber ? 600 : 400,
                    }}
                  >
                    {hasNumber ? <Check size={13} color="#16a34a" /> : <X size={13} color="#94a3b8" />}
                    <span>Number (0-9)</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: hasSpecial ? '#16a34a' : '#64748b',
                      fontWeight: hasSpecial ? 600 : 400,
                    }}
                  >
                    {hasSpecial ? <Check size={13} color="#16a34a" /> : <X size={13} color="#94a3b8" />}
                    <span>Special char (!@#$)</span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                }}
                placeholder="Re-enter your new password"
                icon={Lock}
                error={errors.confirmPassword}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                required
              />

              {/* Match indicator */}
              {confirmPassword.length > 0 && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    marginTop: '-0.35rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: passwordsMatch ? '#16a34a' : '#dc2626',
                    fontWeight: 600,
                  }}
                >
                  {passwordsMatch ? (
                    <>
                      <Check size={14} color="#16a34a" />
                      <span>Passwords match perfectly</span>
                    </>
                  ) : (
                    <>
                      <X size={14} color="#dc2626" />
                      <span>Passwords do not match yet</span>
                    </>
                  )}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={!isCriteriaMet || !passwordsMatch || isLoading}
                icon={Check}
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
              >
                Reset Password & Continue
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
                  <ArrowLeft size={15} /> Return to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

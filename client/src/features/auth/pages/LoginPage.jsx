import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi.js';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import { useToast } from '../../../hooks/useToast.js';
import {
  Mail,
  Lock,
  Sparkles,
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowLeft,
  LogIn,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { isDemoMode, setDemoMode } from '../../../services/apiClient.js';

export default function LoginPage() {
  // 2-Step Sign In Flow: 'CREDENTIALS' -> 'OTP_VERIFICATION'
  const [step, setStep] = useState('CREDENTIALS');

  // Credentials
  const [email, setEmail] = useState('dhruvkamariya1@gmail.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification
  const [otp, setOtp] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [isDelivered, setIsDelivered] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);

  // General State
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorBanner, setErrorBanner] = useState('');
  const [demoActive, setDemoActive] = useState(isDemoMode());

  const navigate = useNavigate();
  const { success, error: toastError, info } = useToast();

  // Password criteria indicators (8+ chars, alphabet, number, special char)
  const hasMinLength = password.length >= 8;
  const hasAlphabet = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (step === 'OTP_VERIFICATION' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const validateCredentials = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Please enter your work email';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Please enter your password';
    } else if (!hasMinLength) {
      errs.password = 'Password must be at least 8 characters';
    } else if (!hasAlphabet) {
      errs.password = 'Password must contain at least one alphabet letter';
    } else if (!hasNumber) {
      errs.password = 'Password must contain at least one number';
    } else if (!hasSpecial) {
      errs.password = 'Password must contain at least one special character (e.g. @, #, $, %)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 1: Submit Credentials -> Backend authenticates email & password, then dispatches OTP to Gmail
  const handleAuthenticate = async (e) => {
    if (e) e.preventDefault();
    if (!validateCredentials()) return;

    setErrorBanner('');
    setIsLoading(true);

    try {
      const res = await authApi.login(email.trim(), password);

      if (res && res.requiresOtp) {
        setOtpEmail(res.email || email.trim());
        setDevOtp(res.devOtp || '');
        setIsDelivered(!!res.delivered);
        setStep('OTP_VERIFICATION');
        setOtp('');
        setCountdown(60);

        if (res.delivered) {
          success(`Password verified! 6-digit approval code sent to ${res.email || email.trim()}`);
        } else {
          info('Password verified! OTP code generated.');
        }
      } else if (res && res.token) {
        // Direct fallback if OTP was disabled on backend
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        success(`Welcome back, ${res.user.name || 'User'}!`);
        navigate('/dashboard');
      }
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.';
      setErrorBanner(backendMsg);
      toastError(backendMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify Gmail OTP code -> Final authorization to Dashboard
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit verification code' });
      return;
    }

    setErrorBanner('');
    setIsLoading(true);

    try {
      const data = await authApi.verifyLoginOtp(otpEmail, otp.trim());
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      success(`Two-Factor Authentication verified! Welcome back, ${data.user.name || 'User'}!`);
      navigate('/dashboard');
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.message || 'Invalid or expired OTP code.';
      setErrorBanner(backendMsg);
      toastError(backendMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setErrorBanner('');
    try {
      const res = await authApi.resendOtp(otpEmail, 'login');
      if (res.devOtp) setDevOtp(res.devOtp);
      setIsDelivered(!!res.delivered);
      setCountdown(60);
      if (res.delivered) {
        success('A new approval code has been sent directly to your Gmail!');
      } else {
        info('New OTP code generated!');
      }
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.message || 'Failed to resend code.';
      toastError(backendMsg);
    } finally {
      setResending(false);
    }
  };

  const toggleMode = () => {
    const next = !demoActive;
    setDemoMode(next);
    setDemoActive(next);
    info(
      next
        ? 'Switched to Demo Storage Mode (Runs locally in your browser)'
        : 'Switched to Live API Mode (Connecting to port 5000)'
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
        padding: '2rem 1.5rem',
        backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(99, 102, 241, 0.22) 0%, transparent 65%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '470px' }}>
        {/* Back to Home Link */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Link
            to="/"
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
            <span>Back to Home</span>
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
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background:
                  step === 'OTP_VERIFICATION'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #4f46e5, #4338ca)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  step === 'OTP_VERIFICATION'
                    ? '0 8px 16px rgba(16, 185, 129, 0.35)'
                    : '0 8px 16px rgba(79, 70, 229, 0.35)',
                marginBottom: '0.85rem',
                transition: 'all 0.3s ease',
              }}
            >
              {step === 'OTP_VERIFICATION' ? <ShieldCheck size={28} /> : <Sparkles size={28} />}
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
              {step === 'OTP_VERIFICATION' ? 'Two-Factor Approval' : 'Sign In to Workspace'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
              {step === 'OTP_VERIFICATION'
                ? 'Confirm your identity using the Gmail OTP code'
                : 'Enter your credentials to receive an approval code'}
            </p>

            {/* Mode Switcher */}
            <div style={{ marginTop: '0.65rem' }}>
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
              </div>
            </div>
          )}

          {/* ================= STEP 1: CREDENTIALS (Email & Password) ================= */}
          {step === 'CREDENTIALS' && (
            <form onSubmit={handleAuthenticate} noValidate>
              <Input
                label="Work Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                placeholder="dhruvkamariya1@gmail.com"
                icon={Mail}
                error={errors.email}
                required
              />

              <div style={{ position: 'relative' }}>
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  placeholder="Min 8 chars, letter, number, symbol"
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

                <div style={{ textAlign: 'right', marginTop: '-0.35rem', marginBottom: '1.25rem' }}>
                  <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600 }}>
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                icon={LogIn}
                style={{ width: '100%', padding: '0.75rem' }}
              >
                Sign In to Workspace
              </Button>
            </form>
          )}

          {/* ================= STEP 2: GMAIL OTP VERIFICATION ================= */}
          {step === 'OTP_VERIFICATION' && (
            <form onSubmit={handleVerifyOtp} noValidate>
              <div
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  A 6-digit approval code was dispatched to your Gmail:
                </div>
                <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {otpEmail}
                </div>
              </div>

              {/* Delivery notification badge */}
              {isDelivered ? (
                <div
                  style={{
                    padding: '0.75rem 0.9rem',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    color: '#166534',
                    fontSize: '0.8rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Email sent!</strong> A 6-digit approval code was dispatched to <strong>{otpEmail}</strong>. Please check your inbox or spam folder.
                  </div>
                </div>
              ) : (
                devOtp && (
                  <div
                    style={{
                      padding: '0.75rem 0.9rem',
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '8px',
                      color: '#92400e',
                      fontSize: '0.8rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700 }}>Development OTP Code:</span>
                      <button
                        type="button"
                        onClick={() => setOtp(devOtp)}
                        style={{
                          background: '#d97706',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Auto Fill: {devOtp}
                      </button>
                    </div>
                  </div>
                )
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '0.4rem',
                    textAlign: 'center',
                  }}
                >
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  autoFocus
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setOtp(val);
                    if (errors.otp) setErrors({});
                  }}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    textAlign: 'center',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    letterSpacing: '12px',
                    fontFamily: 'monospace',
                    borderRadius: '10px',
                    border: errors.otp ? '2px solid #ef4444' : '2px solid #cbd5e1',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#fafafa',
                  }}
                />
                {errors.otp && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem', textAlign: 'center' }}>
                    {errors.otp}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                icon={KeyRound}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: '#10b981',
                  borderColor: '#10b981',
                }}
              >
                Verify & Access Dashboard
              </Button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1.25rem',
                  fontSize: '0.8rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setStep('CREDENTIALS');
                    setErrors({});
                    setErrorBanner('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </button>

                <button
                  type="button"
                  disabled={countdown > 0 || resending}
                  onClick={handleResendOtp}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: countdown > 0 ? '#94a3b8' : '#4f46e5',
                    cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                  {countdown > 0 ? `Resend code (${countdown}s)` : 'Resend code'}
                </button>
              </div>
            </form>
          )}

          {/* Sign Up Link */}
          {step === 'CREDENTIALS' && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ fontWeight: 700, color: '#4f46e5' }}>
                Create an account
              </Link>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} EmployeeHub Enterprise. All rights reserved.
        </div>
      </div>
    </div>
  );
}

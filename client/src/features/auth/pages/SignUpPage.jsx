import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi.js';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import Select from '../../../components/common/Select.jsx';
import { useToast } from '../../../hooks/useToast.js';
import {
  User,
  Mail,
  Lock,
  Phone,
  UserPlus,
  Eye,
  EyeOff,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  Check,
  X,
} from 'lucide-react';
import { isDemoMode, setDemoMode } from '../../../services/apiClient.js';

export default function SignUpPage() {
  const [step, setStep] = useState('FORM'); // 'FORM' | 'OTP'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'HR',
  });
  const [otp, setOtp] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorBanner, setErrorBanner] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [demoActive, setDemoActive] = useState(isDemoMode());

  const navigate = useNavigate();
  const { success, error: toastError, info } = useToast();

  // Password criteria indicators
  const pass = formData.password || '';
  const hasMinLength = pass.length >= 8;
  const hasAlphabet = /[a-zA-Z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pass);
  const isPasswordValid = hasMinLength && hasAlphabet && hasNumber && hasSpecial;

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (step === 'OTP' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid work email address';
    }

    if (!formData.password) {
      errs.password = 'Please enter a password';
    } else if (!hasMinLength) {
      errs.password = 'Password must be at least 8 characters';
    } else if (!hasAlphabet) {
      errs.password = 'Password must contain at least one alphabet letter';
    } else if (!hasNumber) {
      errs.password = 'Password must contain at least one number';
    } else if (!hasSpecial) {
      errs.password = 'Password must contain at least one special character (e.g. @, #, $, %)';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (errorBanner) setErrorBanner('');
  };

  const handleQuickFill = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setFormData({
      name: `Alex Rivera ${randomId}`,
      email: `alex.rivera${randomId}@company.com`,
      phone: '+1 (555) 234-5678',
      password: 'Password@123',
      confirmPassword: 'Password@123',
      role: 'Viewer',
    });
    setErrors({});
    setErrorBanner('');
    info('Sample registration fields populated with compliant password!');
  };

  // Step 1: Request Signup OTP
  const handleRequestSignUpOtp = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setErrorBanner('');
    setIsLoading(true);

    try {
      const sanitizedRole = ['HR', 'Viewer'].includes(formData.role) ? formData.role : 'Viewer';

      const res = await authApi.requestSignupOtp({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: sanitizedRole,
      });

      if (res && res.requiresOtp) {
        setOtpEmail(res.email || formData.email.trim().toLowerCase());
        setDevOtp(res.devOtp || '');
        setStep('OTP');
        setOtp('');
        setCountdown(60);
        success(`Verification code dispatched to ${res.email || formData.email}`);
      } else if (res && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        success('Account created successfully! Welcome to EmployeeHub.');
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setErrorBanner(msg);
      toastError(msg);

      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify Signup OTP
  const handleVerifySignupOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit verification code' });
      return;
    }

    setErrorBanner('');
    setIsLoading(true);

    try {
      const data = await authApi.verifySignupOtp(otpEmail, otp.trim());
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      success('Email verified & account created! Welcome to EmployeeHub.');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid or expired OTP code.';
      setErrorBanner(msg);
      toastError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend Signup OTP
  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setErrorBanner('');
    try {
      const res = await authApi.resendOtp(otpEmail, 'signup');
      if (res.devOtp) setDevOtp(res.devOtp);
      setCountdown(60);
      success('A new confirmation code has been dispatched to your Gmail!');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to resend code.';
      toastError(msg);
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

  const roleOptions = [
    { value: 'Viewer', label: 'Employee (Read-Only Directory)' },
    { value: 'HR', label: 'HR Manager (Employee & Dept Management)' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        padding: '2.5rem 1.5rem',
        backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(99, 102, 241, 0.22) 0%, transparent 65%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '500px' }}>
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

        {/* Card Container */}
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
                  step === 'OTP'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #4f46e5, #4338ca)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  step === 'OTP'
                    ? '0 8px 16px rgba(16, 185, 129, 0.35)'
                    : '0 8px 16px rgba(79, 70, 229, 0.35)',
                marginBottom: '0.85rem',
                transition: 'all 0.3s ease',
              }}
            >
              {step === 'OTP' ? <KeyRound size={26} /> : <Sparkles size={28} />}
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
              {step === 'OTP' ? 'Gmail Approval' : 'Create Work Account'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
              {step === 'OTP'
                ? 'Confirm your work email to finish registration'
                : 'Sign up for enterprise workspace access'}
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
                {errorBanner.toLowerCase().includes('already') ? (
                  <div style={{ fontSize: '0.775rem', marginTop: '0.25rem' }}>
                    This email is already registered.{' '}
                    <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700 }}>
                      Sign in with OTP here →
                    </Link>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.775rem', color: '#b91c1c', marginTop: '0.2rem' }}>
                    Please check the password requirements below.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Development / Offline OTP Hint if returned */}
          {devOtp && (
            <div
              style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                color: '#065f46',
                fontSize: '0.8rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>
                  Dev / Console OTP Code: <strong style={{ letterSpacing: '1px' }}>{devOtp}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOtp(devOtp)}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Auto Fill
              </button>
            </div>
          )}

          {step === 'FORM' ? (
            /* --- STEP 1: REGISTRATION DETAILS --- */
            <>
              {/* Quick Fill Button */}
              <div style={{ textAlign: 'right', marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6366f1',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                  title="Autofill valid registration fields for testing"
                >
                  <Sparkles size={14} />
                  <span>Quick Fill Demo Data</span>
                </button>
              </div>

              <form onSubmit={handleRequestSignUpOtp} noValidate>
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Rivera"
                  icon={User}
                  error={errors.name}
                  required
                />

                <Input
                  label="Work Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. alex@company.com"
                  icon={Mail}
                  error={errors.email}
                  required
                />

                <Input
                  label="Phone Number (Optional)"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  icon={Phone}
                />

                <Select
                  label="Requested Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={roleOptions}
                  placeholder="Select access role"
                />

                <div style={{ position: 'relative' }}>
                  <Input
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
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
                      Password must satisfy:
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
                </div>

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
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

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  icon={UserPlus}
                  id="btn-sign-up-submit"
                  style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
                >
                  Continue with Gmail OTP
                </Button>
              </form>
            </>
          ) : (
            /* --- STEP 2: GMAIL OTP VERIFICATION --- */
            <form onSubmit={handleVerifySignupOtp} noValidate>
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
                  A one-time approval code was sent to:
                </div>
                <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {otpEmail}
                </div>
              </div>

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
                icon={CheckCircle2}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: '#10b981',
                  borderColor: '#10b981',
                }}
              >
                Verify & Complete Registration
              </Button>

              {/* Resend & Back actions */}
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
                    setStep('FORM');
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
                  <ArrowLeft size={14} /> Back to Edit Details
                </button>

                <button
                  type="button"
                  disabled={countdown > 0 || resending}
                  onClick={handleResend}
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

          {step === 'FORM' && (
            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 700, color: '#4f46e5' }}>
                Sign In
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

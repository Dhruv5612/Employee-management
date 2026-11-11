import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Building2,
  ShieldCheck,
  Activity,
  FileSpreadsheet,
  Zap,
  ArrowRight,
  CheckCircle2,
  LogIn,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Check,
  Star,
  Shield,
  Layers,
} from 'lucide-react';

export default function HomePage() {
  const [activeMockupTab, setActiveMockupTab] = useState('directory');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Sample Mockup Data for Interactive Hero
  const sampleEmployees = [
    {
      id: 'EMP-101',
      name: 'Sarah Connor',
      role: 'Staff Software Engineer',
      dept: 'Engineering',
      status: 'Active',
      email: 's.connor@company.com',
      avatarBg: '#6366f1',
    },
    {
      id: 'EMP-102',
      name: 'Marcus Vance',
      role: 'Product Design Lead',
      dept: 'Product',
      status: 'Active',
      email: 'm.vance@company.com',
      avatarBg: '#8b5cf6',
    },
    {
      id: 'EMP-103',
      name: 'Elena Rostova',
      role: 'People Operations VP',
      dept: 'Human Resources',
      status: 'On Leave',
      email: 'e.rostova@company.com',
      avatarBg: '#ec4899',
    },
    {
      id: 'EMP-104',
      name: 'David Kim',
      role: 'Infrastructure Architect',
      dept: 'Engineering',
      status: 'Active',
      email: 'd.kim@company.com',
      avatarBg: '#06b6d4',
    },
  ];

  const sampleDepartments = [
    { name: 'Engineering & Technology', head: 'David Kim', budget: '$1,450,000', members: 48, color: '#6366f1' },
    { name: 'Product Experience & UI/UX', head: 'Marcus Vance', budget: '$720,000', members: 22, color: '#8b5cf6' },
    { name: 'Human Resources & Talent', head: 'Elena Rostova', budget: '$480,000', members: 12, color: '#ec4899' },
    { name: 'Corporate Operations', head: 'Sarah Connor', budget: '$350,000', members: 9, color: '#10b981' },
  ];

  const sampleAuditLogs = [
    { action: 'ROLE_ELEVATION', details: 'Promoted Marcus Vance to Admin role', time: '2 mins ago', user: 'admin@company.com' },
    { action: 'EMPLOYEE_CREATED', details: 'Added new profile for Sarah Connor (#EMP-101)', time: '14 mins ago', user: 'hr@company.com' },
    { action: 'DEPARTMENT_UPDATED', details: 'Increased Engineering headcount budget by 12%', time: '1 hour ago', user: 'admin@company.com' },
    { action: 'SECURITY_LOGIN', details: 'Successful 2FA session from US-East gateway', time: '2 hours ago', user: 'viewer@company.com' },
  ];

  const faqs = [
    {
      q: 'How does EmployeeHub simplify team and workforce management?',
      a: 'EmployeeHub provides a unified system where HR managers and administrators can track complete employee lifecycles, configure department hierarchies with budgets, enforce role-based security (Admin, HR, Viewer), and review immutable audit histories—all within a fast, responsive interface.',
    },
    {
      q: 'Can I test the platform without setting up a backend database?',
      a: 'Yes! EmployeeHub includes an interactive offline Demo Mode that simulates full CRUD operations, role switching, and analytics directly in your browser. You can switch to the live MongoDB + Express API with a single click.',
    },
    {
      q: 'What roles and permissions are supported?',
      a: 'The system natively supports three distinct security tiers: Admin (full system configuration, user role management, and audit inspection), HR Manager (employee and department creation/editing, report exports), and Viewer (read-only directory browsing).',
    },
    {
      q: 'Can I export employee rosters and payroll reports?',
      a: 'Yes, the Reports feature allows administrators and HR managers to instantly export filtered employee data, department salary distributions, and organizational metrics into formatted CSV files.',
    },
  ];

  return (
    <div className="landing-page">
      {/* 1. HERO SECTION */}
      <section className="landing-hero">
        <div className="landing-container">
          <div className="landing-badge" id="hero-badge">
            <Sparkles size={16} color="#818cf8" />
            <span>Next-Gen Workforce Management Suite • v2.4</span>
          </div>

          <h1 className="landing-hero-title">
            Modern Employee Management, Built for <span>High-Performance</span> Teams
          </h1>

          <p className="landing-hero-subtitle">
            Centralize your employee directory, organize department hierarchies, enforce granular role security, and
            track real-time activity audits in one elegant, enterprise-ready platform.
          </p>

          <div className="landing-hero-actions">
            <Link to="/signup" className="btn btn-primary" id="hero-cta-signup" style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}>
              <UserPlus size={18} />
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/signin"
              className="btn btn-secondary"
              id="hero-cta-signin"
              style={{
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              }}
            >
              <LogIn size={18} color="#818cf8" />
              <span>Live Demo / Sign In</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="landing-trust-bar">
            <div className="landing-trust-item">
              <CheckCircle2 size={16} color="#10b981" />
              <span>Instant 2-Minute Deployment</span>
            </div>
            <div className="landing-trust-item">
              <Shield size={16} color="#6366f1" />
              <span>SOC-2 Type II Certified</span>
            </div>
            <div className="landing-trust-item">
              <Zap size={16} color="#f59e0b" />
              <span>Demo Storage & Live API Ready</span>
            </div>
          </div>

          {/* INTERACTIVE DASHBOARD SHOWCASE */}
          <div className="mockup-wrapper" id="live-dashboard-preview">
            <div className="mockup-header-bar">
              <div className="mockup-dots">
                <span className="mockup-dot" style={{ backgroundColor: '#ef4444' }} />
                <span className="mockup-dot" style={{ backgroundColor: '#f59e0b' }} />
                <span className="mockup-dot" style={{ backgroundColor: '#10b981' }} />
              </div>

              {/* Tabs for switching mockup view */}
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.25rem', borderRadius: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveMockupTab('directory')}
                  style={{
                    border: 'none',
                    background: activeMockupTab === 'directory' ? '#4f46e5' : 'transparent',
                    color: activeMockupTab === 'directory' ? '#ffffff' : '#94a3b8',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '7px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Staff Directory
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMockupTab('departments')}
                  style={{
                    border: 'none',
                    background: activeMockupTab === 'departments' ? '#4f46e5' : 'transparent',
                    color: activeMockupTab === 'departments' ? '#ffffff' : '#94a3b8',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '7px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Departments
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMockupTab('audits')}
                  style={{
                    border: 'none',
                    background: activeMockupTab === 'audits' ? '#4f46e5' : 'transparent',
                    color: activeMockupTab === 'audits' ? '#ffffff' : '#94a3b8',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '7px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Audit Activity
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                Online (1,248 Active)
              </div>
            </div>

            <div className="mockup-content">
              {/* Tab 1: Directory Preview */}
              {activeMockupTab === 'directory' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          borderRadius: '8px',
                          padding: '0.4rem 0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.825rem',
                          color: '#cbd5e1',
                        }}
                      >
                        <Search size={14} color="#94a3b8" />
                        <span>Filter by name, department, role...</span>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          borderRadius: '8px',
                          padding: '0.4rem 0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.825rem',
                          color: '#cbd5e1',
                        }}
                      >
                        <Filter size={14} color="#94a3b8" />
                        <span>All Departments</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Showing 4 of 1,248 employees</span>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                          <th style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>Employee</th>
                          <th style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>Role</th>
                          <th style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>Department</th>
                          <th style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>Status</th>
                          <th style={{ padding: '0.65rem 0.85rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleEmployees.map((emp) => (
                          <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <td style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  backgroundColor: emp.avatarBg,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  color: '#fff',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {emp.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: '#f8fafc' }}>{emp.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.email}</div>
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem', color: '#cbd5e1' }}>{emp.role}</td>
                            <td style={{ padding: '0.85rem' }}>
                              <span
                                style={{
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                  color: '#a5b4fc',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}
                              >
                                {emp.dept}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem' }}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '9999px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  backgroundColor: emp.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                  color: emp.status === 'Active' ? '#34d399' : '#fbbf24',
                                }}
                              >
                                <span
                                  style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: emp.status === 'Active' ? '#10b981' : '#f59e0b',
                                  }}
                                />
                                {emp.status}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                              <Link
                                to="/signin"
                                style={{
                                  fontSize: '0.75rem',
                                  color: '#818cf8',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                }}
                              >
                                View Details →
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Departments Preview */}
              {activeMockupTab === 'departments' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  {sampleDepartments.map((dept, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>{dept.name}</div>
                        <Building2 size={16} color={dept.color} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                        Lead: <strong style={{ color: '#cbd5e1' }}>{dept.head}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <span style={{ color: '#64748b' }}>Headcount: {dept.members} staff</span>
                        <span style={{ color: '#34d399', fontWeight: 600 }}>{dept.budget}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Audit Activity Preview */}
              {activeMockupTab === 'audits' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {sampleAuditLogs.map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(99, 102, 241, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Activity size={14} color="#818cf8" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{log.details}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Triggered by: {log.user}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{log.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="landing-stats-strip">
        <div className="landing-container">
          <div className="landing-stats-grid">
            <div>
              <div className="landing-stat-number">15,000+</div>
              <div className="landing-stat-label">Active Profiles Managed</div>
            </div>
            <div>
              <div className="landing-stat-number">99.98%</div>
              <div className="landing-stat-label">System Uptime Guarantee</div>
            </div>
            <div>
              <div className="landing-stat-number">45%</div>
              <div className="landing-stat-label">Less Administrative Friction</div>
            </div>
            <div>
              <div className="landing-stat-number">150+</div>
              <div className="landing-stat-label">Enterprise Tech Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section className="landing-section" id="features">
        <div className="landing-container">
          <div className="landing-section-header">
            <div className="landing-section-badge">Platform Capabilities</div>
            <h2 className="landing-section-title">Everything You Need to Run Modern People Operations</h2>
            <p className="landing-section-desc">
              From employee lifecycle tracking to tamper-evident audit history, EmployeeHub brings enterprise-grade
              rigor to your everyday workflow.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                <Users size={24} />
              </div>
              <h3 className="feature-card-title">Employee Directory</h3>
              <p className="feature-card-desc">
                Rich employee profiles, instant search, department filters, and contact cards with compensation and
                status histories.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                <Building2 size={24} />
              </div>
              <h3 className="feature-card-title">Department Architecture</h3>
              <p className="feature-card-desc">
                Organize company departments, assign department heads, monitor headcount allocations, and track budgets
                effortlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 className="feature-card-title">Role-Based Security</h3>
              <p className="feature-card-desc">
                Granular multi-tier permissions for Admins, HR Managers, and Viewers to ensure sensitive employee data is
                always protected.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                <Activity size={24} />
              </div>
              <h3 className="feature-card-title">Immutable Audit Trail</h3>
              <p className="feature-card-desc">
                Every mutation, creation, deletion, and role elevation is timestamped with actor details for SOC-2 and
                GDPR compliance.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                <FileSpreadsheet size={24} />
              </div>
              <h3 className="feature-card-title">Reports & CSV Exports</h3>
              <p className="feature-card-desc">
                Generate real-time analytics summaries, salary distributions, and downloadable CSV rosters for payroll
                and executives.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
                <Zap size={24} />
              </div>
              <h3 className="feature-card-title">Offline & Hybrid Mode</h3>
              <p className="feature-card-desc">
                Toggle between local browser storage demo mode and high-availability Express + MongoDB production API
                seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="landing-section" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
        <div className="landing-container">
          <div className="landing-section-header">
            <div className="landing-section-badge">Fast & Intuitive</div>
            <h2 className="landing-section-title">Get Started in Three Simple Steps</h2>
            <p className="landing-section-desc">
              Zero complicated configurations. Deploy your team's workforce portal in minutes.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-title">Create Work Account</h3>
              <p className="step-desc">
                Sign up with your work email or log in using your HR or Employee credentials.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-title">Organize Structure</h3>
              <p className="step-desc">
                Setup your company departments, assign team leads, set department budgets, and import existing staff rosters.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-title">Scale & Audit</h3>
              <p className="step-desc">
                Manage daily requests, inspect real-time audit logs, export compliance spreadsheets, and monitor team growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <div className="landing-section-badge">Customer Success</div>
            <h2 className="landing-section-title">Loved by People Ops & Engineering Leads</h2>
            <p className="landing-section-desc">
              See what forward-thinking organizations are saying about EmployeeHub.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" />
                  ))}
                </div>
                <p className="testimonial-quote">
                  "EmployeeHub replaced three disjointed spreadsheets and a clunky legacy HR portal. Our onboarding time
                  plummeted by 45% in the first quarter alone."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">JD</div>
                <div>
                  <div className="testimonial-name">Jessica Davis</div>
                  <div className="testimonial-role">Chief People Officer, Apex Cloud</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" />
                  ))}
                </div>
                <p className="testimonial-quote">
                  "The real-time audit log and granular RBAC tiers gave our security team complete confidence. It passed
                  our strict compliance review on day one."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                  RK
                </div>
                <div>
                  <div className="testimonial-name">Rohan Kapoor</div>
                  <div className="testimonial-role">VP of Engineering, ScaleDynamics</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" />
                  ))}
                </div>
                <p className="testimonial-quote">
                  "The UI is lightning fast. Everything from editing employee profiles to generating department reports
                  happens in milliseconds. Our managers actually enjoy using it."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
                  ML
                </div>
                <div>
                  <div className="testimonial-name">Maya Lindstrom</div>
                  <div className="testimonial-role">Director of Talent, NovaVentures</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="landing-section" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
        <div className="landing-container">
          <div className="landing-section-header">
            <div className="landing-section-badge">Got Questions?</div>
            <h2 className="landing-section-title">Frequently Asked Questions</h2>
            <p className="landing-section-desc">
              Have questions about security, deployment, or enterprise capabilities? Find your answers below.
            </p>
          </div>

          <div className="faq-container">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="faq-item">
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={20} color="#818cf8" /> : <ChevronDown size={20} color="#94a3b8" />}
                  </button>
                  {isOpen && <div className="faq-answer">{faq.a}</div>}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem', color: '#94a3b8', fontSize: '0.925rem' }}>
            Still have questions?{' '}
            <Link to="/contact" style={{ color: '#818cf8', fontWeight: 700, textDecoration: 'underline' }}>
              Contact our enterprise team
            </Link>
          </div>
        </div>
      </section>

      {/* 7. HIGH-IMPACT BOTTOM CTA BANNER */}
      <section className="landing-section" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
        <div className="landing-container">
          <div className="cta-banner-card">
            <h2 className="cta-banner-title">Ready to Elevate Your Workplace Management?</h2>
            <p className="cta-banner-subtitle">
              Join hundreds of forward-thinking teams streamlining employee operations today. Sign up free or explore the
              interactive workspace.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/signup"
                className="btn btn-secondary"
                id="bottom-cta-signup"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#4338ca',
                  fontWeight: 700,
                  padding: '0.85rem 1.85rem',
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                }}
              >
                <UserPlus size={18} />
                <span>Create Free Account</span>
              </Link>

              <Link
                to="/signin"
                className="btn btn-outline"
                id="bottom-cta-signin"
                style={{
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.35)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '0.85rem 1.75rem',
                  fontSize: '1rem',
                }}
              >
                <LogIn size={18} />
                <span>Sign In to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

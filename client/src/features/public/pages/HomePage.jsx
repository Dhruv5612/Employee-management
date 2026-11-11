import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  CalendarClock,
  Wallet,
  Building2,
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Lock,
  Layers,
  Zap,
  Quote,
} from 'lucide-react';

const PREVIEW_TABS = [
  { id: 'directory', label: 'Employee Directory', icon: Users },
  { id: 'departments', label: 'Departments Matrix', icon: Building2 },
  { id: 'audits', label: 'Security & Audits', icon: ShieldCheck },
];

const SAMPLE_DIRECTORY = [
  { name: 'Elena Rostova', role: 'Principal Architect', dept: 'Engineering', status: 'Active', avatar: 'ER' },
  { name: 'Marcus Vance', role: 'People Operations Lead', dept: 'Human Resources', status: 'Active', avatar: 'MV' },
  { name: 'Sarah Jenkins', role: 'Product Designer', dept: 'Design Studio', status: 'On Leave', avatar: 'SJ' },
  { name: 'Devon Brooks', role: 'Security Engineer', dept: 'Platform Sec', status: 'Active', avatar: 'DB' },
];

const SAMPLE_DEPARTMENTS = [
  { name: 'Engineering & AI', head: 'Elena Rostova', members: 42, budget: '$4.8M', health: '98%' },
  { name: 'Product & Design', head: 'Sarah Jenkins', members: 18, budget: '$1.9M', health: '95%' },
  { name: 'Human Resources', head: 'Marcus Vance', members: 9, budget: '$860K', health: '100%' },
  { name: 'Platform Security', head: 'Devon Brooks', members: 14, budget: '$2.1M', health: '97%' },
];

const SAMPLE_AUDITS = [
  { event: 'OTP Verified Sign-In', actor: 'Admin • dhruv@company.com', scope: 'Auth Gateway', time: '2m ago' },
  { event: 'Leave Request Approved', actor: 'HR Lead • Marcus Vance', scope: 'Leave Engine', time: '14m ago' },
  { event: 'Payroll Cycle Locked', actor: 'Finance • System Bot', scope: 'Payroll Ledger', time: '1h ago' },
  { event: 'Role Policy Updated', actor: 'Admin • Superuser', scope: 'RBAC Matrix', time: '3h ago' },
];

const FEATURES = [
  {
    icon: Users,
    title: 'Unified Workforce Directory',
    desc: 'Searchable employee profiles, role assignments, contract metadata, and instant onboarding states in one command view.',
    accent: true,
  },
  {
    icon: CalendarClock,
    title: 'Instant Leave Governance',
    desc: 'Structured sick, casual, and earned time-off queues with supervisor remarks, balance tracking, and audit trails.',
    accent: false,
  },
  {
    icon: ShieldCheck,
    title: '2FA Email OTP Security',
    desc: 'Every workspace login and password recovery enforces expiring one-time verification codes and RBAC enforcement.',
    accent: true,
  },
  {
    icon: Wallet,
    title: 'Precision Payroll & Attendance',
    desc: 'Daily check-in timelines, shift reconciliation, bonus disbursements, and instant payslip transparency.',
    accent: false,
  },
  {
    icon: Building2,
    title: 'Department Hierarchy',
    desc: 'Track headcount allocations, team budgets, department leads, and safe member reassignment without orphans.',
    accent: true,
  },
  {
    icon: Activity,
    title: 'Immutable Activity Telemetry',
    desc: 'Real-time operational logs capturing status transitions, policy updates, and role changes across every panel.',
    accent: false,
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Provision Your Workspace',
    desc: 'Spin up Admin, HR, and Employee role tiers in seconds with verified email OTP authentication.',
  },
  {
    num: '02',
    title: 'Synchronize Teams & Rosters',
    desc: 'Organize departments, onboard staff members, and calibrate daily shift schedules from one hub.',
  },
  {
    num: '03',
    title: 'Automate Daily Decisions',
    desc: 'Approve leaves, monitor attendance pulse metrics, and audit enterprise health in real time.',
  },
];

const TESTIMONIALS = [
  {
    quote: 'EmployeeHub replaced three fragmented HR spreadsheets overnight. Leave approvals and payroll checks now take under two minutes.',
    author: 'Nadia Patel',
    role: 'VP of Operations, Horizon Labs',
  },
  {
    quote: 'The Admin and HR views give crystal-clear separation while still letting employees inspect their own attendance and announcements.',
    author: 'Lucas Meyer',
    role: 'Head of People, LinearOps',
  },
  {
    quote: 'Security auditing plus instant 2FA OTP logins gave our compliance team complete confidence on day one.',
    author: 'Priya Nair',
    role: 'CISO, Veridian Cloud',
  },
];

const FAQS = [
  {
    q: 'How do Admin, HR, and Employee panels differ?',
    a: 'Administrators oversee user provisioning, full activity logs, and global configuration; HR manages recruitment, departments, leaves, attendance, and payroll; Employees view their personalized workspace, apply for leave, track attendance, and read broadcasts.',
  },
  {
    q: 'Does EmployeeHub enforce Two-Factor Authentication?',
    a: 'Yes. Sign-up verification, sign-in verification, and password resets use single-use 6-digit OTPs with built-in cooldown guards and cryptographic hashing.',
  },
  {
    q: 'Can departments be restructured without losing employee records?',
    a: 'Yes. Our department reassignment modal transfers team members safely between units while keeping activity history intact.',
  },
  {
    q: 'Is my data persistent across deployments?',
    a: 'Yes. Live workspaces connect directly to MongoDB Atlas persistence with strict role-based API authorization.',
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('directory');
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="landing-page">
      {/* ===================================================================
          HERO SECTION WITH VERTICAL LIME AURORA BEAMS
      =================================================================== */}
      <section className="landing-hero">
        <div className="hero-glow" />

        <div className="website-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div className="hero-eyebrow">
            <Sparkles size={13} />
            <span>WORKFORCE COMMAND OS • ENTERPRISE V2.4</span>
          </div>

          <div className="hero-headline-row">
            {/* Left Floating Metrics */}
            <div className="hero-side-metrics">
              <div>
                <div className="hero-metric-val">3x</div>
                <div className="hero-metric-lbl">Faster Approvals</div>
              </div>
              <div>
                <div className="hero-metric-val">99.9%</div>
                <div className="hero-metric-lbl">Payroll Accuracy</div>
              </div>
            </div>

            {/* Editorial Serif Headline */}
            <div>
              <h1 className="hero-title">
                Lead <em>smarter</em> than
                <br />
                your standup.
              </h1>
              <p className="hero-subtitle">
                Orchestrate every employee, shift roster, department, and leave approval
                in one Midnight Black command center built for speed.
              </p>

              <div className="hero-actions">
                <Link to="/signup" className="hero-cta-lime">
                  Try it free
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
                <Link to="/login" className="hero-cta-glass">
                  Sign in to workspace
                </Link>
              </div>
            </div>

            {/* Right Floating Metrics */}
            <div className="hero-side-metrics right">
              <div>
                <div className="hero-metric-val">50K+</div>
                <div className="hero-metric-lbl">Active Profiles</div>
              </div>
              <div>
                <div className="hero-metric-val">2.4M</div>
                <div className="hero-metric-lbl">Shifts Synced</div>
              </div>
            </div>
          </div>

          {/* 3 Tilted Perspective Obsidian Cards Over Vertical Lime Beams */}
          <div className="hero-aura-stage">
            <div className="hero-aura-beams" />
            <div className="hero-aura-stripes" />

            <div className="hero-trio-grid">
              {/* Left Tilted Card: Live Queue / Staff Activity */}
              <div className="hero-tilt-card left">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 700, color: '#E4E4E7' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C6F432' }} />
                    Live Approvals
                  </span>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#71717A' }}>QUEUE</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {[
                    { code: 'ER', label: 'staff: leave_approved #204', badge: 'Approved', tone: 'lime' },
                    { code: 'MV', label: 'roster: shift_check_in #88', badge: 'Active', tone: 'outline' },
                    { code: 'SJ', label: 'dept: design_sync #19', badge: 'In Review', tone: 'muted' },
                    { code: 'DB', label: 'sec: otp_policy_sync #12', badge: 'Synced', tone: 'muted' },
                  ].map((item) => (
                    <div
                      key={item.code}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.6rem',
                        padding: '0.58rem 0.72rem',
                        borderRadius: '11px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
                        <span style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '6px',
                          background: 'rgba(255,255,255,0.08)',
                          color: '#FFFFFF',
                          fontSize: '0.64rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {item.code}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#D4D4D8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </span>
                      </div>

                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.18rem 0.55rem',
                        borderRadius: '9999px',
                        flexShrink: 0,
                        ...(item.tone === 'lime'
                          ? { background: '#C6F432', color: '#0B0B0C' }
                          : item.tone === 'outline'
                            ? { background: 'rgba(198,244,50,0.12)', color: '#C6F432', border: '1px solid rgba(198,244,50,0.35)' }
                            : { background: 'rgba(255,255,255,0.08)', color: '#A1A1AA' }),
                      }}>
                        {item.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Focal Card: Workforce Score */}
              <div className="hero-tilt-card center">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C6F432', boxShadow: '0 0 8px #C6F432' }} />
                    Workforce score
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#C6F432',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(198, 244, 50, 0.42)',
                    background: 'rgba(198, 244, 50, 0.10)',
                  }}>
                    Auto-sync on
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '3.6rem',
                    lineHeight: 0.95,
                    color: '#FFFFFF',
                  }}>
                    94
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#A1A1AA', fontWeight: 500 }}>
                    / 100 org health
                  </span>
                </div>

                {/* Lime Green Rising Sparkline SVG */}
                <div style={{ marginTop: '0.65rem' }}>
                  <svg viewBox="0 0 280 96" style={{ width: '100%', height: '92px', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="limeSparkFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C6F432" stopOpacity="0.38" />
                        <stop offset="100%" stopColor="#C6F432" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="24" x2="280" y2="24" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                    <line x1="0" y1="54" x2="280" y2="54" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                    <polygon
                      fill="url(#limeSparkFill)"
                      points="0,80 42,68 84,72 126,48 168,52 210,28 245,32 280,10 280,96 0,96"
                    />
                    <polyline
                      fill="none"
                      stroke="#C6F432"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="0,80 42,68 84,72 126,48 168,52 210,28 245,32 280,10"
                    />
                    <circle cx="280" cy="10" r="4.5" fill="#C6F432" />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#71717A', fontFamily: 'var(--font-mono)' }}>
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                    <span style={{ color: '#C6F432' }}>Live</span>
                  </div>
                </div>
              </div>

              {/* Right Tilted Card: Shift & Leave Timeline */}
              <div className="hero-tilt-card right">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 700, color: '#E4E4E7' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C6F432' }} />
                    Roster timeline
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#A1A1AA', fontFamily: 'var(--font-mono)' }}>TODAY</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: '#71717A', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
                  <span>09:00</span>
                  <span>11:00</span>
                  <span>13:00</span>
                  <span>15:00</span>
                  <span>17:00</span>
                </div>

                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.68rem', paddingLeft: '0.15rem' }}>
                  {/* Vertical Active Playhead */}
                  <div style={{
                    position: 'absolute',
                    left: '52%',
                    top: '-6px',
                    bottom: '-6px',
                    width: '1.5px',
                    background: 'rgba(198, 244, 50, 0.55)',
                    zIndex: 1,
                  }}>
                    <span style={{
                      position: 'absolute',
                      top: '-3px',
                      left: '-3px',
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#C6F432',
                      boxShadow: '0 0 8px #C6F432',
                    }} />
                  </div>

                  {[
                    { left: '8%', w: '30%', lime: false },
                    { left: '44%', w: '36%', lime: true },
                    { left: '16%', w: '44%', lime: true },
                    { left: '54%', w: '38%', lime: false },
                    { left: '24%', w: '32%', lime: true },
                  ].map((bar, idx) => (
                    <div key={idx} style={{ height: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '5px', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: bar.left,
                        width: bar.w,
                        top: 0,
                        bottom: 0,
                        borderRadius: '5px',
                        background: bar.lime ? '#C6F432' : '#27272A',
                        boxShadow: bar.lime ? '0 0 14px rgba(198, 244, 50, 0.25)' : 'none',
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          INTERACTIVE WORKSPACE PREVIEW WINDOW
      =================================================================== */}
      <section style={{ padding: '3.5rem 0 5.5rem' }}>
        <div className="website-container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-tag">Interactive Telemetry</span>
            <h2 className="section-heading">
              Inspect every department in <em>real time</em>.
            </h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
            <div className="genz-tab-pill" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              {PREVIEW_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={activeTab === tab.id ? 'active' : ''}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mockup-wrapper">
            <div className="mockup-window">
              {/* Top Bar */}
              <div style={{
                padding: '0.85rem 1.25rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#141614',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#27272A' }} />
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#27272A' }} />
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#C6F432' }} />
                  <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#71717A' }}>
                    employeehub.app / command-center / {activeTab}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#C6F432',
                  background: 'rgba(198,244,50,0.12)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(198,244,50,0.28)',
                }}>
                  LIVE SYNC
                </span>
              </div>

              {/* Preview Body */}
              <div style={{ padding: '1.75rem' }}>
                {activeTab === 'directory' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
                    {SAMPLE_DIRECTORY.map((emp) => (
                      <div
                        key={emp.name}
                        style={{
                          padding: '1.15rem',
                          borderRadius: '14px',
                          background: '#161816',
                          border: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.8rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: '#C6F432',
                            color: '#0B0B0C',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {emp.avatar}
                          </div>
                          <span className={`status-badge ${emp.status === 'Active' ? 'active' : 'on-leave'}`}>
                            {emp.status}
                          </span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>{emp.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#A1A1AA' }}>{emp.role}</div>
                        </div>
                        <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#71717A', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.6rem' }}>
                          DEPT // {emp.dept.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'departments' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    {SAMPLE_DEPARTMENTS.map((dept) => (
                      <div
                        key={dept.name}
                        style={{
                          padding: '1.15rem',
                          borderRadius: '14px',
                          background: '#161816',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{dept.name}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C6F432' }}>{dept.health}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#A1A1AA', marginBottom: '0.75rem' }}>
                          Lead: {dept.head}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#E4E4E7' }}>
                          <span>{dept.members} Staff</span>
                          <span style={{ color: '#C6F432' }}>{dept.budget}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'audits' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    {SAMPLE_AUDITS.map((log) => (
                      <div
                        key={log.event}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                          padding: '0.9rem 1.15rem',
                          borderRadius: '12px',
                          background: '#161816',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <CheckCircle2 size={16} style={{ color: '#C6F432' }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem' }}>{log.event}</div>
                            <div style={{ fontSize: '0.78rem', color: '#A1A1AA' }}>{log.actor}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#C6F432', background: 'rgba(198,244,50,0.1)', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                            {log.scope}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#71717A', fontFamily: 'var(--font-mono)' }}>{log.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          FEATURES SECTION
      =================================================================== */}
      <section id="features" style={{ padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="website-container">
          <div style={{ maxWidth: '640px', marginBottom: '3.25rem' }}>
            <span className="section-tag">Core Capabilities</span>
            <h2 className="section-heading">
              Built for high-velocity <em>people operations</em>.
            </h2>
            <p className="section-subheading" style={{ marginTop: '0.85rem' }}>
              Every module shares a unified Midnight Black design system engineered for clarity across Admin, HR, and Employee teams.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.35rem' }}>
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="feature-card">
                  <div
                    className="feature-icon-box"
                    style={{
                      background: feat.accent ? '#C6F432' : 'rgba(255, 255, 255, 0.08)',
                      color: feat.accent ? '#0B0B0C' : '#FFFFFF',
                      border: feat.accent ? 'none' : '1px solid rgba(255,255,255,0.14)',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.55rem' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#A1A1AA', lineHeight: 1.65 }}>
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          3-STEP WORKFLOW
      =================================================================== */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="website-container">
          <div style={{ textAlign: 'center', marginBottom: '3.25rem' }}>
            <span className="section-tag">Workflow Architecture</span>
            <h2 className="section-heading">
              Up and running in <em>three crisp steps</em>.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.35rem' }}>
            {STEPS.map((step) => (
              <div key={step.num} className="step-card">
                <div className="step-number">{step.num}</div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.55rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#A1A1AA', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          TESTIMONIALS
      =================================================================== */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="website-container">
          <div style={{ textAlign: 'center', marginBottom: '3.25rem' }}>
            <span className="section-tag">Customer Proof</span>
            <h2 className="section-heading">
              Trusted by modern <em>HR &amp; Engineering</em> leaders.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.35rem' }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="testimonial-card">
                <div>
                  <Quote size={24} style={{ color: '#C6F432', marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.95rem', color: '#E4E4E7', lineHeight: 1.7 }}>
                    “{t.quote}”
                  </p>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>{t.author}</div>
                  <div style={{ fontSize: '0.78rem', color: '#A1A1AA' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          FAQ ACCORDION
      =================================================================== */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="website-container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
            <span className="section-tag">Common Questions</span>
            <h2 className="section-heading">
              Everything you need to <em>know</em>.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className="faq-item">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      textAlign: 'left',
                      fontSize: '0.98rem',
                      fontWeight: 700,
                    }}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        color: '#C6F432',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.35rem', color: '#A1A1AA', fontSize: '0.9rem', lineHeight: 1.68 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          FINAL CTA BANNER
      =================================================================== */}
      <section style={{ padding: '3rem 0 6rem' }}>
        <div className="website-container">
          <div className="cta-banner-card">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              background: 'rgba(198,244,50,0.14)',
              border: '1px solid rgba(198,244,50,0.35)',
              color: '#C6F432',
              fontSize: '0.76rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
            }}>
              <Zap size={13} />
              DEPLOY IN UNDER 60 SECONDS
            </div>

            <h2 className="section-heading" style={{ marginBottom: '1rem' }}>
              Upgrade your workforce command <em>today</em>.
            </h2>
            <p style={{ fontSize: '1rem', color: '#A1A1AA', maxWidth: '540px', margin: '0 auto 2rem', lineHeight: 1.65 }}>
              Launch with 2FA OTP security, instant role separation, and real-time analytics across every device.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
              <Link to="/signup" className="hero-cta-lime">
                Create Organization Account
                <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="hero-cta-glass">
                <Lock size={15} />
                Talk to Enterprise Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, Users, Globe2, ArrowRight, Sparkles } from 'lucide-react';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Zero-Trust Access Governance',
    desc: 'Fine-grained RBAC rules ensure employees, HR specialists, and administrators access strictly what they are authorized to see.',
  },
  {
    icon: Cpu,
    title: 'Real-Time Synchronization',
    desc: 'Every leave approval, attendance punch, and payroll update propagates instantaneously across command views.',
  },
  {
    icon: Users,
    title: 'Human-First Clarity',
    desc: 'High-contrast typography and crisp data tables eliminate spreadsheet fatigue for fast-growing teams.',
  },
  {
    icon: Globe2,
    title: 'Built for Distributed Orgs',
    desc: 'Remote-first leave tracking, company-wide broadcasts, and unified directory governance across regions.',
  },
];

const LEADERSHIP = [
  { name: 'Dhruv Kamariya', role: 'Founder & Lead Architect', initials: 'DK', focus: 'Platform Core & Security' },
  { name: 'Aarav Mehta', role: 'Head of People Systems', initials: 'AM', focus: 'HR Automation & Payroll' },
  { name: 'Sophia Chen', role: 'Principal Product Designer', initials: 'SC', focus: 'Midnight UI & Systems' },
];

export default function AboutUsPage() {
  return (
    <div className="landing-page">
      <section style={{ padding: '5rem 0 4rem', position: 'relative' }}>
        <div className="hero-glow" />
        <div className="website-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '820px' }}>
          <div className="hero-eyebrow">
            <Sparkles size={13} />
            <span>ABOUT EMPLOYEEHUB</span>
          </div>
          <h1 className="hero-title" style={{ marginBottom: '1.25rem' }}>
            Designing clarity for <em>modern teams</em>.
          </h1>
          <p className="hero-subtitle" style={{ maxWidth: '640px' }}>
            EmployeeHub brings executive oversight, HR operations, and everyday employee workflows into a single high-contrast Midnight Black command suite.
          </p>
        </div>
      </section>

      {/* Metrics Strip */}
      <section style={{ padding: '2rem 0 4.5rem' }}>
        <div className="website-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            padding: '2rem',
            borderRadius: '20px',
            background: '#121314',
            border: '1px solid rgba(198, 244, 50, 0.22)',
          }}>
            {[
              { value: '99.98%', label: 'API Uptime SLA' },
              { value: '2FA', label: 'OTP Security Standard' },
              { value: '3 Panels', label: 'Admin • HR • Staff' },
              { value: '< 80ms', label: 'Query Response' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: '#C6F432', lineHeight: 1.05 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '0.35rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Values */}
      <section style={{ padding: '4rem 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="website-container">
          <div style={{ maxWidth: '600px', marginBottom: '2.75rem' }}>
            <span className="section-tag">Engineering Principles</span>
            <h2 className="section-heading">
              Why organizations switch to <em>EmployeeHub</em>.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.35rem' }}>
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className="feature-card">
                  <div
                    className="feature-icon-box"
                    style={{
                      background: idx % 2 === 0 ? '#C6F432' : 'rgba(255,255,255,0.08)',
                      color: idx % 2 === 0 ? '#0B0B0C' : '#FFFFFF',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                    {val.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#A1A1AA', lineHeight: 1.65 }}>
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section style={{ padding: '4.5rem 0 6rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="website-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-tag">Core Builders</span>
            <h2 className="section-heading">
              Meet the <em>architecture team</em>.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.35rem', marginBottom: '3.5rem' }}>
            {LEADERSHIP.map((member) => (
              <div key={member.name} className="team-card">
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  margin: '0 auto 1.15rem',
                  background: 'linear-gradient(135deg, #C6F432, #A6D11D)',
                  color: '#0B0B0C',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(198,244,50,0.22)',
                }}>
                  {member.initials}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>{member.name}</h3>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#C6F432', margin: '0.25rem 0 0.5rem' }}>
                  {member.role}
                </div>
                <p style={{ fontSize: '0.82rem', color: '#A1A1AA' }}>{member.focus}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/signup" className="hero-cta-lime">
              Start Your Workspace
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

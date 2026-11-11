import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Zap,
  Users,
  Award,
  Globe,
  ArrowRight,
  UserPlus,
  Mail,
  Linkedin,
  Twitter,
  CheckCircle,
} from 'lucide-react';

export default function AboutUsPage() {
  const leadership = [
    {
      name: 'Sarah Jenkins',
      title: 'Co-Founder & CEO',
      bio: 'Former VP of People Operations with 14+ years scaling tech workforces from 20 to 2,000+ employees.',
      initials: 'SJ',
      bg: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    },
    {
      name: 'David Kim',
      title: 'Co-Founder & CTO',
      bio: 'Distributed systems architect with deep expertise in enterprise data compliance, auditability, and speed.',
      initials: 'DK',
      bg: 'linear-gradient(135deg, #06b6d4, #0284c7)',
    },
    {
      name: 'Elena Rostova',
      title: 'Head of People & Culture',
      bio: 'Passionate workforce strategist advocating for human-first HR policies, transparent compensation, and fair growth.',
      initials: 'ER',
      bg: 'linear-gradient(135deg, #ec4899, #be185d)',
    },
    {
      name: 'Marcus Vance',
      title: 'VP of Product Experience',
      bio: 'Enterprise product leader dedicated to removing cognitive overhead and crafting delightful, snappy interfaces.',
      initials: 'MV',
      bg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    },
  ];

  const milestones = [
    {
      year: '2023',
      title: 'The Prototype',
      desc: 'Built our initial employee directory for 5 fast-growing tech companies tired of clunky legacy HR software.',
    },
    {
      year: '2024',
      title: 'Enterprise RBAC & Audits',
      desc: 'Launched tamper-evident audit logging, granular role permissions (Admin, HR, Viewer), and department trees.',
    },
    {
      year: '2025',
      title: 'Global Scale',
      desc: 'Crossed 15,000+ managed profiles across 12 countries, achieving 99.98% uptime and SOC-2 certification.',
    },
    {
      year: '2026',
      title: 'Version 2.4 Launch',
      desc: 'Introduced offline demo storage mode, automated CSV/PDF report generation, and instant department budgeting.',
    },
  ];

  return (
    <div className="landing-page">
      {/* 1. HERO SECTION */}
      <section className="landing-hero" style={{ paddingBottom: '4rem' }}>
        <div className="landing-container">
          <div className="landing-badge" id="about-badge">
            <Sparkles size={16} color="#818cf8" />
            <span>Our Mission & Vision</span>
          </div>

          <h1 className="landing-hero-title">
            Empowering Modern Organizations to <span>Put People First</span>
          </h1>

          <p className="landing-hero-subtitle">
            We believe workforce operations shouldn't be trapped in bloated, painful legacy systems. EmployeeHub was built
            from the ground up to bring speed, clarity, and security to modern enterprises.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <UserPlus size={16} />
              <span>Join EmployeeHub</span>
            </Link>
            <Link
              to="/contact"
              className="btn btn-secondary"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                padding: '0.75rem 1.5rem',
              }}
            >
              <Mail size={16} color="#818cf8" />
              <span>Contact Our Team</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MISSION & VISION SPLIT CARDS */}
      <section className="landing-section" style={{ paddingTop: '1rem' }}>
        <div className="landing-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '2.5rem',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
                Our Mission
              </h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem' }}>
                To eliminate administrative friction for People Ops and engineering teams by delivering a unified,
                lightning-fast system for managing employee lifecycles, org departments, and compliance audits with total
                confidence.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '2.5rem',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Globe size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
                Our Vision
              </h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem' }}>
                A world where companies of all sizes can operate with radical transparency, where sensitive employee data
                is effortlessly protected, and every team member has real-time clarity on organizational growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES */}
      <section className="landing-section" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
        <div className="landing-container">
          <div className="landing-section-header">
            <div className="landing-section-badge">Principles</div>
            <h2 className="landing-section-title">The Values That Guide Everything We Build</h2>
            <p className="landing-section-desc">
              From our code architecture to our user experience, these four core tenets define how we create products.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
                <Heart size={24} />
              </div>
              <h3 className="feature-card-title">People First</h3>
              <p className="feature-card-desc">
                Behind every employee record is an actual person. We build workflows that save time, reduce stress, and
                foster human connection across distributed teams.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 className="feature-card-title">Uncompromising Security</h3>
              <p className="feature-card-desc">
                Data security is never an afterthought. We enforce strict role-based access, cryptographic hashing, and
                immutable audit logs for every system mutation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                <Zap size={24} />
              </div>
              <h3 className="feature-card-title">Speed & Craftsmanship</h3>
              <p className="feature-card-desc">
                Nobody likes waiting for spinners. We obsess over sub-100ms interactions, clean typography, responsive
                layouts, and zero cognitive bloat.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                <Users size={24} />
              </div>
              <h3 className="feature-card-title">Radical Transparency</h3>
              <p className="feature-card-desc">
                Clear audit histories, transparent permission hierarchies, and honest communication. We champion clarity
                at every layer of the product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPANY JOURNEY TIMELINE */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <div className="landing-section-badge">Our Journey</div>
            <h2 className="landing-section-title">Milestones Along the Way</h2>
            <p className="landing-section-desc">
              How a project born out of frustration with legacy HR tools grew into an enterprise-trusted platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {milestones.map((m, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: '#818cf8',
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {m.year}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  {m.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: '1.6' }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LEADERSHIP TEAM */}
      <section className="landing-section" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
        <div className="landing-container">
          <div className="landing-section-header">
            <div className="landing-section-badge">Leadership Team</div>
            <h2 className="landing-section-title">Engineered by Veterans in People & Software</h2>
            <p className="landing-section-desc">
              Meet the passionate team behind EmployeeHub’s architecture, design, and customer experience.
            </p>
          </div>

          <div className="team-grid">
            {leadership.map((member, idx) => (
              <div key={idx} className="team-card">
                <div className="team-avatar" style={{ background: member.bg }}>
                  {member.initials}
                </div>
                <h3 className="team-name">{member.name}</h3>
                <div className="team-title">{member.title}</div>
                <p className="team-bio">{member.bio}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                  <span style={{ color: '#94a3b8', cursor: 'pointer' }}>
                    <Linkedin size={16} />
                  </span>
                  <span style={{ color: '#94a3b8', cursor: 'pointer' }}>
                    <Twitter size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="landing-section" style={{ paddingBottom: '6rem' }}>
        <div className="landing-container">
          <div className="cta-banner-card">
            <h2 className="cta-banner-title">Build a Better Workplace With Us</h2>
            <p className="cta-banner-subtitle">
              Ready to see how EmployeeHub can simplify employee management for your organization? Get started in under
              two minutes.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/signup"
                className="btn btn-secondary"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#4338ca',
                  fontWeight: 700,
                  padding: '0.85rem 1.85rem',
                  fontSize: '1rem',
                }}
              >
                <UserPlus size={18} />
                <span>Start Free Trial</span>
              </Link>
              <Link
                to="/contact"
                className="btn btn-outline"
                style={{
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.35)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '0.85rem 1.75rem',
                  fontSize: '1rem',
                }}
              >
                <Mail size={18} />
                <span>Contact Sales & Support</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

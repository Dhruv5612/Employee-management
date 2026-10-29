import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Send,
  Shield,
  ArrowRight,
  Heart,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { useToast } from '../../hooks/useToast.js';

export default function WebsiteFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { success, error: toastError } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toastError('Please enter a valid work email address.');
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setNewsletterEmail('');
      success('Thank you for subscribing to EmployeeHub engineering updates!');
    }, 600);
  };

  return (
    <footer className="website-footer">
      <div className="website-footer-container">
        <div className="website-footer-grid">
          {/* Col 1: Brand & Status */}
          <div className="website-footer-col">
            <Link to="/" className="website-brand" style={{ marginBottom: '1.25rem' }}>
              <div className="website-brand-logo">
                <Sparkles size={20} />
              </div>
              <span className="website-brand-text">EmployeeHub</span>
            </Link>

            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.5rem', maxWidth: '340px' }}>
              Next-generation enterprise workforce platform. Streamline employee directories, department hierarchies,
              role security, and real-time activity auditing in one intuitive suite.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                fontSize: '0.775rem',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
              All Systems Operational (99.98% Uptime)
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="website-footer-col">
            <h4>Quick Navigation</h4>
            <ul className="website-footer-links">
              <li>
                <Link to="/" className="website-footer-link">
                  <ArrowRight size={13} color="#6366f1" /> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="website-footer-link">
                  <ArrowRight size={13} color="#6366f1" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="website-footer-link">
                  <ArrowRight size={13} color="#6366f1" /> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/signin" className="website-footer-link">
                  <ArrowRight size={13} color="#6366f1" /> Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="website-footer-link">
                  <ArrowRight size={13} color="#6366f1" /> Sign Up / Register
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="website-footer-link">
                  <ArrowRight size={13} color="#6366f1" /> Live Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Capabilities */}
          <div className="website-footer-col">
            <h4>Platform Solutions</h4>
            <ul className="website-footer-links">
              <li>
                <a href="/#features" className="website-footer-link">
                  Employee Directory
                </a>
              </li>
              <li>
                <a href="/#features" className="website-footer-link">
                  Department Tree
                </a>
              </li>
              <li>
                <a href="/#features" className="website-footer-link">
                  Role-Based Security
                </a>
              </li>
              <li>
                <a href="/#features" className="website-footer-link">
                  Real-Time Audit Logs
                </a>
              </li>
              <li>
                <a href="/#features" className="website-footer-link">
                  CSV / PDF Reports
                </a>
              </li>
              <li>
                <a href="/#features" className="website-footer-link">
                  Offline Demo Mode
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Contact */}
          <div className="website-footer-col">
            <h4>Stay Connected</h4>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.5' }}>
              Subscribe to get product announcements, HR compliance tips, and feature updates.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="email"
                placeholder="work.email@company.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.85rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="btn btn-primary btn-sm"
                style={{ padding: '0.55rem 0.85rem' }}
                title="Subscribe"
              >
                <Send size={14} />
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                <Mail size={14} color="#818cf8" /> support@employeehub.io
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                <Phone size={14} color="#818cf8" /> +1 (800) 555-EMPL
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                <MapPin size={14} color="#818cf8" /> San Francisco, CA • Global Remote
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="website-footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            &copy; {new Date().getFullYear()} EmployeeHub Enterprise Inc. Built with{' '}
            <Heart size={14} color="#ef4444" fill="#ef4444" /> for modern workforce management.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
              <Shield size={14} color="#10b981" /> SOC-2 Type II Certified
            </span>
            <Link to="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Privacy & Security
            </Link>
            <Link to="/contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

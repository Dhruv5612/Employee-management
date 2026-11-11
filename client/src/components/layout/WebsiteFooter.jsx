import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, Phone, MapPin, Send, ArrowUpRight } from 'lucide-react';
import { useToast } from '../common/Toast.jsx';

export default function WebsiteFooter() {
  const toast = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.warning('Please enter a valid work email address.');
      return;
    }
    toast.success('Subscribed to EmployeeHub product updates!');
    setEmail('');
  };

  return (
    <footer className="website-footer">
      <div className="website-container">
        <div className="website-footer-grid">
          <div>
            <Link to="/" className="website-logo" style={{ marginBottom: '1rem' }}>
              <div className="website-logo-mark">
                <Users size={18} strokeWidth={2.4} />
              </div>
              <span>EmployeeHub</span>
            </Link>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: '#A1A1AA', maxWidth: '300px', marginBottom: '1.25rem' }}>
              Modern workforce command center built for fast-moving HR teams, executives, and engineering-led enterprises.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(198, 244, 50, 0.10)',
              border: '1px solid rgba(198, 244, 50, 0.28)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#C6F432',
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C6F432', boxShadow: '0 0 8px #C6F432' }} />
              All Cloud Clusters Operational
            </div>
          </div>

          <div>
            <h4 className="website-footer-heading">Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li><Link to="/" className="website-footer-link">Home</Link></li>
              <li><Link to="/#features" className="website-footer-link">Capabilities</Link></li>
              <li><Link to="/login" className="website-footer-link">Workspace Sign In</Link></li>
              <li><Link to="/signup" className="website-footer-link">Create Organization</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="website-footer-heading">Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li><Link to="/about" className="website-footer-link">About Us</Link></li>
              <li><Link to="/contact" className="website-footer-link">Contact Sales</Link></li>
              <li>
                <Link to="/login" className="website-footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  2FA Security <ArrowUpRight size={13} style={{ color: '#C6F432' }} />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="website-footer-heading">Stay Updated</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.15rem', fontSize: '0.85rem', color: '#A1A1AA' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Mail size={15} style={{ color: '#C6F432', flexShrink: 0 }} />
                <span>support@employeehub.app</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Phone size={15} style={{ color: '#C6F432', flexShrink: 0 }} />
                <span>+1 (555) 294-8810</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <MapPin size={15} style={{ color: '#C6F432', flexShrink: 0 }} />
                <span>San Francisco • Remote-First</span>
              </div>
            </div>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Work email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '0.58rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: '#141614',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                aria-label="Subscribe"
                style={{
                  padding: '0.58rem 0.9rem',
                  borderRadius: '10px',
                  background: '#C6F432',
                  color: '#0B0B0C',
                  border: 'none',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        <div className="website-footer-bottom">
          <span>© {new Date().getFullYear()} EmployeeHub Inc. Engineered in Midnight Black &amp; Lime.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: '#71717A' }}>Architecture</Link>
            <Link to="/contact" style={{ color: '#71717A' }}>Enterprise SLA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

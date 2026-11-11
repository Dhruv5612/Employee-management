import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Menu, X, ArrowRight } from 'lucide-react';

export default function WebsiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleFeaturesClick = (e) => {
    setMobileOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('features');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      e.preventDefault();
      navigate('/#features');
      setTimeout(() => {
        const el = document.getElementById('features');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navItems = [
    { label: 'Home', to: '/', active: location.pathname === '/' && !location.hash },
    { label: 'Features', to: '/#features', onClick: handleFeaturesClick, active: location.hash === '#features' },
    { label: 'About Us', to: '/about', active: location.pathname === '/about' },
    { label: 'Contact Us', to: '/contact', active: location.pathname === '/contact' },
  ];

  return (
    <header className="website-header">
      <div className="website-container website-header-inner">
        <Link to="/" className="website-logo" onClick={() => setMobileOpen(false)}>
          <div className="website-logo-mark">
            <Users size={18} strokeWidth={2.4} />
          </div>
          <span>EmployeeHub</span>
        </Link>

        <nav className="website-nav" aria-label="Public Navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={item.onClick}
              className={`website-nav-link ${item.active ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="website-nav-actions">
          <Link to="/login" className="nav-pill-ghost">
            Sign In
          </Link>
          <Link to="/signup" className="nav-pill-white">
            Get Started
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        <button
          type="button"
          className="website-mobile-btn"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`website-mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            onClick={(e) => {
              if (item.onClick) item.onClick(e);
              setMobileOpen(false);
            }}
            style={{
              padding: '0.65rem 0.75rem',
              borderRadius: '10px',
              color: item.active ? '#C6F432' : '#E4E4E7',
              backgroundColor: item.active ? 'rgba(198, 244, 50, 0.10)' : 'transparent',
              fontWeight: item.active ? 700 : 500,
              fontSize: '0.95rem',
            }}
          >
            {item.label}
          </Link>
        ))}

        <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="nav-pill-ghost"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            onClick={() => setMobileOpen(false)}
            className="nav-pill-white"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import authStorage from '../../services/authStorage.js';

export default function WebsiteNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    try {
      const user = authStorage.getUser();
      const token = authStorage.getToken();
      if (user && token) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="website-header">
      <div className="website-nav-container">
        {/* Brand Logo */}
        <Link to="/home" className="website-brand" id="brand-logo-link">
          <div className="website-brand-logo">
            <Sparkles size={22} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="website-brand-text">EmployeeHub</span>
            <span className="website-brand-badge">v2.4</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="website-nav-links">
            <li>
              <NavLink
                to="/home"
                end
                className={({ isActive }) => `website-nav-link ${isActive ? 'active' : ''}`}
                id="nav-link-home"
              >
                Home
              </NavLink>
            </li>
            <li>
              <a href="/home#features" className="website-nav-link" id="nav-link-features">
                Features
              </a>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => `website-nav-link ${isActive ? 'active' : ''}`}
                id="nav-link-about"
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => `website-nav-link ${isActive ? 'active' : ''}`}
                id="nav-link-contact"
              >
                Contact Us
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Action Buttons: Sign In and Sign Up are always prominently available */}
        <div className="website-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {currentUser && (
            <Link
              to="/dashboard"
              id="nav-btn-dashboard"
              className="btn btn-outline"
              style={{
                color: '#38bdf8',
                borderColor: 'rgba(56, 189, 248, 0.4)',
                backgroundColor: 'rgba(56, 189, 248, 0.08)',
                padding: '0.5rem 0.95rem',
                fontSize: '0.85rem',
              }}
            >
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </Link>
          )}

          <Link
            to="/signin"
            id="nav-btn-signin"
            className="btn btn-outline"
            style={{
              color: '#e2e8f0',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '0.55rem 1.1rem',
            }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </Link>
          <Link
            to="/signup"
            id="nav-btn-signup"
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
              padding: '0.55rem 1.25rem',
            }}
          >
            <UserPlus size={15} />
            <span>Sign Up</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="website-mobile-toggle"
          id="mobile-nav-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="website-mobile-drawer" id="mobile-nav-drawer">
          <NavLink
            to="/home"
            end
            className={({ isActive }) => `website-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <a
            href="/home#features"
            className="website-nav-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <NavLink
            to="/about"
            className={({ isActive }) => `website-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `website-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact Us
          </NavLink>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
            {currentUser && (
              <Link
                to="/dashboard"
                className="btn btn-outline"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ width: '100%', justifyContent: 'center', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
              >
                <LayoutDashboard size={16} />
                <span>Open Dashboard</span>
              </Link>
            )}
            <Link
              to="/signin"
              className="btn btn-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </Link>
            <Link
              to="/signup"
              className="btn btn-primary"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <UserPlus size={16} />
              <span>Create Account (Sign Up)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

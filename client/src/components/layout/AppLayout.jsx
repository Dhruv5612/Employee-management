import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import { authApi } from '../../features/auth/services/authApi.js';

export default function AppLayout() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify authentication
    authApi
      .getMe()
      .then((data) => {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      })
      .catch((err) => {
        console.warn('Auth verification failed', err);
        // Only redirect if unauthenticated
        if (!localStorage.getItem('token')) {
          navigate('/');
        }
      });
  }, [navigate]);

  return (
    <div className="app-container">
      <Sidebar
        user={user}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="app-main">
        <Header user={user} onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="page-container">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import { authApi } from '../../features/auth/services/authApi.js';
import authStorage from '../../services/authStorage.js';

export default function AppLayout() {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If no active session token, immediately redirect to sign in
    if (!authStorage.getToken()) {
      navigate('/signin', { replace: true });
      return;
    }

    // Verify authentication against backend
    authApi
      .getMe()
      .then((data) => {
        setUser(data.user);
        authStorage.setUser(data.user);
      })
      .catch((err) => {
        console.warn('Auth verification failed', err);
        authStorage.clear();
        navigate('/signin', { replace: true });
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

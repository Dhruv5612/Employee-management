import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import WebsiteNavbar from './WebsiteNavbar.jsx';
import WebsiteFooter from './WebsiteFooter.jsx';

export default function WebsiteLayout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a' }}>
      <WebsiteNavbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <WebsiteFooter />
    </div>
  );
}

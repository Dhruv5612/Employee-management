import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    dashboard: 'Dashboard',
    employees: 'Employees',
    new: 'New Entry',
    edit: 'Edit Details',
    departments: 'Departments',
    reports: 'Reports & Exports',
    'activity-logs': 'Activity Logs',
    admin: 'Administration',
    users: 'User Management',
    profile: 'Profile',
    settings: 'Settings',
  };

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: '#A1A1AA' }}>
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', color: '#A1A1AA' }}>
        <Home size={15} />
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = breadcrumbNameMap[value] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={14} color="#71717A" />
            {isLast ? (
              <span style={{ fontWeight: 700, color: '#C6F432' }}>{name}</span>
            ) : (
              <Link to={to} style={{ color: '#A1A1AA' }}>
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

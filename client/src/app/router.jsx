import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import WebsiteLayout from '../components/layout/WebsiteLayout.jsx';
import PublicLayout from '../components/layout/PublicLayout.jsx';
import ProtectedRoute from '../features/auth/components/ProtectedRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';

// Public Marketing Pages
import HomePage from '../features/public/pages/HomePage.jsx';
import AboutUsPage from '../features/public/pages/AboutUsPage.jsx';
import ContactUsPage from '../features/public/pages/ContactUsPage.jsx';

// Auth Pages (Public)
import LoginPage from '../features/auth/pages/LoginPage.jsx';
import SignUpPage from '../features/auth/pages/SignUpPage.jsx';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage.jsx';
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage.jsx';

// Feature Pages (Authenticated)
import DashboardPage from '../features/dashboard/pages/DashboardPage.jsx';
import EmployeeListPage from '../features/employees/pages/EmployeeListPage.jsx';
import EmployeeCreatePage from '../features/employees/pages/EmployeeCreatePage.jsx';
import EmployeeEditPage from '../features/employees/pages/EmployeeEditPage.jsx';
import EmployeeDetailsPage from '../features/employees/pages/EmployeeDetailsPage.jsx';

import DepartmentListPage from '../features/departments/pages/DepartmentListPage.jsx';
import DepartmentCreatePage from '../features/departments/pages/DepartmentCreatePage.jsx';
import DepartmentEditPage from '../features/departments/pages/DepartmentEditPage.jsx';

import ReportsPage from '../features/reports/pages/ReportsPage.jsx';
import ActivityLogsPage from '../features/activityLogs/pages/ActivityLogsPage.jsx';
import UserAdminPage from '../features/admin/pages/UserAdminPage.jsx';
import ProfilePage from '../features/profile/pages/ProfilePage.jsx';
import SettingsPage from '../features/settings/pages/SettingsPage.jsx';
import LeaveApprovalsPage from '../features/leaves/pages/LeaveApprovalsPage.jsx';
import PayrollPage from '../features/payroll/pages/PayrollPage.jsx';
import AttendancePage from '../features/attendance/pages/AttendancePage.jsx';
import AnnouncementsPage from '../features/announcements/pages/AnnouncementsPage.jsx';

export const router = createBrowserRouter([
  // Public Marketing Routes (WebsiteLayout: Home, About Us, Contact Us)
  {
    element: <WebsiteLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutUsPage /> },
      { path: '/contact', element: <ContactUsPage /> },
    ],
  },

  // Public Auth Routes (PublicLayout: Sign In, Sign Up, Password Recovery)
  {
    element: <PublicLayout />,
    children: [
      { path: '/signin', element: <LoginPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/register', element: <SignUpPage /> }, // alias
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password/:token', element: <ResetPasswordPage /> },
      { path: '/verify-email', element: <VerifyEmailPage /> },
    ],
  },

  // Authenticated Protected Routes (AppLayout)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/employees', element: <EmployeeListPage /> },
          { path: '/employees/new', element: <EmployeeCreatePage /> },
          { path: '/employees/:id', element: <EmployeeDetailsPage /> },
          { path: '/employees/:id/edit', element: <EmployeeEditPage /> },
          { path: '/departments', element: <DepartmentListPage /> },
          { path: '/departments/new', element: <DepartmentCreatePage /> },
          { path: '/departments/:id/edit', element: <DepartmentEditPage /> },
          { path: '/reports', element: <ReportsPage /> },
          { path: '/leave-approvals', element: <LeaveApprovalsPage /> },
          { path: '/attendance', element: <AttendancePage /> },
          { path: '/payroll', element: <PayrollPage /> },
          { path: '/announcements', element: <AnnouncementsPage /> },
          { path: '/activity-logs', element: <ActivityLogsPage /> },
          { path: '/admin/users', element: <UserAdminPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

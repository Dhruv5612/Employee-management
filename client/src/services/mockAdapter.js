// Standalone Demo Mode Adapter with localStorage persistence
// Emulates full REST endpoints if the Express/MongoDB server is temporarily unreachable or offline

const STORAGE_KEYS = {
  USERS: 'ems_demo_users',
  DEPARTMENTS: 'ems_demo_departments',
  EMPLOYEES: 'ems_demo_employees',
  COUNTER: 'ems_demo_counter',
  AUDIT_LOGS: 'ems_demo_audit_logs',
  LEAVES: 'ems_demo_leaves',
  PAYROLL: 'ems_demo_payroll',
  ATTENDANCE: 'ems_demo_attendance',
  ANNOUNCEMENTS: 'ems_demo_announcements',
};

const INITIAL_USERS = [
  {
    _id: 'user-admin',
    name: 'Admin User',
    email: 'admin@company.com',
    phone: '+1 (555) 000-1111',
    role: 'Admin',
    isActive: true,
    isEmailVerified: true,
    preferences: { emailNotifications: true, compactView: false, theme: 'light' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'user-hr',
    name: 'Sarah Jenkins',
    email: 'hr@company.com',
    phone: '+1 (555) 000-2222',
    role: 'HR',
    isActive: true,
    isEmailVerified: true,
    preferences: { emailNotifications: true, compactView: false, theme: 'light' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'user-viewer',
    name: 'Alex Rivera',
    email: 'viewer@company.com',
    phone: '+1 (555) 000-3333',
    role: 'Viewer',
    isActive: true,
    isEmailVerified: true,
    preferences: { emailNotifications: false, compactView: false, theme: 'light' },
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_DEPARTMENTS = [
  { _id: 'dept-1', name: 'Engineering', code: 'ENG', description: 'Core software engineering and infrastructure', employeeCount: 3, manager: { _id: 'emp-1', fullName: 'Rahul Sharma', email: 'rahul.sharma@company.com' } },
  { _id: 'dept-2', name: 'Product Management', code: 'PROD', description: 'Product strategy and UX research', employeeCount: 1, manager: { _id: 'emp-3', fullName: 'David Miller', email: 'david.miller@company.com' } },
  { _id: 'dept-3', name: 'Human Resources', code: 'HR', description: 'Talent acquisition, employee engagement', employeeCount: 1, manager: null },
  { _id: 'dept-4', name: 'Finance & Operations', code: 'FIN', description: 'Corporate finance and operations', employeeCount: 1, manager: null },
  { _id: 'dept-5', name: 'Marketing', code: 'MKT', description: 'Brand and digital marketing', employeeCount: 1, manager: null },
  { _id: 'dept-6', name: 'Customer Success', code: 'CS', description: 'Client onboarding and technical support', employeeCount: 0, manager: null },
];

const INITIAL_EMPLOYEES = [
  {
    _id: 'emp-1',
    employeeId: 'EMP-001001',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@company.com',
    phone: '+1 (555) 234-5678',
    department: { _id: 'dept-1', name: 'Engineering', code: 'ENG' },
    designation: 'Senior Full Stack Engineer',
    joiningDate: '2022-03-15',
    status: 'Active',
    createdAt: '2022-03-15T00:00:00.000Z',
  },
  {
    _id: 'emp-2',
    employeeId: 'EMP-001002',
    fullName: 'Priya Patel',
    email: 'priya.patel@company.com',
    phone: '+1 (555) 345-6789',
    department: { _id: 'dept-1', name: 'Engineering', code: 'ENG' },
    designation: 'Staff Backend Architect',
    joiningDate: '2021-08-01',
    status: 'Active',
    createdAt: '2021-08-01T00:00:00.000Z',
  },
  {
    _id: 'emp-3',
    employeeId: 'EMP-001003',
    fullName: 'David Miller',
    email: 'david.miller@company.com',
    phone: '+1 (555) 456-7890',
    department: { _id: 'dept-2', name: 'Product Management', code: 'PROD' },
    designation: 'Lead Product Manager',
    joiningDate: '2023-01-10',
    status: 'Active',
    createdAt: '2023-01-10T00:00:00.000Z',
  },
  {
    _id: 'emp-4',
    employeeId: 'EMP-001004',
    fullName: 'Emily Chen',
    email: 'emily.chen@company.com',
    phone: '+1 (555) 567-8901',
    department: { _id: 'dept-3', name: 'Human Resources', code: 'HR' },
    designation: 'Talent Acquisition Specialist',
    joiningDate: '2023-06-20',
    status: 'On Leave',
    createdAt: '2023-06-20T00:00:00.000Z',
  },
  {
    _id: 'emp-5',
    employeeId: 'EMP-001005',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@company.com',
    phone: '+1 (555) 678-9012',
    department: { _id: 'dept-4', name: 'Finance & Operations', code: 'FIN' },
    designation: 'Financial Analyst',
    joiningDate: '2022-11-05',
    status: 'Active',
    createdAt: '2022-11-05T00:00:00.000Z',
  },
  {
    _id: 'emp-6',
    employeeId: 'EMP-001006',
    fullName: 'Aisha Al-Mansoor',
    email: 'aisha.m@company.com',
    phone: '+1 (555) 789-0123',
    department: { _id: 'dept-5', name: 'Marketing', code: 'MKT' },
    designation: 'Content & Growth Strategist',
    joiningDate: '2024-02-14',
    status: 'Active',
    createdAt: '2024-02-14T00:00:00.000Z',
  },
  {
    _id: 'emp-7',
    employeeId: 'EMP-001007',
    fullName: 'Carlos Rodriguez',
    email: 'carlos.r@company.com',
    phone: '+1 (555) 890-1234',
    department: { _id: 'dept-1', name: 'Engineering', code: 'ENG' },
    designation: 'DevOps & Cloud Engineer',
    joiningDate: '2020-05-18',
    status: 'Inactive',
    createdAt: '2020-05-18T00:00:00.000Z',
  },
];

const INITIAL_LOGS = [
  {
    _id: 'log-1',
    actor: { name: 'Admin User', role: 'Admin' },
    action: 'SYSTEM_INITIALIZED',
    entityType: 'System',
    entityId: 'sys-1',
    changes: { description: 'Enterprise workspace initialized' },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: 'log-2',
    actor: { name: 'Sarah Jenkins', role: 'HR' },
    action: 'EMPLOYEE_CREATED',
    entityType: 'Employee',
    entityId: 'emp-1',
    changes: { fullName: 'Rahul Sharma', employeeId: 'EMP-001001' },
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    _id: 'log-3',
    actor: { name: 'Sarah Jenkins', role: 'HR' },
    action: 'EMPLOYEE_STATUS_UPDATED',
    entityType: 'Employee',
    entityId: 'emp-4',
    changes: { status: { from: 'Active', to: 'On Leave' } },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

const INITIAL_LEAVES = [
  {
    _id: 'leave-1',
    employeeId: 'EMP-001001',
    employeeName: 'Rahul Sharma',
    employeeEmail: 'rahul.sharma@company.com',
    department: 'Engineering',
    leaveType: 'Sick Leave',
    startDate: '2026-10-29',
    endDate: '2026-10-30',
    days: 2,
    reason: 'Severe viral flu and high fever. Doctor advised 2 days bed rest.',
    status: 'Pending',
    appliedDate: '2026-10-27',
  },
  {
    _id: 'leave-2',
    employeeId: 'EMP-001004',
    employeeName: 'Emily Chen',
    employeeEmail: 'emily.chen@company.com',
    department: 'Human Resources',
    leaveType: 'Annual Vacation',
    startDate: '2026-11-03',
    endDate: '2026-11-07',
    days: 5,
    reason: 'Annual family holiday and visit to parents.',
    status: 'Pending',
    appliedDate: '2026-10-26',
  },
  {
    _id: 'leave-3',
    employeeId: 'EMP-001005',
    employeeName: 'Marcus Vance',
    employeeEmail: 'marcus.vance@company.com',
    department: 'Finance & Operations',
    leaveType: 'Casual Leave',
    startDate: '2026-10-30',
    endDate: '2026-10-30',
    days: 1,
    reason: 'Personal banking and vehicle registration paperwork.',
    status: 'Pending',
    appliedDate: '2026-10-28',
  },
  {
    _id: 'leave-4',
    employeeId: 'EMP-001002',
    employeeName: 'Priya Patel',
    employeeEmail: 'priya.patel@company.com',
    department: 'Product Management',
    leaveType: 'Medical Leave',
    startDate: '2026-10-18',
    endDate: '2026-10-20',
    days: 3,
    reason: 'Outpatient surgery and recovery.',
    status: 'Approved',
    appliedDate: '2026-10-15',
    reviewedBy: 'Admin',
    reviewComment: 'Approved. Get well soon!',
  },
  {
    _id: 'leave-5',
    employeeId: 'EMP-001007',
    employeeName: 'Carlos Rodriguez',
    employeeEmail: 'carlos.r@company.com',
    department: 'Engineering',
    leaveType: 'Emergency Leave',
    startDate: '2026-10-10',
    endDate: '2026-10-11',
    days: 2,
    reason: 'Home plumbing emergency requiring immediate repair.',
    status: 'Rejected',
    appliedDate: '2026-10-09',
    reviewedBy: 'HR Manager',
    reviewComment: 'Critical release sprint in progress. Please reschedule.',
  },
];

const INITIAL_PAYROLL = [
  {
    _id: 'pay-1',
    employeeId: 'EMP-001001',
    employeeName: 'Rahul Sharma',
    designation: 'Senior Full Stack Engineer',
    department: 'Engineering',
    month: 'October',
    year: 2026,
    baseSalary: 6500,
    allowances: 800,
    deductions: 950,
    netSalary: 6350,
    paymentStatus: 'Paid',
    paymentMethod: 'Direct Deposit',
    paymentDate: '2026-10-28',
    notes: 'Q3 performance bonus included in allowances',
  },
  {
    _id: 'pay-2',
    employeeId: 'EMP-001002',
    employeeName: 'Priya Patel',
    designation: 'Principal UX Designer',
    department: 'Product Management',
    month: 'October',
    year: 2026,
    baseSalary: 7200,
    allowances: 900,
    deductions: 1100,
    netSalary: 7000,
    paymentStatus: 'Paid',
    paymentMethod: 'Direct Deposit',
    paymentDate: '2026-10-28',
    notes: 'Design team lead stipend included',
  },
  {
    _id: 'pay-3',
    employeeId: 'EMP-001004',
    employeeName: 'Emily Chen',
    designation: 'Talent Acquisition Specialist',
    department: 'Human Resources',
    month: 'October',
    year: 2026,
    baseSalary: 4800,
    allowances: 400,
    deductions: 650,
    netSalary: 4550,
    paymentStatus: 'Processing',
    paymentMethod: 'Bank Transfer',
    paymentDate: null,
    notes: 'Awaiting bank batch processing',
  },
  {
    _id: 'pay-4',
    employeeId: 'EMP-001005',
    employeeName: 'Marcus Vance',
    designation: 'Financial Analyst',
    department: 'Finance & Operations',
    month: 'October',
    year: 2026,
    baseSalary: 5200,
    allowances: 600,
    deductions: 750,
    netSalary: 5050,
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer',
    paymentDate: null,
    notes: 'Regular monthly payrun',
  },
  {
    _id: 'pay-5',
    employeeId: 'EMP-001006',
    employeeName: 'Aisha Al-Mansoor',
    designation: 'Content & Growth Strategist',
    department: 'Marketing',
    month: 'October',
    year: 2026,
    baseSalary: 4500,
    allowances: 500,
    deductions: 600,
    netSalary: 4400,
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer',
    paymentDate: null,
    notes: 'Regular monthly payrun',
  },
];

const INITIAL_ATTENDANCE = [
  {
    _id: 'att-1',
    employeeId: 'EMP-001001',
    employeeName: 'Rahul Sharma',
    department: 'Engineering',
    date: '2026-10-28',
    status: 'Present',
    checkIn: '09:02 AM',
    checkOut: '05:45 PM',
    notes: 'On time, active sprint work',
  },
  {
    _id: 'att-2',
    employeeId: 'EMP-001002',
    employeeName: 'Priya Patel',
    department: 'Product Management',
    date: '2026-10-28',
    status: 'Present',
    checkIn: '08:55 AM',
    checkOut: '05:30 PM',
    notes: 'Sprint design review lead',
  },
  {
    _id: 'att-3',
    employeeId: 'EMP-001003',
    employeeName: 'David Miller',
    department: 'Product Management',
    date: '2026-10-28',
    status: 'Present',
    checkIn: '09:12 AM',
    checkOut: '06:05 PM',
    notes: 'Customer advisory call',
  },
  {
    _id: 'att-4',
    employeeId: 'EMP-001004',
    employeeName: 'Emily Chen',
    department: 'Human Resources',
    date: '2026-10-28',
    status: 'On Leave',
    checkIn: '-',
    checkOut: '-',
    notes: 'Approved medical leave',
  },
  {
    _id: 'att-5',
    employeeId: 'EMP-001005',
    employeeName: 'Marcus Vance',
    department: 'Finance & Operations',
    date: '2026-10-28',
    status: 'Half Day',
    checkIn: '09:00 AM',
    checkOut: '01:30 PM',
    notes: 'Approved afternoon personal time',
  },
  {
    _id: 'att-6',
    employeeId: 'EMP-001006',
    employeeName: 'Aisha Al-Mansoor',
    department: 'Marketing',
    date: '2026-10-28',
    status: 'Present',
    checkIn: '09:05 AM',
    checkOut: '05:50 PM',
    notes: 'Campaign launch tracking',
  },
  {
    _id: 'att-7',
    employeeId: 'EMP-001007',
    employeeName: 'Carlos Rodriguez',
    department: 'Engineering',
    date: '2026-10-28',
    status: 'Late',
    checkIn: '10:20 AM',
    checkOut: '06:30 PM',
    notes: 'Traffic transit delay notified in advance',
  },
];

const INITIAL_ANNOUNCEMENTS = [
  {
    _id: 'ann-1',
    title: 'Q4 All-Hands Company Townhall Meeting',
    category: 'Company News',
    priority: 'High',
    isPinned: true,
    content:
      'Join our CEO and executive leadership team this Thursday at 3:00 PM EST for our quarterly company townhall. We will review our Q3 financial achievements, preview the 2027 enterprise product roadmap, and celebrate our high performers. Refreshments will be served in the main lobby.',
    author: 'Dhruv Patel (Admin)',
    date: '2026-10-28',
    targetAudience: 'All Employees',
  },
  {
    _id: 'ann-2',
    title: 'Annual Health Benefits & Open Enrollment Window',
    category: 'Policy Update',
    priority: 'High',
    isPinned: true,
    content:
      'The open enrollment window for 2027 healthcare and flexible spending accounts is officially open from November 2nd to November 20th. Please log into the benefits portal to verify your family coverage, dental tiers, and 401(k) company match elections.',
    author: 'Sarah Jenkins (HR Manager)',
    date: '2026-10-26',
    targetAudience: 'All Employees',
  },
  {
    _id: 'ann-3',
    title: 'Scheduled Cloud Infrastructure Maintenance Window',
    category: 'Urgent Notice',
    priority: 'Normal',
    isPinned: false,
    content:
      'IT DevOps will perform routine security patching and server database upgrades this Saturday, October 31st between 1:00 AM and 4:00 AM EST. Internal staging environments and VPN endpoints may experience brief disconnections during this window.',
    author: 'DevOps & Infrastructure Team',
    date: '2026-10-25',
    targetAudience: 'Engineering & IT',
  },
  {
    _id: 'ann-4',
    title: 'Celebrating Diwali & Global Cultural Festival Next Week',
    category: 'Event & Celebration',
    priority: 'Normal',
    isPinned: false,
    content:
      'In celebration of Diwali and multicultural diversity, our social committee is hosting a festival gathering on Friday afternoon from 4:00 PM in the central cafeteria with traditional delicacies and team activities. Everyone is warmly invited!',
    author: 'Employee Culture Committee',
    date: '2026-10-24',
    targetAudience: 'All Employees',
  },
];

function initDemoStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.COUNTER, '1007');
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEAVES)) {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(INITIAL_LEAVES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PAYROLL)) {
    localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(INITIAL_PAYROLL));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
  }
}

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export const mockAdapter = {
  async requestLoginOtp(email) {
    initDemoStorage();
    const demoOtp = '123456';
    const normalized = (email || '').toLowerCase();
    localStorage.setItem('ems_demo_login_otp_' + normalized, demoOtp);
    return {
      requiresOtp: true,
      email: normalized,
      message: `A 6-digit approval code has been dispatched to ${email}`,
      devOtp: demoOtp,
    };
  },

  async verifyLoginOtp({ email, otp }) {
    initDemoStorage();
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    let user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      let role = 'Admin';
      if (email.toLowerCase().includes('hr')) role = 'HR';
      if (email.toLowerCase().includes('viewer')) role = 'Viewer';
      user = {
        _id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email,
        phone: '',
        role,
        isActive: true,
        isEmailVerified: true,
        preferences: { emailNotifications: true, compactView: false, theme: 'light' },
      };
      users.push(user);
      setStored(STORAGE_KEYS.USERS, users);
    }
    return {
      token: 'demo-jwt-token-' + Date.now(),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
      },
    };
  },

  async requestSignupOtp(data) {
    initDemoStorage();
    const demoOtp = '123456';
    const normalized = (data.email || '').toLowerCase();
    localStorage.setItem('ems_demo_signup_pending_' + normalized, JSON.stringify(data));
    localStorage.setItem('ems_demo_signup_otp_' + normalized, demoOtp);
    return {
      requiresOtp: true,
      email: normalized,
      message: `A 6-digit confirmation code has been sent to ${data.email}`,
      devOtp: demoOtp,
    };
  },

  async verifySignupOtp({ email, otp }) {
    initDemoStorage();
    const normalized = (email || '').toLowerCase();
    const pendingStr = localStorage.getItem('ems_demo_signup_pending_' + normalized);
    const pendingData = pendingStr ? JSON.parse(pendingStr) : { name: 'Demo User', email, role: 'Viewer' };
    return this.signup(pendingData);
  },

  async resendOtp({ email, purpose }) {
    return {
      success: true,
      message: `A new code has been dispatched to ${email}`,
      devOtp: '123456',
    };
  },

  async login(email, password) {
    initDemoStorage();
    const demoOtp = '123456';
    const normalized = (email || '').toLowerCase();
    localStorage.setItem('ems_demo_login_otp_' + normalized, demoOtp);
    return {
      requiresOtp: true,
      email: normalized,
      delivered: false,
      message: `Demo Mode: Credentials authenticated. OTP code generated: ${demoOtp}`,
      devOtp: demoOtp,
    };
  },

  async signup(data) {
    initDemoStorage();
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('Email address is already in use');
    }

    const newUser = {
      _id: 'user-' + Date.now(),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone || '',
      role: data.role || 'Viewer',
      isActive: true,
      isEmailVerified: true,
      preferences: { emailNotifications: true, compactView: false, theme: 'light' },
    };

    users.push(newUser);
    setStored(STORAGE_KEYS.USERS, users);

    return {
      token: 'demo-jwt-token-' + Date.now(),
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
        preferences: newUser.preferences,
      },
    };
  },

  async forgotPassword(email) {
    return {
      message: 'Password reset link generated successfully',
      resetToken: 'demo-reset-token-12345',
      resetUrl: '/reset-password/demo-reset-token-12345',
    };
  },

  async resetPassword(token, newPassword) {
    return { message: 'Password has been reset successfully. You can now sign in.' };
  },

  async verifyEmail(token) {
    return { message: 'Email verified successfully!' };
  },

  async changePassword(userId, currentPassword, newPassword) {
    return { message: 'Password changed successfully' };
  },

  async updateProfile(data) {
    initDemoStorage();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = { ...storedUser, ...data };
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  },

  async listUsers() {
    initDemoStorage();
    return getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  async updateUserRole(id, data) {
    initDemoStorage();
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const index = users.findIndex((u) => u._id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      setStored(STORAGE_KEYS.USERS, users);
      return users[index];
    }
    throw new Error('User not found');
  },

  async deleteUser(id) {
    initDemoStorage();
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const filtered = users.filter((u) => u._id !== id);
    setStored(STORAGE_KEYS.USERS, filtered);
    return { success: true, message: 'User deleted successfully' };
  },

  async getMe() {
    initDemoStorage();
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      return {
        user: u,
        permissions: {
          canViewEmployees: true,
          canAddEmployees: ['Admin', 'HR'].includes(u.role),
          canEditEmployees: ['Admin', 'HR'].includes(u.role),
          canDeleteEmployees: u.role === 'Admin',
          canChangeStatus: ['Admin', 'HR'].includes(u.role),
          canManageDepartments: ['Admin', 'HR'].includes(u.role),
          canManageUsers: u.role === 'Admin',
          canViewReports: ['Admin', 'HR'].includes(u.role),
          canViewAuditLogs: u.role === 'Admin',
        },
      };
    }
    return {
      user: INITIAL_USERS[0],
      permissions: {
        canViewEmployees: true,
        canAddEmployees: true,
        canEditEmployees: true,
        canDeleteEmployees: true,
        canChangeStatus: true,
        canManageDepartments: true,
        canManageUsers: true,
        canViewReports: true,
        canViewAuditLogs: true,
      },
    };
  },

  async listDepartments() {
    initDemoStorage();
    const depts = getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);

    return depts.map((d) => ({
      ...d,
      employeeCount: emps.filter(
        (e) => (typeof e.department === 'object' ? e.department?._id : e.department) === d._id
      ).length,
    }));
  },

  async createDepartment(data) {
    initDemoStorage();
    const depts = getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);

    let managerObj = null;
    if (data.manager) {
      const m = emps.find((e) => e._id === data.manager);
      if (m) managerObj = { _id: m._id, fullName: m.fullName, email: m.email };
    }

    const newDept = {
      _id: 'dept-' + Date.now(),
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      description: data.description || '',
      manager: managerObj,
      employeeCount: 0,
      createdAt: new Date().toISOString(),
    };
    depts.push(newDept);
    setStored(STORAGE_KEYS.DEPARTMENTS, depts);
    return newDept;
  },

  async updateDepartment(id, data) {
    initDemoStorage();
    const depts = getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    const index = depts.findIndex((d) => d._id === id);
    if (index === -1) throw new Error('Department not found');

    let managerObj = depts[index].manager;
    if (data.manager !== undefined) {
      if (data.manager) {
        const m = emps.find((e) => e._id === data.manager);
        if (m) managerObj = { _id: m._id, fullName: m.fullName, email: m.email };
      } else {
        managerObj = null;
      }
    }

    depts[index] = { ...depts[index], ...data, manager: managerObj, updatedAt: new Date().toISOString() };
    setStored(STORAGE_KEYS.DEPARTMENTS, depts);
    return depts[index];
  },

  async deleteDepartment(id) {
    initDemoStorage();
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    const assigned = emps.filter(
      (e) => (typeof e.department === 'object' ? e.department?._id : e.department) === id
    );
    if (assigned.length > 0) {
      const err = new Error(
        `Cannot delete department because it has ${assigned.length} assigned employee(s). Please reassign them first.`
      );
      err.response = { data: { message: err.message }, status: 409 };
      throw err;
    }
    const depts = getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS).filter((d) => d._id !== id);
    setStored(STORAGE_KEYS.DEPARTMENTS, depts);
    return { message: 'Department deleted successfully' };
  },

  async listEmployees(params = {}) {
    initDemoStorage();
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    let filtered = [...emps];

    if (params.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q)
      );
    }

    if (params.department) {
      filtered = filtered.filter(
        (e) => (typeof e.department === 'object' ? e.department?._id : e.department) === params.department
      );
    }

    if (params.status) {
      filtered = filtered.filter((e) => e.status === params.status);
    }

    const sortBy = params.sortBy || 'createdAt';
    const order = params.order === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      let va = a[sortBy] || '';
      let vb = b[sortBy] || '';
      if (sortBy === 'name') {
        va = a.fullName;
        vb = b.fullName;
      }
      return va > vb ? order : va < vb ? -order : 0;
    });

    const page = parseInt(params.page, 10) || 1;
    const limit = parseInt(params.limit, 10) || 10;
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / limit) || 0;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      employees: paginated,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
      },
    };
  },

  async getEmployeeById(id) {
    initDemoStorage();
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    const emp = emps.find((e) => e._id === id || e.employeeId === id);
    if (!emp) throw new Error('Employee not found');
    return emp;
  },

  async createEmployee(data) {
    initDemoStorage();
    const depts = getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);

    const deptObj = depts.find((d) => d._id === data.department);
    let counter = parseInt(localStorage.getItem(STORAGE_KEYS.COUNTER) || '1007', 10) + 1;
    localStorage.setItem(STORAGE_KEYS.COUNTER, String(counter));

    const newEmp = {
      _id: 'emp-' + Date.now(),
      employeeId: `EMP-${String(counter).padStart(6, '0')}`,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      department: deptObj ? { _id: deptObj._id, name: deptObj.name, code: deptObj.code } : data.department,
      designation: data.designation.trim(),
      joiningDate: data.joiningDate,
      status: data.status || 'Active',
      createdAt: new Date().toISOString(),
    };

    emps.unshift(newEmp);
    setStored(STORAGE_KEYS.EMPLOYEES, emps);
    return newEmp;
  },

  async updateEmployee(id, data) {
    initDemoStorage();
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    const depts = getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    const index = emps.findIndex((e) => e._id === id);
    if (index === -1) throw new Error('Employee not found');

    const updated = { ...emps[index], ...data };
    if (data.department) {
      const deptObj = depts.find((d) => d._id === data.department);
      if (deptObj) {
        updated.department = { _id: deptObj._id, name: deptObj.name, code: deptObj.code };
      }
    }
    emps[index] = updated;
    setStored(STORAGE_KEYS.EMPLOYEES, emps);
    return updated;
  },

  async updateStatus(id, status) {
    return this.updateEmployee(id, { status });
  },

  async deleteEmployee(id) {
    initDemoStorage();
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES).filter((e) => e._id !== id);
    setStored(STORAGE_KEYS.EMPLOYEES, emps);
    return { message: 'Employee deleted successfully' };
  },

  async getDashboardStats() {
    initDemoStorage();
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    const depts = getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);

    return {
      totalEmployees: emps.length,
      activeEmployees: emps.filter((e) => e.status === 'Active').length,
      inactiveEmployees: emps.filter((e) => e.status === 'Inactive').length,
      onLeaveEmployees: emps.filter((e) => e.status === 'On Leave').length,
      totalDepartments: depts.length,
    };
  },

  async getDepartmentDistribution() {
    initDemoStorage();
    const depts = getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);

    return depts.map((d) => ({
      departmentId: d._id,
      departmentName: d.name,
      departmentCode: d.code,
      employeeCount: emps.filter(
        (e) => (typeof e.department === 'object' ? e.department?._id : e.department) === d._id
      ).length,
    }));
  },

  async getStatusDistribution() {
    initDemoStorage();
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    return [
      { status: 'Active', count: emps.filter((e) => e.status === 'Active').length },
      { status: 'Inactive', count: emps.filter((e) => e.status === 'Inactive').length },
      { status: 'On Leave', count: emps.filter((e) => e.status === 'On Leave').length },
    ];
  },

  async listAuditLogs(query = {}) {
    initDemoStorage();
    const logs = getStored(STORAGE_KEYS.AUDIT_LOGS, INITIAL_LOGS);
    return {
      logs,
      pagination: {
        page: 1,
        limit: 10,
        totalRecords: logs.length,
        totalPages: 1,
      },
    };
  },

  async getRecentActivities(limit = 8) {
    initDemoStorage();
    const logs = getStored(STORAGE_KEYS.AUDIT_LOGS, INITIAL_LOGS);
    return logs.slice(0, limit);
  },

  async getReportSummary(query = {}) {
    initDemoStorage();
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    const depts = getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);

    return {
      totalEmployees: emps.length,
      statusBreakdown: [
        { status: 'Active', count: emps.filter((e) => e.status === 'Active').length },
        { status: 'Inactive', count: emps.filter((e) => e.status === 'Inactive').length },
        { status: 'On Leave', count: emps.filter((e) => e.status === 'On Leave').length },
      ],
      deptBreakdown: depts.map((d) => ({
        departmentName: d.name,
        departmentCode: d.code,
        count: emps.filter((e) => (e.department?._id || e.department) === d._id).length,
      })),
    };
  },

  async exportEmployees(query = {}) {
    initDemoStorage();
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    return emps.map((emp) => ({
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      email: emp.email,
      phone: emp.phone,
      department: emp.department?.name || 'Unassigned',
      departmentCode: emp.department?.code || '',
      designation: emp.designation,
      joiningDate: emp.joiningDate ? String(emp.joiningDate).split('T')[0] : '',
      status: emp.status,
      createdAt: emp.createdAt || '',
    }));
  },

  // =================== LEAVE APPROVALS ===================
  async listLeaves(filter = 'All') {
    initDemoStorage();
    const leaves = getStored(STORAGE_KEYS.LEAVES, INITIAL_LEAVES);
    if (!filter || filter === 'All') return leaves;
    return leaves.filter((l) => l.status.toLowerCase() === filter.toLowerCase());
  },

  async getLeaveStats() {
    initDemoStorage();
    const leaves = getStored(STORAGE_KEYS.LEAVES, INITIAL_LEAVES);
    return {
      pending: leaves.filter((l) => l.status === 'Pending').length,
      approved: leaves.filter((l) => l.status === 'Approved').length,
      rejected: leaves.filter((l) => l.status === 'Rejected').length,
      total: leaves.length,
    };
  },

  async createLeave(data) {
    initDemoStorage();
    const leaves = getStored(STORAGE_KEYS.LEAVES, INITIAL_LEAVES);
    const newLeave = {
      _id: 'leave-' + Date.now(),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...data,
    };
    leaves.unshift(newLeave);
    setStored(STORAGE_KEYS.LEAVES, leaves);
    return newLeave;
  },

  async updateLeaveStatus(id, { status, reviewComment, reviewedBy = 'Admin' }) {
    initDemoStorage();
    const leaves = getStored(STORAGE_KEYS.LEAVES, INITIAL_LEAVES);
    const idx = leaves.findIndex((l) => l._id === id);
    if (idx === -1) throw new Error('Leave request not found');
    leaves[idx] = {
      ...leaves[idx],
      status,
      reviewComment: reviewComment || '',
      reviewedBy,
      reviewedAt: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.LEAVES, leaves);
    return leaves[idx];
  },

  // =================== PAYROLL MANAGEMENT ===================
  async listPayroll(params = {}) {
    initDemoStorage();
    let records = getStored(STORAGE_KEYS.PAYROLL, INITIAL_PAYROLL);
    if (params.month) {
      records = records.filter((p) => p.month.toLowerCase() === params.month.toLowerCase());
    }
    if (params.year) {
      records = records.filter((p) => String(p.year) === String(params.year));
    }
    if (params.status && params.status !== 'All') {
      records = records.filter((p) => p.paymentStatus.toLowerCase() === params.status.toLowerCase());
    }
    if (params.q) {
      const q = params.q.toLowerCase();
      records = records.filter(
        (p) =>
          p.employeeName.toLowerCase().includes(q) ||
          p.employeeId.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q)
      );
    }
    return records;
  },

  async getPayrollStats() {
    initDemoStorage();
    const records = getStored(STORAGE_KEYS.PAYROLL, INITIAL_PAYROLL);
    const totalPayroll = records.reduce((sum, r) => sum + (Number(r.netSalary) || 0), 0);
    const paidCount = records.filter((r) => r.paymentStatus === 'Paid').length;
    const pendingCount = records.filter((r) => r.paymentStatus === 'Pending' || r.paymentStatus === 'Processing').length;
    const avgSalary = records.length ? Math.round(totalPayroll / records.length) : 0;
    return {
      totalPayroll,
      paidCount,
      pendingCount,
      avgSalary,
      totalRecords: records.length,
    };
  },

  async createPayroll(data) {
    initDemoStorage();
    const records = getStored(STORAGE_KEYS.PAYROLL, INITIAL_PAYROLL);
    const base = Number(data.baseSalary) || 0;
    const allow = Number(data.allowances) || 0;
    const deduct = Number(data.deductions) || 0;
    const net = base + allow - deduct;

    const newRecord = {
      _id: 'pay-' + Date.now(),
      ...data,
      baseSalary: base,
      allowances: allow,
      deductions: deduct,
      netSalary: net,
      paymentDate: data.paymentStatus === 'Paid' ? new Date().toISOString().split('T')[0] : null,
      createdAt: new Date().toISOString(),
    };
    records.unshift(newRecord);
    setStored(STORAGE_KEYS.PAYROLL, records);
    return newRecord;
  },

  async updatePayrollStatus(id, { paymentStatus, paymentMethod, paymentDate }) {
    initDemoStorage();
    const records = getStored(STORAGE_KEYS.PAYROLL, INITIAL_PAYROLL);
    const idx = records.findIndex((r) => r._id === id);
    if (idx === -1) throw new Error('Payroll record not found');
    records[idx] = {
      ...records[idx],
      paymentStatus: paymentStatus || records[idx].paymentStatus,
      paymentMethod: paymentMethod || records[idx].paymentMethod,
      paymentDate:
        paymentDate ||
        (paymentStatus === 'Paid' ? new Date().toISOString().split('T')[0] : records[idx].paymentDate),
    };
    setStored(STORAGE_KEYS.PAYROLL, records);
    return records[idx];
  },

  async deletePayroll(id) {
    initDemoStorage();
    let records = getStored(STORAGE_KEYS.PAYROLL, INITIAL_PAYROLL);
    records = records.filter((r) => r._id !== id);
    setStored(STORAGE_KEYS.PAYROLL, records);
    return { success: true };
  },

  // =================== ATTENDANCE MANAGEMENT ===================
  async listAttendance(date) {
    initDemoStorage();
    const targetDate = date || new Date().toISOString().split('T')[0];
    const records = getStored(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    const emps = getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);

    // Filter by date or ensure all active employees have a row
    const existing = records.filter((a) => a.date === targetDate);
    if (existing.length === 0) {
      // Auto-populate default day roster
      const generated = emps.map((emp, i) => ({
        _id: `att-${Date.now()}-${i}`,
        employeeId: emp.employeeId,
        employeeName: emp.fullName,
        department: emp.department?.name || 'General',
        date: targetDate,
        status: 'Present',
        checkIn: '09:00 AM',
        checkOut: '05:30 PM',
        notes: '',
      }));
      setStored(STORAGE_KEYS.ATTENDANCE, [...records, ...generated]);
      return generated;
    }
    return existing;
  },

  async getAttendanceStats(date) {
    initDemoStorage();
    const records = await this.listAttendance(date);
    const present = records.filter((r) => r.status === 'Present').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const onLeave = records.filter((r) => r.status === 'On Leave').length;
    const halfDay = records.filter((r) => r.status === 'Half Day').length;
    const late = records.filter((r) => r.status === 'Late').length;
    const total = records.length;
    const rate = total > 0 ? Math.round(((present + halfDay) / total) * 100) : 100;

    return {
      total,
      present,
      absent,
      onLeave,
      halfDay,
      late,
      rate,
    };
  },

  async updateAttendance(id, updates) {
    initDemoStorage();
    const records = getStored(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    const idx = records.findIndex((r) => r._id === id);
    if (idx !== -1) {
      records[idx] = { ...records[idx], ...updates };
      setStored(STORAGE_KEYS.ATTENDANCE, records);
      return records[idx];
    }
    return null;
  },

  async batchMarkAttendance(date, status) {
    initDemoStorage();
    const targetDate = date || new Date().toISOString().split('T')[0];
    const records = getStored(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    records.forEach((r) => {
      if (r.date === targetDate) {
        r.status = status;
        if (status === 'Present') {
          r.checkIn = '09:00 AM';
          r.checkOut = '05:30 PM';
        } else if (status === 'Absent') {
          r.checkIn = '-';
          r.checkOut = '-';
        }
      }
    });
    setStored(STORAGE_KEYS.ATTENDANCE, records);
    return records.filter((r) => r.date === targetDate);
  },

  // =================== ANNOUNCEMENTS ===================
  async listAnnouncements(params = {}) {
    initDemoStorage();
    let items = getStored(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    if (params.category && params.category !== 'All') {
      items = items.filter((a) => a.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.q) {
      const q = params.q.toLowerCase();
      items = items.filter((a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q));
    }
    // Sort pinned first, then newest
    return [...items].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });
  },

  async createAnnouncement(data) {
    initDemoStorage();
    const items = getStored(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const newItem = {
      _id: 'ann-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      isPinned: Boolean(data.isPinned),
      category: data.category || 'Company News',
      priority: data.priority || 'Normal',
      targetAudience: data.targetAudience || 'All Employees',
      author: data.author || 'Leadership Team',
      ...data,
    };
    items.unshift(newItem);
    setStored(STORAGE_KEYS.ANNOUNCEMENTS, items);
    return newItem;
  },

  async deleteAnnouncement(id) {
    initDemoStorage();
    let items = getStored(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    items = items.filter((a) => a._id !== id);
    setStored(STORAGE_KEYS.ANNOUNCEMENTS, items);
    return { success: true };
  },
};

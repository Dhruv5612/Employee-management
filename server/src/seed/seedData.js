import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Department } from '../models/Department.js';
import { Employee } from '../models/Employee.js';
import { User } from '../models/User.js';
import { Counter } from '../models/Counter.js';
import { AuditLog } from '../models/AuditLog.js';
import { LeaveRequest } from '../models/LeaveRequest.js';
import { Payroll } from '../models/Payroll.js';
import { Attendance } from '../models/Attendance.js';
import { Announcement } from '../models/Announcement.js';

export async function seedDatabase() {
  console.log('[Seed] Checking if database seeding is required...');

  const empCount = await Employee.countDocuments();
  const deptCount = await Department.countDocuments();

  if (empCount > 0 && deptCount > 0) {
    console.log('[Seed] Employees and departments already seeded. Skipping initial seed.');
    return;
  }

  console.log('[Seed] Seeding initial data (users, departments, employees, audit logs, counters)...');

  // 1. Seed Users (Admin, HR, Viewer) - Complying with 8+ chars, alphabet, number, special character
  const adminHash = await bcrypt.hash('Admin@123', 10);
  const hrHash = await bcrypt.hash('HrManager@123', 10);
  const viewerHash = await bcrypt.hash('Viewer@123', 10);

  let admin = await User.findOne({ email: 'admin@company.com' });
  if (!admin) {
    admin = await User.create({
      name: 'Admin User',
      email: 'admin@company.com',
      passwordHash: adminHash,
      phone: '+1 (555) 000-1111',
      role: 'Admin',
      isActive: true,
      isEmailVerified: true,
      preferences: { emailNotifications: true, compactView: false, theme: 'light' },
    });
  }

  let dhruv = await User.findOne({ email: 'dhruvkamariya1@gmail.com' });
  if (!dhruv) {
    dhruv = await User.create({
      name: 'Dhruv Patel',
      email: 'dhruvkamariya1@gmail.com',
      passwordHash: adminHash,
      phone: '+1 (555) 000-9999',
      role: 'Admin',
      isActive: true,
      isEmailVerified: true,
      preferences: { emailNotifications: true, compactView: false, theme: 'light' },
    });
  }

  let hr = await User.findOne({ email: 'hr@company.com' });
  if (!hr) {
    hr = await User.create({
      name: 'Sarah Jenkins',
      email: 'hr@company.com',
      passwordHash: hrHash,
      phone: '+1 (555) 000-2222',
      role: 'HR',
      isActive: true,
      isEmailVerified: true,
      preferences: { emailNotifications: true, compactView: false, theme: 'light' },
    });
  }

  let viewer = await User.findOne({ email: 'viewer@company.com' });
  if (!viewer) {
    viewer = await User.create({
      name: 'Alex Rivera',
      email: 'viewer@company.com',
      passwordHash: viewerHash,
      phone: '+1 (555) 000-3333',
      role: 'Viewer',
      isActive: true,
      isEmailVerified: true,
      preferences: { emailNotifications: false, compactView: false, theme: 'light' },
    });
  }

  console.log('[Seed] Users created: admin@company.com, hr@company.com, viewer@company.com');

  // 2. Seed Departments
  const departmentsData = [
    { name: 'Engineering', code: 'ENG', description: 'Core software engineering and infrastructure teams' },
    { name: 'Product Management', code: 'PROD', description: 'Product strategy, roadmap, and UX research' },
    { name: 'Human Resources', code: 'HR', description: 'Talent acquisition, employee engagement, and culture' },
    { name: 'Finance & Operations', code: 'FIN', description: 'Corporate finance, budgeting, and office operations' },
    { name: 'Marketing', code: 'MKT', description: 'Brand management, growth marketing, and communications' },
    { name: 'Customer Success', code: 'CS', description: 'Client onboarding, technical support, and retention' },
  ];

  const createdDepartments = await Department.insertMany(departmentsData);
  const deptMap = {};
  createdDepartments.forEach((d) => {
    deptMap[d.code] = d._id;
  });

  console.log(`[Seed] ${createdDepartments.length} Departments created.`);

  // 3. Reset Counter
  await Counter.findOneAndUpdate(
    { _id: 'employeeId' },
    { $set: { sequence: 1000 } },
    { upsert: true }
  );

  // 4. Seed Initial Employees
  const sampleEmployees = [
    {
      employeeId: 'EMP-001001',
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@company.com',
      phone: '+1 (555) 234-5678',
      department: deptMap['ENG'],
      designation: 'Senior Full Stack Engineer',
      joiningDate: new Date('2022-03-15'),
      status: 'Active',
    },
    {
      employeeId: 'EMP-001002',
      fullName: 'Priya Patel',
      email: 'priya.patel@company.com',
      phone: '+1 (555) 345-6789',
      department: deptMap['ENG'],
      designation: 'Staff Backend Architect',
      joiningDate: new Date('2021-08-01'),
      status: 'Active',
    },
    {
      employeeId: 'EMP-001003',
      fullName: 'David Miller',
      email: 'david.miller@company.com',
      phone: '+1 (555) 456-7890',
      department: deptMap['PROD'],
      designation: 'Lead Product Manager',
      joiningDate: new Date('2023-01-10'),
      status: 'Active',
    },
    {
      employeeId: 'EMP-001004',
      fullName: 'Emily Chen',
      email: 'emily.chen@company.com',
      phone: '+1 (555) 567-8901',
      department: deptMap['HR'],
      designation: 'Talent Acquisition Specialist',
      joiningDate: new Date('2023-06-20'),
      status: 'On Leave',
    },
    {
      employeeId: 'EMP-001005',
      fullName: 'Marcus Vance',
      email: 'marcus.vance@company.com',
      phone: '+1 (555) 678-9012',
      department: deptMap['FIN'],
      designation: 'Financial Analyst',
      joiningDate: new Date('2022-11-05'),
      status: 'Active',
    },
    {
      employeeId: 'EMP-001006',
      fullName: 'Aisha Al-Mansoor',
      email: 'aisha.m@company.com',
      phone: '+1 (555) 789-0123',
      department: deptMap['MKT'],
      designation: 'Content & Growth Strategist',
      joiningDate: new Date('2024-02-14'),
      status: 'Active',
    },
    {
      employeeId: 'EMP-001007',
      fullName: 'Carlos Rodriguez',
      email: 'carlos.r@company.com',
      phone: '+1 (555) 890-1234',
      department: deptMap['ENG'],
      designation: 'DevOps & Cloud Engineer',
      joiningDate: new Date('2020-05-18'),
      status: 'Inactive',
    },
    {
      employeeId: 'EMP-001008',
      fullName: 'Sophia Taylor',
      email: 'sophia.taylor@company.com',
      phone: '+1 (555) 901-2345',
      department: deptMap['CS'],
      designation: 'Customer Success Manager',
      joiningDate: new Date('2023-09-01'),
      status: 'Active',
    },
    {
      employeeId: 'EMP-001009',
      fullName: 'Nathaniel Wright',
      email: 'nathaniel.w@company.com',
      phone: '+1 (555) 012-3456',
      department: deptMap['ENG'],
      designation: 'Frontend UI/UX Specialist',
      joiningDate: new Date('2024-04-12'),
      status: 'Active',
    },
    {
      employeeId: 'EMP-001010',
      fullName: 'Jessica Alba-Stone',
      email: 'jessica.stone@company.com',
      phone: '+1 (555) 123-4567',
      department: deptMap['PROD'],
      designation: 'Product Designer (UI/UX)',
      joiningDate: new Date('2023-10-15'),
      status: 'Active',
    },
    {
      employeeId: 'EMP-001011',
      fullName: 'Kavita Sundaram',
      email: 'kavita.s@company.com',
      phone: '+1 (555) 234-8765',
      department: deptMap['HR'],
      designation: 'People Operations Lead',
      joiningDate: new Date('2021-12-01'),
      status: 'Active',
    },
    {
      employeeId: 'EMP-001012',
      fullName: 'Liam O’Connor',
      email: 'liam.oconnor@company.com',
      phone: '+1 (555) 345-9876',
      department: deptMap['ENG'],
      designation: 'QA Automation Lead',
      joiningDate: new Date('2022-07-25'),
      status: 'On Leave',
    },
  ];

  const createdEmployees = await Employee.insertMany(sampleEmployees);

  // Assign department managers
  const rahul = createdEmployees.find((e) => e.email === 'rahul.sharma@company.com');
  const david = createdEmployees.find((e) => e.email === 'david.miller@company.com');
  const kavita = createdEmployees.find((e) => e.email === 'kavita.s@company.com');

  if (rahul) await Department.findByIdAndUpdate(deptMap['ENG'], { manager: rahul._id });
  if (david) await Department.findByIdAndUpdate(deptMap['PROD'], { manager: david._id });
  if (kavita) await Department.findByIdAndUpdate(deptMap['HR'], { manager: kavita._id });

  // Update sequence
  await Counter.findOneAndUpdate(
    { _id: 'employeeId' },
    { $set: { sequence: 1012 } }
  );

  // Seed sample Audit Logs
  await AuditLog.insertMany([
    {
      actor: admin._id,
      action: 'SYSTEM_INITIALIZED',
      entityType: 'System',
      entityId: admin._id,
      changes: { description: 'Enterprise workspace configured' },
      createdAt: new Date(Date.now() - 3600000 * 24),
    },
    {
      actor: hr._id,
      action: 'EMPLOYEE_CREATED',
      entityType: 'Employee',
      entityId: rahul?._id || admin._id,
      changes: { fullName: 'Rahul Sharma', employeeId: 'EMP-001001' },
      createdAt: new Date(Date.now() - 3600000 * 12),
    },
    {
      actor: admin._id,
      action: 'DEPARTMENT_CREATED',
      entityType: 'Department',
      entityId: deptMap['ENG'],
      changes: { name: 'Engineering', code: 'ENG' },
      createdAt: new Date(Date.now() - 3600000 * 8),
    },
    {
      actor: hr._id,
      action: 'EMPLOYEE_STATUS_UPDATED',
      entityType: 'Employee',
      entityId: createdEmployees[3]?._id || admin._id,
      changes: { status: { from: 'Active', to: 'On Leave' } },
      createdAt: new Date(Date.now() - 3600000 * 2),
    },
  ]);

  // Seed Leaves
  await LeaveRequest.insertMany([
    {
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
  ]);

  // Seed Payroll
  await Payroll.insertMany([
    {
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
  ]);

  // Seed Attendance for today
  await Attendance.insertMany([
    {
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
      employeeId: 'EMP-001005',
      employeeName: 'Marcus Vance',
      department: 'Finance & Operations',
      date: '2026-10-28',
      status: 'Half Day',
      checkIn: '09:00 AM',
      checkOut: '01:30 PM',
      notes: 'Approved afternoon personal time',
    },
  ]);

  // Seed Announcements
  await Announcement.insertMany([
    {
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
  ]);

  console.log(`[Seed] Initial data, managers, audit logs, leaves, payroll, attendance, and announcements created successfully.`);
}

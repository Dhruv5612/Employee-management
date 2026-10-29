import request from 'supertest';
import app from '../src/app.js';
import { connectDatabase, closeDatabase } from '../src/config/database.js';
import { Department } from '../src/models/Department.js';
import { Employee } from '../src/models/Employee.js';
import { User } from '../src/models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Dashboard API Tests', () => {
  let userToken;

  beforeAll(async () => {
    await connectDatabase();
    await Employee.deleteMany({});
    await Department.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('viewer123', 10);
    const user = await User.create({
      name: 'Viewer',
      email: 'viewer_dash@comp.com',
      passwordHash,
      role: 'Viewer',
    });

    const secret = process.env.JWT_ACCESS_SECRET || 'super_secure_jwt_secret_key_emp_mgmt_2026_xyz';
    userToken = jwt.sign({ id: user._id, role: 'Viewer' }, secret);

    const deptA = await Department.create({ name: 'IT Ops', code: 'ITOPS' });
    const deptEmpty = await Department.create({ name: 'R&D', code: 'RND' });

    await Employee.create([
      {
        employeeId: 'EMP-000001',
        fullName: 'Alex Smith',
        email: 'alex@company.com',
        phone: '+1 555-111-2222',
        department: deptA._id,
        designation: 'Sysadmin',
        joiningDate: new Date('2023-01-01'),
        status: 'Active',
      },
      {
        employeeId: 'EMP-000002',
        fullName: 'Jordan Lee',
        email: 'jordan@company.com',
        phone: '+1 555-333-4444',
        department: deptA._id,
        designation: 'Support Tech',
        joiningDate: new Date('2023-02-01'),
        status: 'On Leave',
      },
    ]);
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('should calculate overall dashboard statistics accurately', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/stats')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalEmployees).toBe(2);
    expect(res.body.data.activeEmployees).toBe(1);
    expect(res.body.data.onLeaveEmployees).toBe(1);
    expect(res.body.data.inactiveEmployees).toBe(0);
    expect(res.body.data.totalDepartments).toBe(2);
  });

  it('should include empty departments with 0 count in distribution', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/departments')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);

    const rnd = res.body.data.find((d) => d.departmentCode === 'RND');
    expect(rnd).toBeDefined();
    expect(rnd.employeeCount).toBe(0);

    const itOps = res.body.data.find((d) => d.departmentCode === 'ITOPS');
    expect(itOps).toBeDefined();
    expect(itOps.employeeCount).toBe(2);
  });
});

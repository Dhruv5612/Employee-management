import request from 'supertest';
import app from '../src/app.js';
import { connectDatabase, closeDatabase } from '../src/config/database.js';
import { Department } from '../src/models/Department.js';
import { Employee } from '../src/models/Employee.js';
import { User } from '../src/models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Employee API Tests', () => {
  let adminToken;
  let testDepartment;

  beforeAll(async () => {
    await connectDatabase();
    await Employee.deleteMany({});
    await Department.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin_test@emp.com',
      passwordHash,
      role: 'Admin',
    });

    const secret = process.env.JWT_ACCESS_SECRET || 'super_secure_jwt_secret_key_emp_mgmt_2026_xyz';
    adminToken = jwt.sign({ id: adminUser._id, role: 'Admin' }, secret);

    testDepartment = await Department.create({
      name: 'Software Engineering',
      code: 'SWE',
      description: 'Software Engineering department',
    });
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('should create an employee with auto-generated employeeId', async () => {
    const res = await request(app)
      .post('/api/v1/employees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fullName: 'Jane Doe',
        email: 'jane.doe@company.com',
        phone: '+1 555-123-4567',
        department: testDepartment._id.toString(),
        designation: 'Senior Developer',
        joiningDate: '2023-01-15',
        status: 'Active',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.employeeId).toMatch(/^EMP-\d{6}$/);
    expect(res.body.data.fullName).toBe('Jane Doe');
    expect(res.body.data.email).toBe('jane.doe@company.com');
  });

  it('should reject employee with duplicate email address', async () => {
    const res = await request(app)
      .post('/api/v1/employees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fullName: 'Jane Twin',
        email: 'JANE.DOE@company.com', // test case-insensitive normalization
        phone: '+1 555-987-6543',
        department: testDepartment._id.toString(),
        designation: 'Software Engineer',
        joiningDate: '2023-02-01',
        status: 'Active',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should reject employee with future joining date', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const res = await request(app)
      .post('/api/v1/employees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fullName: 'Time Traveler',
        email: 'future@company.com',
        phone: '+1 555-000-1111',
        department: testDepartment._id.toString(),
        designation: 'Futurist',
        joiningDate: futureDate.toISOString().split('T')[0],
        status: 'Active',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should filter employees by status and search query', async () => {
    const res = await request(app)
      .get('/api/v1/employees?q=Jane&status=Active&page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.pagination.totalRecords).toBe(1);
  });
});

import request from 'supertest';
import app from '../src/app.js';
import { connectDatabase, closeDatabase } from '../src/config/database.js';
import { Department } from '../src/models/Department.js';
import { Employee } from '../src/models/Employee.js';
import { User } from '../src/models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Department API Tests', () => {
  let adminToken;
  let viewerToken;

  beforeAll(async () => {
    await connectDatabase();
    await Department.deleteMany({});
    await Employee.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin_test@dept.com',
      passwordHash,
      role: 'Admin',
    });

    const viewerUser = await User.create({
      name: 'Viewer',
      email: 'viewer_test@dept.com',
      passwordHash,
      role: 'Viewer',
    });

    const secret = process.env.JWT_ACCESS_SECRET || 'super_secure_jwt_secret_key_emp_mgmt_2026_xyz';
    adminToken = jwt.sign({ id: adminUser._id, role: 'Admin' }, secret);
    viewerToken = jwt.sign({ id: viewerUser._id, role: 'Viewer' }, secret);
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('should create a department successfully as Admin', async () => {
    const res = await request(app)
      .post('/api/v1/departments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Design',
        code: 'DSGN',
        description: 'Design and User Experience',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Design');
    expect(res.body.data.code).toBe('DSGN');
  });

  it('should reject department creation with duplicate code', async () => {
    const res = await request(app)
      .post('/api/v1/departments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Different Name',
        code: 'DSGN',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should forbid department creation for Viewer role', async () => {
    const res = await request(app)
      .post('/api/v1/departments')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({
        name: 'Legal',
        code: 'LGL',
      });

    expect(res.status).toBe(403);
  });

  it('should list all departments including employee counts', async () => {
    const res = await request(app)
      .get('/api/v1/departments')
      .set('Authorization', `Bearer ${viewerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

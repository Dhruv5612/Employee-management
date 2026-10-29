import { Router } from 'express';
import authRoutes from './authRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import departmentRoutes from './departmentRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import auditLogRoutes from './auditLogRoutes.js';
import reportRoutes from './reportRoutes.js';
import leaveRoutes from './leaveRoutes.js';
import payrollRoutes from './payrollRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import announcementRoutes from './announcementRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/reports', reportRoutes);
router.use('/leaves', leaveRoutes);
router.use('/payroll', payrollRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/announcements', announcementRoutes);

export default router;

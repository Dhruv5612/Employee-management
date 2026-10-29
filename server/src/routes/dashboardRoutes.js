import { Router } from 'express';
import {
  getDashboardStats,
  getDepartmentDistribution,
  getStatusDistribution,
} from '../controllers/dashboardController.js';
import { getRecentActivities } from '../controllers/auditLogController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/stats', authenticate, getDashboardStats);
router.get('/departments', authenticate, getDepartmentDistribution);
router.get('/status', authenticate, getStatusDistribution);
router.get('/activities', authenticate, getRecentActivities);

export default router;

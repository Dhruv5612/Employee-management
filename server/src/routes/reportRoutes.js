import { Router } from 'express';
import { getReportSummary, exportEmployees } from '../controllers/reportController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

// Reports are accessible by Admin and HR
router.get('/summary', authenticate, authorize('Admin', 'HR'), getReportSummary);
router.get('/export', authenticate, authorize('Admin', 'HR'), exportEmployees);

export default router;

import { Router } from 'express';
import { listAuditLogs } from '../controllers/auditLogController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

// Only Admin (or authorized auditors) can view complete activity/audit logs
router.get('/', authenticate, authorize('Admin'), listAuditLogs);

export default router;

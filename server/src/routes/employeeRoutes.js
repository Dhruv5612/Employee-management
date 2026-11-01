import { Router } from 'express';
import {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
} from '../controllers/employeeController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateStatusSchema,
} from '../validators/employeeValidator.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

// Read operations - accessible by Admin, HR, and Viewer
router.get('/', authenticate, listEmployees);
router.get('/:id', authenticate, getEmployee);

// Mutation operations
router.post(
  '/',
  authenticate,
  authorize('Admin', 'HR'),
  validateRequest(createEmployeeSchema),
  createEmployee
);

router.patch(
  '/:id',
  authenticate,
  authorize('Admin', 'HR'),
  validateRequest(updateEmployeeSchema),
  updateEmployee
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('Admin', 'HR'),
  validateRequest(updateStatusSchema),
  updateEmployeeStatus
);

router.delete('/:id', authenticate, authorize('Admin'), deleteEmployee);

export default router;

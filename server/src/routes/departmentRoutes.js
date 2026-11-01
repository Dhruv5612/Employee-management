import { Router } from 'express';
import {
  listDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  reassignEmployees,
} from '../controllers/departmentController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  reassignEmployeesSchema,
} from '../validators/departmentValidator.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

// Department list and details are viewable by all authenticated users
router.get('/', authenticate, listDepartments);
router.get('/:id', authenticate, getDepartment);

// Mutations
router.post(
  '/',
  authenticate,
  authorize('Admin', 'HR'),
  validateRequest(createDepartmentSchema),
  createDepartment
);

router.patch(
  '/:id',
  authenticate,
  authorize('Admin', 'HR'),
  validateRequest(updateDepartmentSchema),
  updateDepartment
);

router.delete('/:id', authenticate, authorize('Admin'), deleteDepartment);

router.post(
  '/:id/reassign-employees',
  authenticate,
  authorize('Admin', 'HR'),
  validateRequest(reassignEmployeesSchema),
  reassignEmployees
);

export default router;

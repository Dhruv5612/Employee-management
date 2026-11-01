import { DepartmentService } from '../services/departmentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listDepartments = asyncHandler(async (req, res) => {
  const departments = await DepartmentService.listDepartments();
  res.status(200).json({
    success: true,
    data: departments,
  });
});

export const getDepartment = asyncHandler(async (req, res) => {
  const department = await DepartmentService.getDepartmentById(req.params.id);
  res.status(200).json({
    success: true,
    data: department,
  });
});

export const createDepartment = asyncHandler(async (req, res) => {
  const department = await DepartmentService.createDepartment(req.body, req.user?._id);
  res.status(201).json({
    success: true,
    message: 'Department created successfully',
    data: department,
  });
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const department = await DepartmentService.updateDepartment(req.params.id, req.body, req.user?._id);
  res.status(200).json({
    success: true,
    message: 'Department updated successfully',
    data: department,
  });
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  await DepartmentService.deleteDepartment(req.params.id, req.user?._id);
  res.status(200).json({
    success: true,
    message: 'Department deleted successfully',
  });
});

export const reassignEmployees = asyncHandler(async (req, res) => {
  const { targetDepartmentId } = req.body;
  const result = await DepartmentService.reassignEmployees(
    req.params.id,
    targetDepartmentId,
    req.user?._id
  );
  res.status(200).json({
    success: true,
    message: `Successfully reassigned ${result.reassignedCount} employees to ${result.toDepartment}`,
    data: result,
  });
});

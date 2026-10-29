import { EmployeeService } from '../services/employeeService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listEmployees = asyncHandler(async (req, res) => {
  const { employees, pagination } = await EmployeeService.listEmployees(req.query);
  res.status(200).json({
    success: true,
    data: employees,
    pagination,
  });
});

export const getEmployee = asyncHandler(async (req, res) => {
  const employee = await EmployeeService.getEmployeeById(req.params.id);
  res.status(200).json({
    success: true,
    data: employee,
  });
});

export const createEmployee = asyncHandler(async (req, res) => {
  const employee = await EmployeeService.createEmployee(req.body, req.user?._id);
  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: employee,
  });
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await EmployeeService.updateEmployee(req.params.id, req.body, req.user?._id);
  res.status(200).json({
    success: true,
    message: 'Employee updated successfully',
    data: employee,
  });
});

export const updateEmployeeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const employee = await EmployeeService.updateStatus(req.params.id, status, req.user?._id);
  res.status(200).json({
    success: true,
    message: `Status updated to ${status} successfully`,
    data: employee,
  });
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  await EmployeeService.deleteEmployee(req.params.id, req.user?._id);
  res.status(200).json({
    success: true,
    message: 'Employee deleted successfully',
  });
});

import { Employee } from '../models/Employee.js';
import { Department } from '../models/Department.js';
import { AuditLog } from '../models/AuditLog.js';
import { ApiError } from '../utils/ApiError.js';
import { generateEmployeeId } from '../utils/generateEmployeeId.js';
import { parsePaginationParams } from '../utils/pagination.js';
import mongoose from 'mongoose';

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export class EmployeeService {
  static async listEmployees(query) {
    const { page, limit, skip } = parsePaginationParams(query);
    const filter = {};

    // 1. Text search across name, email, employeeId
    if (query.q && query.q.trim()) {
      const qEscaped = escapeRegex(query.q.trim());
      filter.$or = [
        { fullName: { $regex: qEscaped, $options: 'i' } },
        { email: { $regex: qEscaped, $options: 'i' } },
        { employeeId: { $regex: qEscaped, $options: 'i' } },
      ];
    }

    // 2. Department filter
    if (query.department && query.department.trim()) {
      if (mongoose.Types.ObjectId.isValid(query.department.trim())) {
        filter.department = new mongoose.Types.ObjectId(query.department.trim());
      }
    }

    // 3. Status filter
    if (query.status && ['Active', 'Inactive', 'On Leave'].includes(query.status)) {
      filter.status = query.status;
    }

    // 4. Sorting with deterministic secondary sort
    const sortFieldMap = {
      name: 'fullName',
      joiningDate: 'joiningDate',
      employeeId: 'employeeId',
      createdAt: 'createdAt',
    };

    const sortBy = sortFieldMap[query.sortBy] || 'createdAt';
    const sortOrder = query.order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder, _id: 1 };

    // 5. Query execution & total count
    const [totalRecords, employees] = await Promise.all([
      Employee.countDocuments(filter),
      Employee.find(filter)
        .populate('department', 'name code')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalRecords / limit) || 0;

    return {
      employees,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
      },
    };
  }

  static async getEmployeeById(id) {
    let employee = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id).populate('department', 'name code description');
    }
    if (!employee) {
      // Also allow lookup by employeeId like "EMP-000001"
      employee = await Employee.findOne({ employeeId: id }).populate('department', 'name code description');
    }

    if (!employee) {
      throw ApiError.notFound('Employee not found');
    }

    return employee;
  }

  static async createEmployee(data, actorId) {
    // 1. Verify department exists
    const department = await Department.findById(data.department);
    if (!department) {
      throw ApiError.badRequest('Referenced department does not exist', [
        { field: 'department', message: 'Department not found' },
      ]);
    }

    // 2. Normalize and check unique email
    const normalizedEmail = data.email.trim().toLowerCase();
    const existingEmail = await Employee.findOne({ email: normalizedEmail });
    if (existingEmail) {
      throw ApiError.conflict('Email address is already registered', [
        { field: 'email', message: 'Email address is already in use by another employee' },
      ]);
    }

    // 3. Generate unique atomic employeeId
    const employeeId = await generateEmployeeId();

    // 4. Create record
    const employee = await Employee.create({
      employeeId,
      fullName: data.fullName.trim(),
      email: normalizedEmail,
      phone: data.phone.trim(),
      department: data.department,
      designation: data.designation.trim(),
      joiningDate: new Date(data.joiningDate),
      status: data.status || 'Active',
    });

    const populatedEmployee = await Employee.findById(employee._id).populate('department', 'name code');

    // 5. Audit log
    if (actorId) {
      await AuditLog.create({
        actor: actorId,
        action: 'EMPLOYEE_CREATED',
        entityType: 'Employee',
        entityId: employee._id,
        changes: { created: employee.toObject() },
      });
    }

    return populatedEmployee;
  }

  static async updateEmployee(id, data, actorId) {
    const employee = await Employee.findById(id);
    if (!employee) {
      throw ApiError.notFound('Employee not found');
    }

    const changes = {};

    // 1. Check department if updated
    if (data.department && data.department.toString() !== employee.department.toString()) {
      const department = await Department.findById(data.department);
      if (!department) {
        throw ApiError.badRequest('Referenced department does not exist', [
          { field: 'department', message: 'Department not found' },
        ]);
      }
      changes.department = { from: employee.department, to: data.department };
      employee.department = data.department;
    }

    // 2. Check email if updated
    if (data.email) {
      const normalizedEmail = data.email.trim().toLowerCase();
      if (normalizedEmail !== employee.email) {
        const existingEmail = await Employee.findOne({ email: normalizedEmail, _id: { $ne: id } });
        if (existingEmail) {
          throw ApiError.conflict('Email address is already registered', [
            { field: 'email', message: 'Email address is already in use by another employee' },
          ]);
        }
        changes.email = { from: employee.email, to: normalizedEmail };
        employee.email = normalizedEmail;
      }
    }

    if (data.fullName) {
      employee.fullName = data.fullName.trim();
    }
    if (data.phone) {
      employee.phone = data.phone.trim();
    }
    if (data.designation) {
      employee.designation = data.designation.trim();
    }
    if (data.joiningDate) {
      employee.joiningDate = new Date(data.joiningDate);
    }
    if (data.status) {
      if (employee.status !== data.status) {
        changes.status = { from: employee.status, to: data.status };
      }
      employee.status = data.status;
    }

    await employee.save();

    const updatedEmployee = await Employee.findById(id).populate('department', 'name code');

    // Audit log
    if (actorId) {
      await AuditLog.create({
        actor: actorId,
        action: 'EMPLOYEE_UPDATED',
        entityType: 'Employee',
        entityId: id,
        changes,
      });
    }

    return updatedEmployee;
  }

  static async updateStatus(id, newStatus, actorId) {
    const employee = await Employee.findById(id);
    if (!employee) {
      throw ApiError.notFound('Employee not found');
    }

    const previousStatus = employee.status;
    employee.status = newStatus;
    await employee.save();

    const updated = await Employee.findById(id).populate('department', 'name code');

    if (actorId) {
      await AuditLog.create({
        actor: actorId,
        action: 'EMPLOYEE_STATUS_UPDATED',
        entityType: 'Employee',
        entityId: id,
        changes: {
          status: {
            from: previousStatus,
            to: newStatus,
          },
        },
      });
    }

    return updated;
  }

  static async deleteEmployee(id, actorId) {
    const employee = await Employee.findById(id);
    if (!employee) {
      throw ApiError.notFound('Employee not found');
    }

    await Employee.findByIdAndDelete(id);

    if (actorId) {
      await AuditLog.create({
        actor: actorId,
        action: 'EMPLOYEE_DELETED',
        entityType: 'Employee',
        entityId: id,
        changes: {
          deleted: {
            employeeId: employee.employeeId,
            fullName: employee.fullName,
            email: employee.email,
          },
        },
      });
    }

    return { message: 'Employee deleted successfully' };
  }
}

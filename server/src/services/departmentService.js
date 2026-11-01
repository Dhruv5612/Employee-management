import { Department } from '../models/Department.js';
import { Employee } from '../models/Employee.js';
import { AuditLog } from '../models/AuditLog.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';

export class DepartmentService {
  static async listDepartments() {
    const departments = await Department.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: 'department',
          as: 'employees',
        },
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'manager',
          foreignField: '_id',
          as: 'managerInfo',
        },
      },
      {
        $unwind: {
          path: '$managerInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          code: 1,
          description: 1,
          manager: {
            $cond: {
              if: '$managerInfo._id',
              then: {
                _id: '$managerInfo._id',
                fullName: '$managerInfo.fullName',
                email: '$managerInfo.email',
                designation: '$managerInfo.designation',
                employeeId: '$managerInfo.employeeId',
              },
              else: null,
            },
          },
          createdAt: 1,
          updatedAt: 1,
          employeeCount: { $size: '$employees' },
        },
      },
      { $sort: { name: 1 } },
    ]);

    return departments;
  }

  static async getDepartmentById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid department ID format');
    }

    const department = await Department.findById(id).populate(
      'manager',
      'fullName email designation employeeId'
    );
    if (!department) {
      throw ApiError.notFound('Department not found');
    }

    const employeeCount = await Employee.countDocuments({ department: id });

    return {
      ...department.toObject(),
      employeeCount,
    };
  }

  static async createDepartment(data, actorId) {
    const existingName = await Department.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, 'i') },
    });
    if (existingName) {
      throw ApiError.conflict(`Department with name "${data.name}" already exists`, [
        { field: 'name', message: 'Department name already exists' },
      ]);
    }

    const existingCode = await Department.findOne({ code: data.code.trim().toUpperCase() });
    if (existingCode) {
      throw ApiError.conflict(`Department code "${data.code}" already exists`, [
        { field: 'code', message: 'Department code already exists' },
      ]);
    }

    const department = await Department.create({
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      description: data.description ? data.description.trim() : '',
      manager: data.manager || null,
    });

    if (actorId) {
      await AuditLog.create({
        actor: actorId,
        action: 'DEPARTMENT_CREATED',
        entityType: 'Department',
        entityId: department._id,
        changes: { created: department.toObject() },
      });
    }

    return this.getDepartmentById(department._id);
  }

  static async updateDepartment(id, data, actorId) {
    const department = await Department.findById(id);
    if (!department) {
      throw ApiError.notFound('Department not found');
    }

    if (data.name && data.name.trim().toLowerCase() !== department.name.toLowerCase()) {
      const existing = await Department.findOne({
        name: { $regex: new RegExp(`^${data.name.trim()}$`, 'i') },
        _id: { $ne: id },
      });
      if (existing) {
        throw ApiError.conflict(`Department name "${data.name}" already exists`, [
          { field: 'name', message: 'Department name already exists' },
        ]);
      }
      department.name = data.name.trim();
    }

    if (data.code && data.code.trim().toUpperCase() !== department.code) {
      const existing = await Department.findOne({
        code: data.code.trim().toUpperCase(),
        _id: { $ne: id },
      });
      if (existing) {
        throw ApiError.conflict(`Department code "${data.code}" already exists`, [
          { field: 'code', message: 'Department code already exists' },
        ]);
      }
      department.code = data.code.trim().toUpperCase();
    }

    if (data.description !== undefined) {
      department.description = data.description.trim();
    }

    if (data.manager !== undefined) {
      department.manager = data.manager || null;
    }

    await department.save();

    if (actorId) {
      await AuditLog.create({
        actor: actorId,
        action: 'DEPARTMENT_UPDATED',
        entityType: 'Department',
        entityId: department._id,
        changes: data,
      });
    }

    return this.getDepartmentById(id);
  }

  static async deleteDepartment(id, actorId) {
    const department = await Department.findById(id);
    if (!department) {
      throw ApiError.notFound('Department not found');
    }

    const employeeCount = await Employee.countDocuments({ department: id });
    if (employeeCount > 0) {
      throw ApiError.conflict(
        `Cannot delete department "${department.name}" because it currently has ${employeeCount} assigned employee(s). Please reassign them first.`,
        [
          {
            field: 'department',
            message: `Department has ${employeeCount} active assignments. Reassignment required before deletion.`,
          },
        ]
      );
    }

    await Department.findByIdAndDelete(id);

    if (actorId) {
      await AuditLog.create({
        actor: actorId,
        action: 'DEPARTMENT_DELETED',
        entityType: 'Department',
        entityId: id,
        changes: { deleted: department.toObject() },
      });
    }

    return { message: 'Department deleted successfully' };
  }

  static async reassignEmployees(fromDepartmentId, toDepartmentId, actorId) {
    if (fromDepartmentId === toDepartmentId) {
      throw ApiError.badRequest('Source and target department cannot be the same');
    }

    const sourceDept = await Department.findById(fromDepartmentId);
    if (!sourceDept) {
      throw ApiError.notFound('Source department not found');
    }

    const targetDept = await Department.findById(toDepartmentId);
    if (!targetDept) {
      throw ApiError.notFound('Target department not found');
    }

    const updateResult = await Employee.updateMany(
      { department: fromDepartmentId },
      { $set: { department: toDepartmentId } }
    );

    if (actorId) {
      await AuditLog.create({
        actor: actorId,
        action: 'DEPARTMENT_EMPLOYEES_REASSIGNED',
        entityType: 'Department',
        entityId: fromDepartmentId,
        changes: {
          toDepartmentId,
          reassignedCount: updateResult.modifiedCount,
        },
      });
    }

    return {
      reassignedCount: updateResult.modifiedCount,
      fromDepartment: sourceDept.name,
      toDepartment: targetDept.name,
    };
  }
}

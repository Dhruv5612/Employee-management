import { Employee } from '../models/Employee.js';
import { Department } from '../models/Department.js';
import mongoose from 'mongoose';

export class ReportService {
  static async getSummaryReport(query = {}) {
    const filter = {};

    if (query.department && mongoose.Types.ObjectId.isValid(query.department)) {
      filter.department = new mongoose.Types.ObjectId(query.department);
    }

    if (query.status && ['Active', 'Inactive', 'On Leave'].includes(query.status)) {
      filter.status = query.status;
    }

    if (query.startDate || query.endDate) {
      filter.joiningDate = {};
      if (query.startDate) filter.joiningDate.$gte = new Date(query.startDate);
      if (query.endDate) filter.joiningDate.$lte = new Date(query.endDate);
    }

    const [totalEmployees, statusBreakdown, deptBreakdown] = await Promise.all([
      Employee.countDocuments(filter),
      Employee.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Employee.aggregate([
        { $match: filter },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'departments',
            localField: '_id',
            foreignField: '_id',
            as: 'dept',
          },
        },
        { $unwind: { path: '$dept', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            departmentName: { $ifNull: ['$dept.name', 'Unassigned'] },
            departmentCode: { $ifNull: ['$dept.code', 'NA'] },
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    return {
      totalEmployees,
      statusBreakdown: statusBreakdown.map((s) => ({ status: s._id, count: s.count })),
      deptBreakdown,
    };
  }

  static async getExportData(query = {}) {
    const filter = {};

    if (query.department && mongoose.Types.ObjectId.isValid(query.department)) {
      filter.department = new mongoose.Types.ObjectId(query.department);
    }

    if (query.status && ['Active', 'Inactive', 'On Leave'].includes(query.status)) {
      filter.status = query.status;
    }

    if (query.startDate || query.endDate) {
      filter.joiningDate = {};
      if (query.startDate) filter.joiningDate.$gte = new Date(query.startDate);
      if (query.endDate) filter.joiningDate.$lte = new Date(query.endDate);
    }

    const employees = await Employee.find(filter)
      .populate('department', 'name code')
      .sort({ employeeId: 1 })
      .lean();

    return employees.map((emp) => ({
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      email: emp.email,
      phone: emp.phone,
      department: emp.department?.name || 'Unassigned',
      departmentCode: emp.department?.code || '',
      designation: emp.designation,
      joiningDate: emp.joiningDate ? emp.joiningDate.toISOString().split('T')[0] : '',
      status: emp.status,
      createdAt: emp.createdAt ? emp.createdAt.toISOString() : '',
    }));
  }
}

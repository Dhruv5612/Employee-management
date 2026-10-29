import { Employee } from '../models/Employee.js';
import { Department } from '../models/Department.js';

export class DashboardService {
  static async getStats() {
    const [totalEmployees, activeEmployees, inactiveEmployees, onLeaveEmployees, totalDepartments] =
      await Promise.all([
        Employee.countDocuments(),
        Employee.countDocuments({ status: 'Active' }),
        Employee.countDocuments({ status: 'Inactive' }),
        Employee.countDocuments({ status: 'On Leave' }),
        Department.countDocuments(),
      ]);

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      onLeaveEmployees,
      totalDepartments,
    };
  }

  static async getDepartmentDistribution() {
    // Start with departments to include empty departments (0 count)
    const distribution = await Department.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: 'department',
          as: 'deptEmployees',
        },
      },
      {
        $project: {
          _id: 0,
          departmentId: '$_id',
          departmentName: '$name',
          departmentCode: '$code',
          employeeCount: { $size: '$deptEmployees' },
        },
      },
      {
        $sort: { departmentName: 1 },
      },
    ]);

    return distribution;
  }

  static async getStatusDistribution() {
    const statuses = await Employee.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusMap = {
      Active: 0,
      Inactive: 0,
      'On Leave': 0,
    };

    statuses.forEach((s) => {
      if (statusMap[s._id] !== undefined) {
        statusMap[s._id] = s.count;
      }
    });

    return [
      { status: 'Active', count: statusMap.Active },
      { status: 'Inactive', count: statusMap.Inactive },
      { status: 'On Leave', count: statusMap['On Leave'] },
    ];
  }
}

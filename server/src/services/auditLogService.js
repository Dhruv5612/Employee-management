import { AuditLog } from '../models/AuditLog.js';
import { parsePaginationParams } from '../utils/pagination.js';

export class AuditLogService {
  static async listAuditLogs(query = {}) {
    const { page, limit, skip } = parsePaginationParams(query);
    const filter = {};

    if (query.entityType) {
      filter.entityType = query.entityType;
    }

    if (query.action) {
      filter.action = query.action;
    }

    const [totalRecords, logs] = await Promise.all([
      AuditLog.countDocuments(filter),
      AuditLog.find(filter)
        .populate('actor', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalRecords / limit) || 0;

    return {
      logs,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
      },
    };
  }

  static async getRecentActivities(limit = 8) {
    const activities = await AuditLog.find()
      .populate('actor', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return activities;
  }
}

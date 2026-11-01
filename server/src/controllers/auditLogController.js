import { AuditLogService } from '../services/auditLogService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listAuditLogs = asyncHandler(async (req, res) => {
  const result = await AuditLogService.listAuditLogs(req.query);
  res.status(200).json({
    success: true,
    data: result.logs,
    pagination: result.pagination,
  });
});

export const getRecentActivities = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const activities = await AuditLogService.getRecentActivities(limit);
  res.status(200).json({
    success: true,
    data: activities,
  });
});

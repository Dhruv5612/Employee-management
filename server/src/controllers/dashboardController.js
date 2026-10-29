import { DashboardService } from '../services/dashboardService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await DashboardService.getStats();
  res.status(200).json({
    success: true,
    data: stats,
  });
});

export const getDepartmentDistribution = asyncHandler(async (req, res) => {
  const distribution = await DashboardService.getDepartmentDistribution();
  res.status(200).json({
    success: true,
    data: distribution,
  });
});

export const getStatusDistribution = asyncHandler(async (req, res) => {
  const statusStats = await DashboardService.getStatusDistribution();
  res.status(200).json({
    success: true,
    data: statusStats,
  });
});

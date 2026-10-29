import apiClient, { isDemoMode, mockAdapter } from '../../services/apiClient.js';

export const dashboardApi = {
  async getStats() {
    if (isDemoMode()) {
      return mockAdapter.getDashboardStats();
    }
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.getDashboardStats();
      }
      throw err;
    }
  },

  async getDepartmentDistribution() {
    if (isDemoMode()) {
      return mockAdapter.getDepartmentDistribution();
    }
    try {
      const response = await apiClient.get('/dashboard/departments');
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.getDepartmentDistribution();
      }
      throw err;
    }
  },

  async getStatusDistribution() {
    if (isDemoMode()) {
      return mockAdapter.getStatusDistribution();
    }
    try {
      const response = await apiClient.get('/dashboard/status');
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.getStatusDistribution();
      }
      throw err;
    }
  },

  async getActivities() {
    if (isDemoMode()) {
      return mockAdapter.getRecentActivities();
    }
    try {
      const response = await apiClient.get('/dashboard/activities');
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.getRecentActivities();
      }
      throw err;
    }
  },
};

import apiClient, { isDemoMode, mockAdapter } from '../../../services/apiClient.js';

export const reportApi = {
  async getSummary(params = {}) {
    if (isDemoMode()) {
      return mockAdapter.getReportSummary(params);
    }
    try {
      const response = await apiClient.get('/reports/summary', { params });
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.getReportSummary(params);
      }
      throw err;
    }
  },

  async exportEmployees(params = {}) {
    if (isDemoMode()) {
      return mockAdapter.exportEmployees(params);
    }
    try {
      const response = await apiClient.get('/reports/export', { params });
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.exportEmployees(params);
      }
      throw err;
    }
  },
};

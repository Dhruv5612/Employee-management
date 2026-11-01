import apiClient, { isDemoMode, mockAdapter } from '../../../services/apiClient.js';

export const auditLogApi = {
  async listLogs(params = {}) {
    if (isDemoMode()) {
      return mockAdapter.listAuditLogs(params);
    }
    try {
      const response = await apiClient.get('/audit-logs', { params });
      return {
        logs: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (err) {
      if (!err.response) {
        return mockAdapter.listAuditLogs(params);
      }
      throw err;
    }
  },
};

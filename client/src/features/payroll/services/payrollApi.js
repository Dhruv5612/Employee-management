import apiClient, { isDemoMode, mockAdapter } from '../../../services/apiClient.js';

export const payrollApi = {
  async listPayroll(params = {}) {
    if (isDemoMode()) {
      return mockAdapter.listPayroll(params);
    }
    try {
      const response = await apiClient.get('/payroll', { params });
      return response.data.data;
    } catch (err) {
      return mockAdapter.listPayroll(params);
    }
  },

  async getPayrollStats() {
    if (isDemoMode()) {
      return mockAdapter.getPayrollStats();
    }
    try {
      const response = await apiClient.get('/payroll/stats');
      return response.data.data;
    } catch (err) {
      return mockAdapter.getPayrollStats();
    }
  },

  async createPayroll(data) {
    if (isDemoMode()) {
      return mockAdapter.createPayroll(data);
    }
    try {
      const response = await apiClient.post('/payroll', data);
      return response.data.data;
    } catch (err) {
      return mockAdapter.createPayroll(data);
    }
  },

  async updatePayrollStatus(id, updates) {
    if (isDemoMode()) {
      return mockAdapter.updatePayrollStatus(id, updates);
    }
    try {
      const response = await apiClient.patch(`/payroll/${id}/status`, updates);
      return response.data.data;
    } catch (err) {
      return mockAdapter.updatePayrollStatus(id, updates);
    }
  },

  async deletePayroll(id) {
    if (isDemoMode()) {
      return mockAdapter.deletePayroll(id);
    }
    try {
      const response = await apiClient.delete(`/payroll/${id}`);
      return response.data;
    } catch (err) {
      return mockAdapter.deletePayroll(id);
    }
  },
};


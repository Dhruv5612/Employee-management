import apiClient, { isDemoMode, mockAdapter } from '../../../services/apiClient.js';

export const employeeApi = {
  async listEmployees(params = {}) {
    if (isDemoMode()) {
      return mockAdapter.listEmployees(params);
    }
    try {
      const response = await apiClient.get('/employees', { params });
      return {
        employees: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (err) {
      if (!err.response) {
        return mockAdapter.listEmployees(params);
      }
      throw err;
    }
  },

  async getEmployee(id) {
    if (isDemoMode()) {
      return mockAdapter.getEmployeeById(id);
    }
    try {
      const response = await apiClient.get(`/employees/${id}`);
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.getEmployeeById(id);
      }
      throw err;
    }
  },

  async createEmployee(data) {
    if (isDemoMode()) {
      return mockAdapter.createEmployee(data);
    }
    try {
      const response = await apiClient.post('/employees', data);
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.createEmployee(data);
      }
      throw err;
    }
  },

  async updateEmployee(id, data) {
    if (isDemoMode()) {
      return mockAdapter.updateEmployee(id, data);
    }
    try {
      const response = await apiClient.patch(`/employees/${id}`, data);
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.updateEmployee(id, data);
      }
      throw err;
    }
  },

  async updateStatus(id, status) {
    if (isDemoMode()) {
      return mockAdapter.updateStatus(id, status);
    }
    try {
      const response = await apiClient.patch(`/employees/${id}/status`, { status });
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.updateStatus(id, status);
      }
      throw err;
    }
  },

  async deleteEmployee(id) {
    if (isDemoMode()) {
      return mockAdapter.deleteEmployee(id);
    }
    try {
      const response = await apiClient.delete(`/employees/${id}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.deleteEmployee(id);
      }
      throw err;
    }
  },
};

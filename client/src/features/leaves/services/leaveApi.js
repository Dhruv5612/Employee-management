import apiClient, { isDemoMode, mockAdapter } from '../../../services/apiClient.js';

export const leaveApi = {
  async listLeaves(filter = 'All') {
    if (isDemoMode()) {
      return mockAdapter.listLeaves(filter);
    }
    try {
      const response = await apiClient.get('/leaves', { params: { status: filter } });
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.listLeaves(filter);
      }
      return mockAdapter.listLeaves(filter);
    }
  },

  async getLeaveStats() {
    if (isDemoMode()) {
      return mockAdapter.getLeaveStats();
    }
    try {
      const response = await apiClient.get('/leaves/stats');
      return response.data.data;
    } catch (err) {
      return mockAdapter.getLeaveStats();
    }
  },

  async createLeave(data) {
    if (isDemoMode()) {
      return mockAdapter.createLeave(data);
    }
    try {
      const response = await apiClient.post('/leaves', data);
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.createLeave(data);
      }
      return mockAdapter.createLeave(data);
    }
  },

  async updateLeaveStatus(id, updates) {
    if (isDemoMode()) {
      return mockAdapter.updateLeaveStatus(id, updates);
    }
    try {
      const response = await apiClient.patch(`/leaves/${id}/status`, updates);
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.updateLeaveStatus(id, updates);
      }
      return mockAdapter.updateLeaveStatus(id, updates);
    }
  },
};


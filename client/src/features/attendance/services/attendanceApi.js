import apiClient, { isDemoMode, mockAdapter } from '../../../services/apiClient.js';

export const attendanceApi = {
  async listAttendance(date) {
    if (isDemoMode()) {
      return mockAdapter.listAttendance(date);
    }
    try {
      const response = await apiClient.get('/attendance', { params: { date } });
      return response.data.data;
    } catch (err) {
      return mockAdapter.listAttendance(date);
    }
  },

  async getAttendanceStats(date) {
    if (isDemoMode()) {
      return mockAdapter.getAttendanceStats(date);
    }
    try {
      const response = await apiClient.get('/attendance/stats', { params: { date } });
      return response.data.data;
    } catch (err) {
      return mockAdapter.getAttendanceStats(date);
    }
  },

  async updateAttendance(id, updates) {
    if (isDemoMode()) {
      return mockAdapter.updateAttendance(id, updates);
    }
    try {
      const response = await apiClient.patch(`/attendance/${id}`, updates);
      return response.data.data;
    } catch (err) {
      return mockAdapter.updateAttendance(id, updates);
    }
  },

  async batchMarkAttendance(date, status) {
    if (isDemoMode()) {
      return mockAdapter.batchMarkAttendance(date, status);
    }
    try {
      const response = await apiClient.post('/attendance/batch', { date, status });
      return response.data.data;
    } catch (err) {
      return mockAdapter.batchMarkAttendance(date, status);
    }
  },
};


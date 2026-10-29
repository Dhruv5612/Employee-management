import apiClient, { isDemoMode, mockAdapter } from '../../../services/apiClient.js';

export const announcementApi = {
  async listAnnouncements(params = {}) {
    if (isDemoMode()) {
      return mockAdapter.listAnnouncements(params);
    }
    try {
      const response = await apiClient.get('/announcements', { params });
      return response.data.data;
    } catch (err) {
      return mockAdapter.listAnnouncements(params);
    }
  },

  async createAnnouncement(data) {
    if (isDemoMode()) {
      return mockAdapter.createAnnouncement(data);
    }
    try {
      const response = await apiClient.post('/announcements', data);
      return response.data.data;
    } catch (err) {
      return mockAdapter.createAnnouncement(data);
    }
  },

  async deleteAnnouncement(id) {
    if (isDemoMode()) {
      return mockAdapter.deleteAnnouncement(id);
    }
    try {
      const response = await apiClient.delete(`/announcements/${id}`);
      return response.data;
    } catch (err) {
      return mockAdapter.deleteAnnouncement(id);
    }
  },
};


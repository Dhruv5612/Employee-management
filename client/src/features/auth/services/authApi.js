import apiClient from '../../../services/apiClient.js';

export const authApi = {
  // Option 1: Standard Password Login (dispatches 6-digit OTP to Gmail)
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data.data;
  },

  // Option 2: Gmail OTP Request (Passwordless login)
  async requestLoginOtp(email) {
    const response = await apiClient.post('/auth/login/request-otp', { email });
    return response.data.data;
  },

  // Verify Gmail OTP
  async verifyLoginOtp(email, otp) {
    const response = await apiClient.post('/auth/login/verify-otp', { email, otp });
    return response.data.data;
  },

  async requestSignupOtp(data) {
    const response = await apiClient.post('/auth/signup/request-otp', data);
    return response.data.data;
  },

  async verifySignupOtp(email, otp) {
    const response = await apiClient.post('/auth/signup/verify-otp', { email, otp });
    return response.data.data;
  },

  async resendOtp(email, purpose = 'login') {
    const response = await apiClient.post('/auth/resend-otp', { email, purpose });
    return response.data.data;
  },

  async signup(data) {
    const response = await apiClient.post('/auth/signup', data);
    return response.data.data;
  },

  async forgotPassword(email) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await apiClient.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  async verifyEmail(token) {
    const response = await apiClient.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  async updateProfile(data) {
    const response = await apiClient.patch('/auth/profile', data);
    return response.data.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  async listUsers() {
    const response = await apiClient.get('/auth/users');
    return response.data.data;
  },

  async updateUserRole(id, data) {
    const response = await apiClient.patch(`/auth/users/${id}`, data);
    return response.data.data;
  },

  async deleteUser(id) {
    const response = await apiClient.delete(`/auth/users/${id}`);
    return response.data;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API error:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

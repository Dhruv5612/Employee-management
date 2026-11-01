import apiClient, { isDemoMode, mockAdapter } from '../../../services/apiClient.js';

export const authApi = {
  // Option 1: Standard Password Login
  async login(email, password) {
    if (isDemoMode()) {
      return mockAdapter.login(email, password);
    }
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.login(email, password);
      }
      throw err;
    }
  },

  // Option 2: Gmail OTP Request (Passwordless login)
  async requestLoginOtp(email) {
    if (isDemoMode()) {
      return mockAdapter.requestLoginOtp(email);
    }
    try {
      const response = await apiClient.post('/auth/login/request-otp', { email });
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.requestLoginOtp(email);
      }
      throw err;
    }
  },

  // Option 2: Gmail OTP Verification
  async verifyLoginOtp(email, otp) {
    if (isDemoMode()) {
      return mockAdapter.verifyLoginOtp({ email, otp });
    }
    try {
      const response = await apiClient.post('/auth/login/verify-otp', { email, otp });
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.verifyLoginOtp({ email, otp });
      }
      throw err;
    }
  },

  async requestSignupOtp(data) {
    if (isDemoMode()) {
      return mockAdapter.requestSignupOtp(data);
    }
    try {
      const response = await apiClient.post('/auth/signup/request-otp', data);
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.requestSignupOtp(data);
      }
      throw err;
    }
  },

  async verifySignupOtp(email, otp) {
    if (isDemoMode()) {
      return mockAdapter.verifySignupOtp({ email, otp });
    }
    try {
      const response = await apiClient.post('/auth/signup/verify-otp', { email, otp });
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.verifySignupOtp({ email, otp });
      }
      throw err;
    }
  },

  async resendOtp(email, purpose = 'login') {
    if (isDemoMode()) {
      return mockAdapter.resendOtp({ email, purpose });
    }
    try {
      const response = await apiClient.post('/auth/resend-otp', { email, purpose });
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.resendOtp({ email, purpose });
      }
      throw err;
    }
  },

  async signup(data) {
    if (isDemoMode()) {
      return mockAdapter.signup(data);
    }
    try {
      const response = await apiClient.post('/auth/signup', data);
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.signup(data);
      }
      throw err;
    }
  },

  async forgotPassword(email) {
    if (isDemoMode()) {
      return mockAdapter.forgotPassword(email);
    }
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.forgotPassword(email);
      }
      throw err;
    }
  },

  async resetPassword(token, password) {
    if (isDemoMode()) {
      return mockAdapter.resetPassword(token, password);
    }
    try {
      const response = await apiClient.post(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.resetPassword(token, password);
      }
      throw err;
    }
  },

  async verifyEmail(token) {
    if (isDemoMode()) {
      return mockAdapter.verifyEmail(token);
    }
    try {
      const response = await apiClient.get(`/auth/verify-email?token=${token}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.verifyEmail(token);
      }
      throw err;
    }
  },

  async getMe() {
    if (isDemoMode()) {
      return mockAdapter.getMe();
    }
    try {
      const response = await apiClient.get('/auth/me');
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.getMe();
      }
      throw err;
    }
  },

  async updateProfile(data) {
    if (isDemoMode()) {
      return mockAdapter.updateProfile(data);
    }
    try {
      const response = await apiClient.patch('/auth/profile', data);
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.updateProfile(data);
      }
      throw err;
    }
  },

  async changePassword(currentPassword, newPassword) {
    if (isDemoMode()) {
      return mockAdapter.changePassword('', currentPassword, newPassword);
    }
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.changePassword('', currentPassword, newPassword);
      }
      throw err;
    }
  },

  async listUsers() {
    if (isDemoMode()) {
      return mockAdapter.listUsers();
    }
    try {
      const response = await apiClient.get('/auth/users');
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.listUsers();
      }
      throw err;
    }
  },

  async updateUserRole(id, data) {
    if (isDemoMode()) {
      return mockAdapter.updateUserRole(id, data);
    }
    try {
      const response = await apiClient.patch(`/auth/users/${id}`, data);
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.updateUserRole(id, data);
      }
      throw err;
    }
  },

  async deleteUser(id) {
    if (isDemoMode()) {
      return mockAdapter.deleteUser(id);
    }
    try {
      const response = await apiClient.delete(`/auth/users/${id}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.deleteUser(id);
      }
      throw err;
    }
  },

  async logout() {
    if (!isDemoMode()) {
      try {
        await apiClient.post('/auth/logout');
      } catch (err) {
        console.warn('Logout API error:', err);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

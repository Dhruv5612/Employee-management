import apiClient, { isDemoMode, mockAdapter } from '../../../services/apiClient.js';

export const departmentApi = {
  async listDepartments() {
    if (isDemoMode()) {
      return mockAdapter.listDepartments();
    }
    try {
      const response = await apiClient.get('/departments');
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.listDepartments();
      }
      throw err;
    }
  },

  async getDepartment(id) {
    if (isDemoMode()) {
      const depts = await mockAdapter.listDepartments();
      const found = depts.find((d) => d._id === id);
      if (!found) throw new Error('Department not found');
      return found;
    }
    try {
      const response = await apiClient.get(`/departments/${id}`);
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        const depts = await mockAdapter.listDepartments();
        return depts.find((d) => d._id === id);
      }
      throw err;
    }
  },

  async createDepartment(data) {
    if (isDemoMode()) {
      return mockAdapter.createDepartment(data);
    }
    try {
      const response = await apiClient.post('/departments', data);
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.createDepartment(data);
      }
      throw err;
    }
  },

  async updateDepartment(id, data) {
    if (isDemoMode()) {
      return mockAdapter.updateDepartment(id, data);
    }
    try {
      const response = await apiClient.patch(`/departments/${id}`, data);
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.updateDepartment(id, data);
      }
      throw err;
    }
  },

  async deleteDepartment(id) {
    if (isDemoMode()) {
      return mockAdapter.deleteDepartment(id);
    }
    try {
      const response = await apiClient.delete(`/departments/${id}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        return mockAdapter.deleteDepartment(id);
      }
      throw err;
    }
  },

  async reassignEmployees(fromId, targetDepartmentId) {
    if (isDemoMode()) {
      // In demo mode reassign
      const emps = await mockAdapter.listEmployees({ limit: 1000 });
      for (const emp of emps.employees) {
        if ((typeof emp.department === 'object' ? emp.department?._id : emp.department) === fromId) {
          await mockAdapter.updateEmployee(emp._id, { department: targetDepartmentId });
        }
      }
      return { success: true };
    }
    const response = await apiClient.post(`/departments/${fromId}/reassign-employees`, {
      targetDepartmentId,
    });
    return response.data;
  },
};

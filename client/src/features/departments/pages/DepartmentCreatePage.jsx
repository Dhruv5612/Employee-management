import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentForm from '../components/DepartmentForm.jsx';
import { departmentApi } from '../services/departmentApi.js';
import { useToast } from '../../../hooks/useToast.js';

export default function DepartmentCreatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleCreate = async (formData) => {
    setIsLoading(true);
    try {
      const created = await departmentApi.createDepartment(formData);
      success(`Department "${created.name}" created successfully`);
      navigate('/departments');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create department';
      error(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Department</h1>
          <p className="page-subtitle">Add a new operational department to the organizational structure</p>
        </div>
      </div>

      <div className="card">
        <DepartmentForm onSubmit={handleCreate} isLoading={isLoading} />
      </div>
    </div>
  );
}

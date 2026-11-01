import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm.jsx';
import { employeeApi } from '../services/employeeApi.js';
import { useToast } from '../../../hooks/useToast.js';

export default function EmployeeCreatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleCreate = async (formData) => {
    setIsLoading(true);
    try {
      const created = await employeeApi.createEmployee(formData);
      success(`Employee created successfully with ID: ${created.employeeId}`);
      navigate('/employees');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create employee';
      error(msg);
      throw err; // rethrow so EmployeeForm can map validation errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Employee</h1>
          <p className="page-subtitle">Register a new workforce member with automated ID generation</p>
        </div>
      </div>

      <div className="card">
        <EmployeeForm onSubmit={handleCreate} isLoading={isLoading} />
      </div>
    </div>
  );
}

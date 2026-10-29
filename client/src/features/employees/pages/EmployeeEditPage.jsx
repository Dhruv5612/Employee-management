import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm.jsx';
import { employeeApi } from '../services/employeeApi.js';
import Loader from '../../../components/common/Loader.jsx';
import ErrorState from '../../../components/common/ErrorState.jsx';
import { useToast } from '../../../hooks/useToast.js';

export default function EmployeeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { success, error: toastError } = useToast();

  const fetchEmployee = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeApi.getEmployee(id);
      setEmployee(data);
    } catch (err) {
      console.error('Failed to load employee:', err);
      setError(err.response?.data?.message || err.message || 'Employee record could not be retrieved');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      await employeeApi.updateEmployee(id, formData);
      success(`Updated records for ${formData.fullName}`);
      navigate(`/employees/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update employee';
      toastError(msg);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Fetching employee record..." />;
  }

  if (error || !employee) {
    return <ErrorState message={error} onRetry={fetchEmployee} />;
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Employee Details</h1>
          <p className="page-subtitle">
            Editing {employee.fullName} ({employee.employeeId})
          </p>
        </div>
      </div>

      <div className="card">
        <EmployeeForm
          initialValues={employee}
          onSubmit={handleUpdate}
          isLoading={saving}
          isEdit={true}
        />
      </div>
    </div>
  );
}

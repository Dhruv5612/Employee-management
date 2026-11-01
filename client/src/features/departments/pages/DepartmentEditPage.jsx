import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DepartmentForm from '../components/DepartmentForm.jsx';
import { departmentApi } from '../services/departmentApi.js';
import Loader from '../../../components/common/Loader.jsx';
import ErrorState from '../../../components/common/ErrorState.jsx';
import { useToast } from '../../../hooks/useToast.js';

export default function DepartmentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { success, error: toastError } = useToast();

  const fetchDepartment = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentApi.getDepartment(id);
      setDepartment(data);
    } catch (err) {
      console.error('Failed to load department:', err);
      setError(err.response?.data?.message || err.message || 'Department could not be found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, [id]);

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      await departmentApi.updateDepartment(id, formData);
      success(`Department "${formData.name}" updated successfully`);
      navigate('/departments');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update department';
      toastError(msg);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Fetching department configuration..." />;
  }

  if (error || !department) {
    return <ErrorState message={error} onRetry={fetchDepartment} />;
  }

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Department</h1>
          <p className="page-subtitle">Update department name, code, or function description</p>
        </div>
      </div>

      <div className="card">
        <DepartmentForm
          initialValues={department}
          onSubmit={handleUpdate}
          isLoading={saving}
          isEdit={true}
        />
      </div>
    </div>
  );
}

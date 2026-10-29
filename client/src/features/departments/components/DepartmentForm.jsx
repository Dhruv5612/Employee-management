import React, { useState, useEffect } from 'react';
import Input from '../../../components/common/Input.jsx';
import Select from '../../../components/common/Select.jsx';
import Button from '../../../components/common/Button.jsx';
import { employeeApi } from '../../employees/services/employeeApi.js';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DepartmentForm({
  initialValues = {},
  onSubmit,
  isLoading = false,
  isEdit = false,
}) {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    code: initialValues.code || '',
    description: initialValues.description || '',
    manager:
      typeof initialValues.manager === 'object' && initialValues.manager !== null
        ? initialValues.manager._id
        : initialValues.manager || '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    employeeApi
      .listEmployees({ limit: 100 })
      .then((res) => {
        setEmployees(res.employees || []);
      })
      .catch((err) => console.warn('Could not load employees for manager selection', err));
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Department name must be at least 2 characters';
    }

    if (!formData.code.trim() || formData.code.trim().length < 2) {
      errs.code = 'Department code must be at least 2 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase() : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(formData);
    } catch (apiError) {
      if (apiError.response?.data?.errors) {
        const fieldErrors = {};
        apiError.response.data.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const managerOptions = employees.map((emp) => ({
    value: emp._id,
    label: `${emp.fullName} (${emp.employeeId} - ${emp.designation})`,
  }));

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <Input
          label="Department Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Engineering & IT"
          error={errors.name}
          required
        />

        <Input
          label="Department Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g. ENG"
          helperText="Unique uppercase identifier (2-20 characters)"
          error={errors.code}
          required
        />
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <Select
          label="Department Manager (Optional)"
          name="manager"
          value={formData.manager}
          onChange={handleChange}
          options={managerOptions}
          placeholder="Assign an existing employee as Department Manager"
        />
      </div>

      <div className="form-group" style={{ marginTop: '1.25rem' }}>
        <label htmlFor="description" className="form-label">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter a brief summary of this department's function..."
          className="form-textarea"
        />
      </div>

      <div
        style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
        }}
      >
        <Button
          variant="secondary"
          onClick={() => navigate('/departments')}
          disabled={isLoading}
          icon={ArrowLeft}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={Save}
        >
          {isEdit ? 'Save Changes' : 'Create Department'}
        </Button>
      </div>
    </form>
  );
}

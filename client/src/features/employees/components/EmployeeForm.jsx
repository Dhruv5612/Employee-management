import React, { useState, useEffect } from 'react';
import Input from '../../../components/common/Input.jsx';
import Select from '../../../components/common/Select.jsx';
import Button from '../../../components/common/Button.jsx';
import { departmentApi } from '../../departments/services/departmentApi.js';
import { toInputDateFormat } from '../../../utils/dateUtils.js';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmployeeForm({
  initialValues = {},
  onSubmit,
  isLoading = false,
  isEdit = false,
}) {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: initialValues.fullName || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    department:
      typeof initialValues.department === 'object' && initialValues.department !== null
        ? initialValues.department._id
        : initialValues.department || '',
    designation: initialValues.designation || '',
    joiningDate: toInputDateFormat(initialValues.joiningDate) || toInputDateFormat(new Date()),
    status: initialValues.status || 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    departmentApi
      .listDepartments()
      .then((data) => setDepartments(data))
      .catch((err) => console.error('Failed to load departments', err))
      .finally(() => setDepartmentsLoading(false));
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 7) {
      errs.phone = 'Please enter a valid phone number';
    }

    if (!formData.department) {
      errs.department = 'Please select a department';
    }

    if (!formData.designation.trim()) {
      errs.designation = 'Designation is required';
    }

    if (!formData.joiningDate) {
      errs.joiningDate = 'Joining date is required';
    } else {
      const selected = new Date(formData.joiningDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selected > today) {
        errs.joiningDate = 'Joining date cannot be in the future';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
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
      // Map backend validation errors to fields
      if (apiError.response?.data?.errors) {
        const fieldErrors = {};
        apiError.response.data.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const departmentOptions = departments.map((d) => ({
    value: d._id,
    label: `${d.name} (${d.code})`,
  }));

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'On Leave', label: 'On Leave' },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="e.g. Rahul Sharma"
          error={errors.fullName}
          required
        />

        <Input
          label="Work Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. rahul.sharma@company.com"
          error={errors.email}
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g. +1 (555) 234-5678"
          error={errors.phone}
          required
        />

        <Select
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          options={departmentOptions}
          placeholder={departmentsLoading ? 'Loading departments...' : 'Choose a department'}
          error={errors.department}
          disabled={departmentsLoading}
          required
        />

        <Input
          label="Designation / Role"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="e.g. Senior Software Engineer"
          error={errors.designation}
          required
        />

        <Input
          label="Joining Date"
          name="joiningDate"
          type="date"
          value={formData.joiningDate}
          onChange={handleChange}
          error={errors.joiningDate}
          max={toInputDateFormat(new Date())}
          required
        />

        <Select
          label="Employment Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          error={errors.status}
          required
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
          onClick={() => navigate('/employees')}
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
          {isEdit ? 'Save Changes' : 'Create Employee Record'}
        </Button>
      </div>
    </form>
  );
}

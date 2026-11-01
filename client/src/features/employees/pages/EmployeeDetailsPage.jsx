import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useOutletContext } from 'react-router-dom';
import { employeeApi } from '../services/employeeApi.js';
import Loader from '../../../components/common/Loader.jsx';
import ErrorState from '../../../components/common/ErrorState.jsx';
import Button from '../../../components/common/Button.jsx';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import ConfirmDialog from '../../../components/common/ConfirmDialog.jsx';
import { formatDate } from '../../../utils/dateUtils.js';
import { useToast } from '../../../hooks/useToast.js';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Hash,
  Clock,
} from 'lucide-react';

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { user } = useOutletContext() || {};
  const { success, error: toastError } = useToast();

  const canEdit = user?.role === 'Admin' || user?.role === 'HR';
  const canDelete = user?.role === 'Admin';

  const fetchEmployee = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeApi.getEmployee(id);
      setEmployee(data);
    } catch (err) {
      console.error('Failed to load employee details:', err);
      setError(err.response?.data?.message || err.message || 'Employee record not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await employeeApi.deleteEmployee(id);
      success(`Employee ${employee?.fullName} removed successfully`);
      navigate('/employees');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete employee');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return <Loader message="Loading profile details..." />;
  }

  if (error || !employee) {
    return <ErrorState message={error} onRetry={fetchEmployee} />;
  }

  const dept = typeof employee.department === 'object' ? employee.department : null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          to="/employees"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#64748b',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to Directory
        </Link>
      </div>

      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingBottom: '1.75rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
            >
              {employee.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                  {employee.fullName}
                </h1>
                <StatusBadge status={employee.status} />
              </div>
              <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.2rem' }}>
                {employee.designation} &bull; {dept?.name || 'Department'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {canEdit && (
              <Link to={`/employees/${employee._id}/edit`}>
                <Button variant="primary" icon={Edit3} size="sm">
                  Edit Details
                </Button>
              </Link>
            )}
            {canDelete && (
              <Button
                variant="outline"
                size="sm"
                icon={Trash2}
                onClick={() => setShowDeleteConfirm(true)}
                style={{ color: '#ef4444', borderColor: '#fecaca' }}
              >
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Detailed Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
            paddingTop: '1.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Hash size={14} /> Employee ID
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#4f46e5', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
              {employee.employeeId}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Mail size={14} /> Work Email
            </div>
            <div style={{ fontSize: '0.975rem', fontWeight: 500, color: '#0f172a', marginTop: '0.25rem' }}>
              <a href={`mailto:${employee.email}`}>{employee.email}</a>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Phone size={14} /> Phone Number
            </div>
            <div style={{ fontSize: '0.975rem', fontWeight: 500, color: '#0f172a', marginTop: '0.25rem' }}>
              <a href={`tel:${employee.phone}`}>{employee.phone}</a>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Building2 size={14} /> Department
            </div>
            <div style={{ fontSize: '0.975rem', fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>
              {dept?.name || 'Unassigned'} {dept?.code && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({dept.code})</span>}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Briefcase size={14} /> Designation
            </div>
            <div style={{ fontSize: '0.975rem', fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>
              {employee.designation}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Calendar size={14} /> Joining Date
            </div>
            <div style={{ fontSize: '0.975rem', fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>
              {formatDate(employee.joiningDate)}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Clock size={14} /> Record Created
            </div>
            <div style={{ fontSize: '0.925rem', color: '#64748b', marginTop: '0.25rem' }}>
              {formatDate(employee.createdAt)}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employee.fullName} (${employee.employeeId})? This action is permanent and cannot be undone.`}
        confirmText="Confirm Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { departmentApi } from '../services/departmentApi.js';
import DepartmentTable from '../components/DepartmentTable.jsx';
import ReassignModal from '../components/ReassignModal.jsx';
import Loader from '../../../components/common/Loader.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import ErrorState from '../../../components/common/ErrorState.jsx';
import ConfirmDialog from '../../../components/common/ConfirmDialog.jsx';
import Button from '../../../components/common/Button.jsx';
import { useToast } from '../../../hooks/useToast.js';
import { Building2, Plus, AlertCircle } from 'lucide-react';

export default function DepartmentListPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reassign modal state
  const [reassignDept, setReassignDept] = useState(null);

  // Delete modal state
  const [deleteDept, setDeleteDept] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteBlockedError, setDeleteBlockedError] = useState(null);

  const { user } = useOutletContext() || {};
  const { success, error: toastError } = useToast();

  const canManage = user?.role === 'Admin' || user?.role === 'HR';
  const canDelete = user?.role === 'Admin';

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentApi.listDepartments();
      setDepartments(data || []);
    } catch (err) {
      console.error('Failed to load departments:', err);
      setError(err.message || 'Error loading department records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDeleteClick = (dept) => {
    setDeleteBlockedError(null);
    if (dept.employeeCount > 0) {
      setDeleteBlockedError(
        `Department "${dept.name}" has ${dept.employeeCount} active assigned employee(s). You must reassign all employees to another department before this department can be deleted.`
      );
    }
    setDeleteDept(dept);
  };

  const confirmDelete = async () => {
    if (!deleteDept) return;
    setIsDeleting(true);
    try {
      await departmentApi.deleteDepartment(deleteDept._id);
      success(`Department "${deleteDept.name}" deleted successfully`);
      setDeleteDept(null);
      fetchDepartments();
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete department');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Organizational business units and staff assignments</p>
        </div>

        {canManage && (
          <Link to="/departments/new">
            <Button variant="primary" icon={Plus}>
              New Department
            </Button>
          </Link>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <Loader message="Loading departments..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchDepartments} />
        ) : departments.length === 0 ? (
          <EmptyState
            title="No departments found"
            description="No departments are configured yet. Create a department to begin assigning staff."
            icon={Building2}
            actionText={canManage ? 'Add Department' : undefined}
            onAction={canManage ? () => (window.location.href = '/departments/new') : undefined}
          />
        ) : (
          <DepartmentTable
            departments={departments}
            onDelete={handleDeleteClick}
            onReassign={(dept) => setReassignDept(dept)}
            canManage={canManage}
            canDelete={canDelete}
          />
        )}
      </div>

      {/* Delete / Blocked Modal */}
      {deleteDept && (
        <ConfirmDialog
          isOpen={Boolean(deleteDept)}
          onClose={() => setDeleteDept(null)}
          onConfirm={deleteBlockedError ? () => {
            const current = deleteDept;
            setDeleteDept(null);
            setReassignDept(current);
          } : confirmDelete}
          title={deleteBlockedError ? 'Deletion Blocked by Business Rule' : 'Delete Department'}
          message={
            deleteBlockedError
              ? deleteBlockedError
              : `Are you sure you want to delete the department "${deleteDept.name}" (${deleteDept.code})?`
          }
          confirmText={deleteBlockedError ? 'Reassign Employees Now' : 'Delete Department'}
          isDestructive={!deleteBlockedError}
          isLoading={isDeleting}
        />
      )}

      {/* Reassign Employees Modal */}
      <ReassignModal
        isOpen={Boolean(reassignDept)}
        onClose={() => setReassignDept(null)}
        sourceDepartment={reassignDept}
        departments={departments}
        onReassigned={fetchDepartments}
      />
    </div>
  );
}

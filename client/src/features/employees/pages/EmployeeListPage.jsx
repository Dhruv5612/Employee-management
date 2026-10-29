import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useOutletContext } from 'react-router-dom';
import { employeeApi } from '../services/employeeApi.js';
import { departmentApi } from '../../departments/services/departmentApi.js';
import { reportApi } from '../../reports/services/reportApi.js';
import EmployeeTable from '../components/EmployeeTable.jsx';
import EmployeeFilters from '../components/EmployeeFilters.jsx';
import Pagination from '../../../components/common/Pagination.jsx';
import Loader from '../../../components/common/Loader.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import ErrorState from '../../../components/common/ErrorState.jsx';
import ConfirmDialog from '../../../components/common/ConfirmDialog.jsx';
import Button from '../../../components/common/Button.jsx';
import { useToast } from '../../../hooks/useToast.js';
import { useDebounce } from '../../../hooks/useDebounce.js';
import { parseUrlFilters, buildSearchParams } from '../../../utils/queryParams.js';
import { UserPlus, Users } from 'lucide-react';

export default function EmployeeListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilters = parseUrlFilters(searchParams);

  const [searchInput, setSearchInput] = useState(urlFilters.q);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState({
    page: urlFilters.page,
    limit: urlFilters.limit,
    totalRecords: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useOutletContext() || {};
  const { success, error: toastError } = useToast();

  const canAdd = user?.role === 'Admin' || user?.role === 'HR';
  const canEdit = user?.role === 'Admin' || user?.role === 'HR';
  const canDelete = user?.role === 'Admin';

  // Fetch departments list for filter
  useEffect(() => {
    departmentApi
      .listDepartments()
      .then((data) => setDepartments(data))
      .catch((err) => console.warn('Could not load departments for filter', err));
  }, []);

  // Sync debounced search to URL query param (and reset page to 1)
  useEffect(() => {
    if (debouncedSearch !== urlFilters.q) {
      const next = { ...urlFilters, q: debouncedSearch, page: 1 };
      setSearchParams(buildSearchParams(next), { replace: true });
    }
  }, [debouncedSearch]);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeApi.listEmployees({
        q: urlFilters.q,
        department: urlFilters.department,
        status: urlFilters.status,
        sortBy: urlFilters.sortBy,
        order: urlFilters.order,
        page: urlFilters.page,
        limit: urlFilters.limit,
      });

      setEmployees(data.employees || []);
      setPagination(
        data.pagination || {
          page: urlFilters.page,
          limit: urlFilters.limit,
          totalRecords: 0,
          totalPages: 0,
        }
      );
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setError(err.message || 'Error loading employee records');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const updateParam = (key, value) => {
    const next = { ...urlFilters, [key]: value };
    // If filter criteria changes, reset page to 1 per requirement
    if (['q', 'department', 'status'].includes(key)) {
      next.page = 1;
    }
    setSearchParams(buildSearchParams(next));
  };

  const handleSort = (field) => {
    let nextOrder = 'asc';
    if (urlFilters.sortBy === field && urlFilters.order === 'asc') {
      nextOrder = 'desc';
    }
    const next = { ...urlFilters, sortBy: field, order: nextOrder };
    setSearchParams(buildSearchParams(next));
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams(buildSearchParams({ page: 1, limit: urlFilters.limit }));
  };

  const handleStatusChange = async (employeeId, newStatus) => {
    try {
      await employeeApi.updateStatus(employeeId, newStatus);
      success(`Status updated to "${newStatus}"`);
      // Update locally
      setEmployees((prev) =>
        prev.map((e) => (e._id === employeeId ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await employeeApi.deleteEmployee(deleteTarget._id);
      success(`Employee ${deleteTarget.fullName} (${deleteTarget.employeeId}) removed successfully`);
      setDeleteTarget(null);
      fetchEmployees();
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete employee');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Directory</h1>
          <p className="page-subtitle">Search, filter, view, and manage company staff records</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            onClick={async () => {
              const data = await reportApi.exportEmployees({
                q: urlFilters.q,
                department: urlFilters.department,
                status: urlFilters.status,
              });
              if (data && data.length) {
                const headers = ['Employee ID', 'Full Name', 'Email', 'Phone', 'Department', 'Designation', 'Joining Date', 'Status'];
                const csv = [
                  headers.join(','),
                  ...data.map((r) => [r.employeeId, `"${r.fullName}"`, r.email, `"${r.phone}"`, `"${r.department}"`, `"${r.designation}"`, r.joiningDate, r.status].join(',')),
                ].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `employees_export_${Date.now()}.csv`;
                a.click();
              }
            }}
          >
            Export CSV
          </Button>

          {canAdd && (
            <Link to="/employees/new">
              <Button variant="primary" icon={UserPlus}>
                Add Employee
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem 0.5rem' }}>
          <EmployeeFilters
            search={searchInput}
            onSearchChange={setSearchInput}
            department={urlFilters.department}
            onDepartmentChange={(val) => updateParam('department', val)}
            status={urlFilters.status}
            onStatusChange={(val) => updateParam('status', val)}
            departments={departments}
            onReset={handleResetFilters}
          />
        </div>

        {loading ? (
          <Loader message="Loading employees..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchEmployees} />
        ) : employees.length === 0 ? (
          <EmptyState
            title="No employees found"
            description={
              searchInput || urlFilters.department || urlFilters.status
                ? 'No staff members match the current search or filter criteria. Try resetting filters.'
                : 'There are currently no employee records registered in the system.'
            }
            icon={Users}
            actionText={canAdd ? 'Add First Employee' : undefined}
            onAction={canAdd ? () => (window.location.href = '/employees/new') : undefined}
          />
        ) : (
          <>
            <EmployeeTable
              employees={employees}
              sortBy={urlFilters.sortBy}
              order={urlFilters.order}
              onSort={handleSort}
              onStatusChange={handleStatusChange}
              onDelete={setDeleteTarget}
              canEdit={canEdit}
              canDelete={canDelete}
            />

            <Pagination
              page={pagination.page}
              limit={pagination.limit}
              totalRecords={pagination.totalRecords}
              totalPages={pagination.totalPages}
              onPageChange={(p) => updateParam('page', p)}
              onLimitChange={(l) => updateParam('limit', l)}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Employee Record"
        message={`Are you sure you want to delete ${deleteTarget?.fullName} (${deleteTarget?.employeeId})? This action cannot be undone.`}
        confirmText="Confirm Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}

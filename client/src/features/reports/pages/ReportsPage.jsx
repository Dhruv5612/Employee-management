import React, { useState, useEffect } from 'react';
import { reportApi } from '../services/reportApi.js';
import { departmentApi } from '../../departments/services/departmentApi.js';
import Button from '../../../components/common/Button.jsx';
import Loader from '../../../components/common/Loader.jsx';
import ErrorState from '../../../components/common/ErrorState.jsx';
import { useToast } from '../../../hooks/useToast.js';
import {
  FileSpreadsheet,
  Download,
  Filter,
  BarChart3,
  Users,
  Building2,
  Calendar,
} from 'lucide-react';

export default function ReportsPage() {
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    departmentApi
      .listDepartments()
      .then((data) => setDepartments(data || []))
      .catch((err) => console.warn('Could not load departments for report', err));
  }, []);

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportApi.getSummary(filters);
      setSummary(data);
    } catch (err) {
      setError(err.message || 'Failed to generate report summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [filters]);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const records = await reportApi.exportEmployees(filters);
      if (!records || records.length === 0) {
        toastError('No matching employee records to export');
        return;
      }

      const headers = [
        'Employee ID',
        'Full Name',
        'Email',
        'Phone',
        'Department',
        'Department Code',
        'Designation',
        'Joining Date',
        'Status',
        'Created At',
      ];

      const csvRows = records.map((r) =>
        [
          r.employeeId,
          `"${(r.fullName || '').replace(/"/g, '""')}"`,
          r.email,
          `"${r.phone || ''}"`,
          `"${(r.department || '').replace(/"/g, '""')}"`,
          r.departmentCode || '',
          `"${(r.designation || '').replace(/"/g, '""')}"`,
          r.joiningDate,
          r.status,
          r.createdAt,
        ].join(',')
      );

      const csvString = [headers.join(','), ...csvRows].join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `workforce_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      success(`Exported ${records.length} records to CSV successfully`);
    } catch (err) {
      toastError(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Generate custom organizational workforce reports and export data</p>
        </div>

        <Button
          variant="primary"
          icon={Download}
          isLoading={exporting}
          onClick={handleExportCsv}
        >
          Export CSV Spreadsheet
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'flex-end',
        }}
      >
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
            Filter Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
            className="form-select"
            style={{ fontSize: '0.875rem' }}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 160px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
            Employment Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="form-select"
            style={{ fontSize: '0.875rem' }}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        <div style={{ flex: '1 1 160px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
            Joined After
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
            className="form-input"
            style={{ fontSize: '0.875rem' }}
          >
          </input>
        </div>

        <div style={{ flex: '1 1 160px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
            Joined Before
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
            className="form-input"
            style={{ fontSize: '0.875rem' }}
          >
          </input>
        </div>

        <div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setFilters({ department: '', status: '', startDate: '', endDate: '' })}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader message="Compiling workforce report..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadReport} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Summary Box */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#eef2ff', color: '#4f46e5' }}>
                <Users size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Filtered Headcount</h3>
                <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Records matching applied criteria</p>
              </div>
            </div>

            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              {summary?.totalEmployees ?? 0}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              {summary?.statusBreakdown?.map((s) => (
                <div key={s.status} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>{s.status}</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department breakdown */}
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#10b981' }}>
                <Building2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Department Breakdown</h3>
                <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Allocated headcount per business unit</p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Code</th>
                    <th style={{ textAlign: 'right' }}>Employees</th>
                    <th style={{ textAlign: 'right' }}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {summary?.deptBreakdown?.map((d) => {
                    const total = summary.totalEmployees || 1;
                    const pct = Math.round((d.count / total) * 100);

                    return (
                      <tr key={d.departmentCode}>
                        <td style={{ fontWeight: 600 }}>{d.departmentName}</td>
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#4f46e5' }}>
                            {d.departmentCode}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>{d.count}</td>
                        <td style={{ textAlign: 'right', color: '#64748b' }}>{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

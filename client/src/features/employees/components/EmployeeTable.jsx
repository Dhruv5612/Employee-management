import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import EmployeeStatusMenu from './EmployeeStatusMenu.jsx';
import EmployeeActions from './EmployeeActions.jsx';
import { formatDate } from '../../../utils/dateUtils.js';

export default function EmployeeTable({
  employees = [],
  sortBy,
  order,
  onSort,
  onStatusChange,
  onDelete,
  canEdit,
  canDelete,
}) {
  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    }
    return order === 'asc' ? <ArrowUp size={14} color="#4f46e5" /> : <ArrowDown size={14} color="#4f46e5" />;
  };

  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th
              className="sortable"
              onClick={() => onSort('employeeId')}
              style={{ width: '130px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Emp ID</span>
                {renderSortIcon('employeeId')}
              </div>
            </th>

            <th
              className="sortable"
              onClick={() => onSort('name')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Employee</span>
                {renderSortIcon('name')}
              </div>
            </th>

            <th>Department</th>
            <th>Designation</th>

            <th
              className="sortable"
              onClick={() => onSort('joiningDate')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Joining Date</span>
                {renderSortIcon('joiningDate')}
              </div>
            </th>

            <th>Status</th>
            <th style={{ textAlign: 'right', width: '110px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const deptName =
              typeof emp.department === 'object' && emp.department !== null
                ? emp.department.name
                : '—';
            const deptCode =
              typeof emp.department === 'object' && emp.department !== null
                ? emp.department.code
                : '';

            return (
              <tr key={emp._id}>
                <td>
                  <Link
                    to={`/employees/${emp._id}`}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: '#4f46e5',
                    }}
                  >
                    {emp.employeeId}
                  </Link>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {emp.fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>
                        <Link to={`/employees/${emp._id}`} style={{ color: 'inherit' }}>
                          {emp.fullName}
                        </Link>
                      </div>
                      <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{emp.email}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div style={{ fontWeight: 500 }}>{deptName}</div>
                  {deptCode && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: '#f1f5f9',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '4px',
                        color: '#475569',
                      }}
                    >
                      {deptCode}
                    </span>
                  )}
                </td>

                <td>{emp.designation}</td>
                <td>{formatDate(emp.joiningDate)}</td>

                <td>
                  <EmployeeStatusMenu
                    currentStatus={emp.status}
                    onStatusChange={(newStatus) => onStatusChange(emp._id, newStatus)}
                    disabled={!canEdit}
                  />
                </td>

                <td style={{ textAlign: 'right' }}>
                  <EmployeeActions
                    employee={emp}
                    onDelete={onDelete}
                    canEdit={canEdit}
                    canDelete={canDelete}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

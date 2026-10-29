import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, ArrowRightLeft, Users, UserCheck } from 'lucide-react';
import { formatDate } from '../../../utils/dateUtils.js';

export default function DepartmentTable({
  departments = [],
  onDelete,
  onReassign,
  canManage,
  canDelete,
}) {
  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th style={{ width: '100px' }}>Code</th>
            <th>Department Name</th>
            <th>Manager</th>
            <th>Description</th>
            <th style={{ width: '150px' }}>Assigned Staff</th>
            <th style={{ width: '120px' }}>Created</th>
            <th style={{ textAlign: 'right', width: '130px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => {
            const count = dept.employeeCount || 0;
            const manager = dept.manager;

            return (
              <tr key={dept._id}>
                <td>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      backgroundColor: '#eef2ff',
                      color: '#4f46e5',
                      border: '1px solid #c7d2fe',
                    }}
                  >
                    {dept.code}
                  </span>
                </td>

                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{dept.name}</div>
                </td>

                <td>
                  {manager ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <UserCheck size={14} color="#10b981" />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                          {manager.fullName}
                        </div>
                        {manager.designation && (
                          <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                            {manager.designation}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.825rem', color: '#94a3b8', fontStyle: 'italic' }}>
                      Not Assigned
                    </span>
                  )}
                </td>

                <td style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '260px' }}>
                  {dept.description || <span style={{ color: '#cbd5e1' }}>No description</span>}
                </td>

                <td>
                  <Link
                    to={`/employees?department=${dept._id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: count > 0 ? '#ecfdf5' : '#f8fafc',
                      color: count > 0 ? '#065f46' : '#94a3b8',
                      fontWeight: 600,
                      fontSize: '0.825rem',
                      border: `1px solid ${count > 0 ? '#a7f3d0' : '#e2e8f0'}`,
                    }}
                  >
                    <Users size={14} />
                    <span>{count} {count === 1 ? 'employee' : 'employees'}</span>
                  </Link>
                </td>

                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {formatDate(dept.createdAt)}
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    {count > 0 && canManage && (
                      <button
                        type="button"
                        onClick={() => onReassign(dept)}
                        title="Reassign employees from this department"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.4rem',
                          borderRadius: '6px',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.color = '#4f46e5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#64748b';
                        }}
                      >
                        <ArrowRightLeft size={16} />
                      </button>
                    )}

                    {canManage && (
                      <Link
                        to={`/departments/${dept._id}/edit`}
                        title="Edit department"
                        style={{
                          padding: '0.4rem',
                          borderRadius: '6px',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.color = '#0284c7';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#64748b';
                        }}
                      >
                        <Edit3 size={16} />
                      </Link>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(dept)}
                        title="Delete department"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.4rem',
                          borderRadius: '6px',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#64748b';
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

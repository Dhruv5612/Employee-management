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
    <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
      <table className="custom-table" style={{ width: '100%', minWidth: '920px' }}>
        <thead>
          <tr>
            <th style={{ minWidth: '100px', width: '100px' }}>Code</th>
            <th style={{ minWidth: '200px' }}>Department Name</th>
            <th style={{ minWidth: '180px' }}>Manager</th>
            <th style={{ minWidth: '220px' }}>Description</th>
            <th style={{ minWidth: '150px', width: '150px' }}>Assigned Staff</th>
            <th style={{ minWidth: '120px', width: '120px' }}>Created</th>
            <th style={{ textAlign: 'right', minWidth: '130px', width: '130px' }}>Actions</th>
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
                      backgroundColor: 'rgba(198, 244, 50, 0.12)',
                      color: '#C6F432',
                      border: '1px solid rgba(198, 244, 50, 0.30)',
                    }}
                  >
                    {dept.code}
                  </span>
                </td>

                <td>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{dept.name}</div>
                </td>

                <td>
                  {manager ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <UserCheck size={14} color="#C6F432" />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
                          {manager.fullName}
                        </div>
                        {manager.designation && (
                          <div style={{ fontSize: '0.725rem', color: '#A1A1AA' }}>
                            {manager.designation}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.825rem', color: '#71717A', fontStyle: 'italic' }}>
                      Not Assigned
                    </span>
                  )}
                </td>

                <td style={{ color: '#A1A1AA', fontSize: '0.85rem', maxWidth: '260px' }}>
                  {dept.description || <span style={{ color: 'rgba(255, 255, 255, 0.14)' }}>No description</span>}
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
                      backgroundColor: count > 0 ? 'rgba(198, 244, 50, 0.12)' : '#171918',
                      color: count > 0 ? '#C6F432' : '#71717A',
                      fontWeight: 600,
                      fontSize: '0.825rem',
                      border: `1px solid ${count > 0 ? 'rgba(198, 244, 50, 0.30)' : 'rgba(255, 255, 255, 0.10)'}`,
                    }}
                  >
                    <Users size={14} />
                    <span>{count} {count === 1 ? 'employee' : 'employees'}</span>
                  </Link>
                </td>

                <td style={{ fontSize: '0.85rem', color: '#A1A1AA' }}>
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
                          color: '#A1A1AA',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#171918';
                          e.currentTarget.style.color = '#C6F432';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#A1A1AA';
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
                          color: '#A1A1AA',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#171918';
                          e.currentTarget.style.color = '#C6F432';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#A1A1AA';
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
                          color: '#A1A1AA',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.14)';
                          e.currentTarget.style.color = '#F87171';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#A1A1AA';
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

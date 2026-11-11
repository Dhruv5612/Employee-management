import React from 'react';
import { Eye, Edit3, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmployeeActions({ employee, onDelete, canEdit, canDelete }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
      <Link
        to={`/employees/${employee._id}`}
        title="View details"
        style={{
          padding: '0.4rem',
          borderRadius: '6px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s',
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
        <Eye size={16} />
      </Link>

      {canEdit && (
        <Link
          to={`/employees/${employee._id}/edit`}
          title="Edit employee"
          style={{
            padding: '0.4rem',
            borderRadius: '6px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
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
          onClick={() => onDelete(employee)}
          title="Delete employee"
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
            transition: 'all 0.15s',
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
  );
}

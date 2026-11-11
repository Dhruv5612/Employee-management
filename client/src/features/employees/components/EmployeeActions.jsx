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
          color: '#A1A1AA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s',
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
        <Eye size={16} />
      </Link>

      {canEdit && (
        <Link
          to={`/employees/${employee._id}/edit`}
          title="Edit employee"
          style={{
            padding: '0.4rem',
            borderRadius: '6px',
            color: '#A1A1AA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
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
          onClick={() => onDelete(employee)}
          title="Delete employee"
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
            transition: 'all 0.15s',
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
  );
}

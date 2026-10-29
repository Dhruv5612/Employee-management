import React from 'react';

export default function StatusBadge({ status }) {
  const statusClass = {
    Active: 'active',
    Inactive: 'inactive',
    'On Leave': 'on-leave',
  }[status] || 'inactive';

  return <span className={`status-badge ${statusClass}`}>{status}</span>;
}

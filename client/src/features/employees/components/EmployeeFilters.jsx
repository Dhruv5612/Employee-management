import React from 'react';
import SearchInput from '../../../components/common/SearchInput.jsx';
import Button from '../../../components/common/Button.jsx';
import { RotateCcw } from 'lucide-react';

export default function EmployeeFilters({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  departments = [],
  onReset,
}) {
  const hasActiveFilters = Boolean(search || department || status);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        marginBottom: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', flex: 1 }}>
        <SearchInput
          value={search}
          onChange={onSearchChange}
          onClear={() => onSearchChange('')}
        />

        {/* Department Filter */}
        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '180px', fontSize: '0.875rem' }}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name} ({dept.code})
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '140px', fontSize: '0.875rem' }}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} icon={RotateCcw}>
          Reset Filters
        </Button>
      )}
    </div>
  );
}

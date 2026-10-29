import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search by name, email, or employee ID...',
  onClear,
  className = '',
}) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '420px',
      }}
    >
      <Search
        size={18}
        style={{
          position: 'absolute',
          left: '0.85rem',
          color: '#94a3b8',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input"
        style={{
          paddingLeft: '2.5rem',
          paddingRight: value ? '2.5rem' : '0.9rem',
          fontSize: '0.875rem',
        }}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          style={{
            position: 'absolute',
            right: '0.65rem',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

import React from 'react';

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  helperText,
  icon: Icon,
  endAdornment,
  className = '',
  ...props
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon size={18} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-input ${error ? 'error' : ''}`}
          style={{
            paddingLeft: Icon ? '2.5rem' : '0.9rem',
            paddingRight: endAdornment ? '2.5rem' : '0.9rem',
          }}
          {...props}
        />
        {endAdornment && (
          <div
            style={{
              position: 'absolute',
              right: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {endAdornment}
          </div>
        )}
      </div>
      {error && <span className="form-error">{error}</span>}
      {helperText && !error && (
        <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
          {helperText}
        </span>
      )}
    </div>
  );
}

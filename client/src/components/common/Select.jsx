import React from 'react';

export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
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
      <select
        id={name}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        className={`form-select ${error ? 'error' : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const labelText = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {labelText}
            </option>
          );
        })}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

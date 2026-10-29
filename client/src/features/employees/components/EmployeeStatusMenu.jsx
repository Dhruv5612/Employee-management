import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge.jsx';

export default function EmployeeStatusMenu({ currentStatus, onStatusChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const statuses = ['Active', 'Inactive', 'On Leave'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (disabled) {
    return <StatusBadge status={currentStatus} />;
  }

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: 0,
        }}
        title="Click to change employment status"
      >
        <StatusBadge status={currentStatus} />
        <ChevronDown size={14} color="#64748b" />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 50,
            minWidth: '140px',
            padding: '0.35rem',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (status !== currentStatus) {
                  onStatusChange(status);
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.65rem',
                border: 'none',
                background: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.825rem',
                color: status === currentStatus ? '#4f46e5' : '#334155',
                fontWeight: status === currentStatus ? 700 : 500,
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span>{status}</span>
              {status === currentStatus && <Check size={14} color="#4f46e5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

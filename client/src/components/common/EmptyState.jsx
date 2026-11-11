import React from 'react';
import Button from './Button.jsx';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  description = 'No matching data was found with the applied filters or criteria.',
  icon: Icon = Inbox,
  actionText,
  onAction,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(198, 244, 50, 0.10)',
          border: '1px solid rgba(198, 244, 50, 0.25)',
          color: '#C6F432',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <Icon size={32} />
      </div>
      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.875rem', color: '#A1A1AA', maxWidth: '380px', marginBottom: '1.25rem' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

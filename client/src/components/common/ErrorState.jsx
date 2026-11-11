import React from 'react';
import Button from './Button.jsx';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Failed to load records',
  message = 'An unexpected error occurred while fetching information.',
  onRetry,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.14)',
          border: '1px solid rgba(239, 68, 68, 0.30)',
          color: '#FCA5A5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <AlertCircle size={28} />
      </div>
      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.875rem', color: '#A1A1AA', maxWidth: '420px', marginBottom: '1.25rem' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} icon={RefreshCw}>
          Retry Request
        </Button>
      )}
    </div>
  );
}

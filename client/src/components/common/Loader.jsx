import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ message = 'Loading records...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1rem',
        color: '#A1A1AA',
        gap: '0.85rem',
      }}
    >
      <Loader2
        size={36}
        style={{
          color: '#C6F432',
          animation: 'spin 1s linear infinite',
        }}
      />
      <span style={{ fontSize: '0.925rem', fontWeight: 500 }}>{message}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button.jsx';

export default function Pagination({
  page,
  limit,
  totalRecords,
  totalPages,
  onPageChange,
  onLimitChange,
}) {
  if (totalRecords === 0) return null;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, totalRecords);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: '#121314',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#A1A1AA' }}>
        <span>
          Showing <strong style={{ color: '#FFFFFF' }}>{startRecord}</strong> to <strong style={{ color: '#FFFFFF' }}>{endRecord}</strong> of <strong style={{ color: '#C6F432' }}>{totalRecords}</strong> records
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <label htmlFor="limit-select" style={{ fontSize: '0.825rem' }}>Rows per page:</label>
          <select
            id="limit-select"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.14)',
              fontSize: '0.85rem',
              backgroundColor: '#161816',
              color: '#FFFFFF',
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          icon={ChevronLeft}
        >
          Previous
        </Button>

        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#E4E4E7', padding: '0 0.5rem' }}>
          Page {page} of {Math.max(1, totalPages)}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

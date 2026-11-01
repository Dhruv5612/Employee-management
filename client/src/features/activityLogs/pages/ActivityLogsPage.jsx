import React, { useState, useEffect } from 'react';
import { auditLogApi } from '../services/auditLogApi.js';
import Loader from '../../../components/common/Loader.jsx';
import ErrorState from '../../../components/common/ErrorState.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import Pagination from '../../../components/common/Pagination.jsx';
import Modal from '../../../components/common/Modal.jsx';
import Button from '../../../components/common/Button.jsx';
import { formatDate } from '../../../utils/dateUtils.js';
import { Shield, Activity, Eye, Filter } from 'lucide-react';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalRecords: 0, totalPages: 0 });
  const [entityType, setEntityType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Changes Inspector Modal
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditLogApi.listLogs({
        page: pagination.page,
        limit: pagination.limit,
        entityType: entityType || undefined,
      });
      setLogs(data.logs || []);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, pagination.limit, entityType]);

  const getActionBadgeColor = (action) => {
    if (action.includes('CREATED') || action.includes('REGISTERED')) {
      return { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' };
    }
    if (action.includes('DELETED')) {
      return { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' };
    }
    if (action.includes('STATUS') || action.includes('REASSIGNED')) {
      return { bg: '#fffbeb', color: '#92400e', border: '#fde68a' };
    }
    return { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' };
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Activity & Audit Logs</h1>
          <p className="page-subtitle">Complete chronological trace of administrative and system operations</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="form-select"
            style={{ width: 'auto', minWidth: '160px', fontSize: '0.85rem' }}
          >
            <option value="">All Entity Types</option>
            <option value="Employee">Employee</option>
            <option value="Department">Department</option>
            <option value="User">User</option>
            <option value="System">System</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <Loader message="Loading activity records..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchLogs} />
        ) : logs.length === 0 ? (
          <EmptyState
            title="No activity records"
            description="There are currently no recorded audit logs matching your filter."
            icon={Activity}
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '180px' }}>Timestamp</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Entity Type</th>
                    <th>Entity ID</th>
                    <th style={{ textAlign: 'right', width: '100px' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const badge = getActionBadgeColor(log.action);
                    return (
                      <tr key={log._id}>
                        <td style={{ fontSize: '0.825rem', color: '#64748b' }}>
                          {formatDate(log.createdAt)} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>
                            {log.actor?.name || 'System Service'}
                          </div>
                          {log.actor?.role && (
                            <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                              {log.actor.role}
                            </span>
                          )}
                        </td>

                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '6px',
                              backgroundColor: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                              fontSize: '0.775rem',
                              fontWeight: 700,
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {log.action}
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 600, color: '#334155' }}>
                            {log.entityType}
                          </span>
                        </td>

                        <td>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.775rem',
                              color: '#64748b',
                            }}
                          >
                            {String(log.entityId).substring(0, 10)}...
                          </span>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Eye}
                            onClick={() => setSelectedLog(log)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              page={pagination.page}
              limit={pagination.limit}
              totalRecords={pagination.totalRecords}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
              onLimitChange={(l) => setPagination((prev) => ({ ...prev, limit: l, page: 1 }))}
            />
          </>
        )}
      </div>

      {/* Changes Inspector Modal */}
      {selectedLog && (
        <Modal
          isOpen={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          title={`Audit Log Record — ${selectedLog.action}`}
          maxWidth="600px"
          footer={
            <Button variant="secondary" onClick={() => setSelectedLog(null)}>
              Close
            </Button>
          }
        >
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748b' }}>Actor:</span>{' '}
                <strong>{selectedLog.actor?.name || 'System'}</strong> ({selectedLog.actor?.role || 'Service'})
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Timestamp:</span>{' '}
                <strong>{formatDate(selectedLog.createdAt)} {new Date(selectedLog.createdAt).toLocaleTimeString()}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Entity Type:</span>{' '}
                <strong>{selectedLog.entityType}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Entity ID:</span>{' '}
                <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{selectedLog.entityId}</strong>
              </div>
            </div>

            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b', marginBottom: '0.5rem' }}>
              Recorded Delta / Changes:
            </div>
            <pre
              style={{
                backgroundColor: '#0f172a',
                color: '#38bdf8',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                overflowX: 'auto',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {JSON.stringify(selectedLog.changes || {}, null, 2)}
            </pre>
          </div>
        </Modal>
      )}
    </div>
  );
}

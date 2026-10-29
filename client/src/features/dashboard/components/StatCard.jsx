import React from 'react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  colorScheme = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'slate' | 'violet'
}) {
  const schemeStyles = {
    indigo: {
      bg: 'rgba(99, 102, 241, 0.1)',
      iconColor: '#4f46e5',
      borderLeft: '4px solid #4f46e5',
    },
    emerald: {
      bg: 'rgba(16, 185, 129, 0.1)',
      iconColor: '#10b981',
      borderLeft: '4px solid #10b981',
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.1)',
      iconColor: '#f59e0b',
      borderLeft: '4px solid #f59e0b',
    },
    slate: {
      bg: 'rgba(100, 116, 139, 0.1)',
      iconColor: '#64748b',
      borderLeft: '4px solid #64748b',
    },
    violet: {
      bg: 'rgba(139, 92, 246, 0.1)',
      iconColor: '#8b5cf6',
      borderLeft: '4px solid #8b5cf6',
    },
  }[colorScheme] || {
    bg: 'rgba(99, 102, 241, 0.1)',
    iconColor: '#4f46e5',
    borderLeft: '4px solid #4f46e5',
  };

  return (
    <div className="stat-card" style={{ borderLeft: schemeStyles.borderLeft }}>
      <div>
        <span className="stat-label">{title}</span>
        <div className="stat-value">{value ?? 0}</div>
        {trend && (
          <span style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
            {trend}
          </span>
        )}
      </div>

      <div
        className="stat-icon-wrapper"
        style={{
          backgroundColor: schemeStyles.bg,
          color: schemeStyles.iconColor,
        }}
      >
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
}

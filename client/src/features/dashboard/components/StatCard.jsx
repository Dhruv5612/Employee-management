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
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      lightBg: '#eef2ff',
      textColor: '#4f46e5',
      borderColor: 'rgba(99, 102, 241, 0.2)',
    },
    emerald: {
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      lightBg: '#ecfdf5',
      textColor: '#059669',
      borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    amber: {
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      lightBg: '#fffbeb',
      textColor: '#b45309',
      borderColor: 'rgba(245, 158, 11, 0.2)',
    },
    slate: {
      gradient: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
      lightBg: '#f1f5f9',
      textColor: '#475569',
      borderColor: 'rgba(100, 116, 139, 0.2)',
    },
    violet: {
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      lightBg: '#faf5ff',
      textColor: '#7e22ce',
      borderColor: 'rgba(139, 92, 246, 0.2)',
    },
  }[colorScheme] || {
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    lightBg: '#eef2ff',
    textColor: '#4f46e5',
    borderColor: 'rgba(99, 102, 241, 0.2)',
  };

  return (
    <div
      className="bento-card"
      style={{
        padding: '1.35rem 1.4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: `1px solid ${schemeStyles.borderColor}`,
      }}
    >
      <div>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </span>
        <div
          style={{
            fontSize: '2.1rem',
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: 1.15,
            marginTop: '0.3rem',
            letterSpacing: '-0.03em',
          }}
        >
          {value ?? 0}
        </div>
        {trend && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginTop: '0.6rem',
              backgroundColor: schemeStyles.lightBg,
              color: schemeStyles.textColor,
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.725rem',
              fontWeight: 700,
            }}
          >
            {trend}
          </div>
        )}
      </div>

      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: schemeStyles.gradient,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 18px -4px ${schemeStyles.textColor}40`,
          flexShrink: 0,
        }}
      >
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
}

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
      gradient: 'linear-gradient(135deg, #C6F432 0%, #A6D11D 100%)',
      lightBg: 'rgba(198, 244, 50, 0.12)',
      textColor: '#C6F432',
      borderColor: 'rgba(99, 102, 241, 0.2)',
    },
    emerald: {
      gradient: 'linear-gradient(135deg, #C6F432 0%, #96BE16 100%)',
      lightBg: 'rgba(198, 244, 50, 0.12)',
      textColor: '#C6F432',
      borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    amber: {
      gradient: 'linear-gradient(135deg, #FDE047 0%, #EAB308 100%)',
      lightBg: 'rgba(250, 204, 21, 0.12)',
      textColor: '#FDE047',
      borderColor: 'rgba(245, 158, 11, 0.2)',
    },
    slate: {
      gradient: 'linear-gradient(135deg, #FFFFFF 0%, #D4D4D8 100%)',
      lightBg: 'rgba(255, 255, 255, 0.08)',
      textColor: '#E4E4E7',
      borderColor: 'rgba(100, 116, 139, 0.2)',
    },
    violet: {
      gradient: 'linear-gradient(135deg, #FFFFFF 0%, #C6F432 100%)',
      lightBg: 'rgba(255, 255, 255, 0.10)',
      textColor: '#FFFFFF',
      borderColor: 'rgba(139, 92, 246, 0.2)',
    },
  }[colorScheme] || {
    gradient: 'linear-gradient(135deg, #C6F432 0%, #A6D11D 100%)',
    lightBg: 'rgba(198, 244, 50, 0.12)',
    textColor: '#C6F432',
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
            color: '#A1A1AA',
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
            color: '#FFFFFF',
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
          color: '#0B0B0C',
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

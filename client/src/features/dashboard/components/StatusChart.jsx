import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function StatusChart({ data = [] }) {
  const COLORS = {
    Active: '#C6F432',
    Inactive: '#52525B',
    'On Leave': '#FFFFFF',
  };

  const chartData = data.filter((d) => d.count > 0);

  if (chartData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#71717A' }}>
        No status data available
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="count"
            nameKey="status"
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.status}`} fill={COLORS[entry.status] || '#A1A1AA'} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0];
                return (
                  <div
                    style={{
                      backgroundColor: '#141614',
                      color: '#ffffff',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                    <div style={{ color: COLORS[item.name] || '#A1A1AA', marginTop: '0.2rem' }}>
                      Headcount: <strong>{item.value}</strong>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span style={{ color: '#E4E4E7', fontSize: '0.85rem', fontWeight: 600 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

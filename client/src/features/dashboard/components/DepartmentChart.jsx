import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function DepartmentChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
        No department data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.departmentName,
    code: item.departmentCode,
    employees: item.employeeCount,
  }));

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 12 }}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={45}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            domain={[0, 'auto']}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div
                    style={{
                      backgroundColor: '#1e293b',
                      color: '#ffffff',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                    <div style={{ color: '#818cf8', marginTop: '0.2rem' }}>
                      Employees: <strong>{item.employees}</strong>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="employees"
            fill="#4f46e5"
            radius={[6, 6, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

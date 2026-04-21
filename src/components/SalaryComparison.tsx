import React from 'react';

interface Row {
  label: string;
  salary: number;
  isCurrent?: boolean;
  url?: string;
}

interface Props {
  title: string;
  rows: Row[];
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n);
}

export default function SalaryComparison({ title, rows }: Props) {
  const max = Math.max(...rows.map((r) => r.salary));
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <h3 style={{ margin: '0 0 .75rem' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
        {rows.map((r) => (
          <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 100px', gap: '.75rem', alignItems: 'center', fontSize: '.92rem' }}>
            <div style={{ fontWeight: r.isCurrent ? 700 : 500, color: r.isCurrent ? '#0369a1' : '#0f172a' }}>
              {r.url ? <a href={r.url}>{r.label}</a> : r.label}
            </div>
            <div style={{ background: '#e2e8f0', borderRadius: 6, height: 22, position: 'relative' }}>
              <div
                style={{
                  width: `${(r.salary / max) * 100}%`,
                  height: '100%',
                  background: r.isCurrent ? '#0369a1' : '#7dd3fc',
                  borderRadius: 6,
                }}
              />
            </div>
            <div style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(r.salary)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

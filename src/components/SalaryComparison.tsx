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
    <div style={{ margin: '1.75rem 0' }}>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '.72rem', color: 'var(--ink-3)', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '.08em',
        margin: '0 0 .85rem',
      }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
        {rows.map((r) => (
          <div
            key={r.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr 110px',
              gap: '1rem',
              alignItems: 'center',
              fontSize: '.92rem',
            }}
          >
            <div
              style={{
                fontWeight: r.isCurrent ? 600 : 500,
                color: r.isCurrent ? 'var(--ink-1)' : 'var(--ink-2)',
                fontFamily: r.isCurrent ? 'var(--font-display)' : 'var(--font-body)',
                fontSize: r.isCurrent ? '1rem' : '.92rem',
              }}
            >
              {r.url ? (
                <a href={r.url} style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid transparent' }}>
                  {r.label}
                </a>
              ) : r.label}
            </div>
            <div
              style={{
                background: 'var(--surface-2)',
                borderRadius: 2,
                height: 18,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: `${(r.salary / max) * 100}%`,
                  height: '100%',
                  background: r.isCurrent ? 'var(--ink-1)' : 'var(--rule-strong)',
                  borderRadius: 2,
                  transition: 'width .3s ease',
                }}
              />
            </div>
            <div
              style={{
                textAlign: 'right',
                fontWeight: r.isCurrent ? 700 : 500,
                color: r.isCurrent ? 'var(--ink-1)' : 'var(--ink-2)',
                fontVariantNumeric: 'tabular-nums',
                fontFamily: 'var(--font-display)',
                fontVariationSettings: '"opsz" 96',
                fontSize: r.isCurrent ? '1.05rem' : '.95rem',
              }}
            >
              {fmt(r.salary)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

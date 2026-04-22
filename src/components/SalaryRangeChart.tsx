import React from 'react';

interface Props {
  lowerQuartile: number;
  median: number;
  upperQuartile: number;
  minimum?: number;
  maximum?: number;
  title?: string;
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(n);
}

export default function SalaryRangeChart({ lowerQuartile, median, upperQuartile, minimum, maximum, title }: Props) {
  const lo = minimum ?? lowerQuartile * 0.7;
  const hi = maximum ?? upperQuartile * 1.4;
  const span = hi - lo;
  const pct = (v: number) => ((v - lo) / span) * 100;

  const lqPos = pct(lowerQuartile);
  const medPos = pct(median);
  const uqPos = pct(upperQuartile);

  return (
    <div style={{ margin: '2rem 0 1.5rem' }}>
      {title && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '.72rem', color: 'var(--ink-3)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.85rem',
        }}>{title}</p>
      )}
      <div
        style={{
          position: 'relative',
          height: 10,
          background: 'var(--surface-3)',
          borderRadius: 2,
          overflow: 'visible',
        }}
        role="img"
        aria-label={`Salary range: lower quartile ${fmt(lowerQuartile)}, median ${fmt(median)}, upper quartile ${fmt(upperQuartile)}`}
      >
        {/* Inter-quartile fill */}
        <div
          style={{
            position: 'absolute',
            left: `${lqPos}%`,
            width: `${uqPos - lqPos}%`,
            height: '100%',
            background: 'var(--ink-1)',
            borderRadius: 2,
          }}
        />
        {/* Median tick */}
        <div
          style={{
            position: 'absolute',
            left: `${medPos}%`,
            top: -6,
            transform: 'translateX(-50%)',
            width: 2,
            height: 22,
            background: 'var(--highlight)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${medPos}%`,
            top: -22,
            transform: 'translateX(-50%)',
            fontSize: '.7rem',
            fontWeight: 600,
            color: 'var(--highlight)',
            fontFamily: 'var(--font-body)',
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            whiteSpace: 'nowrap',
          }}
        >
          Median
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '.78rem',
          color: 'var(--ink-3)',
          marginTop: '.6rem',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span>{fmt(lo)}</span>
        <span>{fmt(hi)}</span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginTop: '1.25rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--rule)',
        }}
      >
        <Stat label="Lower quartile" value={fmt(lowerQuartile)} />
        <Stat label="Median" value={fmt(median)} highlight />
        <Stat label="Upper quartile" value={fmt(upperQuartile)} align="right" />
      </div>
    </div>
  );
}

function Stat({ label, value, highlight, align }: { label: string; value: string; highlight?: boolean; align?: 'right' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.2rem', textAlign: align === 'right' ? 'right' : (highlight ? 'center' : 'left') }}>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '.7rem', color: 'var(--ink-3)', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '.08em',
      }}>{label}</span>
      <strong style={{
        fontFamily: 'var(--font-display)', fontVariationSettings: '"opsz" 96',
        fontSize: '1.25rem', fontWeight: 600,
        color: highlight ? 'var(--highlight)' : 'var(--ink-1)',
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-.015em',
      }}>{value}</strong>
    </div>
  );
}

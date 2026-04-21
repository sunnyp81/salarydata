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
    <div style={{ margin: '1.5rem 0' }}>
      {title && <p style={{ fontSize: '.9rem', color: '#475569', marginBottom: '.5rem' }}>{title}</p>}
      <div
        style={{
          position: 'relative',
          height: 14,
          background: '#e2e8f0',
          borderRadius: 7,
          overflow: 'visible',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: `${lqPos}%`,
            width: `${uqPos - lqPos}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #7dd3fc, #0369a1)',
            borderRadius: 7,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${medPos}%`,
            top: -4,
            transform: 'translateX(-50%)',
            width: 4,
            height: 22,
            background: '#0f172a',
            borderRadius: 2,
          }}
          aria-label={`Median ${fmt(median)}`}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '.8rem',
          color: '#475569',
          marginTop: '.5rem',
        }}
      >
        <span>{fmt(lo)}</span>
        <span>{fmt(hi)}</span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '.5rem',
          marginTop: '.75rem',
          fontSize: '.85rem',
        }}
      >
        <div><strong style={{ display: 'block' }}>{fmt(lowerQuartile)}</strong><span style={{ color: '#475569' }}>Lower quartile</span></div>
        <div style={{ textAlign: 'center' }}><strong style={{ display: 'block', color: '#0369a1' }}>{fmt(median)}</strong><span style={{ color: '#475569' }}>Median</span></div>
        <div style={{ textAlign: 'right' }}><strong style={{ display: 'block' }}>{fmt(upperQuartile)}</strong><span style={{ color: '#475569' }}>Upper quartile</span></div>
      </div>
    </div>
  );
}

import React from 'react';
import type { ReedJobListing } from '../lib/reedApi';

interface Props {
  listings: ReedJobListing[];
  jobTitle: string;
  location: string;
  estimateCount: number;
  reedUrl: string;
}

function fmtSalary(min: number | null, max: number | null): string {
  if (!min && !max) return 'Salary not disclosed';
  if (min && max && min !== max) return `£${min.toLocaleString()} – £${max.toLocaleString()}`;
  return `£${(min ?? max)?.toLocaleString()}`;
}

function daysAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff}d ago`;
}

export default function JobListingsWidget({ listings, jobTitle, location, estimateCount, reedUrl }: Props) {
  const count = listings.length > 0 ? listings.length : estimateCount;

  if (listings.length === 0) {
    return (
      <div
        style={{
          padding: '1.4rem 1.6rem',
          border: '1px solid var(--rule)',
          borderLeft: '3px solid var(--accent)',
          borderRadius: '0 var(--r-md) var(--r-md) 0',
          background: 'var(--accent-tint)',
          margin: '2rem 0',
        }}
      >
        <p style={kickerStyle}>Open vacancies · via Reed</p>
        <h3 style={titleStyle}>{count.toLocaleString()} live {jobTitle} jobs in {location}</h3>
        <p style={{ margin: '.4rem 0 1rem', color: 'var(--ink-2)', fontSize: '.95rem' }}>
          Live listings refresh daily. View the full set on Reed.
        </p>
        <a href={reedUrl} className="btn" rel="sponsored nofollow" target="_blank">
          See all {jobTitle} jobs in {location} →
        </a>
      </div>
    );
  }

  return (
    <div style={{ margin: '2rem 0' }}>
      <p style={kickerStyle}>Open vacancies · via Reed</p>
      <h3 style={titleStyle}>Live {jobTitle} jobs in {location}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
        {listings.map((job) => (
          <li
            key={job.jobId}
            style={{
              padding: '.95rem 1.25rem',
              border: '1px solid var(--rule)',
              borderRadius: 'var(--r-md)',
              background: 'var(--surface-1)',
            }}
          >
            <a
              href={job.jobUrl}
              rel="sponsored nofollow"
              target="_blank"
              style={{
                fontFamily: 'var(--font-display)', fontWeight: 600,
                color: 'var(--ink-1)', fontSize: '1rem', letterSpacing: '-.01em',
                textDecoration: 'none', borderBottom: '1px solid transparent',
              }}
            >
              {job.jobTitle}
            </a>
            <div style={{ fontSize: '.85rem', color: 'var(--ink-3)', marginTop: '.3rem', fontVariantNumeric: 'tabular-nums' }}>
              {job.employerName} · {job.locationName} · {fmtSalary(job.minimumSalary, job.maximumSalary)} · {daysAgo(job.datePosted)}
            </div>
          </li>
        ))}
      </ul>
      <a href={reedUrl} className="btn" rel="sponsored nofollow" target="_blank">
        See all {count.toLocaleString()}+ {jobTitle} jobs in {location} →
      </a>
    </div>
  );
}

const kickerStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '.72rem',
  color: 'var(--ink-3)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '.08em',
  margin: '0 0 .35rem',
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontVariationSettings: '"opsz" 96',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--ink-1)',
  margin: 0,
  letterSpacing: '-.015em',
};

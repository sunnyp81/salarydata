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
  return `${diff} days ago`;
}

export default function JobListingsWidget({ listings, jobTitle, location, estimateCount, reedUrl }: Props) {
  const count = listings.length > 0 ? listings.length : estimateCount;

  if (listings.length === 0) {
    return (
      <div
        style={{
          padding: '1.25rem 1.5rem',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          background: '#f8fafc',
          margin: '1.5rem 0',
        }}
      >
        <h3 style={{ margin: '0 0 .5rem' }}>Live {jobTitle} jobs in {location}</h3>
        <p style={{ margin: '0 0 1rem', color: '#475569' }}>
          There are approximately {count.toLocaleString()} {jobTitle} roles open in {location} right now.
        </p>
        <a href={reedUrl} className="btn" rel="sponsored nofollow" target="_blank">
          See all {jobTitle} jobs in {location} →
        </a>
      </div>
    );
  }

  return (
    <div style={{ margin: '1.5rem 0' }}>
      <h3 style={{ margin: '0 0 .75rem' }}>Live {jobTitle} jobs in {location}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
        {listings.map((job) => (
          <li
            key={job.jobId}
            style={{
              padding: '.85rem 1.1rem',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              background: '#fff',
            }}
          >
            <a href={job.jobUrl} rel="sponsored nofollow" target="_blank" style={{ fontWeight: 600, color: '#0f172a' }}>
              {job.jobTitle}
            </a>
            <div style={{ fontSize: '.88rem', color: '#475569', marginTop: '.25rem' }}>
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

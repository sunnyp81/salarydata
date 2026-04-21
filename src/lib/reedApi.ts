// Reed API client.
// Auth: HTTP Basic with REED_API_KEY as username, empty password.
// Docs: https://www.reed.co.uk/developers/jobseeker
// Rate limit: be polite — 1 req/sec from build script; runtime calls should hit cached JSON.

export interface ReedJobListing {
  jobId: number;
  jobTitle: string;
  employerName: string;
  locationName: string;
  minimumSalary: number | null;
  maximumSalary: number | null;
  currency: string | null;
  datePosted: string; // ISO
  jobUrl: string;
  jobDescription: string;
}

export interface ReedSearchParams {
  keywords: string;
  locationName?: string;
  distanceFromLocation?: number;
  resultsToTake?: number;
  resultsToSkip?: number;
}

const REED_BASE = 'https://www.reed.co.uk/api/1.0/search';

function authHeader(): string {
  const key = process.env.REED_API_KEY ?? '';
  // Basic auth: base64(username:password) where username = API key, password = empty.
  const b64 = Buffer.from(`${key}:`).toString('base64');
  return `Basic ${b64}`;
}

export async function searchReedJobs(params: ReedSearchParams): Promise<ReedJobListing[]> {
  if (!process.env.REED_API_KEY) {
    console.warn('[reed] REED_API_KEY not set — returning empty result');
    return [];
  }

  const qs = new URLSearchParams();
  qs.set('keywords', params.keywords);
  if (params.locationName) qs.set('locationName', params.locationName);
  if (params.distanceFromLocation) qs.set('distanceFromLocation', String(params.distanceFromLocation));
  qs.set('resultsToTake', String(params.resultsToTake ?? 5));
  if (params.resultsToSkip) qs.set('resultsToSkip', String(params.resultsToSkip));

  const url = `${REED_BASE}?${qs.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: authHeader(), Accept: 'application/json' },
  });

  if (!res.ok) {
    console.error(`[reed] ${res.status} ${res.statusText} for ${params.keywords} / ${params.locationName ?? 'UK'}`);
    return [];
  }

  const json = (await res.json()) as { results?: ReedJobListing[] };
  return json.results ?? [];
}

// Runtime client-side search URL (for JobListingsWidget to hit a Worker proxy if added later)
export function reedSearchUrl(jobTitle: string, location: string): string {
  const slug = jobTitle.toLowerCase().replace(/\s+/g, '-');
  const loc = location.toLowerCase().replace(/\s+/g, '-');
  return `https://www.reed.co.uk/jobs/${slug}-jobs-in-${loc}`;
}

// Sleep helper for rate-limited build scripts
export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

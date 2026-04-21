// Static build-time cache for Reed job listings.
// Persisted at data/cache/reed-{job}-{loc}.json (gitignored).

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ReedJobListing } from './reedApi';

const CACHE_DIR = resolve(process.cwd(), 'data/cache');

export function readReedCache(jobSlug: string, locationSlug: string): ReedJobListing[] | null {
  const path = `${CACHE_DIR}/reed-${jobSlug}-${locationSlug}.json`;
  if (!existsSync(path)) return null;
  try {
    const raw = readFileSync(path, 'utf-8');
    const parsed = JSON.parse(raw) as { listings: ReedJobListing[]; cachedAt: string };
    const ageHours = (Date.now() - new Date(parsed.cachedAt).getTime()) / 36e5;
    if (ageHours > 24) return null;
    return parsed.listings;
  } catch {
    return null;
  }
}

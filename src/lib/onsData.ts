// ONS ASHE data helpers. Salary adjustments by location.
// National median × locationMultiplier → location median.
// Cost-of-living adjustment: nominal salary ÷ (locationCoL / 100).

import type { CollectionEntry } from 'astro:content';

type JobEntry = CollectionEntry<'jobs'>['data'];
type LocationEntry = CollectionEntry<'locations'>['data'];

export interface LocationAdjustedSalary {
  median: number;
  lowerQuartile: number;
  upperQuartile: number;
  minimum: number;
  maximum: number;
  entry: number;
  senior: number;
  costOfLivingAdjusted: number; // real purchasing power vs UK average (CoL 100)
  activeJobListingsEstimate: number;
  multiplier: number;
}

export function adjustSalaryForLocation(job: JobEntry, location: LocationEntry): LocationAdjustedSalary {
  const mult = location.locationMultiplier;
  const median = Math.round(job.nationalMedianSalary * mult);
  const lowerQuartile = Math.round(job.nationalLowerQuartile * mult);
  const upperQuartile = Math.round(job.nationalUpperQuartile * mult);
  const minimum = Math.round(job.nationalMinimum * mult);
  const maximum = Math.round(job.nationalMaximum * mult);
  const entry = Math.round(job.entryLevelSalary * mult);
  const senior = Math.round(job.seniorLevelSalary * mult);

  // Real purchasing power — divide by CoL index ratio
  const costOfLivingAdjusted = Math.round(median / (location.costOfLivingIndex / 100));

  // Rough active-listings estimate: scales with population × growth outlook
  const growthFactor = job.growthOutlook === 'high' ? 1.6 : job.growthOutlook === 'medium' ? 1.0 : job.growthOutlook === 'low' ? 0.5 : 0.2;
  const activeJobListingsEstimate = Math.max(1, Math.round((location.population / 100000) * growthFactor * 1.2));

  return {
    median,
    lowerQuartile,
    upperQuartile,
    minimum,
    maximum,
    entry,
    senior,
    costOfLivingAdjusted,
    activeJobListingsEstimate,
    multiplier: mult,
  };
}

export function experienceBands(job: JobEntry, mult: number) {
  // Four experience bands: Entry, Mid, Senior, Lead
  const e = job.entryLevelSalary * mult;
  const s = job.seniorLevelSalary * mult;
  const m = job.nationalMedianSalary * mult;
  const lead = s * 1.25;
  return [
    { level: 'Entry (0-2 yrs)', min: Math.round(e * 0.9), max: Math.round(e * 1.15) },
    { level: 'Mid (3-5 yrs)', min: Math.round(m * 0.85), max: Math.round(m * 1.1) },
    { level: 'Senior (6-10 yrs)', min: Math.round(s * 0.9), max: Math.round(s * 1.15) },
    { level: 'Lead (10+ yrs)', min: Math.round(lead * 0.95), max: Math.round(lead * 1.3) },
  ];
}

export function formatJobTitle(slug: string): string {
  return slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

// Lateral linking helpers — surface relevant URLs the user (and crawler) would want next.

interface LocCol { data: LocationEntry; }
interface JobCol { data: JobEntry; }

const REGION_NEIGHBOURS: Record<string, string[]> = {
  'Greater London': ['South East', 'East of England'],
  'South East': ['Greater London', 'South West', 'East of England'],
  'South West': ['South East', 'Wales', 'West Midlands'],
  'East of England': ['Greater London', 'South East', 'East Midlands'],
  'East Midlands': ['West Midlands', 'East of England', 'Yorkshire'],
  'West Midlands': ['East Midlands', 'Wales', 'South West'],
  'Yorkshire': ['North West', 'North East', 'East Midlands'],
  'North West': ['Yorkshire', 'North East', 'Wales'],
  'North East': ['Yorkshire', 'North West', 'Scotland'],
  'Scotland': ['North East'],
  'Wales': ['West Midlands', 'South West', 'North West'],
  'Northern Ireland': ['Scotland'],
};

export function nearbyCities(allLocations: LocCol[], current: LocationEntry, take = 4): LocationEntry[] {
  const sameRegion = allLocations.filter((l) => l.data.region === current.region && l.data.slug !== current.slug);
  const neighbourRegions = REGION_NEIGHBOURS[current.region] ?? [];
  const adjacent = allLocations.filter((l) => neighbourRegions.includes(l.data.region));
  const ordered = [...sameRegion, ...adjacent]
    .sort((a, b) => Math.abs(a.data.locationMultiplier - current.locationMultiplier) - Math.abs(b.data.locationMultiplier - current.locationMultiplier));
  // Dedupe
  const seen = new Set<string>();
  const out: LocationEntry[] = [];
  for (const l of ordered) {
    if (seen.has(l.data.slug)) continue;
    seen.add(l.data.slug);
    out.push(l.data);
    if (out.length >= take) break;
  }
  return out;
}

export function sameCategoryJobsIn(allJobs: JobCol[], currentJob: JobEntry, take = 4): JobEntry[] {
  return allJobs
    .filter((j) => j.data.category === currentJob.category && j.data.slug !== currentJob.slug)
    .slice(0, take)
    .map((j) => j.data);
}

export function topJobsInCity(allJobs: JobCol[], location: LocationEntry, take = 5): JobEntry[] {
  return [...allJobs]
    .map((j) => j.data)
    .sort((a, b) => b.nationalMedianSalary * location.locationMultiplier - a.nationalMedianSalary * location.locationMultiplier)
    .slice(0, take);
}

export function highestPayingCitiesFor(job: JobEntry, allLocations: LocCol[], take = 10) {
  return [...allLocations]
    .map((l) => ({
      slug: l.data.slug,
      name: l.data.name,
      region: l.data.region,
      median: Math.round(job.nationalMedianSalary * l.data.locationMultiplier),
      diff: Math.round((l.data.locationMultiplier - 1) * 100),
    }))
    .sort((a, b) => b.median - a.median)
    .slice(0, take);
}

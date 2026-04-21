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

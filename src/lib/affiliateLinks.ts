// Affiliate link builders with UTM tracking.

const REED_AFFILIATE_PARAM = 'source=salarydata'; // TODO: replace with real Reed affiliate ID when approved

export function reedJobsLink(jobSlug: string, locationSlug?: string, campaign?: string): string {
  const base = locationSlug
    ? `https://www.reed.co.uk/jobs/${jobSlug}-jobs-in-${locationSlug}`
    : `https://www.reed.co.uk/jobs/${jobSlug}-jobs`;
  const utm = [
    'utm_source=salarydata',
    'utm_medium=salary-page',
    campaign ? `utm_campaign=${campaign}` : 'utm_campaign=organic',
    REED_AFFILIATE_PARAM,
  ].join('&');
  return `${base}?${utm}`;
}

export function topCvLink(campaign?: string): string {
  const base = import.meta.env.TOPCV_AFFILIATE_URL ?? 'https://www.topcv.co.uk/cv-review';
  const sep = base.includes('?') ? '&' : '?';
  const utm = [
    'utm_source=salarydata',
    'utm_medium=cv-cta',
    campaign ? `utm_campaign=${campaign}` : 'utm_campaign=organic',
  ].join('&');
  return `${base}${sep}${utm}`;
}

export function cvLibraryLink(campaign?: string): string {
  const base = import.meta.env.CVLIBRARY_AFFILIATE_URL ?? 'https://www.cv-library.co.uk/';
  const sep = base.includes('?') ? '&' : '?';
  const utm = [
    'utm_source=salarydata',
    'utm_medium=cv-cta',
    campaign ? `utm_campaign=${campaign}` : 'utm_campaign=organic',
  ].join('&');
  return `${base}${sep}${utm}`;
}

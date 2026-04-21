// Build-time prefetch of top job/city Reed listings → data/cache/reed-*.json
// Run before `astro build`: pnpm prefetch:jobs
// Rate: 1 req/sec. Caches 24h.

import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { searchReedJobs, sleep } from '../src/lib/reedApi';

const CACHE_DIR = resolve(process.cwd(), 'data/cache');
const JOBS_DIR = resolve(process.cwd(), 'src/content/jobs');
const LOCS_DIR = resolve(process.cwd(), 'src/content/locations');

// Top 50 = top 10 jobs × top 5 cities (by population/multiplier) to stay inside Reed rate limits.
const TOP_JOB_SLUGS = [
  'software-engineer',
  'product-manager',
  'data-analyst',
  'marketing-manager',
  'accountant',
  'nurse',
  'project-manager',
  'solicitor',
  'seo-manager',
  'devops-engineer',
];
const TOP_LOCATION_SLUGS = ['london', 'manchester', 'birmingham', 'leeds', 'bristol'];

async function main() {
  if (!process.env.REED_API_KEY) {
    console.log('[prefetch] REED_API_KEY not set — skipping prefetch (pages will show estimate counts only)');
    return;
  }
  mkdirSync(CACHE_DIR, { recursive: true });

  const jobs = readdirSync(JOBS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(resolve(JOBS_DIR, f), 'utf-8')) as { slug: string; title: string });
  const locs = readdirSync(LOCS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(resolve(LOCS_DIR, f), 'utf-8')) as { slug: string; name: string });

  const targets = TOP_JOB_SLUGS.flatMap((js) =>
    TOP_LOCATION_SLUGS.map((ls) => ({ js, ls }))
  );

  let ok = 0;
  for (const { js, ls } of targets) {
    const job = jobs.find((j) => j.slug === js);
    const loc = locs.find((l) => l.slug === ls);
    if (!job || !loc) continue;
    try {
      const listings = await searchReedJobs({
        keywords: job.title,
        locationName: loc.name,
        distanceFromLocation: 10,
        resultsToTake: 5,
      });
      writeFileSync(
        resolve(CACHE_DIR, `reed-${js}-${ls}.json`),
        JSON.stringify({ cachedAt: new Date().toISOString(), listings }, null, 2)
      );
      ok++;
      console.log(`[prefetch] ${js} / ${ls}: ${listings.length} listings`);
    } catch (e) {
      console.warn(`[prefetch] failed ${js} / ${ls}:`, e);
    }
    await sleep(1100); // 1 req/sec
  }
  console.log(`[prefetch] done — cached ${ok}/${targets.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

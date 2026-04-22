// Push priority URLs to Google Indexing API.
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node scripts/pushToIndexingApi.mjs
//
// Requires:
//   1. Domain ownership verified in Google Search Console
//   2. Service account added as "Owner" of the GSC property
//   3. Indexing API enabled in the GCP project
//   4. Service account JSON key file path in GOOGLE_APPLICATION_CREDENTIALS env var
//
// Notes:
//   - Indexing API quota: 200 URLs/day per project by default
//   - Officially intended for JobPosting and BroadcastEvent only — works for other content but
//     unsupported. Use sitemap submission as primary discovery mechanism, this as accelerator.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { google } from 'googleapis';

const SITE = 'https://salarydata.co.uk';

// 30 priority URLs to push first — homepage, calculator, top hubs, top money pages
const PRIORITY_URLS = [
  '/',
  '/salary-calculator/',
  '/salary/',
  '/location/',
  '/methodology/',
  '/directory/',
  '/about/',
  // Top job hubs
  '/salary/software-engineer/',
  '/salary/product-manager/',
  '/salary/data-analyst/',
  '/salary/marketing-manager/',
  '/salary/accountant/',
  '/salary/nurse/',
  '/salary/solicitor/',
  '/salary/devops-engineer/',
  '/salary/seo-manager/',
  '/salary/financial-analyst/',
  // Top city hubs
  '/location/london/',
  '/location/manchester/',
  '/location/birmingham/',
  '/location/edinburgh/',
  '/location/bristol/',
  '/location/leeds/',
  '/location/cambridge/',
  // Highest-traffic-likely money pages
  '/salary/software-engineer/london/',
  '/salary/data-analyst/london/',
  '/salary/product-manager/london/',
  '/salary/nurse/london/',
  '/salary/marketing-manager/manchester/',
  '/salary/accountant/birmingham/',
];

async function main() {
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath) {
    console.error('GOOGLE_APPLICATION_CREDENTIALS not set');
    process.exit(1);
  }
  const creds = JSON.parse(readFileSync(resolve(credPath), 'utf-8'));

  const jwt = new google.auth.JWT(
    creds.client_email,
    undefined,
    creds.private_key,
    ['https://www.googleapis.com/auth/indexing']
  );
  await jwt.authorize();

  const indexing = google.indexing({ version: 'v3', auth: jwt });

  let ok = 0, fail = 0;
  for (const path of PRIORITY_URLS) {
    const url = `${SITE}${path}`;
    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' },
      });
      console.log(`✓ ${url}`);
      ok++;
    } catch (e) {
      console.error(`✗ ${url}: ${e.message}`);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 250)); // gentle rate
  }
  console.log(`\nDone — ${ok} ok, ${fail} failed (of ${PRIORITY_URLS.length})`);
}

main().catch((e) => { console.error(e); process.exit(1); });

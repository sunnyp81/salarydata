// Wave publishing config.
// Fresh domains get penalised for dumping 600+ templated pages on day one (see calculator.place
// Mar 2026 demotion). We noindex the long tail and release in waves, training Google to treat
// the site as a quality publication first, programmatic index second.
//
// All hubs, tools and company pages index from week 1.
// Money pages: only 30 whitelisted slug pairs index in week 1 — the highest-value combinations
// (top 6 cities × top 5 jobs). Everything else gets `<meta name=robots content="noindex, follow">`
// so crawlers still traverse internal links but don't rank the page.
//
// To release a new wave, add slug pairs to INDEXED_MONEY_PAGES below and redeploy.
// Cadence: 50 pages/week after week 1; re-evaluate every 30 days from GSC impression signals.

const INDEXED_JOB_HUBS = true;      // all 30 job hubs → indexed
const INDEXED_CITY_HUBS = true;     // all 20 city hubs → indexed
const INDEXED_COMPANY_PAGES = true; // all 5 company pages → indexed

// Week 1 money pages: 30 highest-value job × city combinations.
// Derived from: top 6 UK cities by population/multiplier × top 5 job categories by search volume.
const INDEXED_MONEY_PAGES = new Set<string>([
  // Software Engineer — high-volume tech query
  'software-engineer/london',
  'software-engineer/manchester',
  'software-engineer/edinburgh',
  'software-engineer/bristol',
  'software-engineer/cambridge',
  'software-engineer/birmingham',

  // Data Analyst — high-volume tech query
  'data-analyst/london',
  'data-analyst/manchester',
  'data-analyst/birmingham',

  // Product Manager — premium salary query
  'product-manager/london',
  'product-manager/manchester',
  'product-manager/edinburgh',

  // Nurse — highest-volume UK salary query
  'nurse/london',
  'nurse/manchester',
  'nurse/birmingham',
  'nurse/edinburgh',
  'nurse/leeds',
  'nurse/bristol',

  // Teacher equivalent — Marketing Manager gives us a large addressable commercial category
  'marketing-manager/london',
  'marketing-manager/manchester',
  'marketing-manager/birmingham',

  // Accountant — high-volume finance query
  'accountant/london',
  'accountant/manchester',
  'accountant/birmingham',
  'accountant/edinburgh',

  // Solicitor — commercial legal query
  'solicitor/london',
  'solicitor/manchester',
  'solicitor/birmingham',

  // GP — highest-paid healthcare query
  'gp/london',
  'gp/manchester',
]);

export function isMoneyPageIndexed(jobSlug: string, locationSlug: string): boolean {
  return INDEXED_MONEY_PAGES.has(`${jobSlug}/${locationSlug}`);
}

export function isJobHubIndexed(_jobSlug: string): boolean {
  return INDEXED_JOB_HUBS;
}

export function isCityHubIndexed(_locationSlug: string): boolean {
  return INDEXED_CITY_HUBS;
}

export function isCompanyPageIndexed(_companySlug: string): boolean {
  return INDEXED_COMPANY_PAGES;
}

export const INDEXED_MONEY_PAGE_COUNT = INDEXED_MONEY_PAGES.size;

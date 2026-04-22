// JSON-LD schema builders.

interface BreadcrumbItem { name: string; url: string; }
interface FaqItem { question: string; answer: string; }

const SITE = 'https://salarydata.co.uk';

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE}${item.url}`,
    })),
  };
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

interface OccupationSchemaInput {
  name: string;
  description: string;
  occupationLocation: string;
  medianSalary: number;
  lowerSalary: number;
  upperSalary: number;
  skills: string[];
  url: string;
}

export function buildOccupationSchema(o: OccupationSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Occupation',
    name: o.name,
    description: o.description,
    occupationLocation: {
      '@type': 'City',
      name: o.occupationLocation,
      address: { '@type': 'PostalAddress', addressCountry: 'GB' },
    },
    estimatedSalary: [
      {
        '@type': 'MonetaryAmountDistribution',
        name: 'base',
        currency: 'GBP',
        duration: 'P1Y',
        percentile10: o.lowerSalary,
        median: o.medianSalary,
        percentile90: o.upperSalary,
      },
    ],
    skills: o.skills.join(', '),
    url: o.url.startsWith('http') ? o.url : `${SITE}${o.url}`,
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SalaryData',
    url: SITE,
    description: 'UK salary data, take-home pay calculator, and job market intelligence by role and city.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE}/search/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: 'SalaryData',
    url: SITE,
    logo: `${SITE}/logo.svg`,
    description: 'UK salary data and take-home pay calculator, sourced from ONS Annual Survey of Hours and Earnings.',
    foundingDate: '2026-04-22',
    founder: { '@id': `${SITE}/about/#editor` },
    sameAs: [],
  };
}

export function buildEditorPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE}/about/#editor`,
    name: 'Sunny Patel',
    jobTitle: 'Editor',
    url: `${SITE}/about/`,
    description: 'SEO consultant and data-site operator with ten-plus years building UK-focused information products.',
    worksFor: { '@id': `${SITE}/#organization` },
    knowsAbout: [
      'UK labour market',
      'ONS Annual Survey of Hours and Earnings',
      'UK income tax 2024/25',
      'National Insurance',
      'Regional pay differentials',
    ],
    sameAs: [
      'https://sunnypatel.co.uk',
      'https://www.linkedin.com/in/sunnypatelseo',
    ],
  };
}

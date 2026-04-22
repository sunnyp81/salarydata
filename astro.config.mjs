import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Read publishConfig's whitelist at config time to exclude noindex'd money pages from the sitemap.
// Anything matching /salary/{job}/{city}/ must be in the whitelist to be indexed + sitemapped.
const publishConfigSrc = readFileSync(resolve('src/lib/publishConfig.ts'), 'utf-8');
const whitelistMatch = publishConfigSrc.match(/INDEXED_MONEY_PAGES = new Set<string>\(\[([\s\S]*?)\]\)/);
const indexedMoneyPages = new Set();
if (whitelistMatch) {
  const inner = whitelistMatch[1];
  const pairs = inner.match(/'([a-z0-9-]+\/[a-z0-9-]+)'/g) ?? [];
  for (const p of pairs) {
    indexedMoneyPages.add(p.replace(/'/g, ''));
  }
}

export default defineConfig({
  site: 'https://salarydata.co.uk',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => {
        // Only /salary/{job}/{city}/ pages are gated — hubs/tools always in sitemap.
        const m = page.match(/\/salary\/([^/]+)\/([^/]+)\/$/);
        if (!m) return true;
        return indexedMoneyPages.has(`${m[1]}/${m[2]}`);
      },
    }),
  ],
  prefetch: { defaultStrategy: 'hover' },
});

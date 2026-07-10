# salarydata — Project Brain

> Per-repo brain, migrated from central claude-memory 2026-06-20. Canonical project memory now lives here.

## Brain

- **Jul 10 2026:** GA4 property 538515864 was returning zero rows. Root cause: the gtag snippet (G-8QQ1H756ZY) was already correct in `src/layouts/BaseLayout.astro` and already committed to git (commits `5a9564a`, `3c5c994`), but this repo deploys via manual `wrangler pages deploy`, not on git push, so the fix had never actually shipped to Cloudflare Pages. Ran `npm run build` then `npx wrangler pages deploy dist --project-name salarydata --commit-dirty=true`; confirmed live via curl on both `https://salarydata.pages.dev` and `https://salarydata.co.uk` that the page now serves `gtag/js?id=G-8QQ1H756ZY` and `gtag('config','G-8QQ1H756ZY')`. No source changes needed, no new commit (dist/ is gitignored). Sunny still needs to mark key events in the GA4 UI once real traffic starts flowing.

## Current state

- **What:** salarydata.co.uk — UK programmatic salary site targeting "[job title] salary in [UK city]". Money via Reed/TotalJobs CPC + TopCV/CVLibrary CV-review affiliate. Differentiator: data-trust (ONS ASHE source + sample size + last-updated + method) and a signature percentile range bar.
- **Stack:** Astro 5 + React islands + TypeScript, Cloudflare Pages (CF project `salarydata`, sunnypat81 account).
- **Repo:** `sunnyp81/salarydata` (public, single-commit history), branch `main`. Local `C:\Users\sunny\repos\salarydata`.
- **Live:** CF preview `https://salarydata.pages.dev` only — apex `salarydata.co.uk` owned but NOT yet pointed at CF Pages.
- **Deploy:** manual wrangler (`npx wrangler pages deploy dist --project-name salarydata --commit-dirty=true` with CF token + account id from Drive-only vault). Auto-deploy not wired — `.github/workflows/` is gitignored locally because the PAT lacks `workflow` scope.
- **Scale:** 664 pages built (600 money `/salary/[job]/[city]/`, 30 job hubs, 20 city hubs, 5 FTSE company pages, homepage, calculator, indexes, trust pages). Semantic audit ~91/100.

## Key facts & warnings

- 🔴 **WAVE PUBLISHING — only 30 of 600 money pages index week 1.** See `src/lib/publishConfig.ts::INDEXED_MONEY_PAGES`; the other 570 carry `<meta name="robots" content="noindex, follow">`, and the sitemap auto-filters to indexable URLs only (~95). This is deliberate: launching 666 pages day-one on a fresh domain risks the March 2026 Core Update demotion pattern that hit calculator.place. To release a wave: add `'job-slug/city-slug'` pairs to `INDEXED_MONEY_PAGES`, redeploy. Cadence +50/week from week 2, re-evaluate on GSC signals.
- 🔴 **Don't expand to the planned 200K pages until the 600-page seed shows GSC indexing + ranking.** Quality-per-page > raw count. Every new job/city must bring a category-specific narrative block, not the shared 5-tip skeleton.
- **Anti-templating:** 6 category-specific H2/narrative archetypes (Tech/Finance/Marketing/Healthcare/Legal/Construction) rotate across the 600 money pages to break the identical-H2 signal that demoted calculator.place.
- **Secrets are pointers only** — CF API token, StaticForms key, and any affiliate URLs live in the Drive-only master-builds vault, never in this brain or git. Affiliate env vars: `TOPCV_AFFILIATE_URL`, `CVLIBRARY_AFFILIATE_URL`, `REED_API_KEY` (set in CF env when approved).
- **GSC:** `sc-domain:salarydata.co.uk` added to BOTH gsc-sunnypat81 and gsc-2012infinite; verifies once DNS TXT set. Bing `https://salarydata.co.uk` added; import from GSC after Google verifies.
- **Google Indexing API:** `scripts/pushToIndexingApi.mjs` ready with 30 priority URLs; SA JSON `claudeindex-6b5681c013d4.json` was not on the machine.
- Tax engine: 2024/25 England/Wales/NI bands, PA taper >£100k, NI 8%/2%, student loan plans 1/2/4/5/PG, pension salary-sacrifice. Schema: BreadcrumbList + FAQPage + Occupation per page. Editor = Sunny Patel (Person schema, sameAs → sunnypatel.co.uk + LinkedIn) — this is REAL, not fabricated.
- **AdSense:** hold off until 5K+ monthly clicks (premature ads waste, per calculator.place lesson).
- Full data-first redesign Claude prompt + competitor research (PayScale/Glassdoor/Indeed/ONS ASHE) preserved in central `salarydata-claude-design-prompt.md`.

## History

- **Apr 22 2026:** built + deployed (664 pages). Redesign (Fraunces + Inter, navy/amber, tabular numerals, data-publication hero), launch SEO (Sunny Person/Org schema, /directory/ A-Z hub, OG PNG, AI-crawler allowances), wave-publishing system. Semantic audit climbed 62 → 84 → ~91 across P1-P3 passes.
- **Sunny TODOs to monetise:** connect apex DNS, GSC TXT verify + sitemap, add `.github/workflows/` via web UI, push sunnypatel-nextjs backlink (`b159c64` local-only), Indexing API push, apply Reed/TopCV/CVLibrary programmes, Rich Results test once apex live.

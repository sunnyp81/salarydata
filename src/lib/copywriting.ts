// Human-edited prose blocks for money pages.
// Goal: stop the same 4-H2 skeleton repeating across 600 pages — vary by job category and inject
// concrete, named insight instead of generic "5 tips" boilerplate.

import { formatGBP } from './ukTaxCalc';

interface JobLite {
  title: string;
  slug: string;
  category: string;
  growthOutlook: 'high' | 'medium' | 'low' | 'declining';
  nationalMedianSalary: number;
  entryLevelSalary: number;
  seniorLevelSalary: number;
  requiredSkills: string[];
  alternativeTitles: string[];
}

interface LocLite {
  name: string;
  region: string;
  locationMultiplier: number;
  costOfLivingIndex: number;
  averageRent1Bed: number;
  unemploymentRate: number;
  majorEmployers: string[];
}

interface AdjLite {
  median: number;
  lowerQuartile: number;
  upperQuartile: number;
  entry: number;
  senior: number;
}

// ---------- Money-page intro: leads with the £ answer, varies by region/multiplier ----------

export function moneyPageIntro(job: JobLite, loc: LocLite, adj: AdjLite): string {
  const diffPct = Math.round((loc.locationMultiplier - 1) * 100);
  const direction = diffPct > 0 ? 'above' : diffPct < 0 ? 'below' : 'in line with';
  const diffWord = Math.abs(diffPct) >= 15 ? 'well ' + direction : Math.abs(diffPct) >= 5 ? direction : direction;
  const middle50 = `${formatGBP(adj.lowerQuartile)} and ${formatGBP(adj.upperQuartile)}`;
  const topEarner = formatGBP(Math.round(adj.senior * 1.2));

  // Region flavour — short clauses keep the line readable
  const regionAside =
    loc.region === 'Greater London' ? 'a function of the capital\'s wage premium and dense employer pool'
    : loc.region === 'Scotland' ? 'with public-sector and oil-and-gas employers anchoring the upper end'
    : loc.region === 'South East' ? 'pulled up by commuter-belt employers and proximity to London'
    : loc.region === 'East of England' ? 'shaped by the Cambridge–Norwich research and pharma cluster'
    : loc.region === 'North West' ? 'reflecting Manchester\'s post-2015 tech and finance build-out'
    : loc.region === 'Yorkshire' ? 'with Leeds-based banking and Sheffield manufacturing setting the floor'
    : loc.region === 'West Midlands' ? 'underpinned by JLR, financial services and the HS2 build programme'
    : loc.region === 'Wales' ? 'led by the Cardiff insurance and Welsh Government employer base'
    : loc.region === 'Northern Ireland' ? 'driven by Belfast\'s legal, tech and US-firm back-office cluster'
    : 'broadly tracking the regional wage profile';

  return `${job.title}s in ${loc.name} earn a median ${formatGBP(adj.median)} per year — ${
    Math.abs(diffPct) > 1 ? `${Math.abs(diffPct)}% ${diffWord} the UK average` : 'almost exactly the UK average'
  } for the role, ${regionAside}. The middle 50% of earners sit between ${middle50}, and senior practitioners with a strong specialism push past ${topEarner}. Pay rises are typically banded by experience rather than annual increment, so the route to higher earnings is changing employer or stepping up a level — not waiting for a cost-of-living adjustment.`;
}

// ---------- Category-specific H2 + narrative blocks ----------
// Each replaces the generic "How to earn more" 5-tip list. ~150–200 words of unique prose
// per page, written in a journalistic voice (short sentences, specific numbers, no listicle feel).

export function categoryHeading(job: JobLite, loc: LocLite): string {
  switch (job.category) {
    case 'Technology': return `What separates a £${Math.round(job.entryLevelSalary / 1000)}K developer from a £${Math.round(job.seniorLevelSalary / 1000)}K one in ${loc.name}`;
    case 'Finance': return `Bonus and total comp: what ${job.title}s in ${loc.name} actually take home`;
    case 'Marketing': return `Performance vs brand: which ${job.title} roles in ${loc.name} pay more`;
    case 'Healthcare': return `NHS Agenda for Change vs private-sector pay for ${job.title}s in ${loc.name}`;
    case 'Legal': return `PQE bands: how ${job.title} salaries climb year-by-year in ${loc.name}`;
    case 'Construction': return `Day rate vs PAYE: what ${job.title} contractors earn in ${loc.name}`;
    default: return `How to earn more as a ${job.title} in ${loc.name}`;
  }
}

export function categoryNarrative(job: JobLite, loc: LocLite, adj: AdjLite): string {
  const skill1 = job.requiredSkills[0] ?? '';
  const skill2 = job.requiredSkills[1] ?? '';
  const skill3 = job.requiredSkills[2] ?? '';
  const employer = loc.majorEmployers[0] ?? loc.name + ' employers';

  switch (job.category) {
    case 'Technology':
      return `<p>The pay gap between a junior and a staff-level ${job.title} in ${loc.name} is essentially a gap in ownership. Juniors implement; mid-level engineers own a feature; seniors own a system; staff engineers shape what the team builds and why. The salary curve mirrors that — entry roles cluster around ${formatGBP(adj.entry)}, mid-level pay lands close to the ${formatGBP(adj.median)} median, and the upper quartile (${formatGBP(adj.upperQuartile)}) is where engineers sit who can be trusted to scope and lead a quarter of work without a manager rewriting it.</p>
      <p>Three things move salary fastest in ${loc.name}: depth in ${skill1} or ${skill2} that's hard to hire for, a track record of shipping production systems (not side projects), and being credibly able to mentor others. Total comp matters too — the larger London-headquartered tech employers (and US firms with a ${loc.name} office) increasingly pay 15–30% of base in equity or RSUs, which doesn't show up in ONS figures. If you're benchmarking offers, ask for total comp, not just base.</p>`;

    case 'Finance':
      return `<p>Base salary tells you about half the story for ${job.title}s in ${loc.name}. The market splits along sector lines: corporate finance and FP&A roles inside a normal company pay close to the ${formatGBP(adj.median)} median with a 5–15% bonus; investment-bank and buy-side roles pay similar base but layer on bonuses of 30–100%+ in a good year. That's why two ${job.title}s on paper-equivalent jobs can take home wildly different totals.</p>
      <p>${employer} and the other major ${loc.name} employers tend to set the local base-salary floor, but year-end bonuses are where genuine earnings differentiation happens. Strong performers in front-office roles routinely double their base; back-office and risk roles are more bounded, with bonuses in the 10–25% range. Skills that move pay: ${skill1}, ${skill2}, and the ability to own client conversations rather than only running models. Moving firm every 3–4 years is the standard route to step-changes in total comp.</p>`;

    case 'Marketing':
      return `<p>Marketing pay in ${loc.name} splits cleanly into two tracks. Performance-side roles — paid media, SEO, lifecycle — are measured on revenue contribution, so salaries trend higher when you can point at a P&L line you moved. Brand and content roles pay slightly less at the median (${formatGBP(adj.median)}) but compensate with broader scope and clearer paths into Head of Marketing positions, where the upper quartile (${formatGBP(adj.upperQuartile)}) and beyond becomes plausible.</p>
      <p>The fastest movers in ${loc.name} tend to combine technical depth (${skill1}, ${skill2}) with commercial fluency — being able to present numbers to a board, model CAC payback, or argue for budget without flinching. Agency roles in ${loc.name} typically pay 10–20% below in-house equivalents but accelerate skill range; in-house pays better but narrows your remit. Most senior practitioners have done both.</p>`;

    case 'Healthcare':
      return `<p>For NHS-employed ${job.title}s in ${loc.name}, pay follows Agenda for Change bands rather than market rates. ${job.title === 'GP' ? 'GPs are the exception — partner GPs are effectively self-employed and earnings depend heavily on practice list size and dispensing income, which is why partner pay diverges sharply from the salaried-GP band.' : `That puts the median around ${formatGBP(adj.median)}, with the High Cost Area Supplement adding 5–20% on top inside the London commuter belt.`} Specialist add-ons, on-call rotas and unsocial-hours premia can lift effective annual pay by ${job.title === 'GP' ? '20–60%' : '15–30%'} above the headline band.</p>
      <p>Private-sector and locum work is where pay flexes. Locum ${job.title}s in ${loc.name} can clear the upper quartile (${formatGBP(adj.upperQuartile)}) on annualised earnings, but with no NHS pension accrual, no sick pay, and a heavier admin load. The pension calculation matters more than most ${job.title}s realise — the NHS scheme alone is worth roughly 20% of salary in employer contribution, which a private-sector base needs to clear before it's actually a pay rise.</p>`;

    case 'Legal':
      return `<p>${job.title} salaries in ${loc.name} are still largely structured by Post-Qualified Experience (PQE) bands. NQ to 1 PQE typically lands near the ${formatGBP(adj.entry)} mark; 3–5 PQE sits around the ${formatGBP(adj.median)} median; senior associates at 6+ PQE push toward the upper quartile (${formatGBP(adj.upperQuartile)}) and beyond. Magic-circle and US-firm London offices are the obvious outliers — NQ pay there now starts well above the regional senior-associate band, which has rippled into ${loc.name === 'London' ? 'mid-tier' : 'regional'} firm rates.</p>
      <p>The most reliable lever on pay is practice area. Corporate, finance and tax routinely pay 20–40% above general litigation or property work at the same PQE, and that gap widens at partner level. ${skill1} and ${skill2} are the technical baseline; what tends to move ${job.title}s into the top quartile is a transferable client following or a niche speciality (financial services, tech M&A, contentious tax) that firms compete to acquire.</p>`;

    case 'Construction':
      return `<p>${job.title}s in ${loc.name} face a real choice between PAYE employment and contracting. Employed roles cluster around the ${formatGBP(adj.median)} median with pension, holiday and sick pay built in. Day-rate contractors on the same site can earn the equivalent of ${formatGBP(Math.round(adj.upperQuartile * 1.15))}+ annualised — but only when they're billing. Realistic billable days after holidays, gaps between contracts and admin land at roughly 200 a year, which is the maths most contractors get wrong in their first year.</p>
      <p>The high earners in ${loc.name} are usually contractors with a chartered status (${skill1}, ${skill2}), a deep speciality (NEC4 contracts, complex retrofit, major-project commercial), and a network that means they're never on the bench long. Tier-1 contractors and infrastructure programmes (${employer === loc.name + ' employers' ? 'HS2, Hinkley, Lower Thames Crossing where regionally relevant' : employer}) set the upper end of day rates; mid-tier developers and local-authority frameworks set the floor.</p>`;

    default:
      return `<p>${job.title} pay in ${loc.name} centres on ${formatGBP(adj.median)} but the spread is wide. Entry-level roles begin near ${formatGBP(adj.entry)}; senior practitioners push past ${formatGBP(adj.senior)}. The difference comes down to depth in ${skill1} and ${skill2}, the size and reputation of your employer, and whether you're billable or back-office.</p>`;
  }
}

// ---------- City-hub narrative blocks ----------

export function cityIndustryNarrative(loc: LocLite, topRoles: { title: string; median: number }[]): string {
  const employerList = loc.majorEmployers.slice(0, 4).join(', ');
  const topPay = topRoles[0];
  return `<p>${loc.name} sits in ${loc.region} with a working population shaped by ${employerList}. The local employer mix is what moves median pay relative to the rest of the UK — a city anchored by financial services, pharma or large public-sector employers tends to pull up white-collar salaries, while cities with a tourism or retail-heavy mix run closer to the national floor.</p>
    <p>The highest-paid job on this site for ${loc.name} is <strong>${topPay.title}</strong> at ${formatGBP(topPay.median)} median. That's a useful ceiling figure: it tells you what a senior, in-demand role looks like in this labour market. Roles further down the table earn less in absolute terms but, after factoring in cost of living (${loc.name}'s index is ${loc.costOfLivingIndex} versus the UK 100), they often deliver competitive real disposable income.</p>`;
}

export function cityCostNarrative(loc: LocLite, nearbyComparisons: { name: string; multiplier: number; rent: number }[]): string {
  const rent = formatGBP(loc.averageRent1Bed);
  const cmp = nearbyComparisons.slice(0, 3);
  const rentLine = cmp.length > 0
    ? `For comparison, a one-bed in ${cmp[0].name} averages ${formatGBP(cmp[0].rent)}${cmp[1] ? ` and in ${cmp[1].name} ${formatGBP(cmp[1].rent)}` : ''}.`
    : '';
  const colVerdict =
    loc.costOfLivingIndex >= 110 ? 'a noticeable cost-of-living premium that needs to be priced into any offer'
    : loc.costOfLivingIndex >= 95 ? 'broadly UK-average living costs'
    : 'one of the cheaper UK cities to live in by a meaningful margin';

  return `<p>A one-bed flat in ${loc.name} rents for around ${rent} per month, and the wider cost-of-living index of ${loc.costOfLivingIndex} (UK = 100) means residents face ${colVerdict}. ${rentLine} Unemployment in ${loc.name} runs at ${loc.unemploymentRate}%, which gives a rough read on labour-market tightness — under 4% generally implies employer-side competition for skilled hires; over 5% tilts toward employer pricing power.</p>
    <p>The practical implication for salary negotiation: in ${loc.name}, a salary that lands in the lower quartile of UK figures is usually only competitive if it's offset by a meaningfully lower cost base. Use the cost-of-living-adjusted figures on individual job pages to compare offers across cities on a like-for-like basis rather than nominal pounds.</p>`;
}

// ---------- Anchor-segment transitions between H2s on money pages ----------
// One sentence per heading that picks up the prior section's concept. Stops the
// page reading like a sequence of disconnected blocks (KB-14 contextual flow).

export function transitionToExperience(job: JobLite, loc: LocLite): string {
  return `That headline median masks a wide spread once you split ${loc.name} ${job.title.toLowerCase()}s by years of experience.`;
}

export function transitionToCalculator(_job: JobLite, _loc: LocLite): string {
  return `Gross figures only tell half the story — what actually lands in your bank account depends on tax, NI, student loan and pension. Run your own number below.`;
}

export function transitionToJobs(job: JobLite, loc: LocLite): string {
  return `Pay ranges and take-home are the planning numbers; what you can actually move into right now is a different question. Live ${job.title.toLowerCase()} vacancies in ${loc.name} are below.`;
}

export function transitionToComparison(job: JobLite, loc: LocLite): string {
  return `It's also worth seeing how ${loc.name} stacks up — both against the UK average and against other cities ${job.title.toLowerCase()}s commonly relocate between.`;
}

export function transitionToCategoryDeepdive(job: JobLite): string {
  switch (job.category) {
    case 'Technology': return `Beyond the headline numbers, the more useful question for engineers is what actually drives pay between bands.`;
    case 'Finance': return `Base pay is the easy part of finance comp to publish — bonuses are the harder, more variable bit, and where the real differentiation sits.`;
    case 'Marketing': return `Marketing pay isn't a single market — it splits along clear lines that the median salary alone doesn't show.`;
    case 'Healthcare': return `For NHS-employed staff in particular, the published pay tables only describe the basic-band figure; the true take-home includes layers the median figure can't capture.`;
    case 'Legal': return `Legal pay scales by Post-Qualified Experience more rigidly than almost any other profession, which makes salary progression unusually predictable to map.`;
    case 'Construction': return `Construction pay branches sharply between PAYE employment and contracting — the right comparison depends on which route you're on.`;
    default: return `It's worth understanding what actually moves pay in this profession beyond the headline median.`;
  }
}

export function transitionToNearbyCities(job: JobLite, loc: LocLite): string {
  return `If ${loc.name} doesn't quite work for the role — commute, rent, partner's job — the same role in nearby cities tells you what the trade-off looks like in £ terms.`;
}

export function transitionToSameCategoryJobs(job: JobLite): string {
  return `Adjacent ${job.category.toLowerCase()} roles often pay differently to ${job.title.toLowerCase()} for similar skill profiles, which is useful when you're choosing what to specialise in next.`;
}

export function transitionToFaq(job: JobLite, loc: LocLite): string {
  return `Common questions about ${job.title.toLowerCase()} pay in ${loc.name}, answered with the underlying figures from the same dataset used above.`;
}

// ---------- Company-page narrative ----------

export function companyNarrative(c: {
  name: string;
  sector: string;
  ftseIndex: string;
  employeeCount: number;
  headquarters: string;
  averageSalary: number;
  salaryByRole: { role: string; median: number; range: [number, number] }[];
}): string {
  const top = c.salaryByRole[0];
  const sectorBlurb =
    c.sector === 'Banking' ? 'a sector where total comp consistently runs above headline base pay because of bonuses, deferred stock and pension contributions that are large by UK standards'
    : c.sector === 'Pharmaceuticals' ? 'a science-led sector that pays a structural premium for technical depth and regulatory specialism, particularly in R&D and biostatistics'
    : c.sector === 'Consumer Goods' ? 'a sector that pays moderate base salaries with strong long-term progression for those who land on the marketing or commercial leadership track'
    : c.sector === 'Energy' ? 'a sector that pays well for technical and project management roles, with a noticeable premium for offshore and major-capital-project experience'
    : 'a sector with its own pay norms that don\'t always match the wider market';

  return `<p>${c.name} is ${c.ftseIndex === 'Private' ? 'a UK private-sector employer' : `listed on the ${c.ftseIndex}`} in ${c.sector.toLowerCase()}, employing roughly ${c.employeeCount.toLocaleString()} people globally with its headquarters in ${c.headquarters}. It operates in ${sectorBlurb}.</p>
    <p>The average salary across all UK roles at ${c.name} is around ${formatGBP(c.averageSalary)} — a useful headline figure, but pay variation between roles is wide. The highest-paid role on this site is <strong>${top.role}</strong> at ${formatGBP(top.median)} median (${formatGBP(top.range[0])}–${formatGBP(top.range[1])} range). Roles further down the table earn less in absolute terms but often have shorter hours, more predictable progression and stronger pension benefits — particularly relevant when comparing total reward across employers.</p>
    <p>Salary at ${c.name}, like most UK employers of this scale, is set by a combination of formal pay bands (which prevent obvious within-grade discrepancies) and discretionary uplifts at hiring (which create them). The fastest way to a meaningful pay rise here, as elsewhere, tends to be promotion to the next band or a credible external offer.</p>`;
}

// ---------- Job-hub narrative ----------

export function jobHubMarketNarrative(job: JobLite, topCity: string, topMedian: number): string {
  const growthCopy =
    job.growthOutlook === 'high' ? `Demand for ${job.title}s in the UK has been strongly positive over the last three to five years, with employer hiring volumes outstripping qualified candidate supply in most major cities.`
    : job.growthOutlook === 'medium' ? `Demand for ${job.title}s in the UK has been steady — neither contracting nor expanding sharply — with employer hiring tracking broadly in line with replacement need.`
    : job.growthOutlook === 'low' ? `Hiring for ${job.title}s in the UK has been subdued, with most movement coming from churn and replacement rather than new headcount creation.`
    : `Demand for ${job.title}s has been declining in the UK as employers consolidate or automate the function, which compresses pay growth at the lower end while protecting senior earners.`;

  return `<p>${growthCopy} The highest-paying UK city on this site for the role is ${topCity} at ${formatGBP(topMedian)} median, which is roughly what a competent mid-level practitioner can expect to earn there with three to five years of experience.</p>
    <p>Pay progression for a ${job.title} in the UK is rarely linear. Most of the gain happens at three points: the move from entry-level to mid (typically in years 2–3), the move into senior or principal positions (years 6–8), and — for those who pursue it — a lateral jump into management, consulting or independent contracting. Sitting in the same role waiting for inflationary increases is by some distance the slowest path; changing employer every three to four years remains the dominant pay-rise mechanism in the UK labour market.</p>`;
}

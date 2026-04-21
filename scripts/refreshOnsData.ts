// Refresh ONS salary figures (manual runner — ONS publishes annually).
// For now this is a placeholder that simply re-runs generateSeedData.mjs.
// When ONS releases new ASHE tables, update scripts/generateSeedData.mjs with new figures
// and this cron re-runs it.
import { execSync } from 'node:child_process';

console.log('[ons-refresh] regenerating seed data from committed figures...');
execSync('node scripts/generateSeedData.mjs', { stdio: 'inherit' });
console.log('[ons-refresh] done');

/**
 * deploy-web.js
 *
 * Commits and pushes availability changes to trigger GitHub Actions deploy.
 * Assumes preview-web.js has already been run (sync + build done).
 *
 * Usage: node scripts/deploy-web.js
 */

const path = require('path');
const { run } = require('./lib/run');

const TRACKED_FILES = [
  path.join('web', 'src', 'data', 'availability.json'),
  path.join('web', 'src', 'data', 'flats.ts'),
  path.join('web', 'public', 'llms.txt'),
  path.join('web', 'public', 'llms-full.txt'),
];

function hasChanges(file) {
  const diff = run('git', ['diff', '--name-only', file]);
  const untracked = run('git', ['ls-files', '--others', '--exclude-standard', file]);
  return Boolean(diff || untracked);
}

function main() {
  // 1. Check if any file changed
  console.log('1/3 Checking for changes...');
  const changed = TRACKED_FILES.filter(hasChanges);

  if (!changed.length) {
    console.log('     No changes — nothing to deploy.');
    console.log('\nDone:', JSON.stringify({ deployed: false, reason: 'no-changes' }));
    return;
  }
  console.log(`     ${changed.length} file(s) changed: ${changed.map(f => path.basename(f)).join(', ')}`);

  // 2. Git add + commit
  console.log('2/3 Committing changes...');
  run('git', ['add', ...changed]);
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  run('git', ['commit', '-m', `chore: sync web content from API (${timestamp})`]);
  console.log('     Committed.');

  // 3. Git push
  console.log('3/3 Pushing to remote...');
  run('git', ['push']);
  console.log('     Pushed. GitHub Actions will deploy the web.');

  console.log('\nDone:', JSON.stringify({ deployed: true, files: changed.map(f => path.basename(f)) }));
}

try {
  main();
} catch (err) {
  console.error('deploy-web failed:', err.message);
  process.exit(1);
}

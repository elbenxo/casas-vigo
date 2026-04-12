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

const AVAILABILITY_FILE = path.join('web', 'src', 'data', 'availability.json');

function main() {
  // 1. Check if file changed
  console.log('1/3 Checking for changes...');
  const diff = run('git', ['diff', '--name-only', AVAILABILITY_FILE]);
  const untracked = run('git', ['ls-files', '--others', '--exclude-standard', AVAILABILITY_FILE]);

  if (!diff && !untracked) {
    console.log('     No changes — nothing to deploy.');
    console.log('\nDone:', JSON.stringify({ deployed: false, reason: 'no-changes' }));
    return;
  }

  // 2. Git add + commit
  console.log('2/3 Committing changes...');
  run('git', ['add', AVAILABILITY_FILE]);
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  run('git', ['commit', '-m', `chore: sync room availability (${timestamp})`]);
  console.log('     Committed.');

  // 3. Git push
  console.log('3/3 Pushing to remote...');
  run('git', ['push']);
  console.log('     Pushed. GitHub Actions will deploy the web.');

  console.log('\nDone:', JSON.stringify({ deployed: true }));
}

try {
  main();
} catch (err) {
  console.error('deploy-web failed:', err.message);
  process.exit(1);
}

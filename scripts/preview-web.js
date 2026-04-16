/**
 * preview-web.js
 *
 * 1. Runs sync-availability.js to update availability data
 * 2. Runs sync-llms.js to regenerate llms.txt/llms-full.txt from API
 * 3. Builds the Astro site (web/dist)
 *
 * After this, the built site can be previewed at localhost:3000/casas-vigo/
 *
 * Usage: node scripts/preview-web.js [--api http://localhost:3000]
 */

const path = require('path');
const { run, REPO_ROOT } = require('./lib/run');

const WEB_DIR = path.join(REPO_ROOT, 'web');

const apiArgs = process.argv.includes('--api')
  ? ['--api', process.argv[process.argv.indexOf('--api') + 1]]
  : [];

function main() {
  // 1. Sync availability from API
  console.log('1/3 Syncing availability from API...');
  const syncScript = path.join(__dirname, 'sync-availability.js');
  const syncOut = run(process.execPath, [syncScript, ...apiArgs]);
  console.log(`     ${syncOut}`);

  // 2. Regenerate llms.txt / llms-full.txt from API
  console.log('2/3 Syncing llms.txt / llms-full.txt from API...');
  const llmsScript = path.join(__dirname, 'sync-llms.js');
  const llmsOut = run(process.execPath, [llmsScript, ...apiArgs]);
  console.log(`     ${llmsOut}`);

  // 3. Build Astro site
  console.log('3/3 Building web...');
  const astroBin = path.join(WEB_DIR, 'node_modules', '.bin', 'astro');
  const astroCmd = process.platform === 'win32' ? astroBin + '.cmd' : astroBin;
  run(astroCmd, ['build'], { cwd: WEB_DIR, timeout: 120000, shell: true });
  console.log('     Build complete.');

  console.log('\nDone:', JSON.stringify({ previewing: true }));
}

try {
  main();
} catch (err) {
  console.error('preview-web failed:', err.message);
  process.exit(1);
}

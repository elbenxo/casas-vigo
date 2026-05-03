/**
 * preview-web.js
 *
 * 1. Runs sync-availability.js (overlay JSON for room availability/prices)
 * 2. Runs sync-web.js (regenerates web/src/data/flats.ts from DB)
 * 3. Runs sync-llms.js (llms.txt + llms-full.txt from API)
 * 4. Builds the Astro site (web/dist)
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
  // 1. Sync availability overlay from API
  console.log('1/4 Syncing availability from API...');
  const syncAvailScript = path.join(__dirname, 'sync-availability.js');
  const syncAvailOut = run(process.execPath, [syncAvailScript, ...apiArgs]);
  console.log(`     ${syncAvailOut}`);

  // 2. Regenerate flats.ts from DB (full content: pisos, habitaciones, fotos, reviews, i18n)
  console.log('2/4 Generating flats.ts from DB...');
  const syncWebScript = path.join(__dirname, 'sync-web.js');
  const syncWebOut = run(process.execPath, [syncWebScript, ...apiArgs]);
  console.log(`     ${syncWebOut}`);

  // 3. Regenerate llms.txt / llms-full.txt from API
  console.log('3/4 Syncing llms.txt / llms-full.txt from API...');
  const llmsScript = path.join(__dirname, 'sync-llms.js');
  const llmsOut = run(process.execPath, [llmsScript, ...apiArgs]);
  console.log(`     ${llmsOut}`);

  // 4. Build Astro site
  console.log('4/4 Building web...');
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

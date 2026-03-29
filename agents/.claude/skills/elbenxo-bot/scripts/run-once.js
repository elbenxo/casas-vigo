// Run a single ElBenxo_BOT check on one conversation
// Usage: node run-once.js <phone>

const phone = process.argv[2];
if (!phone) {
  console.log('Usage: node run-once.js <phone>');
  process.exit(1);
}

require('child_process').execSync(
  `node "${__dirname}/scheduler.js" --once --conversation ${phone}`,
  { stdio: 'inherit', windowsHide: true }
);

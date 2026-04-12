const { execFileSync } = require('child_process');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..', '..');

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    cwd: REPO_ROOT,
    encoding: 'utf-8',
    windowsHide: true,
    ...opts,
  }).trim();
}

module.exports = { run, REPO_ROOT };

const { Router } = require('express');
const { execFile, execFileSync } = require('child_process');
const path = require('path');

const router = Router();

const SCRIPTS_DIR = path.join(__dirname, '..', '..', '..', '..', 'scripts');
const REPO_ROOT = path.join(__dirname, '..', '..', '..', '..');

let state = 'idle'; // idle | previewing | deploying

// POST /api/deploy-web/preview — sync + build, then preview at /casas-vigo/
router.post('/preview', (req, res) => {
  if (state !== 'idle') {
    return res.status(409).json({ error: `Cannot preview: state is ${state}` });
  }

  state = 'previewing';

  execFile(process.execPath, [path.join(SCRIPTS_DIR, 'preview-web.js')], {
    cwd: REPO_ROOT,
    windowsHide: true,
    timeout: 120000,
  }, (err, stdout, stderr) => {
    if (err) {
      state = 'idle';
      return res.status(500).json({
        error: 'Preview build failed',
        detail: (stderr || err.message).trim(),
        output: stdout.trim(),
      });
    }
    // state stays 'previewing' until publish or cancel
    res.json({
      ok: true,
      state: 'previewing',
      previewUrl: '/casas-vigo/',
      output: stdout.trim(),
    });
  });
});

// POST /api/deploy-web/publish — commit + push (after preview)
router.post('/publish', (req, res) => {
  if (state !== 'previewing') {
    return res.status(409).json({ error: `Cannot publish: state is ${state} (preview first)` });
  }

  state = 'deploying';

  execFile(process.execPath, [path.join(SCRIPTS_DIR, 'deploy-web.js')], {
    cwd: REPO_ROOT,
    windowsHide: true,
    timeout: 60000,
  }, (err, stdout, stderr) => {
    state = 'idle';
    if (err) {
      return res.status(500).json({
        error: 'Deploy failed',
        detail: (stderr || err.message).trim(),
        output: stdout.trim(),
      });
    }
    res.json({
      ok: true,
      state: 'idle',
      output: stdout.trim(),
    });
  });
});

// POST /api/deploy-web/cancel — revert sync changes, back to idle
router.post('/cancel', (req, res) => {
  if (state !== 'previewing') {
    return res.status(409).json({ error: `Nothing to cancel: state is ${state}` });
  }

  // Revert synced files to last committed version
  const SYNCED_FILES = [
    'web/src/data/availability.json',
    'web/src/data/flats.ts',
    'web/public/llms.txt',
    'web/public/llms-full.txt',
  ];
  try {
    execFileSync('git', ['checkout', '--', ...SYNCED_FILES], {
      cwd: REPO_ROOT,
      windowsHide: true,
      encoding: 'utf-8',
    });
  } catch (e) {
    // Expected if files are untracked or already clean
    console.warn('deploy/cancel git checkout:', e.message);
  }

  state = 'idle';
  res.json({ ok: true, state: 'idle' });
});

// GET /api/deploy-web/status
router.get('/status', (req, res) => {
  res.json({ state });
});

module.exports = router;

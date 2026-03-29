const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

// --- Config ---
const SERVER_SCRIPT = path.join(__dirname, 'server.js');
const PORT = process.env.PORT || 50000;
const HEALTH_CHECK_INTERVAL = 30000;  // 30 seconds
const MAX_FAILURES = 3;
const RESTART_DELAY = 5000;  // 5 seconds before restarting

let serverProcess = null;
let failureCount = 0;
let restarting = false;

function log(msg) {
  const time = new Date().toLocaleTimeString('es-ES');
  console.log(`[watchdog ${time}] ${msg}`);
}

function startServer() {
  if (serverProcess) {
    try { serverProcess.kill(); } catch {}
  }

  log('Starting WhatsApp server...');
  serverProcess = spawn('node', [SERVER_SCRIPT], {
    stdio: 'inherit',
    windowsHide: true,
  });

  serverProcess.on('exit', (code) => {
    log(`Server exited with code ${code}`);
    if (!restarting) {
      log(`Unexpected exit. Restarting in ${RESTART_DELAY / 1000}s...`);
      setTimeout(startServer, RESTART_DELAY);
    }
  });

  serverProcess.on('error', (err) => {
    log(`Server process error: ${err.message}`);
  });

  failureCount = 0;
}

function healthCheck() {
  const req = http.get(`http://localhost:${PORT}/health`, { timeout: 10000 }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.healthy) {
          failureCount = 0;
        } else {
          failureCount++;
          log(`Health check failed (${failureCount}/${MAX_FAILURES}): ${result.reason}`);
        }
      } catch {
        failureCount++;
        log(`Health check bad response (${failureCount}/${MAX_FAILURES}): ${data}`);
      }
      checkRestart();
    });
  });

  req.on('error', () => {
    failureCount++;
    log(`Health check unreachable (${failureCount}/${MAX_FAILURES})`);
    checkRestart();
  });

  req.on('timeout', () => {
    req.destroy();
    failureCount++;
    log(`Health check timeout (${failureCount}/${MAX_FAILURES})`);
    checkRestart();
  });
}

function checkRestart() {
  if (failureCount >= MAX_FAILURES) {
    log(`${MAX_FAILURES} consecutive failures. Restarting server...`);
    restarting = true;
    try { serverProcess.kill(); } catch {}
    setTimeout(() => {
      restarting = false;
      startServer();
    }, RESTART_DELAY);
    failureCount = 0;
  }
}

// --- Graceful shutdown ---
process.on('SIGINT', () => {
  log('Shutting down...');
  if (serverProcess) serverProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Shutting down...');
  if (serverProcess) serverProcess.kill();
  process.exit(0);
});

// --- Start ---
log('Watchdog started');
log(`Monitoring server on port ${PORT}`);
log(`Health check every ${HEALTH_CHECK_INTERVAL / 1000}s, restart after ${MAX_FAILURES} failures`);

startServer();

// Wait 15s for server to initialize before starting health checks
setTimeout(() => {
  log('Starting health checks...');
  setInterval(healthCheck, HEALTH_CHECK_INTERVAL);
}, 15000);

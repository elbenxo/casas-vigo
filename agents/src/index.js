const { initDb, closeDb } = require('./api/db/connection');
const { createApp } = require('./api/server');

const PORT = process.env.PORT || 3000;

function start() {
  console.log('Initializing database...');
  initDb();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Casas Vigo API running on http://localhost:${PORT}`);
    console.log(`Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`Health: http://localhost:${PORT}/health`);
  });

  process.on('SIGINT', () => {
    console.log('Shutting down...');
    closeDb();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    closeDb();
    process.exit(0);
  });
}

start();

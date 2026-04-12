const express = require('express');
const path = require('path');

function createApp() {
  const app = express();
  app.use(express.json());

  // API routes
  app.use('/api/flats', require('./routes/flats'));
  app.use('/api/rooms', require('./routes/rooms'));
  app.use('/api/contacts', require('./routes/contacts'));
  app.use('/api/income', require('./routes/income'));
  app.use('/api/costs', require('./routes/costs'));
  app.use('/api/receipts', require('./routes/receipts'));
  app.use('/api/messages', require('./routes/messages'));
  app.use('/api/appointments', require('./routes/appointments'));
  app.use('/api/config', require('./routes/config'));
  app.use('/api/prospects', require('./routes/prospects'));
  app.use('/api/contracts', require('./routes/contracts'));
  app.use('/api/stats', require('./routes/stats'));
  app.use('/api/deploy-web', require('./routes/deploy'));
  app.use('/', require('./routes/health'));

  // Dashboard static files
  const dashboardPath = path.join(__dirname, '..', '..', '..', 'dashboard', 'public');
  app.use('/dashboard', express.static(dashboardPath));

  // Web preview (serves built Astro site at same base path as production)
  const webDistPath = path.join(__dirname, '..', '..', '..', 'web', 'dist');
  app.use('/casas-vigo', express.static(webDistPath));

  return app;
}

module.exports = { createApp };

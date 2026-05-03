'use strict';

const path = require('path');

// Directorio raíz para fotos servidas por la web (web/public/images)
// Overridable vía IMAGES_DIR env (útil en tests)
const IMAGES_DIR = process.env.IMAGES_DIR
  ? path.resolve(process.env.IMAGES_DIR)
  : path.resolve(__dirname, '..', '..', '..', 'web', 'public', 'images');

// Extensiones permitidas en upload de fotos
const PHOTO_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

// Tamaño máximo por foto subida (10 MB)
const PHOTO_MAX_BYTES = 10 * 1024 * 1024;

// Prospect pipeline statuses in order
const PROSPECT_STATUSES = ['new', 'contacted', 'visit_scheduled', 'visit_done', 'contract_sent', 'signed', 'lost'];

// Statuses that come before 'contract_sent' in the funnel
const PRE_CONTRACT_STATUSES = ['new', 'contacted', 'visit_scheduled', 'visit_done'];

// Contract statuses
const CONTRACT_STATUSES = ['draft', 'signed', 'terminated'];

// Default utilities provision (EUR/month per tenant, per real contract clause 4.3)
const DEFAULT_UTILITIES_PROVISION = 25;

module.exports = {
  PROSPECT_STATUSES,
  PRE_CONTRACT_STATUSES,
  CONTRACT_STATUSES,
  DEFAULT_UTILITIES_PROVISION,
  IMAGES_DIR,
  PHOTO_EXTENSIONS,
  PHOTO_MAX_BYTES,
};

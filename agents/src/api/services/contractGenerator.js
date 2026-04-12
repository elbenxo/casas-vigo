'use strict';

const fs = require('fs');
const path = require('path');

const _templateCache = new Map();

/**
 * Loads a contract template for the given language (cached after first read).
 * Falls back to 'es' if the requested language template doesn't exist.
 */
function loadTemplate(lang) {
  if (_templateCache.has(lang)) return _templateCache.get(lang);

  const templatesDir = path.resolve(__dirname, '../../../../templates/contracts');
  const langFile = path.join(templatesDir, `contract-${lang}.html`);
  const fallbackFile = path.join(templatesDir, 'contract-es.html');

  let html;
  if (fs.existsSync(langFile)) {
    html = fs.readFileSync(langFile, 'utf8');
  } else if (lang !== 'es' && fs.existsSync(fallbackFile)) {
    console.warn(`[contractGenerator] Template for lang="${lang}" not found, falling back to "es"`);
    html = fs.readFileSync(fallbackFile, 'utf8');
  } else {
    throw new Error(`Contract template not found for lang="${lang}" and no fallback available`);
  }

  _templateCache.set(lang, html);
  return html;
}

/**
 * Replaces all {{placeholder}} occurrences in a template string with values from a data object.
 * Unknown placeholders are left as-is.
 *
 * @param {string} template - HTML template with {{placeholder}} tokens
 * @param {Record<string, string|number|null>} data - Key/value map
 * @returns {string} Rendered HTML
 */
function applyPlaceholders(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key];
    if (value === undefined || value === null) return match;
    return String(value);
  });
}

const _readyDirs = new Set();

function ensureOutputDir(outputDir) {
  if (_readyDirs.has(outputDir)) return;
  fs.mkdirSync(outputDir, { recursive: true });
  _readyDirs.add(outputDir);
}

/**
 * Builds a template data object from DB records.
 *
 * @param {object} prospect
 * @param {object} room
 * @param {object} flat
 * @param {object} contractParams - { start_date, end_date, monthly_rent, deposit, lang }
 * @returns {Record<string, string|number|null>}
 */
function buildTemplateData(prospect, room, flat, contractParams) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    // Prospect / tenant
    tenant_name: prospect.name ?? '',
    tenant_phone: prospect.phone ?? '',
    tenant_email: prospect.email ?? '',
    tenant_language: prospect.language ?? contractParams.lang ?? 'es',
    // Room
    room_name: room.name ?? '',
    room_slug: room.slug ?? '',
    room_size: room.size_m2 ?? '',
    room_bed_type: room.bed_type ?? '',
    // Flat
    flat_name: flat.name ?? '',
    flat_address: flat.address ?? '',
    flat_neighborhood: flat.neighborhood ?? '',
    // Contract terms
    start_date: contractParams.start_date ?? '',
    end_date: contractParams.end_date ?? '',
    monthly_rent: contractParams.monthly_rent ?? room.price_monthly ?? '',
    deposit: contractParams.deposit ?? '',
    // Meta
    contract_date: today,
    lang: contractParams.lang ?? 'es',
  };
}

/**
 * Generates a contract HTML file and returns the output path.
 *
 * @param {object} options
 * @param {object} options.prospect
 * @param {object} options.room
 * @param {object} options.flat
 * @param {string} options.lang
 * @param {string} options.start_date
 * @param {string} options.end_date
 * @param {number} options.monthly_rent
 * @param {number} options.deposit
 * @param {string} options.outputDir - Absolute path where the file will be saved
 * @returns {{ filePath: string, html: string }}
 */
function generateContract({ prospect, room, flat, lang, start_date, end_date, monthly_rent, deposit, outputDir }) {
  ensureOutputDir(outputDir);

  const template = loadTemplate(lang);
  const data = buildTemplateData(prospect, room, flat, { start_date, end_date, monthly_rent, deposit, lang });
  const html = applyPlaceholders(template, data);

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fileName = `${prospect.id}_${room.slug}_${date}.html`;
  const filePath = path.join(outputDir, fileName);

  fs.writeFileSync(filePath, html, 'utf8');

  return { filePath, html };
}

module.exports = { generateContract, loadTemplate, applyPlaceholders, buildTemplateData };

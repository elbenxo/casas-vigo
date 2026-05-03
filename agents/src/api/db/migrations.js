'use strict';

/**
 * Idempotent column / index migrations.
 *
 * Schema.sql defines the current shape of new databases. For installations
 * that pre-date a column we add it here with ALTER TABLE if missing.
 */

function tableColumns(db, table) {
  return new Set(db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name));
}

function migrate(db) {
  const cols = {
    flats: tableColumns(db, 'flats'),
    rooms: tableColumns(db, 'rooms'),
  };

  function ensureColumn(table, column, ddl) {
    if (!cols[table].has(column)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
      cols[table].add(column);
    }
  }

  // flats: web identifiers + multilingual content
  ensureColumn('flats', 'web_slug', 'web_slug TEXT');
  ensureColumn('flats', 'web_id_prefix', 'web_id_prefix TEXT');
  ensureColumn('flats', 'name_i18n', 'name_i18n TEXT');
  ensureColumn('flats', 'neighborhood_i18n', 'neighborhood_i18n TEXT');
  ensureColumn('flats', 'description_i18n', 'description_i18n TEXT');
  ensureColumn('flats', 'coordinates', 'coordinates TEXT');
  ensureColumn('flats', 'whole_flat_price', 'whole_flat_price REAL');

  // rooms: web id + multilingual name
  ensureColumn('rooms', 'web_id', 'web_id TEXT');
  ensureColumn('rooms', 'name_i18n', 'name_i18n TEXT');
}

module.exports = { migrate };

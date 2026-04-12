/**
 * sync-availability.js
 *
 * Reads room availability from the API (SQLite source of truth)
 * and generates web/src/data/availability.json for the Astro build.
 *
 * Usage: node scripts/sync-availability.js [--api http://localhost:3000]
 */

const fs = require('fs');
const path = require('path');

const API_BASE = process.argv.includes('--api')
  ? process.argv[process.argv.indexOf('--api') + 1]
  : 'http://localhost:3000';

// DB flat slug → web room ID prefix
const FLAT_PREFIX = {
  irmandinos: 'ir',
  '1d': '1d',
  '3i': '3i',
  '4d': '4d',
  '4i': '4i',
};

// DB room slugs that differ from web room IDs
const ROOM_SLUG_MAP = {
  blancoynegro: 'blanco-negro',
  nuevayork: 'nueva-york',
};

function buildWebRoomId(flatSlug, roomSlug) {
  const prefix = FLAT_PREFIX[flatSlug];
  if (!prefix) return null;
  const mapped = ROOM_SLUG_MAP[roomSlug] || roomSlug;
  return `${prefix}-${mapped}`;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function main() {
  // Fetch flats and rooms from API
  const [flatsRes, roomsRes] = await Promise.all([
    fetchJson(`${API_BASE}/api/flats`),
    fetchJson(`${API_BASE}/api/rooms`),
  ]);

  const flats = flatsRes.data;
  const rooms = roomsRes.data;

  // Build flat ID → slug lookup
  const flatSlugById = {};
  for (const f of flats) {
    flatSlugById[f.id] = f.slug;
  }

  // Build availability map keyed by web room ID
  const availability = {};
  let mapped = 0;
  let skipped = 0;

  for (const room of rooms) {
    const flatSlug = flatSlugById[room.flat_id];
    const webId = buildWebRoomId(flatSlug, room.slug);
    if (!webId) {
      skipped++;
      console.warn(`  skip: flat=${flatSlug} room=${room.slug} (no mapping)`);
      continue;
    }
    availability[webId] = {
      available: !!room.available,
      price: room.price_monthly,
      available_from: room.available_from || null,
    };
    mapped++;
  }

  const output = {
    lastUpdated: new Date().toISOString(),
    rooms: availability,
  };

  // Write to web/src/data/availability.json
  const outPath = path.join(__dirname, '..', 'web', 'src', 'data', 'availability.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n');

  console.log(`sync-availability: ${mapped} rooms mapped, ${skipped} skipped → ${outPath}`);
}

main().catch(err => {
  console.error('sync-availability failed:', err.message);
  process.exit(1);
});

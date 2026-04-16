/**
 * sync-llms.js
 *
 * Regenerates web/public/llms.txt and llms-full.txt from the API.
 * These files power GEO (Generative Engine Optimization) — they're served
 * from the site root for AI crawlers (GPTBot, Claude-Web, etc.).
 *
 * Pulls live data from the API (prices, rooms, availability, amenities,
 * tourist licenses) and enriches it with static metadata (coordinates,
 * English slug, tagline) that isn't stored in the DB yet.
 *
 * Usage: node scripts/sync-llms.js [--api http://localhost:3000] [--site-url https://...] [--base-path /casas-vigo]
 */

const fs = require('fs');
const path = require('path');

function argOr(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const API_BASE = argOr('--api', 'http://localhost:3000');
const SITE_URL = argOr('--site-url', process.env.SITE_URL || 'https://elbenxo.github.io');
const BASE_PATH = argOr('--base-path', process.env.BASE_PATH || '/casas-vigo');
const SITE = `${SITE_URL}${BASE_PATH}`.replace(/\/$/, '');

// Static metadata that's not in the DB (yet). Keyed by DB flat slug.
// Once the Dashboard CMS adds these fields to the DB, this map can be dropped.
const FLAT_META = {
  irmandinos: {
    webSlug: 'irmandinhos',
    nameEn: 'Rúa Irmandiños Flat',
    coordinates: { lat: 42.2365, lng: -8.7145 },
    tagline: 'Renovated flat in city center near historic district',
    localAmenities: [
      'Walking distance to Vigo city center',
      'Near local shops and restaurants',
      'Historic architecture area',
      'Easy access to public transport',
    ],
  },
  '1d': {
    webSlug: 'alfonso-1-derecha',
    nameEn: 'Alfonso XIII 1º Derecha',
    coordinates: { lat: 42.2318, lng: -8.7154 },
    tagline: 'Six-room first floor flat with glazed gallery and private courtyard, near HST station',
    localAmenities: [
      'Proximity to HST train station',
      'Good public transport connections',
      'Shopping and dining nearby',
      'Business district location',
    ],
  },
  '3i': {
    webSlug: 'alfonso-3-izquierda',
    nameEn: 'Alfonso XIII 3º Izquierda',
    coordinates: { lat: 42.2318, lng: -8.7154 },
    tagline: 'Upper floor with fireplace, elevator access and panoramic views',
    localAmenities: [
      'Proximity to HST train station',
      'Good public transport connections',
      'Shopping and dining nearby',
      'Business district location',
    ],
  },
  '4d': {
    webSlug: 'alfonso-4-derecha-atico',
    nameEn: 'Alfonso XIII 4º Derecha Ático',
    coordinates: { lat: 42.2318, lng: -8.7154 },
    tagline: 'Penthouse with private terrace, balcony and city views',
    localAmenities: [
      'Proximity to HST train station',
      'Good public transport connections',
      'Shopping and dining nearby',
      'Business district location',
      'Panoramic city views',
    ],
  },
  '4i': {
    webSlug: 'alfonso-4-izquierda-atico',
    nameEn: 'Alfonso XIII 4º Izquierda Ático',
    coordinates: { lat: 42.2318, lng: -8.7154 },
    tagline: 'Attic with skylights, floor-to-ceiling windows and views over the Ría',
    localAmenities: [
      'Proximity to HST train station',
      'Good public transport connections',
      'Shopping and dining nearby',
      'Business district location',
      'Ría de Vigo views',
    ],
  },
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

function parseJsonField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function bedTypeEn(bed) {
  if (!bed) return '';
  const map = {
    doble: 'Double bed',
    individual: 'Single bed',
    '2 individuales': 'Two single beds',
  };
  return map[bed] || bed;
}

function groupRoomsByFlat(rooms) {
  const byFlat = new Map();
  for (const room of rooms) {
    if (!byFlat.has(room.flat_id)) byFlat.set(room.flat_id, []);
    byFlat.get(room.flat_id).push(room);
  }
  return byFlat;
}

function computeStats(rooms) {
  const prices = rooms.map(r => r.price_monthly).filter(Boolean);
  const sizes = rooms.map(r => r.size_m2).filter(Boolean);
  let singles = 0, doubles = 0;
  for (const r of rooms) {
    if (r.bed_type === 'individual') singles++;
    else if (r.bed_type === 'doble' || r.bed_type === '2 individuales') doubles++;
  }
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const avgSize = sizes.length ? (sizes.reduce((a, b) => a + b, 0) / sizes.length).toFixed(1) : '0';
  return {
    total: rooms.length,
    singles,
    doubles,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    avgPrice,
    avgSize,
    available: rooms.filter(r => r.available).length,
  };
}

function flatPriceRange(roomsForFlat) {
  const prices = roomsForFlat.map(r => r.price_monthly).filter(Boolean);
  if (!prices.length) return '';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `${min} EUR/month` : `${min}-${max} EUR/month`;
}

function renderLlms({ flats, roomsByFlat }) {
  const lines = [];
  lines.push('# Casas Vigo');
  lines.push('');
  lines.push(`> Furnished rooms for rent in Vigo, Galicia, Spain. ${flats.length} flats, ${[...roomsByFlat.values()].flat().length} rooms, from ${Math.min(...[...roomsByFlat.values()].flat().map(r => r.price_monthly))} EUR/month.`);
  lines.push('');
  lines.push('## About');
  lines.push('');
  lines.push('Casas Vigo offers furnished rooms for monthly rental in Vigo, the largest city in Galicia, Spain. All rooms include WiFi, utilities, heating, hot water, and access to shared kitchen and common areas. Located in central neighborhoods near the HST train station. Monthly rentals, all-inclusive, perfect for professionals, students, and travelers.');
  lines.push('');
  lines.push('## Properties');
  lines.push('');
  for (const flat of flats) {
    const meta = FLAT_META[flat.slug];
    if (!meta) continue;
    const flatRooms = roomsByFlat.get(flat.id) || [];
    const url = `${SITE}/en/pisos/${meta.webSlug}/`;
    const range = flatPriceRange(flatRooms);
    const tail = meta.tagline ? `, ${meta.tagline}` : '';
    const roomLabel = flatRooms.length === 1 ? 'room' : 'rooms';
    lines.push(`- [${meta.nameEn}](${url}) — ${flatRooms.length} ${roomLabel}, ${range}, ${flat.neighborhood || ''}${tail}`);
  }
  lines.push('');
  lines.push("## What's Included");
  lines.push('');
  lines.push('- Furnished room (bed, desk, wardrobe, natural light)');
  lines.push('- High-speed WiFi (fibra)');
  lines.push('- All utilities (water, electricity, heating)');
  lines.push('- Equipped shared kitchen');
  lines.push('- Washing machine');
  lines.push('- Hot water heating');
  lines.push('- Common areas');
  lines.push('');
  lines.push('## Contact');
  lines.push('');
  lines.push('- WhatsApp: Available for inquiries');
  lines.push(`- Website: ${SITE}/en/contacto/`);
  lines.push('- Email: Contact via website');
  lines.push('');
  lines.push('## Languages');
  lines.push('');
  lines.push('Available in 8 languages: Spanish (ES), English (EN), Galician (GL), French (FR), German (DE), Korean (KO), Portuguese (PT), Polish (PL).');
  lines.push('');
  lines.push('## Rental Terms');
  lines.push('');
  lines.push('- Monthly rental (flexible terms)');
  lines.push('- All-inclusive price (no hidden fees)');
  lines.push('- Furnished and ready to move in');
  lines.push('- Central Vigo locations');
  lines.push('- Near public transport');
  lines.push('');
  lines.push('## Detailed Information');
  lines.push('');
  lines.push(`For complete property data including all room specifications, amenities, and coordinates, see [llms-full.txt](${SITE}/llms-full.txt)`);
  lines.push('');
  return lines.join('\n');
}

function renderLlmsFull({ flats, roomsByFlat, generatedAt }) {
  const allRooms = [...roomsByFlat.values()].flat();
  const stats = computeStats(allRooms);
  const licensed = flats.filter(f => f.has_tourist_license).length;

  const lines = [];
  lines.push('# Casas Vigo - Complete Property Inventory');
  lines.push('');
  lines.push('## File Description');
  lines.push('');
  lines.push('This is a complete, machine-readable inventory of all properties and rooms offered by Casas Vigo for furnished monthly rental in Vigo, Galicia, Spain. Regenerated automatically from the property management API.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Business Overview');
  lines.push('');
  lines.push('**Company:** Casas Vigo');
  lines.push('**Service:** Furnished room rentals (monthly)');
  lines.push('**Location:** Vigo, Galicia, Spain');
  lines.push(`**Website:** ${SITE}/`);
  lines.push('**Contact:** Via website form or WhatsApp');
  lines.push('');
  lines.push('**Portfolio:**');
  lines.push(`- ${flats.length} buildings / flats`);
  lines.push(`- ${stats.total} furnished rooms`);
  lines.push(`- Price range: ${stats.minPrice}-${stats.maxPrice} EUR/month`);
  lines.push(`- ${licensed} of ${flats.length} flats hold a Galician tourist rental license (VUT), enabling nightly stays`);
  lines.push('- All prices include utilities, WiFi, and common areas');
  lines.push('');
  lines.push('**Rental Terms:**');
  lines.push('- Monthly rental period (flexible terms available)');
  lines.push('- All-inclusive pricing (no hidden fees)');
  lines.push('- Furnished and ready to move in');
  lines.push('- Suitable for students, professionals, travelers');
  lines.push('- Central locations near public transport');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Standard Amenities (All Flats)');
  lines.push('');
  lines.push('- High-speed WiFi fibra');
  lines.push('- Equipped kitchen (cooking facilities)');
  lines.push('- Washing machine access');
  lines.push('- Central heating system');
  lines.push('- Hot water heating');
  lines.push('- Common areas (living room, etc.)');
  lines.push('- Furnished rooms (bed, desk, wardrobe, natural light)');
  lines.push('');
  lines.push('---');
  lines.push('');

  let flatIdx = 0;
  for (const flat of flats) {
    flatIdx++;
    const meta = FLAT_META[flat.slug] || {};
    const flatRooms = roomsByFlat.get(flat.id) || [];
    const amenities = parseJsonField(flat.amenities);
    const displayName = meta.nameEn || flat.name;

    lines.push(`# FLAT ${flatIdx}: ${displayName}`);
    lines.push('');
    lines.push('## Location Details');
    lines.push('');
    lines.push(`**Address:** ${flat.address}`);
    if (flat.neighborhood) lines.push(`**Neighborhood:** ${flat.neighborhood}`);
    if (meta.coordinates) lines.push(`**Coordinates:** ${meta.coordinates.lat}, ${meta.coordinates.lng}`);
    if (meta.tagline) lines.push(`**Description:** ${meta.tagline}`);
    lines.push(`**Tourist Rental License (VUT):** ${flat.has_tourist_license ? 'Yes' : 'No'}`);
    lines.push('');
    if (meta.localAmenities && meta.localAmenities.length) {
      lines.push('**Local Amenities:**');
      for (const a of meta.localAmenities) lines.push(`- ${a}`);
      lines.push('');
    }
    lines.push('## Flat-Specific Amenities');
    lines.push('');
    if (amenities.length) {
      for (const a of amenities) lines.push(`- ${a}`);
    } else {
      lines.push('- Standard amenities (see above)');
    }
    lines.push('');
    lines.push('## Rooms');
    lines.push('');
    let roomIdx = 0;
    for (const room of flatRooms) {
      roomIdx++;
      const features = parseJsonField(room.features);
      lines.push(`### Room ${roomIdx}: ${room.name}`);
      lines.push(`- Monthly rent: ${room.price_monthly} EUR`);
      if (room.size_m2) lines.push(`- Size: ${room.size_m2} m²`);
      if (room.bed_type) lines.push(`- Bed type: ${bedTypeEn(room.bed_type)}`);
      if (features.length) lines.push(`- Furnishings: ${features.join(', ')}`);
      lines.push(`- Availability: ${room.available ? 'Available' : (room.available_from ? `Occupied until ${room.available_from}` : 'Occupied')}`);
      lines.push('');
    }
    const range = flatPriceRange(flatRooms);
    const summaryLabel = flatRooms.length === 1 ? 'room' : 'rooms';
    lines.push(`**Flat Summary:** ${flatRooms.length} ${summaryLabel}, ${range}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('## Property Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|--------|-------|');
  lines.push(`| Total Buildings | ${flats.length} |`);
  lines.push(`| Total Rooms | ${stats.total} |`);
  lines.push(`| Currently Available | ${stats.available} |`);
  lines.push(`| Single Rooms | ${stats.singles} |`);
  lines.push(`| Double Rooms | ${stats.doubles} |`);
  lines.push(`| Minimum Rent | ${stats.minPrice} EUR/month |`);
  lines.push(`| Maximum Rent | ${stats.maxPrice} EUR/month |`);
  lines.push(`| Average Rent | ~${stats.avgPrice} EUR/month |`);
  lines.push(`| Average Room Size | ${stats.avgSize} m² |`);
  lines.push(`| Flats with Tourist License (VUT) | ${licensed} |`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Geographic Data');
  lines.push('');
  lines.push('### Vigo, Galicia, Spain');
  lines.push('');
  lines.push('Vigo is the largest city in Galicia, located in northwestern Spain on the Atlantic coast. Known for excellent quality of life, gastronomy, and access to nature.');
  lines.push('');
  lines.push('**Key Facts:**');
  lines.push('- Population: ~290,000 people');
  lines.push('- Region: Galicia (autonomous community)');
  lines.push('- Known for: Cíes Islands, Ría de Vigo, seafood cuisine');
  lines.push('- Transportation: High-speed train (AVE) station, airport connections');
  lines.push('- Climate: Temperate Atlantic, mild year-round');
  lines.push('');
  lines.push('**Neighborhoods:**');
  lines.push('- Casco Urbano (City Center): Historic district, walkable');
  lines.push('- Estación AVE / HST Station Area: Modern, transport hub, business district');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Contact & Booking');
  lines.push('');
  lines.push(`**Website:** ${SITE}/`);
  lines.push('');
  lines.push('**Languages Available:**');
  lines.push('- Spanish (ES)');
  lines.push('- English (EN)');
  lines.push('- Galician (GL)');
  lines.push('- French (FR)');
  lines.push('- German (DE)');
  lines.push('- Korean (KO)');
  lines.push('- Portuguese (PT)');
  lines.push('- Polish (PL)');
  lines.push('');
  lines.push('**How to Book:**');
  lines.push('1. Browse available rooms on website');
  lines.push('2. Check current availability');
  lines.push('3. Contact via website form or WhatsApp');
  lines.push('4. Arrange viewing and rental terms');
  lines.push('5. Sign monthly rental agreement');
  lines.push('6. Move in when ready');
  lines.push('');
  lines.push('**Terms & Conditions:**');
  lines.push('- Monthly rental period (flexible)');
  lines.push('- All-inclusive pricing (no hidden costs)');
  lines.push('- Furnished and ready to move in');
  lines.push('- Utilities and WiFi included');
  lines.push('- Shared common areas');
  lines.push('- Suitable for students, professionals, travelers');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Data Update Information');
  lines.push('');
  lines.push(`- Last Updated: ${generatedAt.slice(0, 10)}`);
  lines.push('- Data Source: Casas Vigo property management API (SQLite)');
  lines.push('- Data Format: Plain text, machine-readable');
  lines.push('- Coordinates: WGS84 (Latitude, Longitude)');
  lines.push('- Currency: EUR (Euro)');
  lines.push('- Language: English (property details)');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Additional Resources');
  lines.push('');
  lines.push(`- Website: ${SITE}/`);
  lines.push(`- Property List: ${SITE}/en/pisos/`);
  lines.push(`- Contact: ${SITE}/en/contacto/`);
  lines.push(`- Summary (short format): [llms.txt](${SITE}/llms.txt)`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('End of Casas Vigo Property Inventory');
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const [flatsRes, roomsRes] = await Promise.all([
    fetchJson(`${API_BASE}/api/flats`),
    fetchJson(`${API_BASE}/api/rooms`),
  ]);

  const flats = flatsRes.data;
  const rooms = roomsRes.data;
  const roomsByFlat = groupRoomsByFlat(rooms);
  const generatedAt = new Date().toISOString();

  const publicDir = path.join(__dirname, '..', 'web', 'public');

  const llms = renderLlms({ flats, roomsByFlat });
  const llmsFull = renderLlmsFull({ flats, roomsByFlat, generatedAt });

  fs.writeFileSync(path.join(publicDir, 'llms.txt'), llms);
  fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), llmsFull);

  console.log(`sync-llms: ${flats.length} flats, ${rooms.length} rooms → llms.txt (${llms.length}B), llms-full.txt (${llmsFull.length}B)`);
}

main().catch(err => {
  console.error('sync-llms failed:', err.message);
  process.exit(1);
});

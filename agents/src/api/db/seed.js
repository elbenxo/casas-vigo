const { initDb, closeDb } = require('./connection');

const FLATS = [
  {
    slug: 'irmandinos',
    name: 'Irmandinos 23',
    address: 'Rua Irmandinos 23, Vigo',
    neighborhood: 'Casco Urbano',
    amenities: ['WiFi fibra', 'cocina equipada', 'lavadora', 'secadora', 'calefaccion', 'aire acondicionado', 'ascensor', 'trastero'],
    has_tourist_license: 0,
    rooms: [
      { slug: 'primavera', name: 'Primavera', price_monthly: 380, size_m2: 14, bed_type: 'doble', features: ['Escritorio', 'armario empotrado', 'lampara arana'] },
      { slug: 'verano',    name: 'Verano',    price_monthly: 350, size_m2: 12, bed_type: 'individual', features: ['Escritorio', 'armario empotrado'] },
      { slug: 'otono',     name: 'Otoño',     price_monthly: 370, size_m2: 13, bed_type: 'doble', features: ['Escritorio', 'armario empotrado', 'lampara arana'] },
      { slug: 'invierno',  name: 'Invierno',  price_monthly: 340, size_m2: 11, bed_type: 'doble', features: ['Escritorio', 'armario empotrado'] },
    ],
  },
  {
    slug: '1d',
    name: 'Alfonso XIII 9, 1º Derecha',
    address: 'Alfonso XIII 9, Vigo',
    neighborhood: 'Estacion AVE',
    amenities: ['WiFi fibra', 'cocina equipada', 'lavadora', 'calefaccion', 'galeria acristalada', 'patio privado', '2 baños'],
    has_tourist_license: 1,
    rooms: [
      { slug: 'blue',     name: 'Blue',     price_monthly: 350, size_m2: 13, bed_type: 'doble',        features: ['Escritorio', 'armario empotrado'] },
      { slug: 'bambu',    name: 'Bambú',    price_monthly: 330, size_m2: 11, bed_type: 'individual',   features: ['Escritorio', 'armario', 'estanteria'] },
      { slug: 'estrella', name: 'Estrella', price_monthly: 360, size_m2: 14, bed_type: 'doble',        features: ['Escritorio', 'armario empotrado'] },
      { slug: 'mundo',    name: 'Mundo',    price_monthly: 340, size_m2: 12, bed_type: 'doble',        features: ['Escritorio', 'armario empotrado', 'mural decorativo'] },
      { slug: 'arroba',   name: 'Arroba',   price_monthly: 320, size_m2: 10, bed_type: 'individual',   features: ['Escritorio', 'armario', 'papel pintado tematico'] },
      { slug: 'prensa',   name: 'Prensa',   price_monthly: 300, size_m2: 16, bed_type: '2 individuales', features: ['Escritorio', 'armario', 'separador de ambientes'] },
    ],
  },
  {
    slug: '3i',
    name: 'Alfonso XIII 9, 3º Izquierda',
    address: 'Alfonso XIII 9, Vigo',
    neighborhood: 'Estacion AVE',
    amenities: ['WiFi fibra', 'cocina equipada', 'lavadora', 'calefaccion', 'chimenea', 'ascensor', 'vistas panoramicas'],
    has_tourist_license: 1,
    rooms: [
      { slug: 'azul',     name: 'Azul',     price_monthly: 320, size_m2: 12, bed_type: 'doble',        features: ['Escritorio', 'armario empotrado'] },
      { slug: 'roja',     name: 'Roja',     price_monthly: 310, size_m2: 11, bed_type: '2 individuales', features: ['Armario empotrado'] },
      { slug: 'amarilla', name: 'Amarilla', price_monthly: 300, size_m2: 10, bed_type: 'individual',   features: ['Escritorio', 'armario'] },
      { slug: 'verde',    name: 'Verde',    price_monthly: 330, size_m2: 12, bed_type: 'individual',   features: ['Escritorio grande', 'armario empotrado'] },
      { slug: 'blanca',   name: 'Blanca',   price_monthly: 340, size_m2: 14, bed_type: 'doble',        features: ['Panel cristal al baño', 'armario empotrado'] },
      { slug: 'gris',     name: 'Gris',     price_monthly: 310, size_m2: 11, bed_type: '2 individuales', features: ['Estanteria', 'armario'] },
    ],
  },
  {
    slug: '4d',
    name: 'Alfonso XIII 9, 4º Derecha Ático',
    address: 'Alfonso XIII 9, Vigo',
    neighborhood: 'Estacion AVE',
    amenities: ['WiFi fibra', 'cocina equipada', 'lavadora', 'calefaccion', '2 baños', 'vistas panoramicas', 'balcon', 'terraza privada'],
    has_tourist_license: 1,
    rooms: [
      { slug: 'oliva',        name: 'Oliva',        price_monthly: 370, size_m2: 13, bed_type: 'doble',      features: ['Viga vista', 'canapé', 'armario'] },
      { slug: 'blancoynegro', name: 'Blanco y Negro', price_monthly: 350, size_m2: 12, bed_type: 'doble',    features: ['Techo abuhardillado', 'escritorio'] },
      { slug: 'pistacho',     name: 'Pistacho',     price_monthly: 340, size_m2: 11, bed_type: 'individual', features: ['Armario empotrado', 'escritorio'] },
      { slug: 'roja',         name: 'Roja',         price_monthly: 340, size_m2: 11, bed_type: 'doble',      features: ['Escritorio', 'armario'] },
      { slug: 'calabaza',     name: 'Calabaza',     price_monthly: 360, size_m2: 12, bed_type: 'individual', features: ['Claraboya', 'escritorio', 'armario empotrado'] },
    ],
  },
  {
    slug: '4i',
    name: 'Alfonso XIII 9, 4º Izquierda Ático',
    address: 'Alfonso XIII 9, Vigo',
    neighborhood: 'Estacion AVE',
    amenities: ['WiFi fibra', 'cocina equipada', 'lavadora', 'calefaccion', 'terraza privada', 'claraboya', 'ventanales panoramicos', 'vistas ria'],
    has_tourist_license: 1,
    rooms: [
      { slug: 'provenzal', name: 'Provenzal',  price_monthly: 400, size_m2: 15, bed_type: 'doble',      features: ['Escritorio', 'armario empotrado', 'lampara arana', 'decoracion provenzal'] },
      { slug: 'nuevayork', name: 'Nueva York', price_monthly: 370, size_m2: 12, bed_type: 'individual', features: ['Escritorio cristal', 'armario', 'decoracion urbana'] },
    ],
  },
];

const OWNER_PHONE = process.env.OWNER_PHONE || '34000000000';

const OWNER = {
  phone: OWNER_PHONE,
  name: process.env.OWNER_NAME || 'Owner',
  role: 'owner',
  language: 'es',
};

const CONFIG = [
  { key: 'owner_phone',          value: OWNER_PHONE },
  { key: 'agent_hours_start',    value: '08:00' },
  { key: 'agent_hours_end',      value: '23:00' },
  { key: 'default_language',     value: 'es' },
  { key: 'supported_languages',  value: 'es,en,gl,fr,de,ko,pt,pl' },
];

function seed() {
  const db = initDb();

  const { count } = db.prepare('SELECT COUNT(*) AS count FROM flats').get();
  if (count > 0) {
    console.log('Database already seeded');
    closeDb();
    return;
  }

  const insertFlat = db.prepare(
    'INSERT INTO flats (slug, name, address, neighborhood, amenities, has_tourist_license) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertRoom = db.prepare(
    'INSERT INTO rooms (flat_id, slug, name, price_monthly, size_m2, bed_type, features) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const insertContact = db.prepare(
    'INSERT INTO contacts (phone, name, role, language) VALUES (?, ?, ?, ?)'
  );
  const insertConfig = db.prepare(
    'INSERT INTO config (key, value) VALUES (?, ?)'
  );

  const run = db.transaction(() => {
    let roomCount = 0;

    for (const flat of FLATS) {
      const { lastInsertRowid: flatId } = insertFlat.run(
        flat.slug,
        flat.name,
        flat.address,
        flat.neighborhood,
        JSON.stringify(flat.amenities),
        flat.has_tourist_license
      );

      for (const room of flat.rooms) {
        insertRoom.run(
          flatId,
          room.slug,
          room.name,
          room.price_monthly,
          room.size_m2,
          room.bed_type,
          JSON.stringify(room.features)
        );
        roomCount++;
      }
    }

    insertContact.run(OWNER.phone, OWNER.name, OWNER.role, OWNER.language);

    for (const entry of CONFIG) {
      insertConfig.run(entry.key, entry.value);
    }

    return roomCount;
  });

  const roomCount = run();

  console.log(`Seeded ${FLATS.length} flats, ${roomCount} rooms, 1 contact, ${CONFIG.length} config entries`);
  closeDb();
}

seed();

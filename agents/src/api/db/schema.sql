-- Pisos
CREATE TABLE IF NOT EXISTS flats (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT,
  amenities TEXT,              -- JSON array of strings
  has_tourist_license INTEGER DEFAULT 0,
  -- Web-facing identifiers (used for URLs and room id prefix in flats.ts)
  web_slug TEXT,               -- URL slug used by Astro (e.g. 'irmandinhos', 'alfonso-1-derecha')
  web_id_prefix TEXT,          -- room id prefix (e.g. 'ir', '1d', '3i', '4d', '4i')
  -- Multilingual content for the public web (JSON {es,en,gl,fr,de,ko,pt,pl})
  name_i18n TEXT,
  neighborhood_i18n TEXT,
  description_i18n TEXT,
  coordinates TEXT,            -- JSON {"lat":..., "lng":...}
  whole_flat_price REAL,       -- if set, the flat is rented as a whole at this price/month
  created_at TEXT DEFAULT (datetime('now'))
);

-- Habitaciones
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY,
  flat_id INTEGER NOT NULL REFERENCES flats(id),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  price_monthly REAL NOT NULL,
  price_nightly REAL,
  size_m2 REAL,
  bed_type TEXT,
  features TEXT,                -- JSON array of strings
  available INTEGER DEFAULT 1,
  available_from TEXT,
  note TEXT,
  -- Web-facing identifiers
  web_id TEXT,                  -- e.g. 'ir-primavera', '4i-nueva-york'
  name_i18n TEXT,               -- JSON {es,en,gl,...}
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(flat_id, slug)
);

-- Contactos
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'prospect',
  flat_id INTEGER REFERENCES flats(id),
  room_id INTEGER REFERENCES rooms(id),
  contract_start TEXT,
  contract_end TEXT,
  language TEXT DEFAULT 'es',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Ingresos
CREATE TABLE IF NOT EXISTS income (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER REFERENCES contacts(id),
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  amount REAL NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  payment_method TEXT DEFAULT 'efectivo',
  confirmed INTEGER DEFAULT 0,
  confirmed_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Costes
CREATE TABLE IF NOT EXISTS costs (
  id INTEGER PRIMARY KEY,
  flat_id INTEGER NOT NULL REFERENCES flats(id),
  type TEXT NOT NULL,
  description TEXT,
  amount REAL NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  invoice_file TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Recibos
CREATE TABLE IF NOT EXISTS receipts (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER NOT NULL REFERENCES contacts(id),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  rent_amount REAL NOT NULL,
  utilities_amount REAL NOT NULL,
  total REAL NOT NULL,
  sent_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Mensajes
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER NOT NULL REFERENCES contacts(id),
  channel TEXT NOT NULL DEFAULT 'whatsapp',
  direction TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TEXT DEFAULT (datetime('now'))
);

-- Citas
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER REFERENCES contacts(id),
  flat_id INTEGER NOT NULL REFERENCES flats(id),
  datetime TEXT NOT NULL,
  duration_min INTEGER DEFAULT 15,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Config
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Prospects (pre-venta / CRM)
CREATE TABLE IF NOT EXISTS prospects (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  dob TEXT,                        -- date of birth (for contract)
  dni TEXT,                        -- DNI/passport (for contract)
  language TEXT DEFAULT 'es',
  channel TEXT DEFAULT 'whatsapp',  -- whatsapp, telegram, web, idealista, referral, other
  status TEXT DEFAULT 'new',        -- new, contacted, visit_scheduled, visit_done, contract_sent, signed, lost
  flat_interest INTEGER REFERENCES flats(id),
  room_interest INTEGER REFERENCES rooms(id),
  loss_reason TEXT,                  -- price, location, timing, other (only when status=lost)
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Prospect interactions
CREATE TABLE IF NOT EXISTS prospect_interactions (
  id INTEGER PRIMARY KEY,
  prospect_id INTEGER NOT NULL REFERENCES prospects(id),
  type TEXT NOT NULL,          -- message, call, visit, email, note
  direction TEXT DEFAULT 'in', -- in, out
  summary TEXT NOT NULL,
  channel TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Reviews (testimonios mostrados en la web pública, multilingües)
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY,
  flat_id INTEGER NOT NULL REFERENCES flats(id),
  reviewer_name TEXT NOT NULL,
  text_i18n TEXT NOT NULL,        -- JSON {es,en,gl,fr,de,ko,pt,pl}
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reviews_flat ON reviews(flat_id, sort_order);

-- Photos
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY,
  flat_id INTEGER NOT NULL REFERENCES flats(id),
  room_id INTEGER REFERENCES rooms(id),  -- NULL = zona común del piso
  filename TEXT NOT NULL,                -- ruta relativa a web/public/images/, ej: "1-derecha/salon.jpg"
  description TEXT,                      -- alt text para SEO
  active INTEGER DEFAULT 1,
  is_cover INTEGER DEFAULT 0,            -- portada del piso o de la habitación
  sort_order INTEGER DEFAULT 0,
  uploaded_at TEXT DEFAULT (datetime('now')),
  UNIQUE(filename)
);
CREATE INDEX IF NOT EXISTS idx_photos_flat ON photos(flat_id, active, sort_order);
CREATE INDEX IF NOT EXISTS idx_photos_room ON photos(room_id, active, sort_order);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER PRIMARY KEY,
  prospect_id INTEGER NOT NULL REFERENCES prospects(id),
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  template_lang TEXT NOT NULL DEFAULT 'es',
  file_path TEXT,              -- path to generated HTML file
  status TEXT DEFAULT 'draft', -- draft, signed, terminated
  monthly_rent REAL,
  deposit REAL,
  start_date TEXT,
  end_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  signed_at TEXT
);

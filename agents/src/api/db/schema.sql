-- Pisos
CREATE TABLE IF NOT EXISTS flats (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT,
  amenities TEXT,              -- JSON array of strings
  has_tourist_license INTEGER DEFAULT 0,
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

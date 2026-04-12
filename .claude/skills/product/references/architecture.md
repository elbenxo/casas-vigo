# Arquitectura del Sistema - Casas Vigo

Documento canonico de arquitectura. Todas las decisiones de implementacion deben respetar este diseno.

Last updated: 2026-04-12

---

## Decisiones Arquitectonicas

1. **Persistencia**: SQLite (`better-sqlite3`) — un solo fichero, sin servidor
2. **LLM**: Claude CLI (`claude -p`) — gratis con suscripcion Pro
3. **Dashboard**: Node.js + Express + HTML/JS vanilla + Tailwind CDN
4. **Agentes**: Sistema nuevo desde cero (elbenxo-bot fue prototipo, se reemplaza)
5. **Acceso a datos**: Solo via API REST. Ningun componente accede a SQLite directamente excepto la capa API
6. **Servicio Windows**: NSSM para auto-arranque al encender el PC
7. **Hibernate/Sleep**: Deteccion de wake + reconexion automatica de WhatsApp
8. **MCP Server**: Servidor MCP que wrappea la API REST, permitiendo gestion via Claude Code

---

## Vista General del Sistema

```
                            GitHub Pages
                           ┌────────────┐
                           │  Web (Astro)│  ← git push
                           └─────┬──────┘
                                 ↑
                            deploy script
                                 │
┌────────────────────────────────┼───────────────────────────────────┐
│                       Windows 10 (local)                           │
│                                │                                   │
│  ┌─────────────────────────────┴──────────────────────────────┐   │
│  │          Proceso Principal (Node.js — Windows Service)      │   │
│  │                                                              │   │
│  │  ┌─── CAPA 1: Core API (Express, puerto 3000) ───────────┐ │   │
│  │  │                                                         │ │   │
│  │  │  SQLite (better-sqlite3) ← unico punto de acceso a DB  │ │   │
│  │  │  REST API: /api/rooms, /api/contacts, /api/income...    │ │   │
│  │  │  Dashboard HTML: /dashboard/* (Vanilla JS + Tailwind)   │ │   │
│  │  │  Health check: GET /health                              │ │   │
│  │  │                                                         │ │   │
│  │  └─────────────────────┬───────────────────────────────────┘ │   │
│  │                        │ API OK? → arrancar agentes          │   │
│  │  ┌─────────────────────┴───────────────────────────────────┐ │   │
│  │  │                                                         │ │   │
│  │  │  CAPA 2: Agent System                                   │ │   │
│  │  │                                                         │ │   │
│  │  │  WhatsApp Client ──→ Router ──┬→ Sales Agent            │ │   │
│  │  │  (whatsapp-web.js)     │      ├→ Tenant Agent           │ │   │
│  │  │                        │      └→ Owner Handler          │ │   │
│  │  │                        │                                │ │   │
│  │  │  Cada agente:                                           │ │   │
│  │  │    Lee datos via GET http://localhost:3000/api/...       │ │   │
│  │  │    Escribe via POST/PUT http://localhost:3000/api/...    │ │   │
│  │  │    Invoca Claude CLI (claude -p --model sonnet)          │ │   │
│  │  │                                                         │ │   │
│  │  │  Google Calendar API ← Sales Agent (citas)              │ │   │
│  │  │  Email IMAP ← Tenant Agent (facturas)                   │ │   │
│  │  │                                                         │ │   │
│  │  │  Sleep/Wake: sleeptime → detecta hibernate              │ │   │
│  │  │    → fuerza reconexion WhatsApp                         │ │   │
│  │  │                                                         │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  CAPA 3: MCP Server (casasvigo-mcp, stdio transport)        │   │
│  │                                                              │   │
│  │  Claude Code (propietario) ←→ MCP tools ←→ Core API :3000   │   │
│  │  Gestion por lenguaje natural: habitaciones, ingresos,       │   │
│  │  costes, contactos, contratos, configuracion                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Scripts auxiliares (tambien usan API, no DB directa):              │
│    sync-availability.js  →  GET /api/rooms → availability.json      │
│    deploy-web.js         →  git push → GitHub Pages                 │
│    backup-db.js          →  copia casasvigo.db → Google Drive       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Principio Clave: Todo via API

```
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐
  │  Sales   │  │  Tenant  │  │ Dashboard│  │ Scripts  │  │ Claude Code  │
  │  Agent   │  │  Agent   │  │  (HTML)  │  │          │  │ (propietario)│
  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘
       │              │             │              │               │
       └──────┬───────┴──────┬──────┘              │          MCP protocol
              │  HTTP REST   │                     │               │
              ▼              ▼                     ▼               ▼
       ┌───────────────────────────────────────────────────────────────┐
       │                    Core API (Express :3000)                    │
       │                                                               │
       │   REST: GET/POST/PUT/DELETE /api/*                            │
       │   MCP:  casasvigo-mcp server (stdio, wrappea REST endpoints) │
       │   Solo este modulo importa better-sqlite3                     │
       └──────────────────────────┬────────────────────────────────────┘
                                  │
                                  ▼
                            ┌───────────┐
                            │  SQLite   │
                            │ casasvigo │
                            │   .db     │
                            └───────────┘
```

**Regla**: Ningun modulo fuera de la capa API importa `better-sqlite3`. Todo acceso es via REST o MCP.

**Consecuencia**: Si la API no esta disponible, los agentes no arrancan y los scripts fallan con error claro.

---

## Secuencia de Arranque

```
1. Windows Service arranca proceso Node.js
2. Inicializa SQLite (crea/migra tablas si necesario)
3. Arranca Express en puerto 3000 (API + Dashboard)
4. Self-test: GET http://localhost:3000/health
5. Si health OK → Inicializa WhatsApp client
6. WhatsApp ready → Activa router + agentes
7. Si health FAIL → Log error, no arranca agentes, reintenta en 30s
```

---

## Manejo de Hibernate/Sleep

```
Sistema en ejecucion
  │
  ├─ sleeptime.on('wakeup') detecta despertar
  │   │
  │   ├─ Log: "System woke up after Xms"
  │   ├─ Health check API (GET /health)
  │   │   ├─ OK → Verificar estado WhatsApp
  │   │   └─ FAIL → Reiniciar Express + SQLite
  │   │
  │   └─ WhatsApp client status
  │       ├─ Connected → OK, procesar mensajes pendientes
  │       └─ Disconnected → client.destroy() + client.initialize()
  │           └─ LocalAuth restaura sesion (sin QR)
  │
  ├─ Watchdog: cada 30s verifica /health + WhatsApp status
  │   └─ 3 fallos consecutivos → restart completo
  │
  └─ Mensajes recibidos durante sleep
      → WhatsApp los entrega al reconectar
      → Router los procesa normalmente
```

---

## Windows Service

```
Herramienta: NSSM (Non-Sucking Service Manager)
  - Probado, estable, funciona en Windows 10
  - Auto-restart en crash
  - Rotacion de logs integrada

Instalacion:
  nssm install CasasVigo "C:\Program Files\nodejs\node.exe" "E:\...\agents\src\index.js"
  nssm set CasasVigo AppDirectory "E:\...\agents"
  nssm set CasasVigo AppStdout "E:\...\logs\service.log"
  nssm set CasasVigo AppStderr "E:\...\logs\error.log"
  nssm set CasasVigo AppRotateFiles 1
  nssm set CasasVigo AppRestartDelay 10000

Alternativa moderna: Shawl (Rust, mantenido activamente, instalable via winget)

Script de setup: scripts/install-service.js
```

---

## Componentes en Detalle

### A) Core API (Express, puerto 3000)

Unico punto de acceso a SQLite. Todos los demas componentes consumen esta API.

**Endpoints:**

```
# Propiedades
GET    /api/flats                    Lista pisos
GET    /api/flats/:id/rooms          Habitaciones de un piso
GET    /api/rooms                    Todas las habitaciones (con filtros)
PUT    /api/rooms/:id                Actualizar habitacion (precio, disponibilidad)

# Contactos
GET    /api/contacts                 Lista contactos (filtrable por role)
GET    /api/contacts/by-phone/:phone Buscar por telefono (para routing)
POST   /api/contacts                 Crear contacto
PUT    /api/contacts/:id             Actualizar contacto (role, room, etc.)

# Financiero
GET    /api/income                   Ingresos (filtrable por mes/piso/habitacion)
POST   /api/income                   Registrar ingreso
GET    /api/costs                    Costes (filtrable por mes/piso/tipo)
POST   /api/costs                    Registrar coste
GET    /api/receipts                 Recibos generados
POST   /api/receipts                 Generar recibo

# Conversaciones
GET    /api/conversations/:contactId Historial de conversacion
POST   /api/messages                 Guardar mensaje

# Citas
GET    /api/appointments             Citas (filtrable por fecha/piso)
POST   /api/appointments             Crear cita
PUT    /api/appointments/:id         Actualizar cita

# Configuracion
GET    /api/config                   Toda la configuracion
GET    /api/config/:key              Valor de una clave
PUT    /api/config/:key              Actualizar clave

# Prospects (CRM)
GET    /api/prospects                Lista prospectos (filtros: status, channel, flat, lang)
GET    /api/prospects/:id            Detalle de prospecto
POST   /api/prospects                Crear prospecto
PUT    /api/prospects/:id            Actualizar prospecto
PUT    /api/prospects/:id/status     Cambiar estado en pipeline
GET    /api/prospects/:id/interactions  Historial de interacciones
POST   /api/prospects/:id/interactions  Registrar interaccion
GET    /api/prospects/analytics/summary  Estadisticas CRM agregadas

# Contratos
GET    /api/contracts                Lista contratos (filtros: status, prospect, room)
GET    /api/contracts/:id            Detalle de contrato
POST   /api/contracts/generate       Generar contrato desde plantilla (prospect + room + lang)
GET    /api/contracts/:id/download   Servir HTML del contrato (para preview/imprimir)
PUT    /api/contracts/:id/sign       Firmar: prospect → tenant (transaccion atomica)
PUT    /api/contracts/:id/status     Cambiar estado (draft → terminated)

# Sistema
GET    /health                       Health check (API + DB status)
GET    /api/stats                    Estadisticas generales (para dashboard home)
```

### B) Dashboard

Servido por el mismo Express en `/dashboard/*`.

- HTML estatico desde `dashboard/public/`
- Cada pagina usa `fetch('/api/...')` para leer/escribir datos
- Tailwind CSS via CDN (sin build step)
- Paginas: Home (resumen), Habitaciones, Ingresos, Costes, Contactos, Config

### C) Agent System

**Router:**
```
Mensaje entrante → extraer phone
  → GET /api/contacts/by-phone/{phone}
  → Si es owner → Owner Handler
  → Si role == 'tenant' → Tenant Agent
  → Else → Sales Agent
```

**Flujo de cada agente (Sales/Tenant):**
```
1. Recibe mensaje + phone
2. GET /api/contacts/by-phone/{phone} → contexto del contacto
3. GET /api/rooms (o datos especificos) → contexto de datos
4. GET /api/conversations/{contactId} → historial
5. Construye prompt: system_prompt + datos + historial + mensaje_nuevo
6. Invoca: claude -p --model sonnet --allowedTools ""
7. Parsea respuesta (texto + posibles acciones)
8. Si hay accion → POST/PUT a la API correspondiente
9. Envia respuesta por WhatsApp
10. POST /api/messages → guarda en historial
```

**Owner Handler:**
```
Comandos via WhatsApp:
  "habitacion X cerrada hasta Y" → PUT /api/rooms/:id
  "precio habitacion X = 350"    → PUT /api/rooms/:id
  "[prospecto] confirmado"       → PUT /api/contacts/:id (role: tenant)
  "info"                         → GET /api/stats
```

### D) MCP Server (casasvigo-mcp)

Servidor MCP que expone la API como herramientas para Claude Code. El propietario gestiona todo con lenguaje natural.

**MCP Tools:**

```
# Propiedades
get_rooms          → GET /api/rooms           — Lista habitaciones (filtros: flat, available)
update_room        → PUT /api/rooms/:id       — Cambiar precio, disponibilidad, nota

# Contactos
get_contacts       → GET /api/contacts        — Lista contactos (filtros: role)
find_contact       → GET /api/contacts/by-phone/:phone — Buscar por telefono
create_contact     → POST /api/contacts       — Nuevo contacto
update_contact     → PUT /api/contacts/:id    — Cambiar role, asignar habitacion

# Financiero
get_income         → GET /api/income          — Ingresos (filtros: month, year, flat)
add_income         → POST /api/income         — Registrar pago
get_costs          → GET /api/costs           — Costes (filtros: month, year, flat, type)
add_cost           → POST /api/costs          — Registrar coste
generate_receipt   → POST /api/receipts       — Generar recibo mensual

# Citas
get_appointments   → GET /api/appointments    — Citas programadas
create_appointment → POST /api/appointments   — Agendar visita

# Contratos
draft_contract     → POST /api/contracts/draft — Generar borrador de contrato

# Sistema
get_stats          → GET /api/stats           — Resumen: ocupacion, ingresos, costes
get_config         → GET /api/config          — Configuracion actual
update_config      → PUT /api/config/:key     — Cambiar configuracion
system_health      → GET /health              — Estado del sistema
```

**Configuracion** (`.mcp.json`):
```json
{
  "mcpServers": {
    "casasvigo": {
      "command": "node",
      "args": ["agents/src/mcp/server.js"],
      "env": {
        "API_BASE": "http://localhost:3000"
      }
    }
  }
}
```

**Ejemplo de uso:**
```
"Que habitaciones estan libres?" → get_rooms(available=true)
"Cierra la hab Azul hasta el 15 de abril" → update_room(slug="azul", available=false, available_from="2026-04-15")
"Cuanto he ingresado este mes?" → get_income(month=3, year=2026) → calcula total
```

### E) Web Publica

Sin cambios. Astro + Tailwind, GitHub Pages. `availability.json` generado desde API.

---

## Canales de Control del Propietario

| Canal | Tipo | Cuando usar |
|-------|------|-------------|
| WhatsApp → Owner Handler | Texto comandos | Rapido, desde movil, cambios simples |
| Dashboard (localhost:3000) | UI web | Vision general, tablas, edicion detallada |
| Claude Code → MCP tools | Lenguaje natural | Consultas complejas, operaciones multiples |

Los 3 canales acceden a la misma API y al mismo SQLite. Son intercambiables.

---

## SQLite Schema

```sql
-- Pisos
CREATE TABLE flats (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  has_tourist_license INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Habitaciones
CREATE TABLE rooms (
  id INTEGER PRIMARY KEY,
  flat_id INTEGER NOT NULL REFERENCES flats(id),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  price_monthly REAL NOT NULL,
  price_nightly REAL,              -- solo para piso turistico
  size_m2 REAL,
  available INTEGER DEFAULT 1,
  available_from TEXT,              -- fecha ISO
  note TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(flat_id, slug)
);

-- Contactos (routing + CRM basico)
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'prospect',  -- owner|tenant|prospect|ex-tenant
  flat_id INTEGER REFERENCES flats(id),
  room_id INTEGER REFERENCES rooms(id),
  contract_start TEXT,
  contract_end TEXT,
  language TEXT DEFAULT 'es',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Ingresos
CREATE TABLE income (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER REFERENCES contacts(id),
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  amount REAL NOT NULL,
  month INTEGER NOT NULL,           -- 1-12
  year INTEGER NOT NULL,
  payment_method TEXT DEFAULT 'efectivo',
  confirmed INTEGER DEFAULT 0,
  confirmed_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Costes (suministros, IBI, seguros, reparaciones)
CREATE TABLE costs (
  id INTEGER PRIMARY KEY,
  flat_id INTEGER NOT NULL REFERENCES flats(id),
  type TEXT NOT NULL,               -- agua|luz|gas|internet|ibi|seguro|reparacion|otro
  description TEXT,
  amount REAL NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  invoice_file TEXT,                -- ruta al fichero de factura
  created_at TEXT DEFAULT (datetime('now'))
);

-- Recibos mensuales (alquiler + suministros)
CREATE TABLE receipts (
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

-- Mensajes (historial de conversaciones)
CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER NOT NULL REFERENCES contacts(id),
  channel TEXT NOT NULL DEFAULT 'whatsapp',
  direction TEXT NOT NULL,          -- in|out
  content TEXT NOT NULL,
  timestamp TEXT DEFAULT (datetime('now'))
);

-- Citas (visitas)
CREATE TABLE appointments (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER REFERENCES contacts(id),
  flat_id INTEGER NOT NULL REFERENCES flats(id),
  datetime TEXT NOT NULL,
  duration_min INTEGER DEFAULT 15,
  status TEXT DEFAULT 'scheduled',  -- scheduled|completed|cancelled|no-show
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Configuracion clave-valor
CREATE TABLE config (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);
```

---

## Estructura de Ficheros

```
casas-vigo/
├── web/                              # [existente] Astro static site
│
├── agents/
│   ├── src/
│   │   ├── index.js                  # Entry point: API → health check → WhatsApp → agentes
│   │   │
│   │   ├── api/                      # CAPA 1: Core API (unico acceso a SQLite)
│   │   │   ├── server.js             # Express app setup
│   │   │   ├── routes/
│   │   │   │   ├── flats.js
│   │   │   │   ├── rooms.js
│   │   │   │   ├── contacts.js
│   │   │   │   ├── income.js
│   │   │   │   ├── costs.js
│   │   │   │   ├── receipts.js
│   │   │   │   ├── messages.js
│   │   │   │   ├── appointments.js
│   │   │   │   ├── config.js
│   │   │   │   ├── contracts.js
│   │   │   │   └── health.js
│   │   │   └── db/
│   │   │       ├── connection.js     # better-sqlite3 init + WAL mode
│   │   │       ├── schema.sql        # DDL completo
│   │   │       └── seed.js           # Datos iniciales (5 pisos, 27 habitaciones)
│   │   │
│   │   ├── agents/                   # CAPA 2: Agent System
│   │   │   ├── router.js             # Phone lookup → delega a agente
│   │   │   ├── base-agent.js         # Logica comun: build prompt, invoke claude, parse
│   │   │   ├── sales/
│   │   │   │   ├── agent.js          # Sales agent logic
│   │   │   │   ├── prompt.md         # System prompt pre-venta
│   │   │   │   └── context.js        # Builds context from API data
│   │   │   ├── tenant/
│   │   │   │   ├── agent.js
│   │   │   │   ├── prompt.md
│   │   │   │   └── context.js
│   │   │   └── owner/
│   │   │       └── handler.js        # Parsea comandos, llama API
│   │   │
│   │   ├── transport/
│   │   │   └── whatsapp.js           # WhatsApp client (refactored de services/whatsapp-api)
│   │   │
│   │   ├── services/
│   │   │   ├── calendar.js           # Google Calendar API
│   │   │   ├── email.js              # IMAP reader para facturas
│   │   │   └── contracts.js          # Template engine (Handlebars o similar)
│   │   │
│   │   ├── mcp/
│   │   │   └── server.js             # MCP server (stdio) — wrappea API REST
│   │   │
│   │   └── lifecycle/
│   │       ├── service-setup.js      # Instalar como Windows service (NSSM)
│   │       ├── watchdog.js           # Health monitoring + auto-restart
│   │       └── sleep-handler.js      # Detecta hibernate → reconecta WhatsApp
│   │
│   ├── templates/
│   │   ├── contracts/                # Plantillas multiidioma
│   │   │   ├── temporada-es.md
│   │   │   ├── temporada-en.md
│   │   │   ├── turistico-es.md
│   │   │   └── ...
│   │   └── receipts/
│   │       └── recibo.md
│   │
│   └── package.json
│
├── dashboard/
│   └── public/                       # Servido por Express del proceso principal
│       ├── index.html                # Home: resumen ocupacion + finanzas
│       ├── rooms.html                # Gestion habitaciones
│       ├── income.html               # Ingresos
│       ├── costs.html                # Costes
│       ├── contacts.html             # Contactos
│       ├── config.html               # Configuracion
│       ├── js/
│       │   ├── app.js                # Router SPA + shared utils
│       │   ├── rooms.js
│       │   ├── income.js
│       │   └── ...
│       └── css/
│           └── custom.css            # Estilos extra (Tailwind via CDN)
│
├── data/
│   ├── casasvigo.db                  # SQLite (fuente de verdad)
│   ├── availability.json             # Generado desde API → para web
│   └── backups/                      # Para sync con Google Drive
│
├── scripts/
│   ├── sync-availability.js          # GET /api/rooms → availability.json
│   ├── deploy-web.js                 # sync + git push → GitHub Pages
│   ├── backup-db.js                  # Copia DB → backups/
│   └── install-service.js            # Setup NSSM service
│
└── docs/
    └── architecture.md               # Este documento
```

---

## Procesos y Puertos

| Componente | Puerto | Tipo | Lifecycle |
|------------|--------|------|-----------|
| Core API + Dashboard + Agents | 3000 | Windows Service (NSSM) | Siempre encendido |
| MCP Server | stdio | Lanzado por Claude Code | Bajo demanda |
| Web | N/A | GitHub Pages | Estatico |

Un solo proceso Node.js para API + agentes. Un solo puerto (3000).

---

## Dependencias

```json
{
  "dependencies": {
    "express": "^4.x",
    "better-sqlite3": "^11.x",
    "whatsapp-web.js": "^1.26.x",
    "qrcode-terminal": "^0.12.x",
    "sleeptime": "latest",
    "@anthropic-ai/sdk": "latest"
  },
  "optionalDependencies": {
    "googleapis": "latest",
    "imap": "latest",
    "handlebars": "latest"
  }
}
```

`@anthropic-ai/sdk` se usa solo para el MCP server (protocolo MCP), no para llamadas LLM (esas usan `claude -p`).

---

## Upgrade Path

Si el volumen crece o se necesita mas sofisticacion:

1. **LLM**: Migrar de `claude -p` a Claude Agent SDK (subagentes nativos, tool use nativo via MCP)
2. **WhatsApp**: Migrar de whatsapp-web.js a WhatsApp Business API (oficial, sin riesgo de ban)
3. **Dashboard**: Si vanilla JS se queda corto, anadir Alpine.js o htmx (via CDN, sin build)
4. **Multi-canal**: Anadir Telegram como segundo transport (mismo router + agentes)
5. **MCP expansion**: Anadir resources MCP (habitaciones como resources navegables por Claude)

---

## Investigacion: Frameworks de agentes (2026-03-29)

Se investigaron alternativas a construir el sistema custom:

- **Claude Agent SDK**: El mas relevante (routing nativo por IA, subagentes). Requiere API credits ($) — no compatible con presupuesto gratis actual.
- **OpenClaw**: Gratis y open-source, pero 512 vulnerabilidades de seguridad en audit. No apto para datos de inquilinos.
- **LangChain/CrewAI/AutoGen**: Overkill para este caso. Todos requieren API credits.
- **Conclusion**: `claude -p` + routing custom es la mejor opcion para presupuesto gratis. Si en el futuro se necesita mas sofisticacion, migrar a Claude Agent SDK.

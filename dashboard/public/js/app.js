// Casas Vigo Dashboard — Utilidades compartidas

const API = '/api';

// ─── DOM ──────────────────────────────────────────────────────
const el = (id) => document.getElementById(id);

// ─── API Helper ───────────────────────────────────────────────
async function api(path, opts = {}) {
  const fetchOpts = { headers: { 'Content-Type': 'application/json' } };
  if (opts.method) fetchOpts.method = opts.method;
  if (opts.body) fetchOpts.body = JSON.stringify(opts.body);
  const res = await fetch(`${API}${path}`, fetchOpts);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
  return json.data;
}

// ─── Formato ──────────────────────────────────────────────────
const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

function mesNombre(m) { return MESES[m - 1] || ''; }

function eur(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n || 0);
}

function fecha(s) {
  if (!s) return '\u2014';
  return new Date(s).toLocaleDateString('es-ES');
}

const HOY = new Date();
const MES = HOY.getMonth() + 1;
const ANO = HOY.getFullYear();

// ─── Constantes ───────────────────────────────────────────────
const TIPOS_COSTE = {
  agua: 'Agua', luz: 'Luz', gas: 'Gas', internet: 'Internet',
  ibi: 'IBI', seguro: 'Seguro', reparacion: 'Reparacion', otro: 'Otro'
};

const ROLES = {
  owner: 'Propietario', tenant: 'Inquilino',
  prospect: 'Prospecto', 'ex-tenant': 'Ex-inquilino'
};

const METODOS_PAGO = {
  efectivo: 'Efectivo', transferencia: 'Transferencia', bizum: 'Bizum'
};

// ─── Iconos SVG (Heroicons outline) ──────────────────────────
function ico(d) {
  return `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="${d}"/></svg>`;
}

const ICONS = {
  home:     'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  rooms:    'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  income:   'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  costs:    'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z',
  contacts: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  config:   'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  menu:     'M4 6h16M4 12h16M4 18h16',
  x:        'M6 18L18 6M6 6l12 12',
  plus:     'M12 4v16m8-8H4',
  edit:     'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  check:    'M5 13l4 4L19 7',
};

// ─── Navegacion ───────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home',     href: '/dashboard/',              label: 'Inicio',        icon: 'home' },
  { id: 'rooms',    href: '/dashboard/rooms.html',    label: 'Habitaciones',  icon: 'rooms' },
  { id: 'income',   href: '/dashboard/income.html',   label: 'Ingresos',      icon: 'income' },
  { id: 'costs',    href: '/dashboard/costs.html',    label: 'Costes',        icon: 'costs' },
  { id: 'contacts', href: '/dashboard/contacts.html', label: 'Contactos',     icon: 'contacts' },
  { id: 'config',   href: '/dashboard/config.html',   label: 'Configuracion', icon: 'config' },
];

function initNav(activeId) {
  const nav = el('nav');
  if (!nav) return;

  const links = NAV_ITEMS.map(n => {
    const active = n.id === activeId;
    const cls = active
      ? 'bg-indigo-600 text-white'
      : 'text-slate-300 hover:bg-slate-700 hover:text-white';
    return `<a href="${n.href}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${cls}">
      ${ico(ICONS[n.icon])} ${n.label}
    </a>`;
  }).join('');

  nav.innerHTML = `
    <div class="lg:hidden flex items-center justify-between bg-slate-800 text-white px-4 py-3 fixed top-0 inset-x-0 z-50">
      <span class="font-bold text-lg">Casas Vigo</span>
      <button onclick="toggleNav()" class="p-1">${ico(ICONS.menu)}</button>
    </div>
    <div id="nav-overlay" class="fixed inset-0 bg-black/40 z-30 lg:hidden hidden" onclick="toggleNav()"></div>
    <aside id="sidebar" class="fixed inset-y-0 left-0 w-56 bg-slate-800 transform -translate-x-full lg:translate-x-0 transition-transform duration-200 z-40 flex flex-col">
      <div class="p-5 border-b border-slate-700 hidden lg:block">
        <h1 class="text-white font-bold text-lg tracking-tight">Casas Vigo</h1>
        <p class="text-slate-400 text-xs mt-0.5">Panel de Control</p>
      </div>
      <nav class="flex-1 p-3 space-y-1 overflow-y-auto mt-14 lg:mt-0">${links}</nav>
    </aside>`;
}

function toggleNav() {
  el('sidebar').classList.toggle('-translate-x-full');
  el('nav-overlay').classList.toggle('hidden');
}

// ─── Notificaciones ───────────────────────────────────────────
function notify(msg, type = 'success') {
  const c = el('toast-container');
  if (!c) return;
  const bg = { success: 'bg-emerald-600', error: 'bg-red-600', info: 'bg-blue-600' };
  const toast = document.createElement('div');
  toast.className = `${bg[type] || bg.info} text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium transition-opacity duration-300`;
  toast.textContent = msg;
  c.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ─── Selectores comunes ───────────────────────────────────────
function llenarPisos(sel, pisos, todos = true) {
  sel.innerHTML = todos
    ? '<option value="">Todos los pisos</option>'
    : '<option value="">Seleccionar piso\u2026</option>';
  pisos.forEach(f => {
    sel.innerHTML += `<option value="${f.id}">${f.name}</option>`;
  });
}

function llenarMes(sel, selected) {
  sel.innerHTML = '';
  MESES.forEach((n, i) => {
    const m = i + 1;
    sel.innerHTML += `<option value="${m}"${m === (selected ?? MES) ? ' selected' : ''}>${n}</option>`;
  });
}

function llenarAno(sel, selected) {
  sel.innerHTML = '';
  for (let y = ANO + 1; y >= ANO - 3; y--) {
    sel.innerHTML += `<option value="${y}"${y === (selected ?? ANO) ? ' selected' : ''}>${y}</option>`;
  }
}

function llenarHabitaciones(sel, rooms, todos = false) {
  sel.innerHTML = todos
    ? '<option value="">Todas</option>'
    : '<option value="">Seleccionar\u2026</option>';
  rooms.forEach(r => {
    sel.innerHTML += `<option value="${r.id}">${r.name}</option>`;
  });
}

function llenarHabitacionesPorPiso(sel, pisos, rooms, todos = false) {
  sel.innerHTML = todos
    ? '<option value="">Todas</option>'
    : '<option value="">Seleccionar\u2026</option>';
  pisos.forEach(f => {
    const flatRooms = rooms.filter(r => r.flat_id === f.id);
    if (!flatRooms.length) return;
    const grp = document.createElement('optgroup');
    grp.label = f.name;
    flatRooms.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = r.name;
      grp.appendChild(opt);
    });
    sel.appendChild(grp);
  });
}

// ─── Modal ────────────────────────────────────────────────────
function abrirModal(id) { el(id).classList.remove('hidden'); }
function cerrarModal(id) { el(id).classList.add('hidden'); }

// ─── Layout HTML comun ────────────────────────────────────────
function pageShell(title) {
  return `<div class="mb-6"><h2 class="text-2xl font-bold text-slate-800">${title}</h2></div>`;
}

// ─── Utilidades ───────────────────────────────────────────────
function buildMap(arr, key = 'id') {
  const m = {};
  arr.forEach(item => { m[item[key]] = item; });
  return m;
}

function pct(part, total) {
  if (!total) return '0';
  return Math.round((part / total) * 100);
}

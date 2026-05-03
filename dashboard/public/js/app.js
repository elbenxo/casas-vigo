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
  prospects:'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
  contracts:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  occupancy:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
  config:   'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  menu:     'M4 6h16M4 12h16M4 18h16',
  x:        'M6 18L18 6M6 6l12 12',
  plus:     'M12 4v16m8-8H4',
  edit:     'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  check:    'M5 13l4 4L19 7',
  eye:      'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  upload:   'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
  spin:     'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  photos:   'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
  building: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z',
};

// ─── Navegacion ───────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home',      href: '/dashboard/',                label: 'Inicio',        icon: 'home' },
  { id: 'flats',     href: '/dashboard/flats.html',      label: 'Pisos',         icon: 'building' },
  { id: 'rooms',     href: '/dashboard/rooms.html',      label: 'Habitaciones',  icon: 'rooms' },
  { id: 'photos',    href: '/dashboard/photos.html',     label: 'Fotos',         icon: 'photos' },
  { id: 'occupancy', href: '/dashboard/occupancy.html',  label: 'Ocupacion',     icon: 'occupancy' },
  { id: 'calendar',  href: '/dashboard/calendar.html',   label: 'Calendario',    icon: 'calendar' },
  { id: 'income',    href: '/dashboard/income.html',     label: 'Ingresos',      icon: 'income' },
  { id: 'costs',     href: '/dashboard/costs.html',      label: 'Costes',        icon: 'costs' },
  { id: 'contacts',  href: '/dashboard/contacts.html',   label: 'Contactos',     icon: 'contacts' },
  { id: 'prospects', href: '/dashboard/prospects.html',  label: 'Prospectos',    icon: 'prospects' },
  { id: 'contracts', href: '/dashboard/contracts.html',  label: 'Contratos',     icon: 'contracts' },
  { id: 'config',    href: '/dashboard/config.html',     label: 'Configuracion', icon: 'config' },
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
      <div id="deploy-panel" class="p-3 border-t border-slate-700 space-y-2">
        <button id="btn-preview" onclick="previewWeb()" class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-sky-600 text-white hover:bg-sky-500 transition-colors">
          ${ico(ICONS.eye)} Vista previa
        </button>
        <div id="deploy-confirm" class="hidden space-y-2">
          <a href="/casas-vigo/" target="_blank" class="block text-center text-xs text-sky-400 hover:text-sky-300 underline">Abrir preview &rarr;</a>
          <button id="btn-publish" onclick="publishWeb()" class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition-colors">
            ${ico(ICONS.upload)} Publicar
          </button>
          <button id="btn-cancel" onclick="cancelDeploy()" class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            ${ico(ICONS.x)} Cancelar
          </button>
        </div>
      </div>
    </aside>`;

  // Restore deploy state if preview was active
  fetch(`${API}/deploy-web/status`).then(r => r.json()).then(d => {
    if (d.state === 'previewing') setDeployState('previewing');
  }).catch(() => {});
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
  let html = todos
    ? '<option value="">Todos los pisos</option>'
    : '<option value="">Seleccionar piso\u2026</option>';
  pisos.forEach(f => { html += `<option value="${f.id}">${f.name}</option>`; });
  sel.innerHTML = html;
}

function llenarMes(sel, selected, includeAll = false) {
  let html = includeAll ? '<option value="">Todo el a\u00f1o</option>' : '';
  MESES.forEach((n, i) => {
    const m = i + 1;
    html += `<option value="${m}"${m === (selected ?? MES) ? ' selected' : ''}>${n}</option>`;
  });
  sel.innerHTML = html;
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

function diasHasta(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function eurM2(price, m2) {
  if (!price || !m2) return null;
  return Math.round((price / m2) * 100) / 100;
}

function occBarColor(p) {
  return p >= 80 ? 'bg-emerald-500' : p >= 50 ? 'bg-amber-400' : 'bg-red-400';
}

function breakdownBar(label, amount, total, colorClass) {
  const p = total ? Math.round((amount / total) * 100) : 0;
  return `
    <div class="flex items-center gap-3">
      <span class="text-sm text-slate-600 w-36 truncate">${label}</span>
      <div class="flex-1 bg-slate-100 rounded-full h-2">
        <div class="${colorClass} h-2 rounded-full" style="width:${p}%"></div>
      </div>
      <span class="text-sm font-medium text-slate-700 w-24 text-right">${eur(amount)}</span>
      <span class="text-xs text-slate-400 w-10 text-right">${p}%</span>
    </div>`;
}

function groupByKey(arr, keyFn) {
  const m = {};
  arr.forEach(item => {
    const k = keyFn(item);
    if (!m[k]) m[k] = [];
    m[k].push(item);
  });
  return m;
}

// ─── HTML escape (shared by prospects.js + contracts.js) ─────
function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Parse JSON column from DB row, returning fallback on error/empty
function parseJson(s, fallback) {
  if (!s) return fallback;
  try { return JSON.parse(s); } catch { return fallback; }
}

// ─── Deploy Web (preview → publish/cancel) ──────────────────
function setDeployState(mode) {
  const btnPreview = el('btn-preview');
  const confirmPanel = el('deploy-confirm');
  if (mode === 'idle') {
    btnPreview.classList.remove('hidden');
    btnPreview.disabled = false;
    btnPreview.innerHTML = `${ico(ICONS.eye)} Vista previa`;
    btnPreview.classList.replace('bg-slate-600', 'bg-sky-600');
    confirmPanel.classList.add('hidden');
  } else if (mode === 'building') {
    btnPreview.disabled = true;
    btnPreview.innerHTML = `${ico(ICONS.spin)} Construyendo\u2026`;
    btnPreview.classList.replace('bg-sky-600', 'bg-slate-600');
    confirmPanel.classList.add('hidden');
  } else if (mode === 'previewing') {
    btnPreview.classList.add('hidden');
    confirmPanel.classList.remove('hidden');
  } else if (mode === 'publishing') {
    el('btn-publish').disabled = true;
    el('btn-publish').innerHTML = `${ico(ICONS.spin)} Publicando\u2026`;
    el('btn-cancel').classList.add('hidden');
  }
}

async function previewWeb() {
  setDeployState('building');
  try {
    const res = await fetch(`${API}/deploy-web/preview`, { method: 'POST' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
    setDeployState('previewing');
    notify('Preview listo — revisa la web antes de publicar', 'info');
    window.open('/casas-vigo/', '_blank');
  } catch (err) {
    setDeployState('idle');
    notify(`Error al construir preview: ${err.message}`, 'error');
  }
}

async function publishWeb() {
  setDeployState('publishing');
  try {
    const res = await fetch(`${API}/deploy-web/publish`, { method: 'POST' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
    if (json.output && json.output.includes('No changes')) {
      notify('Sin cambios — web ya actualizada', 'info');
    } else {
      notify('Web publicada — GitHub Actions desplegara en ~1 min');
    }
  } catch (err) {
    notify(`Error al publicar: ${err.message}`, 'error');
  }
  setDeployState('idle');
}

async function cancelDeploy() {
  try {
    await fetch(`${API}/deploy-web/cancel`, { method: 'POST' });
    notify('Publicacion cancelada', 'info');
  } catch (err) {
    notify(`Error al cancelar: ${err.message}`, 'error');
  }
  setDeployState('idle');
}

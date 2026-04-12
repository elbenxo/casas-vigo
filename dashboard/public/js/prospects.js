// Casas Vigo Dashboard — Prospects CRM Module

// ─── Pipeline config ─────────────────────────────────────────────────────────
const PIPELINE = [
  { id: 'new',              label: 'Nuevo',         color: 'blue',    next: 'contacted' },
  { id: 'contacted',        label: 'Contactado',    color: 'cyan',    next: 'visit_scheduled' },
  { id: 'visit_scheduled',  label: 'Visita prog.',  color: 'purple',  next: 'visit_done' },
  { id: 'visit_done',       label: 'Visita hecha',  color: 'indigo',  next: 'contract_sent' },
  { id: 'contract_sent',    label: 'Contrato env.', color: 'amber',   next: 'signed' },
  { id: 'signed',           label: 'Firmado',       color: 'emerald', next: null },
  { id: 'lost',             label: 'Perdido',       color: 'red',     next: null },
];
const PIPELINE_MAP = buildMap(PIPELINE);

const ACTIVE_STATUSES = PIPELINE.filter(s => s.id !== 'signed' && s.id !== 'lost').map(s => s.id);

// ─── Channel config ───────────────────────────────────────────────────────────
const CHANNELS = {
  whatsapp:  { label: 'WhatsApp',  badge: 'bg-green-100 text-green-700',   icon: '📱' },
  telegram:  { label: 'Telegram',  badge: 'bg-sky-100 text-sky-700',       icon: '✈️' },
  web:       { label: 'Web',       badge: 'bg-slate-100 text-slate-600',   icon: '🌐' },
  idealista: { label: 'Idealista', badge: 'bg-orange-100 text-orange-700', icon: '🏠' },
  referral:  { label: 'Referido',  badge: 'bg-violet-100 text-violet-700', icon: '👥' },
  other:     { label: 'Otro',      badge: 'bg-slate-100 text-slate-500',   icon: '💬' },
};

const LOSS_REASONS = {
  price:    'Precio',
  location: 'Ubicacion',
  timing:   'Timing',
  other:    'Otro',
};

const LANG_FLAGS = { es: '🇪🇸', en: '🇬🇧', gl: '🏴', fr: '🇫🇷', de: '🇩🇪', ko: '🇰🇷', pt: '🇵🇹', pl: '🇵🇱' };

const INTERACTION_TYPES = {
  note:  'Nota', call: 'Llamada', whatsapp: 'WhatsApp',
  email: 'Email', visit: 'Visita', other: 'Otro',
};

// ─── State ────────────────────────────────────────────────────────────────────
let _prospects = [];
let _pisos = [];
let _rooms = [];
let _currentView = 'kanban'; // 'kanban' | 'stats'
let _currentProspect = null; // for detail modal
let _pendingStatusChange = null; // { id, newStatus }

// ─── Init ─────────────────────────────────────────────────────────────────────
async function initProspects() {
  try {
    [_pisos, _rooms] = await Promise.all([
      api('/flats'),
      api('/rooms'),
    ]);
    _populateFlatSelect('edit-flat');
    _populateFlatSelect('filter-flat');
    await _loadProspects();
    _renderView();
  } catch (err) {
    notify('Error al cargar prospectos: ' + err.message, 'error');
  }
}

// ─── Data loading ─────────────────────────────────────────────────────────────
async function _loadProspects() {
  const status = el('filter-status') ? el('filter-status').value : '';
  const channel = el('filter-channel') ? el('filter-channel').value : '';
  const flat = el('filter-flat') ? el('filter-flat').value : '';
  let q = [];
  if (status)  q.push(`status=${status}`);
  if (channel) q.push(`channel=${channel}`);
  if (flat)    q.push(`flat_interest=${flat}`);
  _prospects = await api('/prospects' + (q.length ? '?' + q.join('&') : ''));
}

// ─── View switching ───────────────────────────────────────────────────────────
function switchView(view) {
  _currentView = view;
  el('btn-view-kanban').classList.toggle('bg-white', view === 'kanban');
  el('btn-view-kanban').classList.toggle('shadow-sm', view === 'kanban');
  el('btn-view-kanban').classList.toggle('text-slate-700', view === 'kanban');
  el('btn-view-kanban').classList.toggle('text-slate-400', view !== 'kanban');
  el('btn-view-stats').classList.toggle('bg-white', view === 'stats');
  el('btn-view-stats').classList.toggle('shadow-sm', view === 'stats');
  el('btn-view-stats').classList.toggle('text-slate-700', view === 'stats');
  el('btn-view-stats').classList.toggle('text-slate-400', view !== 'stats');
  el('view-kanban').classList.toggle('hidden', view !== 'kanban');
  el('view-stats').classList.toggle('hidden', view !== 'stats');
  _renderView();
}

function _renderView() {
  if (_currentView === 'kanban') {
    _renderKanban();
  } else {
    _renderStats();
  }
}

// ─── Kanban ───────────────────────────────────────────────────────────────────
const COL_COLORS = {
  blue:    { header: 'bg-blue-50 border-blue-200',    dot: 'bg-blue-400',    badge: 'bg-blue-100 text-blue-700'    },
  cyan:    { header: 'bg-cyan-50 border-cyan-200',     dot: 'bg-cyan-400',    badge: 'bg-cyan-100 text-cyan-700'    },
  purple:  { header: 'bg-purple-50 border-purple-200', dot: 'bg-purple-400',  badge: 'bg-purple-100 text-purple-700' },
  indigo:  { header: 'bg-indigo-50 border-indigo-200', dot: 'bg-indigo-400',  badge: 'bg-indigo-100 text-indigo-700' },
  amber:   { header: 'bg-amber-50 border-amber-200',   dot: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700'  },
  emerald: { header: 'bg-emerald-50 border-emerald-200',dot: 'bg-emerald-400',badge: 'bg-emerald-100 text-emerald-700'},
  red:     { header: 'bg-red-50 border-red-200',       dot: 'bg-red-400',     badge: 'bg-red-100 text-red-700'      },
};

function _renderKanban() {
  const byStatus = groupByKey(_prospects, p => p.status || 'new');
  const container = el('kanban-board');
  container.innerHTML = PIPELINE.map(stage => {
    const items = byStatus[stage.id] || [];
    const c = COL_COLORS[stage.color];
    const cards = items.map(p => _buildCard(p, stage)).join('');
    return `
      <div class="kanban-col flex-shrink-0 w-60 flex flex-col gap-2">
        <div class="flex items-center gap-2 px-2 py-2 rounded-lg border ${c.header}">
          <span class="w-2 h-2 rounded-full ${c.dot}"></span>
          <span class="text-xs font-semibold text-slate-700 flex-1">${stage.label}</span>
          <span class="text-xs font-bold ${c.badge} badge">${items.length}</span>
        </div>
        <div class="space-y-2 min-h-16">
          ${cards || '<div class="text-xs text-slate-300 text-center py-4">Sin prospectos</div>'}
        </div>
      </div>`;
  }).join('');
}

function _buildCard(p, stage) {
  const ch = CHANNELS[p.channel] || CHANNELS.other;
  const flat = _pisos.find(f => f.id === p.flat_interest);
  const room = _rooms.find(r => r.id === p.room_interest);
  const flag = LANG_FLAGS[p.language] || '';
  const dias = p.created_at ? Math.floor((Date.now() - new Date(p.created_at)) / 86400000) : 0;
  const lastNote = p.last_interaction_summary
    ? `<p class="text-xs text-slate-400 truncate mt-1" title="${esc(p.last_interaction_summary)}">${esc(p.last_interaction_summary)}</p>`
    : '';
  const interest = flat
    ? `<p class="text-xs text-slate-500">${flat.name}${room ? ' · ' + room.name : ''}</p>`
    : '';

  const nextStage = stage.next ? PIPELINE_MAP[stage.next] : null;
  const advanceBtn = nextStage
    ? `<button onclick="advanceStatus(${p.id}, '${nextStage.id}')" title="Mover a ${nextStage.label}"
         class="text-xs px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors">→</button>`
    : '';

  const lostBtn = stage.id !== 'lost' && stage.id !== 'signed'
    ? `<button onclick="markLost(${p.id})" title="Marcar como perdido"
         class="text-xs px-1.5 py-0.5 rounded bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors">✗</button>`
    : '';

  const contractBtn = stage.id === 'signed'
    ? `<a href="/dashboard/contacts.html" title="Gestionar contrato"
         class="text-xs px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors">📄</a>`
    : '';

  return `
    <div class="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
         onclick="openDetail(${p.id})">
      <div class="flex items-start justify-between gap-1 mb-1">
        <span class="text-sm font-medium text-slate-800 leading-tight flex-1 truncate">${esc(p.name)}</span>
        <span class="text-xs">${flag}</span>
      </div>
      <div class="flex items-center gap-1 mb-1">
        <span class="badge ${ch.badge} text-xs">${ch.icon} ${ch.label}</span>
      </div>
      ${interest}
      ${lastNote}
      <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
        <span class="text-xs text-slate-300">${dias}d</span>
        <div class="flex gap-1" onclick="event.stopPropagation()">
          ${advanceBtn}${lostBtn}${contractBtn}
        </div>
      </div>
    </div>`;
}

// ─── Status transitions ────────────────────────────────────────────────────────
async function advanceStatus(id, newStatus) {
  if (newStatus === 'lost') { markLost(id); return; }
  try {
    await api(`/prospects/${id}/status`, { method: 'PUT', body: { status: newStatus } });
    notify('Estado actualizado');
    await _loadProspects();
    _renderView();
  } catch (err) {
    notify(err.message, 'error');
  }
}

function markLost(id) {
  _pendingStatusChange = { id, newStatus: 'lost' };
  el('loss-reason').value = 'price';
  abrirModal('modal-lost');
}

async function confirmLost() {
  if (!_pendingStatusChange) return;
  const { id } = _pendingStatusChange;
  const loss_reason = el('loss-reason').value;
  try {
    await api(`/prospects/${id}/status`, { method: 'PUT', body: { status: 'lost', loss_reason } });
    notify('Prospecto marcado como perdido');
    cerrarModal('modal-lost');
    _pendingStatusChange = null;
    await _loadProspects();
    _renderView();
  } catch (err) {
    notify(err.message, 'error');
  }
}

// ─── Prospect detail modal ────────────────────────────────────────────────────
async function openDetail(id) {
  try {
    const [p, interactions] = await Promise.all([
      api(`/prospects/${id}`),
      api(`/prospects/${id}/interactions`),
    ]);
    _currentProspect = p;
    _renderDetailModal(p, interactions);
    abrirModal('modal-detail');
  } catch (err) {
    notify(err.message, 'error');
  }
}

function _renderDetailModal(p, interactions) {
  const ch = CHANNELS[p.channel] || CHANNELS.other;
  const flat = _pisos.find(f => f.id === p.flat_interest);
  const room = _rooms.find(r => r.id === p.room_interest);
  const stage = PIPELINE_MAP[p.status || 'new'];
  const stageColor = COL_COLORS[stage ? stage.color : 'blue'];
  const flag = LANG_FLAGS[p.language] || '';

  el('detail-header').innerHTML = `
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold text-slate-800 truncate">${esc(p.name)}</h3>
        <div class="flex flex-wrap items-center gap-2 mt-1">
          <span class="badge ${stageColor.badge}">${stage ? stage.label : p.status}</span>
          <span class="badge ${ch.badge}">${ch.icon} ${ch.label}</span>
          <span class="text-sm">${flag}</span>
        </div>
      </div>
      <button onclick="cerrarModal('modal-detail')" class="p-1 text-slate-400 hover:text-slate-600 flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>`;

  el('detail-info').innerHTML = `
    <div class="grid grid-cols-2 gap-3 text-sm">
      ${_infoRow('Telefono', p.phone ? `<a href="tel:${p.phone}" class="text-indigo-600 hover:underline">${p.phone}</a>` : '—')}
      ${_infoRow('Email', p.email ? `<a href="mailto:${p.email}" class="text-indigo-600 hover:underline">${esc(p.email)}</a>` : '—')}
      ${_infoRow('Idioma', (flag + ' ' + (p.language || 'es').toUpperCase()).trim())}
      ${_infoRow('Canal', ch.label)}
      ${_infoRow('Piso interes', flat ? esc(flat.name) : '—')}
      ${_infoRow('Habitacion', room ? esc(room.name) : '—')}
      ${_infoRow('Creado', fecha(p.created_at))}
      ${_infoRow('Actualizado', fecha(p.updated_at))}
    </div>
    ${p.notes ? `<div class="mt-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600"><strong class="text-slate-700">Notas:</strong> ${esc(p.notes)}</div>` : ''}
    <div class="flex flex-wrap gap-2 mt-3">
      ${p.phone ? `<a href="https://wa.me/${p.phone.replace(/\D/g,'')}" target="_blank"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors">
          📱 WhatsApp
        </a>` : ''}
      ${p.phone ? `<a href="tel:${p.phone}"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors">
          📞 Llamar
        </a>` : ''}
      ${p.email ? `<a href="mailto:${p.email}"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-500 text-white text-xs font-medium rounded-lg hover:bg-slate-600 transition-colors">
          ✉️ Email
        </a>` : ''}
      <button onclick="editProspect(${p.id})"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-200 transition-colors">
          ✏️ Editar
      </button>
    </div>`;

  // Interactions timeline
  const iHtml = (interactions || []).length
    ? interactions.map(i => {
        const typeLabel = INTERACTION_TYPES[i.type] || i.type;
        const dir = i.direction === 'inbound' ? '← ' : '→ ';
        return `
          <div class="flex gap-3 py-2 border-b border-slate-50 last:border-0">
            <div class="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-medium mt-0.5">
              ${_interactionIcon(i.type)}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-slate-700">${dir}${typeLabel}</span>
                <span class="text-xs text-slate-400">${fecha(i.created_at)}</span>
              </div>
              ${i.summary ? `<p class="text-sm text-slate-600 mt-0.5">${esc(i.summary)}</p>` : ''}
            </div>
          </div>`;
      }).join('')
    : '<p class="text-sm text-slate-400 text-center py-4">Sin interacciones registradas</p>';
  el('detail-interactions').innerHTML = iHtml;

  // Reset add-interaction form
  el('add-int-type').value = 'note';
  el('add-int-direction').value = 'outbound';
  el('add-int-summary').value = '';
}

function _infoRow(label, value) {
  return `<div><p class="text-xs text-slate-400">${label}</p><p class="text-slate-700 font-medium">${value}</p></div>`;
}

function _interactionIcon(type) {
  const icons = { call: '📞', whatsapp: '📱', email: '✉️', visit: '🏠', note: '📝', other: '💬' };
  return icons[type] || '💬';
}

async function submitInteraction() {
  if (!_currentProspect) return;
  const body = {
    type:      el('add-int-type').value,
    direction: el('add-int-direction').value,
    summary:   el('add-int-summary').value.trim(),
  };
  if (!body.summary) { notify('Escribe un resumen', 'error'); return; }
  try {
    await api(`/prospects/${_currentProspect.id}/interactions`, { method: 'POST', body });
    notify('Interaccion registrada');
    const [p, interactions] = await Promise.all([
      api(`/prospects/${_currentProspect.id}`),
      api(`/prospects/${_currentProspect.id}/interactions`),
    ]);
    _currentProspect = p;
    _renderDetailModal(p, interactions);
    await _loadProspects();
    if (_currentView === 'kanban') _renderKanban();
  } catch (err) {
    notify(err.message, 'error');
  }
}

// ─── Edit prospect ────────────────────────────────────────────────────────────
async function editProspect(id) {
  cerrarModal('modal-detail');
  try {
    const p = await api(`/prospects/${id}`);
    el('edit-id').value = p.id;
    el('edit-name').value = p.name || '';
    el('edit-phone').value = p.phone || '';
    el('edit-email').value = p.email || '';
    el('edit-lang').value = p.language || 'es';
    el('edit-channel').value = p.channel || 'whatsapp';
    el('edit-flat').value = p.flat_interest || '';
    _onEditFlatChange(p.room_interest);
    el('edit-notes').value = p.notes || '';
    el('edit-modal-title').textContent = 'Editar prospecto';
    abrirModal('modal-edit-prospect');
  } catch (err) {
    notify(err.message, 'error');
  }
}

function openNewProspect() {
  el('edit-id').value = '';
  el('edit-name').value = '';
  el('edit-phone').value = '';
  el('edit-email').value = '';
  el('edit-lang').value = 'es';
  el('edit-channel').value = 'whatsapp';
  el('edit-flat').value = '';
  el('edit-room').innerHTML = '<option value="">— Habitacion —</option>';
  el('edit-notes').value = '';
  el('edit-modal-title').textContent = 'Nuevo prospecto';
  abrirModal('modal-edit-prospect');
}

function _onEditFlatChange(selectedRoom) {
  const flatId = parseInt(el('edit-flat').value);
  const sel = el('edit-room');
  sel.innerHTML = '<option value="">— Habitacion —</option>';
  if (!flatId) return;
  _rooms.filter(r => r.flat_id === flatId).forEach(r => {
    sel.innerHTML += `<option value="${r.id}"${r.id === selectedRoom ? ' selected' : ''}>${esc(r.name)}</option>`;
  });
}

el('form-edit-prospect') && el('form-edit-prospect').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = el('edit-id').value;
  const body = {
    name:         el('edit-name').value.trim() || null,
    phone:        el('edit-phone').value.trim() || null,
    email:        el('edit-email').value.trim() || null,
    language:     el('edit-lang').value,
    channel:      el('edit-channel').value,
    flat_interest: el('edit-flat').value ? parseInt(el('edit-flat').value) : null,
    room_interest: el('edit-room').value ? parseInt(el('edit-room').value) : null,
    notes:        el('edit-notes').value.trim() || null,
  };
  try {
    if (id) {
      await api(`/prospects/${id}`, { method: 'PUT', body });
      notify('Prospecto actualizado');
    } else {
      if (!body.name) { notify('El nombre es obligatorio', 'error'); return; }
      await api('/prospects', { method: 'POST', body });
      notify('Prospecto creado');
    }
    cerrarModal('modal-edit-prospect');
    await _loadProspects();
    _renderView();
  } catch (err) {
    notify(err.message, 'error');
  }
});

// ─── Filters ──────────────────────────────────────────────────────────────────
async function applyFilters() {
  try {
    await _loadProspects();
    _renderView();
  } catch (err) {
    notify(err.message, 'error');
  }
}

// ─── Stats view ───────────────────────────────────────────────────────────────
async function _renderStats() {
  const container = el('view-stats');
  try {
    let analytics;
    try {
      analytics = await api('/prospects/analytics/summary');
    } catch (_) {
      // Fallback: compute from loaded prospects
      analytics = _computeAnalytics();
    }
    container.innerHTML = _buildStatsHTML(analytics);
  } catch (err) {
    container.innerHTML = `<div class="text-center py-12 text-red-400">${err.message}</div>`;
  }
}

function _computeAnalytics() {
  const total = _prospects.length;
  const lost = _prospects.filter(p => p.status === 'lost').length;
  const active = _prospects.filter(p => ACTIVE_STATUSES.includes(p.status || 'new')).length;
  const conversion = total ? Math.round((_prospects.filter(p => p.status === 'signed').length / total) * 100) : 0;
  const now = new Date();
  const thisMonth = _prospects.filter(p => {
    if (!p.created_at) return false;
    const d = new Date(p.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // By channel
  const byChannel = {};
  _prospects.forEach(p => {
    const ch = p.channel || 'other';
    byChannel[ch] = (byChannel[ch] || 0) + 1;
  });

  // By status (funnel)
  const byStatus = {};
  PIPELINE.forEach(s => { byStatus[s.id] = 0; });
  _prospects.forEach(p => { byStatus[p.status || 'new'] = (byStatus[p.status || 'new'] || 0) + 1; });

  // By month (last 6)
  const byMonth = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    byMonth[key] = 0;
  }
  _prospects.forEach(p => {
    if (!p.created_at) return;
    const d = new Date(p.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (key in byMonth) byMonth[key]++;
  });

  return { total, active, conversion, thisMonth, byChannel, byStatus, byMonth, avgDaysToSign: null };
}

function _buildStatsHTML(a) {
  const { total, active, conversion, thisMonth, byChannel, byStatus, byMonth, avgDaysToSign } = a;

  // KPI cards
  const kpiCards = `
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div class="stat-card bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500">Leads activos</p>
        <p class="text-3xl font-bold text-blue-600 mt-1">${active}</p>
        <p class="text-xs text-slate-400 mt-1">en pipeline</p>
      </div>
      <div class="stat-card bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500">Tasa de conversion</p>
        <p class="text-3xl font-bold text-emerald-600 mt-1">${conversion}%</p>
        <p class="text-xs text-slate-400 mt-1">firmados / total</p>
      </div>
      <div class="stat-card bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500">Tiempo hasta firma</p>
        <p class="text-3xl font-bold text-indigo-600 mt-1">${avgDaysToSign != null ? avgDaysToSign + 'd' : '—'}</p>
        <p class="text-xs text-slate-400 mt-1">media dias</p>
      </div>
      <div class="stat-card bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500">Leads este mes</p>
        <p class="text-3xl font-bold text-slate-800 mt-1">${thisMonth}</p>
        <p class="text-xs text-slate-400 mt-1">nuevos leads</p>
      </div>
    </div>`;

  // By channel
  const maxCh = Math.max(1, ...Object.values(byChannel));
  const channelBars = Object.entries(byChannel)
    .sort((a, b) => b[1] - a[1])
    .map(([ch, count]) => {
      const cfg = CHANNELS[ch] || CHANNELS.other;
      const w = Math.round((count / maxCh) * 100);
      return `
        <div class="flex items-center gap-3">
          <span class="text-sm text-slate-600 w-24 truncate">${cfg.icon} ${cfg.label}</span>
          <div class="flex-1 bg-slate-100 rounded-full h-2">
            <div class="occ-bar bg-indigo-400 h-2 rounded-full" style="width:${w}%"></div>
          </div>
          <span class="text-sm font-medium text-slate-700 w-8 text-right">${count}</span>
        </div>`;
    }).join('') || '<p class="text-sm text-slate-400">Sin datos</p>';

  // Funnel
  const maxFunnel = Math.max(1, ...Object.values(byStatus));
  const funnelBars = PIPELINE.map(stage => {
    const count = byStatus[stage.id] || 0;
    const w = Math.round((count / maxFunnel) * 100);
    const c = COL_COLORS[stage.color];
    return `
      <div class="flex items-center gap-3">
        <span class="text-xs text-slate-600 w-28 truncate">${stage.label}</span>
        <div class="flex-1 bg-slate-100 rounded-full h-3">
          <div class="occ-bar ${c.dot} h-3 rounded-full" style="width:${w}%"></div>
        </div>
        <span class="text-sm font-medium text-slate-700 w-6 text-right">${count}</span>
      </div>`;
  }).join('');

  // Monthly bars
  const monthEntries = Object.entries(byMonth);
  const maxMonth = Math.max(1, ...monthEntries.map(e => e[1]));
  const monthBars = monthEntries.map(([key, count]) => {
    const [y, m] = key.split('-');
    const label = MESES[parseInt(m) - 1].slice(0, 3);
    const h = Math.round((count / maxMonth) * 60);
    return `
      <div class="flex flex-col items-center gap-1">
        <span class="text-xs font-medium text-slate-600">${count}</span>
        <div class="w-8 bg-slate-100 rounded-t relative" style="height:64px">
          <div class="absolute bottom-0 left-0 right-0 bg-indigo-400 rounded-t occ-bar" style="height:${h}px"></div>
        </div>
        <span class="text-xs text-slate-400">${label}</span>
      </div>`;
  }).join('');

  return `
    ${kpiCards}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 class="text-sm font-semibold text-slate-700 mb-4">Leads por canal</h3>
        <div class="space-y-2">${channelBars}</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 class="text-sm font-semibold text-slate-700 mb-4">Embudo de conversion</h3>
        <div class="space-y-2">${funnelBars}</div>
      </div>
    </div>
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mt-6">
      <h3 class="text-sm font-semibold text-slate-700 mb-4">Leads por mes (ultimos 6 meses)</h3>
      <div class="flex items-end gap-4 justify-center">${monthBars}</div>
    </div>`;
}

// ─── Populate helpers ─────────────────────────────────────────────────────────
function _populateFlatSelect(selId) {
  const sel = el(selId);
  if (!sel) return;
  llenarPisos(sel, _pisos);
}

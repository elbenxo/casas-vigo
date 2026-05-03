// Rooms page — CRUD habitaciones con i18n

(function () {
  initNav('rooms');

  const LANGS = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'gl', label: 'Galego' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ko', label: '한국어' },
    { code: 'pt', label: 'Português' },
    { code: 'pl', label: 'Polski' },
  ];

  const state = { pisos: [], habitaciones: [] };

  async function cargar() {
    try {
      const [pisos, habitaciones] = await Promise.all([api('/flats'), api('/rooms')]);
      state.pisos = pisos;
      state.habitaciones = habitaciones;
      renderizar();
    } catch (err) {
      el('content').innerHTML = `<div class="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">${esc(err.message)}</div>`;
    }
  }

  function renderizar() {
    const html = state.pisos.map(f => {
      const habs = state.habitaciones.filter(h => h.flat_id === f.id);
      const libres = habs.filter(h => h.available).length;
      return `
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <div class="flex items-baseline justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-slate-800">${esc(f.name)}</h3>
              <p class="text-sm text-slate-400">${esc(f.address)}${f.has_tourist_license ? ' · <span class="text-amber-500">Licencia turística</span>' : ''}</p>
            </div>
            <span class="badge ${libres === habs.length ? 'bg-emerald-100 text-emerald-700' : libres > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}">
              ${libres}/${habs.length} libres
            </span>
          </div>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            ${habs.map(h => {
              const features = parseJson(h.features, []);
              const nameI18n = parseJson(h.name_i18n, {});
              return `
                <div class="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium text-slate-800">${esc(h.name)}</p>
                      <p class="text-xs text-slate-400">${esc(h.slug)}${h.size_m2 ? ' · ' + h.size_m2 + ' m²' : ''}${h.bed_type ? ' · ' + esc(h.bed_type) : ''}</p>
                      ${h.web_id ? `<p class="text-xs text-indigo-600 mt-0.5">web: ${esc(h.web_id)}</p>` : ''}
                    </div>
                    <span class="badge ${h.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}">
                      ${h.available ? 'Libre' : 'Ocupada'}
                    </span>
                  </div>
                  ${features.length ? `<p class="text-xs text-slate-500 mt-2">${features.map(esc).join(' · ')}</p>` : ''}
                  ${nameI18n.en ? `<p class="text-xs text-slate-400 mt-1 italic">EN: ${esc(nameI18n.en)}</p>` : ''}
                  <div class="mt-3 flex items-baseline justify-between">
                    <div>
                      <span class="text-lg font-bold text-slate-800">${eur(h.price_monthly)}</span><span class="text-xs text-slate-400">/mes</span>
                      ${h.price_nightly ? `<br><span class="text-sm text-slate-500">${eur(h.price_nightly)}</span><span class="text-xs text-slate-400">/noche</span>` : ''}
                    </div>
                    <button onclick="editar(${h.id})" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Editar</button>
                  </div>
                  ${h.available_from ? `<p class="text-xs text-slate-400 mt-2">Libre desde: ${fecha(h.available_from)}</p>` : ''}
                  ${h.note ? `<p class="text-xs text-slate-500 mt-1 italic">${esc(h.note)}</p>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
    el('content').innerHTML = html || '<div class="text-slate-400">Sin pisos.</div>';
  }

  // ─── Form helpers ─────────────────────────────────────

  function fillFlatSelect() {
    const sel = el('edit-flat');
    sel.innerHTML = state.pisos.map(f => `<option value="${f.id}">${esc(f.name)}</option>`).join('');
  }

  function buildI18nFields() {
    el('i18n-name').innerHTML = LANGS.map(l => `
      <div>
        <label class="block text-xs font-medium text-slate-500 mb-1">${l.label} <span class="text-slate-400">(${l.code})</span></label>
        <input type="text" id="name-${l.code}" class="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm">
      </div>
    `).join('');
  }

  function readI18n() {
    const out = {};
    for (const l of LANGS) {
      const v = el(`name-${l.code}`).value.trim();
      if (v) out[l.code] = v;
    }
    return out;
  }

  function setI18n(obj) {
    for (const l of LANGS) {
      const input = el(`name-${l.code}`);
      if (input) input.value = (obj && obj[l.code]) || '';
    }
  }

  // ─── Open modal ───────────────────────────────────────

  window.editar = function (id) {
    const h = state.habitaciones.find(r => r.id === id);
    if (!h) return;
    el('modal-title').textContent = `Editar habitación: ${h.name}`;
    fillFlatSelect();
    buildI18nFields();
    el('edit-id').value = h.id;
    el('edit-flat').value = h.flat_id;
    el('edit-slug').value = h.slug;
    el('edit-name').value = h.name;
    el('edit-web-id').value = h.web_id || '';
    el('edit-price').value = h.price_monthly;
    el('edit-nightly').value = h.price_nightly || '';
    el('edit-size').value = h.size_m2 || '';
    el('edit-bed').value = h.bed_type || '';
    el('edit-available').value = h.available ? '1' : '0';
    el('edit-from').value = h.available_from || '';
    el('edit-note').value = h.note || '';
    el('edit-features').value = parseJson(h.features, []).join(', ');
    setI18n(parseJson(h.name_i18n, {}));
    el('btn-delete').style.display = '';
    abrirModal('modal-edit');
  };

  window.abrirNueva = function () {
    el('modal-title').textContent = 'Nueva habitación';
    fillFlatSelect();
    buildI18nFields();
    el('form-edit').reset();
    el('edit-id').value = '';
    el('edit-available').value = '1';
    el('btn-delete').style.display = 'none';
    abrirModal('modal-edit');
  };

  // ─── Save / Delete ────────────────────────────────────

  el('form-edit').addEventListener('submit', async (e) => {
    e.preventDefault();
    const featuresRaw = el('edit-features').value.trim();
    const body = {
      flat_id: Number(el('edit-flat').value),
      slug: el('edit-slug').value.trim(),
      name: el('edit-name').value.trim(),
      web_id: el('edit-web-id').value.trim() || null,
      price_monthly: parseFloat(el('edit-price').value),
      price_nightly: el('edit-nightly').value ? parseFloat(el('edit-nightly').value) : null,
      size_m2: el('edit-size').value ? parseFloat(el('edit-size').value) : null,
      bed_type: el('edit-bed').value || null,
      available: el('edit-available').value === '1',
      available_from: el('edit-from').value || null,
      note: el('edit-note').value || null,
      features: featuresRaw ? featuresRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
      name_i18n: readI18n(),
    };
    try {
      const id = el('edit-id').value;
      if (id) {
        await api(`/rooms/${id}`, { method: 'PUT', body });
        notify('Habitación actualizada');
      } else {
        await api('/rooms', { method: 'POST', body });
        notify('Habitación creada');
      }
      cerrarModal('modal-edit');
      await cargar();
    } catch (err) { notify(err.message, 'error'); }
  });

  window.eliminar = async function () {
    const id = el('edit-id').value;
    if (!id) return;
    if (!confirm('¿Eliminar esta habitación? Solo posible si no tiene contratos, ingresos o contactos asociados. Las fotos se borran en cascada.')) return;
    try {
      const res = await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error + (j.contracts ? ` (contratos: ${j.contracts})` : ''));
      notify('Habitación eliminada');
      cerrarModal('modal-edit');
      await cargar();
    } catch (err) { notify(err.message, 'error'); }
  };

  cargar();
})();

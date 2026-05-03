// Flats page — gestión de pisos con contenido multilingüe

(function () {
  initNav('flats');

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

  const state = { flats: [], rooms: [], reviews: [], editingId: null };

  // ─── Render list ──────────────────────────────────────

  async function cargar() {
    try {
      const [flats, rooms, reviews] = await Promise.all([
        api('/flats'), api('/rooms'), api('/reviews'),
      ]);
      state.flats = flats;
      state.rooms = rooms;
      state.reviews = reviews;
      render();
    } catch (err) {
      el('content').innerHTML = `<div class="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">${esc(err.message)}</div>`;
    }
  }

  function render() {
    if (!state.flats.length) {
      el('content').innerHTML = '<div class="text-slate-400">Sin pisos. Añade uno con el botón superior.</div>';
      return;
    }
    el('content').innerHTML = state.flats.map(f => {
      const rooms = state.rooms.filter(r => r.flat_id === f.id);
      const reviews = state.reviews.filter(r => r.flat_id === f.id);
      const nameI18n = parseJson(f.name_i18n, {});
      const amenities = parseJson(f.amenities, []);
      const coords = parseJson(f.coordinates, null);

      return `
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-4">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-800">${esc(f.name)}</h3>
              <p class="text-sm text-slate-400">${esc(f.address)}${f.has_tourist_license ? ' · <span class="text-amber-500">Licencia turística</span>' : ''}</p>
              <div class="flex flex-wrap gap-2 mt-2 text-xs">
                <span class="px-2 py-0.5 bg-slate-100 rounded text-slate-600">slug: ${esc(f.slug)}</span>
                ${f.web_slug ? `<span class="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">web: ${esc(f.web_slug)}</span>` : ''}
                ${f.web_id_prefix ? `<span class="px-2 py-0.5 bg-slate-100 rounded text-slate-600">prefix: ${esc(f.web_id_prefix)}</span>` : ''}
                ${f.whole_flat_price ? `<span class="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">Piso completo: ${eur(f.whole_flat_price)}/mes</span>` : ''}
              </div>
            </div>
            <button onclick="editar(${f.id})" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium ml-4">Editar</button>
          </div>
          <div class="grid sm:grid-cols-3 gap-3 text-xs text-slate-600 mt-3">
            <div><span class="font-medium">${rooms.length}</span> habitaciones</div>
            <div><span class="font-medium">${reviews.length}</span> reviews</div>
            <div>${coords ? `${coords.lat}, ${coords.lng}` : '<span class="text-slate-400">Sin coords</span>'}</div>
          </div>
          ${amenities.length ? `<div class="mt-3 text-xs text-slate-500"><span class="font-medium text-slate-600">Amenidades:</span> ${amenities.map(esc).join(' · ')}</div>` : ''}
          ${Object.keys(nameI18n).length ? `<div class="mt-2 text-xs text-slate-500"><span class="font-medium text-slate-600">Nombre web (es):</span> ${esc(nameI18n.es || '')}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  // ─── Edit modal ───────────────────────────────────────

  function buildI18nFields(containerId, prefix, isTextarea = false) {
    const container = el(containerId);
    container.innerHTML = LANGS.map(l => `
      <div>
        <label class="block text-xs font-medium text-slate-500 mb-1">${l.label} <span class="text-slate-400">(${l.code})</span></label>
        ${isTextarea
          ? `<textarea id="${prefix}-${l.code}" rows="3" class="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"></textarea>`
          : `<input type="text" id="${prefix}-${l.code}" class="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">`}
      </div>
    `).join('');
  }

  function readI18n(prefix) {
    const out = {};
    for (const l of LANGS) {
      const v = el(`${prefix}-${l.code}`).value.trim();
      if (v) out[l.code] = v;
    }
    return out;
  }

  function setI18n(prefix, obj) {
    for (const l of LANGS) {
      const input = el(`${prefix}-${l.code}`);
      if (input) input.value = (obj && obj[l.code]) || '';
    }
  }

  window.editar = async function (id) {
    const f = state.flats.find(x => x.id === id);
    if (!f) return;
    state.editingId = id;
    el('modal-title').textContent = `Editar piso: ${f.name}`;

    el('edit-id').value = f.id;
    el('edit-slug').value = f.slug || '';
    el('edit-web-slug').value = f.web_slug || '';
    el('edit-web-id-prefix').value = f.web_id_prefix || '';
    el('edit-name').value = f.name || '';
    el('edit-address').value = f.address || '';
    el('edit-tourist').checked = !!f.has_tourist_license;
    el('edit-whole-price').value = f.whole_flat_price ?? '';

    const coords = parseJson(f.coordinates, null);
    el('edit-lat').value = coords?.lat ?? '';
    el('edit-lng').value = coords?.lng ?? '';

    const amenities = parseJson(f.amenities, []);
    el('edit-amenities').value = amenities.join(', ');

    buildI18nFields('i18n-name', 'name');
    buildI18nFields('i18n-neighborhood', 'neighborhood');
    buildI18nFields('i18n-description', 'description', true);
    setI18n('name', parseJson(f.name_i18n, {}));
    setI18n('neighborhood', parseJson(f.neighborhood_i18n, {}));
    setI18n('description', parseJson(f.description_i18n, {}));

    el('reviews-section').style.display = '';
    renderReviews(state.reviews.filter(r => r.flat_id === id));

    abrirModal('modal-edit');
  };

  window.abrirNuevo = function () {
    state.editingId = null;
    el('modal-title').textContent = 'Nuevo piso';
    el('form-edit').reset();
    el('edit-id').value = '';
    buildI18nFields('i18n-name', 'name');
    buildI18nFields('i18n-neighborhood', 'neighborhood');
    buildI18nFields('i18n-description', 'description', true);
    el('reviews-section').style.display = 'none'; // reviews requieren flat_id, se editan tras crear
    abrirModal('modal-edit');
  };

  // ─── Reviews inline editor ────────────────────────────

  function renderReviews(reviews) {
    const list = el('reviews-list');
    list.innerHTML = reviews.length ? reviews.map(r => `
      <div class="border border-slate-200 rounded-lg p-3 bg-slate-50" data-review="${r.id}">
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm font-medium text-slate-700">${esc(r.reviewer_name)}</div>
          <button type="button" onclick="deleteReview(${r.id})" class="text-xs text-red-600 hover:text-red-800">Eliminar</button>
        </div>
        <div class="text-xs text-slate-500 line-clamp-2">${esc(parseJson(r.text_i18n, {}).es || '—')}</div>
        <button type="button" onclick="editReview(${r.id})" class="text-xs text-indigo-600 hover:text-indigo-800 mt-1">Editar texto multilingüe</button>
      </div>
    `).join('') : '<p class="text-xs text-slate-400 italic">Sin reviews</p>';
  }

  window.deleteReview = async function (id) {
    if (!confirm('¿Eliminar esta review?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      notify('Review eliminada');
      state.reviews = state.reviews.filter(r => r.id !== id);
      renderReviews(state.reviews.filter(r => r.flat_id === state.editingId));
    } catch (err) { notify(err.message, 'error'); }
  };

  window.addReview = async function () {
    const name = prompt('Nombre del cliente:');
    if (!name) return;
    const text = prompt('Texto en español (luego edita los demás idiomas):');
    if (!text) return;
    const text_i18n = LANGS.reduce((a, l) => { a[l.code] = text; return a; }, {});
    try {
      const r = await api('/reviews', {
        method: 'POST',
        body: { flat_id: state.editingId, reviewer_name: name, text_i18n },
      });
      state.reviews.push(r);
      renderReviews(state.reviews.filter(x => x.flat_id === state.editingId));
      notify('Review añadida — edítala para traducir');
    } catch (err) { notify(err.message, 'error'); }
  };

  window.editReview = async function (id) {
    const r = state.reviews.find(x => x.id === id);
    if (!r) return;
    const text = parseJson(r.text_i18n, {});
    const newName = prompt('Nombre:', r.reviewer_name);
    if (newName === null) return;
    const newEs = prompt('Texto (es):', text.es || '');
    if (newEs === null) return;
    text.es = newEs;
    try {
      const updated = await api(`/reviews/${id}`, {
        method: 'PUT',
        body: { reviewer_name: newName, text_i18n: text },
      });
      const idx = state.reviews.findIndex(x => x.id === id);
      state.reviews[idx] = updated;
      renderReviews(state.reviews.filter(x => x.flat_id === state.editingId));
      notify('Review actualizada');
    } catch (err) { notify(err.message, 'error'); }
  };

  // ─── Save ─────────────────────────────────────────────

  el('form-edit').addEventListener('submit', async (e) => {
    e.preventDefault();
    const lat = parseFloat(el('edit-lat').value);
    const lng = parseFloat(el('edit-lng').value);
    const wholePrice = el('edit-whole-price').value;
    const amenitiesRaw = el('edit-amenities').value.trim();

    const body = {
      slug: el('edit-slug').value.trim(),
      name: el('edit-name').value.trim(),
      address: el('edit-address').value.trim(),
      web_slug: el('edit-web-slug').value.trim() || null,
      web_id_prefix: el('edit-web-id-prefix').value.trim() || null,
      has_tourist_license: el('edit-tourist').checked,
      whole_flat_price: wholePrice ? parseFloat(wholePrice) : null,
      amenities: amenitiesRaw ? amenitiesRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
      name_i18n: readI18n('name'),
      neighborhood_i18n: readI18n('neighborhood'),
      description_i18n: readI18n('description'),
      coordinates: !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null,
    };

    try {
      const id = el('edit-id').value;
      if (id) {
        await api(`/flats/${id}`, { method: 'PUT', body });
        notify('Piso actualizado');
      } else {
        await api('/flats', { method: 'POST', body });
        notify('Piso creado');
      }
      cerrarModal('modal-edit');
      await cargar();
    } catch (err) {
      notify(err.message, 'error');
    }
  });

  cargar();
})();

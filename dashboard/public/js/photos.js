// Photos page — gestión de fotos por piso/habitación

(function () {
  initNav('photos');

  const state = {
    flats: [],
    rooms: [],
    photos: [],   // todas las fotos cargadas
    currentFlatId: null,
  };

  // ─── Load ─────────────────────────────────────────────────

  async function cargar() {
    try {
      const [flats, rooms] = await Promise.all([api('/flats'), api('/rooms')]);
      state.flats = flats;
      state.rooms = rooms;
      if (!state.currentFlatId && flats.length) state.currentFlatId = flats[0].id;
      await cargarFotos();
      renderizar();
    } catch (err) {
      el('content').innerHTML = `<div class="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">${esc(err.message)}</div>`;
    }
  }

  async function cargarFotos() {
    state.photos = await api(`/photos?flat_id=${state.currentFlatId}`);
  }

  // ─── Render ───────────────────────────────────────────────

  function renderizar() {
    const flat = state.flats.find(f => f.id === state.currentFlatId);
    if (!flat) {
      el('content').innerHTML = '<div class="text-slate-400">No hay pisos.</div>';
      return;
    }

    const rooms = state.rooms.filter(r => r.flat_id === flat.id);
    const photosCommon = state.photos.filter(p => !p.room_id).sort(byOrder);
    const photosByRoom = new Map();
    rooms.forEach(r => photosByRoom.set(r.id, state.photos.filter(p => p.room_id === r.id).sort(byOrder)));

    const tabs = state.flats.map(f => `
      <button data-flat="${f.id}" class="tab-flat px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${f.id === flat.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}">
        ${esc(f.name)}
      </button>
    `).join('');

    el('content').innerHTML = `
      <div class="mb-4 flex gap-2 overflow-x-auto pb-1">${tabs}</div>

      <!-- Dropzone -->
      <div id="dropzone" class="dropzone rounded-xl p-6 mb-6 text-center bg-white">
        <div class="flex flex-col items-center gap-2">
          ${ico(ICONS.upload)}
          <p class="text-slate-700 font-medium">Arrastra fotos aquí o haz clic para subir</p>
          <p class="text-xs text-slate-400">JPG, PNG, WEBP — máximo 10MB · destino: <strong>${esc(flat.name)}</strong></p>
          <div class="flex items-center gap-3 mt-2">
            <select id="upload-room" class="border border-slate-300 rounded-lg px-3 py-1.5 text-sm">
              <option value="">Zona común del piso</option>
              ${rooms.map(r => `<option value="${r.id}">${esc(r.name)}</option>`).join('')}
            </select>
            <input type="file" id="upload-input" multiple accept="image/*" class="hidden">
            <button type="button" id="btn-pick" class="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Elegir archivos</button>
          </div>
          <p id="upload-status" class="text-xs text-slate-500 mt-2 hidden"></p>
        </div>
      </div>

      <!-- Zona común -->
      <section class="mb-8">
        <h3 class="text-base font-semibold text-slate-800 mb-3 flex items-center justify-between">
          Zona común <span class="text-xs font-normal text-slate-400">${photosCommon.length} fotos</span>
        </h3>
        ${renderGrid(photosCommon, null)}
      </section>

      <!-- Por habitación -->
      ${rooms.map(r => {
        const fotos = photosByRoom.get(r.id) || [];
        return `
          <section class="mb-8">
            <h3 class="text-base font-semibold text-slate-800 mb-3 flex items-center justify-between">
              <span>${esc(r.name)} <span class="text-xs font-normal text-slate-400 ml-2">${esc(r.slug)}</span></span>
              <span class="text-xs font-normal text-slate-400">${fotos.length} fotos</span>
            </h3>
            ${renderGrid(fotos, r.id)}
          </section>
        `;
      }).join('')}
    `;

    bindEvents();
  }

  function renderGrid(photos, scopeRoomId) {
    if (!photos.length) {
      return `<p class="text-sm text-slate-400 italic">Sin fotos.</p>`;
    }
    return `
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" data-scope="${scopeRoomId ?? 'common'}">
        ${photos.map(p => `
          <div class="photo-card relative bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden group ${p.active ? '' : 'inactive'}"
               draggable="true" data-id="${p.id}">
            <img class="photo-thumb w-full" src="/images/${esc(p.filename)}" alt="${esc(p.description || p.filename)}" loading="lazy">
            ${p.is_cover ? `<span class="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded font-medium">Portada</span>` : ''}
            ${!p.active ? `<span class="absolute top-2 right-2 bg-slate-700 text-white text-xs px-2 py-0.5 rounded">Oculta</span>` : ''}
            <div class="p-2">
              <p class="text-xs text-slate-500 truncate">${esc(p.description || '—')}</p>
            </div>
            <button class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" data-edit="${p.id}" aria-label="Editar"></button>
          </div>
        `).join('')}
      </div>
    `;
  }

  function byOrder(a, b) {
    if (b.is_cover !== a.is_cover) return b.is_cover - a.is_cover;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  }

  // ─── Eventos ──────────────────────────────────────────────

  function bindEvents() {
    document.querySelectorAll('.tab-flat').forEach(btn => {
      btn.addEventListener('click', async () => {
        state.currentFlatId = Number(btn.dataset.flat);
        await cargarFotos();
        renderizar();
      });
    });

    // Click en card → modal edit
    document.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        editar(Number(btn.dataset.edit));
      });
    });

    // Upload
    const dz = el('dropzone');
    const input = el('upload-input');
    el('btn-pick').addEventListener('click', () => input.click());
    input.addEventListener('change', () => uploadFiles(Array.from(input.files)));

    ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => {
      e.preventDefault(); dz.classList.add('active');
    }));
    ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => {
      e.preventDefault();
      // Solo retiramos la clase si salimos del dropzone (no de un hijo)
      if (ev === 'dragleave' && dz.contains(e.relatedTarget)) return;
      dz.classList.remove('active');
    }));
    dz.addEventListener('drop', e => {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files.length) uploadFiles(files);
    });

    // Drag-and-drop reorder dentro de cada grid
    document.querySelectorAll('[data-scope]').forEach(grid => initDragReorder(grid));
  }

  // ─── Upload ───────────────────────────────────────────────

  async function uploadFiles(files) {
    if (!files.length) return;
    const status = el('upload-status');
    const roomId = el('upload-room').value;
    const fd = new FormData();
    fd.append('flat_id', String(state.currentFlatId));
    if (roomId) fd.append('room_id', roomId);
    files.forEach(f => fd.append('files', f));

    status.classList.remove('hidden');
    status.textContent = `Subiendo ${files.length} foto(s)...`;
    try {
      const res = await fetch(`/api/photos`, { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
      notify(`${json.data.length} foto(s) subidas`);
      el('upload-input').value = '';
      await cargarFotos();
      renderizar();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      status.classList.add('hidden');
    }
  }

  // ─── Edit modal ───────────────────────────────────────────

  function editar(id) {
    const p = state.photos.find(x => x.id === id);
    if (!p) return;
    const flat = state.flats.find(f => f.id === p.flat_id);
    const rooms = state.rooms.filter(r => r.flat_id === p.flat_id);

    el('edit-id').value = p.id;
    el('edit-thumb').src = `/images/${p.filename}`;
    el('edit-filename').textContent = p.filename;
    el('edit-description').value = p.description || '';
    el('edit-active').checked = !!p.active;
    el('edit-cover').checked = !!p.is_cover;

    const roomSel = el('edit-room');
    roomSel.innerHTML = `<option value="">Zona común de ${esc(flat.name)}</option>` +
      rooms.map(r => `<option value="${r.id}" ${r.id === p.room_id ? 'selected' : ''}>${esc(r.name)}</option>`).join('');

    abrirModal('modal-edit');
  }

  el('form-edit').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = el('edit-id').value;
    const roomVal = el('edit-room').value;
    const body = {
      description: el('edit-description').value || null,
      active: el('edit-active').checked,
      is_cover: el('edit-cover').checked,
      room_id: roomVal ? Number(roomVal) : null,
    };
    try {
      await api(`/photos/${id}`, { method: 'PUT', body });
      cerrarModal('modal-edit');
      notify('Foto actualizada');
      await cargarFotos();
      renderizar();
    } catch (err) {
      notify(err.message, 'error');
    }
  });

  window.eliminar = async function () {
    const id = el('edit-id').value;
    if (!confirm('¿Eliminar esta foto del piso? Se borrará el archivo del disco.')) return;
    try {
      const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
      cerrarModal('modal-edit');
      notify('Foto eliminada');
      await cargarFotos();
      renderizar();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  // ─── Drag & drop reorder ─────────────────────────────────

  function initDragReorder(grid) {
    let dragged = null;

    grid.querySelectorAll('.photo-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        dragged = card;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      card.addEventListener('dragend', () => {
        if (dragged) dragged.classList.remove('dragging');
        grid.querySelectorAll('.drop-target').forEach(c => c.classList.remove('drop-target'));
        dragged = null;
      });
      card.addEventListener('dragover', (e) => {
        if (!dragged || dragged === card) return;
        e.preventDefault();
        card.classList.add('drop-target');
      });
      card.addEventListener('dragleave', () => card.classList.remove('drop-target'));
      card.addEventListener('drop', async (e) => {
        e.preventDefault();
        card.classList.remove('drop-target');
        if (!dragged || dragged === card) return;

        const rect = card.getBoundingClientRect();
        const after = (e.clientX - rect.left) > rect.width / 2;
        if (after) card.after(dragged); else card.before(dragged);

        const ids = Array.from(grid.querySelectorAll('.photo-card')).map(c => Number(c.dataset.id));
        try {
          await api('/photos/reorder', { method: 'POST', body: { ids } });
          notify('Orden guardado');
          await cargarFotos();
        } catch (err) {
          notify(err.message, 'error');
        }
      });
    });
  }

  cargar();
})();

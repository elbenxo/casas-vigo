// Casas Vigo — Contracts page module
// All logic is encapsulated in the `Contracts` namespace to avoid globals.

const Contracts = (() => {

  // ─── State ────────────────────────────────────────────────────
  let _pisos    = [];
  let _rooms    = [];
  let _flatMap  = {};
  let _roomMap  = {};
  let _previewContractId = null;
  let _pendingSignId     = null;
  let _pendingTermId     = null;

  // ─── Status badge config ──────────────────────────────────────
  const STATUS_BADGE = {
    draft:      'bg-slate-100 text-slate-600',
    signed:     'bg-emerald-100 text-emerald-700',
    terminated: 'bg-red-100 text-red-600',
  };

  const STATUS_LABEL = {
    draft:      'Borrador',
    signed:     'Firmado',
    terminated: 'Terminado',
  };

  const LANG_LABEL = {
    es: 'ES', en: 'EN', gl: 'GL', fr: 'FR',
    de: 'DE', ko: 'KO', pt: 'PT', pl: 'PL',
  };

  // ─── Initialise ───────────────────────────────────────────────
  async function init() {
    try {
      [_pisos, _rooms] = await Promise.all([api('/flats'), api('/rooms')]);
      _flatMap = buildMap(_pisos);
      _roomMap = buildMap(_rooms);

      // Populate flat filter
      llenarPisos(el('f-flat'), _pisos, true);

      // Populate room select (grouped by flat, available only)
      _populateRoomSelect();

      // Populate prospect select
      await _populateProspectSelect();

      // Wire generate form
      el('form-generate').addEventListener('submit', _onGenerateSubmit);

      // Auto-fill deposit when rent changes
      el('gen-rent').addEventListener('input', () => {
        const depositEl = el('gen-deposit');
        if (!depositEl.value || depositEl.dataset.autoFilled === 'true') {
          depositEl.value = el('gen-rent').value;
          depositEl.dataset.autoFilled = 'true';
        }
      });
      el('gen-deposit').addEventListener('input', () => {
        el('gen-deposit').dataset.autoFilled = 'false';
      });

      // Auto-fill rent when room changes
      el('gen-room').addEventListener('change', () => {
        const roomId = parseInt(el('gen-room').value);
        const room   = _roomMap[roomId];
        if (room && room.price_monthly) {
          el('gen-rent').value = room.price_monthly;
          const depositEl = el('gen-deposit');
          if (!depositEl.value || depositEl.dataset.autoFilled !== 'false') {
            depositEl.value = room.price_monthly;
            depositEl.dataset.autoFilled = 'true';
          }
        }
      });

      await loadContracts();
    } catch (err) {
      notify('Error al inicializar: ' + err.message, 'error');
    }
  }

  // ─── Populate prospect dropdown ───────────────────────────────
  async function _populateProspectSelect() {
    const sel = el('gen-prospect');
    try {
      const prospects = await api('/prospects');
      const active = prospects.filter(p =>
        p.status !== 'signed' && p.status !== 'lost' && p.status !== 'closed'
      );
      sel.innerHTML = '<option value="">Seleccionar prospecto...</option>';
      active.forEach(p => {
        sel.innerHTML += `<option value="${p.id}">${p.name || p.phone}${p.status ? ' — ' + p.status : ''}</option>`;
      });
    } catch (err) {
      // Fallback: try contacts endpoint with role=prospect
      try {
        const contacts = await api('/contacts?role=prospect');
        sel.innerHTML = '<option value="">Seleccionar prospecto...</option>';
        contacts.forEach(c => {
          sel.innerHTML += `<option value="${c.id}">${c.name || c.phone}</option>`;
        });
      } catch (err2) {
        sel.innerHTML = '<option value="">Error cargando prospectos</option>';
      }
    }
  }

  // ─── Populate room select grouped by flat ─────────────────────
  function _populateRoomSelect() {
    llenarHabitacionesPorPiso(el('gen-room'), _pisos, _rooms, false);
  }

  // ─── Load + render contracts table ───────────────────────────
  async function loadContracts() {
    el('contracts-loading').classList.remove('hidden');
    el('contracts-empty').classList.add('hidden');
    el('contracts-table').innerHTML = '';

    const status  = el('f-status').value;
    const flatId  = el('f-flat').value;
    let q = [];
    if (status) q.push(`status=${status}`);
    if (flatId) q.push(`flat_id=${flatId}`);
    const qs = q.length ? '?' + q.join('&') : '';

    try {
      const contracts = await api(`/contracts${qs}`);
      el('contracts-loading').classList.add('hidden');
      el('contracts-count').textContent = `${contracts.length} contrato${contracts.length !== 1 ? 's' : ''}`;
      renderContractTable(contracts);
    } catch (err) {
      el('contracts-loading').classList.add('hidden');
      notify('Error cargando contratos: ' + err.message, 'error');
    }
  }

  // ─── Render table rows ────────────────────────────────────────
  function renderContractTable(contracts) {
    if (!contracts.length) {
      el('contracts-empty').classList.remove('hidden');
      return;
    }
    el('contracts-empty').classList.add('hidden');

    el('contracts-table').innerHTML = contracts.map(c => {
      const room = _roomMap[c.room_id];
      const flat = room ? _flatMap[room.flat_id] : (_flatMap[c.flat_id] || null);
      const statusCls = STATUS_BADGE[c.status] || 'bg-slate-100 text-slate-600';
      const statusLbl = STATUS_LABEL[c.status] || c.status;
      const lang      = LANG_LABEL[c.lang] || (c.lang || 'ES').toUpperCase();

      const actions = _buildRowActions(c);

      return `
        <tr class="table-row border-t border-slate-100">
          <td class="px-4 py-3 font-medium text-slate-800">${esc(c.prospect_name || c.tenant_name || '—')}</td>
          <td class="px-4 py-3 text-slate-600">${room ? esc(room.name) : '—'}</td>
          <td class="px-4 py-3 text-slate-500">${flat ? esc(flat.name) : '—'}</td>
          <td class="px-4 py-3">
            <span class="badge bg-slate-100 text-slate-600">${lang}</span>
          </td>
          <td class="px-4 py-3">
            <span class="badge ${statusCls}">${statusLbl}</span>
          </td>
          <td class="px-4 py-3 text-slate-400 text-xs">${fecha(c.created_at)}</td>
          <td class="px-4 py-3 text-slate-400 text-xs">${c.signed_at ? fecha(c.signed_at) : '—'}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">${actions}</div>
          </td>
        </tr>`;
    }).join('');
  }

  function _buildRowActions(c) {
    const btnBase = 'text-xs font-medium px-2.5 py-1 rounded-md transition-colors';
    let actions = '';

    // Always: view / preview
    actions += `<button onclick="Contracts.previewContract(${c.id})"
      class="${btnBase} bg-slate-100 text-slate-700 hover:bg-slate-200"
      title="Ver contrato">Ver</button>`;

    // Always: print
    actions += `<button onclick="Contracts.printContractById(${c.id})"
      class="${btnBase} bg-slate-100 text-slate-700 hover:bg-slate-200"
      title="Imprimir">Imprimir</button>`;

    // Draft only: sign
    if (c.status === 'draft') {
      actions += `<button onclick="Contracts.signContract(${c.id}, '${esc(c.prospect_name || '')}', '${esc(c.room_name || '')}' )"
        class="${btnBase} bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
        title="Firmar contrato">Firmar</button>`;
    }

    // Signed only: terminate
    if (c.status === 'signed') {
      actions += `<button onclick="Contracts.terminateContract(${c.id}, '${esc(c.tenant_name || c.prospect_name || '')}' )"
        class="${btnBase} bg-red-100 text-red-600 hover:bg-red-200"
        title="Terminar contrato">Terminar</button>`;
    }

    return actions;
  }

  // ─── Open generate form ───────────────────────────────────────
  function openGenerateForm() {
    el('form-generate').reset();
    el('gen-deposit').dataset.autoFilled = 'true';
    _populateProspectSelect();
    abrirModal('modal-generate');
  }

  // ─── Submit generate form ─────────────────────────────────────
  async function _onGenerateSubmit(e) {
    e.preventDefault();
    const btn = el('btn-generate');
    btn.disabled = true;
    btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Generando...`;

    try {
      const body = {
        prospect_id:        parseInt(el('gen-prospect').value),
        room_id:            parseInt(el('gen-room').value),
        lang:               el('gen-lang').value,
        start_date:         el('gen-start').value,
        end_date:           el('gen-end').value,
        monthly_rent:       parseFloat(el('gen-rent').value),
        deposit:            parseFloat(el('gen-deposit').value) || parseFloat(el('gen-rent').value),
        utilities_provision: el('gen-utilities')?.value || '25',
        sign_date:          el('gen-sign-date')?.value || null,
      };

      const contract = await generateContract(body);
      cerrarModal('modal-generate');
      notify('Contrato generado correctamente');
      await loadContracts();

      // Auto-open preview
      if (contract && contract.id) {
        await previewContract(contract.id);
      }
    } catch (err) {
      notify('Error generando contrato: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> Generar contrato`;
    }
  }

  // ─── API calls ────────────────────────────────────────────────
  async function generateContract(data) {
    return api('/contracts/generate', { method: 'POST', body: data });
  }

  async function previewContract(id) {
    _previewContractId = id;
    const iframe = el('preview-iframe');
    iframe.srcdoc = '<p style="text-align:center;padding:40px;color:#999;">Cargando contrato...</p>';
    abrirModal('modal-preview');
    try {
      const res = await fetch(`${API}/contracts/${id}/download`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      iframe.srcdoc = await res.text();
    } catch (err) {
      iframe.srcdoc = `<p style="text-align:center;padding:40px;color:red;">${esc(err.message)}</p>`;
    }
  }

  function printContract() {
    const iframe = el('preview-iframe');
    if (iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  }

  async function printContractById(id) {
    _previewContractId = id;
    abrirModal('modal-preview');
    const iframe = el('preview-iframe');
    iframe.srcdoc = '<p style="text-align:center;padding:40px;color:#999;">Cargando...</p>';
    try {
      const res = await fetch(`${API}/contracts/${id}/download`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const html = await res.text();
      iframe.srcdoc = html;
      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        iframe.onload = null;
      };
    } catch (err) {
      notify('Error cargando contrato: ' + err.message, 'error');
    }
  }

  function signContract(id, prospectName, roomName) {
    _pendingSignId = id;
    el('sign-msg').textContent =
      `Convertiras a "${prospectName || 'este prospecto'}" en inquilino y asignaras la habitacion "${roomName || id}". ¿Continuar?`;
    el('btn-sign-confirm').onclick = _confirmSign;
    abrirModal('modal-sign');
  }

  async function _confirmSign() {
    const id = _pendingSignId;
    if (!id) return;
    el('btn-sign-confirm').disabled = true;
    try {
      await api(`/contracts/${id}/sign`, { method: 'PUT' });
      cerrarModal('modal-sign');
      notify('Contrato firmado. Inquilino creado y habitacion asignada.');
      await loadContracts();
    } catch (err) {
      notify('Error al firmar: ' + err.message, 'error');
    } finally {
      el('btn-sign-confirm').disabled = false;
      _pendingSignId = null;
    }
  }

  function terminateContract(id, tenantName) {
    _pendingTermId = id;
    el('terminate-msg').textContent =
      `Terminar el contrato de "${tenantName || 'este inquilino'}". Esta accion no se puede deshacer.`;
    el('btn-terminate-confirm').onclick = _confirmTerminate;
    abrirModal('modal-terminate');
  }

  async function _confirmTerminate() {
    const id = _pendingTermId;
    if (!id) return;
    el('btn-terminate-confirm').disabled = true;
    try {
      await api(`/contracts/${id}/status`, { method: 'PUT', body: { status: 'terminated' } });
      cerrarModal('modal-terminate');
      notify('Contrato terminado.');
      await loadContracts();
    } catch (err) {
      notify('Error al terminar contrato: ' + err.message, 'error');
    } finally {
      el('btn-terminate-confirm').disabled = false;
      _pendingTermId = null;
    }
  }

  // ─── Public API ───────────────────────────────────────────────
  return {
    init,
    loadContracts,
    renderContractTable,
    openGenerateForm,
    generateContract,
    previewContract,
    printContract,
    printContractById,
    signContract,
    terminateContract,
  };

})();

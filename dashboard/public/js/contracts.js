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
  let _pendingUnsignId   = null;
  let _pendingTermId     = null;
  let _tplPlaceholders   = null;   // cached placeholder reference list
  let _tplEdited         = false;  // current lang has a DB override?

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

      // If we arrived from a prospect already linked to a room (Prospects → "Generar contrato"),
      // open the form pre-filled instead of asking for the same data again.
      const params = new URLSearchParams(window.location.search);
      const prospectId = params.get('prospect_id');
      const roomId = params.get('room_id');
      if (prospectId || roomId) {
        await openGenerateForm(
          prospectId ? parseInt(prospectId) : null,
          roomId ? parseInt(roomId) : null
        );
        window.history.replaceState({}, '', window.location.pathname);
      }
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

    // Signed only: undo signature (fix a mistaken click) or terminate
    if (c.status === 'signed') {
      actions += `<button onclick="Contracts.unsignContract(${c.id}, '${esc(c.tenant_name || c.prospect_name || '')}' )"
        class="${btnBase} bg-amber-100 text-amber-700 hover:bg-amber-200"
        title="Deshacer firma (por error)">Deshacer firma</button>`;
      actions += `<button onclick="Contracts.terminateContract(${c.id}, '${esc(c.tenant_name || c.prospect_name || '')}' )"
        class="${btnBase} bg-red-100 text-red-600 hover:bg-red-200"
        title="Terminar contrato">Terminar</button>`;
    }

    return actions;
  }

  // ─── Open generate form ───────────────────────────────────────
  // prospectId/roomId let callers (e.g. a prospect already linked to a room)
  // pre-fill the form instead of asking the user to pick them again.
  async function openGenerateForm(prospectId, roomId) {
    el('form-generate').reset();
    el('gen-deposit').dataset.autoFilled = 'true';
    await _populateProspectSelect();
    abrirModal('modal-generate');

    if (prospectId) el('gen-prospect').value = prospectId;
    if (roomId) {
      el('gen-room').value = roomId;
      el('gen-room').dispatchEvent(new Event('change'));
    }
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
        id_type:            el('gen-id-type')?.value || 'DNI',
        owner_role:         el('gen-owner-role')?.value || 'propietario',
        tenant_nationality: el('gen-nationality')?.value.trim() || null,
        emergency_contact:  el('gen-emergency')?.value.trim() || null,
        family_residence:   el('gen-family-residence')?.value.trim() || null,
        extra_charge_note:  el('gen-extra-charge')?.value.trim() || null,
        inventory:          el('gen-inventory')?.value.trim() || null,
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

  function unsignContract(id, tenantName) {
    _pendingUnsignId = id;
    el('unsign-msg').textContent =
      `Deshara la firma de "${tenantName || 'este contrato'}". El contrato volvera a borrador, el prospecto a "pendiente de firma" y la habitacion quedara disponible de nuevo.`;
    el('btn-unsign-confirm').onclick = _confirmUnsign;
    abrirModal('modal-unsign');
  }

  async function _confirmUnsign() {
    const id = _pendingUnsignId;
    if (!id) return;
    el('btn-unsign-confirm').disabled = true;
    try {
      const result = await api(`/contracts/${id}/unsign`, { method: 'PUT' });
      cerrarModal('modal-unsign');
      if (result.contact_flagged) {
        notify('Firma deshecha. Revisa el contacto en Contactos: no se elimino automaticamente.', 'info');
      } else {
        notify('Firma deshecha. El contrato vuelve a pendiente de firma.');
      }
      await loadContracts();
    } catch (err) {
      notify('Error al deshacer la firma: ' + err.message, 'error');
    } finally {
      el('btn-unsign-confirm').disabled = false;
      _pendingUnsignId = null;
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

  // ─── Template editor ──────────────────────────────────────────
  async function openTemplateEditor() {
    abrirModal('modal-template');
    if (!_tplPlaceholders) {
      try {
        _tplPlaceholders = await api('/contracts/placeholders');
      } catch (err) {
        _tplPlaceholders = [];
      }
      _renderPlaceholders();
    }
    await loadTemplateInto();
  }

  function _renderPlaceholders() {
    const box = el('tpl-placeholders');
    if (!box) return;
    box.innerHTML = (_tplPlaceholders || []).map(p => `
      <button type="button" onclick="Contracts.insertPlaceholder('${p.key}')"
        class="block w-full text-left px-2 py-1 rounded hover:bg-slate-200 transition-colors"
        title="Insertar">
        <code class="text-indigo-600">{{${p.key}}}</code>
        <span class="text-slate-400 block text-[11px] leading-tight">${esc(p.label)}</span>
      </button>`).join('');
  }

  function insertPlaceholder(key) {
    const ta = el('tpl-html');
    const token = `{{${key}}}`;
    const start = ta.selectionStart ?? ta.value.length;
    const end   = ta.selectionEnd ?? ta.value.length;
    ta.value = ta.value.slice(0, start) + token + ta.value.slice(end);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = start + token.length;
  }

  async function loadTemplateInto() {
    const lang = el('tpl-lang').value;
    const ta = el('tpl-html');
    ta.value = 'Cargando plantilla...';
    ta.disabled = true;
    try {
      const data = await api(`/contracts/templates/${lang}`);
      ta.value = data.html || '';
      _tplEdited = !!data.edited;
      _updateTplStatus(lang, data);
    } catch (err) {
      ta.value = '';
      notify('Error cargando plantilla: ' + err.message, 'error');
    } finally {
      ta.disabled = false;
    }
  }

  function _updateTplStatus(lang, data) {
    const s = el('tpl-status');
    if (!s) return;
    if (data.edited) {
      s.innerHTML = `<span class="text-amber-600">Editada</span> · guardada en la base de datos${data.updated_at ? ' · ' + fecha(data.updated_at) : ''}`;
    } else {
      s.innerHTML = `<span class="text-slate-500">Original</span> · plantilla por defecto del repositorio`;
    }
    const restoreBtn = el('btn-tpl-restore');
    if (restoreBtn) restoreBtn.classList.toggle('hidden', !data.edited);
  }

  async function saveTemplate() {
    const lang = el('tpl-lang').value;
    const html = el('tpl-html').value;
    if (!html || !html.trim()) {
      notify('La plantilla no puede estar vacía', 'error');
      return;
    }
    const btn = el('btn-tpl-save');
    btn.disabled = true;
    try {
      await api(`/contracts/templates/${lang}`, { method: 'PUT', body: { html } });
      notify('Plantilla guardada. Se usará en los próximos contratos.');
      await loadTemplateInto();
    } catch (err) {
      notify('Error guardando plantilla: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
    }
  }

  async function restoreTemplate() {
    const lang = el('tpl-lang').value;
    if (!confirm('¿Restaurar la plantilla original? Se perderán los cambios guardados para este idioma.')) return;
    try {
      await api(`/contracts/templates/${lang}`, { method: 'DELETE' });
      notify('Plantilla restaurada al original.');
      await loadTemplateInto();
    } catch (err) {
      notify('Error restaurando plantilla: ' + err.message, 'error');
    }
  }

  function previewTemplateDraft() {
    const html = el('tpl-html').value;
    const iframe = el('preview-iframe');
    iframe.srcdoc = html;
    abrirModal('modal-preview');
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
    unsignContract,
    terminateContract,
    openTemplateEditor,
    loadTemplateInto,
    insertPlaceholder,
    saveTemplate,
    restoreTemplate,
    previewTemplateDraft,
  };

})();

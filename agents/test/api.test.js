'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, request, multipart, TINY_PNG } = require('./setup');

let baseUrl;
let close;

// IDs captured across tests
let flatId;
let roomId;
let contactId;
let incomeId;
let costId;
let receiptId;
let messageId;
let appointmentId;

before(async () => {
  const srv = await startServer();
  baseUrl = srv.baseUrl;
  close = srv.close;
});

after(async () => {
  await close();
});

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------
describe('Health', () => {
  it('GET /health → 200, status ok, db connected', async () => {
    const { status, body } = await request(baseUrl, '/health');
    assert.equal(status, 200);
    assert.equal(body.status, 'ok');
    assert.equal(body.db, 'connected');
  });
});

// ---------------------------------------------------------------------------
// Flats CRUD
// ---------------------------------------------------------------------------
describe('Flats CRUD', () => {
  it('GET /api/flats → 200, empty array initially', async () => {
    const { status, body } = await request(baseUrl, '/api/flats');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.data));
    assert.equal(body.data.length, 0);
  });

  it('POST /api/flats → 201, creates flat', async () => {
    const { status, body } = await request(baseUrl, '/api/flats', {
      method: 'POST',
      body: {
        slug: 'alfonso-xiii-9',
        name: 'Alfonso XIII 9',
        address: 'Rúa Alfonso XIII 9, Vigo',
        neighborhood: 'Centro',
        amenities: ['wifi', 'washing_machine'],
        has_tourist_license: false,
      },
    });
    assert.equal(status, 201);
    assert.ok(body.data);
    assert.equal(body.data.slug, 'alfonso-xiii-9');
    assert.equal(body.data.name, 'Alfonso XIII 9');
    assert.equal(body.data.address, 'Rúa Alfonso XIII 9, Vigo');
    assert.ok(body.data.id);
    flatId = body.data.id;
  });

  it('POST /api/flats missing required fields → 400', async () => {
    const { status } = await request(baseUrl, '/api/flats', {
      method: 'POST',
      body: { name: 'No Slug Flat' },
    });
    assert.equal(status, 400);
  });

  it('GET /api/flats/:id → 200, returns flat', async () => {
    const { status, body } = await request(baseUrl, `/api/flats/${flatId}`);
    assert.equal(status, 200);
    assert.equal(body.data.id, flatId);
    assert.equal(body.data.slug, 'alfonso-xiii-9');
  });

  it('GET /api/flats/999 → 404', async () => {
    const { status } = await request(baseUrl, '/api/flats/999');
    assert.equal(status, 404);
  });

  it('GET /api/flats/:id/rooms → 200, empty initially', async () => {
    const { status, body } = await request(baseUrl, `/api/flats/${flatId}/rooms`);
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.data));
    assert.equal(body.data.length, 0);
  });

  it('PUT /api/flats/:id → 200, updates fields', async () => {
    const { status, body } = await request(baseUrl, `/api/flats/${flatId}`, {
      method: 'PUT',
      body: { name: 'Alfonso XIII 9 (Updated)', has_tourist_license: true },
    });
    assert.equal(status, 200);
    assert.equal(body.data.name, 'Alfonso XIII 9 (Updated)');
    assert.equal(body.data.has_tourist_license, 1);
  });

  it('PUT /api/flats/:id with i18n + coordinates + whole_flat_price → 200, persists JSON', async () => {
    const { status, body } = await request(baseUrl, `/api/flats/${flatId}`, {
      method: 'PUT',
      body: {
        web_slug: 'test-slug',
        web_id_prefix: 'tx',
        name_i18n: { es: 'Piso Test', en: 'Test Flat', gl: 'Piso Test', fr: 'Test', de: 'Test', ko: 'Test', pt: 'Test', pl: 'Test' },
        neighborhood_i18n: { es: 'Centro', en: 'Center', gl: 'Centro', fr: 'Centre', de: 'Mitte', ko: '중심', pt: 'Centro', pl: 'Centrum' },
        description_i18n: { es: 'desc', en: 'desc', gl: 'desc', fr: 'desc', de: 'desc', ko: 'desc', pt: 'desc', pl: 'desc' },
        coordinates: { lat: 42.23, lng: -8.71 },
        whole_flat_price: 1200,
      },
    });
    assert.equal(status, 200);
    assert.equal(body.data.web_slug, 'test-slug');
    const name = JSON.parse(body.data.name_i18n);
    assert.equal(name.en, 'Test Flat');
    const coords = JSON.parse(body.data.coordinates);
    assert.equal(coords.lat, 42.23);
    assert.equal(body.data.whole_flat_price, 1200);
  });
});

// ---------------------------------------------------------------------------
// Rooms CRUD
// ---------------------------------------------------------------------------
describe('Rooms CRUD', () => {
  it('POST /api/rooms → 201, creates room linked to flat', async () => {
    const { status, body } = await request(baseUrl, '/api/rooms', {
      method: 'POST',
      body: {
        flat_id: flatId,
        slug: 'hab-1',
        name: 'Habitación 1',
        price_monthly: 350,
        price_nightly: 25,
        size_m2: 12,
        bed_type: 'individual',
        features: ['exterior', 'armario'],
        available: true,
      },
    });
    assert.equal(status, 201);
    assert.ok(body.data);
    assert.equal(body.data.flat_id, flatId);
    assert.equal(body.data.slug, 'hab-1');
    assert.equal(body.data.price_monthly, 350);
    assert.equal(body.data.available, 1);
    roomId = body.data.id;
  });

  it('POST /api/rooms missing fields → 400', async () => {
    const { status } = await request(baseUrl, '/api/rooms', {
      method: 'POST',
      body: { flat_id: flatId, name: 'Incomplete' },
    });
    assert.equal(status, 400);
  });

  it('GET /api/rooms → 200, lists all rooms', async () => {
    const { status, body } = await request(baseUrl, '/api/rooms');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 1);
  });

  it('GET /api/rooms?flat_id=X → filters by flat', async () => {
    const { status, body } = await request(baseUrl, `/api/rooms?flat_id=${flatId}`);
    assert.equal(status, 200);
    assert.ok(body.data.every((r) => r.flat_id === flatId));
  });

  it('GET /api/rooms?available=1 → filters available', async () => {
    const { status, body } = await request(baseUrl, '/api/rooms?available=1');
    assert.equal(status, 200);
    assert.ok(body.data.every((r) => r.available === 1));
  });

  it('GET /api/rooms/:id → 200, includes flat_name and flat_address', async () => {
    const { status, body } = await request(baseUrl, `/api/rooms/${roomId}`);
    assert.equal(status, 200);
    assert.equal(body.data.id, roomId);
    assert.ok(body.data.flat_name);
    assert.ok(body.data.flat_address);
  });

  it('PUT /api/rooms/:id → 200, updates price, sets updated_at', async () => {
    const { status, body } = await request(baseUrl, `/api/rooms/${roomId}`, {
      method: 'PUT',
      body: { price_monthly: 375 },
    });
    assert.equal(status, 200);
    assert.equal(body.data.price_monthly, 375);
    assert.ok(body.data.updated_at);
  });

  it('GET /api/flats/:id/rooms → now returns the created room', async () => {
    const { status, body } = await request(baseUrl, `/api/flats/${flatId}/rooms`);
    assert.equal(status, 200);
    assert.ok(body.data.length >= 1);
    assert.ok(body.data.some((r) => r.id === roomId));
  });

  it('DELETE /api/rooms/:id with active income/contracts → 409', async () => {
    // Create an income record on this room to block deletion
    await request(baseUrl, '/api/income', {
      method: 'POST',
      body: { room_id: roomId, amount: 350, month: 4, year: 2026 },
    });
    const { status, body } = await request(baseUrl, `/api/rooms/${roomId}`, { method: 'DELETE' });
    assert.equal(status, 409);
    assert.ok(body.error.includes('Cannot delete'));
  });

  it('DELETE /api/rooms/:id without references → 200', async () => {
    // Create a fresh disposable room
    const { body: created } = await request(baseUrl, '/api/rooms', {
      method: 'POST',
      body: { flat_id: flatId, slug: 'hab-disposable', name: 'Disposable', price_monthly: 100 },
    });
    const id = created.data.id;
    const { status } = await request(baseUrl, `/api/rooms/${id}`, { method: 'DELETE' });
    assert.equal(status, 200);
    const { status: get } = await request(baseUrl, `/api/rooms/${id}`);
    assert.equal(get, 404);
  });

  it('PUT /api/rooms/:id with web_id + name_i18n → 200, persists JSON', async () => {
    const { status, body } = await request(baseUrl, `/api/rooms/${roomId}`, {
      method: 'PUT',
      body: {
        web_id: 'tx-hab-1',
        name_i18n: { es: 'Habitación 1', en: 'Room 1', gl: 'H1', fr: 'C1', de: 'Z1', ko: '1', pt: 'Q1', pl: 'P1' },
      },
    });
    assert.equal(status, 200);
    assert.equal(body.data.web_id, 'tx-hab-1');
    const name = JSON.parse(body.data.name_i18n);
    assert.equal(name.en, 'Room 1');
  });
});

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
describe('Reviews', () => {
  let reviewId;
  const sampleI18n = { es: 'Genial', en: 'Great', gl: 'Xenial', fr: 'Génial', de: 'Toll', ko: '좋아요', pt: 'Ótimo', pl: 'Świetne' };

  it('POST /api/reviews → 201', async () => {
    const { status, body } = await request(baseUrl, '/api/reviews', {
      method: 'POST',
      body: { flat_id: flatId, reviewer_name: 'Test Reviewer', text_i18n: sampleI18n },
    });
    assert.equal(status, 201);
    assert.equal(body.data.flat_id, flatId);
    assert.equal(body.data.reviewer_name, 'Test Reviewer');
    reviewId = body.data.id;
  });

  it('POST /api/reviews missing fields → 400', async () => {
    const { status } = await request(baseUrl, '/api/reviews', {
      method: 'POST', body: { reviewer_name: 'X' },
    });
    assert.equal(status, 400);
  });

  it('POST /api/reviews with empty text_i18n → 400', async () => {
    const { status } = await request(baseUrl, '/api/reviews', {
      method: 'POST',
      body: { flat_id: flatId, reviewer_name: 'X', text_i18n: { es: '', en: '' } },
    });
    assert.equal(status, 400);
  });

  it('GET /api/reviews?flat_id= → 200, filters', async () => {
    const { status, body } = await request(baseUrl, `/api/reviews?flat_id=${flatId}`);
    assert.equal(status, 200);
    body.data.forEach(r => assert.equal(r.flat_id, flatId));
  });

  it('PUT /api/reviews/:id → 200, updates name + text_i18n', async () => {
    const { status, body } = await request(baseUrl, `/api/reviews/${reviewId}`, {
      method: 'PUT', body: { reviewer_name: 'Updated', text_i18n: { ...sampleI18n, es: 'Excelente' } },
    });
    assert.equal(status, 200);
    assert.equal(body.data.reviewer_name, 'Updated');
    assert.equal(JSON.parse(body.data.text_i18n).es, 'Excelente');
  });

  it('DELETE /api/reviews/:id → 200', async () => {
    const { status } = await request(baseUrl, `/api/reviews/${reviewId}`, { method: 'DELETE' });
    assert.equal(status, 200);
    const { status: get } = await request(baseUrl, `/api/reviews/${reviewId}`);
    assert.equal(get, 404);
  });
});

// ---------------------------------------------------------------------------
// Contacts CRUD
// ---------------------------------------------------------------------------
describe('Contacts CRUD', () => {
  it('POST /api/contacts → 201, creates with phone', async () => {
    const { status, body } = await request(baseUrl, '/api/contacts', {
      method: 'POST',
      body: {
        phone: '+34600111222',
        name: 'Ana García',
        role: 'prospect',
        language: 'es',
      },
    });
    assert.equal(status, 201);
    assert.ok(body.data);
    assert.equal(body.data.phone, '+34600111222');
    assert.equal(body.data.role, 'prospect');
    contactId = body.data.id;
  });

  it('POST /api/contacts missing phone → 400', async () => {
    const { status } = await request(baseUrl, '/api/contacts', {
      method: 'POST',
      body: { name: 'No Phone' },
    });
    assert.equal(status, 400);
  });

  it('POST /api/contacts duplicate phone → 409', async () => {
    const { status } = await request(baseUrl, '/api/contacts', {
      method: 'POST',
      body: { phone: '+34600111222', name: 'Duplicate' },
    });
    assert.equal(status, 409);
  });

  it('GET /api/contacts → 200, lists all', async () => {
    const { status, body } = await request(baseUrl, '/api/contacts');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 1);
  });

  it('GET /api/contacts?role=prospect → filters', async () => {
    const { status, body } = await request(baseUrl, '/api/contacts?role=prospect');
    assert.equal(status, 200);
    assert.ok(body.data.every((c) => c.role === 'prospect'));
  });

  it('GET /api/contacts/by-phone/:phone → 200', async () => {
    const { status, body } = await request(baseUrl, '/api/contacts/by-phone/+34600111222');
    assert.equal(status, 200);
    assert.equal(body.data.phone, '+34600111222');
  });

  it('GET /api/contacts/by-phone/unknown → 404', async () => {
    const { status } = await request(baseUrl, '/api/contacts/by-phone/+00000000000');
    assert.equal(status, 404);
  });

  it('PUT /api/contacts/:id → 200, updates role', async () => {
    const { status, body } = await request(baseUrl, `/api/contacts/${contactId}`, {
      method: 'PUT',
      body: { role: 'tenant' },
    });
    assert.equal(status, 200);
    assert.equal(body.data.role, 'tenant');
  });
});

// ---------------------------------------------------------------------------
// Income
// ---------------------------------------------------------------------------
describe('Income', () => {
  it('POST /api/income → 201', async () => {
    const { status, body } = await request(baseUrl, '/api/income', {
      method: 'POST',
      body: {
        contact_id: contactId,
        room_id: roomId,
        amount: 375,
        month: 4,
        year: 2026,
        payment_method: 'transferencia',
        confirmed: true,
      },
    });
    assert.equal(status, 201);
    assert.ok(body.data);
    assert.equal(body.data.amount, 375);
    assert.equal(body.data.month, 4);
    assert.equal(body.data.year, 2026);
    incomeId = body.data.id;
  });

  it('POST /api/income missing fields → 400', async () => {
    const { status } = await request(baseUrl, '/api/income', {
      method: 'POST',
      body: { room_id: roomId, amount: 300 },
    });
    assert.equal(status, 400);
  });

  it('GET /api/income → 200, lists records', async () => {
    const { status, body } = await request(baseUrl, '/api/income');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 1);
  });

  it('GET /api/income?month=4&year=2026 → filters', async () => {
    const { status, body } = await request(baseUrl, '/api/income?month=4&year=2026');
    assert.equal(status, 200);
    assert.ok(body.data.every((r) => r.month === 4 && r.year === 2026));
    assert.ok(body.data.some((r) => r.id === incomeId));
  });
});

// ---------------------------------------------------------------------------
// Costs
// ---------------------------------------------------------------------------
describe('Costs', () => {
  it('POST /api/costs → 201', async () => {
    const { status, body } = await request(baseUrl, '/api/costs', {
      method: 'POST',
      body: {
        flat_id: flatId,
        type: 'agua',
        description: 'Factura agua abril',
        amount: 45.5,
        month: 4,
        year: 2026,
      },
    });
    assert.equal(status, 201);
    assert.ok(body.data);
    assert.equal(body.data.type, 'agua');
    assert.equal(body.data.amount, 45.5);
    costId = body.data.id;
  });

  it('GET /api/costs → 200', async () => {
    const { status, body } = await request(baseUrl, '/api/costs');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 1);
  });

  it('GET /api/costs?type=agua → filters', async () => {
    const { status, body } = await request(baseUrl, '/api/costs?type=agua');
    assert.equal(status, 200);
    assert.ok(body.data.every((r) => r.type === 'agua'));
    assert.ok(body.data.some((r) => r.id === costId));
  });
});

// ---------------------------------------------------------------------------
// Receipts
// ---------------------------------------------------------------------------
describe('Receipts', () => {
  it('POST /api/receipts → 201', async () => {
    const { status, body } = await request(baseUrl, '/api/receipts', {
      method: 'POST',
      body: {
        contact_id: contactId,
        month: 4,
        year: 2026,
        rent_amount: 375,
        utilities_amount: 30,
        total: 405,
      },
    });
    assert.equal(status, 201);
    assert.ok(body.data);
    assert.equal(body.data.total, 405);
    receiptId = body.data.id;
  });

  it('GET /api/receipts → 200', async () => {
    const { status, body } = await request(baseUrl, '/api/receipts');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.some((r) => r.id === receiptId));
  });
});

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
describe('Messages', () => {
  it('POST /api/messages → 201', async () => {
    const { status, body } = await request(baseUrl, '/api/messages', {
      method: 'POST',
      body: {
        contact_id: contactId,
        channel: 'whatsapp',
        direction: 'in',
        content: 'Hola, tenéis habitaciones disponibles?',
      },
    });
    assert.equal(status, 201);
    assert.ok(body.data);
    assert.equal(body.data.direction, 'in');
    messageId = body.data.id;
  });

  it('GET /api/messages/:contactId → 200, returns messages in order', async () => {
    // Add a second message to verify ordering
    await request(baseUrl, '/api/messages', {
      method: 'POST',
      body: {
        contact_id: contactId,
        channel: 'whatsapp',
        direction: 'out',
        content: 'Sí, tenemos disponibilidad.',
      },
    });

    const { status, body } = await request(baseUrl, `/api/messages/${contactId}`);
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 2);
    // Verify ascending timestamp order
    for (let i = 1; i < body.data.length; i++) {
      assert.ok(body.data[i].timestamp >= body.data[i - 1].timestamp);
    }
    assert.ok(body.data.some((m) => m.id === messageId));
  });
});

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------
describe('Appointments', () => {
  it('POST /api/appointments → 201', async () => {
    const { status, body } = await request(baseUrl, '/api/appointments', {
      method: 'POST',
      body: {
        contact_id: contactId,
        flat_id: flatId,
        datetime: '2026-04-20T11:00:00',
        duration_min: 30,
        status: 'scheduled',
        notes: 'Primera visita',
      },
    });
    assert.equal(status, 201);
    assert.ok(body.data);
    assert.equal(body.data.flat_id, flatId);
    assert.equal(body.data.status, 'scheduled');
    appointmentId = body.data.id;
  });

  it('GET /api/appointments → 200', async () => {
    const { status, body } = await request(baseUrl, '/api/appointments');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.some((a) => a.id === appointmentId));
  });

  it('PUT /api/appointments/:id → 200, updates status', async () => {
    const { status, body } = await request(baseUrl, `/api/appointments/${appointmentId}`, {
      method: 'PUT',
      body: { status: 'cancelled' },
    });
    assert.equal(status, 200);
    assert.equal(body.data.status, 'cancelled');
  });

  it('GET /api/appointments?status=cancelled → filters', async () => {
    const { status, body } = await request(baseUrl, '/api/appointments?status=cancelled');
    assert.equal(status, 200);
    assert.ok(body.data.every((a) => a.status === 'cancelled'));
    assert.ok(body.data.some((a) => a.id === appointmentId));
  });
});

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
describe('Config', () => {
  it('GET /api/config → 200, empty initially', async () => {
    const { status, body } = await request(baseUrl, '/api/config');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.data));
    assert.equal(body.data.length, 0);
  });

  it('PUT /api/config/test_key → 200, creates via upsert', async () => {
    const { status, body } = await request(baseUrl, '/api/config/test_key', {
      method: 'PUT',
      body: { value: 'hello' },
    });
    assert.equal(status, 200);
    assert.equal(body.data.key, 'test_key');
    assert.equal(body.data.value, 'hello');
  });

  it('GET /api/config/test_key → 200, returns the value', async () => {
    const { status, body } = await request(baseUrl, '/api/config/test_key');
    assert.equal(status, 200);
    assert.equal(body.data.key, 'test_key');
    assert.equal(body.data.value, 'hello');
  });

  it('PUT /api/config/test_key → 200, updates existing', async () => {
    const { status, body } = await request(baseUrl, '/api/config/test_key', {
      method: 'PUT',
      body: { value: 'updated' },
    });
    assert.equal(status, 200);
    assert.equal(body.data.value, 'updated');
  });

  it('GET /api/config/nonexistent → 404', async () => {
    const { status } = await request(baseUrl, '/api/config/nonexistent_key');
    assert.equal(status, 404);
  });
});

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------
describe('Stats', () => {
  it('GET /api/stats → 200, returns counts matching created test data', async () => {
    const { status, body } = await request(baseUrl, '/api/stats');
    assert.equal(status, 200);
    assert.ok(body.data);
    assert.equal(body.data.flats, 1);
    assert.equal(body.data.rooms.total, 1);
    assert.ok(typeof body.data.contacts === 'object');
    assert.ok('tenant' in body.data.contacts);
    assert.ok(typeof body.data.income_this_month === 'number');
    assert.ok(typeof body.data.costs_this_month === 'number');
    assert.ok(body.data.period);
    assert.ok(body.data.period.month);
    assert.ok(body.data.period.year);
  });
});

// ---------------------------------------------------------------------------
// Contracts (full prospect → contract → tenant flow)
// ---------------------------------------------------------------------------
describe('Contracts', () => {
  let prospectId;
  let contractId;

  it('seed: POST /api/prospects → 201', async () => {
    const { status, body } = await request(baseUrl, '/api/prospects', {
      method: 'POST',
      body: { name: 'Tester Prospect', phone: '34600111222', language: 'es' },
    });
    assert.equal(status, 201);
    prospectId = body.data.id;
  });

  it('POST /api/contracts/generate → 201, contract draft + prospect → contract_sent', async () => {
    const { status, body } = await request(baseUrl, '/api/contracts/generate', {
      method: 'POST',
      body: {
        prospect_id: prospectId,
        room_id: roomId,
        lang: 'es',
        start_date: '2026-06-01',
        end_date: '2027-05-31',
        deposit: 700,
      },
    });
    assert.equal(status, 201);
    assert.equal(body.data.status, 'draft');
    assert.equal(body.data.prospect_id, prospectId);
    assert.equal(body.data.room_id, roomId);
    assert.ok(body.data.file_path, 'file_path should be set');
    contractId = body.data.id;

    const { body: pBody } = await request(baseUrl, `/api/prospects/${prospectId}`);
    assert.equal(pBody.data.status, 'contract_sent');
  });

  it('POST /api/contracts/generate missing fields → 400', async () => {
    const { status } = await request(baseUrl, '/api/contracts/generate', {
      method: 'POST',
      body: { prospect_id: prospectId },
    });
    assert.equal(status, 400);
  });

  it('GET /api/contracts → 200, lists with prospect_name and room_name', async () => {
    const { status, body } = await request(baseUrl, '/api/contracts');
    assert.equal(status, 200);
    assert.ok(body.data.length >= 1);
    const c = body.data.find(x => x.id === contractId);
    assert.ok(c);
    assert.equal(c.prospect_name, 'Tester Prospect');
    assert.ok(c.room_name);
  });

  it('GET /api/contracts/:id → 200', async () => {
    const { status, body } = await request(baseUrl, `/api/contracts/${contractId}`);
    assert.equal(status, 200);
    assert.equal(body.data.id, contractId);
  });

  it('PUT /api/contracts/:id/status → 200, draft → terminated allowed', async () => {
    // Generate a second draft we can terminate without breaking subsequent sign test
    const { body: second } = await request(baseUrl, '/api/contracts/generate', {
      method: 'POST',
      body: { prospect_id: prospectId, room_id: roomId, lang: 'es' },
    });
    const { status, body } = await request(baseUrl, `/api/contracts/${second.data.id}/status`, {
      method: 'PUT', body: { status: 'terminated' },
    });
    assert.equal(status, 200);
    assert.equal(body.data.status, 'terminated');
  });

  it('PUT /api/contracts/:id/status with status=signed → 400 (use /sign)', async () => {
    const { status } = await request(baseUrl, `/api/contracts/${contractId}/status`, {
      method: 'PUT', body: { status: 'signed' },
    });
    assert.equal(status, 400);
  });

  it('PUT /api/contracts/:id/sign → signs + creates tenant + occupies room + prospect=signed', async () => {
    const { status, body } = await request(baseUrl, `/api/contracts/${contractId}/sign`, {
      method: 'PUT',
    });
    assert.equal(status, 200);
    assert.equal(body.data.contract.status, 'signed');
    assert.ok(body.data.contract.signed_at);
    assert.equal(body.data.contact.role, 'tenant');
    assert.equal(body.data.contact.room_id, roomId);

    // Room is now unavailable
    const { body: rBody } = await request(baseUrl, `/api/rooms/${roomId}`);
    assert.equal(rBody.data.available, 0);

    // Prospect is now signed
    const { body: pBody } = await request(baseUrl, `/api/prospects/${prospectId}`);
    assert.equal(pBody.data.status, 'signed');
  });

  it('PUT /api/contracts/:id/sign on already-signed → 409', async () => {
    const { status } = await request(baseUrl, `/api/contracts/${contractId}/sign`, {
      method: 'PUT',
    });
    assert.equal(status, 409);
  });

  it('GET /api/contracts/:id/download → 200, text/html', async () => {
    const res = await fetch(`${baseUrl}/api/contracts/${contractId}/download`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type') || '', /text\/html/);
    const text = await res.text();
    assert.ok(text.length > 100);
  });
});

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------
describe('Photos', () => {
  let photoId;
  let secondPhotoId;

  it('POST /api/photos → 201, uploads file to disk + DB row', async () => {
    const { status, body } = await multipart(baseUrl, '/api/photos',
      { flat_id: flatId, description: 'Salón principal' },
      [{ buffer: TINY_PNG, name: 'salon.png', type: 'image/png' }]);
    assert.equal(status, 201);
    assert.equal(body.data.length, 1);
    const p = body.data[0];
    assert.equal(p.flat_id, flatId);
    assert.equal(p.description, 'Salón principal');
    assert.match(p.filename, /\.png$/);
    photoId = p.id;
  });

  it('POST /api/photos with multiple files → 201', async () => {
    const { status, body } = await multipart(baseUrl, '/api/photos',
      { flat_id: flatId, room_id: roomId },
      [
        { buffer: TINY_PNG, name: 'a.png' },
        { buffer: TINY_PNG, name: 'b.png' },
      ]);
    assert.equal(status, 201);
    assert.equal(body.data.length, 2);
    assert.equal(body.data[0].room_id, roomId);
    secondPhotoId = body.data[0].id;
  });

  it('POST /api/photos rejects non-image extension → 400', async () => {
    const { status } = await multipart(baseUrl, '/api/photos',
      { flat_id: flatId },
      [{ buffer: Buffer.from('hello'), name: 'note.txt', type: 'text/plain' }]);
    assert.equal(status, 400);
  });

  it('POST /api/photos with invalid flat_id → 400', async () => {
    const { status } = await multipart(baseUrl, '/api/photos',
      { flat_id: 9999 },
      [{ buffer: TINY_PNG, name: 'x.png' }]);
    assert.equal(status, 400);
  });

  it('POST /api/photos with no files → 400', async () => {
    const { status } = await multipart(baseUrl, '/api/photos', { flat_id: flatId }, []);
    assert.equal(status, 400);
  });

  it('GET /api/photos?flat_id= → 200, returns flat photos', async () => {
    const { status, body } = await request(baseUrl, `/api/photos?flat_id=${flatId}`);
    assert.equal(status, 200);
    assert.ok(body.data.length >= 3);
    body.data.forEach(p => assert.equal(p.flat_id, flatId));
  });

  it('GET /api/photos?room_id= → 200, filters by room', async () => {
    const { status, body } = await request(baseUrl, `/api/photos?room_id=${roomId}`);
    assert.equal(status, 200);
    body.data.forEach(p => assert.equal(p.room_id, roomId));
  });

  it('GET /api/photos?room_id=null → 200, only common photos', async () => {
    const { status, body } = await request(baseUrl, `/api/photos?room_id=null&flat_id=${flatId}`);
    assert.equal(status, 200);
    body.data.forEach(p => assert.equal(p.room_id, null));
  });

  it('PUT /api/photos/:id → 200, updates description + active + cover', async () => {
    const { status, body } = await request(baseUrl, `/api/photos/${photoId}`, {
      method: 'PUT',
      body: { description: 'Salón actualizado', is_cover: true, active: true },
    });
    assert.equal(status, 200);
    assert.equal(body.data.description, 'Salón actualizado');
    assert.equal(body.data.is_cover, 1);
    assert.equal(body.data.active, 1);
  });

  it('PUT /api/photos/:id with mismatched room → 400', async () => {
    // roomId belongs to flatId; photoId is on flatId but try to assign a non-existent room
    const { status } = await request(baseUrl, `/api/photos/${photoId}`, {
      method: 'PUT', body: { room_id: 99999 },
    });
    assert.equal(status, 400);
  });

  it('POST /api/photos/reorder → 200, updates sort_order', async () => {
    const { body: list } = await request(baseUrl, `/api/photos?flat_id=${flatId}`);
    const ids = list.data.slice(0, 3).map(p => p.id).reverse();
    const { status, body } = await request(baseUrl, '/api/photos/reorder', {
      method: 'POST', body: { ids },
    });
    assert.equal(status, 200);
    assert.equal(body.data.reordered, 3);
  });

  it('DELETE /api/photos/:id → 200, removes row + file', async () => {
    const { status, body } = await request(baseUrl, `/api/photos/${photoId}`, { method: 'DELETE' });
    assert.equal(status, 200);
    assert.equal(body.data.deleted, true);

    const { status: getStatus } = await request(baseUrl, `/api/photos/${photoId}`);
    assert.equal(getStatus, 404);
  });
});

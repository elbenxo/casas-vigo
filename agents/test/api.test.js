'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, request } = require('./setup');

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
// Contracts
// ---------------------------------------------------------------------------
describe('Contracts', () => {
  it('POST /api/contracts/draft → 501', async () => {
    const { status } = await request(baseUrl, '/api/contracts/draft', {
      method: 'POST',
      body: { contact_id: contactId },
    });
    assert.equal(status, 501);
  });
});

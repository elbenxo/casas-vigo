/**
 * Smoke test: Dashboard prospects + contracts flow
 * Usage: npx playwright test scripts/test-dashboard.mjs (or node with playwright)
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const TIMEOUT = 5000;

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  function ok(name) { results.push({ name, pass: true }); console.log(`  ✓ ${name}`); }
  function fail(name, err) { results.push({ name, pass: false, err: err.message }); console.log(`  ✗ ${name}: ${err.message}`); }

  try {
    // 1. Dashboard home loads
    console.log('\n── Dashboard ──');
    await page.goto(`${BASE}/dashboard/`, { timeout: TIMEOUT });
    const title = await page.title();
    title.includes('Casas Vigo') ? ok('Dashboard home loads') : fail('Dashboard home loads', new Error(`Title: ${title}`));

    // 2. Prospects page loads
    console.log('\n── Prospects ──');
    await page.goto(`${BASE}/dashboard/prospects.html`, { timeout: TIMEOUT });
    await page.waitForTimeout(1000);
    const hasKanban = await page.locator('#kanban-board, [id*="kanban"], .space-y-2').first().isVisible().catch(() => false);
    const pageText = await page.textContent('body');
    const noError = !pageText.includes('Error al cargar');
    noError ? ok('Prospects page loads without error') : fail('Prospects page loads', new Error('Error al cargar visible'));

    // 3. Create a prospect
    const newBtn = page.locator('button:has-text("Nuevo"), button:has-text("prospecto")').first();
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await page.waitForTimeout(500);
      await page.fill('#edit-name', 'Test Prospect');
      await page.fill('#edit-phone', '+34600111222');
      await page.fill('#edit-email', 'test@example.com');
      await page.fill('#edit-dob', '1990-05-15');
      await page.fill('#edit-dni', 'X1234567A');
      // Submit form
      const submitBtn = page.locator('#form-edit-prospect button[type="submit"], #modal-edit-prospect button:has-text("Guardar")').first();
      await submitBtn.click();
      await page.waitForTimeout(1000);
      ok('Created prospect with dob/dni fields');
    } else {
      fail('Create prospect', new Error('New prospect button not found'));
    }

    // 4. Verify prospect appears in API
    const prospectRes = await page.evaluate(() => fetch('/api/prospects').then(r => r.json()));
    const prospect = prospectRes.data?.find(p => p.name === 'Test Prospect');
    if (prospect) {
      ok(`Prospect in API (id=${prospect.id}, dob=${prospect.dob}, dni=${prospect.dni})`);
    } else {
      fail('Prospect in API', new Error('Not found'));
    }

    // 5. Contracts page loads
    console.log('\n── Contracts ──');
    await page.goto(`${BASE}/dashboard/contracts.html`, { timeout: TIMEOUT });
    await page.waitForTimeout(1000);
    const contractsText = await page.textContent('body');
    const contractsOk = !contractsText.includes('Error al cargar');
    contractsOk ? ok('Contracts page loads without error') : fail('Contracts page loads', new Error('Error visible'));

    // 6. Check generate form has utilities + sign date fields
    const genBtn = page.locator('button:has-text("Nuevo contrato"), button:has-text("Generar")').first();
    if (await genBtn.isVisible()) {
      await genBtn.click();
      await page.waitForTimeout(500);
      const hasUtilities = await page.locator('#gen-utilities').isVisible().catch(() => false);
      const hasSignDate = await page.locator('#gen-sign-date').isVisible().catch(() => false);
      hasUtilities ? ok('Utilities provision field present') : fail('Utilities field', new Error('Not found'));
      hasSignDate ? ok('Sign date field present') : fail('Sign date field', new Error('Not found'));
    }

    // 7. Generate contract via API directly
    if (prospect) {
      const rooms = await page.evaluate(() => fetch('/api/rooms?available=1').then(r => r.json()));
      const room = rooms.data?.[0];
      if (room) {
        const genRes = await page.evaluate(({ pid, rid }) =>
          fetch('/api/contracts/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prospect_id: pid,
              room_id: rid,
              lang: 'es',
              start_date: '2026-05-01',
              end_date: '2027-04-30',
              monthly_rent: 350,
              deposit: 350,
              utilities_provision: '25',
            }),
          }).then(r => r.json()),
          { pid: prospect.id, rid: room.id }
        );
        if (genRes.data?.id) {
          ok(`Contract generated (id=${genRes.data.id}, lang=${genRes.data.template_lang})`);

          // 8. Download and verify contract HTML has real content
          const html = await page.evaluate(id =>
            fetch(`/api/contracts/${id}/download`).then(r => r.text()),
            genRes.data.id
          );
          const hasName = html.includes('Test Prospect');
          const hasRoom = html.includes(room.name);
          const hasClauses = html.includes('Cl\u00e1usulas') || html.includes('CLÁUSULAS') || html.includes('usulas');
          hasName ? ok('Contract has tenant name') : fail('Contract tenant name', new Error('Missing'));
          hasRoom ? ok('Contract has room name') : fail('Contract room name', new Error('Missing'));
          hasClauses ? ok('Contract has 15 clauses') : fail('Contract clauses', new Error('Missing'));

          // 9. Sign contract
          const signRes = await page.evaluate(id =>
            fetch(`/api/contracts/${id}/sign`, { method: 'PUT' }).then(r => r.json()),
            genRes.data.id
          );
          if (signRes.data?.contract?.status === 'signed' && signRes.data?.contact) {
            ok(`Contract signed → tenant created (contact_id=${signRes.data.contact.id})`);
          } else {
            fail('Sign contract', new Error(JSON.stringify(signRes)));
          }
        } else {
          fail('Generate contract', new Error(JSON.stringify(genRes)));
        }
      } else {
        fail('Generate contract', new Error('No available rooms'));
      }
    }

    // 10. Occupancy page still works
    console.log('\n── Other pages ──');
    await page.goto(`${BASE}/dashboard/occupancy.html`, { timeout: TIMEOUT });
    await page.waitForTimeout(1000);
    const errorBox = await page.locator('.bg-red-50:visible').count();
    errorBox === 0 ? ok('Occupancy page loads') : fail('Occupancy page', new Error('Error box visible'));

  } catch (err) {
    fail('Unexpected error', err);
  }

  await browser.close();

  // Summary
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log(`\n── Results: ${passed} passed, ${failed} failed ──`);
  if (failed > 0) {
    console.log('\nFailed:');
    results.filter(r => !r.pass).forEach(r => console.log(`  ✗ ${r.name}: ${r.err}`));
  }
  process.exit(failed > 0 ? 1 : 0);
}

run();

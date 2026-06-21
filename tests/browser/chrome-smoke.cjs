const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');

const URL = 'http://127.0.0.1:4173/index.html';

async function waitForServer(timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(URL);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Static server did not become ready at ${URL}`);
}

test('Google Chrome loads the MediWell homepage', { timeout: 30000 }, async (t) => {
  const server = spawn(
    'python',
    ['-m', 'http.server', '4173', '--bind', '127.0.0.1'],
    { cwd: process.cwd(), stdio: 'ignore', windowsHide: true }
  );
  t.after(() => server.kill());

  await waitForServer();
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  t.after(() => browser.close());

  const page = await browser.newPage();
  await page.goto(URL);
  await assert.doesNotReject(() => page.locator('#hero-title').waitFor());
  assert.equal(await page.title(), 'MediWell | Studi sanitari a giornata a Faenza');
});

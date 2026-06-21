# VS Code Chrome Playwright MCP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure this repository so Codex in VS Code can control visible Google Chrome through Playwright MCP with an isolated profile.

**Architecture:** A project-scoped Codex configuration registers Playwright MCP with the Chrome channel and isolated sessions. An npm script serves the static site on localhost, while a separate smoke test proves that the installed Playwright library can launch Chrome and load the homepage without affecting the normal test suite.

**Tech Stack:** Codex MCP configuration, Playwright 1.60, Google Chrome, Node.js test runner, Python static HTTP server

---

### Task 1: Define the browser-tooling contract

**Files:**
- Create: `tests/browser-tooling.test.cjs`
- Create: `.codex/config.toml`
- Modify: `package.json`

- [ ] **Step 1: Write the failing configuration test**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('Codex registers isolated visible Google Chrome through Playwright MCP', () => {
  const configPath = path.join(root, '.codex', 'config.toml');
  assert.equal(fs.existsSync(configPath), true, '.codex/config.toml is required');

  const config = fs.readFileSync(configPath, 'utf8');
  assert.match(config, /\[mcp_servers\.playwright\]/);
  assert.match(config, /@playwright\/mcp@latest/);
  assert.match(config, /"--browser",\s*"chrome"/);
  assert.match(config, /"--isolated"/);
  assert.doesNotMatch(config, /"--headless"/);
});

test('package exposes a stable localhost server command', () => {
  const pkg = require(path.join(root, 'package.json'));
  assert.equal(
    pkg.scripts.serve,
    'python -m http.server 4173 --bind 127.0.0.1'
  );
});
```

- [ ] **Step 2: Run the contract test and verify RED**

Run: `node --test tests/browser-tooling.test.cjs`

Expected: FAIL because `.codex/config.toml` and `scripts.serve` do not exist.

- [ ] **Step 3: Add project-scoped Playwright MCP configuration**

Create `.codex/config.toml`:

```toml
[mcp_servers.playwright]
command = "npx"
args = ["--yes", "@playwright/mcp@latest", "--browser", "chrome", "--isolated"]
startup_timeout_sec = 30
```

Add this entry under `scripts` in `package.json` while preserving `test`:

```json
"serve": "python -m http.server 4173 --bind 127.0.0.1"
```

- [ ] **Step 4: Run the contract test and verify GREEN**

Run: `node --test tests/browser-tooling.test.cjs`

Expected: 2 tests pass, 0 fail.

- [ ] **Step 5: Commit the configuration contract**

```powershell
git add -- .codex/config.toml package.json tests/browser-tooling.test.cjs
git commit -m "Configure Playwright MCP for visible Chrome"
```

### Task 2: Add an explicit Chrome smoke test

**Files:**
- Create: `tests/browser/chrome-smoke.cjs`
- Modify: `package.json`
- Test: `tests/browser-tooling.test.cjs`

- [ ] **Step 1: Extend the contract test before adding the script**

Add to `tests/browser-tooling.test.cjs`:

```js
test('package exposes an opt-in Chrome smoke test', () => {
  const pkg = require(path.join(root, 'package.json'));
  assert.equal(pkg.scripts['test:chrome'], 'node --test tests/browser/chrome-smoke.cjs');
});
```

- [ ] **Step 2: Run the contract test and verify RED**

Run: `node --test tests/browser-tooling.test.cjs`

Expected: 1 failure reporting that `scripts.test:chrome` is undefined.

- [ ] **Step 3: Implement the isolated Chrome smoke test**

Create `tests/browser/chrome-smoke.cjs`:

```js
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
```

Add to `package.json` scripts:

```json
"test:chrome": "node --test tests/browser/chrome-smoke.cjs"
```

- [ ] **Step 4: Run the contract and Chrome smoke tests**

Run: `node --test tests/browser-tooling.test.cjs`

Expected: 3 tests pass, 0 fail.

Run: `npm run test:chrome`

Expected: visible Google Chrome opens briefly; 1 test passes, 0 fail.

- [ ] **Step 5: Commit the smoke test**

```powershell
git add -- package.json tests/browser-tooling.test.cjs tests/browser/chrome-smoke.cjs
git commit -m "Add visible Chrome smoke test"
```

### Task 3: Make Codex usage explicit and verify the complete setup

**Files:**
- Modify: `AGENTS.md`
- Test: `tests/browser-tooling.test.cjs`

- [ ] **Step 1: Add a failing guidance assertion**

Add to `tests/browser-tooling.test.cjs`:

```js
test('repository guidance names Playwright MCP and the local server command', () => {
  const guidance = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  assert.match(guidance, /Playwright MCP/);
  assert.match(guidance, /npm run serve/);
  assert.match(guidance, /non usare il browser integrato/i);
});
```

- [ ] **Step 2: Run the guidance test and verify RED**

Run: `node --test tests/browser-tooling.test.cjs`

Expected: 1 failure because the current guidance does not name Playwright MCP or `npm run serve`.

- [ ] **Step 3: Replace AGENTS.md with operational guidance**

```md
## Test frontend

- Per verifiche visuali e interazioni web usa Playwright MCP con Google Chrome visibile.
- Prima della verifica avvia il sito con `npm run serve` e usa `http://127.0.0.1:4173`.
- Non usare il browser integrato di Codex e non ripiegare silenziosamente su di esso.
- Il browser deve usare il profilo isolato configurato in `.codex/config.toml`; non usare il profilo Chrome personale.
- Dopo ogni modifica frontend, ricarica la pagina interessata e verifica lo stato richiesto.
- Se Chrome o Playwright MCP non sono disponibili, fermati e segnala il problema.
```

- [ ] **Step 4: Run all verification commands**

Run: `node --test tests/browser-tooling.test.cjs`

Expected: 4 tests pass, 0 fail.

Run: `npm test`

Expected: all repository tests pass with 0 failures.

Run: `npm run test:chrome`

Expected: visible Google Chrome opens and the smoke test passes.

Run: `git diff --check`

Expected: no output and exit code 0.

- [ ] **Step 5: Commit the repository guidance**

```powershell
git add -- AGENTS.md tests/browser-tooling.test.cjs
git commit -m "Document Playwright MCP browser workflow"
```

After these tasks, restart Codex or open a new VS Code session so the new project MCP server is discovered.

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

test('package exposes an opt-in Chrome smoke test', () => {
  const pkg = require(path.join(root, 'package.json'));
  assert.equal(pkg.scripts['test:chrome'], 'node --test tests/browser/chrome-smoke.cjs');
});

test('repository guidance names Playwright MCP and the local server command', () => {
  const guidance = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  assert.match(guidance, /Playwright MCP/);
  assert.match(guidance, /npm run serve/);
  assert.match(guidance, /non usare il browser integrato/i);
});

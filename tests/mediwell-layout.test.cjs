const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer, request } = require('node:http');
const { readFile } = require('node:fs/promises');
const { extname, isAbsolute, normalize, relative, resolve, sep } = require('node:path');
const { chromium } = require('playwright');

const root = resolve(__dirname, '..');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

let browser;
let server;
let baseUrl;

function isAllowedPath(relativePath) {
  return relativePath === 'index.html' || relativePath.startsWith(`assets${sep}`);
}

function isPathInsideRoot(rootPath, filePath) {
  const candidate = relative(rootPath, filePath);
  return candidate !== '' && !candidate.startsWith('..') && !isAbsolute(candidate);
}

before(async () => {
  server = createServer(async (request, response) => {
    const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
    const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
    const filePath = normalize(resolve(root, relativePath));

    if (!isPathInsideRoot(root, filePath)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    const normalizedRelative = filePath.slice(root.length + 1);
    if (!isAllowedPath(normalizedRelative)) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    try {
      const body = await readFile(filePath);
      response.writeHead(200, {
        'Content-Type': mime[extname(filePath).toLowerCase()] || 'application/octet-stream'
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });

  await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser.close();
  await new Promise((resolveServer) => server.close(resolveServer));
});

function requestStatus(pathname) {
  return new Promise((resolveStatus, rejectStatus) => {
    const httpRequest = request({
      host: '127.0.0.1',
      port: server.address().port,
      path: pathname,
      method: 'GET'
    }, (response) => {
      response.resume();
      response.on('end', () => resolveStatus(response.statusCode));
    });
    httpRequest.on('error', rejectStatus);
    httpRequest.end();
  });
}

async function inspect(width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  const metrics = await page.evaluate(() => {
    const heroHeading = document.querySelector('h1');
    const launchHeading = document.querySelector('#lancio h2');
    const launchCopy = document.querySelector('.mw-launch-copy');
    const heroStyle = getComputedStyle(heroHeading);
    const launchStyle = getComputedStyle(launchHeading);
    const dateBox = launchHeading.getBoundingClientRect();
    const copyBox = launchCopy.getBoundingClientRect();

    const overlap = !(
      dateBox.right <= copyBox.left ||
      dateBox.left >= copyBox.right ||
      dateBox.bottom <= copyBox.top ||
      dateBox.top >= copyBox.bottom
    );

    return {
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      heroFontSize: parseFloat(heroStyle.fontSize),
      heroLineHeightRatio: parseFloat(heroStyle.lineHeight) / parseFloat(heroStyle.fontSize),
      heroTrackingRatio: parseFloat(heroStyle.letterSpacing) / parseFloat(heroStyle.fontSize),
      launchLineHeightRatio: parseFloat(launchStyle.lineHeight) / parseFloat(launchStyle.fontSize),
      dateBox: {
        left: dateBox.left,
        top: dateBox.top,
        right: dateBox.right,
        bottom: dateBox.bottom,
        width: dateBox.width,
        height: dateBox.height
      },
      copyBox: {
        left: copyBox.left,
        top: copyBox.top,
        right: copyBox.right,
        bottom: copyBox.bottom,
        width: copyBox.width,
        height: copyBox.height
      },
      overlap
    };
  });

  await page.close();
  return metrics;
}

test('rejects path traversal attempts', async () => {
  assert.equal(await requestStatus('/%2e%2e/package.json'), 403);
  assert.equal(await requestStatus('/assets/%2e%2e/%2e%2e/package.json'), 403);
  assert.equal(await requestStatus('/assets/%5c..%5c..%5cpackage.json'), 403);
});

test('detects root boundaries with path-aware checks on Windows-style paths', () => {
  const localRoot = 'C:\\workspace\\mediwell';

  assert.equal(isPathInsideRoot(localRoot, 'C:\\workspace\\mediwell\\index.html'), true);
  assert.equal(isPathInsideRoot(localRoot, 'C:\\workspace\\mediwell\\assets\\hero.jpg'), true);
  assert.equal(isPathInsideRoot(localRoot, 'C:\\workspace\\mediwell-other\\index.html'), false);
  assert.equal(isPathInsideRoot(localRoot, 'C:\\workspace\\package.json'), false);
});

test('keeps hero and launch typography within the refined layout bounds', async () => {
  const mobile = await inspect(390, 844);
  const desktop = await inspect(1440, 1200);

  assert.equal(mobile.documentWidth, mobile.viewportWidth);
  assert.equal(desktop.documentWidth, desktop.viewportWidth);
  assert.ok(mobile.heroLineHeightRatio >= 0.96, `mobile hero line-height ratio: ${mobile.heroLineHeightRatio}`);
  assert.ok(desktop.heroFontSize <= 112, `desktop hero font-size: ${desktop.heroFontSize}`);
  assert.ok(desktop.heroTrackingRatio >= -0.055, `desktop hero tracking ratio: ${desktop.heroTrackingRatio}`);
  assert.ok(desktop.launchLineHeightRatio >= 0.86, `desktop launch line-height ratio: ${desktop.launchLineHeightRatio}`);
  assert.equal(
    desktop.overlap,
    false,
    `desktop overlap: ${desktop.overlap}, dateBox=${JSON.stringify(desktop.dateBox)}, copyBox=${JSON.stringify(desktop.copyBox)}`
  );
});

test('keeps footer social icons centered inside the mobile card', async () => {
  const page = await browser.newPage({ viewport: { width: 360, height: 900 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  const footer = await page.evaluate(() => {
    const grid = document.querySelector('.mw-footer-grid').getBoundingClientRect();
    const social = document.querySelector('.mw-footer-social').getBoundingClientRect();
    const links = Array.from(document.querySelectorAll('.mw-social-link')).map((link) => {
      const box = link.getBoundingClientRect();
      return {
        left: box.left,
        right: box.right,
        width: box.width
      };
    });

    return {
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      grid: {
        left: grid.left,
        right: grid.right,
        center: grid.left + grid.width / 2
      },
      social: {
        left: social.left,
        right: social.right,
        center: social.left + social.width / 2,
        width: social.width
      },
      links
    };
  });

  await page.close();

  assert.equal(footer.documentWidth, footer.viewportWidth);
  assert.ok(footer.social.left >= footer.grid.left, `social left ${footer.social.left} < grid left ${footer.grid.left}`);
  assert.ok(footer.social.right <= footer.grid.right, `social right ${footer.social.right} > grid right ${footer.grid.right}`);
  assert.ok(
    Math.abs(footer.social.center - footer.grid.center) <= 1,
    `social center ${footer.social.center} not aligned to grid center ${footer.grid.center}`
  );

  for (const link of footer.links) {
    assert.ok(link.left >= footer.grid.left, `link left ${link.left} < grid left ${footer.grid.left}`);
    assert.ok(link.right <= footer.grid.right, `link right ${link.right} > grid right ${footer.grid.right}`);
    assert.equal(link.width, 46);
  }
});

test('disables reveal transitions when reduced motion is requested', async () => {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce'
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  const motionState = await page.evaluate(() => {
    function toMilliseconds(value) {
      const trimmed = value.trim();
      if (!trimmed) {
        return 0;
      }

      if (trimmed.endsWith('ms')) {
        return parseFloat(trimmed);
      }

      if (trimmed.endsWith('s')) {
        return parseFloat(trimmed) * 1000;
      }

      return Number.NaN;
    }

    function parseTimeList(value) {
      return value
        .split(',')
        .map(toMilliseconds)
        .filter((entry) => Number.isFinite(entry));
    }

    const selectors = ['.mw-reveal', '.mw-reveal-stagger > *', '.mw-countdown-reveal'];
    const sampled = selectors.flatMap((selector) =>
      Array.from(document.querySelectorAll(selector)).map((element) => {
        const style = getComputedStyle(element);
        const durations = parseTimeList(style.transitionDuration);
        const delays = parseTimeList(style.transitionDelay);

        return {
          selector,
          transitionDuration: style.transitionDuration,
          transitionDelay: style.transitionDelay,
          opacity: parseFloat(style.opacity),
          maxDuration: durations.length ? Math.max(...durations) : 0,
          maxDelay: delays.length ? Math.max(...delays) : 0
        };
      })
    );

    return {
      count: sampled.length,
      maxDuration: sampled.length ? Math.max(...sampled.map((entry) => entry.maxDuration)) : 0,
      maxDelay: sampled.length ? Math.max(...sampled.map((entry) => entry.maxDelay)) : 0,
      hidden: sampled.filter((entry) => entry.opacity <= 0.01),
      sampled
    };
  });

  await page.close();

  assert.ok(motionState.count > 0, 'expected to sample reduced-motion elements');
  assert.ok(
    motionState.maxDuration <= 0.01,
    `expected max transition duration <= 0.01ms, got ${motionState.maxDuration}ms from ${JSON.stringify(motionState.sampled)}`
  );
  assert.ok(
    motionState.maxDelay <= 0.01,
    `expected max transition delay <= 0.01ms, got ${motionState.maxDelay}ms from ${JSON.stringify(motionState.sampled)}`
  );
  assert.deepEqual(
    motionState.hidden,
    [],
    `expected reduced-motion elements to remain visible after load: ${JSON.stringify(motionState.hidden)}`
  );
});

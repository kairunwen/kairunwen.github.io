// Run with node scripts/check_analytics.mjs; no dependencies or network requests.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../js/analytics.js', import.meta.url), 'utf8');
async function check(hostname, pathname, views, fail = false) {
  const counter = { textContent: '—' };
  const scripts = [];
  const context = {
    location: { hostname, pathname, origin: `https://${hostname}` },
    window: {},
    document: {
      createElement: () => ({}),
      head: { appendChild: script => scripts.push(script) },
      getElementById: () => counter
    },
    fetch: async () => ({ ok: !fail, json: async () => ({ views, updated_at: '2026-09-14' }) })
  };
  runInNewContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  return { counter, scripts, queue: context.window.dataLayer };
}
const preview = await check('127.0.0.1', '/', null);
assert.equal(preview.scripts.length, 0);
assert.equal(preview.counter.textContent, '—');
const publicPage = await check('kairunwen.github.io', '/', 1234);
assert.equal(publicPage.scripts.length, 1);
assert.equal(publicPage.counter.textContent, '1,234');
assert.equal(publicPage.queue.filter(command => command[0] === 'config').length, 1);
assert.equal(publicPage.queue[1][2].page_location, 'https://kairunwen.github.io/');
assert.equal((await check('kairunwen.github.io', '/Awesome-Robot-Use-Agent/', 0)).scripts.length, 0);
assert.equal((await check('localhost', '/', 0)).counter.textContent, '0');
assert.equal((await check('localhost', '/', -1)).counter.textContent, '—');
assert.equal((await check('localhost', '/', 1234, true)).counter.textContent, '—');
console.log('PASS: production-only tracking, formatted views, real zero, and honest failure state.');

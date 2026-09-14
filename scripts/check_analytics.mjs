// Run with node scripts/check_analytics.mjs; no dependencies or network requests.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../js/analytics.js', import.meta.url), 'utf8');
function check(hostname, pathname) {
  const scripts = [];
  const context = {
    location: { hostname, pathname, origin: `https://${hostname}` },
    window: {},
    document: {
      createElement: () => ({}),
      head: { appendChild: script => scripts.push(script) }
    }
  };
  runInNewContext(source, context);
  return { scripts, queue: context.window.dataLayer };
}
const preview = check('127.0.0.1', '/');
assert.equal(preview.scripts.length, 0);
const publicPage = check('kairunwen.github.io', '/');
assert.equal(publicPage.scripts.length, 1);
assert.equal(publicPage.queue.filter(command => command[0] === 'config').length, 1);
assert.equal(publicPage.queue[1][2].page_location, 'https://kairunwen.github.io/');
assert.equal((check('kairunwen.github.io', '/Awesome-Robot-Use-Agent/')).scripts.length, 0);
console.log('PASS: production-only private tracking; no public counter requests.');

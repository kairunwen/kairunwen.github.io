// Run with node scripts/check_navigation.mjs; checks all links and browser history changes.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const links = ['top', 'news', 'publications', 'projects', 'service', 'awards'].map(id => ({
  attrs: { href: `#${id}` },
  getAttribute(key) { return this.attrs[key]; },
  setAttribute(key, value) { this.attrs[key] = value; },
  removeAttribute(key) { delete this.attrs[key]; }
}));
const events = {};
let height = 72;
let resize;
const context = {
  location: { hash: '#projects' },
  window: { addEventListener: (event, callback) => { events[event] = callback; } },
  document: {
    querySelectorAll: () => links,
    querySelector: () => ({ getBoundingClientRect: () => ({ height }) }),
    documentElement: { style: {} }
  },
  ResizeObserver: class { constructor(callback) { resize = callback; } observe() {} }
};
runInNewContext(readFileSync(new URL('../js/navigation.js', import.meta.url), 'utf8'), context);
const active = () => links.filter(link => link.attrs['aria-current']).map(link => link.attrs.href);
assert.deepEqual(active(), ['#projects']);
for (const link of links) {
  context.location.hash = link.attrs.href;
  events.hashchange();
  assert.deepEqual(active(), [link.attrs.href]);
}
context.location.hash = '';
events.pageshow();
assert.deepEqual(active(), ['#top']);
height = 130;
resize();
assert.equal(context.document.documentElement.style.scrollPaddingTop, '150px');
console.log('PASS: section highlights, initial deep link, history restore, and responsive header offset.');

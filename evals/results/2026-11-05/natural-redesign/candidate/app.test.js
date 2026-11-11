'use strict';
// Executes app.js with a small DOM contract and simulated storage.
// This checks application state and handlers, not browser rendering or native input behavior.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ReadingModel = require('./model.js');
const html = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
const app = fs.readFileSync(`${__dirname}/app.js`, 'utf8');

class Element {
  constructor(tag, owner, attrs = {}) {
    this.tagName = tag.toUpperCase();
    this.owner = owner;
    this.attributes = { ...attrs };
    this.id = attrs.id || '';
    this.className = attrs.class || '';
    this.hidden = Object.hasOwn(attrs, 'hidden');
    this.value = '';
    this.dataset = {};
    this.children = [];
    this.listeners = {};
    this._text = '';
    this.classList = {
      add: name => { this.className = [...new Set([...this.className.split(' ').filter(Boolean), name])].join(' '); },
      remove: name => { this.className = this.className.split(' ').filter(x => x !== name).join(' '); }
    };
  }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text + this.children.map(x => x.textContent).join(''); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  removeAttribute(name) { delete this.attributes[name]; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this._text = ''; this.children = [...children]; }
  addEventListener(type, handler) { (this.listeners[type] ||= []).push(handler); }
  dispatch(type, values = {}) {
    const event = { type, target: this, preventDefault() { this.defaultPrevented = true; }, ...values };
    for (const handler of this.listeners[type] || []) handler(event);
    return event;
  }
  focus() { this.owner.activeElement = this; }
}

function boot(saved, options = {}) {
  const nodes = new Map();
  const created = [];
  const document = {
    activeElement: null,
    title: '',
    createElement(tag) { const node = new Element(tag, this); created.push(node); return node; },
    getElementById(id) {
      if (nodes.has(id)) return nodes.get(id);
      function find(node) {
        if (node.id === id) return node;
        for (const child of node.children) { const found = find(child); if (found) return found; }
      }
      for (const node of nodes.values()) { const found = find(node); if (found) return found; }
      return null;
    }
  };
  for (const match of html.matchAll(/<([a-z][\w-]*)\b([^>]*\bid="[^"]+"[^>]*)>/gi)) {
    const attrs = {};
    for (const attribute of match[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g)) attrs[attribute[1]] = attribute[2] ?? '';
    assert.ok(!nodes.has(attrs.id), `Duplicate HTML ID: ${attrs.id}`);
    nodes.set(attrs.id, new Element(match[1], document, attrs));
  }
  const stored = new Map();
  if (saved !== undefined) stored.set('reading-list', typeof saved === 'string' ? saved : JSON.stringify(saved));
  const localStorage = {
    getItem(key) { if (options.throwRead) throw Error('Storage unavailable'); return stored.get(key) ?? null; },
    setItem(key, value) { if (options.throwWrite) throw Error('Quota exceeded'); stored.set(key, value); }
  };
  vm.runInNewContext(app, { document, localStorage, ReadingModel }, { filename: 'app.js' });
  const $ = id => { const node = document.getElementById(id); assert.ok(node, `Missing node: ${id}`); return node; };
  return {
    $, document, created, stored, options,
    rows: () => $('cards').children,
    ids: () => $('cards').children.map(row => Number(row.dataset.itemId)),
    click: id => $(id).dispatch('click'),
    input: (id, value) => { $(id).value = value; $(id).dispatch('input'); },
    status: (id, value) => { $(`item-status-${id}`).value = value; $(`item-status-${id}`).dispatch('change'); },
    action: id => { const row = $('cards').children.find(x => Number(x.dataset.itemId) === id); assert.ok(row); row.children[2].children[1].dispatch('click'); },
    submit: (title, author = '') => { $('title').value = title; $('author').value = author; $('add').dispatch('submit'); },
    saved: () => JSON.parse(stored.get('reading-list'))
  };
}

let checks = 0;
function test(name, run) {
  run();
  checks += 1;
  console.log(`PASS ${name}`);
}

test('initial collection, full long title, labelled native status controls', () => {
  const a = boot();
  assert.deepEqual(a.ids(), [1, 2, 3, 4]);
  assert.equal(a.$('active-count').textContent, '4');
  assert.equal(a.$('archive-count').textContent, '1');
  assert.equal(a.$('active').getAttribute('aria-pressed'), 'true');
  assert.equal(a.$('item-title-4').textContent, ReadingModel.seed[3].title);
  const select = a.$('item-status-1');
  assert.equal(select.tagName, 'SELECT');
  assert.equal(select.getAttribute('aria-label'), 'Reading status for Designing Data-Intensive Applications');
  assert.deepEqual(select.children.map(x => x.value), ['queued', 'reading', 'finished']);
  assert.deepEqual(select.children.map(x => x.textContent), ['To read', 'Reading', 'Finished']);
});

test('case-insensitive title/author search, status counts, and clearing', () => {
  const a = boot();
  a.input('search', '  MARTIN  ');
  assert.deepEqual(a.ids(), [1]);
  assert.equal(a.$('count').textContent, '1 of 4 items');
  assert.equal(a.$('filter-count-reading').textContent, '1');
  a.click('clear-search');
  assert.equal(a.rows().length, 4);
  assert.equal(a.document.activeElement.id, 'search');
  a.click('filter-queued');
  assert.deepEqual(a.ids(), [2, 4]);
  a.status(2, 'finished');
  assert.deepEqual(a.ids(), [4]);
  assert.equal(a.document.activeElement.id, 'filter-queued');
  assert.equal(a.saved().find(x => x.id === 2).status, 'finished');
  assert.match(a.$('message').textContent, /hidden by the current filter/);
});

test('status changes preserve focus when the item remains visible', () => {
  const a = boot();
  a.status(1, 'finished');
  assert.equal(a.$('item-status-1').value, 'finished');
  assert.equal(a.document.activeElement.id, 'item-status-1');
  assert.equal(a.$('filter-count-reading').textContent, '0');
  assert.equal(a.$('filter-count-finished').textContent, '2');
});

test('archive, next-row focus, undo, restore, and retained status', () => {
  const a = boot();
  a.status(1, 'finished');
  a.action(1);
  assert.deepEqual(a.ids(), [2, 3, 4]);
  assert.equal(a.saved().find(x => x.id === 1).archived, true);
  assert.equal(a.document.activeElement.getAttribute('aria-label'), `Archive ${ReadingModel.seed[1].title}`);
  assert.equal(a.$('undo').hidden, false);
  a.click('undo');
  assert.deepEqual(a.ids(), [1, 2, 3, 4]);
  assert.equal(a.$('item-status-1').value, 'finished');
  assert.equal(a.document.activeElement.id, 'item-title-1');
  a.action(1);
  a.click('archive');
  assert.deepEqual(a.ids(), [1, 5]);
  assert.equal(a.$('search-label').textContent, 'Search archive');
  a.action(1);
  assert.deepEqual(a.ids(), [5]);
  assert.equal(a.saved().find(x => x.id === 1).archived, false);
  assert.equal(a.saved().find(x => x.id === 1).status, 'finished');
  a.click('undo');
  assert.equal(a.$('archive').getAttribute('aria-pressed'), 'true');
  assert.deepEqual(a.ids(), [1, 5]);
  assert.equal(a.document.activeElement.id, 'item-title-1');
});

test('collections retain their own search and status selection', () => {
  const a = boot();
  a.input('search', 'design');
  a.click('filter-finished');
  assert.deepEqual(a.ids(), [3]);
  a.click('archive');
  a.input('search', 'notes');
  a.click('active');
  assert.equal(a.$('search').value, 'design');
  assert.equal(a.$('filter-finished').getAttribute('aria-pressed'), 'true');
  assert.deepEqual(a.ids(), [3]);
  a.click('archive');
  assert.equal(a.$('search').value, 'notes');
  assert.deepEqual(a.ids(), [5]);
});

test('inline form opens with focus, validates, retains drafts, and closes with Escape', () => {
  const a = boot();
  a.click('open-add');
  assert.equal(a.$('add-panel').hidden, false);
  assert.equal(a.$('open-add').getAttribute('aria-expanded'), 'true');
  assert.equal(a.document.activeElement.id, 'title');
  a.submit('   ', 'A retained author');
  assert.equal(a.rows().length, 4);
  assert.equal(a.$('notice').textContent, 'Enter a title.');
  assert.equal(a.$('title').getAttribute('aria-invalid'), 'true');
  assert.equal(a.$('title').getAttribute('aria-describedby'), 'notice');
  assert.equal(a.document.activeElement.id, 'title');
  a.input('title', 'A retained draft');
  assert.equal(a.$('title').getAttribute('aria-invalid'), null);
  a.click('cancel-add');
  assert.equal(a.$('add-panel').hidden, true);
  assert.equal(a.document.activeElement.id, 'open-add');
  a.click('open-add');
  assert.equal(a.$('title').value, 'A retained draft');
  assert.equal(a.$('author').value, 'A retained author');
  const event = a.$('add').dispatch('keydown', { key: 'Escape' });
  assert.equal(event.defaultPrevented, true);
  assert.equal(a.$('add-panel').hidden, true);
  assert.equal(a.document.activeElement.id, 'open-add');
});

test('adding from a filtered archive reveals the new item and treats input as text', () => {
  const a = boot();
  a.click('archive');
  a.input('search', 'notes');
  a.click('filter-finished');
  a.click('open-add');
  const title = '<img src=x onerror=alert(1)> A very long new article';
  a.submit(`  ${title}  `, '');
  assert.equal(a.$('active').getAttribute('aria-pressed'), 'true');
  assert.equal(a.$('search').value, '');
  assert.equal(a.$('filter-all').getAttribute('aria-pressed'), 'true');
  assert.equal(a.rows().length, 5);
  assert.equal(a.$('item-title-6').textContent, title);
  assert.equal(a.created.some(node => node.tagName === 'IMG'), false);
  assert.equal(a.$('item-status-6').value, 'queued');
  assert.equal(a.$('title').value, '');
  assert.equal(a.$('author').value, '');
  assert.equal(a.$('add-panel').hidden, true);
  assert.equal(a.document.activeElement.id, 'item-title-6');
  assert.equal(a.rows().at(-1).children[1].children[1].textContent, 'No author added');
  assert.equal(a.saved().find(row => row.id === 6).title, title);
});

test('no matches, empty list/archive, and last-item removal have recovery paths', () => {
  const a = boot();
  a.input('search', 'no title matches this');
  assert.equal(a.rows().length, 0);
  assert.equal(a.$('empty-state').hidden, false);
  assert.equal(a.$('empty-heading').textContent, 'No matching reads');
  a.click('empty-action');
  assert.equal(a.rows().length, 4);
  assert.equal(a.document.activeElement.id, 'search');
  const empty = boot([]);
  assert.equal(empty.rows().length, 0);
  assert.equal(empty.$('empty-heading').textContent, 'Your next read starts here');
  empty.click('empty-action');
  assert.equal(empty.$('add-panel').hidden, false);
  empty.submit('Only read');
  empty.action(1);
  assert.equal(empty.rows().length, 0);
  assert.equal(empty.document.activeElement.id, 'heading');
  empty.click('archive');
  empty.action(1);
  assert.equal(empty.$('empty-heading').textContent, 'Your archive is empty');
  empty.click('empty-action');
  assert.equal(empty.$('active').getAttribute('aria-pressed'), 'true');
  assert.equal(empty.rows().length, 1);
});

test('saved data reloads without replacing it with demonstration content', () => {
  const a = boot([]);
  a.submit('Personal article', 'My author');
  a.status(1, 'reading');
  a.action(1);
  const reload = boot(a.saved());
  assert.equal(reload.rows().length, 0);
  reload.click('archive');
  assert.deepEqual(reload.ids(), [1]);
  assert.equal(reload.$('item-title-1').textContent, 'Personal article');
  assert.equal(reload.$('item-status-1').value, 'reading');
});

test('failed saves preserve in-memory work and a retry saves the same state', () => {
  const a = boot([], { throwWrite: true });
  a.submit('Unsaved article');
  assert.equal(a.rows().length, 1);
  assert.equal(a.$('storage-warning').hidden, false);
  assert.equal(a.$('retry-save').hidden, false);
  assert.equal(a.$('storage-state').textContent, 'Not saved in this browser');
  assert.deepEqual(a.saved(), []);
  a.options.throwWrite = false;
  a.click('retry-save');
  assert.equal(a.saved()[0].title, 'Unsaved article');
  assert.equal(a.$('storage-warning').hidden, true);
  assert.equal(a.$('storage-state').textContent, 'Saved in this browser');
  assert.equal(a.document.activeElement.id, 'heading');
});

test('unavailable storage and malformed data do not crash or overwrite original data', () => {
  const priorData = JSON.stringify([{ id: 9, title: 'Prior saved work', author: '', status: 'reading', archived: false }]);
  const unavailable = boot(priorData, { throwRead: true, throwWrite: false });
  assert.equal(unavailable.rows().length, 4);
  assert.equal(unavailable.$('storage-warning').hidden, false);
  unavailable.submit('Still works in this tab');
  assert.equal(unavailable.rows().length, 5);
  assert.equal(unavailable.stored.get('reading-list'), priorData);
  for (const bad of ['{broken-json', '{"not":"an array"}', '[{"id":1}]']) {
    const a = boot(bad);
    assert.equal(a.rows().length, 4);
    assert.match(a.$('storage-warning-text').textContent, /original data is unchanged/);
    a.submit('Temporary item');
    assert.equal(a.rows().length, 5);
    assert.equal(a.stored.get('reading-list'), bad);
    assert.equal(a.$('retry-save').hidden, true);
  }
});

console.log(`${checks} programmatic application checks passed. No browser layout, keyboard traversal, or assistive-technology checks were performed.`);

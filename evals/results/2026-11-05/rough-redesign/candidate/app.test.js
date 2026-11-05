// Programmatic interaction checks using a small DOM double; this does not render a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ReadingModel = require('./model.js');

class Element {
  constructor(tag, document) {
    this.tagName = tag.toLowerCase();
    this.document = document;
    this.children = [];
    this.attributes = {};
    this._text = '';
    this._value = '';
    this.hidden = false;
  }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this._text = ''; this.children = children; }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
  set id(value) { this.attributes.id = String(value); }
  get id() { return this.attributes.id; }
  set value(value) {
    this._value = value;
    if (this.tagName === 'select') this.children.forEach(child => { child.selected = child.value === value; });
  }
  get value() {
    return this.tagName === 'select' ? (this.children.find(child => child.selected) || this.children[0])?.value : this._value;
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  removeAttribute(name) { delete this.attributes[name]; }
  querySelectorAll(selector) {
    const match = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);
    if (!match) throw new Error(`Unsupported test selector: ${selector}`);
    const found = [];
    function visit(node) {
      for (const child of node.children) {
        if (child.getAttribute(match[1]) !== null && (match[2] === undefined || child.getAttribute(match[1]) === match[2])) found.push(child);
        visit(child);
      }
    }
    visit(this);
    return found;
  }
  focus() { this.document.activeElement = this; }
  scrollIntoView() {}
  click() { this.onclick?.({ preventDefault() {} }); }
}

function boot({ stored = null, hash = '', failRead = false, failWrite = false } = {}) {
  const document = { activeElement: null };
  document.createElement = tag => new Element(tag, document);
  document.createElementNS = (_, tag) => document.createElement(tag);
  document.root = document.createElement('document');
  document.getElementById = id => {
    const visit = node => node.id === id ? node : node.children.map(visit).find(Boolean);
    return visit(document.root);
  };
  // Only enough HTML parsing to build the static element tree used by this app.
  const stack = [document.root];
  const voidTags = new Set(['meta', 'link', 'input', 'br']);
  for (const match of fs.readFileSync('index.html', 'utf8').matchAll(/<(\/?)([a-z][a-z0-9-]*)([^>]*)>/gi)) {
    const [, closing, tag, attributeText] = match;
    if (closing) { if (stack.length > 1) stack.pop(); continue; }
    const node = document.createElement(tag);
    for (const attribute of attributeText.matchAll(/([\w-]+)(?:="([^"]*)")?/g)) {
      node.setAttribute(attribute[1], attribute[2] ?? '');
      if (attribute[1] === 'hidden') node.hidden = true;
    }
    stack.at(-1).append(node);
    if (!voidTags.has(tag.toLowerCase())) stack.push(node);
  }
  const events = {};
  const window = {
    location: { hash },
    history: { replaceState: (_, __, nextHash) => { window.location.hash = nextHash; } },
    addEventListener: (event, handler) => { events[event] = handler; }
  };
  const store = { value: stored, failWrite, writes: 0 };
  const localStorage = {
    getItem() { if (failRead) throw new Error('Access denied'); return store.value; },
    setItem(_, value) { if (store.failWrite) throw new Error('Quota exceeded'); store.value = value; store.writes++; }
  };
  vm.runInNewContext(fs.readFileSync('app.js', 'utf8'), { document, window, localStorage, ReadingModel });
  const $ = id => document.getElementById(id);
  return {
    $, document, store, window,
    rows: () => $('cards').children,
    data: () => JSON.parse(store.value),
    search(query) { $('search').value = query; $('search').oninput(); },
    filter(status) { $('filters').querySelectorAll('[data-filter]').find(button => button.getAttribute('data-filter') === status).click(); },
    view(nextHash) { window.location.hash = nextHash; events.hashchange(); },
    add(title, author = '') { $('title').value = title; $('author').value = author; $('add').onsubmit({ preventDefault() {} }); }
  };
}

const app = boot();
assert.equal(app.rows().length, 4);
assert.equal(app.$('active-count').textContent, '4');
assert.equal(app.$('archive-count').textContent, '1');
assert.ok(app.$('cards').textContent.includes(ReadingModel.seed[3].title), 'Full long title is retained in the DOM');
app.search('kLePpMaNn');
assert.equal(app.rows().length, 1);
app.$('clear-search').click();
assert.equal(app.rows().length, 4);
assert.equal(app.document.activeElement.id, 'search');
app.filter('queued');
assert.equal(app.rows().length, 2);
const status = app.$('status-4');
status.value = 'reading';
status.onchange();
assert.equal(app.rows().length, 1, 'Changing status removes a read from the active status filter');
assert.equal(app.data().find(read => read.id === 4).status, 'reading');
assert.equal(app.document.activeElement.id, 'status-2', 'Focus moves to a remaining row after a filtered item disappears');
app.$('archive-2').click();
assert.equal(app.rows().length, 0);
assert.equal(app.$('empty-state').hidden, false);
assert.equal(app.$('undo').hidden, false);
assert.equal(app.$('active-count').textContent, '3');
assert.equal(app.data().find(read => read.id === 2).archived, true);
app.$('undo').click();
assert.equal(app.rows().length, 1);
assert.equal(app.data().find(read => read.id === 2).archived, false);
app.view('#archive');
assert.equal(app.rows().length, 1);
assert.equal(app.$('archive').getAttribute('aria-current'), 'page');
assert.equal(app.$('search-label').textContent, 'Search titles or authors in your archive');
app.$('archive-5').click();
assert.equal(app.rows().length, 0);
assert.equal(app.data().find(read => read.id === 5).archived, false);
assert.equal(app.$('empty-title').textContent, 'Nothing tucked away yet');
app.add('   ', 'Keep this author');
assert.equal(app.$('notice').textContent, 'Enter a title.');
assert.equal(app.$('title').getAttribute('aria-invalid'), 'true');
assert.equal(app.$('author').value, 'Keep this author');
app.search('unmatched query');
app.add('  <img src=x onerror=alert(1)> A new read  ');
assert.equal(app.window.location.hash, '#reading-list');
assert.equal(app.$('search').value, '');
assert.equal(app.$('title').value, '');
assert.equal(app.$('notice').hidden, true);
assert.equal(app.rows().length, 6);
assert.equal(app.document.activeElement.id, 'title');
const newRead = app.data().find(read => read.title.endsWith('A new read'));
assert.equal(newRead.author, '');
assert.equal(newRead.status, 'queued');
assert.equal(app.$(`read-title-${newRead.id}`).children.length, 0, 'User text is not parsed as HTML');
assert.equal(boot({ stored: app.store.value }).rows().length, 6, 'Saved data reloads');
app.search('nothing matches');
assert.equal(app.$('empty-title').textContent, 'No reads found');
app.$('empty-action').click();
assert.equal(app.rows().length, 6);
const empty = boot({ stored: '[]' });
assert.equal(empty.rows().length, 0, 'A saved empty list is not replaced by sample content');
assert.equal(empty.$('empty-title').textContent, 'A fresh page');
empty.$('empty-action').click();
assert.equal(empty.document.activeElement.id, 'title');
const unavailable = boot({ failWrite: true });
unavailable.add('Kept in this session');
assert.equal(unavailable.rows().length, 5);
assert.equal(unavailable.$('storage-notice').hidden, false);
assert.equal(unavailable.store.writes, 0);
const corrupt = boot({ stored: '{broken' });
assert.equal(corrupt.$('storage-notice').hidden, false);
corrupt.add('Session entry');
assert.equal(corrupt.store.value, '{broken', 'Unreadable existing data is not overwritten');
assert.equal(corrupt.rows().length, 5);
assert.equal(boot({ failRead: true }).$('storage-notice').hidden, false);
assert.equal(boot({ hash: '#archive' }).rows().length, 1, 'Archive supports direct entry');
console.log('App interaction checks pass: search, filtering, status, add validation, safe text, archive/restore/undo, focus targets, direct entry, persistence reload, empty data, and storage failures.');
console.log('Method: Node VM with a DOM double. Browser rendering, real keyboard behavior, and assistive technology are not covered.');

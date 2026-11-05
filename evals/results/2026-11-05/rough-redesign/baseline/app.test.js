'use strict';
// Executes the actual application handlers with a small DOM/storage harness.
// This does not render CSS or exercise browser layout, native input, or assistive technology.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ReadingModel = require('./model.js');
const html = fs.readFileSync('index.html', 'utf8');
const source = fs.readFileSync('app.js', 'utf8');

function setup({stored, getThrows = false, setThrows = false} = {}) {
  const elements = [];
  const byId = new Map();
  let focused = null;
  class Element {
    constructor(tag) {
      this.tagName = tag.toUpperCase();
      this.children = [];
      this.attributes = {};
      this.handlers = {};
      this.hidden = false;
      this.className = '';
      this._value = '';
      this._text = '';
      this.selected = false;
      this.dataset = new Proxy({}, {set(object, key, value) {object[key] = String(value); return true;}});
      this.classList = {toggle:(name, force) => {
        const names = new Set(this.className.split(/\s+/).filter(Boolean));
        const add = force === undefined ? !names.has(name) : force;
        if (add) names.add(name); else names.delete(name);
        this.className = Array.from(names).join(' ');
      }};
    }
    get value() {return this.tagName === 'SELECT' && !this._value ? (this.children.find(option => option.selected) || this.children[0])?.value || '' : this._value;}
    set value(value) {this._value = String(value);}
    set textContent(value) {this._text = String(value); this.children = [];}
    get textContent() {return this._text + this.children.map(child => child.textContent).join('');}
    setAttribute(name, value) {this.attributes[name] = String(value); if (name === 'id') this.id = String(value); if (name === 'class') this.className = String(value);}
    getAttribute(name) {return this.attributes[name] ?? null;}
    removeAttribute(name) {delete this.attributes[name];}
    append(...children) {this.children.push(...children);}
    replaceChildren(...children) {this._text = ''; this.children = [...children];}
    addEventListener(name, handler) {(this.handlers[name] ||= []).push(handler);}
    dispatch(name, extras = {}) {
      const event = {target:this, preventDefault() {this.defaultPrevented = true;}, ...extras};
      if (this[`on${name}`]) this[`on${name}`](event);
      for (const handler of this.handlers[name] || []) handler(event);
      return event;
    }
    focus() {focused = this;}
    matches(selector) {return selector.startsWith('.') ? this.className.split(/\s+/).includes(selector.slice(1)) : selector.startsWith('#') ? this.id === selector.slice(1) : this.tagName === selector.toUpperCase();}
    querySelectorAll(selector) {return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]);}
  }
  for (const match of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*)>/gi)) {
    const element = new Element(match[1]);
    for (const attr of match[2].matchAll(/([\w-]+)="([^"]*)"/g)) element.setAttribute(attr[1], attr[2]);
    element.hidden = /(?:^|\s)hidden(?:\s|$)/.test(match[2]);
    elements.push(element);
    if (element.id) {
      assert(!byId.has(element.id), `Duplicate static ID: ${element.id}`);
      byId.set(element.id, element);
    }
  }
  const storage = new Map(stored === undefined ? [] : [['reading-list', typeof stored === 'string' ? stored : JSON.stringify(stored)]]);
  const localStorage = {
    getItem:key => {if (getThrows) throw new Error('Storage blocked'); return storage.get(key) ?? null;},
    setItem:(key, value) => {if (setThrows) throw new Error('Quota exceeded'); storage.set(key, value);}
  };
  const document = {getElementById:id => byId.get(id), createElement:tag => new Element(tag), createElementNS:(_ns,tag) => new Element(tag), querySelector:selector => elements.find(element => element.matches(selector))};
  vm.runInNewContext(source, {document, localStorage, ReadingModel, console});
  const $ = id => byId.get(id);
  const click = id => $(id).dispatch('click');
  const query = value => {$('search').value = value; $('search').dispatch('input');};
  const rows = () => $('cards').querySelectorAll('article');
  const controls = kind => $('cards').querySelectorAll(kind);
  return {$, click, query, rows, controls, stored:() => JSON.parse(storage.get('reading-list') || 'null'), focused:() => focused, allowSaving:() => {setThrows = false;}};
}

let checks = 0;
function check(name, fn) {fn(); checks++; console.log(`PASS: ${name}`);}

check('Original data, full titles, status labels, and archive counts remain available', () => {
  const app = setup();
  assert.equal(app.rows().length, 4);
  assert.equal(app.$('archive-count').textContent, '1');
  assert(app.rows().some(row => row.textContent.includes(ReadingModel.seed[3].title)));
  assert.equal(app.controls('select')[0].value, 'reading');
  assert.equal(app.controls('select')[0].getAttribute('aria-label'), `Reading status for ${ReadingModel.seed[0].title}`);
  app.click('archive');
  assert.equal(app.rows().length, 1);
  assert.equal(app.$('archive').getAttribute('aria-pressed'), 'true');
  assert.equal(app.$('search').placeholder, 'Search the archive…');
});

check('Search is case-insensitive, matches authors, stays scoped, and has clear recovery', () => {
  const app = setup();
  app.query('MARTIN');
  assert.equal(app.rows().length, 1);
  app.click('archive');
  assert.equal(app.rows().length, 0);
  assert.equal(app.$('empty').hidden, false);
  assert(app.$('empty-copy').textContent.includes('your archive'));
  assert.equal(app.$('search').value, 'MARTIN');
  app.click('empty-action');
  assert.equal(app.rows().length, 1);
  assert.equal(app.$('search').value, '');
  assert.equal(app.focused(), app.$('search'));
});

check('Add validates a title, retains entered author, clears corrected error, and persists a queued read', () => {
  const app = setup();
  app.click('open-add');
  assert.equal(app.$('add-panel').hidden, false);
  assert.equal(app.$('open-add').getAttribute('aria-expanded'), 'true');
  assert.equal(app.focused(), app.$('title'));
  app.$('title').value = '   ';
  app.$('author').value = 'New author';
  app.$('add').dispatch('submit');
  assert.equal(app.$('title').getAttribute('aria-invalid'), 'true');
  assert.equal(app.$('title-error').textContent, 'Enter a title.');
  assert.equal(app.$('author').value, 'New author');
  assert.equal(app.stored(), null);
  app.$('title').value = '  A new read  ';
  app.$('title').dispatch('input');
  assert.equal(app.$('title').getAttribute('aria-invalid'), null);
  app.$('add').dispatch('submit');
  assert.equal(app.rows().length, 5);
  assert.equal(app.$('add-panel').hidden, true);
  assert.equal(app.$('title').value, '');
  assert.equal(app.$('author').value, '');
  assert.equal(app.focused(), app.$('open-add'));
  assert.deepEqual(app.stored().at(-1), {id:6,title:'A new read',author:'New author',status:'queued',archived:false});
  assert.equal(setup({stored:app.stored()}).rows().length, 5);
});

check('Cancelling and Escape keep the draft and target focus back to its opener', () => {
  const app = setup();
  app.click('open-add');
  app.$('title').value = 'A draft';
  app.click('cancel-add');
  assert.equal(app.$('add-panel').hidden, true);
  assert.equal(app.$('title').value, 'A draft');
  assert.equal(app.focused(), app.$('open-add'));
  app.click('open-add');
  const event = app.$('add-panel').dispatch('keydown', {key:'Escape'});
  assert.equal(event.defaultPrevented, true);
  assert.equal(app.$('add-panel').hidden, true);
  assert.equal(app.$('title').value, 'A draft');
});

check('Adding from a searched archive reveals the new item in the reading list', () => {
  const app = setup();
  app.click('archive');
  app.query('notes');
  app.click('open-add');
  app.$('title').value = 'A saved article';
  app.$('add').dispatch('submit');
  assert.equal(app.$('active').getAttribute('aria-pressed'), 'true');
  assert.equal(app.$('search').value, '');
  assert.equal(app.rows().length, 5);
  assert.equal(app.stored().at(-1).author, '');
});

check('Reading status updates and reloads without replacing the focused select', () => {
  const app = setup();
  const select = app.controls('select')[0];
  select.focus();
  select.value = 'finished';
  select.dispatch('change');
  assert.equal(app.stored()[0].status, 'finished');
  assert.equal(app.focused(), select);
  assert.equal(app.controls('select')[0], select);
  assert.equal(app.$('reading-summary').textContent, 'One good read at a time.');
  assert.equal(setup({stored:app.stored()}).controls('select')[0].value, 'finished');
});

check('Archive, restore, and undo persist correctly and set an explicit focus continuation', () => {
  const app = setup();
  app.controls('.archive-button')[0].dispatch('click');
  assert.equal(app.rows().length, 3);
  assert.equal(app.stored()[0].archived, true);
  assert.equal(app.$('archive-count').textContent, '2');
  assert.equal(app.$('undo').hidden, false);
  assert.equal(app.focused(), app.controls('.archive-button')[0]);
  app.click('undo');
  assert.equal(app.rows().length, 4);
  assert.equal(app.stored()[0].archived, false);
  assert.equal(app.focused().dataset.itemId, '1');
  app.click('archive');
  app.controls('.archive-button')[0].dispatch('click');
  assert.equal(app.rows().length, 0);
  assert.equal(app.$('empty-title').textContent, 'Your archive is empty');
  assert.equal(app.focused(), app.$('heading'));
  assert.equal(app.stored()[4].archived, false);
  app.click('undo');
  assert.equal(app.rows().length, 1);
  assert.equal(app.stored()[4].archived, true);
});

check('An intentionally empty stored list stays empty and can be populated', () => {
  const app = setup({stored:[]});
  assert.equal(app.rows().length, 0);
  assert.equal(app.$('empty-title').textContent, 'A new chapter starts here');
  app.click('empty-action');
  assert.equal(app.$('add-panel').hidden, false);
  app.$('title').value = '<img src=x onerror=alert(1)>';
  app.$('add').dispatch('submit');
  assert.equal(app.rows().length, 1);
  assert(app.rows()[0].textContent.includes('<img src=x onerror=alert(1)>'));
  assert.equal(app.rows()[0].querySelectorAll('img').length, 0);
});

check('Storage write failures retain the change, explain its state, and support retry', () => {
  const app = setup({setThrows:true});
  app.click('open-add');
  app.$('title').value = 'Keep this read';
  app.$('add').dispatch('submit');
  assert.equal(app.rows().length, 5);
  assert.equal(app.stored(), null);
  assert.equal(app.$('storage-warning').hidden, false);
  assert(app.$('storage-message').textContent.includes('Keep this page open'));
  app.allowSaving();
  app.click('retry-save');
  assert.equal(app.$('storage-warning').hidden, true);
  assert.equal(app.stored().at(-1).title, 'Keep this read');
});

check('Malformed, wrong-shaped, and inaccessible storage render a recoverable warning', () => {
  for (const options of [{stored:'not JSON'}, {stored:'{}'}, {stored:[{}]}, {getThrows:true}]) {
    const app = setup(options);
    assert.equal(app.rows().length, 4);
    assert.equal(app.$('storage-warning').hidden, false);
  }
});

console.log(`${checks} application checks passed in the DOM/storage harness. Real browser rendering, keyboard behavior, and assistive technology remain unverified.`);

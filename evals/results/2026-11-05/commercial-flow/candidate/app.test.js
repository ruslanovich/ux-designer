/* Dependency-free event-handler tests. This simulated DOM does not render CSS,
   emulate native keyboard traversal, or verify assistive-technology output. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { create } = require('./model.js');

function setup() {
  const ids = new Map();
  const downloads = [];
  const blobs = [];
  const revoked = [];
  const document = { activeElement: null };
  class Node {
    constructor(tag = '#text', text = '') {
      this.tagName = tag.toUpperCase(); this.children = []; this.parentNode = null;
      this.attributes = {}; this.dataset = {}; this._text = text; this.hidden = false;
      this.checked = false; this.disabled = false; this.indeterminate = false;
    }
    set id(value) { this.attributes.id = value; if (value) ids.set(value, this); }
    get id() { return this.attributes.id || ''; }
    set value(value) { this._value = String(value); }
    get value() {
      if (this._value !== undefined) return this._value;
      if (this.tagName === 'SELECT') return this.children.find(c => c.tagName === 'OPTION')?.value || '';
      return this.attributes.value || '';
    }
    get textContent() { return this._text + this.children.map(c => c.textContent).join(''); }
    set textContent(text) { this.replaceChildren(); this._text = String(text); }
    append(...nodes) { for (let node of nodes) { if (typeof node === 'string') node = new Node('#text', node); node.parentNode = this; this.children.push(node); } }
    add(node) { this.append(node); }
    replaceChildren(...nodes) { for (const child of this.children) child.removeTree(); this.children = []; this._text = ''; this.append(...nodes); }
    removeTree() { for (const child of this.children) child.removeTree(); if (ids.get(this.id) === this) ids.delete(this.id); this.parentNode = null; }
    remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(c => c !== this); this.removeTree(); }
    setAttribute(name, value) { if (name === 'id') this.id = String(value); else { this.attributes[name] = String(value); if (name.startsWith('data-')) this.dataset[name.slice(5)] = String(value); } }
    getAttribute(name) { return this.attributes[name] ?? null; }
    removeAttribute(name) { delete this.attributes[name]; }
    focus() { document.activeElement = this; }
    scrollIntoView() { this.scrolledIntoView = true; }
    click() { if (this.tagName === 'A') downloads.push({ href: this.href, download: this.download }); return this.onclick?.({ preventDefault() {} }); }
  }
  document.createElement = tag => new Node(tag);
  document.createTextNode = text => new Node('#text', text);
  document.getElementById = id => ids.get(id) || null;
  const root = new Node('html');
  const stack = [root];
  const voidTags = new Set(['meta', 'link', 'input', 'br', 'hr', 'img']);
  for (const token of fs.readFileSync('index.html', 'utf8').match(/<[^>]*>|[^<]+/g)) {
    if (token.startsWith('<!')) continue;
    if (token.startsWith('</')) { stack.pop(); continue; }
    if (token.startsWith('<')) {
      const tag = token.match(/^<([\w-]+)/)[1];
      const node = new Node(tag);
      for (const match of token.matchAll(/([\w-]+)(?:="([^"]*)")?/g)) {
        if (match.index < tag.length + 1) continue;
        node.setAttribute(match[1], match[2] || '');
        if (match[1] === 'hidden') node.hidden = true;
        if (match[1] === 'value') node.value = match[2];
      }
      stack.at(-1).append(node);
      if (tag === 'body') document.body = node;
      if (!voidTags.has(tag)) stack.push(node);
    } else stack.at(-1).append(new Node('#text', token));
  }
  document.activeElement = document.body;
  const model = create();
  const context = {
    document,
    ServiceModel: { create: () => model },
    Option: function(text, value) { const n = new Node('option', text); n.value = value; return n; },
    Blob,
    URL: { createObjectURL(blob) { blobs.push(blob); return 'blob:test-' + blobs.length; }, revokeObjectURL(url) { revoked.push(url); } },
    setTimeout: fn => { fn(); return 1; },
  };
  vm.runInNewContext(fs.readFileSync('app.js', 'utf8'), context, { filename: 'app.js' });
  const $ = id => document.getElementById(id);
  const click = id => { assert.ok($(id), 'Missing ' + id); $(id).click(); };
  const input = (id, value) => { $(id).value = value; $(id).oninput(); };
  const change = (id, value) => { $(id).value = value; $(id).onchange(); };
  const check = (id, checked = true) => { $(id).checked = checked; $(id).focus(); $(id).onchange(); };
  const submit = id => $(id).onsubmit({ preventDefault() {} });
  return { $, click, input, change, check, submit, document, model, downloads, blobs, revoked };
}

async function run() {
  let t = setup();
  assert.equal(t.$('rows').children.length, 4);
  assert.equal(t.$('count-draft').textContent, '1');
  assert.equal(t.$('count-waiting').textContent, '1');
  assert.ok(t.$('order-101').textContent.includes('intermittent sensor fault'));
  assert.equal(t.$('export').hidden, true);
  t.check('select-101');
  assert.equal(t.document.activeElement.id, 'select-101', 'Selection rerender preserves simulated focus');
  assert.equal(t.$('select-all').indeterminate, true);
  t.input('query', 'North');
  assert.equal(t.$('rows').children.length, 1);
  assert.match(t.$('selection-count').textContent, /1 outside/);
  assert.ok(t.$('selected-open-101'));
  t.check('select-all');
  assert.match(t.$('selection-heading').textContent, /2 work orders/);
  t.check('select-all', false);
  assert.match(t.$('selection-heading').textContent, /1 work order/);
  t.input('query', 'no match');
  assert.equal(t.$('empty-state').hidden, false);
  assert.equal(t.$('select-all').disabled, true);
  t.click('empty-clear');
  assert.equal(t.$('rows').children.length, 4);
  assert.equal(t.$('select-101').checked, true);
  t.click('order-101');
  assert.equal(t.document.activeElement.id, 'detail-title');
  assert.match(t.$('history-list').textContent, /Request received/);
  t.click('back-to-queue');
  assert.equal(t.document.activeElement.id, 'order-101');
  console.log('PASS finding, empty recovery, selection across filters, visible select-all, detail and simulated focus return');

  t = setup();
  t.input('query', 'North'); t.click('status-waiting');
  t.click('open-save-view'); t.submit('save-view-panel');
  assert.equal(t.$('view-name').getAttribute('aria-invalid'), 'true');
  assert.equal(t.document.activeElement.id, 'view-name');
  t.input('view-name', 'Access queue'); t.submit('save-view-panel');
  assert.deepEqual(t.model.views(), [{ name: 'Access queue', query: 'North', status: 'waiting' }]);
  assert.equal(t.document.activeElement.id, 'open-save-view');
  t.input('query', 'Acme');
  assert.equal(t.$('views').value, '');
  t.change('views', 'Access queue');
  assert.equal(t.$('query').value, 'North');
  assert.equal(t.$('status-waiting').getAttribute('aria-pressed'), 'true');
  t.input('query', 'Acme'); t.click('status-new');
  t.click('open-save-view'); t.submit('save-view-panel');
  assert.deepEqual(t.model.views(), [{ name: 'Access queue', query: 'Acme', status: 'new' }]);
  assert.match(t.$('result').textContent, /updated/);
  t.click('open-save-view'); t.input('view-name', 'Not saved');
  t.$('save-view-panel').onkeydown({ key: 'Escape', preventDefault() {} });
  assert.equal(t.$('save-view-panel').hidden, true);
  assert.equal(t.model.views().length, 1);
  console.log('PASS saved search/status, active-view changes, replacement, validation and cancellation');

  t = setup();
  t.check('select-101'); t.check('select-104');
  assert.equal(t.$('draft-warning').hidden, false);
  t.submit('assignment-panel');
  assert.equal(t.$('technician').getAttribute('aria-invalid'), 'true');
  assert.equal(t.document.activeElement.id, 'technician');
  assert.equal(t.model.detail(101).history.length, 1);
  t.click('status-new'); t.click('order-101');
  t.change('technician', 'Lee'); t.submit('assignment-panel');
  assert.equal(t.model.detail(101).status, 'scheduled');
  assert.equal(t.model.detail(104).status, 'draft');
  assert.equal(t.model.detail(102).assignee, 'Lee');
  assert.equal(t.model.detail(102).status, 'waiting');
  assert.match(t.$('result').textContent, /1 work order assigned · 1 could not be assigned/);
  assert.match(t.$('result').textContent, /#104: Complete the draft before assignment/);
  assert.ok(t.$('selected-open-104'));
  assert.equal(t.$('selected-open-101'), null);
  assert.match(t.$('history-list').textContent, /Assigned to Lee/);
  assert.equal(t.$('detail-context').hidden, false);
  assert.equal(t.document.activeElement.id, 'result');
  t.click('back-to-queue');
  assert.equal(t.document.activeElement.id, 'queue-heading');
  t.click('selected-open-104');
  assert.equal(t.$('detail-assign-form'), null);
  assert.match(t.$('detail-content').textContent, /Draft editing is unavailable/);
  console.log('PASS partial assignment, draft preservation, failed-selection retention and fresh detail/history');

  t = setup();
  t.check('select-103'); t.click('order-102');
  t.change('detail-technician', 'Sam'); t.submit('detail-assign-form');
  assert.equal(t.model.detail(102).assignee, 'Sam');
  assert.equal(t.model.detail(102).status, 'scheduled');
  assert.deepEqual(t.model.detail(102).history, ['Created', 'Waiting for access', 'Assigned to Sam']);
  assert.equal(t.$('select-103').checked, true);
  assert.match(t.$('history-list').textContent, /Waiting for accessAssigned to Sam/);
  const oldForm = t.$('detail-assign-form');
  t.change('detail-technician', 'Lee');
  t.change('role', 'technician');
  assert.equal(t.$('select-all-label').hidden, true);
  assert.equal(t.$('assignment-panel').hidden, true);
  assert.equal(t.$('detail-assign-form'), null);
  assert.equal(t.$('select-101'), null);
  assert.equal(t.$('role-notice').hidden, false);
  oldForm.onsubmit({ preventDefault() {} });
  assert.equal(t.model.detail(102).assignee, 'Sam', 'Stale form still obeys authoritative model permissions');
  assert.match(t.$('result').textContent, /role cannot assign/);
  t.click('export');
  assert.match(t.$('result').textContent, /Only admins can export/);
  assert.equal(t.downloads.length, 0);
  t.click('open-save-view'); t.input('view-name', 'Technician view'); t.submit('save-view-panel');
  assert.equal(t.model.views().length, 1);
  console.log('PASS individual reassignment, unchanged history, read-only role UI and model-enforced stale-action permissions');

  t = setup();
  t.input('query', 'Acme'); t.click('status-new');
  t.change('role', 'admin');
  assert.equal(t.$('export').hidden, false);
  assert.equal(t.$('query').value, 'Acme');
  assert.equal(t.$('status-new').getAttribute('aria-pressed'), 'true');
  assert.equal(t.$('rows').children.length, 1);
  t.click('export');
  assert.equal(t.downloads[0].download, 'work-orders.csv');
  assert.equal(t.blobs[0].type, 'text/csv;charset=utf-8');
  const csv = await t.blobs[0].text();
  assert.equal(csv, t.model.exportCSV('admin'));
  assert.equal(csv.split('\n').length, 5);
  assert.match(csv, /"104","West Studio"/);
  assert.deepEqual(t.revoked, ['blob:test-1']);
  assert.match(t.$('result').textContent, /Exported 4 work orders/);
  console.log('PASS admin CSV content, complete export scope, download name and object URL cleanup');
  console.log('Application event-handler checks pass in a simulated DOM. Browser rendering, native keyboard behavior and assistive technology are unverified.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });

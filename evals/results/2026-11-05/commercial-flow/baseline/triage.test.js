const assert = require('node:assert/strict');
const { test } = require('node:test');
const { create: createModel } = require('./model.js');
const { create: createTriage } = require('./triage.js');
const setup = input => { const model = createModel(input); return { model, triage: createTriage(model) }; };

test('all statuses, full titles, due and assignment context remain available', () => {
  const { triage } = setup();
  const state = triage.snapshot();
  assert.equal(state.records.length, 4);
  assert.deepEqual(state.counts, { all: 4, new: 1, waiting: 1, scheduled: 1, draft: 1 });
  assert.match(state.records[0].title, /intermittent sensor fault$/);
  assert.equal(state.records[0].due, 'Today');
  for (const [status, id] of [['waiting', 102], ['draft', 104]]) {
    triage.setFilters('', status);
    assert.deepEqual(triage.snapshot().records.map(r => r.id), [id]);
  }
});
test('search uses original ID, customer and title matching and empty recovery', () => {
  const { triage } = setup();
  for (const [query, ids] of [['ACME', [101, 103]], ['102', [102]], ['intermittent', [101]]]) {
    triage.setFilters(query, 'all');
    assert.deepEqual(triage.snapshot().records.map(r => r.id), ids);
  }
  triage.setFilters('missing', 'draft');
  assert.equal(triage.snapshot().records.length, 0);
  triage.setFilters('', 'all');
  assert.equal(triage.snapshot().records.length, 4);
});
test('filter changes retain selection and report orders outside results', () => {
  const { triage } = setup();
  triage.select(101, true);
  triage.select(102, true);
  triage.setFilters('North', 'waiting');
  assert.deepEqual(triage.snapshot().selectedIds, [101, 102]);
  assert.equal(triage.snapshot().hiddenSelected, 1);
  triage.selectVisible(false);
  assert.deepEqual(triage.snapshot().selectedIds, [101]);
  assert.equal(triage.snapshot().hiddenSelected, 1);
  triage.clearSelection();
  assert.equal(triage.snapshot().selectedIds.length, 0);
});
test('select visible adds only the matching set and preserves other selections', () => {
  const { triage } = setup();
  triage.select(102, true);
  triage.setFilters('Acme', 'all');
  triage.selectVisible(true);
  assert.deepEqual(triage.snapshot().selectedIds, [102, 101, 103]);
});
test('missing technician preserves selections and every record', () => {
  const { triage, model } = setup();
  triage.select(101, true);
  assert.throws(() => triage.assign(''), /Choose a technician/);
  assert.deepEqual(triage.snapshot().selectedIds, [101]);
  assert.equal(model.detail(101).status, 'new');
  assert.deepEqual(model.detail(101).history, ['Request received']);
});
test('mixed assignment schedules successes, retains failed drafts, and appends history', () => {
  const { triage, model } = setup();
  triage.select(101, true);
  triage.select(104, true);
  triage.setFilters('', 'draft');
  const results = triage.assign('Lee');
  assert.deepEqual(results, [{ id: 101, ok: true }, { id: 104, ok: false, error: 'Complete the draft before assignment' }]);
  assert.deepEqual(triage.snapshot().selectedIds, [104]);
  assert.equal(model.detail(101).status, 'scheduled');
  assert.equal(model.detail(101).assignee, 'Lee');
  assert.deepEqual(model.detail(101).history, ['Request received', 'Assigned to Lee']);
  assert.equal(model.detail(104).status, 'draft');
  assert.deepEqual(model.detail(104).history, ['Draft saved']);
});
test('waiting and previously scheduled work remain assignable under existing rules', () => {
  const { triage, model } = setup();
  triage.select(102, true);
  triage.select(103, true);
  assert.equal(triage.assign('Sam').every(r => r.ok), true);
  assert.equal(model.detail(102).status, 'scheduled');
  assert.equal(model.detail(102).history.at(-1), 'Assigned to Sam');
  assert.equal(triage.snapshot().selectedIds.length, 0);
});
test('saved views restore search/status and same-name replacement remains intact', () => {
  const { triage } = setup();
  triage.setFilters('North', 'waiting');
  triage.saveView(' Waiting ');
  triage.select(101, true);
  triage.setFilters('', 'all');
  assert.equal(triage.snapshot().activeView, '');
  triage.applyView('Waiting');
  assert.equal(triage.snapshot().query, 'North');
  assert.equal(triage.snapshot().status, 'waiting');
  assert.equal(triage.snapshot().activeView, 'Waiting');
  assert.deepEqual(triage.snapshot().selectedIds, [101]);
  triage.setFilters('Acme', 'scheduled');
  triage.saveView('Waiting');
  assert.deepEqual(triage.snapshot().views, [{ name: 'Waiting', query: 'Acme', status: 'scheduled' }]);
  assert.throws(() => triage.saveView(' '), /Name this view/);
  assert.equal(triage.applyView('missing'), false);
});
test('detail preserves queue context and returns current history', () => {
  const { triage } = setup();
  triage.setFilters('Acme', 'new');
  triage.select(101, true);
  triage.openDetail(101);
  assert.equal(triage.snapshot().detail.id, 101);
  triage.closeDetail();
  assert.equal(triage.snapshot().detail, null);
  assert.equal(triage.snapshot().query, 'Acme');
  assert.deepEqual(triage.snapshot().selectedIds, [101]);
  triage.assign('Sam');
  triage.openDetail(101);
  assert.equal(triage.snapshot().detail.history.at(-1), 'Assigned to Sam');
});
test('technician view is scoped, read-only, and cannot open another assignment', () => {
  const { triage, model } = setup();
  triage.select(101, true);
  triage.openDetail(101);
  triage.setRole('technician');
  let state = triage.snapshot();
  assert.equal(state.canEdit, false);
  assert.equal(state.canExport, false);
  assert.deepEqual(state.records.map(r => r.id), [102]);
  assert.deepEqual(state.selectedIds, []);
  assert.equal(state.detail, null);
  assert.throws(() => triage.select(102, true), /cannot assign/);
  assert.throws(() => triage.selectVisible(true), /cannot assign/);
  assert.throws(() => triage.openDetail(103), /unavailable/);
  assert.throws(() => triage.exportCSV(), /Only admins/);
  assert.throws(() => model.assign([102], 'Sam', 'technician'), /cannot assign/);
  triage.openDetail(102);
  triage.setViewer('Sam');
  state = triage.snapshot();
  assert.equal(state.detail, null);
  assert.deepEqual(state.records.map(r => r.id), [103]);
});
test('role changes preserve saved views and filters while clearing actor selection', () => {
  const { triage } = setup();
  triage.setFilters('Acme', 'all');
  triage.saveView('Acme');
  triage.select(101, true);
  triage.setRole('admin');
  assert.deepEqual(triage.snapshot().selectedIds, []);
  assert.equal(triage.snapshot().activeView, 'Acme');
  assert.equal(triage.snapshot().query, 'Acme');
  assert.equal(triage.snapshot().views.length, 1);
});
test('admin export includes all records beyond filters and valid CSV quoting', () => {
  const { triage, model } = setup();
  assert.throws(() => triage.exportCSV(), /Only admins/);
  triage.setRole('admin');
  triage.setFilters('North', 'waiting');
  const csv = triage.exportCSV();
  assert.equal(csv, model.exportCSV('admin'));
  assert.equal(csv.split('\n').length, 5);
  assert.match(csv, /"104","West Studio"/);
  const quoted = setup([{ id: 1, customer: 'A, "B"', title: 'One\nTwo', status: 'new', assignee: '', due: 'Today', history: [] }]).triage;
  quoted.setRole('admin');
  assert.match(quoted.exportCSV(), /"A, ""B""","One\nTwo"/);
});
test('empty assignment and invalid references cannot mutate state', () => {
  const { triage } = setup();
  assert.throws(() => triage.assign('Lee'), /Select at least one/);
  assert.throws(() => triage.select(999, true), /not found/);
  assert.throws(() => triage.openDetail(999), /unavailable/);
  assert.throws(() => triage.setRole('unknown'), /valid role/);
  assert.throws(() => triage.setFilters('', 'closed'), /valid status/);
  assert.equal(triage.snapshot().records.length, 4);
});

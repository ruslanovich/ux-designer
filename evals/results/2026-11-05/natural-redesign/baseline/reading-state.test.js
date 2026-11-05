'use strict';
const assert = require('node:assert/strict');
const {create} = require('./reading-state.js');
const {seed} = require('./model.js');
function storage(initial = null) {
  let value = initial;
  return {getItem: () => value, setItem: (_, next) => { value = next; }, value: () => value};
}
let checks = 0;
function test(name, run) { run(); checks++; console.log(`PASS ${name}`); }

test('existing saved data and empty saved lists remain intact', () => {
  const store = storage(JSON.stringify(seed));
  assert.deepEqual(create(store).all(), seed);
  assert.equal(create(storage('[]')).snapshot().rows.length, 0);
});
test('add validates title, trims input, allows an empty author, and shows the result', () => {
  const app = create(storage());
  assert.throws(() => app.add('   ', 'Author'), /Enter a title/);
  const before = app.all().length;
  app.search('nothing matches');
  app.filter('finished');
  app.switchView('archive');
  const added = app.add('  A new long article  ', '   ');
  assert.equal(app.all().length, before + 1);
  assert.equal(added.title, 'A new long article');
  assert.equal(added.author, '');
  assert.equal(added.status, 'queued');
  assert.equal(app.snapshot().view, 'reading');
  assert.equal(app.snapshot().query, '');
  assert.equal(app.snapshot().filter, 'all');
  assert.ok(app.snapshot().rows.some(row => row.id === added.id));
});
test('search matches title and author in the selected view', () => {
  const app = create(storage());
  app.search('  KLEPPMANN  ');
  assert.deepEqual(app.snapshot().rows.map(row => row.id), [1]);
  app.search('notes');
  assert.equal(app.snapshot().rows.length, 0);
  app.switchView('archive');
  app.search('notes');
  assert.deepEqual(app.snapshot().rows.map(row => row.id), [5]);
});
test('status filters compose with search and each view retains its own constraints', () => {
  const app = create(storage());
  app.search('design');
  app.filter('reading');
  assert.deepEqual(app.snapshot().rows.map(row => row.id), [1]);
  app.switchView('archive');
  assert.equal(app.snapshot().query, '');
  assert.equal(app.snapshot().filter, 'all');
  app.search('personal');
  app.filter('finished');
  app.switchView('reading');
  assert.equal(app.snapshot().query, 'design');
  assert.equal(app.snapshot().filter, 'reading');
  assert.equal(app.snapshot().counts.all, 2);
  assert.equal(app.snapshot().counts.finished, 1);
  app.clearFilters();
  assert.equal(app.snapshot().rows.length, 4);
});
test('status changes retain data, update filtered results, and survive reload', () => {
  const store = storage();
  const app = create(store);
  app.filter('reading');
  app.status(1, 'finished');
  assert.equal(app.snapshot().rows.length, 0);
  const reloaded = create(store);
  assert.equal(reloaded.all().find(row => row.id === 1).status, 'finished');
  assert.throws(() => app.status(1, 'unrecognised'), /Invalid status/);
});
test('archive, restore, and undo preserve reading status and recover the origin', () => {
  const store = storage();
  const app = create(store);
  app.search('kleppmann');
  app.filter('reading');
  app.archive(1);
  assert.equal(app.snapshot().rows.length, 0);
  assert.equal(app.snapshot().activeCount, 3);
  assert.equal(app.snapshot().archivedCount, 2);
  app.switchView('archive');
  const restoredByUndo = app.undo();
  assert.equal(restoredByUndo.id, 1);
  assert.equal(app.snapshot().view, 'reading');
  assert.equal(app.snapshot().query, 'kleppmann');
  assert.equal(app.snapshot().filter, 'reading');
  assert.equal(app.snapshot().rows[0].status, 'reading');
  app.archive(1);
  app.switchView('archive');
  app.archive(1);
  assert.equal(create(store).all().find(row => row.id === 1).archived, false);
  assert.equal(create(store).all().find(row => row.id === 1).status, 'reading');
  app.undo();
  assert.equal(app.snapshot().view, 'archive');
  assert.equal(app.all().find(row => row.id === 1).archived, true);
});
test('status remains editable in Archive', () => {
  const store = storage();
  const app = create(store);
  app.switchView('archive');
  app.status(5, 'reading');
  assert.equal(app.snapshot().rows[0].status, 'reading');
  app.archive(5);
  assert.equal(create(store).all().find(row => row.id === 5).status, 'reading');
});
test('failed writes retain the session and retry saves every pending change', () => {
  let fail = true;
  const store = storage(JSON.stringify(seed));
  const app = create({getItem: store.getItem, setItem: (key, value) => { if (fail) throw new Error('Quota'); store.setItem(key, value); }});
  const row = app.add('Saved after retry', 'Writer');
  app.status(row.id, 'reading');
  assert.equal(app.snapshot().storageState, 'error');
  assert.equal(app.all().find(item => item.id === row.id).status, 'reading');
  assert.deepEqual(JSON.parse(store.value()), seed);
  fail = false;
  assert.equal(app.retrySaving(), true);
  assert.equal(app.snapshot().storageState, 'ready');
  assert.equal(create(store).all().find(item => item.id === row.id).status, 'reading');
});
test('unreadable or invalid saved data is protected from overwrite', () => {
  for (const invalid of ['{bad', '{}', '[{"title":"incomplete"}]', JSON.stringify([seed[0], seed[0]])]) {
    const store = storage(invalid);
    const app = create(store);
    assert.equal(app.snapshot().storageState, 'blocked');
    app.add('Temporary read', '');
    assert.equal(app.retrySaving(), false);
    assert.equal(store.value(), invalid);
  }
  let writes = 0;
  const app = create({getItem: () => { throw new Error('Storage unavailable'); }, setItem: () => { writes++; }});
  app.add('Temporary read', '');
  assert.equal(writes, 0);
});
test('empty and no-result states expose accurate counts', () => {
  const app = create(storage('[]'));
  assert.equal(app.snapshot().counts.all, 0);
  assert.equal(app.snapshot().total, 0);
  app.add('One read', 'Author');
  app.search('missing');
  assert.equal(app.snapshot().rows.length, 0);
  assert.equal(app.snapshot().total, 1);
  app.clearFilters();
  assert.equal(app.snapshot().rows.length, 1);
});
console.log(`${checks} controller checks passed. No browser rendering or native input behavior was exercised.`);

(function (root) {
  'use strict';
  const Model = typeof module === 'object' ? require('./model.js') : root.ReadingModel;
  const key = 'reading-list';
  const statuses = ['queued', 'reading', 'finished'];
  function validRows(rows) {
    return Array.isArray(rows) && rows.every(row => row && Number.isSafeInteger(row.id) && row.id > 0 &&
      typeof row.title === 'string' && typeof row.author === 'string' && statuses.includes(row.status) &&
      typeof row.archived === 'boolean') && new Set(rows.map(row => row.id)).size === rows.length;
  }
  function create(storage) {
    let initial = Model.seed;
    let storageState = 'ready';
    let storageMessage = '';
    let usingExamples = true;
    try {
      const saved = storage.getItem(key);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (!validRows(parsed)) throw new Error('Unreadable list');
        initial = parsed;
        usingExamples = false;
      }
    } catch {
      storageState = 'blocked';
      storageMessage = 'Your saved list could not be opened. This is a temporary example list. Saving is paused to protect existing data. Allow browser storage, then reopen the app.';
    }
    const model = Model.create(initial);
    let view = 'reading';
    const views = {reading: {query: '', filter: 'all'}, archive: {query: '', filter: 'all'}};
    let feedback = '';
    let undoAction = null;
    function persist() {
      if (storageState === 'blocked') return false;
      try {
        storage.setItem(key, JSON.stringify(model.all()));
        storageState = 'ready';
        storageMessage = '';
        usingExamples = false;
        return true;
      } catch {
        storageState = 'error';
        storageMessage = 'Your changes are here, but could not be saved in this browser. Keep this page open and retry saving.';
        return false;
      }
    }
    function snapshot() {
      const all = model.all();
      const current = views[view];
      const matches = model.find(current.query.trim(), view === 'archive');
      const counts = {all: matches.length};
      statuses.forEach(status => { counts[status] = matches.filter(row => row.status === status).length; });
      return {
        view, ...current, rows: matches.filter(row => current.filter === 'all' || row.status === current.filter), counts,
        total: all.filter(row => row.archived === (view === 'archive')).length,
        activeCount: all.filter(row => !row.archived).length,
        archivedCount: all.filter(row => row.archived).length,
        storageState, storageMessage, usingExamples, feedback,
        canUndo: Boolean(undoAction), undoLabel: undoAction && (undoAction.wasArchived ? 'Undo restore' : 'Undo archive')
      };
    }
    return {
      snapshot,
      all: () => model.all(),
      switchView(next) { if (next !== 'reading' && next !== 'archive') throw new Error('Unknown collection'); view = next; },
      search(query) { views[view].query = query; },
      filter(value) { if (value !== 'all' && !statuses.includes(value)) throw new Error('Unknown filter'); views[view].filter = value; },
      clearFilters() { views[view] = {query: '', filter: 'all'}; },
      add(title, author) {
        const row = model.add(title, author);
        view = 'reading';
        views.reading = {query: '', filter: 'all'};
        undoAction = null;
        feedback = `“${row.title}” added to your reading list.`;
        persist();
        return row;
      },
      status(id, status) {
        model.status(id, status);
        undoAction = null;
        const row = model.all().find(item => item.id === id);
        const label = {queued: 'To read', reading: 'Reading', finished: 'Finished'}[status];
        feedback = `“${row.title}” marked as ${label}.`;
        persist();
      },
      archive(id) {
        const row = model.all().find(item => item.id === id);
        if (!row) throw new Error('Missing item');
        undoAction = {id, wasArchived: row.archived, view, ...views[view]};
        model.archive(id, !row.archived);
        feedback = row.archived ? `“${row.title}” restored to your reading list.` : `“${row.title}” moved to Archive.`;
        persist();
      },
      undo() {
        if (!undoAction) return null;
        const action = undoAction;
        model.archive(action.id, action.wasArchived);
        view = action.view;
        views[view] = {query: action.query, filter: action.filter};
        undoAction = null;
        const row = model.all().find(item => item.id === action.id);
        feedback = action.wasArchived ? `“${row.title}” returned to Archive.` : `“${row.title}” returned to your reading list.`;
        persist();
        return row;
      },
      retrySaving() {
        const saved = persist();
        if (saved) feedback = undoAction ? `${feedback} Saved in this browser.` : 'Your reading list is saved in this browser.';
        return saved;
      }
    };
  }
  const api = {create};
  if (typeof module === 'object') module.exports = api;
  else root.ReadingState = api;
})(typeof window === 'object' ? window : globalThis);

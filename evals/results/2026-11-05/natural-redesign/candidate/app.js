(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const statusLabels = { queued: 'To read', reading: 'Reading', finished: 'Finished' };
  const storageKey = 'reading-list';
  let storageLocked = false;
  let initial = ReadingModel.seed;
  let initialWarning = '';
  let loadedSavedList = false;

  function validSavedRows(value) {
    if (!Array.isArray(value)) return false;
    const ids = new Set();
    return value.every(row => {
      if (!row || !Number.isSafeInteger(row.id) || row.id < 1 || ids.has(row.id) ||
        typeof row.title !== 'string' || !row.title.trim() || typeof row.author !== 'string' ||
        !Object.hasOwn(statusLabels, row.status) || typeof row.archived !== 'boolean') return false;
      ids.add(row.id);
      return true;
    });
  }

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      try {
        const parsed = JSON.parse(stored);
        if (!validSavedRows(parsed)) throw new Error('Invalid saved list');
        initial = parsed;
        loadedSavedList = true;
      } catch {
        storageLocked = true;
        initialWarning = 'Your saved list could not be read. The original data is unchanged. This tab shows example items; changes here will not be saved.';
      }
    }
  } catch {
    storageLocked = true;
    initialWarning = 'Browser storage could not be read. This tab shows example items; changes here will not be saved or overwrite an existing list. Keep this tab open to retain any changes.';
  }

  const model = ReadingModel.create(initial);
  let archived = false;
  const viewState = {
    active: { query: '', status: 'all' },
    archive: { query: '', status: 'all' }
  };
  let rowsOnScreen = [];
  let rowControls = new Map();
  let lastArchiveAction = null;
  let emptyAction = null;
  const state = () => viewState[archived ? 'archive' : 'active'];
  const plural = count => `${count} ${count === 1 ? 'item' : 'items'}`;

  function storageWarning(message, canRetry = false) {
    $('storage-warning').hidden = false;
    $('storage-warning-text').textContent = message;
    $('retry-save').hidden = !canRetry;
    $('storage-state').textContent = 'Not saved in this browser';
    $('storage-state').classList.add('unsaved');
  }

  function persist() {
    if (storageLocked) return false;
    try {
      localStorage.setItem(storageKey, JSON.stringify(model.all()));
      $('storage-warning').hidden = true;
      $('retry-save').hidden = true;
      $('storage-state').textContent = 'Saved in this browser';
      $('storage-state').classList.remove('unsaved');
      return true;
    } catch {
      storageWarning('Your changes are still in this tab, but could not be saved in this browser. Keep this tab open and try saving again.', true);
      return false;
    }
  }

  function announce(message, undo = false) {
    $('feedback').hidden = false;
    $('message').textContent = message;
    $('undo').hidden = !undo;
    if (!undo) lastArchiveAction = null;
  }

  function setView(value, focusHeading = false) {
    archived = value;
    $('search').value = state().query;
    render();
    if (focusHeading) $('heading').focus();
  }

  function openForm() {
    $('add-panel').hidden = false;
    $('open-add').setAttribute('aria-expanded', 'true');
    $('title').focus();
  }

  function closeForm(returnFocus = true) {
    $('add-panel').hidden = true;
    $('open-add').setAttribute('aria-expanded', 'false');
    if (returnFocus) $('open-add').focus();
  }

  function clearTitleError() {
    $('notice').textContent = '';
    $('title').removeAttribute('aria-invalid');
  }

  function clearFilters() {
    state().query = '';
    state().status = 'all';
    $('search').value = '';
    render();
    $('search').focus();
  }

  function focusAfterRemoval(index) {
    const next = rowsOnScreen[Math.min(index, rowsOnScreen.length - 1)];
    if (next) rowControls.get(next.id).archive.focus();
    else $('heading').focus();
  }

  function buildItem(row, index) {
    const item = document.createElement('li');
    item.className = 'reading-item';
    item.dataset.status = row.status;
    item.dataset.itemId = String(row.id);

    const marker = document.createElement('span');
    marker.className = 'item-marker';
    marker.setAttribute('aria-hidden', 'true');
    marker.textContent = String(index + 1).padStart(2, '0');

    const copy = document.createElement('div');
    copy.className = 'item-copy';
    const title = document.createElement('h2');
    title.className = 'item-title';
    title.id = `item-title-${row.id}`;
    title.tabIndex = -1;
    title.textContent = row.title;
    const author = document.createElement('p');
    author.className = 'item-author';
    author.textContent = row.author || 'No author added';
    copy.append(title, author);

    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const statusControl = document.createElement('div');
    statusControl.className = 'status-control';
    const statusLabel = document.createElement('label');
    statusLabel.className = 'status-label';
    statusLabel.htmlFor = `item-status-${row.id}`;
    statusLabel.textContent = 'Status';
    const status = document.createElement('select');
    status.id = `item-status-${row.id}`;
    status.dataset.status = row.status;
    status.setAttribute('aria-label', `Reading status for ${row.title}`);
    for (const [value, label] of Object.entries(statusLabels)) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      option.selected = row.status === value;
      status.append(option);
    }
    status.value = row.status;
    status.addEventListener('change', () => {
      const value = status.value;
      model.status(row.id, value);
      persist();
      render();
      const visible = rowControls.get(row.id);
      announce(`“${row.title}” is now ${statusLabels[value].toLowerCase()}.${visible ? '' : ' It is hidden by the current filter.'}`);
      if (visible) visible.status.focus();
      else $(`filter-${state().status}`).focus();
    });
    statusControl.append(statusLabel, status);

    const archiveButton = document.createElement('button');
    archiveButton.type = 'button';
    archiveButton.className = 'button button-quiet archive-action';
    archiveButton.textContent = archived ? 'Restore' : 'Archive';
    archiveButton.setAttribute('aria-label', `${archived ? 'Restore' : 'Archive'} ${row.title}`);
    archiveButton.addEventListener('click', () => {
      const previousArchived = row.archived;
      model.archive(row.id, !previousArchived);
      persist();
      lastArchiveAction = { id: row.id, title: row.title, archived: previousArchived };
      render();
      announce(previousArchived ? `“${row.title}” was restored to your reading list.` : `“${row.title}” was moved to the archive.`, true);
      focusAfterRemoval(index);
    });
    actions.append(statusControl, archiveButton);
    item.append(marker, copy, actions);
    rowControls.set(row.id, { title, status, archive: archiveButton });
    return item;
  }

  function renderEmpty() {
    const filtered = Boolean(state().query.trim()) || state().status !== 'all';
    if (filtered) {
      $('empty-heading').textContent = state().query.trim() ? 'No matching reads' : `Nothing marked “${statusLabels[state().status]}”`;
      $('empty-description').textContent = 'Try another title or author, or clear the search and status filter to see all items in this collection.';
      $('empty-action').textContent = 'Clear search and filters';
      emptyAction = clearFilters;
    } else if (archived) {
      $('empty-heading').textContent = 'Your archive is empty';
      $('empty-description').textContent = 'Archive an item when you want to set it aside. It will stay here until you restore it.';
      $('empty-action').textContent = 'Go to reading list';
      emptyAction = () => setView(false, true);
    } else {
      $('empty-heading').textContent = 'Your next read starts here';
      $('empty-description').textContent = 'Save a book or long article you would like to come back to.';
      $('empty-action').textContent = 'Add your first read';
      emptyAction = openForm;
    }
  }

  function render() {
    const all = model.all();
    const activeCount = all.filter(row => !row.archived).length;
    const archiveCount = all.length - activeCount;
    $('active-count').textContent = activeCount;
    $('archive-count').textContent = archiveCount;
    $('active').setAttribute('aria-pressed', String(!archived));
    $('archive').setAttribute('aria-pressed', String(archived));
    $('active').setAttribute('aria-label', `Reading list, ${plural(activeCount)}`);
    $('archive').setAttribute('aria-label', `Archive, ${plural(archiveCount)}`);
    $('heading').textContent = archived ? 'Archive' : 'Reading list';
    document.title = `${archived ? 'Archive' : 'Reading list'} · My Reading`;
    $('view-description').textContent = archived ? 'Set aside for later. Restore a read whenever you like.' : 'Books and long articles to come back to.';
    $('search-label').textContent = archived ? 'Search archive' : 'Search reading list';
    $('clear-search').hidden = !state().query;

    const matching = model.find(state().query.trim(), archived);
    for (const filter of ['all', 'queued', 'reading', 'finished']) {
      const count = filter === 'all' ? matching.length : matching.filter(row => row.status === filter).length;
      $(`filter-count-${filter}`).textContent = count;
      $(`filter-${filter}`).setAttribute('aria-pressed', String(state().status === filter));
      $(`filter-${filter}`).setAttribute('aria-label', `${filter === 'all' ? 'All statuses' : statusLabels[filter]}, ${plural(count)}`);
    }
    rowsOnScreen = state().status === 'all' ? matching : matching.filter(row => row.status === state().status);
    const total = archived ? archiveCount : activeCount;
    const constrained = Boolean(state().query.trim()) || state().status !== 'all';
    $('count').textContent = constrained ? `${rowsOnScreen.length} of ${plural(total)}` : plural(rowsOnScreen.length);
    rowControls = new Map();
    $('cards').replaceChildren(...rowsOnScreen.map(buildItem));
    $('empty-state').hidden = rowsOnScreen.length !== 0;
    if (!rowsOnScreen.length) renderEmpty();
  }

  $('active').addEventListener('click', () => setView(false));
  $('archive').addEventListener('click', () => setView(true));
  $('search').addEventListener('input', () => { state().query = $('search').value; render(); });
  $('clear-search').addEventListener('click', () => {
    state().query = '';
    $('search').value = '';
    render();
    $('search').focus();
  });
  for (const value of ['all', 'queued', 'reading', 'finished']) {
    $(`filter-${value}`).addEventListener('click', () => { state().status = value; render(); });
  }
  $('open-add').addEventListener('click', openForm);
  $('cancel-add').addEventListener('click', () => closeForm());
  $('add').addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeForm(); }
  });
  $('title').addEventListener('input', () => { if ($('title').value.trim()) clearTitleError(); });
  $('empty-action').addEventListener('click', () => emptyAction?.());
  $('add').addEventListener('submit', event => {
    event.preventDefault();
    let row;
    try {
      row = model.add($('title').value, $('author').value);
    } catch (error) {
      $('notice').textContent = error.message;
      $('title').setAttribute('aria-invalid', 'true');
      $('title').focus();
      return;
    }
    persist();
    $('title').value = '';
    $('author').value = '';
    clearTitleError();
    viewState.active = { query: '', status: 'all' };
    closeForm(false);
    setView(false);
    announce(`Added “${row.title}” to your reading list. Status: To read. Showing all items.`);
    rowControls.get(row.id).title.focus();
  });
  $('undo').addEventListener('click', () => {
    if (!lastArchiveAction) return;
    const previous = lastArchiveAction;
    model.archive(previous.id, previous.archived);
    persist();
    viewState[previous.archived ? 'archive' : 'active'] = { query: '', status: 'all' };
    setView(previous.archived);
    announce(`Undone. “${previous.title}” is back in ${previous.archived ? 'the archive' : 'your reading list'}.`);
    rowControls.get(previous.id).title.focus();
  });
  $('retry-save').addEventListener('click', () => {
    if (persist()) {
      announce('Your reading list has been saved in this browser.');
      $('heading').focus();
    }
  });

  render();
  if (initialWarning) storageWarning(initialWarning);
  else $('storage-state').textContent = loadedSavedList ? 'Saved in this browser' : 'Saves in this browser';
})();

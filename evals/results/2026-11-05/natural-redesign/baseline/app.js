(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  // Accessing localStorage itself can throw when the browser disallows it.
  const storage = {
    getItem: key => window.localStorage.getItem(key),
    setItem: (key, value) => window.localStorage.setItem(key, value)
  };
  const app = ReadingState.create(storage);
  const labels = {all: 'All reads', queued: 'To read', reading: 'Reading', finished: 'Finished'};
  const filterButtons = Array.from(document.querySelectorAll('[data-status]'));
  let emptyAction = 'add';
  let formOpen = false;
  let searchAnnouncement;
  const fromHash = () => window.location.hash === '#archive' ? 'archive' : 'reading';
  app.switchView(fromHash());

  function setText(element, value) {
    if (element.textContent !== value) element.textContent = value;
  }
  function focusElement(id) {
    const element = $(id) || $('results-heading');
    element.focus();
  }
  function icon(kind) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', kind === 'restore' ? 'M4 10a8 8 0 1 1 1 9M4 4v6h6' : 'M3 4h18v4H3zM5 8v12h14V8M9 12h6');
    svg.append(path);
    return svg;
  }
  function openForm(open) {
    formOpen = open;
    $('add-panel').hidden = !open;
    $('open-add').setAttribute('aria-expanded', String(open));
    if (open) $('title').focus();
    else $('open-add').focus();
  }
  function clearFieldError() {
    $('title').removeAttribute('aria-invalid');
    setText($('title-error'), '');
  }
  function navigate(view) {
    app.switchView(view);
    const hash = view === 'archive' ? '#archive' : '#reading';
    if (window.location.hash !== hash) window.location.hash = hash;
  }
  function render(options = {}) {
    const state = app.snapshot();
    const archiveView = state.view === 'archive';
    const viewName = archiveView ? 'Archive' : 'Reading list';
    setText($('heading'), viewName);
    document.title = `${viewName} · My Reading`;
    setText($('view-description'), archiveView ? 'Set aside for now. Bring a read back whenever you like.' : 'Books and long articles, ready when you are.');
    $('active').toggleAttribute('aria-current', false);
    $('archive').toggleAttribute('aria-current', false);
    $(archiveView ? 'archive' : 'active').setAttribute('aria-current', 'page');
    setText($('active-count'), String(state.activeCount));
    setText($('archive-count'), String(state.archivedCount));
    setText($('search-label'), archiveView ? 'Search archive' : 'Search reading list');
    if ($('search').value !== state.query) $('search').value = state.query;
    $('clear-search').hidden = !state.query;
    $('reset-filters').hidden = !state.query && state.filter === 'all';
    filterButtons.forEach(button => {
      const value = button.dataset.status;
      button.setAttribute('aria-pressed', String(state.filter === value));
      setText($(`filter-count-${value}`), String(state.counts[value]));
    });
    setText($('results-heading'), state.filter === 'all' ? (archiveView ? 'Archived reads' : 'Your reads') : labels[state.filter]);
    const filtered = state.query.trim() || state.filter !== 'all';
    const countText = filtered ? `${state.rows.length} of ${state.total} ${state.total === 1 ? 'read' : 'reads'}` : `${state.total} ${state.total === 1 ? 'read' : 'reads'}`;
    window.clearTimeout(searchAnnouncement);
    if (options.searching) searchAnnouncement = window.setTimeout(() => setText($('count'), countText), 250);
    else setText($('count'), countText);

    const elements = state.rows.map((row, index) => {
      const article = document.createElement('article');
      article.className = 'reading-item';
      article.setAttribute('aria-labelledby', `item-title-${row.id}`);
      const number = document.createElement('span');
      number.className = 'item-number';
      number.setAttribute('aria-hidden', 'true');
      number.textContent = String(index + 1).padStart(2, '0');
      const content = document.createElement('div');
      content.className = 'item-content';
      const title = document.createElement('h3');
      title.id = `item-title-${row.id}`;
      title.className = 'item-title';
      title.tabIndex = -1;
      title.textContent = row.title;
      const author = document.createElement('p');
      author.className = 'item-author';
      author.textContent = row.author || 'No author added';
      content.append(title, author);
      const actions = document.createElement('div');
      actions.className = 'item-actions';
      const statusWrap = document.createElement('div');
      statusWrap.className = 'status-control';
      const status = document.createElement('select');
      status.id = `status-${row.id}`;
      status.dataset.value = row.status;
      status.setAttribute('aria-label', `Reading status for ${row.title}`);
      ['queued', 'reading', 'finished'].forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = labels[value];
        status.append(option);
      });
      status.value = row.status;
      status.addEventListener('change', () => {
        app.status(row.id, status.value);
        render();
        focusElement(`status-${row.id}`);
      });
      statusWrap.append(status);
      const action = document.createElement('button');
      action.id = `archive-${row.id}`;
      action.type = 'button';
      action.className = 'item-action';
      action.setAttribute('aria-label', `${archiveView ? 'Restore' : 'Archive'} ${row.title}`);
      const actionLabel = document.createElement('span');
      actionLabel.textContent = archiveView ? 'Restore' : 'Archive';
      action.append(icon(archiveView ? 'restore' : 'archive'), actionLabel);
      action.addEventListener('click', () => {
        const next = state.rows[index + 1] || state.rows[index - 1];
        app.archive(row.id);
        render();
        focusElement(next ? `archive-${next.id}` : 'results-heading');
      });
      actions.append(statusWrap, action);
      article.append(number, content, actions);
      return article;
    });
    $('cards').replaceChildren(...elements);
    $('empty').hidden = state.rows.length > 0;
    if (!state.rows.length) {
      if (state.query.trim() || state.filter !== 'all') {
        setText($('empty-title'), 'No matching reads');
        setText($('empty-description'), state.query.trim() ? `No reads match “${state.query.trim()}” with the current filters. Try another title or author, or clear the filters.` : `There are no reads marked “${labels[state.filter]}” in this collection yet.`);
        setText($('empty-action'), 'Clear filters');
        emptyAction = 'clear';
      } else if (archiveView) {
        setText($('empty-title'), 'Your archive is empty');
        setText($('empty-description'), 'Reads you archive stay here with their reading status. You can restore them anytime.');
        setText($('empty-action'), 'Go to reading list');
        emptyAction = 'reading';
      } else {
        setText($('empty-title'), 'Your next read starts here');
        setText($('empty-description'), 'Add a book or long article you want to spend some time with.');
        setText($('empty-action'), 'Add your first read');
        emptyAction = 'add';
      }
    }
    $('feedback').hidden = !state.feedback;
    setText($('notice'), state.feedback);
    $('undo').hidden = !state.canUndo;
    $('undo').setAttribute('aria-label', state.undoLabel || 'Undo');
    const storageError = state.storageState !== 'ready';
    $('storage-warning').hidden = !storageError;
    setText($('storage-message'), state.storageMessage);
    $('retry-save').hidden = state.storageState === 'blocked';
    setText($('storage-status'), storageError ? 'Changes are not saved' : 'Saved in this browser');
    $('storage-dot').classList.toggle('has-error', storageError);
    $('example-note').hidden = !state.usingExamples;
  }

  document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); $('main').focus(); });
  $('open-add').addEventListener('click', () => openForm(!formOpen));
  $('cancel-add').addEventListener('click', () => openForm(false));
  $('add').addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); openForm(false); }
  });
  $('title').addEventListener('input', clearFieldError);
  $('add').addEventListener('submit', event => {
    event.preventDefault();
    try {
      const row = app.add($('title').value, $('author').value);
      clearFieldError();
      $('add').reset();
      formOpen = false;
      $('add-panel').hidden = true;
      $('open-add').setAttribute('aria-expanded', 'false');
      navigate('reading');
      render();
      focusElement(`item-title-${row.id}`);
    } catch (error) {
      $('title').setAttribute('aria-invalid', 'true');
      setText($('title-error'), error.message);
      $('title').focus();
    }
  });
  $('search').addEventListener('input', () => { app.search($('search').value); render({searching: true}); });
  $('clear-search').addEventListener('click', () => { app.search(''); render(); $('search').focus(); });
  $('reset-filters').addEventListener('click', () => { app.clearFilters(); render(); $('search').focus(); });
  filterButtons.forEach(button => button.addEventListener('click', () => { app.filter(button.dataset.status); render(); }));
  $('empty-action').addEventListener('click', () => {
    if (emptyAction === 'add') openForm(true);
    else if (emptyAction === 'reading') { navigate('reading'); render(); $('heading').focus(); }
    else { app.clearFilters(); render(); $('search').focus(); }
  });
  $('undo').addEventListener('click', () => {
    const row = app.undo();
    navigate(app.snapshot().view);
    render();
    if (row) focusElement(`item-title-${row.id}`);
  });
  $('retry-save').addEventListener('click', () => {
    const saved = app.retrySaving();
    render();
    if (saved) $('heading').focus();
  });
  window.addEventListener('hashchange', () => {
    const next = fromHash();
    if (app.snapshot().view !== next) { app.switchView(next); render(); }
  });
  render();
})();

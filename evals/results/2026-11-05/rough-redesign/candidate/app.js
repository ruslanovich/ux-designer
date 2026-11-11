(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const statusLabels = { queued: 'To read', reading: 'Reading', finished: 'Finished' };
  const storageKey = 'reading-list';
  let storageBlocked = false;
  let saved;
  let initialWarning = '';

  // Keep the existing storage key and model contract, including a deliberately empty list.
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      const valid = Array.isArray(parsed) && parsed.every(row => row &&
        Number.isFinite(row.id) && typeof row.title === 'string' &&
        typeof row.author === 'string' && Object.hasOwn(statusLabels, row.status) &&
        typeof row.archived === 'boolean');
      if (!valid || new Set(parsed.map(row => row.id)).size !== parsed.length) {
        throw new Error('Unreadable saved list');
      }
      saved = parsed;
    }
  } catch {
    storageBlocked = true;
    initialWarning = 'Your saved list could not be loaded. You can explore the sample list in this session. Existing saved data will not be overwritten.';
  }

  const model = ReadingModel.create(saved ?? ReadingModel.seed);
  let archived = window.location.hash === '#archive';
  let selectedStatus = 'all';
  let lastArchiveAction = null;

  function storageWarning(message) {
    $('storage-notice').textContent = message;
    $('storage-notice').hidden = false;
    $('save-status').textContent = 'Changes are kept for this session only.';
  }

  function persist() {
    if (storageBlocked) return false;
    try {
      localStorage.setItem(storageKey, JSON.stringify(model.all()));
      $('storage-notice').hidden = true;
      $('save-status').textContent = 'Saved on this device. Your list stays in this browser.';
      return true;
    } catch {
      storageWarning('Your browser could not save this change. Keep this page open to retain your current list; changes may be lost when you leave.');
      return false;
    }
  }

  function announce(message, allowUndo = false) {
    $('feedback').hidden = false;
    $('feedback-text').textContent = message;
    $('undo').hidden = !allowUndo;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function icon(path) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', path);
    line.setAttribute('stroke', 'currentColor');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-linejoin', 'round');
    svg.append(line);
    return svg;
  }

  function focusRow(id, action, previousIndex = 0) {
    const preferred = $(`${action}-${id}`);
    const available = $('cards').querySelectorAll(`[data-row-action="${action}"]`);
    const fallback = available[Math.min(previousIndex, available.length - 1)];
    (preferred || fallback || $('heading')).focus();
  }

  function createRow(read, index) {
    const item = element('li');
    const article = element('article', 'read-row');
    article.setAttribute('aria-labelledby', `read-title-${read.id}`);
    const mark = element('div', `read-mark ${read.status}`);
    mark.setAttribute('aria-hidden', 'true');
    mark.append(icon('M7 3h10v18l-5-3-5 3V3Z'));

    const content = element('div', 'read-content');
    const title = element('h2', 'read-title', read.title);
    title.id = `read-title-${read.id}`;
    content.append(title);
    if (read.author) content.append(element('p', 'read-author', read.author));

    const actions = element('div', 'read-actions');
    const status = element('select', `status-select status-${read.status}`);
    status.id = `status-${read.id}`;
    status.setAttribute('aria-label', `Reading status for ${read.title}`);
    status.setAttribute('data-row-action', 'status');
    for (const [value, label] of Object.entries(statusLabels)) {
      const option = element('option', '', label);
      option.value = value;
      option.selected = value === read.status;
      status.append(option);
    }
    status.onchange = () => {
      model.status(read.id, status.value);
      persist();
      render();
      focusRow(read.id, 'status', index);
      announce(`“${read.title}” is now ${statusLabels[status.value].toLowerCase()}.`);
    };

    const archiveAction = element('button', 'row-action');
    archiveAction.type = 'button';
    archiveAction.id = `archive-${read.id}`;
    archiveAction.setAttribute('data-row-action', 'archive');
    archiveAction.setAttribute('aria-label', `${archived ? 'Restore' : 'Archive'} ${read.title}`);
    archiveAction.append(icon(archived ? 'M4 11h10a6 6 0 0 1 0 12M4 11l5-5M4 11l5 5' : 'M4 8h16v12H4V8ZM3 4h18v4H3V4Zm6 8h6'));
    archiveAction.append(element('span', '', archived ? 'Restore' : 'Archive'));
    archiveAction.onclick = () => {
      lastArchiveAction = { id: read.id, title: read.title, wasArchived: read.archived };
      model.archive(read.id, !read.archived);
      persist();
      render();
      focusRow(null, 'archive', index);
      announce(read.archived ? `“${read.title}” restored to your reading list.` : `“${read.title}” moved to the archive.`, true);
    };
    actions.append(status, archiveAction);
    content.append(actions);
    article.append(mark, content);
    item.append(article);
    return item;
  }

  function focusAddForm() {
    $('title').focus();
    $('title').scrollIntoView({ block: 'center' });
  }

  function showList() {
    archived = false;
    selectedStatus = 'all';
    $('search').value = '';
    window.history.replaceState(null, '', '#reading-list');
    render();
  }

  function renderEmptyState(query, viewRows) {
    if (query || selectedStatus !== 'all') {
      $('empty-title').textContent = 'No reads found';
      $('empty-description').textContent = 'Try another title or author, or clear your search and status filter.';
      $('empty-action').textContent = 'Clear search & filter';
      $('empty-action').onclick = () => {
        $('search').value = '';
        selectedStatus = 'all';
        render();
        $('search').focus();
      };
    } else if (archived) {
      $('empty-title').textContent = 'Nothing tucked away yet';
      $('empty-description').textContent = 'Reads you archive will live here. You can restore them to your reading list at any time.';
      $('empty-action').textContent = 'Back to reading list';
      $('empty-action').onclick = () => { showList(); $('heading').focus(); };
    } else if (!viewRows.length) {
      $('empty-title').textContent = 'A fresh page';
      $('empty-description').textContent = 'Have a book or a long article in mind? Add your first read to keep it close.';
      $('empty-action').textContent = 'Add your first read';
      $('empty-action').onclick = focusAddForm;
    }
  }

  function render() {
    const all = model.all();
    const viewRows = model.find('', archived);
    const query = $('search').value.trim();
    const results = model.find(query, archived).filter(read => selectedStatus === 'all' || read.status === selectedStatus);
    $('active-count').textContent = all.filter(read => !read.archived).length;
    $('archive-count').textContent = all.filter(read => read.archived).length;
    $('active').removeAttribute('aria-current');
    $('archive').removeAttribute('aria-current');
    $(archived ? 'archive' : 'active').setAttribute('aria-current', 'page');
    $('heading').textContent = archived ? 'Your archive.' : 'Your reading list.';
    $('intro-text').textContent = archived ? 'A quiet home for reads you’ve put aside.' : 'Books, articles, and ideas worth coming back to.';
    document.title = archived ? 'Archive — My Reading' : 'Reading list — My Reading';
    $('search-label').textContent = `Search titles or authors in your ${archived ? 'archive' : 'reading list'}`;
    $('search').placeholder = archived ? 'Search your archive' : 'Search titles or authors';
    $('cards').setAttribute('aria-label', archived ? 'Archived reads' : 'Reading list');
    $('clear-search').hidden = !$('search').value;
    for (const button of $('filters').querySelectorAll('[data-filter]')) {
      const status = button.getAttribute('data-filter');
      button.setAttribute('aria-pressed', String(status === selectedStatus));
      $(`filter-${status}`).textContent = status === 'all' ? viewRows.length : viewRows.filter(read => read.status === status).length;
    }
    const noun = results.length === 1 ? 'read' : 'reads';
    $('count').textContent = `${results.length} ${noun}${query || selectedStatus !== 'all' ? ` of ${viewRows.length}` : archived ? ' in your archive' : ' on your list'}`;
    $('list-hint').textContent = archived ? 'Room for a return visit' : 'One good read at a time';
    $('cards').replaceChildren(...results.map(createRow));
    $('cards').hidden = results.length === 0;
    $('empty-state').hidden = results.length !== 0;
    if (!results.length) renderEmptyState(query, viewRows);
  }

  for (const button of $('filters').querySelectorAll('[data-filter]')) {
    button.onclick = () => {
      selectedStatus = button.getAttribute('data-filter');
      render();
    };
  }
  window.addEventListener('hashchange', () => {
    archived = window.location.hash === '#archive';
    selectedStatus = 'all';
    render();
    $('heading').focus();
  });
  $('search').oninput = render;
  $('clear-search').onclick = () => { $('search').value = ''; render(); $('search').focus(); };
  $('search').onkeydown = event => {
    if (event.key === 'Escape' && $('search').value) {
      event.preventDefault();
      $('clear-search').click();
    }
  };
  $('add-shortcut').onclick = event => { event.preventDefault(); focusAddForm(); };
  $('title').oninput = () => {
    if ($('title').value.trim()) {
      $('title').removeAttribute('aria-invalid');
      $('notice').hidden = true;
      $('notice').textContent = '';
    }
  };
  $('add').onsubmit = event => {
    event.preventDefault();
    try {
      const read = model.add($('title').value, $('author').value);
      persist();
      $('title').value = '';
      $('author').value = '';
      $('title').removeAttribute('aria-invalid');
      $('notice').textContent = '';
      $('notice').hidden = true;
      showList();
      announce(`“${read.title}” added to your reading list.`);
      $('title').focus();
    } catch (error) {
      $('notice').textContent = error.message;
      $('notice').hidden = false;
      $('title').setAttribute('aria-invalid', 'true');
      $('title').focus();
    }
  };
  $('undo').onclick = () => {
    if (!lastArchiveAction) return;
    const action = lastArchiveAction;
    lastArchiveAction = null;
    model.archive(action.id, action.wasArchived);
    persist();
    render();
    announce(action.wasArchived ? `“${action.title}” returned to the archive.` : `“${action.title}” returned to your reading list.`);
    focusRow(action.id, 'archive');
  };

  if (initialWarning) storageWarning(initialWarning);
  render();
})();

(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const storageKey = 'reading-list';
  const statusNames = {queued:'To read', reading:'Reading', finished:'Finished'};
  let saved = null;
  let storageProblem = '';
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw !== null) {
      saved = JSON.parse(raw);
      if (!Array.isArray(saved) || !saved.every(row => row && Number.isFinite(row.id) && typeof row.title === 'string' && typeof row.author === 'string' && Object.hasOwn(statusNames, row.status) && typeof row.archived === 'boolean')) {
        saved = null;
        storageProblem = 'Your saved list could not be read. The example list is shown. Your existing saved data will only be replaced when you make a change or try saving again.';
      }
    }
  } catch {
    storageProblem = 'Your saved list could not be read, so the example list is shown. Saving may be unavailable. If saving becomes available, making a change or trying again will replace the saved list with the list shown here.';
  }
  const model = ReadingModel.create(saved || ReadingModel.seed);
  let archived = false;
  let lastArchive = null;
  let addOpener = $('open-add');

  function setStorageProblem(message) {
    storageProblem = message;
    $('storage-warning').hidden = !message;
    $('storage-message').textContent = message;
    $('storage-status').textContent = message ? 'Changes may not be saved on this device' : 'Saved on this device';
    $('storage-status').classList.toggle('has-warning', Boolean(message));
  }

  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(model.all()));
      setStorageProblem('');
      return true;
    } catch {
      setStorageProblem('Your latest changes are available in this page, but could not be saved on this device. Keep this page open and try saving again.');
      return false;
    }
  }

  function notify(message, undo = null) {
    lastArchive = undo;
    $('feedback').hidden = false;
    $('notice').textContent = message;
    $('undo').hidden = !undo;
  }

  function openAdd(opener = $('open-add')) {
    addOpener = opener;
    $('add-panel').hidden = false;
    $('open-add').setAttribute('aria-expanded', 'true');
    $('title').focus();
  }

  function closeAdd() {
    $('add-panel').hidden = true;
    $('open-add').setAttribute('aria-expanded', 'false');
    const target = addOpener && !addOpener.hidden ? addOpener : $('open-add');
    target.focus();
  }

  function titleError(message = '') {
    $('title-error').textContent = message;
    if (message) $('title').setAttribute('aria-invalid', 'true');
    else $('title').removeAttribute('aria-invalid');
  }

  function setView(value) {
    archived = value;
    render();
  }

  function archiveIcon(restoring) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', restoring ? 'M5 8H3V3m0 5a9 9 0 1 1-1 8M3 8h6' : 'M4 8h16v12H4V8Zm-1-5h18v5H3V3Zm6 9h6');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.6');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    icon.append(path);
    return icon;
  }

  function makeRow(row) {
    const li = document.createElement('li');
    const card = document.createElement('article');
    card.className = 'reading-row';
    card.setAttribute('aria-labelledby', `entry-${row.id}-title`);
    const main = document.createElement('div');
    main.className = 'entry-main';
    const mark = document.createElement('div');
    mark.className = `book-mark tone-${row.id % 4 + 1}`;
    mark.textContent = row.title.trim().charAt(0).toUpperCase();
    mark.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('div');
    copy.className = 'entry-copy';
    const title = document.createElement('h3');
    title.id = `entry-${row.id}-title`;
    title.textContent = row.title;
    copy.append(title);
    if (row.author) {
      const author = document.createElement('p');
      author.textContent = row.author;
      copy.append(author);
    }
    main.append(mark, copy);
    const statusWrap = document.createElement('div');
    statusWrap.className = `status-wrap ${row.status}`;
    const status = document.createElement('select');
    status.setAttribute('aria-label', `Reading status for ${row.title}`);
    status.dataset.itemId = row.id;
    for (const [value, label] of Object.entries(statusNames)) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      option.selected = value === row.status;
      status.append(option);
    }
    status.addEventListener('change', () => {
      model.status(row.id, status.value);
      statusWrap.className = `status-wrap ${status.value}`;
      persist();
      updateCounts();
      notify(`“${row.title}” is now ${statusNames[status.value].toLowerCase()}.`);
    });
    statusWrap.append(status);
    const archive = document.createElement('button');
    archive.type = 'button';
    archive.className = 'archive-button';
    archive.dataset.itemId = row.id;
    archive.setAttribute('aria-label', `${archived ? 'Restore' : 'Archive'} ${row.title}`);
    const archiveText = document.createElement('span');
    archiveText.textContent = archived ? 'Restore' : 'Archive';
    archive.append(archiveIcon(archived), archiveText);
    archive.addEventListener('click', () => {
      const wasArchived = archived;
      const rows = model.find($('search').value.trim(), archived);
      const index = rows.findIndex(item => item.id === row.id);
      model.archive(row.id, !wasArchived);
      persist();
      render();
      notify(`“${row.title}” ${wasArchived ? 'restored to your reading list' : 'moved to the archive'}.`, {id:row.id, previous:wasArchived, title:row.title});
      const buttons = $('cards').querySelectorAll('.archive-button');
      const next = buttons[Math.min(index, buttons.length - 1)];
      if (next) next.focus();
      else $('heading').focus();
    });
    card.append(main, statusWrap, archive);
    li.append(card);
    return li;
  }

  function updateCounts() {
    const all = model.all();
    const activeRows = all.filter(row => !row.archived);
    const reading = activeRows.filter(row => row.status === 'reading').length;
    $('active-count').textContent = activeRows.length;
    $('archive-count').textContent = all.length - activeRows.length;
    $('reading-summary').textContent = reading ? `${reading} ${reading === 1 ? 'read' : 'reads'} in progress` : 'One good read at a time.';
  }

  function render() {
    const query = $('search').value.trim();
    const rows = model.find(query, archived);
    const total = model.find('', archived).length;
    $('cards').replaceChildren(...rows.map(makeRow));
    $('active').classList.toggle('is-active', !archived);
    $('archive').classList.toggle('is-active', archived);
    $('active').setAttribute('aria-pressed', String(!archived));
    $('archive').setAttribute('aria-pressed', String(archived));
    $('heading').textContent = archived ? 'In your archive' : 'On your list';
    $('view-description').textContent = archived ? 'Past reads, ready to return whenever you like.' : 'A place for every stage of your reading.';
    $('search').placeholder = archived ? 'Search the archive…' : 'Search this list…';
    $('search-label').textContent = `Search titles and authors in ${archived ? 'your archive' : 'your reading list'}`;
    $('count').textContent = query ? `${rows.length} of ${total} ${total === 1 ? 'read' : 'reads'}` : `${rows.length} ${rows.length === 1 ? 'read' : 'reads'}`;
    $('clear-search').hidden = !$('search').value;
    $('empty').hidden = rows.length > 0;
    document.querySelector('.list-labels').hidden = rows.length === 0;
    if (!rows.length) {
      $('empty-title').textContent = query ? 'No matching reads' : archived ? 'Your archive is empty' : 'A new chapter starts here';
      $('empty-copy').textContent = query ? `No titles or authors match “${query}” in ${archived ? 'your archive' : 'your reading list'}. Try a different search.` : archived ? 'Reads you archive will stay here. You can restore them to your reading list at any time.' : 'Add a book or article you’d like to read. You can track its progress as you go.';
      $('empty-action').textContent = query ? 'Clear search' : archived ? 'Go to reading list' : 'Add your first read';
      $('empty-action').onclick = () => {
        if (query) {
          $('search').value = '';
          render();
          $('search').focus();
        } else if (archived) {
          setView(false);
          $('active').focus();
        } else openAdd($('empty-action'));
      };
    }
    updateCounts();
  }

  $('active').addEventListener('click', () => setView(false));
  $('archive').addEventListener('click', () => setView(true));
  $('search').addEventListener('input', render);
  $('clear-search').addEventListener('click', () => {
    $('search').value = '';
    render();
    $('search').focus();
  });
  $('open-add').addEventListener('click', () => $('add-panel').hidden ? openAdd() : closeAdd());
  $('close-add').addEventListener('click', closeAdd);
  $('cancel-add').addEventListener('click', closeAdd);
  $('add-panel').addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeAdd();
    }
  });
  $('title').addEventListener('input', () => titleError());
  $('add').addEventListener('submit', event => {
    event.preventDefault();
    try {
      const added = model.add($('title').value, $('author').value);
      persist();
      $('title').value = '';
      $('author').value = '';
      titleError();
      archived = false;
      $('search').value = '';
      render();
      closeAdd();
      $('open-add').focus();
      notify(`“${added.title}” added to your reading list.`);
    } catch (error) {
      titleError(error.message);
      $('title').focus();
    }
  });
  $('undo').addEventListener('click', () => {
    if (!lastArchive) return;
    const action = lastArchive;
    model.archive(action.id, action.previous);
    persist();
    archived = action.previous;
    render();
    notify(`Move undone. “${action.title}” is back in ${action.previous ? 'your archive' : 'your reading list'}.`);
    const button = Array.from($('cards').querySelectorAll('.archive-button')).find(element => element.dataset.itemId === String(action.id));
    if (button) button.focus();
    else $('heading').focus();
  });
  $('dismiss-notice').addEventListener('click', () => {
    $('feedback').hidden = true;
    lastArchive = null;
    $('heading').focus();
  });
  $('retry-save').addEventListener('click', () => {
    if (persist()) {
      notify('Your reading list is saved on this device.');
      $('heading').focus();
    }
  });
  render();
  if (storageProblem) setStorageProblem(storageProblem);
})();

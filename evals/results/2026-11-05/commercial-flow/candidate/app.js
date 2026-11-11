'use strict';

const model = ServiceModel.create();
const $ = id => document.getElementById(id);
const statuses = ['all', 'new', 'waiting', 'scheduled', 'draft'];
const statusNames = { all: 'All work', new: 'New', waiting: 'Waiting', scheduled: 'Scheduled', draft: 'Draft' };
const state = { query: '', status: 'all', selected: new Set(), detailId: null, originId: null };
const canAssign = () => ['dispatcher', 'admin'].includes($('role').value);
const shownOrders = () => model.list(state.query, state.status);
const plural = (n, singular, multiple = singular + 's') => n === 1 ? singular : multiple;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function focusAndReveal(node) {
  if (!node) return;
  node.focus({ preventScroll: true });
  node.scrollIntoView({ block: 'nearest', behavior: 'auto' });
}

function notify(title, lines = [], warning = false) {
  const area = $('result');
  area.hidden = false;
  area.className = 'feedback' + (warning ? ' warning' : '');
  area.replaceChildren(element('p', 'feedback-title', title));
  if (lines.length) {
    const list = element('ul');
    for (const line of lines) list.append(element('li', '', line));
    area.append(list);
  }
}

function fieldError(fieldId, errorId, message = '') {
  const field = $(fieldId);
  const error = $(errorId);
  if (!field || !error) return;
  error.textContent = message;
  error.hidden = !message;
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
}

function badge(status) {
  return element('span', 'badge status-' + status, statusNames[status] || status);
}

function rowField(label, value, className = '') {
  const dl = element('dl', 'row-field');
  dl.append(element('dt', '', label));
  const dd = element('dd', className);
  if (typeof value === 'string') dd.textContent = value;
  else dd.append(value);
  dl.append(dd);
  return dl;
}

function renderQueue() {
  const activeId = document.activeElement && document.activeElement.id;
  const focusedInRows = activeId && /^(select|order)-\d+$/.test(activeId);
  const records = shownOrders();
  const ids = new Set(records.map(r => r.id));
  const queried = model.list(state.query);
  for (const status of statuses) {
    $('status-' + status).setAttribute('aria-pressed', String(status === state.status));
    $('count-' + status).textContent = status === 'all' ? queried.length : queried.filter(r => r.status === status).length;
  }
  $('result-count').textContent = records.length + ' ' + plural(records.length, 'work order');
  $('shown-count').textContent = records.length + ' shown';
  $('filter-summary').textContent = (state.status === 'all' ? 'Showing all statuses' : 'Status: ' + statusNames[state.status]) + (state.query ? ' · Search: “' + state.query + '”' : '');
  $('clear-filters').hidden = !state.query && state.status === 'all';
  $('empty-state').hidden = records.length > 0;
  $('select-all-label').hidden = !canAssign();
  $('select-all').disabled = !records.length || !canAssign();
  const selectedShown = records.filter(r => state.selected.has(r.id)).length;
  $('select-all').checked = records.length > 0 && selectedShown === records.length;
  $('select-all').indeterminate = selectedShown > 0 && selectedShown < records.length;
  $('rows').replaceChildren();
  for (const record of records) {
    const row = element('li', 'order-row' + (state.selected.has(record.id) ? ' is-selected' : '') + (state.detailId === record.id ? ' is-current' : ''));
    const selection = element('div', 'row-selection');
    if (canAssign()) {
      const label = element('label');
      const box = element('input');
      box.id = 'select-' + record.id;
      box.type = 'checkbox';
      box.checked = state.selected.has(record.id);
      box.setAttribute('aria-label', 'Select work order ' + record.id + ': ' + record.title);
      box.onchange = () => {
        if (box.checked) state.selected.add(record.id);
        else state.selected.delete(record.id);
        renderQueue();
        renderSelection();
      };
      label.append(box);
      selection.append(label);
    }
    const main = element('div', 'order-main');
    const title = element('button', 'order-title', record.title);
    title.id = 'order-' + record.id;
    title.setAttribute('aria-controls', 'detail');
    title.setAttribute('aria-expanded', String(state.detailId === record.id));
    title.onclick = () => openDetail(record.id, title.id);
    const meta = element('p', 'order-meta');
    meta.append(element('span', 'order-id', '#' + record.id), document.createTextNode(' · ' + record.customer));
    main.append(title, meta);
    row.append(selection, main, rowField('Status', badge(record.status)), rowField('Technician', record.assignee || 'Unassigned', record.assignee ? '' : 'unassigned'), rowField('Due', record.due, record.due === 'Today' ? 'due-today' : ''));
    $('rows').append(row);
  }
  const detailHint = $('detail-context');
  if (detailHint) detailHint.hidden = ids.has(state.detailId);
  if (focusedInRows && $(activeId)) $(activeId).focus({ preventScroll: true });
}

function renderSelection() {
  const records = [...state.selected].map(id => model.detail(id)).filter(Boolean);
  $('assignment-panel').hidden = !canAssign() || !records.length;
  const visible = new Set(shownOrders().map(r => r.id));
  const outside = records.filter(r => !visible.has(r.id)).length;
  $('selection-heading').textContent = records.length + ' ' + plural(records.length, 'work order') + ' selected';
  $('selection-count').textContent = outside ? outside + ' outside the current view · All selected work is listed below.' : 'All selected work is in the current view.';
  $('assign').textContent = 'Assign ' + records.length + ' selected';
  $('draft-warning').hidden = !records.some(r => r.status === 'draft');
  $('selected-orders').replaceChildren();
  for (const record of records) {
    const item = element('li', 'selected-item');
    const open = element('button', 'selected-open', '#' + record.id + ' · ' + record.customer);
    open.type = 'button';
    open.id = 'selected-open-' + record.id;
    open.setAttribute('aria-label', 'Review selected work order ' + record.id + ': ' + record.title);
    open.onclick = () => openDetail(record.id, open.id);
    const notes = [];
    if (!visible.has(record.id)) notes.push('Outside current view');
    if (record.status === 'draft') notes.push('Draft · cannot assign');
    if (notes.length) open.append(element('span', 'selected-note', notes.join(' · ')));
    const remove = element('button', 'remove-selected', '×');
    remove.type = 'button';
    remove.setAttribute('aria-label', 'Remove work order ' + record.id + ' from selection');
    remove.onclick = () => {
      state.selected.delete(record.id);
      renderQueue();
      renderSelection();
      focusAndReveal(state.selected.size ? $('clear-selection') : $('queue-heading'));
    };
    item.append(open, remove);
    $('selected-orders').append(item);
  }
}

function syncSavedView() {
  const current = model.views().find(v => v.name === $('views').value);
  if (!current || current.query !== state.query || current.status !== state.status) $('views').value = '';
}

function changeFilters() {
  syncSavedView();
  renderQueue();
  renderSelection();
}

function clearFilters() {
  state.query = '';
  state.status = 'all';
  $('query').value = '';
  changeFilters();
  focusAndReveal($('query'));
}

function openDetail(id, originId) {
  if (!model.detail(id)) return;
  state.detailId = id;
  state.originId = originId;
  renderQueue();
  renderDetail();
  focusAndReveal($('detail-title'));
}

function closeDetail() {
  const origin = state.originId;
  state.detailId = null;
  renderQueue();
  renderDetail();
  focusAndReveal($(origin) || $('queue-heading'));
}

function renderDetail() {
  const record = state.detailId === null ? null : model.detail(state.detailId);
  $('detail-empty').hidden = !!record;
  $('detail-content').hidden = !record;
  $('detail-content').replaceChildren();
  $('detail').setAttribute('aria-labelledby', record ? 'detail-title' : 'detail-heading');
  if (!record) return;
  const header = element('div', 'detail-header');
  const back = element('button', 'text-button back-button', '← Back to queue');
  back.id = 'back-to-queue';
  back.onclick = closeDetail;
  const title = element('h2', 'detail-title', record.title);
  title.id = 'detail-title';
  title.tabIndex = -1;
  const context = element('p', 'detail-context', 'This order is outside the current filters.');
  context.id = 'detail-context';
  context.hidden = shownOrders().some(r => r.id === record.id);
  header.append(back, element('p', 'detail-number', 'WORK ORDER #' + record.id), title, element('p', 'detail-customer', record.customer), badge(record.status), context);
  const data = element('dl', 'detail-data');
  for (const [label, value] of [['Due', record.due], ['Technician', record.assignee || 'Unassigned']]) {
    const group = element('div');
    group.append(element('dt', '', label), element('dd', '', value));
    data.append(group);
  }
  $('detail-content').append(header, data);
  if (canAssign() && record.status !== 'draft') {
    const section = element('section', 'detail-assignment');
    section.append(element('h3', '', record.assignee ? 'Reassign work' : 'Assign this work'));
    const form = element('form');
    form.id = 'detail-assign-form';
    form.noValidate = true;
    const field = element('div', 'field');
    const label = element('label', '', 'Technician');
    label.htmlFor = 'detail-technician';
    const select = element('select');
    select.id = 'detail-technician';
    select.setAttribute('aria-describedby', 'detail-technician-error');
    for (const [value, text] of [['', 'Choose a technician'], ['Lee', 'Lee'], ['Sam', 'Sam']]) {
      const option = element('option', '', text);
      option.value = value;
      select.append(option);
    }
    const error = element('p', 'field-error');
    error.id = 'detail-technician-error';
    error.hidden = true;
    select.onchange = () => fieldError('detail-technician', 'detail-technician-error');
    field.append(label, select, error);
    const submit = element('button', 'button primary', record.assignee ? 'Reassign work order' : 'Assign work order');
    submit.type = 'submit';
    form.append(field, submit, element('p', 'field-help', 'Sets the status to Scheduled and adds a history entry.'));
    form.onsubmit = event => {
      event.preventDefault();
      assign([record.id], select.value, 'detail-technician', 'detail-technician-error');
    };
    section.append(form);
    $('detail-content').append(section);
  } else if (record.status === 'draft') {
    const section = element('div', 'detail-draft');
    section.append(element('h3', '', 'Draft needs completion'), element('p', 'muted', 'Complete the draft before assignment. Draft editing is unavailable in this prototype.'));
    $('detail-content').append(section);
  }
  const history = element('section', 'history');
  history.append(element('h3', '', 'History'));
  const list = element('ol', 'history-list');
  list.id = 'history-list';
  list.setAttribute('aria-label', 'Work-order history, oldest first');
  for (const entry of record.history) list.append(element('li', '', entry));
  history.append(list);
  $('detail-content').append(history);
}

function assign(ids, name, fieldId, errorId) {
  fieldError(fieldId, errorId);
  if (!ids.length) {
    notify('Select at least one work order to assign.', [], true);
    focusAndReveal($('queue-heading'));
    return;
  }
  try {
    const results = model.assign(ids, name, $('role').value);
    const successful = results.filter(r => r.ok);
    const failed = results.filter(r => !r.ok);
    for (const result of successful) state.selected.delete(result.id);
    const lines = results.map(r => '#' + r.id + ': ' + (r.ok ? 'Assigned to ' + name + ' · Scheduled.' : r.error + (model.detail(r.id)?.status === 'draft' ? '. Draft editing is unavailable in this prototype.' : '.')));
    notify(successful.length + ' ' + plural(successful.length, 'work order') + ' assigned' + (failed.length ? ' · ' + failed.length + ' could not be assigned' : ''), lines, failed.length > 0);
    renderQueue();
    renderSelection();
    renderDetail();
    focusAndReveal($('result'));
  } catch (error) {
    if (!name.trim()) {
      fieldError(fieldId, errorId, error.message);
      focusAndReveal($(fieldId));
    } else {
      notify(error.message, [], true);
      focusAndReveal($('result'));
    }
  }
}

function closeSaveView() {
  $('save-view-panel').hidden = true;
  $('open-save-view').setAttribute('aria-expanded', 'false');
  fieldError('view-name', 'view-error');
  focusAndReveal($('open-save-view'));
}

$('query').oninput = () => { state.query = $('query').value; changeFilters(); };
for (const status of statuses) $('status-' + status).onclick = () => { state.status = status; changeFilters(); };
$('clear-filters').onclick = clearFilters;
$('empty-clear').onclick = clearFilters;
$('select-all').onchange = () => {
  for (const record of shownOrders()) {
    if ($('select-all').checked) state.selected.add(record.id);
    else state.selected.delete(record.id);
  }
  renderQueue();
  renderSelection();
};
$('clear-selection').onclick = () => {
  state.selected.clear();
  fieldError('technician', 'technician-error');
  renderQueue();
  renderSelection();
  focusAndReveal($('queue-heading'));
};
$('assignment-panel').onsubmit = event => {
  event.preventDefault();
  assign([...state.selected], $('technician').value, 'technician', 'technician-error');
};
$('technician').onchange = () => fieldError('technician', 'technician-error');
$('open-save-view').onclick = () => {
  $('save-view-panel').hidden = false;
  $('open-save-view').setAttribute('aria-expanded', 'true');
  fieldError('view-name', 'view-error');
  focusAndReveal($('view-name'));
};
$('cancel-save-view').onclick = closeSaveView;
$('save-view-panel').onkeydown = event => { if (event.key === 'Escape') { event.preventDefault(); closeSaveView(); } };
$('view-name').oninput = () => fieldError('view-name', 'view-error');
$('save-view-panel').onsubmit = event => {
  event.preventDefault();
  try {
    const replaced = model.views().some(v => v.name === $('view-name').value.trim());
    const view = model.saveView($('view-name').value, state.query, state.status);
    $('views').replaceChildren(new Option('Custom view', ''));
    for (const saved of model.views()) $('views').add(new Option(saved.name, saved.name));
    $('views').value = view.name;
    closeSaveView();
    notify('View “' + view.name + '” ' + (replaced ? 'updated.' : 'saved.'), ['Search and status are saved for this session.']);
  } catch (error) {
    fieldError('view-name', 'view-error', error.message);
    focusAndReveal($('view-name'));
  }
};
$('views').onchange = () => {
  const view = model.views().find(v => v.name === $('views').value);
  if (!view) return;
  state.query = view.query;
  state.status = view.status;
  $('query').value = view.query;
  renderQueue();
  renderSelection();
};
$('role').onchange = () => {
  state.selected.clear();
  $('technician').value = '';
  fieldError('technician', 'technician-error');
  document.body.dataset.role = $('role').value;
  $('export').hidden = $('role').value !== 'admin';
  $('role-notice').hidden = $('role').value !== 'technician';
  renderQueue();
  renderSelection();
  renderDetail();
  notify('Now viewing as ' + $('role').value + '.', ['Selection cleared. Your search, status and saved views are retained.']);
};
$('export').onclick = () => {
  try {
    const csv = model.exportCSV($('role').value);
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = element('a');
    anchor.href = url;
    anchor.download = 'work-orders.csv';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Exported ' + model.list().length + ' work orders.', ['The CSV contains all work orders, including those outside the current filters.']);
  } catch (error) {
    notify(error.message, [], true);
  }
};
document.body.dataset.role = $('role').value;
$('result').tabIndex = -1;
renderQueue();
renderSelection();

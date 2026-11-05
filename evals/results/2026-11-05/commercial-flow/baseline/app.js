'use strict';
const triage = ServiceTriage.create(ServiceModel.create());
const $ = id => document.getElementById(id);
const statusName = status => status === 'all' ? 'All statuses' : status.charAt(0).toUpperCase() + status.slice(1);
let returnFocusId = '';
let openedOrderId = null;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function feedback(title, items = [], type = 'success', focus = false) {
  $('feedback').hidden = false;
  $('feedback').className = 'feedback ' + type;
  $('feedback-title').textContent = title;
  $('feedback-items').replaceChildren(...items.map(text => element('li', text)));
  if (focus) $('feedback-title').focus();
}
function clearFieldError(id, messageId) {
  $(id).removeAttribute('aria-invalid');
  $(messageId).textContent = '';
}
function resetFilters() {
  triage.setFilters('', 'all');
  render();
  $('query').focus();
}
function openDetail(id) {
  try {
    triage.openDetail(id);
    openedOrderId = id;
    returnFocusId = '';
    renderDetail(triage.snapshot());
    $('detail-dialog').showModal();
    $('detail-title').focus();
  } catch (error) { feedback(error.message, [], 'error', true); }
}
function renderDetail(state) {
  const record = state.detail;
  if (!record) return;
  $('detail-id').textContent = 'Work order #' + record.id;
  $('detail-title').textContent = record.title;
  $('detail-fields').replaceChildren();
  for (const [label, value] of [['Customer', record.customer], ['Status', statusName(record.status)], ['Due', record.due], ['Technician', record.assignee || 'Unassigned']]) {
    const pair = element('div');
    pair.append(element('dt', label), element('dd', value));
    $('detail-fields').append(pair);
  }
  $('detail-history').replaceChildren(...record.history.map(entry => element('li', entry)));
  $('draft-note').hidden = record.status !== 'draft';
  $('detail-select').hidden = !state.canEdit;
  $('detail-select').textContent = state.selectedIds.includes(record.id) ? 'Return to assignment' : 'Select and return to queue';
}
function renderRows(state) {
  $('rows').replaceChildren();
  $('selection-heading').hidden = !state.canEdit;
  for (const record of state.records) {
    const selected = state.selectedIds.includes(record.id);
    const row = element('tr', undefined, selected ? 'is-selected' : '');
    const selectionCell = element('td');
    selectionCell.hidden = !state.canEdit;
    const checkbox = element('input');
    checkbox.id = 'select-' + record.id;
    checkbox.type = 'checkbox';
    checkbox.checked = selected;
    checkbox.disabled = !state.canEdit;
    checkbox.setAttribute('aria-label', 'Select work order ' + record.id + ': ' + record.title);
    checkbox.onchange = () => { triage.select(record.id, checkbox.checked); render(); };
    selectionCell.append(checkbox);
    const titleCell = element('td');
    titleCell.append(element('span', '#' + record.id, 'order-number'), element('span', record.title, 'order-title'));
    const statusCell = element('td');
    statusCell.append(element('span', statusName(record.status), 'status status-' + record.status));
    const actionCell = element('td');
    const detailButton = element('button', 'Details', 'text-button order-detail-button');
    detailButton.type = 'button';
    detailButton.id = 'order-' + record.id;
    detailButton.setAttribute('aria-label', 'Details and history for work order ' + record.id);
    detailButton.onclick = () => openDetail(record.id);
    actionCell.append(detailButton);
    row.append(selectionCell, titleCell, element('td', record.customer), statusCell, element('td', record.due), element('td', record.assignee || 'Unassigned'), actionCell);
    $('rows').append(row);
  }
}
function renderSelection(state) {
  $('assignment-area').hidden = !state.canEdit;
  const count = state.selectedIds.length;
  if (!count) clearFieldError('technician', 'technician-error');
  $('selection-summary').textContent = count
    ? count + ' selected' + (state.hiddenSelected ? ' · ' + state.hiddenSelected + ' outside the current results. These are included in assignment.' : ' · All selected work is visible.')
    : 'Select work orders from the queue.';
  $('clear-selection').disabled = !count;
  $('assign').disabled = !count || !state.canEdit;
  $('technician').disabled = !count || !state.canEdit;
  $('assign').textContent = count ? 'Assign ' + count + ' work ' + (count === 1 ? 'order' : 'orders') : 'Assign selected';
  $('selected-review').hidden = !count;
  $('selected-review-label').textContent = 'Review ' + count + ' selected work ' + (count === 1 ? 'order' : 'orders');
  $('selected-list').replaceChildren();
  for (const record of state.selectedRecords) {
    const item = element('li');
    const copy = element('div', '#' + record.id + ' · ' + record.customer + ' — ' + record.title);
    copy.append(element('small', record.status === 'draft' ? 'Draft: complete before assignment.' : statusName(record.status) + ' · ' + (record.assignee || 'Unassigned')));
    const remove = element('button', 'Remove', 'text-button');
    remove.type = 'button';
    remove.id = 'remove-' + record.id;
    remove.setAttribute('aria-label', 'Remove work order ' + record.id + ' from selection');
    remove.onclick = () => {
      triage.select(record.id, false);
      render();
      const next = $('selected-list').querySelector('button');
      (next || $('select-' + record.id) || $('query')).focus();
    };
    item.append(copy, remove);
    $('selected-list').append(item);
  }
  const visibleSelected = state.records.filter(record => state.selectedIds.includes(record.id)).length;
  $('select-visible').checked = state.records.length > 0 && visibleSelected === state.records.length;
  $('select-visible').indeterminate = visibleSelected > 0 && visibleSelected < state.records.length;
  $('select-visible').disabled = !state.records.length || !state.canEdit;
}
function render() {
  const focusedId = document.activeElement && document.activeElement.id;
  const state = triage.snapshot();
  $('query').value = state.query;
  $('role').value = state.role;
  $('viewer').value = state.viewer;
  $('viewer-field').hidden = state.role !== 'technician';
  $('page-title').textContent = state.role === 'technician' ? 'My work orders' : 'Work orders';
  $('page-description').textContent = state.role === 'technician' ? 'Inspect your assigned work and its history.' : 'Review incoming work and assign the next technician.';
  $('role-note').hidden = state.role !== 'technician';
  $('role-note').textContent = 'Showing work assigned to ' + state.viewer + '. Technician access is read-only. The demo technician selector changes the person being previewed.';
  $('permission-summary').textContent = statusName(state.role) + ' access' + (state.role === 'technician' ? ' · ' + state.viewer : '');
  $('export').hidden = !state.canExport;
  $('total-count').textContent = state.counts.all + (state.role === 'technician' ? ' assigned to ' + state.viewer : ' total');
  for (const button of document.querySelectorAll('[data-status]')) {
    const status = button.dataset.status;
    button.setAttribute('aria-pressed', String(status === state.status));
    $('count-' + status).textContent = state.counts[status];
  }
  $('views').replaceChildren(new Option(state.views.length ? 'Choose a saved view' : 'No saved views yet', ''));
  for (const view of state.views) $('views').add(new Option(view.name, view.name));
  $('views').value = state.activeView;
  const constraints = ['Status: ' + statusName(state.status)];
  if (state.query) constraints.push('Search: “' + state.query + '”');
  if (state.role === 'technician') constraints.push('Assigned to: ' + state.viewer);
  $('filter-summary').textContent = state.records.length + ' work ' + (state.records.length === 1 ? 'order' : 'orders') + ' · ' + constraints.join(' · ');
  const filtered = !!state.query || state.status !== 'all';
  $('clear-filters').hidden = !filtered;
  $('empty-state').hidden = state.records.length > 0;
  $('empty-title').textContent = !state.counts.all && state.role === 'technician' ? 'No work assigned to ' + state.viewer : 'No work orders match';
  $('empty-description').textContent = !state.counts.all && state.role === 'technician' ? 'A dispatcher or admin can assign work. You can also preview another demo technician.' : 'Try another search or status to find the work you need.';
  $('empty-clear').hidden = !filtered;
  renderRows(state);
  renderSelection(state);
  renderDetail(state);
  if (focusedId && $(focusedId) && !$(focusedId).disabled && document.activeElement !== $(focusedId)) $(focusedId).focus();
}

$('query').oninput = () => { triage.setFilters($('query').value, triage.snapshot().status); render(); };
for (const button of document.querySelectorAll('[data-status]')) button.onclick = () => { triage.setFilters($('query').value, button.dataset.status); render(); };
$('clear-filters').onclick = resetFilters;
$('empty-clear').onclick = resetFilters;
$('select-visible').onchange = () => { triage.selectVisible($('select-visible').checked); render(); };
$('clear-selection').onclick = () => { triage.clearSelection(); clearFieldError('technician', 'technician-error'); render(); ($('select-visible').disabled ? $('query') : $('select-visible')).focus(); };
$('technician').onchange = () => clearFieldError('technician', 'technician-error');
$('view-name').oninput = () => clearFieldError('view-name', 'view-error');
$('role').onchange = () => {
  triage.setRole($('role').value);
  $('feedback').hidden = true;
  clearFieldError('technician', 'technician-error');
  render();
};
$('viewer').onchange = () => { triage.setViewer($('viewer').value); $('feedback').hidden = true; render(); };
$('views').onchange = () => { triage.applyView($('views').value); render(); };
$('save-view-form').onsubmit = event => {
  event.preventDefault();
  try {
    const view = triage.saveView($('view-name').value);
    clearFieldError('view-name', 'view-error');
    $('save-view-panel').open = false;
    render();
    feedback('View “' + view.name + '” saved.', ['This view restores its search and status for this session.']);
    $('views').focus();
  } catch (error) {
    $('view-name').setAttribute('aria-invalid', 'true');
    $('view-error').textContent = error.message;
    $('view-name').focus();
  }
};
$('assignment-form').onsubmit = event => {
  event.preventDefault();
  const name = $('technician').value;
  try {
    const results = triage.assign(name);
    clearFieldError('technician', 'technician-error');
    const successes = results.filter(result => result.ok).length;
    const failures = results.length - successes;
    render();
    const title = failures ? successes + ' assigned · ' + failures + ' could not be assigned' : successes + ' work ' + (successes === 1 ? 'order' : 'orders') + ' assigned to ' + name;
    const lines = results.map(result => '#' + result.id + ': ' + (result.ok ? 'Assigned to ' + name + ' · Scheduled.' : result.error + '. Kept selected.'));
    if (failures) lines.push('Draft completion is outside this prototype. Review or remove the remaining selection to continue.');
    feedback(title, lines, failures ? 'warning' : 'success', true);
  } catch (error) {
    if (!name.trim()) {
      $('technician').setAttribute('aria-invalid', 'true');
      $('technician-error').textContent = error.message;
      $('technician').focus();
    } else feedback(error.message, [], 'error', true);
  }
};
$('close-detail').onclick = () => $('detail-dialog').close();
$('return-to-queue').onclick = () => $('detail-dialog').close();
$('detail-dialog').addEventListener('close', () => {
  triage.closeDetail();
  const target = $(returnFocusId || 'order-' + openedOrderId) || $('query');
  target.focus();
  returnFocusId = '';
});
$('detail-select').onclick = () => {
  const state = triage.snapshot();
  if (!state.detail || !state.canEdit) return;
  triage.select(state.detail.id, true);
  render();
  returnFocusId = 'technician';
  $('detail-dialog').close();
};
$('export').onclick = () => {
  try {
    const csv = triage.exportCSV();
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = element('a');
    link.href = url;
    link.download = 'work-orders.csv';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    feedback('CSV download requested.', ['Includes all work orders, including those outside the current filters.']);
  } catch (error) { feedback(error.message, [], 'error', true); }
};
render();

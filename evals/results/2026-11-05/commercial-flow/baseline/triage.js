(function (root) {
  'use strict';
  const statuses = ['all', 'new', 'waiting', 'scheduled', 'draft'];
  const roles = ['dispatcher', 'technician', 'admin'];

  function create(model) {
    const state = { query: '', status: 'all', role: 'dispatcher', viewer: 'Lee', activeView: '', detailId: null };
    const selected = new Set();
    const canEdit = () => ['dispatcher', 'admin'].includes(state.role);
    const permitted = record => record && (state.role !== 'technician' || record.assignee === state.viewer);
    const visible = () => model.list(state.query, state.status).filter(permitted);
    const clearUnavailableDetail = () => { if (!permitted(model.detail(state.detailId))) state.detailId = null; };
    const verifyView = () => {
      const view = model.views().find(v => v.name === state.activeView);
      if (!view || view.query !== state.query || view.status !== state.status) state.activeView = '';
    };

    return {
      snapshot() {
        const records = visible();
        const allRecords = model.list().filter(permitted);
        const visibleIds = new Set(records.map(r => r.id));
        const selectedRecords = [...selected].map(id => model.detail(id)).filter(Boolean);
        return {
          ...state, records, views: model.views(), selectedIds: [...selected], selectedRecords,
          hiddenSelected: selectedRecords.filter(r => !visibleIds.has(r.id)).length,
          counts: Object.fromEntries(statuses.map(status => [status, status === 'all' ? allRecords.length : allRecords.filter(r => r.status === status).length])),
          canEdit: canEdit(), canExport: state.role === 'admin',
          detail: state.detailId === null ? null : model.detail(state.detailId)
        };
      },
      setFilters(query, status) {
        if (!statuses.includes(status)) throw new Error('Choose a valid status.');
        state.query = query;
        state.status = status;
        verifyView();
      },
      setRole(role) {
        if (!roles.includes(role)) throw new Error('Choose a valid role.');
        state.role = role;
        selected.clear();
        clearUnavailableDetail();
      },
      setViewer(name) {
        state.viewer = name;
        selected.clear();
        clearUnavailableDetail();
      },
      select(id, checked) {
        if (!canEdit()) throw new Error('Your role cannot assign work.');
        if (!model.detail(id)) throw new Error('Work order not found');
        if (checked) selected.add(id); else selected.delete(id);
      },
      selectVisible(checked) {
        if (!canEdit()) throw new Error('Your role cannot assign work.');
        for (const record of visible()) {
          if (checked) selected.add(record.id); else selected.delete(record.id);
        }
      },
      clearSelection() { selected.clear(); },
      assign(name) {
        if (!selected.size) throw new Error('Select at least one work order.');
        const results = model.assign([...selected], name, state.role);
        for (const result of results) if (result.ok) selected.delete(result.id);
        return results;
      },
      openDetail(id) {
        if (!permitted(model.detail(id))) throw new Error('This work order is unavailable in your current role.');
        state.detailId = id;
        return model.detail(id);
      },
      closeDetail() { state.detailId = null; },
      saveView(name) {
        const view = model.saveView(name, state.query, state.status);
        state.activeView = view.name;
        return view;
      },
      applyView(name) {
        const view = model.views().find(v => v.name === name);
        if (!view) return false;
        state.query = view.query;
        state.status = view.status;
        state.activeView = view.name;
        return true;
      },
      exportCSV() { return model.exportCSV(state.role); }
    };
  }
  const api = { create };
  if (typeof module === 'object') module.exports = api;
  else root.ServiceTriage = api;
})(typeof window === 'object' ? window : globalThis);

# Work-order triage: target experience

## Brief and evidence

The requested outcome is a redesigned, working local triage flow for dispatchers, with technician inspection and admin export preserved. This is a browser prototype with demonstration records and in-memory state; there is no backend or authenticated user identity (`README.md`, `model.js`, observed in source).

The user reports that triage has grown confusing. The original source combines selection, search, status, and assignment in one toolbar, uses “Process selected” and “Info” labels, and gives history an unstructured text block (observed in `index.html`, `app.js`). These observations support reorganizing the task; they do not establish user behavior or measurable usability improvement.

The model permits dispatchers/admins to assign, rejects drafts per record, schedules successful assignments, appends history, saves search/status under a view name, and allows only admin CSV export (observed in source and the supplied model test). Those rules are retained unchanged.

## Target task and experience

A dispatcher starts with open work needing review, finds relevant orders, inspects context/history when useful, selects orders, chooses a technician, and assigns them. Waiting orders can be reassigned under the existing model. Drafts remain visible and explain the existing assignment restriction.

1. **Find work.** The Work orders queue exposes search by order number, title, or customer. All, New, Waiting, Scheduled, and Draft are directly available status filters with scoped counts. A visible summary describes the applied constraints; clearing filters restores the queue.
2. **Review context.** Every row includes the full title, order number, customer, status, due label, assignee, and a descriptive detail action. A native dialog shows the same order identity and its chronological history. Closing or Escape returns to the invoking row. Filters, input, and selection remain in the queue.
3. **Choose work.** Selection has its own area. It names the count, warns about selected orders outside the current filters, and expands to a complete list with remove actions. “Select visible” affects only visible rows. Changing a filter retains selection; clearing selection is explicit.
4. **Assign.** Choose Lee or Sam and use “Assign selected.” The model is called once for the current selection. Successes show the technician and scheduled result, leave selection, and update history. Failures show each order and its original model error, and remain selected. A missing technician preserves selection and receives a field-level correction.
5. **Repeat.** Search/status can be saved and restored beside the filters. A repeated view name replaces that view, as in the existing model. Saved views and work changes last until refresh. Admins can export all records, including records outside the current filters.

## Capability preservation

| Existing capability/information | Target location or behavior |
| --- | --- |
| Search by ID, title, customer | Labeled search above the queue; existing model search |
| Every status, including waiting and draft | Direct status controls; default is All |
| Order ID, complete title, customer, status, technician, due | Queue and full detail dialog |
| Multiple selection | Row checkboxes, select-visible control, explicit selection review |
| Assignment and partial outcomes | Assignment area and per-order result list; model errors preserved |
| Assignment history | Ordered history inside order detail |
| Saved search and status | Saved-view selector and Save current view form |
| Dispatcher/admin edit boundary | Assignment controls restricted; model authorization still called |
| Technician inspection | Read-only queue scoped to chosen demo technician; no assignment/export controls |
| Admin-only export | Header action explicitly exports all work orders |

## Decisions and boundaries

- Use a table for common-attribute comparison. At narrow widths, keep the semantic table inside a labeled, horizontally scrollable region; no data columns are removed. Controls wrap into a vertical layout and long titles wrap.
- Keep details in a native modal dialog because this is a supporting inspection task. It adds no URL route/history entry. Focus starts on its heading, Escape/Close dismiss it, and focus returns to its opener. Browser Back retains ordinary browser navigation semantics.
- Technician identity is absent from the model. The prototype therefore exposes an explicit “Demo technician” choice when role is technician and scopes displayed records to that assignee. This is a UI simulation, not authentication. Model authorization and business rules are unchanged.
- Selection is retained across filter/view changes with an explicit hidden-selection count. Switching demo role or technician clears selection to avoid crossing actor context.
- No draft-completion editor, backend persistence, customer administration, or billing workflow is introduced. The supplied model has no draft-completion operation; the draft guidance states this limit.
- Sources support the component choices conditionally; no participant study or conversion claim is implied.

## Checks planned before implementation

| Expectation | Method and conditions | Initial status |
| --- | --- | --- |
| Existing model rules remain intact | Supplied Node test and unchanged-file hash | unverified |
| Filtering, saved views, selection visibility, partial assignment and history remain coherent | Node tests of the controller using the real model | unverified |
| Technician/admin boundaries and CSV scope match requirements | Controller/model regression tests | unverified |
| Needed information, labels, dialog associations, and focus return are represented | Source/markup checks | unverified |
| Keyboard dialog containment, Escape, actual focus restoration, responsive geometry, download completion, and assistive-technology announcements | Requires a browser; no usable browser available | unverified |

Actual results are recorded in `CHECKS.md` after execution.

## Relevant sources

- Supplied `README.md`, `model.js`, `model.test.js`, and original interface source: product scope and rules.
- [IBM Carbon: Data table](https://carbondesignsystem.com/components/data-table/usage/): common attributes, selection and batch operations; used as component guidance.
- [WAI-ARIA APG: Modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): content-sensitive initial focus, Escape, contained traversal and focus return; informative guidance, not a complete accessibility audit.
- Local Design Interface package and its inspection, planning, build, and check modules: task/evidence separation, capability preservation, and bounded verification.

# Work-order triage: target experience

## Brief and boundaries

Dispatchers start with an open queue, find work by customer, title or number, inspect a work order and its history, then assign one or several orders to a technician. Admins have the same assignment tools plus export. Technicians inspect the records exposed by the existing prototype with read-only controls. This delivery covers the connected queue, detail and assignment flow on desktop and mobile browsers.

`model.js` remains the source of business rules. Customer administration, billing, authentication, draft editing and backend persistence are outside scope. The prototype has no authenticated technician identity or record-level visibility rule; this redesign does not invent either. Existing data and saved views remain session-only, as in the original model.

## Evidence and scope

| Evidence | Status | Design consequence |
| --- | --- | --- |
| The README names assignment, history, saved search/status views and admin export as required. | Observed project requirements | Preserve every capability and its role boundary. |
| The original table has a fixed 1150px width; titles can be long; the header text is light gray. | Observed source | Use a flexible queue with wrapping titles, readable type and a single-column narrow layout. Visual results require browser review. |
| Selection persists when filters change, but the original screen has no count or disclosure of hidden selections. | Observed source | Keep selection across filters and show every selected record in the assignment panel, with an outside-view count. |
| “Process selected,” “Info,” and “Presets” obscure the concrete actions. Detail/history lives far below the queue. | Design assessment from source | Use task labels and a queue/detail workspace. |
| The model accepts new, waiting and scheduled orders; drafts return a per-record error. | Observed model and existing tests | Preserve partial results, retain failed items and explain draft limitations. |
| No local browser executable is available. | Reported environment limit | Verify source and programmatic behavior; leave rendering, physical keyboard navigation and assistive-technology checks unverified. |

The chosen scope is a connected flow. The original problems concern finding, comparison, selection, assignment feedback and return from details; a cosmetic change alone would leave these dependencies unresolved.

## Chosen design, before implementation

### Desktop queue and detail

A quiet slate header contains the product name and the labeled demo role switch. The main heading is **Work orders**, followed by **Find work, review the details, and assign a technician.** Admins see **Export all CSV** beside the heading; its scope is the complete model dataset.

The workspace uses a broad queue and a narrower detail pane. The queue begins with a visible search label, a saved-view selector and **Save current view**. A group of status buttons exposes **All work / New / Waiting / Scheduled / Drafts**, with counts for the current search. These are filter buttons, not navigation tabs. A result count and text summary make the current constraints explicit.

Each row aligns five things: selection, work order (full title, number and customer), status, technician and due date. Text wraps. Due labels stay exactly as supplied by the model; no inferred overdue state or priority is added. The title is the explicit detail action. Selection and opening details are independent.

The detail pane shows the number and full title, customer, status, due date, assignee, a permitted assignment form and the complete ordered history. **Back to queue** returns focus to the originating order, or the queue heading when it is no longer visible. Details are an in-page region; opening them retains all filters and selection.

### Selection and assignment

Selecting any row reveals the assignment panel above the queue. It names all selected orders, identifies selections outside the current results, allows individual removal or clearing, and contains one labeled technician selector and **Assign selected**. The select-all control affects only currently shown rows and has a mixed state.

Technician selection starts empty. A missing technician produces a linked inline error and focus on the field. A selected draft gets advance guidance; submitting still delegates all selected IDs to the unchanged model. Each result names the affected order. Successful IDs leave the selection; failures remain selected. The list, counts and open detail refresh from current model data. Reassignment remains permitted for scheduled work. A successful assignment changes status to scheduled and appends the existing model's history entry.

### Narrow layout

Controls wrap and stretch; rows become vertically grouped entries with visible metadata labels. The same content and actions remain available. The detail region follows the queue. Opening a title focuses its detail heading and scrolls the region into view; **Back to queue** returns to the invoking row. No modal or separate navigation destination is introduced.

### Significant states

| State | Visible treatment and continuation |
| --- | --- |
| Nothing selected | Selection panel is absent; count and select-all control remain by the queue. |
| No matching orders | Explain which filters produced zero results and offer **Clear filters**. |
| Active saved view modified | Selector returns to **Custom view**; entered query and chosen status remain visible. |
| Save view | Inline form, descriptive name, replacement behavior explained; save/cancel return focus to the invoking control. |
| Partial assignment | Successes and failures listed separately by order; failed selection is retained. |
| Draft detail | Explicit completion requirement; no fabricated draft-completion action. |
| Technician role | Read-only explanation; assignment and selection controls unavailable; details, history and saved views accessible. |
| Admin export | Export all records with the model's existing CSV schema and feedback naming the count. |

## Alternatives and concept review

A separate detail page would provide more space but introduce a navigation transition for the compact content in this prototype. A permanent queue/detail composition keeps the current search and comparable fields alongside the record. The narrow layout retains the same content in sequence. A board was considered unsuitable here because comparison, long text and batch operations are central to the supplied task.

The concept addresses the original confusion through explicit language, task-based grouping, full selection scope and per-record outcomes. It retains useful comparison fields, every lifecycle state, saved views, history, reassignment and export. No necessary existing capability is removed. This is an expert design walkthrough, not observed user research.

## Professional research and decision effects

- [IBM Carbon — Data table guidance](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines), read 5 November 2026 (page updated 30 September 2026): enterprise selection, mixed select-all, batch actions and contextual detail guidance informed the queue and explicit batch panel. This is design-system practice, not evidence about these dispatchers.
- [W3C WAI — User Notification](https://www.w3.org/WAI/tutorials/forms/notifications/), read 5 November 2026: concise completion feedback, actionable inline errors and focus on invalid input informed assignment and saved-view feedback. Accessible announcements need browser/assistive-technology verification.
- [W3C — Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), read 5 November 2026: preservation of content and function at narrow widths informed wrapping controls and stacked entries. Source inspection is not a conformance test.

## Verification plan

Run the existing model tests unchanged. Exercise actual application event handlers in a dependency-free simulated DOM for finding, filter-safe selection, select-all, detail/history refresh, single and partial batch assignment, role changes, saved-view replacement and CSV download scope. Parse HTML for IDs and labels; check JavaScript syntax and local asset references. Record the actual results in README.md. Browser rendering, zoom, physical focus/keyboard behavior and screen-reader announcements remain unverified in this environment.

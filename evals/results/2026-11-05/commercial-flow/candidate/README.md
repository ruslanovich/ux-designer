# Service operations — work-order triage

A redesigned local dispatch prototype. Open `index.html` through any static server. All records are demonstration data, and there is no backend. The existing `model.js` implements the product rules and is unchanged.

## Delivered experience

- **Queue and contextual details:** search by customer, title or number; filter every status; review full titles, customer, technician and due date; open details with complete history; return to the originating work order.
- **Explicit assignment:** select individual orders or all shown rows, review all selected IDs, choose a technician and assign. Selection remains visible in the assignment panel when filters hide its records. The panel reports how many selections are outside the current view.
- **Partial outcomes:** eligible work moves to Scheduled and history updates. Successful orders leave the selection. Draft failures remain selected, with their original model error and the prototype's draft-editing limitation.
- **Preserved roles:** dispatchers and admins assign; technicians have read-only assignment controls; only admins export. The model still enforces assignment and export permissions. The demo role switch is not authentication. The model has no authenticated technician identity or per-record visibility rule, so the interface does not add one.
- **Saved views:** retain a search and status, reapply them, and update a view by saving its existing name. Cancel leaves saved views unchanged. Views and record changes have the original session-only lifetime.
- **Admin CSV:** exports the complete model dataset using the original CSV schema, regardless of the current filters.
- **Narrow screens:** controls wrap, queue rows become grouped entries with metadata labels, and the detail region follows the queue. The source includes focus return, visible focus styling and status announcements.

Customer administration, billing, draft editing and backend changes remain outside this task.

## Target experience and design decisions

[Open the authored target-experience preview](target-experience.svg). The preview illustrates the selected queue/detail layout and partial assignment continuation; it is not a browser screenshot, and it shows representative queue rows.

[Read the design record](DESIGN.md) for the initial findings, chosen composition, alternative considered, preservation map, significant states and source-backed decisions. The implemented `index.html` is the interactive target experience.

The principal decisions are a shared queue/detail workspace, full visibility of selection scope, concrete action labels, per-record assignment results, and explicit placement of saved views and admin export. Full titles and all required metadata remain available. Due labels are preserved as supplied, without inferred dates or priority.

## Run

From this directory:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080/` in a browser. No package installation or build step is needed.

## Checks actually performed

```sh
node model.test.js
node app.test.js
node --check app.js
node --check app.test.js
```

All passed. The original model tests cover filtering, drafts, role restrictions, partial assignment, history, saved views and CSV export. SHA-256 comparison confirmed `model.js` and the original `model.test.js` remained byte-for-byte unchanged.

`app.test.js` executes the actual application event handlers with a dependency-free simulated DOM. It covers search and empty-state recovery, selection retained across filters, mixed and visible-only select-all, opening and returning from details, missing-field errors, saved-view restoration/replacement/cancellation, single reassignment, partial assignment with draft preservation, fresh history, role changes, a stale form obeying model permissions, and full-dataset CSV content and download naming. Focus-target assertions concern the simulation only.

Additional executed checks:

- HTML parsing: unique static IDs, explicit input/select labels, existing label targets and local script/style references.
- XML parsing of `target-experience.svg`.
- Temporary local HTTP server: `index.html`, `styles.css`, `app.js`, `model.js` and the SVG all returned HTTP 200 with content. The server was stopped afterwards.
- Calculated text-color contrast for body, secondary text, primary action, all four status badges and error text: 5.58:1 to 15.36:1. The selected focus-outline/white pair is 5.17:1 and input-border/white is 3.29:1. These are token calculations, not a full rendered accessibility assessment.

## Verification limits

No usable local browser executable was available, and no browser or client was installed. Browser layout, clipping, zoom/reflow, native keyboard traversal, actual scrolling/focus behavior, download delivery and screen-reader announcements remain unverified. The targeted follow-up is to exercise the queue → details → assignment → return path at a wide viewport and 320 CSS pixels, then repeat with keyboard and a screen reader. No user study was conducted.

## Relevant professional sources

- [IBM Carbon — Data table guidance](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines): selection, mixed select-all, batch operations and contextual detail.
- [W3C WAI — User Notification](https://www.w3.org/WAI/tutorials/forms/notifications/): completion feedback, recoverable inline errors and invalid-field focus.
- [W3C — Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): preserving content and function at narrow widths.

These sources informed the design. They do not establish observed dispatcher usability or full accessibility conformance.

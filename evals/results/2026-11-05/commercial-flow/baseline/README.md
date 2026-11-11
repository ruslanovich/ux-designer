# Service operations

A local dispatch prototype. Open index.html with a static server. All records are demonstration data and there is no backend. The model implements the current product rules.

Dispatchers triage open work orders, assign a technician, and inspect history. Technicians can inspect their assigned work; admins can export. Keep role boundaries, saved views, history, and CSV export. Saved views retain a chosen search and status. Draft or waiting work must remain reachable. Work-order detail may be redesigned inside this scope. Customer administration, billing, and a backend rewrite are outside scope.

Run `node model.test.js` to check model rules. Browser behavior requires a separate browser check.

## Redesigned triage

The implemented target experience is documented in `DESIGN.md`; actual checks and their limits are in `CHECKS.md`.

- Search and status filters sit beside saved views. Every state remains reachable.
- Select orders, review the full selection (including orders outside current filters), and choose a technician. Successful assignments clear from selection; failed drafts remain with their model error.
- Details include the complete order and its chronological history. A native dialog keeps the current queue context.
- Technician mode scopes the queue to the selected **demo** technician. This local role switch is not authentication. Admin mode exposes CSV export of **all** work orders.
- All data and saved views remain in memory until refresh, matching the original prototype.

Start a local preview from this directory with `python3 -m http.server 8000`, then open `http://localhost:8000`. The application uses local files and has no external runtime dependencies.

Run the focused checks with:

```sh
node --check app.js
node --check triage.js
node model.test.js
node --test triage.test.js
```

The Node tests cover model/controller logic. Rendering, native dialog keyboard behavior, event wiring in a browser, and download completion need the focused browser follow-up in `CHECKS.md`.

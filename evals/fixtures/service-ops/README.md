# Service operations

A local dispatch prototype. Open index.html with a static server. All records are demonstration data and there is no backend. The model implements the current product rules.

Dispatchers triage open work orders, assign a technician, and inspect history. Technicians can inspect their assigned work; admins can export. Keep role boundaries, saved views, history, and CSV export. Saved views retain a chosen search and status. Draft or waiting work must remain reachable. Work-order detail may be redesigned inside this scope. Customer administration, billing, and a backend rewrite are outside scope.

Run `node model.test.js` to check model rules. Browser behavior requires a separate browser check.

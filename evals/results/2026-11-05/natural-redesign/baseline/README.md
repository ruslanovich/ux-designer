# My Reading

A redesigned local reading-list prototype for one person tracking books and long articles. It starts with demonstration content. There is no backend or account.

## Run

Serve this directory with a static server, for example:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. Serving over HTTP gives browser storage a stable origin; use the same host and port to return to the same saved list.

## What it does

- Add a title with an optional author. New entries start in **To read**.
- Search titles and authors within **Reading list** or **Archive**.
- Filter by **To read**, **Reading**, or **Finished** and change status on any entry.
- Archive, restore, or undo the latest archive/restore action.
- Keep independent search and status filters in each view during the session.
- Keep an unfinished add form when cancelling and reopening it.
- Persist the original model schema under the existing `reading-list` local-storage key.
- Retain unsaved changes in the current session if storage fails, with a retry action. Unreadable existing storage is protected from overwriting.

The layout adapts to narrow screens. Native controls, visible labels, a skip link, text feedback, and focus handling are implemented; browser and assistive-technology behavior still need direct verification in a browser environment.

## Checks

```sh
node model.test.js
node reading-state.test.js
node --check app.js
node --check reading-state.js
```

The supplied model test covers the original data operations. The controller tests cover composition of searching/filtering, view retention, adding from Archive, archive/restore/undo, reload persistence, storage errors, retry, and unreadable-data protection. They do not exercise a rendered browser interface.

`DESIGN.md` records evidence, the preservation map, design decisions, references, and the checks actually performed.

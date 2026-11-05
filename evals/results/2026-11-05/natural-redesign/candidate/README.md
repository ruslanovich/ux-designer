# My Reading

A local reading-list app for one person keeping track of books and long articles. The initial collection is demonstration content. There is no backend or account, and there are no external runtime dependencies.

## Run

Serve this directory with a static server, for example:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. Continue using the same browser and origin to access its saved collection.

## What the app supports

- Add a title and optional author. New items start in **To read**.
- Search titles and authors within **Reading list** or **Archive**.
- Filter by **To read**, **Reading**, or **Finished**.
- Change an item's status, archive it, or restore it without losing its status.
- Undo an archive or restore operation from its confirmation message.
- Keep search and status filters while switching between collections.
- Save changes to the existing `reading-list` browser-storage key. The original `model.js` data model and schema are unchanged.

The inline add form keeps its draft when cancelled. A successful addition returns to the unfiltered reading list and focuses the new title. Empty collections, empty search results, invalid titles, and actual storage failures have explicit feedback. If existing storage cannot be read, the original data is not overwritten; the page offers an example session whose changes remain in memory.

The interface uses local system fonts, wrapping titles, text-labelled native controls, and responsive CSS. No separate reader, cover service, account, or sync feature is implied.

## Checks

```sh
node --check app.js
node model.test.js
node app.test.js
```

`model.test.js` checks the original data-model operations. `app.test.js` executes the actual application script with a small DOM contract and simulated browser storage. It checks application-state transitions, focus requests, validation, and recovery. It does **not** run a browser or validate rendered layout, native keyboard traversal, zoom, localStorage in a real browser, or assistive-technology behavior.

The redesign rationale, applied sources, and verification scope are recorded in `DESIGN.md`.

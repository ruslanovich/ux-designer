# Reading-list redesign

## Working context

**Brief — reported:** Redesign the supplied local, single-person app for books and long articles while retaining adding, title/author search, reading status, archive/restore, the existing data model, and local persistence. Deliver implementation and proportionate verification. No backend or account is available; initial data is demonstration content.

**Observed in source:** `README.md`, `index.html`, `app.js`, `model.js`, and `model.test.js` were read. The current layout requires an 800px main region beside a 190px sidebar; title text is 12px in three narrow columns, author text uses `#aaa` on white, and a large greeting dominates the content. Labels mix “My books”, “Old things”, and “Items”. Search actually applies to the selected collection despite “Search everywhere”. Empty results lack an explanation. Saving can throw without useful feedback. Native status selects and a small data model are useful foundations.

**Reported constraint:** No usable browser executable is available and a prior download failed. Do not install browsers or clients. Rendered layout, real keyboard traversal, browser storage behavior, screen-reader announcements, and zoom behavior require a later browser check; source and programmatic checks support narrower conclusions.

**Decision:** Redesign the connected reading-list and archive views. The shared composition, naming, collection presentation, capture flow, and feedback account for the source-level problems. A product restructuring is unnecessary for this compact app.

## Research applied

Question: which collection presentation and interaction states suit finding and managing a small personal collection of text items, including very long titles?

- Page Laubheimer, NN/g, *Cards: UI-Component Definition* (2016), https://www.nngroup.com/articles/cards-component/ — read the substantive article. Its practitioner guidance and illustrated scanning observations support a predictable vertical list for common title/author/status attributes. Cards remain useful for visually heterogeneous discovery. This app has no covers or detail pages, so a vertically aligned list is the chosen direction; this is a design judgment, not a measured user result.
- W3C WAI, *Understanding SC 1.4.10: Reflow*, https://www.w3.org/WAI/WCAG22/Understanding/reflow.html — read the explanation and criterion. It informs removal of fixed minimum page width, text wrapping, and stacked controls at narrow widths. Real rendering at 320 CSS pixels and zoom remains unverified without a browser.
- W3C WAI, *Forms Tutorial: User Notifications*, https://www.w3.org/WAI/tutorials/forms/notifications/ — read the guidance for clear success/error feedback, field-associated errors, and focus on the invalid field. It informs inline title validation, retained drafts, success announcements, and truthful storage feedback. This is web accessibility guidance, not product-specific evidence.

## Chosen design before implementation

### Composition and visual direction

Use a centered reading workspace with an off-white page, white content surface, dark ink, a restrained forest-green primary action, warm neutral borders, and semantic status colors accompanied by text. Serif headings give titles a reading-oriented character; system sans-serif text keeps labels and controls legible. Use spacing and alignment to separate navigation, finding, content, and actions. Avoid decorative cover images because the data contains no cover or item-type fields.

The header contains the app name and browser-storage status. The main title and “Add a read” action precede two collection controls: “Reading list” and “Archive”, each with its total. A disclosed inline form sits beside the originating action in document order. Search has an explicit collection label. Text-labelled status filters sit immediately above the results. Each item displays its full title, author (or “No author added”), native status select, and Archive or Restore button. A single action message offers Undo after archiving/restoring until another data-changing action replaces the message.

At narrow widths, header and search regions wrap, rows place their controls below the title, filter controls wrap, and all information remains in document flow. No title truncation or fixed page minimum width.

### Alternatives considered

A grid of cover-style cards would emphasize browsing but provide little useful imagery with this model and constrain long titles. A table would emphasize comparing several columns, while this task's main content is one title with supporting author. Choose a list with consistent status/action placement and full-width title space.

### Required capability mapping

| Existing capability | Chosen location and behavior |
| --- | --- |
| Add title and optional author | “Add a read” opens an inline form; required Title and optional Author retain drafts when cancelled. Invalid input keeps the form open and focuses Title. |
| Search title/author | Search field labels its current collection; clear action restores all query results. |
| Reading status | Native per-item select with “To read”, “Reading”, and “Finished”; model values remain `queued`, `reading`, `finished`. |
| Archive | Explicit item action; active list updates, feedback confirms the title, Undo restores it. |
| Restore | Explicit Archive item action; status is retained, feedback and Undo are available. |
| Persistence | Same `reading-list` localStorage key and original model fields. Failures preserve in-memory work and display an actual failure message. |
| Long titles/articles | Full wrapped text with the same functions and metadata as books. |

### Transitions and exceptions

- Collection switching is a same-page collection filter, with selected state exposed through native buttons and `aria-pressed`; no new route is introduced, and focus stays on the activated collection control. Each collection retains its own search and status selection during the session.
- Add opens the inline form and focuses Title. Cancel or Escape closes it, retains the draft, and returns focus to the trigger. Saving a valid item returns to the unfiltered reading list so the new item is visible, closes and clears the form, announces completion, and focuses its title.
- Updating status refreshes filter counts, preserves focus on the item's select when visible, and otherwise returns focus to the selected status filter.
- Archive/restore refreshes the selected collection and moves focus to the next item's action or the heading when empty. Undo reverses that action and brings the restored item into view in its original collection.
- No matches, an empty reading list, and an empty archive have distinct explanations and relevant recovery actions.
- Unavailable storage is reported only when an actual read/write fails; write retry is available. Invalid saved data is not overwritten, and the app clearly identifies the temporary example session.

## Concept review

The chosen list resolves the cramped title space; explicit collection labels resolve the search-scope mismatch; consistent names connect status, navigation, and actions; wrapping controls address the source-level minimum-width constraint; visible validation and recovery cover adding and empty results. All required model operations remain accessible in both collections. These are expert design judgments based on source inspection and the chosen plan. Actual comprehension and visual comfort have not been measured.

## Executed checks and remaining limits

| Expectation | Method and conditions | Status |
| --- | --- | --- |
| Existing model behavior is preserved | `node model.test.js` passed. `model.js` and its original tests were left unchanged. | supported_in_conditions |
| Add, search, status, archive/restore, Undo, view switching, and validation use the real app handlers correctly | `node app.test.js`: 11 scenario groups passed against the actual application script, a small DOM contract, and simulated storage. These include focus requests, drafts, long text, literal markup input, and adding from a filtered archive. | supported_in_conditions |
| Existing storage reloads; failures do not crash or falsely claim a save | Harness checks passed for reload, empty saved lists, failed writes, retries, unreadable storage, malformed JSON, and invalid row structures. Original unreadable data remains unchanged. | supported_in_conditions |
| Valid JS and coherent document semantics | `node --check` passed for app, model, and app tests. HTML inspection found 39 unique IDs, valid label and ARIA references, labelled inputs, one main region and h1, and all local dependencies. CSS source includes wrapping and narrow-layout rules. This is a source check. | supported_in_conditions |
| Selected palette pairs maintain readable contrast | Calculated nine chosen text pairs at 5.00–11.27:1, four control-border pairs at 3.23–3.72:1, and the focus outline at 5.59:1 on white. This covers the stated pairs, not a full accessibility audit. | supported_in_conditions |
| Static app assets can be served | A temporary local Python HTTP server returned 200 with the expected content types for index.html, styles.css, model.js, and app.js. The server was stopped after the check. | supported_in_conditions |
| Long content, 320px reflow, zoom, visual polish, native keyboard behavior, real browser persistence, and assistive technologies | Requires a real browser; unavailable here. The DOM-contract harness does not model rendering or browser-native behavior. | unverified |

## Verification corrections and delivery

The first contrast calculation exposed control borders below 3:1 on tinted status backgrounds. The border color was darkened from `#8a988f` to `#7a887e` and all four relevant pairs were recalculated. The selected status filter also uses a dark outline. Source review identified that a read failure could otherwise lead to overwriting an unread existing list; such sessions now preserve the original storage and clearly identify in-memory work. Initial example content says “Saves in this browser” until a save has actually happened.

The implementation is in `index.html`, `styles.css`, and `app.js`. `app.test.js` records the bounded programmatic checks, and `README.md` describes use and check limits. All edits remain inside this project; skill files are unchanged. The source-level concept and capability review found no remaining missing required operation. The selected visual design is implemented in CSS, but its rendered appearance remains unverified.

A later browser check should open the static app at desktop and 320 CSS-pixel widths, inspect the long article and expanded form at increased text/zoom, and execute Add/Cancel, filtered status changes, Archive/Undo, Restore, and reload using native keyboard controls. No browser or client was installed for this work.

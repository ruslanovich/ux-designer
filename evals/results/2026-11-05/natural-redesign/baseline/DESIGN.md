# Reading-list redesign

## Brief and evidence

The requested outcome is an implemented redesign of this single-person browser prototype, preserving adding, title/author search, reading status, archive/restore, the existing model, and local persistence.

- **Reported:** the current app feels rough and confusing (task).
- **Observed in source:** `README.md` identifies books and long articles, demonstration data, and no backend/account. `app.js` searches only the selected archive state although the old label says “Search everywhere.” `index.html` has an 800px minimum content width, three narrow columns, and vague “Old things” navigation. `model.js` supports all required actions and has no content-type or cover fields.
- **Observed in execution:** the original `node model.test.js` passes.
- **Hypothesis:** a full-width list will support finding titles and manipulating status more clearly than the current small cards. This is a design judgment, not user-research evidence.
- **Unknown:** rendered browser behavior, user comprehension, and assistive-technology behavior. The supplied environment has no usable browser; browser installation is out of scope.

## Plan before implementation

Use an editorial reading-room appearance: warm paper, dark ink, restrained green, serif headings, and plain system UI controls. Retain English product language from the supplied app.

Primary task: one person opens their list, finds a book or long article, updates its reading status, or adds a new title. Supporting tasks are clearing a search, archiving an item, finding it in Archive, and restoring it.

| Preserved capability | Planned location and behavior |
| --- | --- |
| Add title and optional author | Prominent “Add a read” button opens a short inline form. Title is explicitly required. Cancel/Escape preserves the draft for reopening. Success opens Reading list, clears its filters, and focuses the added title so the result is visible. |
| Search title and author | Labeled search above the list, scoped explicitly to Reading list or Archive. Queries are retained independently in the two views. |
| Reading status | Native select on every item, including archived items; values remain `queued`, `reading`, `finished`, displayed as “To read”, “Reading”, “Finished”. |
| Archive/restore | Text action on each item. Reversible actions show an Undo control. Restore retains reading status. |
| Local persistence | Existing `reading-list` key and model schema. Failed writes preserve the current session and provide Retry saving. Unreadable existing data is not overwritten. |
| All supplied content | Full titles/authors wrap; no invented item types, covers, or progress percentages. |

Reading list and Archive are hash destinations with an explicit selected state and independent in-session search/status constraints. Back/Forward changes the view; filtering does not add history. Status filters expose their selected value and counts. Empty list, empty archive, and no matches have relevant next actions. Search feedback is announced without moving focus. Removing a row moves focus to an adjacent surviving action or the list summary. Undo returns to the originating view and constraints.

Desktop uses a narrow navigation rail and a readable list. At narrower widths the rail becomes a compact header, controls wrap, and item actions move below the title. No content min-width or truncation is planned. Native links, buttons, inputs, selects, visible labels, a skip link, and visible focus indicators support keyboard operation.

## Planned checks (initially unverified)

- Run the supplied model test again.
- Exercise controller actions in Node with controlled storage: add/validation, title and author search, status filtering, archive/restore/undo, independent view state, reload persistence, empty data, failed storage, retry, and invalid stored data protection.
- Check JavaScript parsing and markup relationships; examine CSS for fixed-width constraints and contrast values.
- Verify static-server delivery of all local assets.
- Keep actual layout at narrow widths/zoom, keyboard traversal, hash Back/Forward, native selects, and screen-reader announcements unverified until a browser is available.

## Sources used for applicable decisions

- [W3C: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): source for preserving content and functions at a 320 CSS px equivalent width; the intended layout still needs a browser check.
- [W3C: Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html): visible labels and required/optional field instructions.
- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage): origin-based persistence and storage access exceptions. Serve this prototype over HTTP rather than relying on file-URL storage behavior.

## Verification results

| Check | Observation and conditions | Status |
| --- | --- | --- |
| Original model regression | `node model.test.js` passed before and after the redesign. `model.js` and its original test remain unchanged. | supported_in_conditions |
| Controller behavior | `node reading-state.test.js`: 10 scenario groups passed in Node, using controlled storage objects. Covers valid/empty saved data, title validation, optional author, scoped search, composed filters, independent view state, status persistence, archive/restore/undo, status edits in Archive, write failure/retry, unreadable-data protection, and no results. | supported_in_conditions |
| JavaScript syntax | `node --check` passed for `app.js`, `reading-state.js`, and `model.js`. | supported_in_conditions |
| HTML source relationships | Python HTML parser found 40 unique IDs; all explicit labels, ARIA relationships, local dependencies, and 34 literal DOM lookups resolve. This is source analysis, not an accessibility-tree or browser check. | supported_in_conditions |
| Static serving | A temporary Python HTTP server returned HTTP 200 with nonempty bodies and correct content types for all five runtime assets. | supported_in_conditions |
| Palette | Calculated 10 selected text/background pairs at 4.72:1–12.85:1 and five control/focus pairs at 3.29:1–5.26:1. Corrected four initially weak text combinations. Values are numerical checks of the specified palette, not sampled browser pixels. | supported_in_conditions |
| Responsive CSS | Reviewed grid wrapping, text wrapping, breakpoints, action placement, minimum control sizes, and absence of the old fixed content minimum. No CSS parser was available. | supported_in_conditions (source only) |
| Browser behavior | No browser was run. Narrow-width/zoom rendering, keyboard order and focus, Back/Forward, native-select behavior, and screen-reader announcements remain unverified. A focused follow-up should exercise add → search → status → archive → undo → restore at 320px and desktop widths, including keyboard-only use. | unverified |

The plan was implemented without a capability removal. The small controller layer uses the unchanged data model and storage key, and makes storage failures testable without pretending to execute a browser. No external dependencies or browser/client installations were introduced.

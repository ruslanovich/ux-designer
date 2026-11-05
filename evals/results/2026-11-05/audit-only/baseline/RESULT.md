# Reading-list interface audit

**Recommended order:** make the reading list usable on narrow screens, correct text contrast, and make saving reliable. Then clarify collection/search state and finish the feedback paths for adding, archiving, and restoring.

This is an audit of the supplied local prototype. Application and skill files were left unchanged.

## Scope and evidence

The [README](README.md) defines a single-person tool for books and long articles, with demonstration content, local persistence, and no backend or account. Required capabilities are adding, searching, changing reading status, and archiving/restoring. The existing record shape and `queued`, `reading`, `finished` values should remain compatible.

Inspected: [index.html](index.html), [app.js](app.js), [model.js](model.js), [model.test.js](model.test.js), and the README. Evidence below distinguishes source inspection, executed programmatic checks, and proposed changes. No screenshots or participant evidence were supplied. No browser was run; actual layout, keyboard focus, and assistive-technology behavior remain unverified.

**Working task model:** the person records a book/article, finds it later by title or author, updates its reading status, moves it out of the current collection, and restores it when needed. These scenarios follow the supplied capabilities. Their frequency and the person's preferred browsing style are unknown.

## Main changes

### 1. High priority — Remove the fixed-width barrier

**Observed in source:** `.work` has `min-width:800px`; `.menu` is 190px wide with shrinking disabled. Together with the 3px gap and 16px horizontal padding, the layout requires at least **1,009 CSS px**. There is no responsive breakpoint, and cards always use three columns. This is a demonstrable source constraint for a small screen; its rendered appearance was not measured. [index.html](index.html)

**Recommend:** let the main region shrink, wrap navigation and search above the collection on narrow screens, and allow the add form and item controls to stack. Preserve full titles, authors, statuses, and Archive/Restore access. The supplied long article title is a useful stress case.

A one-column list is a reasonable starting design for these text records, with actions alongside the item on wide screens and wrapping below on narrow screens. This is an expert recommendation based on the current information, not evidence of a user preference.

**Acceptance check:** complete add, search, status change, archive, and restore at 320, 390, 768, and 1280 CSS px; also check 200% text sizing and 400% browser zoom. WCAG 2.2 SC 1.4.10 establishes the applicable reflow condition at 320 CSS px. [W1]

### 2. High priority — Make reading content legible and prominent

**Measured from declared CSS colors:**

| Text | Color pair | Calculated contrast |
| --- | --- | --- |
| Item title, 12px normal weight | `#777777` on `#ffffff` | **4.478:1** |
| Author, 12px | `#aaaaaa` on `#ffffff` | **2.323:1** |
| Archive button | `#ffffff` on `#6739f5` | **6.034:1** |

Title and author text fall below the **4.5:1** threshold for normal text; 4.478 must not be rounded into a pass. This is a source-color calculation, not a complete accessibility audit. [index.html](index.html), [W2]

The CSS also gives the welcome banner 28px text and 35px padding while item titles are 12px and reading selectors are 10px. **Recommend:** give the list heading, titles, and Add item action the strongest hierarchy; reduce the greeting's footprint; darken secondary text and use consistent, comfortably readable typography. A 16px base is a proposed starting point to verify, rather than a universal minimum. Consolidate the green, orange, yellow, and purple surfaces so color supports grouping and state.

**Acceptance check:** recalculate final text pairs, inspect long titles and authors, resize text, and measure actual control sizes in a browser. Current source inspection does not establish touch-target conformance.

### 3. High priority — Make the local save promise dependable

**Reproduced in a Node handler simulation:** mutations happen before `persist()`. An injected write failure during Add leaves a new record in memory while the displayed list remains unchanged. Retrying Add creates a second identical record. Status and Archive failures escape their handlers without an error notice; Archive can leave the model and displayed list inconsistent. The static footer continues to say “Saved on this device.” [app.js](app.js)

Also reproduced: invalid JSON silently loads demonstration records; valid JSON with the wrong shape, such as an object instead of an array, aborts initialization. [app.js](app.js), [model.js](model.js)

**Recommend:** use one consistent save path for all mutations. Prepare a candidate state using the existing schema, save it, then commit the visible result. On failure, retain the previous saved state and entered form values, restore any changed selector, explain that the change was not saved, and offer a retry of that operation. Distinguish “Saved in this browser” from an error state. Validate loaded records and provide a recovery state that preserves unreadable data before offering a reset.

These are relevant failure conditions: storage access can be denied and writes can exceed quota. [W4–W5]

**Acceptance check:** inject read, parse, and write failures; retry each action; verify no accidental duplicate, no false saved message, and no silent overwrite of unreadable data. Confirm persistence after real browser reload on the same origin.

### 4. Medium priority — Give every successful add a visible destination

**Reproduced:** Add always creates an active item. When invoked from Archive, it saves successfully, clears the inputs, and leaves the person viewing Archive without the new item or a completion message. The same happens under a search that does not match the new title/author. [app.js](app.js), [model.js](model.js)

**Recommend:** keep the current section and query, then show “Added ‘Title’ to your reading list” with **Show in list**. That explicit action should select the active collection, clear the search, and reveal the item. Show the form near the collection controls so it remains reachable as the list grows. Label the button “Add item,” identify Title as required and Author as optional, and retain inputs on failure.

**Acceptance check:** add from both collections, with matching and nonmatching queries, an empty author, a long title, and a blank title. Confirm that success provides an observable result and that error recovery preserves the entry.

### 5. Medium priority — Match navigation and search language to behavior

**Observed and reproduced:** “Search everywhere” searches only the selected archive state. Searching `notes` gives zero active results and one archived result with the supplied data. “My books” omits the supported article use case; “Old things” describes neither the archive action nor the `archived` flag. There is no explicit selected navigation state, and empty collections/no matches both render an empty card container with a count. [index.html](index.html), [app.js](app.js), [model.js](model.js)

**Recommend:** use **Reading list** and **Archive**, show the selected view visually and programmatically, and label search **Search reading list** or **Search archive**. Keep title/author search and make its current scope explicit. Give no-results states the query, a Clear search action, and an option to check the other collection. Give genuinely empty collections their own message and relevant next action. Announce result-count changes without moving focus. [W3]

Keep reading status independent from archive: finished items may remain in the reading list, and restored items should retain their status. This preserves the supplied model rather than introducing an unsupported lifecycle rule.

### 6. Medium priority — Preserve keyboard continuation and useful feedback

**Observed in source:** each `render()` replaces all card nodes. Archive/Restore invokes it after removing an item. No explicit focus continuation exists. Actual focus loss has not been observed in a browser. Results and successful actions have no status region; validation already uses `role="alert"`. Inputs and reading selectors already have accessible names. [app.js](app.js), [index.html](index.html)

**Recommend:** after Archive/Restore, move focus to the next appropriate item action, the preceding item if necessary, or the collection heading when empty. Announce the item and outcome in a polite status region. Associate visible form labels with inputs, associate validation text with Title, and use item headings below the collection heading. Retain native buttons/selectors and existing accessible names.

**Acceptance check:** exercise the complete path using Tab, Shift+Tab, Enter, and native select keyboard behavior; check first, middle, and last-item removal, error correction, and a screen reader's announcements. This remains a planned check. [W3, W6]

## Capability preservation

| Existing capability | Proposed location/behavior |
| --- | --- |
| Add title and optional author | Accessible inline form near collection controls; visible completion and recovery |
| Search title/author | Search within the clearly named current collection; clear query and change scope affordances |
| Three reading statuses | Visible native selector on every item, including archived items |
| Archive and restore | Item-level actions with retained reading status and logical continuation |
| Local persistence | Same record schema and storage key, with validated load and truthful save state |

## Checks actually performed

| Check and conditions | Observed outcome | Status |
| --- | --- | --- |
| Read all five supplied project files | Requirements, markup, styles, data model, handlers, and existing tests inspected | `supported_in_conditions` |
| `node model.test.js` | Existing add, validation, search, status, archive, restore, and copy-isolation assertions passed | `supported_in_conditions` |
| `node --check app.js` and `node --check model.js` | Both syntax checks passed | `supported_in_conditions` |
| Execute actual app handlers in Node `vm` with a minimal DOM stub and in-memory storage adapter | Normal search, status, archive/restore, serialization/reload, and blank-title validation passed under those conditions | `supported_in_conditions` |
| Same simulation: adding from Archive or a nonmatching search | Successful record remained absent from displayed results; no success notice | `mismatch` against visible completion |
| Same simulation: injected save failures and invalid stored shapes | Duplicate-on-retry, unhandled errors, model/display mismatch, silent fallback, and initialization failure reproduced | `mismatch` against reliable save/recovery |
| Python sRGB contrast calculation and CSS constraint inspection | Contrast values and 1,009px minimum layout constraint above | `mismatch` against stated contrast/reflow expectations, scoped to source |
| Browser layout, real localStorage, keyboard focus, screen reader, actual touch-target bounds | No usable browser available; no browser/client installation attempted | `unverified` |
| Application-file preservation | SHA-256 values before and after the audit matched for all five original files | `supported_in_conditions` |

The handler harness was passed through standard input and was not added to the application. These checks establish specific code behavior under simulation; they do not establish rendered usability or complete WCAG conformance.

## Sources and next step

Project evidence is linked beside each finding. The local `design-interface` workflow used its inspection and checking modules, plus relevant web/collection guidance. Primary references checked online:

- **W1:** [WCAG 2.2 — Reflow, SC 1.4.10](https://www.w3.org/TR/WCAG22/#reflow).
- **W2:** [WCAG 2.2 — Contrast (Minimum), SC 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum).
- **W3:** [WCAG 2.2 — Status Messages, SC 4.1.3](https://www.w3.org/TR/WCAG22/#status-messages).
- **W4:** [MDN — Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), persistence scope and access exceptions.
- **W5:** [MDN — Storage.setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem), write behavior and quota errors.
- **W6:** [WCAG 2.2 — Focus Order, SC 2.4.3](https://www.w3.org/TR/WCAG22/#focus-order), supplemented by the local skill's focus guidance.

Next, translate these recommendations into a small implementation plan covering the six findings and their acceptance checks. Real collection size, device use, and preferred scanning style may change the choice between rows and cards; they do not prevent the source-supported fixes above. The present task ends with this audit.

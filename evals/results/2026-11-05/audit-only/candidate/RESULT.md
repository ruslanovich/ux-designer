# My Reading — interface audit

## Main recommendation

Redesign the connected reading-list screen around finding an item, updating its reading status, and adding the next item. Fix saving and recovery alongside the interface work. The existing model already provides the required operations; the most consequential problems are in presentation, action completion, and the persistence boundary.

**Recommended scope:** the single screen and its active/archive, search, add, and recovery states. The supplied material supports this scope without a larger navigation hierarchy. This assignment ends with the audit; application and skill files have not been edited.

## Context and evidence

`README.md` defines a local prototype for one person tracking books and long articles, with no backend or account. Required capabilities are adding, searching, reading status, archive/restore, local persistence, and the existing data model. The five seed records are demonstration content.

The working task is: someone records a title, later finds it by title or author, changes its reading status, and archives or restores it. Optional author entry, long titles, unmatched searches, adding while viewing the archive, and failed storage are material exceptions. This task follows the supplied capabilities; actual usage frequency and user preferences are unknown.

Evidence below distinguishes **source observations**, **executed simulations**, and **design recommendations**. No rendered screenshot, browser interaction, accessibility tree, or participant study was available. The JavaScript simulations used Node with minimal DOM and storage test doubles; they establish handler logic under those conditions.

### Preserve these strengths

- The model keeps reading status (`queued`, `reading`, `finished`) separate from archive membership. Preserve that distinction: a finished item can remain in the active list, and restoring an item retains its status. (`model.js`)
- Search is case-insensitive and matches both title and author. Keep those capabilities. (`model.js`, `find`)
- Title validation, trimming, optional author entry, and copy isolation are already implemented. (`model.js`, `model.test.js`)
- Native buttons, inputs, and selects are a useful foundation. Inputs have accessible names, and each status select includes the item's title in its accessible name. Validation already has an alert region. (`index.html`, `app.js`)
- Archive and restore are reversible. Keep the clear separation from permanent deletion; permanent deletion is outside the supplied requirements.

## Prioritized findings

**P1** means address before relying on the prototype for everyday use because access to the task or retained work is affected. **P2** means address in the same screen redesign to make the core flow understandable and complete. These are expert priorities, with no frequency or analytics claims.

### 1. P1 — Make the screen fit narrow viewports and make item text readable

**Observed in source:** `.work` has `min-width:800px`; the sidebar is a non-shrinking 190px wide; the horizontal layout has a 3px gap and 16px total outer padding. This declares a horizontal minimum of **1,009 CSS pixels**. The three-column grid has no responsive breakpoint. At a 320px viewport, the declared layout exceeds the width by 689px. This is a source-based calculation, not a rendered measurement. (`index.html`, `.layout`, `.menu`, `.work`, `.cards`)

The essential text also has insufficient declared contrast on the white card background:

| Text | Foreground / background | Calculated contrast | Applicable AA threshold |
|---|---|---:|---:|
| Title, 12px normal weight | `#777` / `#fff` | 4.4781:1 | 4.5:1 |
| Author, 12px inherited | `#aaa` / `#fff` | 2.3231:1 | 4.5:1 |

Both combinations fall below WCAG 2.2 SC 1.4.3 for this text. Reflow at 320 CSS pixels is relevant to this ordinary vertically scrolling collection under SC 1.4.10. These findings do not establish a complete accessibility assessment. [S1]

**Consequence:** narrow-window and zoomed use is constrained by the fixed layout, and the information used to identify an item is visually weak.

**Recommendation:** use a fluid content region and a single vertical collection, with title and author followed by status and archive/restore. Let controls wrap below the text on narrow screens. Wrap complete titles, including the supplied long article, without hiding their identifying content. Use darker text and a consistent type scale; 16px body/control text is a reasonable starting design choice, not a WCAG minimum.

**Expected check:** browser inspection at 320, 375, 768, and 1280 CSS pixels; 200% text enlargement and relevant zoom/reflow conditions; long title and author strings; no clipped information or unnecessary horizontal scrolling. Recalculate final colors after styling.

### 2. P1 — Commit changes only after successful saving, and recover invalid stored data

**Observed in source and executed simulation:** all mutation handlers change the model before calling `localStorage.setItem`. A simulated write failure during add leaves the new item in memory, retains the filled form, and displays the raw exception. Submitting again creates a duplicate. A simulated archive write failure escapes its handler after changing memory and prevents the rerender, leaving displayed cards inconsistent with the model. (`app.js`, `persist`, add/status/archive handlers)

Initialization catches invalid JSON and silently uses demonstration data. Valid JSON of the wrong shape, such as `{}`, reaches `initial.map` and throws. The footer says “Saved on this device” regardless of these failures. (`app.js` initialization; `model.js`, `create`; `index.html` footer)

**Recommendation:** retain the existing model and storage schema. Apply a proposed mutation to a copy made through the model, attempt to persist that snapshot, and commit the displayed state only after success. On failure, retain the previous committed state and the add draft, explain that saving failed, and offer a retry that does not add another record. Restore a failed status control to its committed value. Guard read access and validate the stored array and row fields before initialization; preserve recoverable data and show a recovery state instead of silently substituting demo records.

The storage method can throw when space is unavailable; this is a platform-supported failure case, although its frequency for this prototype is unknown. [S3]

**Expected check:** successful mutation/reload; simulated read denial and write failure for each mutation; retry without duplicates; malformed JSON, wrong-shaped JSON, and valid empty data. Confirm that the visible save message agrees with the last successful write.

### 3. P2 — Align navigation and search with the actual collection scope

**Observed:** “My books” covers both books and long articles; “Old things” leads to archived items. Search is labelled “Search everywhere,” while `model.find(query, archived)` always searches one archive state. The same “LAST YEAR” query returned zero active records and one archived record in the simulation. The query persists when switching sections. Buttons have no selected-state styling or programmatic selected state. (`index.html`; `app.js`, `render`; `model.js`, `find`)

**Recommendation:** use **Reading list** and **Archive**, show the selected section, and place search next to that collection. Keep scoped search and label it explicitly, for example “Search reading list” or “Search archive,” with a shared hint “Title or author.” Preserve the query on section changes so the same search can be tried in the other collection; make the new scope visible. Use “1 result” / “4 results” for filtered counts, and keep any collection totals distinct.

This retains the implemented search model and resolves the misleading promise with a clear scope. Familiar terms and visible system state are appropriate practitioner principles here; they do not prove how this user will interpret a label. [S4]

**Expected check:** search by known title and author in each section; carry the query between sections; clear it; verify count, heading, scope label, and programmatic selected state agree.

### 4. P2 — Give add, archive, and empty results a complete outcome

**Observed in simulation:** adding from Archive saves a new active item, leaves Archive displayed, clears the form, and shows no success message. Adding an item that does not match the current query also leaves it hidden with no confirmation. A zero-result list contains no explanatory state beyond “0 items.” (`app.js`, add handler and `render`)

**Recommendation:** put an **Add item** action near the collection heading and use a small inline form with **Title (required)** and **Author (optional)**. State that new items enter Reading list with “To read” status. After a successful add, retain the current view and query, and show a concise confirmation with **View item**; that action switches to Reading list, clears an excluding query, and locates the new item. Keep failed drafts intact.

Provide distinct states:

| State | Recommended content or continuation |
|---|---|
| Empty reading list | “Your reading list is empty” and Add item |
| Empty archive | “No archived items” and a route back to Reading list |
| Search has no matches | Show the query and scope, Clear search, and the other section |
| Item archived | Name the item, confirm Archive as its destination, and offer Undo using the existing restore operation |
| Item restored | Confirm Reading list as its destination and offer View item |

Restore remains available in Archive. These recommendations preserve reversible operations without adding a confirmation dialog to every archive action.

**Expected check:** add from both sections with and without an excluding query; use View item; archive the last visible result; restore an item; verify the empty state and continuation match the resulting state.

### 5. P2 — Establish consistent hierarchy and accessible continuation

**Observed in source:** a 28px welcome banner with 35px padding receives strong emphasis; item titles are 12px normal weight; the add action is 10px serif; status controls are 10px. Green navigation, orange greeting, yellow form, purple actions, and thick card borders compete for emphasis. This is a source-based design judgment, not a rendered visual review. (`index.html` styles)

`render()` removes and recreates every card. Archive/restore removes the invoking control without explicitly choosing a next focus target. Result count updates are plain paragraph changes; they have no live-region semantics. The visible field names are spans, while separate `aria-label`s provide accessible names. (`app.js`; `index.html`)

**Recommendation:** use a quiet background, clear heading and item typography, consistent spacing and control styling, and one accent for the primary action. Replace the prominent greeting with useful collection context. Map stored statuses to **To read**, **Reading**, and **Finished**, keeping the data values unchanged. Keep Archive visually secondary and clearly labelled.

Associate visible field labels with their inputs; connect the title error to its field and expose invalid state. Use polite status announcements for results and successful mutations, with restrained announcements during typing; reserve alerts for actionable errors. W3C specifically distinguishes search-result content from a message such as “5 results returned,” which needs appropriate programmatic exposure. [S2]

After archive/restore, choose the next logical item control, or the collection heading when the list becomes empty. Retain visible native focus styling. Use a heading level for item titles beneath the collection heading. Actual focus loss, touch-target measurements, and screen-reader announcements remain unverified.

**Expected check:** keyboard-only add, validation, status change, archive, restore, section switching, and search; verify meaningful focus after a row disappears and an announced result or save status. Inspect the browser accessibility tree and actual target dimensions.

## Chosen presentation direction

Use one responsive collection with a compact header, Reading list / Archive section controls, scoped search, and Add item. Align item information and controls on wider screens; stack them in the same reading order on narrow screens. Keep the full title and author visible. A two-field inline form suits the existing task and avoids adding another screen.

A vertical list is the recommended starting point because these records share text fields and actions, and the task includes finding known items. NN/g's card guidance supports considering predictable alignment for scanning; it does not establish that every grid is unsuitable or validate this exact design. [S5] If later evidence shows visual browsing is central, a card representation can be reconsidered.

## Checks actually performed

| Check and conditions | Observation | Status |
|---|---|---|
| Read all supplied files: `README.md`, `index.html`, `app.js`, `model.js`, `model.test.js` | Reviewed requirements, data, navigation, copy, CSS, forms, handlers, and persistence | `supported_in_conditions` — source review |
| `node model.test.js` | Existing assertions passed: add, validation, search, status, archive, restore, copy isolation | `supported_in_conditions` — model only |
| `node --check app.js` and `node --check model.js` | Both syntax checks passed | `supported_in_conditions` — parsing only |
| Node VM, minimal DOM and in-memory storage doubles | Normal validation, status save/reload, archive and restore handlers passed | `supported_in_conditions` — simulated environment |
| Same simulation, archive scope and nonmatching search | Verified scoped search and added items hidden without completion feedback | `mismatch` — visible promises/action completion |
| Same simulation, forced write errors and malformed saved values | Verified duplicate retry, stale archive display, silent JSON fallback, and wrong-shape startup error | `mismatch` — persistence/recovery expectations |
| Python contrast calculation from declared CSS colors | Title 4.4781:1, author 2.3231:1 on white; both below 4.5:1 | `mismatch` — declared text contrast |
| CSS arithmetic and source inspection | Minimum horizontal layout 1,009px; no media queries | `mismatch` — source layout versus narrow reflow expectation |
| File-integrity comparison | SHA-256 hashes of all five original files remained unchanged; `RESULT.md` is the only added file | `supported_in_conditions` — file comparison |
| Browser rendering, keyboard focus, accessibility tree, zoom, screen-reader output, real storage quota | No usable browser executable was available; no browser or client was installed | `unverified` |
| Real audience comprehension, speed, preference, or frequency | No participant or analytics evidence supplied | `unverified` |

The next implementation should resolve the five findings in this connected flow, then run the stated browser checks. Actual collection size and the relative importance of known-item lookup versus browsing remain product questions; they do not block the confirmed fixes.

## External sources read and applied

The bounded research question was how to present and recover a small text collection with known-item search, local saving, and narrow-screen access. Sources inform the decisions above and are separate from evidence about this product's users.

- **[S1] W3C, [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)** — normative criteria, especially [1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum) and [1.4.10 Reflow](https://www.w3.org/TR/WCAG22/#reflow). Applied to declared text colors and layout; overall conformance was not tested.
- **[S2] W3C WAI, [Understanding SC 4.1.3: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)** — informative explanation supporting result-count and action-feedback semantics. Actual assistive-technology output remains to be checked.
- **[S3] MDN, [Storage: setItem()](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem)** — platform documentation confirming that storage writes may throw `QuotaExceededError`; used to investigate failure and retry logic.
- **[S4] Jakob Nielsen / NN/g, [10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/)** — practitioner guidance on visible system status, familiar language, control, and consistency. Used for explicit scope, completion, and recovery decisions.
- **[S5] Page Laubheimer / NN/g, [Cards: UI-Component Definition](https://www.nngroup.com/articles/cards-component/), 6 November 2016** — practitioner comparison of cards and lists. Supports the proposed predictable row layout for text lookup, with task-specific validation still needed.

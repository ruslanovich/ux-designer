# My Reading

A local reading-list app for one person keeping track of books and long articles. Open `index.html` through a static server, for example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`. No build, backend, account, external font, or runtime dependency is required. The initial five entries are demonstration content.

## Delivered redesign

The interface uses a warm neutral background, restrained green accents, readable type, and a responsive list. Full titles and authors remain visible; the supplied long article title is allowed to wrap. Each row keeps its status and archive action together.

| Existing capability | Location and behavior |
| --- | --- |
| Add a book or article | **Add a read** opens a compact inline form. Title is required; author is optional. The form identifies invalid input, retains drafts when closed, and reveals the newly added read in the reading list. |
| Search titles and authors | Search stays beside the collection switch. The label and placeholder identify the current collection. Search is case-insensitive, and a clear action recovers from no matches. |
| Change reading status | A native, named select in each row exposes **To read**, **Reading**, and **Finished**. Existing stored values remain `queued`, `reading`, and `finished`. |
| Archive and restore | **Reading list** and **Archive** are distinct views with counts. Archive and restore offer an Undo action. Removing a row assigns focus to a remaining action or the collection heading. |
| Local persistence | The existing `reading-list` key and data shape are preserved. Failed storage writes retain changes in the current page and offer **Try saving again**. |

The existing `model.js` and its seed data were kept unchanged. New entries appear at the end of the list in the existing model order. Search text stays in place when switching collections; adding resets it to reveal the new entry. Status changes preserve the current select element. The add form is nonmodal, so the rest of the page remains usable.

Empty reading lists, empty archives, unmatched searches, invalid titles, successful changes, unreadable storage, and failed saves have explicit messages and a next action. After a save failure, keep the page open to retain changes until a retry succeeds. An unreadable saved record is not overwritten at startup; the warning explains that a later change or explicit save retries with the list currently shown.

## Design basis

The implementation is based on the supplied README, the original app and model, and the local design-interface workflow. The working assumption is that clear scanning and managing the current read are useful for this single-person list; no audience study or usage-frequency claim was made.

Labels, semantic headings, native controls, visible focus styles, full text wrapping, and narrow-screen stacking were informed by W3C guidance on [labels and instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html), [focus order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html), and [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). These sources guide design decisions; this work does not establish full accessibility conformance.

## Checks performed

```sh
node --check app.js
node model.test.js
node app.test.js
```

- The existing model check passes: adding, validation, search, status, archive, restore, and copy isolation.
- Ten application checks pass with the actual `app.js` handlers executed in a small Node DOM/storage harness. They cover original content, scoped search, title validation and correction, draft cancellation/Escape, adding from a searched archive, status updates, archive/restore/undo, persistence after a simulated reload, an intentionally empty saved list, literal handling of HTML-like input, storage failure/retry, and malformed/unavailable storage.
- The harness checks DOM changes, handler results, storage values, and assigned focus targets. It does not implement a browser or test native keyboard behavior.
- Source-level checks cover unique HTML IDs, label/control and ARIA references, local assets, responsive CSS declarations, and the contrast ratios of the principal text/control color pairs.

### Verification limit

No usable browser executable was available. Rendered appearance, actual layout at narrow widths or zoom, native select behavior, Tab/Shift+Tab/Escape interaction, and screen-reader announcements remain unverified. A follow-up browser check should use the supplied long title at 320px and desktop widths, open/close the add form by keyboard, add a read, change its status, archive/undo/restore it, and reload to confirm local saving. No browser or client was installed.

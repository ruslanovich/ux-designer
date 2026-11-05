# Reading list

A local reading-list prototype. Open index.html with a static server. There is no backend or account.

Keep adding, searching, reading status, archive/restore, and local persistence. Use the existing data model. The product is for one person keeping track of books and long articles. The current data is demonstration content.

Run `node model.test.js` to check the model. This command does not exercise the browser interface.

## Redesign

The app now uses a responsive reading list with full titles and authors, clear **Reading list** / **Archive** navigation, and a persistent **Save your next read** form. The cream, forest-green, and serif styling is intended to feel comfortable around reading material. This is a design judgment; no participant study was conducted.

All original capabilities remain on the existing model and `reading-list` local-storage key: adding, title/author search, three reading statuses, archive/restore, and persistence. Existing saved data and deliberately empty lists are preserved. New interface conveniences include status filters, result counts, undo for archive/restore, scoped search labels, and contextual empty states. Adding from the archive or a filtered view returns to the complete reading list so the added item is visible. Failed saves keep the current session usable and display a warning. Unreadable stored data is left intact.

### Design decisions and evidence

- **A connected screen redesign:** source inspection found a fixed 800px work area, three narrow card columns, 10–12px text, weak contrast, inconsistent component treatment, vague navigation labels, and no empty state. The new composition addresses the list, add flow, and archive together.
- **Divided list rows:** every record has the same small set of fields and there is no detail destination or cover artwork. A list gives long titles more space and keeps status and archive actions beside the item. NN/g's [Cards: UI-Component Definition](https://www.nngroup.com/articles/cards-component/) informed the choice as practitioner guidance; its examples do not prove a result for this app's audience.
- **Visible form labels and explicit status names:** Title is required, Author is optional, and native selects expose To read / Reading / Finished. This follows the relevant guidance in [W3C WAI: Labeling Controls](https://www.w3.org/WAI/tutorials/forms/labels/).
- **Responsive flow:** the list and add form share a two-column layout on large screens and stack below 720px. Long content wraps, controls remain visible, and an Add a read shortcut focuses the form on mobile. [W3C: Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) informed the requirement to retain content and function in narrow layouts.
- **Reachable feedback and recovery:** empty states distinguish an empty list, an empty archive, and unmatched search/filter results. Validation keeps entered values and focuses Title. Changes announce feedback. Focus targets are reassigned when a row is removed by archive or a status filter.

### Run and verification

Serve this directory with any static server, for example `python3 -m http.server 8000`, then open `http://localhost:8000`.

- `node model.test.js` — original model regression checks.
- `node --check app.js` — JavaScript syntax.
- `node app.test.js` — interaction logic in Node using a small DOM double. Covers search, filtering, statuses, validation, optional author, safe user text, archive/restore/undo, requested focus targets, direct archive entry, persistence reload, empty saved data, and storage failures.

Source checks also verified unique HTML IDs, explicit labels for the three inputs, and the presence of linked local assets. Calculated contrast for nine primary text/color pairs ranged from 4.61:1 to 11.79:1 after darkening the input placeholder.

The available environment had no usable browser. These checks do **not** establish rendered layout, absence of overflow at actual viewport sizes, real keyboard behavior, screen-reader announcements, or complete accessibility. A browser review should cover 320px and desktop layouts with the supplied long title, keyboard navigation, and add/archive/restore flows. The local prototype still has no backend or account.

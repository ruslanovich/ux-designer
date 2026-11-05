# Bulk catalog updates: interface plan

## Recommended design

Keep the catalog as a dense, paginated table. Give selection an explicit scope: individual records, the current page, or a saved set of all matching records. Review the exact records and requested change before submission. Once accepted, track the update as a durable operation while the operator continues using the catalog. Recovery starts from the operation’s confirmed failed records and creates a linked follow-up update.

This is a plan for one connected workflow: catalog → selection → edit and review → background update → results → recovery. A local confirmation dialog alone would leave progress, partial outcomes, and return to the list unresolved. The requested endpoint is this plan; no application or backend implementation is included.

## 1. Basis, boundaries, and assumptions

| Status | Evidence or decision | Consequence |
| --- | --- | --- |
| Reported | [BRIEF.md](BRIEF.md) describes 8,000–40,000 catalog records and filtered results spanning hundreds of pages. | Selection and results must work across pages without loading every row into the browser. |
| Reported | Operators bulk-update availability and categories while inspecting individual items. | Preserve comparison columns, item links, pagination, and return context throughout the flow. |
| Reported | Acceptance can precede completion; concurrent changes, permission changes, and invalid values can cause record failures. | Provide durable progress, per-record results, current-value comparison, and differentiated recovery. |
| Reported | A successful record cannot be blindly updated again. | Every submission and recovery must have a stable identity and an exact eligible target set. |
| Reported | Roles and data rules already exist. | Reuse existing permission decisions, permitted values, category semantics, and validation messages. |
| Observed | The supplied project contains a product brief; no existing UI, code, screenshots, or service contract was supplied. | Existing layout, brand, behavior, and backend capabilities cannot be verified. |
| Hypothesis | The main workspace is a desktop browser application, with a usable narrow-browser layout. | Use a table and side panel on wide screens; use sequential views when those regions no longer fit. Native applications are outside this plan. |
| Decision | Each update changes one attribute: availability or categories. | The review has one explicit intent and recovery can be reasoned about per record. Operators can run a second intentional update for the other attribute. |
| Unknown | Category cardinality, atomicity within category assignment, snapshot support, durable status retention, and cancellation support. | Confirm the service dependencies in section 9 before implementation. The flow does not change business rules or promise unsupported rollback. |

All record counts, timestamps, identifiers, and category names below are illustrative. They are examples for design review, not production observations.

### Task to support

An operator filters the catalog to an affected supplier/category, inspects several products, selects the intended population, changes availability or categories, and continues inspecting the list while processing runs. They later identify records that did not change, resolve their specific problems, and submit only the eligible unresolved records. Significant exceptions include a lost submission response, new matching records, records leaving the filter, permission loss, another operator editing a record, and recovery overlapping another update.

### Inspection findings

The brief establishes the task and object model. It does not establish that the current interface is confusing or that any particular selection pattern is familiar to these operators. The design must make scope, intent, status, and recovery visible together. The important visual questions are information density, placement of the selection summary, distinction between progress and completion, and comparison of old/current/requested values. Brand consistency and actual component quality remain uninspected because no UI was supplied.

## 2. Selection pattern and scope

### Pattern choice

| Candidate | Fit for the supplied task | Decision |
| --- | --- | --- |
| Individual and page selection only | Precise for exceptions, but requires repeated work across hundreds of pages. | Keep as an entry method; add a cross-page action. |
| Explicit page selection, then “Select all matching records” | Supports a small selection and a large filtered population while keeping the expansion visible. | **Choose this pattern.** |
| Automatically treat the header checkbox as all matching records | A single control can silently expand from visible rows to thousands of records. | Do not use for this flow. |
| Permanent selection basket spanning arbitrary filters | Supports complex collection tasks but adds hidden membership and another object to manage. The brief does not establish that need. | Defer; preserve context through the list and operation history instead. |

PatternFly documents separate page/all options and a count across pages. Carbon documents a contextual batch toolbar. Those enterprise patterns support the controls chosen here; the scope-freezing and recovery rules are product decisions driven by the brief. [S1, S2]

### Selection controls

Place one labeled page-selection checkbox at the left of the table toolbar; avoid a second, differently scoped “select all” control in the header. Its accessible label is “Select all 50 records on this page.” Each row has its own checkbox, separate from its product link.

After selecting a page, show a persistent scope strip immediately above the column headings:

> **50 records selected on this page.** Select all **12,480 matching records** · Clear selection

After choosing all matching records, obtain a stable, server-resolved membership snapshot and show:

> **12,480 matching records selected across all pages.** Captured at 10:42. Review selection · Clear selection

An operator may deselect exceptions on any page. The strip then reads:

> **12,477 selected · 3 excluded.** From 12,480 matches captured at 10:42. Review selection · Clear selection

“Review selection” opens a searchable, paginated view of the exact selected identities with an Excluded view and an action to restore an exclusion. It uses the saved membership even when current filter results have changed. Long product names and category paths remain available in full.

### Membership rules

- Individual/page selection stores exact record identities and the versions observed when selected. It persists through pagination, sorting, page-size changes, and item inspection.
- All-matching selection captures the matching population once. Later arrivals never join it automatically. A subsequent filter-count change does not change its target count.
- Deselecting a page affects only selected identities on that page. The page checkbox reflects the visible page’s selection; the scope strip shows the total across pages.
- Deleted or newly inaccessible records remain accounted for in the selection until review resolves them. Permission-sensitive details are hidden as required by the existing access rules.
- Sorting does not alter membership. “All matching” excludes UI pagination and sorting from the membership definition; it includes the search, active filters, and mandatory permission scope.
- Changing search or filters while selection is nonempty requires an explicit choice: **“Apply filters and clear 12,477 selections”** or **“Keep current view.”** If an edit draft exists, the message also names that draft; applying clears it. Cancelling retains both selection and entered values. This narrowly scoped guard avoids silently carrying an old population into a different filter.
- After an acknowledged submission, the live selection is consumed into the operation. Clear its row checkboxes and explain “12,477 records saved in update #1042.” Keep the filters, sort, page, and reading position. This deliberate exception to a reusable persistent selection prevents an accidental repeat of the completed intent.

A membership snapshot is a required service capability, not a list of unchecked live query parameters. If unavailable, limit the feature to explicit record identities and explain that all-matching selection is unavailable; do not ship a control whose population can grow between review and execution.

## 3. Main screens and visual organization

Use a quiet enterprise workspace: white/light neutral content surface, clear row rules, one prominent primary action, blue for selection and primary actions, and textual status labels paired with icons. Use amber for attention and red for errors, without relying on color. Reuse the product’s existing typography and tokens when available. A starting layout can use a 24 px page heading, 14–16 px table/body text, 40–44 px rows, and tabular numerals; these are design defaults to verify, not universal accessibility measurements.

### A. Catalog with selection

| Region, top to bottom | Content and behavior |
| --- | --- |
| Page heading | **Catalog**, current result count, and **Bulk updates** with an active-operation count. This destination remains available after leaving the list. |
| Search and filters | Labeled search; supplier/category/availability controls; applied chips such as “Availability: Available” and the full category path. Chips remain visible when the batch toolbar appears. |
| Selection/action toolbar | Page checkbox; cross-page selected count; **Change availability**, **Change categories**; **Clear selection**. Choosing a bulk action preserves the table’s position. |
| Scope strip | All-page expansion, capture time, exclusions, and **Review selection** as specified above. It does not replace the filter overview. |
| Table | Selection, product/SKU link, availability, full category path, last changed, and operation status when applicable. Title/SKU and compared values remain visible together. |
| Pagination | Current page/range, page size, previous/next, and direct page navigation if the existing service supports it. Preserve existing meaningful navigation capabilities. |
| Optional side panel | Individual product details. It can open without changing selection; closing returns focus to the product link. Bulk editing and item details use the same panel slot with explicit Back navigation and retained input. |

At wide widths, use a roughly 420 px supporting panel while retaining enough table space for identity, availability, and category. If these cannot remain readable, replace the panel with a dedicated detail/edit view. Keep sticky controls from covering focused elements, table headers, or bottom rows. Avoid a collection of large cards that reduces cross-record comparison.

The item link always supports inspection. Mutating row actions are not offered simultaneously with an active batch edit; the operator can clear the draft and edit an individual record. This follows Carbon’s caution around competing row actions while preserving the brief’s explicit inspection task. [S2]

### B. Edit and review

Opening **Change availability** or **Change categories** opens a supporting edit panel. Its header names the action and target count. There is no preselected change. Availability uses the existing permitted values; categories uses the established category selector and its actual cardinality/assignment semantics. If the existing operation replaces category assignments, the label says **Replace categories** and the review explicitly describes the replacement. Do not introduce new add/remove capabilities without existing rule support.

The panel contains the selected population summary, required field(s), concise validation, and **Review update**. “Back to catalog” closes the panel while preserving the draft and selection. A visible **Resume edit** action restores it. **Discard draft** clears entered changes; it requires confirmation only when there is entered work to lose.

**Review update** resolves exact membership, current access, allowed values, versions, and known overlapping operations. During validation show “Checking 12,477 selected records…” with a cancel/back action that only cancels the review. A failed review request retains the edit values and selection.

The review is a full, dedicated view to provide room for large-scope evidence:

1. **Intent:** “Set availability to Unavailable.”
2. **Scope:** “12,477 records · 12,480 matching at 10:42, with 3 exclusions”; original search/filters; **Inspect records**.
3. **Current values:** Counts grouped by current availability or category assignment, with a paginated before/after preview. Show “Mixed values” rather than suggesting all records share a value.
4. **Eligibility:** Exact eligible, blocked, already-at-target, and conflicting-operation counts; every count opens the corresponding records and explanations.
5. **Submission:** A single explicit button, for example **Submit update for 12,477 records**. Explain that records can still fail if their state or permissions change after review.

When preflight finds 27 blocked records, keep submission paused. Offer **Review 27 blocked records**, **Edit change**, and **Exclude 27 and review 12,450**. Exclusion is a deliberate action that rebuilds the final summary and button; it is never silently inferred. No eligible records means no submit action, with a reason and a route back to the draft.

Records changed since selection appear in a **Changed since selection** group with observed/current/requested values. The operator explicitly confirms the current version or excludes those records; review never silently upgrades their preconditions. The review’s accepted version observations become execution preconditions. Refreshing a stale review updates its counts and comparison, and requires a new submission action. It cannot authorize an unnoticed scope or value change. Preflight improves the preview; it does not guarantee later execution success.

### C. Operation detail and results

An operation has its own destination reachable from **Bulk updates**, the catalog status strip, and its durable link. The header displays action, operation number, actor, accepted timestamp, last status update, original selected count, and original filter summary. **Return to catalog** restores the saved view; opening results never overwrites the catalog filters.

Use one summary line and a compact progress display above a results table. Keep exact counts adjacent to the display. Results have **All**, **Needs attention**, **Updated**, **Already matched**, and **Pending / confirming** views with counts. Search and pagination apply to operation results independently of catalog search and selection.

For a completed example:

> **Completed with 217 records needing attention**\
> 12,160 updated · 100 already matched · 217 failed\
> **Review 217 failures** · View all records

The table shows identity, requested change, outcome, understandable reason, and next action. Conflict detail adds observed-before, latest current, and requested values, plus changed-by/time when authorized and available. An export, if added to the existing product’s permitted reporting capabilities, contains the same authorized rows/statuses and operation reference; it is secondary to an in-app recovery path.

## 4. Submission and operation states

Keep submission acknowledgment distinct from record outcomes. A disabled submit button is useful feedback, but duplicate protection requires the service guarantees in section 9. Microsoft’s asynchronous guidance supports durable status resources, timestamps, and idempotency for lost responses. [S3]

| State | What the operator sees | Available action and transition |
| --- | --- | --- |
| Ready for review | Exact scope, entered change, preflight result. | Edit, inspect targets, submit, or return with the draft preserved. |
| Submitting | “Submitting update…”; frozen target set and change; submit disabled. | Keep the view or continue inspecting. Repeated clicks cannot create a new intent. |
| Submission uncertain | “We haven’t confirmed whether this update was accepted. Checking status…”; request reference and timestamp. | **Check status** performs reconciliation. Retain the frozen request; prevent a fresh submit of the same intent. A definitive rejection returns to the draft. |
| Queued | “Update #1042 accepted · 12,477 records queued.” | **Continue in catalog** or view operation. Closing the view does not cancel it. |
| Processing | “8,240 of 12,477 outcomes confirmed · 4,237 remaining”; updated/unchanged/failed counts and timestamp. | Continue list work, inspect known outcomes, or reopen later. Show determinate progress only when counts are reliable; otherwise show a status indicator and last confirmed counts. |
| Status unavailable/stale | “Status could not be refreshed. Last confirmed at 10:47.” Keep known results visible. | **Check again**; continue catalog work. Pending/unconfirmed outcomes stay unresolved and cannot be retried. |
| Completed | All targets have authoritative terminal outcomes. Exact updated/unchanged counts. | Inspect results or return to catalog. |
| Completed with failures | Exact outcome counts and **Review failures**. | Recovery starts from confirmed failures. Successful/unchanged records are excluded. |
| No records updated | Show the actual outcome: all failed, or all already matched. | Explain relevant reason(s); offer recovery only for failures. Do not label already-matched records as errors. |
| Processing interrupted with unresolved records | “Processing interrupted · 8,240 confirmed · 4,237 still being confirmed.” | Continue reconciliation. Recoverable failures may be reviewed, but unresolved identities remain ineligible. |

Status refresh does not shift keyboard focus, reopen a closed panel, or interrupt another edit. Publish meaningful status changes to assistive technology without moving focus; coalesce progress announcements rather than announce every record. WCAG SC 4.1.3 applies to such status messages. [S4]

### Counting contract

For a submitted operation with `T` targets:

`T = updated + already_matched + confirmed_failed + pending_or_unconfirmed`

These sets are mutually exclusive. “Already matched” is an authoritative no-write outcome, evaluated under the service’s concurrency rules. Reading the same current value is insufficient to determine whether an uncertain earlier submission succeeded. Terminal completion requires zero pending/unconfirmed targets. Progress counts outcomes, not just successful writes, and a job-level error never rewrites confirmed successes as failures.

## 5. Continued catalog work and return context

Capture search, active filters, sort, page/cursor, page size, visible columns, scroll anchor, and focused record when opening edit/review/results. Keep record identity separate from its row position. Opening a product or operation adds a meaningful browser history entry; Back/Forward restores the corresponding view state. Do not create history entries for every progress poll or checkbox toggle.

While a batch runs, operators can paginate, inspect records, change filters, and work on other records. A compact, dismissible in-page status strip links to the operation; **Bulk updates** provides a persistent way to find it. A transient toast can supplement the strip but is not the only record of the result.

Mark an affected record **Update pending · #1042**. Review of another update excludes or blocks records with an unresolved overlapping operation, explains the count, and offers inspection or explicit exclusion. The rest of the catalog stays available. The service must enforce this rule across tabs/operators, because client state cannot establish exclusivity.

If an availability change makes a visible row stop matching the current filter, keep the currently read row stable and label it **Updated · no longer matches this filter**. Offer **Refresh results**. Refresh re-runs the same search and filters, updates count, and preserves the nearest surviving row anchor. If the anchor disappears, explain that results changed and land on a valid page; an out-of-range page cannot remain empty with an incorrect count. Moving to another page fetches current matching results and labels their refresh time. Saved operation membership stays unchanged throughout.

After a reload or navigation away, accepted operations are restored from the durable operation list/status. A draft may be restored using the normal session mechanism, but its membership/version/permissions must be revalidated before it can be submitted. An expired snapshot keeps the chosen change and filter description, says **Selection expired**, and requires a new scope review; it cannot silently rerun the old query and submit its new matches.

For direct entry to an operation, **Catalog** opens the original query with current results and its original capture timestamp visible. There is no invented previous scroll position. Returning from an internally opened operation restores the actual saved originating context.

## 6. Partial failures and recovery

Use **Needs attention** to group the illustrative 217 failures: 142 changed records, 45 permission changes, and 30 values no longer allowed. Include plain-language reasons and actionable destinations. Failure groups are filters over exact failed identities; they are not a fresh execution of the original catalog filter.

| Failure | Information needed | Recovery |
| --- | --- | --- |
| Another operator changed the record | Selected version/value, latest value, requested value, and available audit detail. | **Compare changes**. Choose **Keep current value** or explicitly confirm applying the requested value to the latest version. No automatic overwrite or blanket “force” action. |
| Permission changed | “Your access no longer allows this change”; only identity/detail still permitted. | **Recheck eligibility** after access is resolved through the existing process. No retry while denied. Do not offer an action that bypasses roles. |
| Value no longer allowed | The rejected value, current rule explanation, and permitted alternatives. | **Choose a valid value** for an explicitly selected failure group, then review the new intent and scope. |
| Record deleted/unavailable | A safe identifier when permitted, outcome, and explanation. | No update retry for a deleted record. Keep it accounted for and mark review resolved only as a separate operator action. |
| Transient failure definitively known not to have applied | Authoritative failure reason and retry eligibility. | **Review retry** with current checks. An ambiguous network outcome belongs to “confirming,” not this group. |

### Recovery sequence

1. Select a failure group or individual confirmed failed records. No rows are preselected for mutation; **Select all 142 changed records** is explicit and supports cross-page selection within this failure set.
2. Inspect current data and resolve the relevant cause. In a conflict comparison, operators can review grouped changes and open full record detail; the confirmation identifies the exact selected subset and requested values. “Keep current value” resolves the operator’s review without rewriting the original failure outcome.
3. Revalidate selected failed identities, permissions, current versions, allowed values, and overlapping operations. Unknown/pending outcomes and records already handled by an active or successful recovery are excluded from retry eligibility.
4. Show a new review: **“Follow-up to #1042 · Apply availability change to 120 failed records.”** Identify any changed intent and any records left unresolved.
5. Submit a linked child operation. Give that attempt a new identity, with deduplication across repeated submission of that same attempt. Each target carries its current precondition and parent result reference.
6. Preserve the original operation’s historical result. Add a recovery summary such as **“120 failures recovered in #1048; 97 remain unresolved.”** Child failures remain actionable through their latest result. Never merge a success back into a retry selection.

A new intentional update to a previously successful record is a new catalog task with current data and a new review. Recovery controls never repeat that successful portion. This distinction remains visible in the operation history and child-operation scope.

### Cancellation and reversal

Before submission, return/discard actions manage the draft. After acceptance, this design provides **Continue in catalog** and **Close details**; neither implies stopping execution. Cancellation and automatic Undo are not promised because the brief establishes neither. If a verified cancellation capability is later adopted, show “Stop requested” until acknowledged, retain already-applied changes, and account separately for records confirmed not attempted. Reversal would require a deliberate new operation with current-value review and existing permissions.

## 7. Keyboard, assistive technology, and narrow layouts

Use semantic table headers, labeled native checkboxes, real links for product identities, and labeled buttons for actions. Associate each row’s checkbox with its SKU/name. Announce page-selection mixed state, global selected count, validation summaries, and operation results. Status color always has equivalent text.

Keyboard users can move through filters, selection, rows, pagination, and supporting panels without a pointer gesture. Opening a nonmodal detail/edit panel moves focus to its heading or first meaningful field and provides a reachable **Back to catalog** action; it does not trap focus. A small confirmation for clearing a populated selection is modal: focus begins at its heading, Tab stays inside, Escape means keep the current view, and closing restores focus to the invoking filter action. After submit, focus lands on the accepted-operation heading; after returning, on the saved row or an announced logical fallback.

Use inline field errors plus an error summary linking to those fields. Category paths wrap or expand on demand; their full text cannot depend on hover. Small icons have accessible names. Checkboxes, clearing, paging, and recovery have adequately sized targets using the product’s web accessibility standards.

At narrow widths and high zoom, preserve the same task in sequential views: catalog → detail/edit → review → operation. Show selected scope and primary action before the table. The table may use a labeled horizontal scroll region for genuinely comparative columns while core identity, status, and actions remain reachable. A single-record conflict view stacks observed/current/requested values under explicit labels. No action is available only through a wide-screen side panel.

These are design requirements. Keyboard operation, screen reader output, contrast, target size, zoom/reflow, and visual quality need a rendered implementation to be verified.

## 8. Concept review and acceptance checks

### Checks performed for this plan

| Check | Method and conditions | Observed result | Status |
| --- | --- | --- | --- |
| Requirement coverage | Read the complete supplied brief; trace selection, submission, progress, completion, partial failure, and recovery through this document. | Each requested phase has a concrete screen, action, state, and continuation. Roles/data rules remain existing constraints. | `supported_in_conditions` — document coverage only |
| Large-list selection walkthrough | Expert review using 12,480 matching records over 250 pages at 50/page, then three exclusions. | Scope becomes 12,477; page/sort/detail navigation cannot expand it; later matching arrivals are explicitly excluded. | `supported_in_conditions` — design walkthrough only |
| Lost-response walkthrough | Trace submission uncertainty and stale progress through section 4. | Reconciliation retains one frozen intent; pending/unknown outcomes cannot trigger a fresh blind submission or retry. | `supported_in_conditions` — specified transitions only |
| Partial-failure walkthrough | Trace changed, denied, and invalid-value records from results through section 6. | Recovery is tied to failed identities, includes cause-specific correction and fresh checks, and preserves the original result. | `supported_in_conditions` — design walkthrough only |
| Context walkthrough | Trace item inspection, a changed filter, records leaving a filter, browser return, and direct operation entry. | Retention/reset rules are explicit; no silent selection transfer or automatic disappearance of the currently read row is prescribed. | `supported_in_conditions` — design walkthrough only |
| Source fit | Read the primary guidance listed below and distinguish design-system, engineering, and accessibility evidence. | Guidance supports specific decisions without asserting measured usability for these operators. | `supported_in_conditions` — source review |
| Example and document consistency | Python arithmetic assertions for selection, page count, outcome totals, failure groups, preflight exclusion, and recovery; verify local brief link, required phases, and Markdown table widths. | All seven arithmetic assertions passed; the brief link exists, all requested phases are represented, and table column counts are consistent. | `supported_in_conditions` — document checks only |

### Checks to run during implementation

These checks are planned; the observation column is intentionally blank.

| Expectation | Method and conditions | Observation | Status |
| --- | --- | --- | --- |
| One intended operation despite double click, reconnect, or reload during submission. | Integration test with delayed acceptance and a dropped response; verify stable operation identity and no repeated successful write. | | `unverified` |
| Exact selection at 40,000 records remains stable across new/deleted records, filters, exclusions, and page changes. | Service-backed selection test plus keyboard walkthrough using realistic paging and concurrent dataset changes. | | `unverified` |
| Conflict, permission, and validation errors yield only their eligible failed IDs in recovery. | Inject each authoritative record outcome; compare original targets, successful IDs, recovery targets, and linked results. | | `unverified` |
| Pending/unknown outcomes are never retried; counts partition the submitted population. | Inject stale status, interrupted processing, partial results, and eventual reconciliation. | | `unverified` |
| A second tab or operator cannot submit an overlapping unresolved change unnoticed. | Two-session test during initial processing and recovery review. | | `unverified` |
| Filter, sort, position, draft, and focus return appropriately. | Browser Back/Forward, deep link, refresh, expired snapshot, out-of-range page, and row-leaves-filter scenarios. | | `unverified` |
| Details, long category paths, clear-selection confirmation, and recovery work without a pointer. | Keyboard and screen reader review, long text, 200%/400% zoom, narrow viewport, and normal/waiting/error states. | | `unverified` |
| Operators correctly explain selected scope, acknowledgment, partial completion, and recovery targets. | Task-based sessions with representative catalog operators using a runnable prototype and realistic records. | | `unverified` |

No running UI, browser interaction, backend operation, production data, or participant study was checked. The environment has no usable local browser; none was installed. A plan review cannot establish runtime correctness, accessibility conformance, or operator comprehension.

## 9. Implementation dependencies and next decisions

These are interface contracts to confirm with engineering and the existing product owner. They are not a backend implementation proposal.

| Needed contract | Why the interface requires it | If absent |
| --- | --- | --- |
| Stable target snapshot or exact record IDs, exclusions, captured filter, count, and expiry | Review and submission must address the same population. | Offer explicit-ID selection only; keep all-matching selection unavailable with an explanation. |
| Record/version preconditions and documented per-record atomicity | A concurrently changed record must fail safely; a single record cannot hide a partially applied category change. | Resolve the service contract before claiming record-level success. If category assignment can partially apply, expose per-category outcomes and recover only unapplied subchanges. |
| Durable operation identity and submission deduplication/reconciliation | A lost response cannot safely be treated as rejection. | Block resubmission while acceptance is unknown and provide a durable request reference for reconciliation. |
| Authoritative per-record outcomes, reasons, counts, timestamps, and pagination | Totals, affected-record inspection, and failed-subset recovery need the same source of truth. | Do not advertise completion or automatic retry without this evidence. |
| Current permission and allowed-value checks during review and execution | Existing roles and rules may change after preview. | Keep invalid/denied records blocked; never rely solely on the UI’s stale state. |
| Cross-attempt overlap checks and recovery lineage | Two tabs or recoveries must not repeat the same unresolved intent. | Keep a recovery attempt unavailable until its predecessor’s result is reconciled. |
| Defined status/result retention | Operators need to return later and recover failures. | Agree a retention window and display expiry; once authoritative history expires, do not reconstruct retry eligibility from a live catalog value. |

Next, engineering confirms these contracts and the existing category semantics. Build the selected catalog/review/results flow using the established design system, then perform the targeted implementation checks above. A browser-capable environment is needed for the visual, focus, and assistive-technology checks.

## Sources and decision effects

Sources were read on 2026-11-05. External guidance does not establish behavior or success rates for this product’s operators.

- **[BRIEF.md](BRIEF.md)** — supplied product requirements. Primary basis for population size, continued inspection, asynchronous completion, failure causes, roles, and duplicate-update constraints.
- **[S1 — PatternFly: Bulk selection](https://www.patternfly.org/patterns/bulk-selection/)** — enterprise design-system guidance. Supports distinct page/all options, visible cross-page selection totals, and partial-selection indicators. This plan adapts its selection persistence: acceptance consumes the active selection into an operation because the brief requires repeat-write protection. The source does not establish snapshot or retry semantics.
- **[S2 — IBM Carbon: Data table](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines)** — enterprise component practice. Supports a comparison table, contextual batch toolbar, and controlling competing row mutations during batch mode. Inspection links remain available to meet the supplied task. This is pattern guidance, not a study of catalog operators at the stated scale.
- **[S3 — Microsoft Azure Architecture Center: Asynchronous Request-Reply pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/async-request-reply)** — engineering guidance. Supports distinguishing acceptance from completion, a persistent status resource, update timestamps, and idempotent reconciliation after a lost response. It informs the UI dependencies; it does not verify that this service provides them.
- **[S4 — W3C: Understanding WCAG 2.2 SC 4.1.3, Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)** — informative explanation of the normative criterion. Supports accessible waiting/progress/result messages without unnecessary focus changes. It does not establish full accessibility conformance of the planned interface.

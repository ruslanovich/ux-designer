# Bulk updates for supplier catalog operations

## Recommendation

Use a paginated catalog table with persistent row selection, an explicit **Select all matching records** action that freezes its scope, and a durable **Updates** activity view. Let operators inspect products and change their browsing filters while an update runs. Each submitted operation owns an immutable target set and a record-level outcome report. Recovery starts from confirmed failed changes and creates a linked, reviewed attempt.

This is an interface plan. The product facts come from [BRIEF.md](BRIEF.md); examples below use invented records and counts. No application or backend was supplied or implemented.

## 1. Working context and evidence

| Status | Evidence or decision | Consequence |
| --- | --- | --- |
| Reported — brief | Operators work with 8,000–40,000 records; filtered lists may span hundreds of pages. | Selection and results must work beyond the loaded page. |
| Reported — brief | Operators update availability and categories while inspecting individual items. | Keep filters, item inspection, and progress accessible together. |
| Reported — brief | Updates may be accepted and finish later. | Acceptance, running, and completion need distinct states. |
| Reported — brief | Changes, permissions, and allowed values may invalidate individual updates. | Show reasons and recovery at record level; validate again when executing or retrying. |
| Reported — brief | A successful record cannot be blindly updated a second time. | Successes and uncertain outcomes are excluded from failure recovery. |
| Observed | The supplied project contains a text brief and no existing interface or service contract. | Existing navigation, runtime behavior, API guarantees, and user comprehension remain unknown. |
| Hypothesis | A browser-based operations console is the target. | Specify browser history, keyboard operation, and responsive layouts. Revisit platform-specific details if the actual target differs. |
| Decision | Retain existing roles, category rules, and permitted values. | The design consumes those rules; it does not introduce new permission or category models. |

**Target task.** An operator finds a subset, identifies the exact records to affect, reviews a field change, submits it once, continues catalog work, and later resolves exceptions with the original context available. Waiting and returning are part of this task. This is an inferred task model, not observed operator research.

**Material unknowns.** Snapshot support, request deduplication, per-record atomicity, status retention, and category cardinality need engineering confirmation. Section 8 makes their required behavior and fallback explicit. These unknowns do not prevent choosing a concrete interface.

## 2. Selection choice

| Candidate | Fit to this task | Decision |
| --- | --- | --- |
| Select only one page at a time | Clear small scope; requires repetitive selection across hundreds of pages. | Retain as a local action. |
| Automatically act on the live filter whenever submitted or executed | Compact interaction; records entering or leaving the query can change the target after review. | Exclude from the proposed submission path. |
| Explicit rows plus an explicit, frozen all-matching selection | Supports both selective inspection and large updates; scope can be explained, inspected, and reproduced. | **Chosen.** Requires a stable selection token or manifest. |

### Exact selection behavior

- Each readable row has a checkbox, independent of the product-name link. The header checkbox means **Select rows on this page**. It covers the current page's IDs, including rows outside the viewport, and never implies the full result set. It has checked, unchecked, and mixed states.
- Explicit selections persist across pagination, sorting, item inspection, and filtering. A newly checked row is an intentional addition. Show **73 selected · 11 on this page**, with **View selected** and **Clear selection**.
- After page selection, show **100 selected on this page. Select all 12,480 matching records**. These counts are examples, not a prescribed page size. Selection is separate from eligibility; review reports records that cannot be changed.
- Activating all-matching selection freezes the server-resolved IDs and revision references at that moment, together with the query, mandatory scope, and timestamp. Show a resolving state until an authoritative count and token arrive. Submission is unavailable while scope is unresolved.
- The pinned summary becomes **12,480 matching records selected · captured 14:32 · Supplier: Northwind; Availability: Unavailable**, followed by **View selected**, **Manage exclusions**, and **Clear selection**. Unchecking records adds explicit exclusions: **12,468 selected · 12 excluded**.
- A newly matching record is not added to this captured selection. A record that later stops matching remains a target until explicitly excluded; subsequent changes are detected at validation or execution. The review explains this behavior in plain language.
- Filtering the catalog changes the browsing view, preserving the captured scope. If they differ, show **Current view: …** and **Selection captured from: …** separately. In all-matching mode, rows outside the captured set show **Outside this selection** and cannot be added through its checkboxes. **Start a new selection from this view** saves the current draft and creates a new scope. Never silently combine scopes.
- **View selected** opens the frozen membership, with current readable data and change indicators. It is separately paginated and can show excluded rows. Returning restores the catalog view.
- Replacing an explicit selection with all matches displays the resulting count and any previously selected rows that will be left out. It requires an explicit **Replace selection** action when that would drop rows. A failed snapshot request retains the original selection.

The table and checkbox pattern follow Carbon's enterprise component guidance. Its batch-mode recommendation to disable row actions is adapted here: product inspection remains available because the brief explicitly requires it. Cross-page snapshot semantics are this plan's decision, not a claim made by Carbon. [S2]

## 3. Screen structure and retained context

| Surface | Content and actions | Continuation |
| --- | --- | --- |
| Catalog | Search; visible applied filters with attribute names; result count; sortable table; pagination; product identifier/name, availability, category, relevant change information. | Maintain useful comparison density and current column preferences. |
| Selection bar | Mode, exact selected count, scope summary, exclusions, **Review changes**, **View selected**. | Stays separate from the live result count. No action is enabled for an empty selection. |
| Product detail | Product identity and fields, current values, pending-update indicator where applicable. | A nonmodal detail pane on wide layouts; a detail route on narrow layouts. Closing restores the invoking row and scroll position. |
| Update draft | Selected scope and field controls; **Review update**; **Save and close**; **Discard draft**. | Draft survives inspection, navigation, and reload in the same authorized account. Discard is explicit; closing saves. |
| Updates | Active jobs and saved drafts; job ID, target count, requested change, start time, status, last checked time. | Accessible from the catalog and elsewhere; completion does not require keeping a toast open. |
| Update results | Attempt summary; searchable, filtered, paginated record outcomes; **Review failed records**; permitted result export; original scope link. | Opens independently of catalog filters; **Return to catalog** restores the originating view. |

The bulk editor and product inspector use the same secondary region on wide screens, with **Return to update draft** preserving its values. They do not form a stack of modal dialogs. Before submission, use a full review surface with room to inspect scope and exceptions. After submission, progress is nonmodal and never blocks the whole catalog.

### Return and refresh rules

Store query text, applied filters, mandatory scope, sort, page/cursor, page size, column settings, scroll anchor, focused record, selection token/IDs and exclusions, draft ID/values, and job ID as distinct state. Keep sensitive drafts account-scoped and subject to existing authorization. Shareable catalog URLs describe browsing constraints; a URL alone grants no access to a saved selection or job.

Catalog → product, draft review, or job results creates a browser history entry. Sort, pagination, and filter edits replace the current catalog entry rather than creating an entry per control change. Back/Forward restores the corresponding stored view; direct product/job entry provides a clear **Catalog** destination without assuming a previous internal page. This choice uses the History API mechanism and remains a product decision. [S7]

Updates can change which records match a live filter. Show **Results have changed — Refresh list** without moving rows, changing pages, or shifting focus during inspection. Refresh reconciles the view against current data while preserving filter intent and draft membership. If the original scroll anchor has disappeared, retain its position as closely as possible and explain the missing item. If a page is empty, retain the filter and offer the nearest valid page. On session expiry, restore accessible work after sign-in and revalidate; never automatically resubmit.

## 4. Draft, review, and submission

### Configure the intended change

Use one compact editor for the two related field groups. Each starts at **Keep existing value**. An operator explicitly enables **Change availability** or **Change categories**, then selects permitted values using the existing domain rules. Mixed existing values appear as **Multiple values** and never become an implicit replacement value.

Preserve the product's actual category cardinality. If it is single-valued, use its existing category selector. If it is multi-valued, expose explicit supported **Add**, **Remove**, or **Replace** operations and explain replacement in the review. These modes depend on the existing data rules; do not offer an unsupported mode. Blank input never implies clearing a field. Require an explicit permitted clear action. An unchanged draft cannot be submitted. If every selected record is already correct, review says **No changes needed** and offers a return to the catalog. If every record is blocked, submission remains unavailable while the operator resolves or changes the selection.

### Review

Run preflight against the fixed target, requested fields, current permissions, allowed values, and revision references. Show progress if this takes time and let the operator keep inspecting records. Review includes:

1. **Scope:** exact target count, selection mode, captured filters/time, exclusions, and a link to inspect every target through a paginated list.
2. **Change:** field names and requested values or category operation; unchanged fields are named as retained. Aggregate old values with access to per-record old → requested comparisons.
3. **Validation:** ready, already at target value, and blocked counts. Group blocked records by actionable reason and expose their IDs where current permissions allow.
4. **Consequences:** records may finish independently; completed changes stay applied; later conflicts can still occur after validation.

Example: **12,468 selected · 12,460 ready · 8 require attention.** Preserve all eight in the draft. The operator can resolve them or explicitly choose **Exclude these 8 and review 12,460**. Record the exclusion and refresh the review. Submission uses the exact reviewed count; preflight never silently drops records or broadens the selection.

The final action is **Submit update for 12,460 records**. The review is the confirmation step. Any change to target membership, field values, or applicable rules invalidates that review and triggers revalidation. Optimistic checks at execution still protect against changes after review.

### Submit once and resolve acknowledgement

Freeze the reviewed payload and create a stable request identity before transmitting. Disable repeated activation for that identity. Acknowledged acceptance opens the job and says **Update accepted for 12,460 records. Processing will continue in the background.** Acceptance is not completion; HTTP 202 has exactly that limited meaning. [S3]

If the response is lost, show **Checking whether the update started**. Reconcile using the same request identity, and recover the existing job when found. A transport retry is safe only if the service guarantees deduplication for that identity and unchanged payload. Do not create a new operation merely because the browser timed out. Request-ID guidance supports this requirement; the service's actual guarantee remains unverified. [S4]

After confirmed acceptance, the draft becomes immutable operation history and its active selection is retired from the catalog. The operator can start another selection. Item inspection remains available. A known active or uncertain operation blocks another mutation of the same record fields until reconciled; unrelated work continues. Other operators' changes are still handled by authoritative conflict checks.

## 5. Progress and outcome states

| State | What the operator sees | Available action and retained work |
| --- | --- | --- |
| Empty results / no selection | Applied filters, zero result or selected count, explanation. | Refine filters; clear removable constraints; retain draft values. |
| Resolving selection / validating | Scope or validation in progress; no invented exact count or completion percentage. | Continue inspection; close and resume draft. |
| Validation blocked | Reason groups and affected record links. | Correct, explicitly exclude, or save draft; no silent partial submission. |
| Sending | **Submitting update…** | Inspect elsewhere; repeated submit disabled for this request. |
| Submission outcome unknown | **Checking whether the update started** with last check time. | Check status; retain payload/identity; no new submit or failure retry. |
| Rejected before job creation | Service confirms no operation was created; concrete request-level reason. | Return to preserved draft, correct, revalidate, then submit a new attempt. |
| Accepted / queued | Job ID and **Waiting to start**, target count, requested values. | Continue catalog work; open progress. |
| Running | Counts for processed and pending records; known success/failure counts; last checked time. | Continue work and inspect results so far. Final failures are distinguished from records still being retried by the service. |
| Tracking unavailable / stale | **Status unavailable. Last confirmed at 14:36. Processing may continue.** | Reconnect or check status; retain known outcomes. Never infer that records failed. |
| Completed | Final totals and **View updated records**; already-correct records reported separately. | Return to catalog; results remain accessible. |
| Completed with failures | Exact updated / unchanged / failed totals; **Review failed records**. | Recover confirmed failures, preserving successful outcomes. |
| Finished with unresolved outcomes | Known totals plus **Outcome unknown** and the affected set. | Continue catalog work; reconcile these records. No “all complete” claim or retry for this set. |
| No records changed | All confirmed failed, already correct, or explicitly not attempted; separate counts and reasons. | Review each actionable group. A job-level error never erases record-level outcomes. |

Use a determinate progress indicator only when the service supplies an authoritative total and processed count. Label it **Processed**, because failed records also count as processed. Use an indeterminate waiting indicator otherwise; show an ETA only when the service supports it. Throttle assistive announcements to meaningful milestones and completion. Status updates do not move keyboard focus. [S5]

Closing progress only dismisses that view. It does not stop the job. A **Stop remaining** action is included only if the service supports an acknowledged stop with per-record outcomes; it must explain that completed changes remain applied. Until that capability is confirmed, the primary plan offers progress dismissal and continuation without promising cancellation or undo.

### Record accounting

Every submitted target belongs to exactly one current state: **queued/running**, **updated**, **already correct — no write**, **failed — confirmed no write**, **not attempted — confirmed**, or **outcome unknown**. Counts sum to the immutable submitted target. A terminal aggregate is displayed only after each record's classification is known, or clearly qualified when some outcomes remain unknown.

If a record can apply only some requested fields, show those field outcomes explicitly. Only the confirmed unapplied fields may enter recovery. Never label such a record as entirely failed or retry its entire original patch.

## 6. Partial failures and recovery

The result table uses stable record IDs, independently of whether the record still matches the catalog filter. Columns contain product/SKU, requested change, outcome, plain-language reason, and next action. Current values are fetched when needed and labeled separately from recorded values at execution. Permission loss may limit details and export; retain the permitted job summary and next step without leaking newly restricted fields.

Filters include **All**, **Updated**, **Already correct**, **Failed**, **Not attempted**, and **Outcome unknown**, plus failure reason. Failure filters and pagination belong to this result view and never rewrite catalog filters. Search by SKU/ID and a permitted CSV export support locating large affected sets; export identifies the job, attempt, record, intended change, recorded outcome/time, reason, and related recovery attempt.

| Confirmed reason | Explain and show | Recovery |
| --- | --- | --- |
| Record changed | **Changed since review**; original reviewed value, current value, requested value; changed fields/time when allowed. | Compare, keep current, revise the intended value, or explicitly reapply after reviewing current data. Use a fresh revision reference. No automatic overwrite. |
| Permission changed | **You no longer have permission to change this record.** | Omit from retry while blocked; use the existing access process if appropriate. Recheck permission before offering submission again. |
| Value no longer allowed | Invalid requested value and current permitted alternatives or governing rule. | Choose a permitted value for that group, then revalidate the affected records. Preserve the other field choices. |
| Temporary failure, final and confirmed unapplied | Plain reason and latest service status. | Offer retry after revalidation only when the service reports final, safely retryable failure. A service retry in progress remains pending. |
| Outcome unknown | **We cannot yet confirm whether this change applied.** | Read operation/record receipts. Do not offer retry until the outcome is authoritative. A current value alone is insufficient proof of which operation applied it. |

**Recovery sequence:** open failed records → select the confirmed unresolved failures → compare/correct or exclude → fetch current values/permissions and revalidate → review the exact subset and new changes → submit a linked child attempt with a new request identity. Its own transport retries reuse that child identity. Reopen the existing child if one is already active for that failure; do not duplicate it.

All successful, already-correct, active, and uncertain records/fields are excluded from recovery eligibility. For interrupted jobs, confirmed unattempted records can be reviewed through a separately labeled **Review unattempted records** path. This prevents an ambiguous error from becoming permission to replay an entire batch. Async batch guidance supports individually attributable final failures; this specific UI and recovery policy is a product decision. [S6]

Keep the original attempt's result unchanged. Show a linked **Recovered in update …** annotation and recovery history per record. A family summary may show unresolved records using unique record IDs, with successful later resolution counted once. Operators can leave an exception unresolved with a note where the existing product supports notes; dismissing the result is never represented as resolving it.

### Worked scenario — illustrative

From 12,480 captured matches, exclude 12 deliberately. Preflight flags 8 more; the operator explicitly excludes them and submits **12,460**. A final report shows **12,327 updated + 21 already correct + 112 failed = 12,460**. Failures are 64 conflicts, 31 permission changes, and 17 invalid values.

After comparison, the 64 conflicts can form one reviewed recovery attempt. The 17 invalid values require correction and may form another attempt with a different patch. The 31 permission failures remain blocked. The 12,348 successful or already-correct records are never included in either recovery. These are explanatory figures, not service results or measured performance.

## 7. Keyboard operation and smaller layouts

Use native table semantics, named column headers, labeled checkboxes, and product links. Checkbox names include record identity; the page checkbox includes its page scope. Expose its mixed state programmatically. Sort controls announce their field and direction. Convey status through text as well as color.

Keep filtering, selection, review, results, and recovery operable by keyboard. When review validation fails, focus a named error summary linked to the affected field/groups. Preserve logical focus when switching between draft and product details; on return restore the triggering control or a nearby logical target if it disappeared. Use a nonmodal region for the wide-screen inspector with an accessible close action. If a later implementation uses a modal for an explicit destructive discard, implement dialog focus containment, Escape, and return correctly. [S8]

At narrow widths or increased text size, move inspection and review into sequential views while retaining all state. Keep scope/count and actions visible; allow table scrolling with accessible column headings and a stable identity column. Expose long filter summaries and failure reasons through readable expandable text, with the existence of hidden detail explicit. No critical action depends on hover, a gesture, or color alone. The target is browser access; native mobile component dimensions are not imported as web requirements.

## 8. Required service information and open owners

These are interface dependencies, not backend implementation work.

| Dependency | Required guarantee for this plan | Owner / bounded fallback |
| --- | --- | --- |
| Captured selection | Stable membership/count, revision references, exclusions, and expiration that cannot silently recalculate the target. Draft expiration cannot erase an accepted job's target history. | Engineering: verify capability. If expired, keep the draft and compare a refreshed scope before a new review. If unavailable, keep explicit-ID selection and withhold all-matching submission. |
| Submission identity | Durable identity created before transmission; lookup and defined deduplication retention for identical requests. | Engineering: verify lifetime. After an uncertain acknowledgement, reconcile; if the guarantee is unavailable or expired, keep it unresolved and route for investigation instead of replaying. |
| Operation receipts | Durable job ID, authoritative status, per-record/field outcomes, finality, reasons, and permitted result access after reload. | Engineering: verify. UI polling or push is replaceable; reliable outcome retrieval is essential. |
| Service size limits | A supported way to resolve and execute the reviewed 8,000–40,000-record scope. If internal chunks are necessary, they retain one operation ledger with stable subrequest identities and record outcomes. | Engineering: confirm limits. If orchestration is unavailable, show the supported limit before submission and preserve the full draft while the operator reviews explicit supported subsets. |
| Conflict and eligibility checks | Existing rules evaluated when changes execute and again for recovery, with authoritative revision checks. | Engineering/domain owner: map current semantics. A preflight pass cannot guarantee later success. |
| Partial field application | Prefer atomic application of the intended patch per record. If unavailable, explicit per-field receipts must identify what applied. | Engineering: confirm before implementation. Disable automated recovery if unapplied work cannot be identified. |
| Category semantics | Existing cardinality, allowed actions, permissions, and values. | Domain owner: supply existing schema; adapt the editor without changing the selected workflow. |
| Retention and continuity | Saved draft/job persistence, access checks, operation history lifetime, status recovery after sign-in. | Product + engineering: choose retention consistent with existing policy and expose expiry dates. Store expired references as unavailable, never as failed updates. |
| Stop / revert capability | Verified semantics and outcomes for remaining work or compensating updates. | Engineering: optional future capability. Do not show a control that claims unavailable reversibility. |

## 9. Verification record

### Checks performed on this plan

| Check | Method and conditions | Observation | Status |
| --- | --- | --- | --- |
| Requirement coverage | Inspected the supplied brief and mapped its required functions to sections 2–6. | Selection, submission, delayed progress, completion, partial failure, recovery, large lists, and item inspection each have an explicit path. | supported_in_conditions — document review |
| Main path and continuation | Expert walkthrough: select across pages, inspect an item, review, accept, continue catalog work, open results, return. | Each transition specifies retained context and a next action; final confirmation names the target count. | supported_in_conditions — plan coherence |
| Scope changes | Expert walkthrough: live filter changes; new matches; removal from live results; expired snapshot. | Captured membership remains explicit; a refreshed scope requires comparison/review; browsing does not mutate the job. | supported_in_conditions — plan coherence |
| Failure and retry boundaries | Expert walkthrough: lost acknowledgement, stale tracking, conflicts, permissions, invalid values, and partial field outcomes. | Unknown outcomes reconcile first; only confirmed unapplied work enters a new reviewed attempt. | supported_in_conditions — plan coherence |
| Synthetic accounting and selection invariants | Executed 11 Python set/count assertions using the illustrative scenario and up to 40,000 IDs; no service or UI execution. | All passed: fixed scope, exclusions, count partitions, failure-only recovery, active-child exclusion, unknown outcomes, and partial-field recovery are internally consistent in the model. | supported_in_conditions — synthetic specification model |
| Artifact completeness | Executed 4 additional Python assertions against the saved document and project file list. | Required phases and source links are present; all 6 implementation acceptance rows have empty observations; project files are BRIEF.md and RESULT.md. | supported_in_conditions — artifact inspection |

### Acceptance checks for implementation

The observation cells below intentionally remain empty. A plan walkthrough does not verify runtime behavior or operator understanding.

| Expectation | Method | Conditions | Observation | Status |
| --- | --- | --- | --- | --- |
| Page/all-matching selection, exclusions, and count survive pagination, filters, sorting, and details. | Browser task execution plus inspection of submitted IDs/token. | Realistic 8,000–40,000 record fixture; records enter/leave filters during the task. | | unverified |
| Lost acknowledgement never creates a second logical operation. | Fault injection and request/receipt inspection. | Drop the response after server acceptance; reload; repeated activation; deduplication expiry. | | unverified |
| Recovery excludes applied and uncertain records/fields. | Inject mixed outcomes and inspect the recovery payload. | Conflict, permission revocation, invalid value, partial field application, unknown outcome, and overlapping child attempt. | | unverified |
| Catalog return restores meaningful position without changing job scope. | Browser Back/Forward, reload, direct-entry, and responsive task checks. | Start from a deep page; change a filter-defining field; remove the scroll anchor. | | unverified |
| Scope, errors, progress, and recovery are keyboard and assistive-technology accessible. | Keyboard and screen-reader interaction; semantic inspection. | Mixed checkbox, review errors, ongoing updates, narrow layout, increased text size. | | unverified |
| Operators distinguish selected scope, acceptance, completion, and safe recovery. | Observe realistic tasks with representative operators; ask them to explain the affected set and next step. | Include page selection, all-matching selection, changed filters, and partial failure. | | unverified |

No runnable interface, production service, screenshots, or operator study were available. Browser execution was unavailable in the supplied environment; no browser or client was installed. Runtime performance, focus behavior, screen-reader behavior, actual persistence, and complete accessibility conformance remain unverified. The next authorized implementation step would be engineering confirmation of section 8 followed by the interaction checks above; this assignment ends with the plan.

## 10. Sources and applicability

- **S1 — [Supplied product brief](BRIEF.md).** Source of audience, scale, required operations, asynchronous behavior, and constraints. Product statements are reported evidence.
- **S2 — [IBM Carbon: Data table](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines).** Primary enterprise design-system practice for selection, mixed header checkboxes, pagination, and batch actions. Inspected online; its patterns are adapted to continued inspection here.
- **S3 — [RFC 9110 §15.3.3: 202 Accepted](https://www.rfc-editor.org/rfc/rfc9110.html#name-202-accepted).** Primary HTTP standard supporting the distinction between acceptance and completed processing. It does not prescribe this UI or guarantee the supplied service's behavior.
- **S4 — [Google AIP-155: Request identification](https://google.aip.dev/155).** Primary API design guidance on identification and safe retries. Applied as a dependency to verify, not evidence that this product already deduplicates requests.
- **S5 — [W3C: Understanding SC 4.1.3, Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).** Informative explanation of the normative criterion: status changes can be conveyed programmatically without moving focus. Supports the proposed progress announcements.
- **S6 — [Google AIP-234: Batch methods — Update](https://google.aip.dev/234).** Primary API guidance for async partial success and individually attributable final failures. Its transport and schema choices are illustrative, not requirements imposed on the existing service.
- **S7 — [MDN: Working with the History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API).** Platform mechanism referenced through the supplied web guidance. The proposed restoration behavior is a project decision.
- **S8 — [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [WAI APG: Modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).** Normative web criteria and an informative implementation pattern respectively, referenced through the supplied skill. This document specifies intended behavior and makes no conformance claim.

Local workflow applied: design-interface → inspect-interface → plan-interface → check-interface. The selection, state, recovery, browser, and evidence guidance from that same local package informed the plan. Skill files were left unchanged.

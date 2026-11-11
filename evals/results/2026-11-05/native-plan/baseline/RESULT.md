# Site visit report — iOS and Android flow plan

## 1. Outcome and evidence

Design one durable reporting task: open an assigned visit, record observations, attach photos, assess equipment, review, and explicitly submit. Both apps use the same report identity, required information, validation, persistence rules, and submission outcomes. Native navigation, keyboard handling, supporting presentations, and accessibility behavior follow each platform.

**Scope:** a design plan for native iPhone and Android phone apps, including Android window resizing. No native implementation, simulator, device, or app runtime is supplied. iPadOS-specific layouts are outside this plan.

| Status | Basis and consequence |
|---|---|
| Observed | `BRIEF.md` is the supplied product material. It names the technician, report actions, list and notification entry, interruptions, loss of connection, retained drafts, confirmed submission lock, and recoverable server conflict. |
| Reported requirement | Those behaviors are requirements from the brief; no existing app behavior or technician usage has been observed. |
| Decision | Use a persistent report editor with a separate review step; retain work continuously; require server confirmation before permanent locking. |
| Hypothesis | Notes and equipment condition are mandatory, and photos have no minimum count. The brief requires photo attachment capability but gives no evidence policy. The main walkthrough includes an attached photo. |
| Unknown | Approved condition vocabulary, attachment limits, supported OS versions, authentication rules, server revision API, and whether drafts synchronize between devices. These are bounded dependencies, listed in §8. |

The workflow used the local `design-interface` skill and its inspection, planning, and checking modules. The recommendations below are design decisions grounded in the brief and relevant platform documentation; they are not measured usability findings.

## 2. Shared information and product rules

### Content contract

| Information | Location and behavior |
|---|---|
| Visit identity | Site name, visit reference, scheduled date, assignment, and equipment identifier appear in Visit detail. Report, review, and receipt retain the site name and visit reference so notification entry remains understandable. |
| Observations | A labelled multiline text editor with a persistent label and an example hint, such as “Describe what you found and work performed.” Existing text is never replaced by a hint or refresh. |
| Equipment condition | The assigned equipment name/identifier and one explicit selection. Proposed terms: **Operational**, **Needs attention**, **Not operational**, **Unable to assess**. No preselected answer. Require a reason for Unable to assess. Repeat the same block when the visit already contains several assigned items. |
| Photos | Thumbnail list, accessible photo name, attachment state, preview, Remove, and Retry when appropriate. Photos can be added from camera or the system library picker. Selected files become durable local report attachments. |
| Draft status | “Saving…” while a write is pending; “Saved on this device · 14:32” after durable local storage confirms it. Connection and upload status are separate text. |
| Review | Full observations, every condition and reason, photo count/previews, and links to edit the relevant section. Long notes remain readable and selectable. |
| Submission receipt | “Report submitted,” server report reference, server submission time, visit identity, and read-only submitted content. This is the explicit successful outcome. |

**Proposed validation:** observations must contain meaningful non-whitespace text; every assigned item must have a condition; Unable to assess needs a reason. Photos are optional under the stated hypothesis. Every photo retained in the report must be imported successfully and uploaded before final acceptance. Both clients and the server must apply the same approved rules. Any text length, file count, type, or size limit must be shown before it blocks work; the brief supplies no numeric limits.

Changing a condition preserves observations and photos. A reason entered for Unable to assess remains in the local draft if the technician chooses another condition; it is excluded from the submitted payload while irrelevant and restored if that condition is selected again. Review shows exactly what will be sent.

### Shared lifecycle invariants

1. One active draft per account and visit. Opening the same visit from a list or a notification retrieves that draft.
2. Navigation, picker cancellation, app backgrounding, and connection loss never mean discard. Each accepted edit and attachment change is persisted locally; the saved label reflects actual durable completion.
3. Review can be completed offline. Final submission requires a connection. Reconnection may resume attachment transfer but never initiates a new final submission without the technician’s explicit Submit action.
4. A final request submits one frozen report revision with a stable request identifier and the server revision it was based on. Repeated taps and retries for an uncertain request cannot create another report.
5. Permanent read-only status requires a confirmed server receipt. Upload completion, an HTTP request being sent, a timeout, or a server queue acknowledgement is insufficient.
6. A conflict preserves the technician’s local version. Resolution never silently overwrites the newer server version or erases local evidence.

These are product decisions required to make the brief executable. They require durable storage, attachment transfer, version checking, and idempotent submission services; navigation state alone cannot provide them.

## 3. Screens and primary path

| Destination | Structure and primary action | Continuation and retained state |
|---|---|---|
| **Assigned visits** | Existing visit list. Each row exposes site, date, and report status: Not started, Draft on this device, Submission pending, Conflict, or Submitted. | Open Visit detail. Returning restores the list’s prior filter and scroll position when an actual list state exists. |
| **Visit detail** | Assignment context, equipment, and report status. Primary action is Start report, Resume report, Check submission, Resolve conflict, or View report according to state. | The visit is the stable context for both entry routes. Starting creates a draft only if none exists. |
| **Report** | One scrollable form: identity/status, Observations preview with Edit, equipment condition blocks, then Photos. A visible Review report action follows the form. | Sections may be completed in any order. Ordinary Back/Up preserves all work. No separate save operation or routine discard confirmation. |
| **Observations** | Dedicated full-page multiline editor for prolonged notes. Site/visit context, autosave status, and a clearly named completion control remain available. | Done returns to the invoking Report or Review screen. Back follows the same return route and retains text. Completing this screen ends editing; it does not submit or determine whether data is saved. |
| **Review report** | Full report and per-section Edit actions. Explain: “After submission, this report is locked.” Final action: Submit report. | Validation failures produce a short linked error summary and field errors. Edit observations opens Notes with Review as its return target. Edit equipment or photos returns to the existing Report at that section; Review report reopens the updated Review. Avoid duplicate Report/Review entries in the stack. |
| **Submission status / receipt** | Progress with the current step, followed by explicit success or actionable recovery. | The technician may leave while the attempt remains tracked. Successful completion replaces editable destinations for this report with the receipt. |
| **Resolve conflict** | Latest server information and preserved local information, with choices for differing report fields. | Save resolution returns to Review. Leaving preserves the unresolved comparison and selected resolutions. |

The separate notes editor gives long text and the keyboard adequate room. The report itself remains one meaningful form rather than a forced step sequence; technicians can revise observations after assessing equipment or adding evidence. The review step makes the lock consequence visible immediately before submission. Prolonged editing uses a full page; sheets are reserved for short supporting choices, consistent with Apple’s scoped-task guidance. [A1, A2]

### Main path

1. Open an assigned visit from the list or its notification. Resolve the visit ID, check access, then display the current saved draft or server status.
2. Select Start report or Resume report. Enter observations, choose equipment condition, and attach photos. The draft updates without waiting for network access.
3. Select Review report. Show missing required content with links to fix it; preserve all other input. A failed attachment has Retry and Remove choices.
4. On Review, select Submit report while connected. Freeze the reviewed revision, finish any required photo uploads, and send the final request once. Show the current step and retain the attempt locally.
5. On authoritative success, show the receipt and make every route to this report read-only. Back returns to Visit detail; View report opens the same receipt. A stale notification also opens the current submitted state.

No new top-level navigation destination is introduced for Observations, Photos, or Review. They are actions or subordinate views within one visit. If the broader app already has primary navigation, preserve its established structure.

## 4. Interruption, connectivity, and recovery

### Draft and attachment retention

Persist the report ID, visit ID, values, condition reasons, local revision, base server revision, attachment files and states, and any in-flight submission identifier. Restore the current section, note selection/caret, and useful scroll position separately. The text and files must survive process recreation; UI restoration data is supplementary.

Use local storage writes throughout editing, with a flush before intentional navigation or opening another task. Do not rely solely on an app-background callback. If a write fails, show “Couldn’t save the latest changes on this device” and offer Retry. Keep the current content visible. An explicit Exit without saving may warn about the actual unsaved portion; ordinary saved navigation needs no warning.

When a photo is selected, show Importing until its bytes are copied into durable app storage. A thumbnail alone is insufficient proof of retention. Cloud-only picker items may need a download; offline failure leaves other attachments intact and offers Retry or Remove. Canceling a picker before completion adds nothing. Successfully imported photos remain attached when the picker, camera, or app closes. A camera denial offers Choose from library and, when useful, Open Settings. Remove acts on one selected attachment and offers an undo path before its local bytes are cleaned up.

The app may resume background transfers when the OS permits. The visible promise is that the draft remains saved and transfers can resume when the app returns; completion in the background is not guaranteed.

### State and action table

| State / cause | What the technician sees | Available action and next state | Data and locking rule |
|---|---|---|---|
| Loading or restoring | Visit identity when cached; “Opening report…” | Retry after a retrieval failure; open a cached draft when available | A refresh never replaces newer local edits. |
| Offline with cached visit | “Offline · Draft saved on this device” plus photo transfer states | Continue editing or review | Editable. A current server revision is checked before final submission. |
| Offline without cached visit | “Connect to load this visit.” | Retry or return to visits | Preserve the pending destination; do not create a report for an unverified assignment. |
| Review while offline | Full review plus “Connect to submit. Your draft is saved on this device.” | Return to report or retry connection; Submit becomes available when connected | No automatic final submission on reconnection. |
| Validation failure | Linked error summary and errors next to the relevant fields | Edit, then review again | All entered content stays intact. |
| Preparing submission | “Uploading 2 of 3 photos…” or “Preparing report…” | Leave and return to check progress; Stop preparation before the final request is sent | Snapshot remains retained. Stopping before the request releases it for editing. |
| Final request in progress | “Submitting report…” | Leave and return; repeated Submit is unavailable | Temporarily prevent edits to the submitted snapshot. Permanent lock has not yet been established. |
| Definitive failure with no acceptance | “Report wasn’t submitted” and the specific recoverable reason | Retry when appropriate, or return to editing | Release the snapshot for editing only after non-acceptance is certain. Preserve successful photo uploads. |
| Response lost / outcome unknown | “Submission not confirmed. Checking status…” | Check submission when online, or leave | Keep the original attempt ID and snapshot. Query status; a safe retry uses the same ID. Do not create a new request or present success. |
| Server conflict | “This report or visit changed while you were editing. Your version is saved.” | Review changes or leave | Preserve both accessible versions and block finalization until resolved. |
| Confirmed submitted | Receipt and “Submitted · Read only” | View report or return to Visit detail | Lock the report everywhere, including old editor instances. |
| Assignment/access changed | Explain the available server reason without exposing inaccessible content | Return or retry access after reauthentication | Preserve local work under its original account. Do not submit it to another account or visit. |

Stop preparation must be recorded atomically before the final request begins; once that boundary is crossed, the stop action becomes unavailable and status reconciliation owns the outcome.

A missing receipt lookup result must have a contractually definite meaning before editing can resume. “No result yet” is not proof that the server did not commit. The service must distinguish pending, accepted, and definitively not accepted attempts.

### Recovering a server conflict

1. Retain the local snapshot and retrieve the latest authorized server revision. If that retrieval fails, keep the conflict state and offer Retry.
2. Server-owned assignment, site, and equipment identity always use the latest authorized values. If the equipment set changed, preserve removed-item input in the local copy and require assessment of newly required equipment. A canceled or reassigned visit follows the access/assignment recovery state. For changed editable fields, show **Your saved version** and **Latest version**, including revision time when known. Label all differences in text; color is supplementary.
3. Preselect identical values. For differing observations, offer Use yours, Use latest, or Edit combined text; never concatenate long notes silently. For conditions, require a deliberate selection when the values differ. For photos, compare stable attachment identities and show additions/removals explicitly.
4. Show a complete resolved preview. **Save resolution** stores a new local revision against the latest server revision and returns to Review. The technician explicitly submits again. A further conflict reopens the comparison without losing this resolution.
5. If the server report is already submitted, display that authoritative receipt as read-only. Keep the local work separately labelled **Unsubmitted local copy**, available for comparison and copying notes or reviewing photos. An amendment process is outside this brief; do not offer an overwrite or resubmission that the service has not authorized.

## 5. Native platform decisions

### Navigation and entry

| Situation | iOS | Android |
|---|---|---|
| Entry from the visit list | Push Visit detail, Report, Notes, and Review within the visit’s navigation stack. Back buttons and the standard edge-swipe return through that path. | Use destinations within the app’s normal navigation hierarchy. Top app-bar Up returns within the app; system Back follows the current navigation/task history and first dismisses the IME when it is showing. |
| Cold notification entry | Construct Assigned visits → Visit detail for the target visit. The navigation bar provides a real “Visits” return destination. No imaginary previously visited screen is shown. | Treat Visit detail as a regular app destination. The notification opens an app task with a realistic parent stack, Assigned visits → Visit detail. Use the navigation framework’s equivalent of the documented notification parent-stack setup. [G1, G2] |
| Notification while another visit is open | Persist the existing draft, route to the target visit, and retain the previous draft in the list. Reuse the target visit’s draft; do not stack duplicate editors. | A notification deep link may replace the app task’s navigation stack. Persist the previous visit before routing; its draft remains recoverable from Assigned visits. Repeated notifications do not create duplicate drafts. [G1] |
| Return from notification-opened detail | Back → Visits. The system retains its own external-app switching affordances where applicable. | For this chosen notification task: Back and Up → Assigned visits. At the root, no Up; system Back exits toward the previous system task/home. A future implicit link opened in another app’s task would need a separate contract: Back can return to that app while Up reaches this app’s hierarchy. [G1, G2] |
| Successful submission | Replace the editing portion of the stack with the receipt; Back reaches Visit detail. | Remove editable report destinations from the back stack and present the receipt; Back/Up reaches Visit detail. |

On both platforms, a link that requires sign-in retains its target visit and resumes after successful authentication. A stale link resolves current access and status. Offline entry resumes a locally available draft; it does not require another visit fetch to read saved work.

### Notes and keyboard

**iOS.** Use a native multiline text view with Dynamic Type. Keep the caret and active selection visible as the keyboard appears or changes height. Size the scrolling area using the keyboard’s occupied region and safe area; `UIKeyboardLayoutGuide` is one available native mechanism. Use a visible Done action in the navigation/keyboard accessory controls to end editing and return to the invoking Report or Review screen; Back/edge-swipe follows that return target and preserves the draft. Return inserts a newline. Keyboard dismissal is available without a gesture-only requirement. [A2, A3]

**Android.** Use a labelled native multiline editor. Apply system-bar and IME insets so the caret, final lines, and relevant controls remain reachable; in Compose, inset-aware padding such as `imePadding` is an available mechanism. With the IME showing, system Back first dismisses it; the next Back returns to the invoking Report or Review screen. Up or the explicit Done action follows that return target and closes the keyboard while preserving text. Use the platform Back handling compatible with predictive Back, without a custom gesture interception solely for saving. [G3]

Both editors keep long notes in a scrollable area and keep Submit on the later Review screen. External keyboards support normal multiline entry and logical focus traversal. Restoring a draft restores the editing position but does not unexpectedly open the keyboard after a cold launch; the technician can resume typing explicitly.

### Supporting tasks and photos

**iOS.** Add photo opens a short native action chooser for Take photo and Choose photos. Dismiss that chooser before opening the system photo picker or full-screen camera. The picker/camera is modal: the underlying report cannot be edited during selection. The system completion action imports the selected photos; Cancel or supported dismissal before completion returns to the unchanged report. Use a system Photos picker appropriate to the supported OS. Previewing an attached photo uses a dedicated view with named Close/Back and Remove actions. [A1]

**Android.** Add photo opens a modal bottom sheet with Take photo and Choose photos. Selecting an action closes the sheet before opening the camera or Android Photo Picker. Back or tapping the scrim cancels the short choice and returns to the report. Photo Picker grants access to selected media; the platform’s supported document-picker fallback can serve older devices. Persist or copy the returned media before promising it is saved, and handle activity/process recreation during the picker round trip. [G4]

Condition choices are inline within each equipment block on Report: iOS uses native selection rows with a checkmark; Android uses a labelled single-selection group with radio semantics. A selection commits to the local draft immediately without navigating. Unable to assess reveals a labelled multiline Reason field below that equipment’s choices; it uses the same keyboard visibility and draft-preservation rules as notes. Review’s Edit condition action returns to the existing Report at that block; Review report returns to the updated review. Back from Report continues to Visit detail. Neither platform uses a bottom navigation bar or primary tab bar to represent report fields.

### Adaptation and accessible operation

| iOS design intent | Android design intent | Shared result |
|---|---|---|
| Dynamic Type, native heading/label traits, VoiceOver reading order, Switch Control and Voice Control operation. Choose touch areas of at least 44 × 44 pt as a project target. [A4] | Font/display scaling, native heading and pane semantics, TalkBack, Switch Access, and labelled accessibility actions. Use at least 48 × 48 dp touch targets. [G5, G6] | Notes, condition values, labels, status, and errors remain understandable and operable without color or icon recognition alone. |
| Reflow labels and buttons on a small iPhone, landscape, and large text. Keep full-page editing usable within safe areas. | Reflow for compact windows, rotation, split-screen, and fold/unfold. Preserve selected visit and data through configuration changes. | Stack controls when space is reduced. Allow document scrolling; never crop the active field or make the final action unreachable. |
| Announce the result of adding/removing a photo and final submission with native accessibility mechanisms. | Give the supporting sheet a specific pane title; expose independent preview, Remove, and Retry actions. [G5] | Each photo has a distinct accessible name such as “Photo 2, upload failed.” Announce meaningful status changes once, without speaking every autosave or progress increment. |

Focus returns to Add photo after picker cancellation, to the new attachment after successful import, and to the originating section after editing. Validation links move focus to the relevant field. The receipt announces its success heading. These are acceptance expectations; no accessibility tree or assistive-technology behavior has been inspected.

## 6. Checks actually performed

The review below was performed against the brief and this written plan. Its scope is document coherence, not an executing app.

| Check | Method and conditions | Observation | Status |
|---|---|---|---|
| Required task coverage | Trace each requirement in `BRIEF.md` to §§2–5 | List/notification entry, observations, photos, condition, review, submission, interruption, offline work, draft return, lock, and conflict all have explicit behavior. | `supported_in_conditions` |
| Internal and notification return | Walk the specified iOS and Android routes, including cold/warm entry and submitted state | Every destination has a return route. Android Up, Back, task entry, and IME dismissal have distinct rules. | `supported_in_conditions` |
| No premature success | Review the state table and submission invariants | Preparing, in-flight, uncertain, failed, and conflict states cannot establish a permanent lock. Only a confirmed receipt can. | `supported_in_conditions` |
| Retention and recovery | Walk leaving Notes, canceling a picker, going offline, losing a response, and resolving a conflict | Each branch specifies retained content, feedback, and a next action. Snapshot edits remain blocked only while the result could still be accepted. | `supported_in_conditions` |
| Shared logic and platform scope | Compare platform sections with the content contract | Field meaning, required values, submission, and recovery are shared. Native differences concern interaction and presentation. iPadOS is not assumed. | `supported_in_conditions` |
| Source review | Read the local skill references and relevant primary Apple/Android material | Platform decisions have attributed sources; product-specific persistence and conflict policies are labelled decisions. Apple Markdown documentation was retrieved programmatically where its HTML page required JavaScript. | `supported_in_conditions` |

A final programmatic document check verified required sections and key state terms, reference definitions, unchanged input/skill file hashes, and that `RESULT.md` is the only added project file. This check validates the deliverable’s structure and change boundary; it does not validate native execution.

## 7. Acceptance observations for a future implementation

All checks below are **unverified**. No runtime observation is claimed.

| Expectation | Method and required conditions | Observation | Status |
|---|---|---|---|
| Saved drafts survive return and process recreation | On each target OS, enter long notes, set conditions, import photos, leave via navigation/background, terminate the process, relaunch, and open through both entry routes. Compare content and files. | | `unverified` |
| Both entry routes produce correct return behavior | Test cold/warm notification entry, another open draft, repeated notification, sign-in, stale submitted report, and actual Android task/Back/Up behavior. | | `unverified` |
| Keyboard never prevents continued editing | On small iPhone and compact Android, use long text, large text, rotation, different IME heights, and hardware keyboard. Verify caret visibility, completion, and Android Back ordering. | | `unverified` |
| Attachments remain durable and recoverable | Exercise camera denial, picker cancel, cloud-only image offline, interrupted import/upload, process death, retry, and removal/undo with real supported photo providers. | | `unverified` |
| Offline work never implies submission | Disable networking during each stage; restore it. Verify saved content, blocked final action offline, resumed uploads, and no unrequested finalization. | | `unverified` |
| Exactly one final report and an authoritative lock | Use a controllable server to delay/drop responses after commit, repeat taps, retry with the same key, and reopen via notification. Check receipt identity and every editing route. | | `unverified` |
| Conflicts preserve both versions | Change notes/condition/photos on the server, submit stale data, resolve, interrupt resolution, and induce a second conflict. Also test already-submitted and revoked-access cases. | | `unverified` |
| Accessible completion and adaptation | Inspect native semantics; complete the flow using VoiceOver/TalkBack and supported switch/voice input. Test large text, dark/high-contrast settings, Android resizing, and named photo/error actions. | | `unverified` |
| Technicians understand the status and recovery choices | Observe representative technicians completing an interrupted visit, distinguishing saved versus submitted, and resolving a conflict. Use findings to revise copy or structure. | | `unverified` |

No simulator, device, app runtime, rendered native prototype, or participant study was available. No browser or client was installed. The native behavior and any usability or complete accessibility claim remain unverified.

## 8. Dependencies and next owners

| Owner | Required confirmation or capability | What it changes |
|---|---|---|
| Product/domain owner | Approve condition vocabulary, Unable to assess policy, mandatory observations, photo evidence minimum, and whether several assets share one report | Final labels and shared validation. The proposed defaults above permit the plan to proceed. |
| Service owner | Stable report/visit IDs, revision tokens, final submission idempotency, definitive status lookup, immutable receipt, and authorized latest-version retrieval | Whether the stated conflict and uncertain-result recovery can be implemented safely. |
| Mobile owners | Durable account-scoped draft store, retained photo bytes, recoverable transfers, notification routing, and lifecycle restoration | Whether interruption and return meet the brief. |
| Product/mobile owners | Supported iOS/Android versions, attachment limits, approved device sizes, and cross-device draft expectations | Native API fallbacks and the exact acceptance matrix. No cross-device draft-sync promise is made by this plan. |
| Future implementation owner | Build only when separately requested, then perform the relevant checks in §7 | Converts a coherent design into verified native behavior. |

## Sources

The brief is the source of product requirements. Platform sources support the attributed native choices; they do not establish the proposed domain rules or guarantee user success. Reviewed 5 November 2026.

- **[B]** [Supplied project brief](BRIEF.md).
- **[A1]** Apple, [Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets). Scoped supporting tasks, modality, dismissal, and alternatives for prolonged work. [Markdown source](https://developer.apple.com/design/human-interface-guidelines/sheets.md).
- **[A2]** Apple, [Text views](https://developer.apple.com/design/human-interface-guidelines/text-views). Multiline editing, scrolling, Dynamic Type, and useful selectable text. [Markdown source](https://developer.apple.com/design/human-interface-guidelines/text-views.md).
- **[A3]** Apple, [UIKeyboardLayoutGuide](https://developer.apple.com/documentation/uikit/uikeyboardlayoutguide). Keyboard-aware layout capability; available API choice depends on the supported OS. [Markdown source](https://developer.apple.com/documentation/uikit/uikeyboardlayoutguide.md).
- **[A4]** Apple, [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility). Adaptable content and native accessibility practices. [Markdown source](https://developer.apple.com/design/human-interface-guidelines/accessibility.md).
- **[G1]** Android Developers, [Principles of navigation](https://developer.android.com/guide/navigation/principles). Back, Up, app-task context, and deep-link stacks.
- **[G2]** Android Developers, [Start an Activity from a Notification](https://developer.android.com/develop/ui/views/notifications/navigation). Regular destinations and complete parent back stacks.
- **[G3]** Android Developers, [Set up window insets](https://developer.android.com/develop/ui/compose/system/insets-ui). System/IME inset handling and avoiding obscured interactive content.
- **[G4]** Android Developers, [Photo picker](https://developer.android.com/training/data-storage/shared/photopicker). Selected-media access, picker contracts, fallback, and media access lifetime.
- **[G5]** Android Developers, [Principles for improving app accessibility](https://developer.android.com/guide/topics/ui/accessibility/principles). Headings, pane titles, grouping, and accessible actions.
- **[G6]** Android Developers, [Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps). Touch target guidance in Android units.

# Home maintenance — initial interface plan

## 1. Recommended first version

Build a responsive browser tool for one household, with three main views: **Due**, **Jobs**, and **History**. A household organizer can see what needs attention, record work when it is done, and find the last time a job was completed. Start with clear text lists and dates. The requested deliverable is this plan; implementation has not begun.

### Working context and evidence

| Status | What is established | Source or consequence |
| --- | --- | --- |
| Reported requirement | One household; browser use, including a phone browser; remember maintenance and find past work. | [BRIEF.md](BRIEF.md). |
| User decision | Keep the first version simple. Exclude a contractor marketplace, payments, and a team permission system. | [BRIEF.md](BRIEF.md). |
| Observed | The supplied project contains a short brief. It supplies no existing application, designs, brand, real job examples, or usage research. | Project file inspection. |
| Hypothesis | One person will usually organize the household's jobs and will benefit from seeing the same records on a phone and a computer. | Working model for account and storage choices; actual household behavior is unknown. |
| Designer decision | Use the defaults below to make the initial plan concrete. | The task explicitly delegates undecided product choices. These proposals are revisable and are not recorded as confirmed user preferences. |
| Unknown | Actual maintenance needs, preferred reminder channel, shared editing needs, and demand for receipts or photos. | None prevents a useful initial plan; the affected choices are identified in section 9. |

**Target task:** A household organizer opens the tool because they want to plan some maintenance or record work just completed. They identify a job, see its due date and last recorded completion, act on it, and leave with an accurate work record and a clear next date. Someone looking up older work can start directly in History.

This is a proposed future workflow. No interviews or observations of household use were performed.

## 2. Proposed defaults

| Choice | Initial decision | Reason and tradeoff |
| --- | --- | --- |
| Household and access | One private household, one organizer account, email sign-in. The same account can open its records on different devices. Use “Home” as an editable household name; an address is unnecessary. | Supports the stated scope and proposed device continuity. Shared editors and invitations are deferred. |
| Saving | Store jobs and work history in an authenticated service. A save succeeds only when that service confirms it. | Past work needs durable records; this introduces an authentication and storage dependency. |
| Scheduling | A job can have a due date or be unscheduled. Repeat defaults to “Does not repeat.” Offer “Every N weeks/months/years after completion,” with a positive whole-number interval. | Supports routine work with a small set of rules. Fixed seasonal dates and calendar integrations are deferred. |
| Recurrence | For a newly recorded latest completion, propose the next due date from the actual completion date plus the interval. Show the resulting date before saving; allow an explicit override. | Makes the effect of completing late visible. Timing can drift relative to a season; owners can adjust the next due date. |
| Reminders | The Due view always works. Offer an optional weekly email summary after the first scheduled job is saved; leave it disabled until chosen. When enabled, suggest Monday at 08:00 in the household timezone, editable in Settings. | Provides a way to be reminded away from the app. This is a product proposal, not an automation created by this task. |
| Time and dates | Suggest the browser's timezone for the household and make it visible and editable. Store maintenance dates as calendar dates. | Keeps “today” and reminder timing consistent across devices. |
| Organization | Optional free-text area, such as “Kitchen”; suggest previously used areas. No mandatory room setup or equipment inventory. | Lets the organizer start with a single job. |
| Work records | A completion date and optional notes. Notes can contain materials used or who did the work. | Supports the supplied “past work” goal. Photo, receipt, cost, and contact management are deferred until needed. |

Do not seed real household jobs or invent maintenance intervals. The empty state can show an explicitly labeled example, but the household chooses its jobs and timing.

## 3. Screens and content

Use persistent text navigation for **Due · Jobs · History**, with **Settings** as a secondary link. Provide **Add job** on Due and Jobs. The three destinations follow distinct tasks; their number is a consequence of this scope.

| View | Content, in reading order | Main actions and continuation |
| --- | --- | --- |
| **Due** — landing view | Page title; Add job; **Overdue**, **Today**, and **Next 30 days** sections. Each row shows job name, area if present, explicit due date, and last completed date or “No work recorded.” Include a link to unscheduled jobs and a link to later jobs. | Open a job; **Record completion**. Only show counts when they help explain a section. An empty due list must distinguish “Nothing due in the next 30 days” from “No jobs yet.” |
| **Jobs** — all job definitions | Search jobs; status filter (**Active** initially, **Completed**, **Archived**, **All**); optional area filter; list of job names, schedule, and last completed date. Scheduled active jobs sort by next due date, followed by unscheduled jobs. Completed and archived views sort by name. | Add, open, or edit a job. Display active filters and **Clear filters**. An archived job can be restored. |
| **Job detail** — canonical job page | Name and area; due status and date; last completion; **Record completion**; schedule; job notes; work history for this job, newest first. | **Edit job**, **Log past work**, **Archive job**. Each work record opens its detail. A completed one-off job offers **Reopen job**. |
| **Add/Edit job** — full page | Labeled fields: **Job name** (required), **Area** (optional), **Next due date** (optional), **Repeat** (none initially), and **Job notes** (optional). Selecting repeat reveals interval and unit together and requires a first due date. | **Save job** and **Cancel**. Explain the repeat rule beside its control. Save returns to the job detail; cancel returns to the origin. Editing never creates a completion record. |
| **Record completion** — full page | Job identity; **Completed on** (today initially); optional work notes; the proposed **Next due date** for a repeating job. One-off jobs explain that completion removes them from the active due list. | **Save completion**. Show a success message containing the recorded date and any next due date, with **Undo**. Return to the invoking view with its context restored. |
| **History** — find past work | **Log past work**; “Search work history”; optional area and date-range filters; newest-first work records showing completion date, job name, area, and a short note preview. Older records remain reachable through **Load more**. | Open a work record and its associated job; edit a mistaken date or note; remove an erroneous record with an explicit confirmation. History includes completed and archived jobs. |
| **Work record detail / Log past work** | A work record shows its job, completion date, and full notes. Logging older work lets the organizer select an existing job or choose **New one-off job**, then enter the work date and optional notes. | Save returns to History or the originating job. A new one-off job requires a name and is created as completed together with its first record. Past work does not silently alter an existing job's next due date. |
| **Settings** — secondary view | Household name, timezone, reminder on/off switch, chosen reminder email and weekly day/time when enabled, account/sign-out control. | Explicitly save changes. Turning reminders off leaves scheduled jobs visible in Due. |

Use full pages for editing and recording work on both desktop and phone browsers. Related fields and the save result remain in one predictable flow, without a required dialog layer.

### Minimal information model

- **Household:** name, timezone, owner account, optional reminder preferences.
- **Job:** stable identity, name, optional area and notes, next due date, repeat interval, and active/completed/archived state.
- **Work record:** stable identity, associated job, actual completion date, optional notes, and saved timestamp. Multiple records can belong to one job.

“Last completed” is derived from the latest actual completion date, not from the most recently entered record. “No work recorded” means the app has no record; it does not claim that the work was never done. Job notes describe the ongoing job; work notes describe a particular occurrence.

## 4. Main paths

### A. Start and schedule a job

Sign in → empty Due view → **Add job** → enter a name and, if known, a due date → save → job detail. The household name and room list do not block the first job. A missing due date saves a valid unscheduled job, reachable from Due and Jobs. Offer reminder setup after a scheduled job exists; **Not now** continues to the job.

### B. Complete a job

Open Due → inspect due date and last completion → **Record completion** → check actual date and next due preview → save → return to the same list. Saving creates one work record and updates the schedule together. A repeating job stays active with its next date; a one-off becomes completed and remains available in Jobs and History.

If an entered date predates the latest existing completion, identify it as historical work and preserve the current schedule. Display this effect before saving. Future completion dates are invalid. A repeating job's next due date must be later than the recorded completion date; if it is already past today, explain that the job will remain overdue.

### C. Find or add older work

Open History → search by job name, area, or words in work notes → refine by date if useful → open the record → read notes or open the associated job. **Log past work** adds a missing record without requiring a future schedule. Backdating a record does not replace a newer “last completed” date.

### D. Reschedule or correct a mistake

Open a job → **Edit job** → change next due date or repeat rule → save. Display last completion throughout so rescheduling is not mistaken for completed work.

**Undo completion** reverses that save and its schedule change if no subsequent edit has occurred. If there has been a later edit, preserve it and direct the organizer to the work record for correction. Editing or removing an older record shows the current next due date and leaves it unchanged; offer **Edit schedule** if that date also needs correction. Removing a one-off job's final work record reopens it as unscheduled, unless the job is archived; show that consequence in confirmation.

### E. Stop tracking a job

Archive from job detail → remove it from active Due and reminder results → retain the definition and every work record. Jobs → Archived → **Restore** returns it to its previous active/completed state. Restoring an active job with an old due date makes its overdue status explicit.

## 5. Scheduling and search rules

**Due grouping:** Compare the next due date with the household's current calendar date. Past dates are overdue; today's date is Today; the following 30 calendar days are upcoming. Archived and completed jobs are excluded. Unscheduled jobs cannot be described as overdue.

**Overdue repeats:** Keep a single pending job until someone records completion. Do not fabricate missed completions or accumulate duplicate pending copies. Adding months or years uses calendar arithmetic; clamp an unavailable day to the destination month's final day. The proposed date remains visible before saving.

**Weekly reminder:** If enabled, summarize overdue jobs and jobs due in the next seven calendar days, including today. Skip an empty summary. Link to Due and to the relevant job; account sign-in should return to that intended destination. A failed email never changes job status. Settings should show a delivery problem when the service can establish one.

**Search:** Jobs searches job name, area, and job notes; History searches associated job name/area and work notes. Use case-insensitive text matching with no inferred maintenance advice. Clearly show query and active filters, match count, and the searched scope. Empty results offer **Clear filters** and an editable query. Dates and notes remain available in results/detail without requiring a new search.

## 6. Phone, keyboard, and return behavior

On a wide browser, align the common row attributes for scanning. On a phone, stack the same information in this order: name/area, due date, last completion, action. Long names wrap. The primary navigation remains visible as ordinary text links; no gesture is required to complete a task.

Use meaningful page headings, associated field labels, visible keyboard focus, and status text in addition to color. Show validation near the relevant field and in a linked error summary. Keyboard focus should follow a sequence that preserves meaning; after navigation, announce the new page heading. These are planned browser behaviors, with W3C focus-order guidance as a basis [2].

Plan for content and actions to remain available at a width equivalent to 320 CSS pixels and with text enlarged; the reflow criterion and its exceptions are documented by W3C [3]. This plan is not an accessibility conformance assessment.

Meaningful page changes create browser history entries. Search text and filters update the current view's URL without creating an entry per keystroke. Opening a detail creates an entry; browser Back/Forward restores query, filters, and list position. Use native links or equivalent history handling [4].

A direct job link shows job identity and a **Jobs** parent link even when there is no previous internal page. Drafts survive internal navigation/Back during the current browser session; explicitly choosing **Cancel** discards that draft. Completion Save replaces the form entry with its return destination, so browser Back cannot accidentally resubmit it.

## 7. Relevant states and recovery

| Condition | Planned response |
| --- | --- |
| Loading | Show a labeled loading state; preserve the current query and filters. Do not display an empty-household message until loading succeeds. |
| No jobs | Explain that jobs hold a schedule and work history; offer **Add your first job**. |
| No due jobs | State the time window and show links to all jobs and unscheduled jobs. |
| Invalid input | Retain all values, explain the field problem, and allow correction. Name is required; repeat requires a positive interval and first date; work dates cannot be in the future. |
| Save in progress | Show **Saving…** and prevent duplicate submissions. The server must recognize retries of the same operation. |
| Offline or failed save | Keep entered values, state **Not saved**, and offer **Retry**. The first version does not promise offline synchronization. |
| Session expires | Keep the current draft for the session, ask for sign-in, then return to the same task. |
| Another device edits the same job | Preserve the local draft and show the current saved values for review; avoid silent overwrites. |
| Job unavailable through a saved link | Explain that it cannot be opened and provide **Jobs**. Do not show another job in its place. |
| Removing a work record | Name the job and date in confirmation, show the resulting schedule/status under section 4D, and provide Cancel. Archive is the normal way to stop tracking a job. |

## 8. Checks performed and checks still needed

### Performed on this plan

These are document inspections and expert walkthroughs, not execution or participant testing.

| Expectation | Method and conditions | Observation | Status |
| --- | --- | --- | --- |
| Preserve the brief's goals and scope | Compare every supplied requirement with the plan. | Due represents attention; rows and detail expose last completion; History supports past work. One household and all three explicit exclusions are preserved. | supported_in_conditions |
| A first job can be created from minimal information | Trace sections 3–4 using a name-only job and a scheduled repeating job. | Both paths have fields, save outcomes, destinations, and recovery; optional setup does not block them. | supported_in_conditions |
| Completion has a coherent effect | Trace late completion, repeat, one-off completion, backdated entry, and Undo through sections 4–5. | Work records and schedule changes are distinguished; date effects are described before save; past work cannot silently overwrite the current schedule. | supported_in_conditions |
| Older work stays findable | Trace History search and a record associated with an archived job. | Search scope, filters, record detail, and the associated job are specified; archiving retains history. | supported_in_conditions |
| Return and errors have an exit | Trace internal/direct entry, Back, cancel, invalid input, and failed save on the written plan. | Each names retained state and a continuation. Runtime behavior remains unverified. | supported_in_conditions |

### Acceptance checks after implementation

The observation cells are intentionally empty because these checks have not been run.

| Expectation | Method and conditions | Observation | Status |
| --- | --- | --- | --- |
| Saving and retries create one correct completion | Exercise save, double activation, lost-response retry, and a service failure with a repeating job. Inspect the persisted records and next due date. | | unverified |
| Dates and recurrence match the stated rules | Check timezone midnight, overdue work, month-end, leap-year, and older backfilled work using controlled dates. | | unverified |
| Back and direct links preserve context | In a browser, enter a filtered History view, open details, use Back/Forward, then follow a job link while signed out. | | unverified |
| Phone and enlarged-text use preserve the task | Run Add job, completion, and History with long titles at phone widths and a 320 CSS-pixel equivalent reflow condition. | | unverified |
| Keyboard and assistive technology can operate the path | Exercise navigation, form errors, save feedback, and correction using keyboard and a screen reader; inspect semantic labels and reading order. | | unverified |
| Reminders match saved settings | Use a controlled email service and household timezone; verify opt-in, intended contents, links, empty suppression, failure reporting, and turning off. | | unverified |
| Labels make sense to a household organizer | Observe someone finding overdue work, recording an earlier completion, and locating a past note without giving them navigation instructions. | | unverified |

Final file verification confirmed that RESULT.md is the only added project file, BRIEF.md and all 34 supplied skill files are unchanged by checksum, local document references resolve, and planned-check observation cells are empty.

No running interface exists. No browser interaction, screenshot review, delivery test, or user study was performed. The environment has no usable local browser, so future runtime checks require a supported browser environment.

## 9. Dependencies and later decisions

Implementation would need authenticated household storage, consistent date calculations, atomic completion writes, retry handling, and optional email scheduling. These dependencies are identified; no stack or service has been selected or configured.

The next design review can use a few actual household jobs to assess whether completion-based recurrence is sufficient, whether email reminders are wanted, and whether work notes need attachments. These are focused revision opportunities, not blockers for this initial plan. Shared editing would require revisiting the proposed single-organizer account boundary. No invitation or permission system is included here.

**Next owner: design-interface.** When implementation is requested, retain this plan as context, inspect any newly supplied jobs or constraints, revise only affected decisions, then hand the resulting plan to build-interface. The current assignment ends with this document.

## Sources

1. [Supplied project brief](BRIEF.md) — source of the product goals, platform, and exclusions. The local design-interface skill and its resolved inspection, clarification, planning, and checking modules supplied the workflow used here.
2. [W3C — Understanding Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) — informative explanation of WCAG 2.4.3; supports the planned keyboard sequence, without proving this design conforms.
3. [W3C — Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — criterion, conditions, exceptions, and explanatory guidance used for planned browser adaptation.
4. [MDN — Working with the History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API) — browser mechanism behind Back/Forward and state restoration. Which transitions create history entries is a project decision.

External sources were inspected while preparing the plan. They inform browser behavior; they do not establish household preferences or validate the proposed product structure.

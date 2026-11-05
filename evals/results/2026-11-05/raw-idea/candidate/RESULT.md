# Home maintenance: initial interface plan

**Deliverable:** a proposed first version for desktop and phone browsers. This document completes the planning stage; application implementation is outside this task.

## 1. Goal and evidence

Help the person managing one household answer **“What needs attention?”** and **“When did we last do this?”**, then record completed work with little effort.

| Status | What is established | Basis or consequence |
| --- | --- | --- |
| Reported requirement | One household; browser including phone; simple first version; no contractor marketplace, payments, or team permissions. | Supplied `BRIEF.md` and task request. |
| Observed material | The project contains `BRIEF.md`; it supplies no existing interface, brand, maintenance records, or implementation. | Project inventory and document inspection. Existing usability and visual quality cannot be assessed. |
| Designer proposal | A job list and a searchable completion history share one job record. | Gives both required questions an explicit destination. |
| Hypothesis | One person will maintain the records, sometimes switching between phone and computer. | Supports the proposed account and sync default; actual household habits are unknown. |
| Unknown | Actual equipment, maintenance intervals, reminder preference, and number of jobs. | Keep schedules editable and examples illustrative; do not generate a household schedule automatically. |

The design covers the product's initial structure and its connected add, complete, and find flows. Content, navigation, recovery, visual hierarchy, and browser access all affect these flows. There is enough information to propose defaults without an interview or a preliminary setup assignment.

## 2. Recommended defaults

| Choice | Initial proposal and reason |
| --- | --- |
| Core object | A **job**, such as “Clean gutters,” with an optional area such as “Exterior.” This allows useful records before someone inventories the entire home. |
| Navigation | **Jobs** and **History**. Jobs opens in **Upcoming** view; **All jobs** is a local view. Settings is a secondary text link. |
| Landing view | Overdue jobs, today's jobs, and the next 30 days, ordered by due date. Show a link with the count of later and undated jobs so they remain discoverable. |
| Household access | One owner account with email sign-in and saved data available on that person's devices. No invitation or role-management flow. This is a proposed product choice; offline editing is deferred. |
| Setup | Start with “Add your first job.” No address, room inventory, or long onboarding form. Household name defaults to “My home.” |
| Required input | Job title only. An undated job appears in All jobs under “Needs a date.” Area and notes are optional. |
| Repetition | Default **Does not repeat**. If repetition is enabled, choose an interval and a first due date. Default repeated jobs to “After completion”; offer “Keep calendar schedule” for seasonal work. |
| Last completed | Derive it from saved completion records. With no record, show **Not recorded**. |
| Reminders | Offer an optional weekly email after the first dated job is saved. Default off; suggested setting is Saturday at 09:00 in the household time zone. Include overdue jobs and those due in the next seven days; skip empty emails. Show “Email reminders off” in Settings. This is a proposed feature, with no emails or automation created by this planning task. |
| Initial scope | Add/edit jobs, schedule them, log completion, reschedule, search history, archive/restore, and reminder preferences. Receipt uploads, spending reports, equipment catalogs, calendar integration, and bulk actions are deferred. |

**Structure comparison.** A calendar would help arrange appointments, but the supplied tasks emphasize attention and past work. A list keeps overdue jobs visible alongside upcoming work. An equipment-first structure would help a large asset inventory; it introduces setup that this brief does not require. The chosen job list can gain a calendar or equipment grouping later if actual use warrants it.

## 3. Screens and navigation

| Screen | Content in reading order | Main action and continuation |
| --- | --- | --- |
| **Jobs** | Page heading; Upcoming / All jobs view; search and area filter; grouped job rows. Each row shows title, area, next due date, textual status, and last completed date. | **Add job** in the page header. Job title opens details. **Log completion** on each active row opens the completion form. |
| **Job details** | Job title and area; due/overdue status; next due and last completed together; repeat rule; notes; this job's completion history. | **Log completion** primary; **Change due date** and **Edit job** secondary. Archive appears lower on the page with a plain label. |
| **Add / edit job** | “Job” fields: title, optional area, notes. “Schedule” fields: first/next due date and repetition. “Save job” and “Cancel.” | Save returns to job details with confirmation. Cancel returns to the origin; changed input requires an explicit discard choice. |
| **Log completion** | Job identity; completed-on date, default today; optional notes; next-date preview for recurring jobs; Save completion / Cancel. | Saving creates a history entry and applies the displayed schedule result. Return to the originating list or detail, with a confirmation and Undo. |
| **History** | Search; area filter; completion records grouped by month, newest completion date first. Each entry shows job title, area, date, and a short note preview. | Open a record to see all notes and edit/correct it. **Log past work** permits choosing an existing job or creating a one-off job inline. |
| **Settings / sign-in** | Supporting screens: account, household name, time zone, and email reminder preference. Sign-in explains saving across devices. | Settings changes have explicit Save feedback. Sign-in returns to the intended internal page. |

**All jobs** includes status choices **Active / Completed / Archived**, with Active selected initially. One-off jobs move to Completed after completion; recurring jobs remain Active. Archived jobs remain available for restoration. History searches include archived jobs and label them accordingly.

Jobs search matches titles, areas, and job notes. History search matches the recorded title, area, and completion notes, ignoring case. Search and area filters combine; show the active filter and a Clear action. No results explains the current constraints and offers Clear search/filters. Newest records win ties using the time they were logged.

Use ordinary links for navigation and buttons for actions. Details, forms, and completion records have their own URLs. Browser Back/Forward and in-app return restore the originating list's view, query, filters, and scroll position. A directly opened detail also offers **All jobs**; a directly opened completion record offers **History**. Form cancellation returns to a known internal destination when there is no internal origin.

## 4. Representative composition

### Jobs: desktop

Use a restrained, single-column page, approximately 960 CSS pixels maximum width. Put the household name and Jobs / History navigation above the content. Put the heading on the left and Add job on the right. Keep the view selector and search controls immediately below them.

Use aligned list rows rather than a grid of large decorative cards. The first column carries title and area; adjacent columns carry due status and last completed; the final column holds Log completion. These values remain available together when deciding what to do. This applies the recognition principle from [S1] to the brief's requirement for visible history.

Illustrative content for **5 November 2026** only; these are fictional jobs, dates, and intervals:

| Job / area | Next due / status | Last completed |
| --- | --- | --- |
| Check kitchen tap · Kitchen | 3 Nov 2026 · 2 days overdue | 14 May 2026 |
| Replace ventilation filter · Utility | 5 Nov 2026 · Today | 5 Aug 2026 |
| Clean gutters · Exterior | 12 Nov 2026 · In 7 days | 9 May 2026 |

Use separate headings for Overdue, Today, and Next 30 days, showing only nonempty groups. An empty Upcoming view says **“Nothing due in the next 30 days”**, followed by View all jobs and Add job. The first-use empty state instead explains **“Add a job to track its next date and completion history.”** Avoid showing “All caught up” when jobs still need dates.

### Jobs: phone

Preserve Jobs / History as visible text navigation. Place Add job below the heading if space is tight. Search occupies the full width; the area selector follows it. Rows stack into title/area, due status, last completed, and a text-labeled completion button. Allow long titles to wrap; keep the full title visible in details. Do not depend on swipe or hover.

The job details page keeps next due and last completed above notes and history. Forms use the same field order on both screen sizes and remain full pages, avoiding a separate modal interaction model for the phone.

### Visual direction and access

Use a warm neutral page background, white list surfaces, dark text, a muted green primary action, and restrained borders. Use an overdue text label with a warning accent; color never carries status alone. A system font, approximately 16 CSS pixel body text, 24–28 pixel page headings, and consistent 8/16/24 pixel spacing provide a practical starting point. These are design proposals to verify in rendering.

Use visible field labels, semantic headings and lists, a logical keyboard order, and clear focus indicators. Adopt a 44 CSS pixel minimum height for standalone primary controls as a project target; W3C's web target-size criterion and exceptions must be assessed separately [S3]. Keep saving and error messages available to assistive technology [S2]. Verify layout at narrow widths and with enlarged text before release.

## 5. Main flows and behavior

### A. Add the first job

Open Jobs → Add job → enter “Clean gutters” → optionally choose Exterior → choose a due date and repetition → Save job → see the new details and the saved schedule.

Area is free text with suggestions from areas already used in this household. A missing due date is valid for a nonrepeating job. Enabling repetition requires a first due date and a positive whole-number interval in days, weeks, months, or years. Changing back to Does not repeat removes the repeat rule and preserves the due date. Never infer a maintenance interval from the job title.

### B. Complete work and see the next date

From Jobs or details, open Log completion. The form identifies the job, defaults Completed on to today, and shows the consequences before saving. A future completion date is invalid. Optional notes can record what was done, parts used, or a provider's name without creating a contractor directory.

Save must create one completion entry and update the schedule together. Repeated clicks or a retry of the same request must not create duplicates. The confirmation names the saved completion and next due date. For one-off jobs it says that the job is completed and available in History.

**Repeat rules:**

- **After completion:** calculate the next date from the actual completed-on date plus the selected interval. Completing a job on 8 Nov with a three-month interval gives 8 Feb.
- **Keep calendar schedule:** retain the original calendar anchor. Completing the current occurrence advances to the first anchored occurrence strictly later than both its current due date and the completed-on date. Thus finishing a job due 15 Nov early on 10 Nov, with a yearly schedule, gives 15 Nov next year.
- For a nonexistent calendar day, use that month's final day. Preserve the original anchor for subsequent fixed-calendar occurrences. Include month-end and leap-year tests during implementation.
- Show the calculated next date and permit a manual override later than the completion date. If it is already overdue relative to today, explain that explicitly; never invent intervening completions.
- Missed repeats remain one overdue job. Completing it does not create a backlog of fictional completion records.

Seasonal and interval work are both plausible in this domain; [S4] illustrates the distinction for HVAC only. The repeat rules above are product proposals, with no universal maintenance prescription implied.

### C. Find and correct past work

Open History → search “filter” → open the relevant record → read its full date and notes. The entry links to its job for current scheduling. Search can use an area or note when the exact title is forgotten.

Log past work defaults to retaining an existing job's current due date. An optional **Update next due date** choice reveals the proposed date before saving. This separates remembering an old event from changing the live schedule. A new one-off past job is saved as Completed.

Editing or deleting a completion recomputes Last completed from the remaining valid records. It preserves the current schedule unless the user explicitly chooses a previewed schedule update. Deleting a completion asks for confirmation because it removes recorded work. Job-title changes preserve the title/area snapshot on existing history entries; a link still reaches the current job.

### D. Postpone or retire a job

**Change due date** asks for a replacement date and immediately previews the result. It creates no completion. For fixed calendar repetition, offer **This occurrence only** by default and **Change the repeating schedule** as an explicit choice.

**Archive** removes a job from active lists and reminders while retaining its history. Offer Undo and restoration through All jobs → Archived. Restoring a dated job shows its actual status, including overdue when applicable.

## 6. States, data, and recovery

| Condition | Proposed behavior |
| --- | --- |
| Loading | Show a short loading state without briefly claiming that no jobs exist. |
| Invalid form | Keep all entered values. Show a concise field-specific correction; focus the first invalid field on submission [S2]. |
| Save failure or lost connection | Retain the form and show **“Could not save. Your changes are still here.”** Offer Retry. Do not report success before persistence confirms it. |
| Sign-in expires | Keep the unfinished form for the current session and return to it after sign-in; explain that saving requires sign-in. |
| Concurrent update from another device | Preserve the local draft, show that the saved job changed, and let the user review the latest record before retrying. |
| Completion Undo | Reverse that completion and its schedule change together when they are still current. If a later update exists, explain the conflict and open the record for correction. |
| No history | Say **“No completed work recorded yet”** and offer Log past work. |
| Invalid or unavailable detail link | Explain that the record is unavailable and provide Jobs / History navigation. |

Maintain a household record (name, time zone, owner, reminder preference), jobs (title, area, notes, status, due date and recurrence rule), and completion records (job link, recorded title/area, completed-on date, notes, and logged timestamp). Date-only due/completion values use the household time zone for Today and Overdue. The time zone is initially suggested from the browser and remains editable; travel does not silently change the household calendar.

Hosted persistence, single-owner authorization, authentication, an email scheduler, and delivery handling are implementation dependencies. The provider and technical stack are not selected in this plan. Reminder preferences must be opt-in, and failures must not erase the due list. Offline editing, file uploads, and financial data are outside the first release.

## 7. Review and acceptance checks

### Checks performed on this plan

An expert walkthrough traced the first-job, completion, historical lookup, backdated-entry, reschedule, archive/restore, and error-recovery scenarios against the supplied brief. The screen map contains a destination and a next action for each. Both required questions have visible information on Jobs and job details; History supports retrieval across jobs. The review also checked that the excluded marketplace, payments, and team permissions were not introduced.

File checks confirmed that `RESULT.md` is readable UTF-8, all nine planned sections are present, the Markdown tables have consistent column counts, and all four cited external URLs are present. The original `BRIEF.md` checksum is unchanged. The project contains only `BRIEF.md` and `RESULT.md`; no application files were created.

**Status: supported_in_conditions — document-level coherence only.** There is no implemented interface, rendered prototype, participant study, or runtime accessibility result. A local browser is unavailable; no browser/client installation was attempted for this task.

### Planned checks for a later implementation

All checks below are **unverified**. Their observations are intentionally absent.

| Expectation | Method and conditions |
| --- | --- |
| An overdue job, a job due today, a later job, and an undated job are all discoverable in the specified views. | Run a seeded dataset around a fixed household date; inspect group membership and All jobs. |
| Completion saves once and presents the actual next date. | Exercise repeat click, network retry, one-off completion, and both repetition modes; inspect saved records. |
| Old history can be added without changing an existing due date. | Log and correct a backdated completion through History; compare schedule before and after. |
| Month-end, leap-year, early, late, and backdated completions follow the selected rule. | Unit tests of date rules with explicit expected dates; include 31 January and 29 February anchors. |
| History search finds archived work by title, area, and note; empty results recover clearly. | Use known records, mixed case, filters, and no-match searches. |
| Return navigation restores the user's place and draft errors retain input. | Browser Back/Forward, direct links, canceled edits, expired session, failed save, and concurrent-update cases. |
| Phone and keyboard users can complete the same tasks. | Render at 320, 390, and 1280 CSS pixels; test text enlargement, long titles, keyboard focus, form labels, and assistive-technology announcements. |
| Reminder settings have the stated effect. | In a test email environment verify opt-in, time zone, empty digest suppression, archival, and disablement. |

A short later usability session can ask a household member to identify what needs attention, record a completed job, and find its previous work. It can test the labels and the two repeat modes; the current expert review does not establish user understanding.

## 8. Remaining assumptions and next step

The proposed defaults are sufficient for an initial build brief. Revisit single-owner access if several household members need independent accounts; revisit reminders if email is unsuitable; revisit asset organization if the actual list is large enough to need equipment records. None of these unknowns blocks this initial plan.

When implementation is requested, the next owner should turn the screen descriptions into a responsive prototype, select persistence/authentication services, and verify the named flows. The present task ends with this plan.

## Sources read and applied

- **[S1] Raluca Budiu, NN/g — [Memory Recognition and Recall in User Interfaces](https://www.nngroup.com/articles/recognition-and-recall/), 15 January 2024.** Practitioner explanation supporting visible context and understandable labels. Applied to due/last-completed information and named actions; it does not validate this household's behavior.
- **[S2] W3C WAI — [User Notifications, Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/notifications/).** Practical accessibility guidance on success, error feedback, and correction. Applied to forms and save outcomes; a written plan establishes no accessibility conformance.
- **[S3] W3C WAI — [Understanding SC 2.5.8: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).** Informative explanation of the 24 CSS pixel target criterion and its exceptions. It informs later browser checks; the proposed 44-pixel control height is a project choice.
- **[S4] ENERGY STAR — [Maintenance Checklist](https://www.energystar.gov/saveathome/heating-cooling/maintenance-checklist).** Domain guidance with seasonal service and recurring filter work. Used to consider schedule types; applicability is limited to that equipment context. No actual home data or manufacturer instructions were supplied.

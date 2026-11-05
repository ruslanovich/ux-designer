# Conditional checks

Select checks relevant to the original task, review question, chosen design, and available evidence. Use the rule IDs to trace a finding; do not turn a local check into a mandatory audit. Treat platform guidance as scoped guidance, not proof that an organization is best for its audience.

## Project and implementation

### R32 — Project coherence

Walk from the task trigger to its intended outcome using supplied content and decisions. At each material step, identify the information, action, next state, and meaningful exception needed to continue. Inspect return, correction, cancellation, and completion paths where the task needs them. Keep the walkthrough proportionate to the change.

Frame the task through a goal and circumstances rather than instructions that reveal every navigation choice. Distinguish an omitted project decision from a demonstrated interface defect. Report expert review, not a user study.

Use [Turn User Goals into Task Scenarios for Usability Testing](https://www.nngroup.com/articles/task-scenarios-usability-testing/) for scenario framing. Treat the agent walkthrough as our process.

### R41 — Review concept quality

Before substantial implementation, or when reviewing whether a redesign solved its task, assess the chosen concept independently of implementation fidelity. Reuse prior inspection and research rather than starting a full audit again.

- Trace the original priority problems to concrete decisions in the design. Identify an unresolved central problem even when the implementation faithfully follows the plan.
- Check that the chosen depth can address those problems. Consider related screens and dependencies when a local change leaves the cause intact; respect an explicitly limited request.
- Review the coherence of content, organization, interaction, visual hierarchy, density, component treatment, and relevant use conditions. Name a specific gap or strength in the available artifact; merely listing design topics is insufficient.
- Verify representation of required information, roles, permissions, states, and necessary expert or infrequent operations. Clean appearance does not justify losing a required capability.
- Check whether the key screens and significant states are concrete enough for the requested handoff. Keep missing evidence or an unrendered visual treatment unverified.

For example, a design that hides partial failures can prevent operators from knowing which records need correction. Matching that design in code does not resolve the original task. Send the issue to planning, with the affected step and evidence. If a professional recommendation needs investigation, send that question to research.

Treat this concept review as our operational requirement and an expert judgment. It does not establish audience usability or commercial impact. A minor correction may need only a brief check of the affected decision.

[Jenny Xie, Our approach to designing UI3, Figma (2024)](https://www.figma.com/blog/our-approach-to-designing-ui3/) describes revisiting floating panels and blend-mode visibility after feedback exposed problems in working conditions. This practitioner case illustrates revisability; it does not prescribe one panel layout for all products.

### R31 and R33 — Implementation correspondence

Compare implemented content, actions, transitions, material states, and visual organization with the chosen design. Execute the affected path and inspect the rendered result when accessible; otherwise identify only properties exposed by the supplied artifacts. Distinguish a real operation from a stub, simulated response, or demonstration dataset. Keep correspondence separate from the concept-quality judgment under R41.

Send an implementation constraint that changes the interaction back to the affected decision. Check the revised expectation rather than silently treating an implementation shortcut as the new plan. Apply the following checks only where they affect the path.

## Platform and accessibility

### R24 — Navigation role and target

Check each relevant item against its expected destination, level, and switching behavior. Distinguish the Apple tab bar for primary sections from Android tabs for secondary navigation; check Android primary navigation against its intended navigation bar, rail, or drawer role. Do not infer a defect from a component name alone.

Keep mobile web separate from native apps. Scope Apple guidance to the actual platform and form factor; do not automatically apply iPadOS guidance to iPhone. Do not derive a product-wide section limit from one component's capacity.

Use the platform guidance in [Apple Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) and [Android Layouts and navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns).

### R25 — Return and entry

Check internal entry, relevant external entry, and return. On Android, inspect Back and Up within the actual task and entry context. In the browser, inspect Back/Forward and restoration for the meaningful transitions affected by the work.

Do not treat an Android parent destination as a specification for browser history. Allow direct entry without a previous in-app screen. Check the agreed state to restore; do not demand a history entry for every control change.

Use [Android Principles of navigation](https://developer.android.com/guide/navigation/principles) as platform guidance and [MDN Working with the History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API) as a technical explanation. Treat the choice of meaningful web transitions as a project decision.

### R26 — Auxiliary tasks and modality

Check opening, completion, cancellation, closing, background interaction, and the agreed handling of entered data. Compare behavior with the intended modal or nonmodal mode. For a modal web dialog, also apply R29.

Allow a nonmodal iOS sheet. Do not require confirmation for every close; tie it to actual loss of work and adopted recovery behavior. Send an unresolved presentation choice to plan-interface.

Use the platform guidance in [Apple Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) and [Apple Modality](https://developer.apple.com/design/human-interface-guidelines/modality).

### R27 — Adaptation and state

Where adaptation changed, begin the relevant task, change available space or text size, and continue. Inspect access to necessary actions, selected content, entered values, and the current step. Use realistic long labels or content where they could expose the change.

Allow list and detail to move from simultaneous to sequential display. Check task context rather than identical geometry or a fixed number of panels. Distinguish a documented, task-driven reset from accidental loss.

Use the platform guidance in [Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout) and [Android Canonical layouts](https://developer.android.com/develop/adaptive-apps/guides/canonical-layouts). Treat transfer to web behavior as a project expectation, not a native-platform requirement imposed on the web.

### R28 — Semantic relationships and reading order

Compare meaningful visible relationships with inspected markup or the accessibility tree. For web content, check information and relationships under WCAG SC 1.3.1, including its allowance for availability in text; check a programmatically determinable correct sequence under SC 1.3.2 when sequence affects meaning.

Inspect headings, labels, and groups as relevant to the task. Preserve needed independently operable actions when grouping nodes. Do not treat visual proximity as proof of an accessible relationship.

Distinguish normative criteria in [WCAG 2.2](https://www.w3.org/TR/WCAG22/) from supplemental [COGA page-structure guidance](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o2p03-page-structure/) and platform practice in [Android accessibility principles](https://developer.android.com/guide/topics/ui/accessibility/principles).

### R29 — Web focus and modal dialogs

Where sequential focus affects meaning or operation, inspect whether its order preserves both. Allow different logical orders; do not require literal correspondence with visual placement.

For an affected modal web dialog, check initial focus inside it, Tab and Shift+Tab behavior, Escape, an operable closing control, and logical continuation after closing. Check that outside content is inert and announced modality matches actual behavior. Base the initial-focus expectation on content and task rather than assuming the first button is always appropriate.

Usually expect focus to return to the invoking element. If it no longer exists, expect a logical continuation. Allow a directly related next step when repeat invocation is unlikely; do not require that alternative merely because a next step exists.

Distinguish normative SC 2.4.3 in [WCAG 2.2](https://www.w3.org/TR/WCAG22/) from informative [Understanding Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) and the informative [WAI APG Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Do not describe every APG recommendation as an additional WCAG criterion.

### R30 — Accessible actions and input

For a changed gesture, icon action, or custom control, inspect its accessible name and a supported way to perform the action with applicable input or assistive technology. Check whether the name conveys purpose or outcome and the action remains independently available.

Allow platform-provided accessible actions instead of demanding a duplicate visible button. Avoid separate announcements for decorative elements. Assess target dimensions in the platform's units and input context; do not exchange pt, dp, and CSS px or apply a universal touch-size number.

Use the platform guidance in [Apple Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [Android accessibility principles](https://developer.android.com/guide/topics/ui/accessibility/principles), and [Android Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps). Report only the controls, inputs, and conditions actually inspected.

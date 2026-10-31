# Browser interaction and accessibility

Use this reference for websites and web applications in desktop or mobile browsers. Keep browser history, web semantics, and keyboard focus grounded in the web environment. Load other platform references only for additional native targets.

## R25 — Specify history from each entry point

- Apply when the web application has several views, direct entry, or meaningful transitions within one document.
- Describe return to the previous view and movement to the parent section separately. Choose which meaningful transitions create history entries, which replace a current entry, and what state the corresponding view must restore.
- Account for direct entry without a previous internal screen. Avoid adding an entry for every control change by default; select history behavior and retained state according to the task.
- Plan checks for internal and direct entry, Back, and Forward, including the affected object's identity, selected constraints, input, or step when these are meaningful.
- Ground the browser mechanism in S40. Treat the selected transitions and saved state as design decisions, not as choices made by the History API documentation.

## R28 — Express meaningful structure programmatically

- Apply when headings, labels, grouping, relationships, or order carry meaning.
- Specify suitable semantic roles and relationships. For WCAG 2.2 SC 1.3.1, make information and relationships programmatically determinable or available in text. For SC 1.3.2, make the correct reading sequence programmatically determinable when sequence affects meaning.
- Preserve independently needed actions when grouping content. Treat visual proximity as insufficient evidence of an accessible relationship.
- Plan to compare visible organization with markup or the accessibility tree and meaningful reading order. Identify a missing implementation or unavailable tree as a limit on verification.
- Treat S26's cited criteria as normative. Use S28 as supplementary cognitive-accessibility guidance, not an additional conformance requirement.

## R29 — Specify logical focus and modal continuation

- Apply when sequential focus affects meaning or operation, or when opening a modal web dialog.
- Specify a logical focus order for WCAG SC 2.4.3. For a modal dialog, choose initial focus inside it according to the content, contain keyboard traversal, and provide dismissal and a logical continuation.
- Specify an accessible close action, Escape behavior, and the target after closing. Normally return focus to the invoking control; choose a logical replacement if it disappeared. Permit a directly related next-step target when repeat invocation is unlikely.
- Allow focus order to differ from visual order when meaning and operation remain logical. Distinguish modal containment from ordinary panels and nonmodal content.
- Plan keyboard checks for the affected path, including Tab, Shift+Tab, Escape, closing, and focus after dismissal. Keep observation empty until the behavior is actually exercised.
- Treat SC 2.4.3 in S26 as normative. Treat S27 as explanation and S39 as an informative implementation pattern; avoid equating APG compliance with complete WCAG conformance.

## R27 and R30 — Preserve task continuity and operation in browsers

- Plan to preserve meaningful state and access to needed actions when browser space or text size changes. Allow a task-appropriate change from simultaneous panels to sequential views.
- Specify an accessible name and a usable way to perform significant icon, gesture, and custom actions through the intended browser input methods. Keep decorative elements from receiving unnecessary independent announcements.
- Record these as design intentions and planned observations, not verified implementation or a complete accessibility assessment. Use browser-specific primary guidance when a precise technical or conformance claim is needed.
- Keep the evidence boundary explicit: R27's [S30 — Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout) and [S36 — Android Canonical layouts](https://developer.android.com/develop/adaptive-apps/guides/canonical-layouts) describe native adaptation. R30's [S33 — Apple Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [S37 — Android accessibility principles](https://developer.android.com/guide/topics/ui/accessibility/principles), and [S38 — Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps) describe native access features. Their general task goals may inform the browser design, but native dimensions, components, and behavior do not become normative web requirements. Use the applicable web criteria and mechanisms for the implementation.

## Primary sources

- [S26 — W3C, Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/): use the cited normative criteria within their applicability.
- [S27 — W3C, Understanding Success Criterion 2.4.3: Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html): informative explanation of the criterion.
- [S28 — W3C COGA, Use a Clear and Understandable Page Structure](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o2p03-page-structure/): supplementary guidance rather than a WCAG conformance condition.
- [S39 — W3C WAI ARIA Authoring Practices Guide, Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): informative keyboard and focus pattern; retain its content-sensitive focus choices.
- [S40 — MDN, Working with the History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API): platform mechanism; select meaningful transitions from the task.

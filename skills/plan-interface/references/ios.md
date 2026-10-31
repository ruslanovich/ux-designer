# Native iOS design

Use this reference only for the native iOS target. Identify the intended device context; keep iPhone decisions separate from any explicitly requested iPadOS treatment. Exclude native macOS behavior from this module's scope.

## R24 — Match navigation components to their role

- Identify primary destinations and local navigation before choosing components. Use an iOS tab bar for primary app sections when it fits the task.
- Explain the destination, level, and result of switching each item. Distinguish destinations from object actions.
- Account for the content and usage pattern. Avoid deriving the product's total number of sections from a component's visible capacity or treating Android tabs as equivalent to an Apple tab bar.
- Plan to observe the intended content and retained context when switching sections.
- Ground this choice in S29: native platform guidance, not a universal navigation rule.

## R26 — Choose modality for the supporting task

- Apply when offering a supporting task over the current content.
- Specify whether the background remains available, how the task finishes or is canceled, what happens to entered information, and how it relates to the originating context. Consider a complete dedicated view for prolonged or complex work.
- Keep modal and nonmodal sheets distinct. Tie any confirmation on dismissal to actual loss of work; avoid adding confirmation by default.
- Plan checks for opening, completing, canceling, and closing the presentation, including background availability and the fate of input.
- Ground the decision in S31 and S32. Preserve component and platform boundaries, including exceptions to generic modality advice.

## R27 — Preserve the task during adaptation

- Apply when window space, text size, or visible panels change.
- Preserve access to needed actions and meaningful state: selected object, entered information, and current step. Choose the arrangement from available space and relationships among the content.
- Permit simultaneous content to become sequential when needed. Make any meaningful state reset follow the task; preserve task continuity rather than identical geometry.
- Plan to start the relevant task, vary the intended space or text size, and continue with realistic long labels, selection, and return behavior.
- Ground the decision in S30's relevant iOS guidance; apply iPadOS-specific recommendations only when that target is in scope.

## R30 — Specify an accessible way to perform the action

- Apply when a significant action uses a gesture, icon, or custom component.
- Specify its accessible name and an available method of execution through the platform's applicable input and access features. Account for independent actions when grouping related content.
- Use platform units and the intended input method when specifying target dimensions. Consult the relevant platform detail when a numerical requirement is needed; keep pt, dp, and CSS px distinct.
- Keep decorative elements from acquiring unnecessary independent announcements. Permit the accessible alternative to use platform-provided mechanisms.
- Plan to observe whether the action is discoverable, meaningfully named, and executable in the target scenario. Identify unavailable assistive-technology checks explicitly.
- Ground the decision in S33 as platform practice; avoid claiming full accessibility from a visual inspection.

## Primary sources

- [S29 — Apple Human Interface Guidelines, Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars): primary native destinations and their behavior.
- [S30 — Apple Human Interface Guidelines, Layout](https://developer.apple.com/design/human-interface-guidelines/layout): hierarchy and adaptation; select the applicable platform sections.
- [S31 — Apple Human Interface Guidelines, Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets): supporting tasks, completion, dismissal, and modal or nonmodal behavior.
- [S32 — Apple Human Interface Guidelines, Modality](https://developer.apple.com/design/human-interface-guidelines/modality): contextual modality guidance; read alongside the relevant component when necessary.
- [S33 — Apple Human Interface Guidelines, Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility): platform guidance for access features and meaningful operation.

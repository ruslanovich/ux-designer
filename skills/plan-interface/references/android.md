# Native Android design

Use this reference for the native Android target. Preserve the distinction between Android navigation, browser history, and iOS component roles. Exclude native desktop applications from the product scope.

## R24 — Assign navigation components by level

- Identify primary directions and secondary navigation before choosing components. Distinguish navigation bars or drawers used for main destinations from Material tabs used for related secondary sections.
- Explain which content opens, its hierarchy level, and the result of each switch.
- Avoid using the visible capacity of a component as a limit on the product's full structure or importing Apple tab-bar semantics by name.
- Plan to observe intended destinations, levels, and switching behavior.
- Ground the choice in S35: Android platform design guidance.

## R25 — Specify return from the actual entry point

- Apply when there are several screens, an external entry, or a task-boundary transition.
- Describe Back, Up, and the associated system-task context. Specify the relevant behavior for internal entry and external deep links, including the expected continuation and retained state.
- Account for entry without a previous internal screen. Preserve the difference between navigation history and a parent in the content structure.
- Plan checks for each affected entry and return path. State which Android environment is required to observe them.
- Ground the native model in S34; avoid transferring it directly to browser history or iOS.

## R27 — Adapt the arrangement while retaining work

- Apply when available space, text size, or the number of visible panels changes.
- Choose an arrangement for the relationships: list and details, a feed, or supporting content when applicable. Preserve needed actions, selected object, input, and current step.
- Permit simultaneous list and details to become sequential. Define any task-justified state reset explicitly; avoid selecting a canonical layout solely because it exists.
- Plan to begin a relevant task, change the intended space or text size, and continue with realistic labels, selection, and return behavior.
- Ground the choice in S36: platform practice with task-dependent applicability.

## R28 — Preserve meaningful native structure

- Apply when grouping, headings, labels, or sequence carry meaning.
- Specify suitable native semantic groups, headings, labels, and pane names. Preserve independently needed actions when combining content into a semantic node.
- Distinguish visual grouping from verified accessibility-tree behavior. Use the applicable Compose or Views guidance for the project's actual implementation.
- Plan to compare visible organization with the native accessibility tree and meaningful traversal.
- Ground native implementation guidance in S37. Keep native platform practice distinct from claims about the web-specific criteria used in R28.

## R30 — Make significant actions accessible

- Apply when a significant action is offered through a gesture, icon, or custom component.
- Specify a meaningful accessible name and an available way to perform the action using applicable platform input and access features. Include required accessibility actions in the design intent.
- Evaluate target dimensions in the platform's units and input context; consult the relevant primary guidance for precise values. Keep dp, Apple pt, and CSS px distinct.
- Permit platform-provided alternatives and omit unnecessary independent announcements for decoration.
- Plan to observe whether the action is discoverable, meaningfully named, and executable with the intended means of operation; name any unverified access-feature behavior.
- Ground the decision in S37 and S38: platform guidance with implementation-sensitive details.

## Primary sources

- [S34 — Google Android Developers, Principles of navigation](https://developer.android.com/guide/navigation/principles): native entry, history, Back, Up, and system-task context.
- [S35 — Google Android Developers, Layouts and navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns): navigation roles and layout conventions.
- [S36 — Google Android Developers, Canonical layouts](https://developer.android.com/develop/adaptive-apps/guides/canonical-layouts): list-detail, feed, supporting-pane, and adaptive behavior.
- [S37 — Google Android Developers, Principles for improving app accessibility](https://developer.android.com/guide/topics/ui/accessibility/principles): semantic groups, headings, pane names, and accessible actions.
- [S38 — Google Android Developers, Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps): action descriptions, target areas, and practical verification boundaries.

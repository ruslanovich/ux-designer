# Today’s tasks — concrete screen redesign

## Decision and scope

Keep the current navigation, task groups, task content, and completion action. Apply a consistent, readable visual system to this screen: clear type hierarchy, dark text, aligned rows, useful spacing, and one button treatment. The task count becomes a small supporting label beside the page title.

This is a design specification. Application code remains unchanged.

**Target task — hypothesis grounded in the supplied copy:** a person managing work and home tasks opens Today, chooses a task using its title and due time, reviews the available details, and marks it complete. Desktop and mobile browsers are the intended conditions. The supplied three tasks are examples; actual audience behavior and frequency are unknown.

## Evidence and diagnosis

The supplied material is `index.html`. Findings below concern its HTML/CSS, rather than a rendered browser session. The user reports that the workflow mostly works and that the screen feels difficult to read and unfinished.

| Evidence | Observed property in the supplied source | Design consequence |
|---|---|---|
| E1 — hierarchy | `h1,h2,h3,p` all receive `font:12px Arial`, including the normal weight implied by the shorthand. | Give page title, group headings, task titles, and supporting text distinct roles. |
| E2 — contrast | Task text uses `#b7b7b7` on white: **2.01:1**. Default button text `#999999` on `#dddddd`: **2.10:1**. White text on orange: **1.97:1**. | Replace these combinations. They fall below the 4.5:1 requirement for ordinary text in WCAG 2.2 SC 1.4.3. [S1] |
| E3 — emphasis | The count is 30px with 30px padding and a lavender background, while the page heading is 12px. | Reduce the count’s size and area so the task titles and due groups have a clear place in the reading order. |
| E4 — spacing and alignment | Sections have 5px padding; rows have 3px padding and a 2px gap. Task headings are constrained to 50% width. | Use shared insets and an adaptable text column. Allow the full title to wrap. |
| E5 — consistency | `.task:nth-child(2) button` changes shape, color, typeface, and size. Because each section begins with an `h2`, it affects the first task in **both** groups. Other buttons use 9px Arial. | Style all three Complete buttons identically. Row position does not represent a different action. |
| E6 — navigation | Today has `aria-current="page"`; no style targets the current page. The three links are otherwise styled alike. | Make Today visibly current with weight and an underline, while retaining its semantic state. |
| E7 — evidence boundary | This file has three buttons, no scripts or inline event handlers, and only the `today` and `priority` IDs. `#upcoming` and `#completed` have no matching target in this file. A detail-opening control is not represented. | The full workflow cannot be verified from this fragment. Preserve the real application’s navigation, detail entry, and completion wiring when implementing the visual changes. |

The readability diagnosis is supported by source inspection and color calculations. Improved task speed, user preference, and actual comprehension remain hypotheses.

## Screen composition

Use a neutral light canvas, white task sections, dark text, and one blue accent for navigation state and actions. Keep all navigation destinations visible at the top. Retain the two existing groups and their order.

| Vertical order | Exact content and placement |
|---|---|
| 1. Navigation | **Today**, Upcoming, Completed. Same content alignment as the main area. Today uses a 3px underline and semibold text. |
| 2. Page header | **Today’s tasks** at left; `3 tasks` as small supporting text at right on a wide screen. |
| 3. Guidance | “Choose the next task, review its details, and mark it complete.” Below the title, with a readable line length. |
| 4. First section | **Due today** followed by the two tasks in their supplied order. |
| 5. Second section | **Any time** followed by its supplied task. |

### Preserve every task

| Group | Task title — displayed in full | Metadata | Action |
|---|---|---|---|
| Due today | Review the quarterly service report before the customer meeting | 11:00 · Work | Complete |
| Due today | Schedule the annual boiler inspection | 17:00 · Home | Complete |
| Any time | Read the maintenance notes | Home | Complete |

Within each row, place the title above its metadata in one text column. Place Complete in a separate, consistently aligned action column on wider screens. This keeps a due time associated with its title even when the title wraps. The time can use semibold tabular numerals; Work and Home stay normal-weight text.

The shared section surface expresses the existing grouping. Thin separators distinguish rows within Due today. Avoid individual floating cards for every task, oversized decorative icons, additional dashboards, or new priority labels; none is needed to resolve the observed problems.

## Visual specification

All sizes below are design choices for this screen. Use rem units for type and spacing where practical, with a normal 16px browser base; do not lock the root font size against user settings.

### Typography

Use one family throughout: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

| Role | Size / line height | Weight | Color |
|---|---|---|---|
| Page title | 28 / 36px; 24 / 32px below 600px | 700 | `#1f2937` |
| Group heading | 18 / 26px | 600 | `#1f2937` |
| Task title | 16 / 24px | 600 | `#1f2937` |
| Guidance | 16 / 24px | 400 | `#475569` |
| Task metadata and task count | 14 / 20px | 400 | `#475569` |
| Navigation and buttons | 14 / 20px | 600 | Navigation `#475569`; active/action `#1d4ed8` |

Task titles may occupy multiple lines. Do not truncate them, clamp them, or rely on hover to reveal the text. No fixed row height.

### Color and surfaces

| Token | Value and use | Calculated text contrast |
|---|---|---|
| Canvas | `#f8fafc` | Primary text **14.03:1**; supporting text **7.24:1** |
| Surface | `#ffffff` for header and sections | Primary text **14.68:1**; supporting text **7.58:1** |
| Primary text | `#1f2937` | As above |
| Supporting text | `#475569` | As above |
| Accent | `#1d4ed8` for button text/border, current navigation, and focus outline | **6.70:1** on white |
| Hover surface | `#eff6ff` for actionable controls | Accent text **6.16:1** |
| Dividers | `#e2e8f0` | Decorative separation; labels and spacing also communicate grouping |

These are calculations for opaque foreground/background pairs, not measurements of a rendered implementation. All specified text pairs exceed 4.5:1. The count loses its lavender panel and uses the normal supporting-text treatment. [S1]

### Geometry and spacing

| Element | Specification |
|---|---|
| Shared content shell | Maximum width 800px; centered. At least 24px page gutters from 600px upward, 16px below 600px. Header and main share the same left edge. |
| Navigation | White background with a 1px bottom divider. Links have at least 44px height, 12px horizontal padding, and an 8px gap. Allow wrapping when text enlargement requires it. |
| Main start | 32px below navigation on wide screens; 24px on narrow screens. |
| Title and count | Flex row, vertically centered, 16px gap. Below 600px, count sits beneath the title with a 4px gap. |
| Guidance | 8px after the title/count block; maximum width 65ch. |
| First task section | 24px after guidance. |
| Section surface | White, 1px divider-colored border, 12px radius, no shadow. No clipping rule that cuts off a focus ring. |
| Section heading | 16px top and horizontal inset; 12px before the first row. |
| Task row | 16px horizontal and vertical inset; title-to-metadata gap 4px. Separators align to the text inset. |
| Desktop row columns | Text `minmax(0, 1fr)`; action 7rem minimum; 24px between columns. Action aligns vertically to the row center. |
| Section separation | 24px. |
| Complete button | Minimum 44px high, at least 7rem wide, 1px blue border, 8px radius, 12px horizontal padding. White resting background. Let it grow if text grows. |

The 44px control height is a chosen comfort target for this design. WCAG 2.2 SC 2.5.8 specifies a 24-by-24 CSS-pixel minimum for pointer targets, with defined exceptions; 44px is not being presented as its AA threshold. [S3]

## Adaptation and interaction presentation

**At widths below 600px:** retain the navigation, title, count, guidance, groups, times, categories, and all actions. Stack each row as title, metadata, then a full-width Complete button separated by 12px. Use the same row insets and type sizes. This gives the longest supplied task the full available text width. The 600px breakpoint is a layout decision to validate, rather than a device category.

At 320 CSS pixels, 16px page gutters leave a 288px shell. A 1px section border and 16px insets leave **254px** for row content. This arithmetic establishes the intended space budget; it does not establish rendered wrapping or reflow. Check the implementation at 320px and at 400% zoom on a 1280px-wide viewport. [S2]

**Controls:** all Complete buttons share the same resting, hover, pressed, and focus styles. Hover uses `#eff6ff`; pressed uses the same surface with a 2px inset blue border that does not change overall size. Keyboard focus uses a 3px blue outline with a 3px offset. Keep full text labels; the task row itself does not become an additional completion target.

**Semantic hierarchy:** retain one `h1`, an `h2` per group, and an `h3` per task. Label both sections from their headings. Keep navigation links as links and Complete as a native button. Associate each button’s accessible name with its task, for example “Complete: Schedule the annual boiler inspection”; the visible label remains Complete. DOM reading order is title, metadata, action within each row. Retain `aria-current="page"` for Today. These relationships follow the web-specific planning guidance and WCAG’s information/relationships and focus-order criteria. [S4]

**Existing workflow states:** carry the current production transitions through the visual update. If completion waits for a response, show `Completing…` in the same button dimensions and retain its task context. If the application displays a completed state, include the word `Completed` rather than conveying it only through a new color. If an error is displayed, keep the task and its existing recovery action readable in the row. Style an existing empty state with the group/page heading and 16px explanatory text. Retain existing focus continuation and status announcements when restyling.

These states and their persistence are not evidenced in the supplied static file. Before implementation, the developer must locate the existing runtime handlers and state components. If the file is the complete application, navigation destinations, details, and completion require a separate functional implementation scope. This plan does not invent hidden task details or a new detail page.

## Plan review and checks

### Checks actually performed

| Check | Method and conditions | Observation | Status |
|---|---|---|---|
| Supplied material and preservation | Read the complete HTML/CSS; parse its HTML structure | Three tasks, two groups, three navigation links, and three Complete buttons are accounted for in the plan. | `supported_in_conditions` — source/plan only |
| Existing contrast | Python sRGB relative-luminance calculation using declared opaque CSS colors | Main task text and both button variants are below 4.5:1. | `mismatch` — declared color pairs against SC 1.4.3 |
| Proposed palette | Same calculation using the specified pairs | Main, supporting, and action text pairs in the palette exceed 4.5:1. | `supported_in_conditions` — numeric pairs only |
| Behavior evidence boundary | HTML parser counted scripts, event attributes, IDs, and fragment links | No scripts/event attributes; Upcoming and Completed fragment IDs are absent in this file. | `supported_in_conditions` — inventory, not runtime verification |
| Design coherence | Desk walkthrough: choose the 11:00 report task, inspect its title/time/category, find Complete; repeat with Any time and the narrow layout | Required supplied information and action locations are specified. Existing detail/completion behavior remains a runtime dependency. | `supported_in_conditions` — design reasoning |
| Application unchanged | SHA-256 comparison before and after writing this document | `index.html` remains byte-identical. | `supported_in_conditions` |

Original and final SHA-256 for `index.html`: `81a9e1ca08d346fe452ec7f0213350b96464e840aac5c80e69b528d8cc62d1bd`.

### Acceptance checks for a later implementation

These checks are **unverified**; no rendered browser, keyboard session, assistive-technology test, or participant study was performed. A usable browser was unavailable; no browser or client was installed.

| Expected result | Method and conditions | Status |
|---|---|---|
| Full task titles, metadata, and actions remain readable without horizontal page scrolling | Render at 320, 375, 768, and 1280 CSS pixels; inspect the supplied longest title and enlarged text | `unverified` |
| Reflow retains information and operation | Browser check at 400% zoom from a 1280px viewport; confirm scroll remains vertical for this screen | `unverified` |
| Type, alignment, and focus outlines match the specification | Visual review of the implemented states; inspect computed styles and focus ring clipping | `unverified` |
| Keyboard reaches meaningful controls in order and can complete the selected task | Tab/Shift+Tab and native button activation in the real application; inspect the continuation after completion | `unverified` |
| The existing workflow survives the visual changes | Exercise Today, Upcoming, Completed, task details, completion, and any available loading/error/empty states against real handlers | `unverified` |

## Sources

- **Project evidence:** [`index.html`](index.html), complete supplied source. The user’s workflow/readability report is recorded separately above.
- **S1 — [W3C: Understanding SC 1.4.3, Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).** Text-contrast thresholds and the basis for checking the declared pairs.
- **S2 — [W3C: Understanding SC 1.4.10, Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).** The 320 CSS-pixel / 400% zoom condition for vertically scrolling content.
- **S3 — [W3C: Understanding SC 2.5.8, Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).** Web pointer-target requirements and exceptions.
- **S4 — [WCAG 2.2](https://www.w3.org/TR/WCAG22/), SC 1.3.1 and 2.4.3.** Semantic relationships and logical focus order; also referenced by the local skill’s browser guidance.

The W3C Understanding documents explain the criteria; the WCAG specification supplies the normative requirements. Exact fonts, dimensions, breakpoints, colors, and composition above are project design decisions. The local `design-interface`, `inspect-interface`, `plan-interface`, and `check-interface` instructions supplied the inspection, planning, and bounded verification workflow.

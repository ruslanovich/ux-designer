# Collections and disclosure

Select the relevant sections for the actual operation. Preserve needed expert information, rare necessary capabilities, and the distinction between expected behavior and observation.

## R16 — Connect search to intent

- Apply when search is part of the product task or existing search fails to surface relevant content.
- Identify relevant intentions, such as a known object, category, attribute, use case, or service information. Connect results to suitable refinement and make material scope restrictions understandable.
- Select intentions for the actual domain; avoid importing every ecommerce query type. Record data or search-logic dependencies, including capabilities that do not yet exist.
- Plan representative queries with known available content, understandable interpretation, and a useful way to refine an empty result. Mark these checks unverified until run against the implementation.
- Ground the decision in S14: original ecommerce observations and benchmarking, with limited published methods and domain-specific transfer.

## R17 — Explain active result constraints

- Apply when filters, hidden selection settings, or automatic constraints affect a result set.
- Show which values shape the result and how the user can change available constraints. Add the attribute name when a value alone is ambiguous.
- Fit the overview to the screen and selection volume. Preserve the meaning of mandatory constraints even when they cannot be changed. Make the existence and access path of any concealed part understandable.
- Plan to observe the actual selected state after applying filters, entering the view, and returning from details; connect a change to its expected result set.
- Ground the decision in S15. Preserve its ecommerce context and the lack of a demonstrated universal best overview position.

## R18 — Disclose details according to the current task

- Apply when the initial display obscures necessary distinctions or presents many specialized capabilities.
- Keep information and actions needed for the current decision accessible. Specify a discoverable control, meaningful label, and expanded-state behavior for deferred content.
- Account for information that is secondary to a novice but central to an expert. Allow several visible sections when comparison requires them. Preserve unknown usage frequency as an assumption.
- Plan to observe whether the main task has its necessary data, details can be reached, and expansion or collapse preserves meaningful context. Include the significant expert task when concealment affects it.
- Ground the decision in S12 and S18: conditional professional guidance. Avoid deriving a fixed number of disclosure levels or treating every accordion implementation as equivalent.

## R19 — Match collection presentation to the operation

- Apply when presenting objects or records.
- Consider a table for comparing common attributes, a list for sequential item finding, and cards for browsing heterogeneous or visually significant content. Preserve meaningful order, comparable attributes, required batch actions, and understandable selection state.
- Combine presentations when tasks differ and the added complexity is justified. Preserve a specialist's justified need for density; avoid hiding columns or actions solely to make the screen sparse.
- Plan to observe whether typical finding, comparison, and collection operations can be completed without unnecessary per-object navigation. Include realistic content lengths and relevant selection states.
- Ground the decision in S13 and S19. Treat variable-size card examples and an enterprise table system as bounded guidance; avoid a universal ranking of cards, lists, and tables.

## R20 — Match the visualization to the data question

- Apply when conveying a numerical relationship or pattern.
- State the question, such as change over time, ranking, distribution, or composition. Choose a representation for that relationship and provide exact values when the task requires them.
- Retain text or a table when they answer the question adequately. Record a precise evidence gap before prescribing specialized scales, uncertainty displays, or statistical comparisons beyond the available guidance.
- Plan to observe whether the representation answers the question and agrees with the data, units, labels, and aggregation. Keep invented demonstration values clearly identified.
- Ground the decision in S20: a professional visual vocabulary, not a complete dashboard or statistical-design method.

## Primary sources

- [S12 — Jakob Nielsen, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): expert guidance; preserve task-frequency and joint-use conditions, and keep historical desktop examples outside the supported product scope.
- [S13 — Page Laubheimer, Cards: UI-Component Definition](https://www.nngroup.com/articles/cards-component/): expert guidance with eye-tracking illustrations; the article does not establish that all grids are inferior to lists.
- [S14 — Edward Scott, Ecommerce Search UX 2026: 8 Search “Query Types” UX Best Practices](https://baymard.com/research-articles/ecommerce-search-query-types): public results of ecommerce research and benchmarking; do not treat benchmark counts as participant counts.
- [S15 — Kathryn Reeves, Display “Applied Filters” in an Overview](https://baymard.com/research-articles/how-to-design-applied-filters): public observational findings; preserve implementation and domain limits.
- [S18 — Vitaly Friedman, Designing The Perfect Accordion](https://www.smashingmagazine.com/2017/06/designing-perfect-accordion-checklist/): professional experience and reported observations, without a full test protocol.
- [S19 — IBM Carbon Design System, Data table](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines): product design-system practice; preserve enterprise and component scope.
- [S20 — Financial Times Visual Journalism Team, Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md): professional reference for matching relationships to visual forms.

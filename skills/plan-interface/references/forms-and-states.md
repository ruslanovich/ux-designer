# Forms and states

Choose the sections required by the task. Describe planned behavior without claiming to have run the interface.

## R21 — Split forms by meaning and dependencies

- Apply when a form contains several question groups or stages.
- Identify the user's distinct tasks and dependencies between answers. Keep related parameters jointly accessible when people need to move between them. For sequential portions, compare separate pages and expanding sections in terms of progression, correction, and retained input.
- Allow one meaningful task to contain several fields. Use the actual context for professional bulk entry. Avoid a universal one-field-per-page, single-page, or accordion prescription.
- Specify how changing an earlier answer affects later questions, existing answers, and the next valid action. Make the chosen path executable without asking the implementer to resolve the central interaction decision.
- Plan checks for completing the form, taking material branches, changing an earlier answer, and returning with input preserved or intentionally updated.
- Ground the decision in S16 and S17. Preserve their different settings and outcomes: a small laboratory comparison and commercial case reports do not establish a universal winner.

## R23 — Plan relevant states and recovery

- Apply when a task involves input, selection, asynchronous work, waiting, or a possible error.
- Specify relevant states before and after the action: progress, outcome, failure, no data, cancellation, or continuation. Explain what is happening, the next available action, and which work is retained.
- Select states according to the scenario. Treat states absent from a screenshot as unknown. Add confirmation or extra steps according to the action's actual consequences.
- Define what the user sees and can do in each material state, which transition follows, and what happens to entered data or selection. Identify dependencies on permissions, data, or services when they affect the interaction.
- Plan observations for meaningful deviations: an understandable status, an available way to continue or finish, and no unexplained loss of work. Keep checks for inaccessible behavior unverified and state the required environment.
- Ground the decision in S25's visibility, control, and error heuristics. Treat the selected state set as a project decision; avoid claiming the source specifies every domain-specific recovery policy.

## Preserve the form evidence boundary

- Retain the specific choice, its rationale, and the conditions on which it depends.
- Keep successful task completion, completion speed, user preference, and commercial conversion as distinct outcomes.
- Treat existing user reports as reported evidence. Treat predicted improvements as hypotheses.
- Revisit the affected decision when implementation constraints change transitions or retained work.

## Primary sources

- [S16 — Luke Wroblewski, Testing Accordion Forms](https://alistapart.com/article/testing-accordion-forms/): a four-variant checkout study with 24 participants; preserve the laboratory and historical-interface limits and the absence of targeted accessibility testing.
- [S17 — Adam Silver, Better Form Design: One Thing Per Page (Case Study)](https://www.smashingmagazine.com/2017/05/better-form-design-one-thing-per-page/): commercial case reports and expert rationale; preserve the limits of the reported short-period extrapolation and undisclosed experimental controls.
- [S25 — Jakob Nielsen, 10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/): professional heuristics for status, control, consistency, and recovery.

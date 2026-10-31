# Executable plan and shared context

Read this reference when shaping the plan and its handoff. Keep the record proportional to the task. Reuse the caller's record or the conversation; require neither JSON nor a new document. Use only fields that add useful context.

## R11 — Prepare the design before implementation

- Describe the affected information, objects, actions, relationships, placement, path to the outcome, and material states before code is changed.
- Assign supplied text to its role in the task and preserve its meaning. Keep missing facts, unverified product claims, and demonstration content explicit.
- Explain material choices and their rationale. Choose a recommended direction when the context supports it; compare alternatives when the compromise changes the task.
- Scale the result from a short local-change description to a section map and several connected flows. Avoid turning a minor change into a mandatory large artifact.
- Make the design executable: resolve the central content and interaction choices, state implementation dependencies, and leave a clear owner for unresolved material questions.
- Ground the IA model in [S06 — Jen Cardello, The Difference Between Information Architecture (IA) and Navigation](https://www.nngroup.com/articles/ia-vs-navigation/). Treat design-before-code and the handoff format as project requirements, not as measured effects of that article.

## Continue the shared record

| Field | Carry forward or add when useful |
| --- | --- |
| brief | Record goal, audience, platform, scope, and constraints. |
| evidence | Record id, statement, status, and source for a material claim. |
| content | Record needed content, objects, relationships, actions, supplied text, and constraints on changing it. |
| tasks | Record trigger, steps, outcome, and material exceptions; include relevant entry, continuation, and recovery. |
| decisions | Record id, choice, why, and depends_on; retain the evidence or assumption on which the choice depends. |
| checks | Record expectation, method, conditions, observation, and status for the affected properties. |
| next | Record owner, question or action, and reason for the next bounded step. |

Use identifiers only where they make dependencies clear. Cite a source location at the level actually inspected: a provided statement, content section, visible state, code location, or primary publication. Preserve previous answers and decisions while updating affected dependencies.

## Preserve evidence status

| Status | Use it for |
| --- | --- |
| observed | A property directly observed in an accessible artifact or action, within the stated conditions. |
| reported | A statement supplied by the user or another identified source about the product or its users. |
| hypothesis | A working assumption or inference that still needs the relevant evidence. |
| decision | An adopted project choice; keep its rationale and dependencies. |
| unknown | Information not established from the available material. |

Keep a chosen audience separate from assumptions about that audience's behavior. Treat a missing screenshot state as unknown and usage frequency as unestablished unless supported. Preserve rare necessary and expert capabilities during redesign.

## Describe acceptance observations before they exist

- Give each planned check a concrete expectation, a method capable of observing it, and the necessary conditions or environment.
- Leave observation empty and set status to unverified for a planned check. Avoid filling observation with the expected result or describing an imagined walkthrough as execution.
- Preserve supplied genuine prior observations with their original conditions. Add new checks for changed behavior; do not imply that an earlier result verifies the revised design.
- Use supported_in_conditions only for an actual observation supporting the expectation under stated conditions. Use mismatch only for an actual observed conflict. Use unverified when the required observation has not been made or is insufficient.
- Separate functional observations from evidence of audience understanding or commercial outcomes. A later agent pass can inspect behavior; it does not establish usability for the audience, improved conversion, or complete accessibility.

## Return a standalone result or a handoff

- Present the plan in the user's language, using plain terms and a format suited to the task. Include the chosen structure, material decisions, important assumptions, and planned acceptance observations.
- Return a useful plan when invoked independently. When called by design-interface, merge the relevant updates into its shared context.
- Route by responsibility using module names only: use clarify-interface for a material unresolved choice or fact, inspect-interface for missing accessible material, build-interface for authorized implementation, or check-interface for an authorized review.
- Keep the handoff self-contained. Include the information required for the next action; avoid dependencies on physical paths of sibling skills or on a full read of the research corpus.
- End a planning-only assignment with the completed plan. Continue a broader authorized assignment through its owner without adding a new confirmation gate for every routine decision.

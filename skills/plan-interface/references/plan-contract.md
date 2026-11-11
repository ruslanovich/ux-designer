# Executable plan and shared context

Read this reference when shaping the plan and its handoff. Keep the record proportional to the task. Reuse the caller's record or the conversation; require neither JSON nor a new document. Use only fields that add useful context.

## R11 — Prepare the design before implementation

- Describe the affected information, objects, actions, relationships, placement, visual organization, path to the outcome, and material states before application code is changed.
- Assign supplied text to its role in the task and preserve its meaning. Keep missing facts, unverified product claims, and demonstration content explicit.
- Explain material choices and their rationale. Choose a recommended direction; compare lightweight alternatives when a consequential decision has materially different plausible solutions.
- Scale the result from a short local-change description to a section map and several connected flows. Avoid turning a minor change into a mandatory large artifact.
- Make the design executable: resolve the central content, interaction, and visual choices, state implementation dependencies, and leave a clear owner for unresolved material questions.
- Ground the IA model in [S06 — Jen Cardello, The Difference Between Information Architecture (IA) and Navigation](https://www.nngroup.com/articles/ia-vs-navigation/). Treat design-before-code and the handoff format as project requirements, not as measured effects of that article.

## Match scope and completion to the request — R37

Keep the requested endpoint separate from the recommended depth. The endpoint may be a plan while the design spans a whole connected workflow. The user need not classify the work; state the scope and the problems it addresses.

For a broad redesign, deliver a coherent selected design for the significant screens, transitions, and states. Include enough placement, content, interaction, and visual decisions for implementation. A list of optional improvements leaves that assignment incomplete. If a needed material or tool is unavailable, finish the supported part and identify the consequential gap.

Use readable hierarchy, composition, consistency, and the requested visual direction as legitimate design reasons, alongside task and structural issues. Existing capabilities and constraints must remain accounted for; their current arrangement can change. Keep design judgments separate from measured audience outcomes.

For a mature product, distinguish the target experience from its transition or rollout. Specify how an authorized implementation slice fits the target and what dependencies remain. A local request needs its relevant dependencies; it does not require a product-wide concept.

## Continue the shared record

| Field | Carry forward or add when useful |
| --- | --- |
| brief | Record goal, audience, platform, requested endpoint, chosen scope, its reason, and constraints. |
| evidence | Record id, statement, status, source, and relevant inspection or research limits for a material claim. |
| content | Record needed content, objects, relationships, actions, supplied text, and constraints on changing it. |
| tasks | Record trigger, steps, outcome, and material exceptions; include relevant entry, continuation, and recovery. |
| decisions | Record the chosen structure and visual direction, why, meaningful alternatives, and dependencies; retain the supporting evidence or assumption. |
| checks | Connect priority problems and preserved capabilities to expectation, method, conditions, observation, and status. |
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

- Present the plan in the user's language, using plain terms and a format suited to the task. Include the chosen structure and visual direction, significant screens and states, material decisions, important assumptions, and planned acceptance observations.
- Return a useful plan when invoked independently. When called by design-interface, merge the relevant updates into its shared context.
- Route by responsibility using module names only: use clarify-interface for a material unresolved product choice or fact, inspect-interface for missing accessible material, research-interface for an external evidence question, build-interface for authorized implementation, or check-interface for concept review or verification.
- Keep the handoff self-contained. Include the information required for the next action; avoid dependencies on physical paths of sibling skills or on a full read of the research corpus.
- End a planning-only assignment with the completed plan. Continue a broader authorized assignment through its owner without adding a new confirmation gate for every routine decision.

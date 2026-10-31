---
name: plan-interface
description: Prepare an implementable design for the structure, content, navigation, presentation, forms, and states of browser interfaces or native iOS and Android apps before implementation. Use for an interface plan, structural redesign, organization of supplied content, or a design derived from a raw idea, an existing application, reference fragments, or a combination of these inputs. Support standalone planning and handoff from design-interface.
---

# Plan Interface

Turn the user's task into a proportionate, executable design before changing code. Respond in the user's language and use plain terms. Cover desktop and mobile browsers and native iOS or Android; exclude native desktop applications.

## Establish the design boundary

1. Reuse the available brief, evidence, content, tasks, and earlier decisions. Accept any useful combination of application material, references, an idea, or text drafts; require neither an existing interface nor a complete specification.
2. Identify the intended outcome, audience, platform, affected scope, and material constraints. Reconstruct the relevant path from trigger to outcome, including meaningful entry, continuation, and recovery. Use a wider journey only when dependencies beyond the current screen matter.
3. Separate directly observed properties, reported facts, hypotheses, decisions, and unknowns. Do not infer usage frequency from visual prominence or an absent feature from an incomplete screenshot.
4. Resolve only uncertainties that materially change the design. Use available material first; route to inspect-interface for missing accessible evidence or clarify-interface for a consequential question when useful. When loading a module through the host catalog, select the same installed plugin and retain its catalog namespace when applicable. If invoked alone, perform the small necessary clarification directly.
5. Ask in simple language. For a design choice, offer understandable alternatives, a reasoned recommendation, and room for a free answer. For an existing fact, ask neutrally and allow unknown. Continue with bounded, explicit assumptions when the missing information does not block a useful plan.

## Load the relevant guidance

Read [Executable plan and shared context](references/plan-contract.md) to shape the result. Load the other references only for the decisions present in this task; read their applicable sections rather than the entire corpus.

| Load when deciding | Reference and approved rules |
| --- | --- |
| Scope and handoff of the design | [Plan contract](references/plan-contract.md): R11 and the shared record |
| Groups, labels, hierarchy, destinations, or preservation during redesign | [Structure and content](references/structure-and-content.md): R12–R15, R22 |
| Search, applied filters, disclosure, collections, or charts | [Collections and disclosure](references/collections-and-disclosure.md): R16–R20 |
| Form organization, task states, or recovery | [Forms and states](references/forms-and-states.md): R21, R23 |
| Browser history, semantic structure, focus, or web operation | [Web](references/web.md): R25, R28, R29 and transfer boundaries for R27, R30 |
| Native iOS navigation, supporting tasks, adaptation, or accessible actions | [iOS](references/ios.md): R24, R26, R27, R30 |
| Native Android navigation, return, adaptation, semantics, or accessible actions | [Android](references/android.md): R24, R25, R27, R28, R30 |

Keep evidence types visible in your reasoning: distinguish empirical findings, expert heuristics, design-system practice, platform conventions, normative criteria, and project requirements. Consult the linked primary source when a material detail or version-dependent behavior needs confirmation. Identify an unsupported extension instead of presenting it as a proven rule.

## Make the design executable

1. **Model the affected content and task — R11.** Identify needed information, objects, relationships, actions, and task outcomes. Assign supplied text to an appropriate role and position; preserve its meaning. Mark missing facts, unverified product claims, and demonstration content explicitly.
2. **Choose the structure and presentation.** Define the affected groups, destination roles, content order, labels, and relevant collection or form representation. Use the applicable references. Compare real alternatives when their tradeoff changes the task, then choose a direction with its rationale and dependencies. Avoid leaving a central interaction choice unresolved for the builder.
3. **Preserve necessary capabilities — R22.** Map existing needed information and functions to their planned location. Retain working structure when change lacks a task-based reason. Preserve rare necessary actions, expert workflows, useful density, and meaningful supplied content. Investigate unknown purpose or retain the capability pending evidence; avoid treating infrequency as proof of redundancy.
4. **Specify transitions and material states.** Describe entry, action, feedback, completion, correction, continuation, and return where they affect the outcome. For a supporting task, specify background availability, finish and cancel behavior, retained work, and its connection to the originating task. Define data or service dependencies behind search, filters, forms, or other dynamic behavior. Include only relevant states, and identify behavior that cannot be established from the available material.
5. **Preserve operation across the intended conditions — R27, R30.** For every target, including browsers, preserve the task and needed actions when space or text size changes. Specify how significant icon, gesture, or custom actions are named and performed with applicable input methods. Apply the target platform's semantics and units; do not convert Apple or Android guidance into a normative web requirement.
6. **Review the design for coherence.** Trace the planned task through its content, decisions, and states. Check for missing destinations, lost functionality, contradictory state behavior, unresolved dependencies, and unjustified complexity. Treat this as reasoning about the design, not observed execution or a user study.

Use meaningful distinctions and task evidence rather than a universal menu item count, depth limit, mandatory card treatment, or single-page/multi-step form preference. Keep important comparison information available when hiding it would obstruct the task. Interpret reference fragments through the current task and platform; resolve conflicting assumptions before combining them.

Scale the result to the change. A local correction may need a short description; a broader design may need a content map, connected flows, and state descriptions. Use a diagram or low-fidelity representation when it resolves a meaningful ambiguity. Require no fixed document, JSON schema, or visual artifact.

## Define acceptance observations and hand off

1. Carry forward useful fields from the self-contained [plan contract](references/plan-contract.md): brief, evidence, content, tasks, decisions, checks, and next. Keep fields optional and proportional. Use R11–R30 identifiers when they help trace a material choice.
2. For each needed future check, state its **expectation**, **method**, and **conditions**. Leave **observation empty** and set **status to unverified**. Preserve genuine prior observations with their conditions; do not let them verify a changed design by implication.
3. Return the chosen design, material decisions and assumptions, implementation dependencies, planned checks, and any bounded unresolved question with its next owner. Keep the handoff understandable without physical paths to sibling skills or a full corpus read.
4. End a planning-only request with the completed plan. In a broader authorized assignment, return it to design-interface or hand it to build-interface through the active owner. Use check-interface for an authorized review when appropriate. Keep implementation out of this planning module, and do not add a new approval gate for routine decisions already covered by the user's authorization.

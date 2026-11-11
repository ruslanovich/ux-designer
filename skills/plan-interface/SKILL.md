---
name: plan-interface
description: Prepare a coherent, implementable design for content, structure, navigation, interaction, visual organization, and states of browser interfaces or native iOS and Android apps. Use for interface planning, visual or structural redesign, organizing supplied content, or designing from an idea, existing app, or references. Choose an appropriate depth and concrete key screens before implementation. Support standalone planning and handoff from design-interface.
---

# Plan Interface

Turn the user's task into a proportionate, executable design before changing code. Respond in the user's language and use plain terms. Cover desktop and mobile browsers and native iOS or Android; exclude native desktop applications.

## Establish the design boundary

1. Reuse the available brief, evidence, content, tasks, and earlier decisions. Accept any useful combination of application material, references, an idea, or text drafts; require neither an existing interface nor a complete specification.
2. Identify the intended outcome, audience, platform, requested endpoint, proposed change scope, and material constraints. Choose a local correction, a screen or connected flow, or product structure according to the priority problems. Explain the depth in ordinary terms. Reconstruct entry, continuation, outcome, and recovery; extend the journey when related dependencies matter. [R37]
3. Separate directly observed properties, reported facts, hypotheses, decisions, and unknowns. Do not infer usage frequency from visual prominence or an absent feature from an incomplete screenshot.
4. Resolve uncertainties that materially change the design. Use inspect-interface for missing accessible evidence or incomplete quality coverage, research-interface for external evidence, and clarify-interface for a consequential product question. Resolve modules through the host catalog in the same plugin namespace and honor explicit disablement. If invoked alone, perform small necessary clarification directly and continue useful work when a module or tool is unavailable.
5. Ask in simple language. For a design choice, offer understandable alternatives, a reasoned recommendation, and room for a free answer. For an existing fact, ask neutrally and allow unknown. Continue with bounded, explicit assumptions when the missing information does not block a useful plan.

## Load the relevant guidance

Read [Executable plan and shared context](references/plan-contract.md) to shape the result. For broad work, use the inspection findings and applicable quality areas to choose topics before narrowing the plan. Load the relevant sections below; the bundled topic list does not limit what may need designing.

| Load when deciding | Reference and approved rules |
| --- | --- |
| Scope, completion, and handoff of the design | [Plan contract](references/plan-contract.md): R11, R37 and the shared record |
| Composition, typography, hierarchy, density, visual direction, or significant alternatives | [Visual design](references/visual-design.md): R39 |
| Groups, labels, hierarchy, destinations, or preservation during redesign | [Structure and content](references/structure-and-content.md): R12–R15, R22 |
| Search, applied filters, disclosure, collections, or charts | [Collections and disclosure](references/collections-and-disclosure.md): R16–R20 |
| Form organization, task states, or recovery | [Forms and states](references/forms-and-states.md): R21, R23 |
| Browser history, semantic structure, focus, or web operation | [Web](references/web.md): R25, R28, R29 and transfer boundaries for R27, R30 |
| Native iOS navigation, supporting tasks, adaptation, or accessible actions | [iOS](references/ios.md): R24, R26, R27, R30 |
| Native Android navigation, return, adaptation, semantics, or accessible actions | [Android](references/android.md): R24, R25, R27, R28, R30 |

Use research-interface for orientation on a broad redesign or unfamiliar domain and for consequential gaps, competing patterns, or current platform details. Reuse equivalent evidence already read; model confidence alone does not remove a trigger. Apply source findings to the current task and record what they change or confirm. When research is unavailable, identify the specific limit and continue supported decisions. [R40]

Distinguish empirical findings, expert heuristics, design-system practice, platform conventions, normative criteria, and project requirements. Read a primary source before relying on its detail. Identify an unsupported extension and its planned check.

## Make the design executable

1. **Model the affected content and task — R11.** Identify needed information, objects, relationships, roles, actions, lifecycle states, and task outcomes. Assign supplied text to its role and position; preserve its meaning. Mark missing facts, unverified product claims, and demonstration content explicitly.
2. **Choose a coherent structure and visual direction — R39.** Resolve groups, destinations, reading order, labels, collection or form representation, page composition, type hierarchy, density, semantic color, and component treatment where relevant. Use existing design-system and brand constraints. Explore lightweight alternatives when a consequential choice has materially different plausible solutions; compare them against the same tasks and constraints, then choose a direction. Resolve central content, interaction, and visual choices before handoff.
3. **Preserve necessary capabilities — R22.** Map required information, functions, permissions, and other constraints to the proposed design. Reconsider existing grouping, navigation, layout, and presentation when needed to resolve the problem or requested direction. Carry useful existing decisions into a coherent whole. Preserve rare necessary actions, expert workflows, useful density, and meaningful content; investigate an unknown purpose or retain the capability pending evidence.
4. **Specify transitions and material states.** Describe entry, action, feedback, completion, correction, continuation, and return where they affect the outcome. For a supporting task, specify background availability, finish and cancel behavior, retained work, and its connection to the originating task. Define data or service dependencies behind search, filters, forms, or other dynamic behavior. Include only relevant states, and identify behavior that cannot be established from the available material.
5. **Preserve operation across the intended conditions — R27, R30.** For every target, including browsers, preserve the task and needed actions when space or text size changes. Specify how significant icon, gesture, or custom actions are named and performed with applicable input methods. Apply the target platform's semantics and units; do not convert Apple or Android guidance into a normative web requirement.
6. **Review the concept — R41.** Trace the original priority problems through the chosen content, structure, interactions, visual organization, and states. Check that the scope is sufficient and appropriate, necessary capabilities remain available, and key screens are concrete enough to implement. Correct a weak concept before substantial implementation. Use check-interface when helpful; label a design walkthrough as an expert review and keep execution or audience outcomes unverified until observed.

Use meaningful distinctions and task evidence rather than a universal menu item count, depth limit, mandatory card treatment, or single-page/multi-step form preference. Keep important comparison information available when hiding it would obstruct the task. Interpret reference fragments through the current task and platform; resolve conflicting assumptions before combining them.

Scale the result to the change. A local correction may need a short description. A broad redesign requires a selected, coherent solution for the significant screens and states; resolve the relationships between them. Use a content map, annotated layout, wireframe, prototype, or precise description suited to the decision. When composition is central and suitable tools are available, show a representative rendered design. Require no fixed document or JSON schema. Keep the target experience distinct from a bounded rollout or implementation slice. [R11, R37, R39]

## Define acceptance observations and hand off

1. Carry forward useful fields from the self-contained [plan contract](references/plan-contract.md): brief, evidence, content, tasks, decisions, checks, and next. Keep fields optional and proportional. Use rule identifiers only when they help trace a material choice.
2. For each needed future check, state its **expectation**, **method**, and **conditions**. Leave **observation empty** and set **status to unverified**. Preserve genuine prior observations with their conditions; do not let them verify a changed design by implication.
3. Return the chosen design at the required depth, material decisions and assumptions, visual direction, implementation dependencies, planned checks, and any bounded unresolved question with its next owner. Connect checks to the original problems and preserved capabilities. Keep the handoff understandable without physical paths to sibling skills or a full corpus read.
4. End a planning-only request with the completed plan. In a broader authorized assignment, return it to design-interface or hand it to build-interface through the active owner. Use check-interface for an authorized review when appropriate. Keep implementation out of this planning module, and do not add a new approval gate for routine decisions already covered by the user's authorization.

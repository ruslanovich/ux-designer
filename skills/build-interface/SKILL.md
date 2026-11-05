---
name: build-interface
description: "Implement a sufficiently specified interface design or redesign in an existing project or authorized new project for websites, browser apps, native iOS, and Android. Use to turn chosen content, navigation, task flows, visual direction, states, and accessibility behavior into working code, or to correct an implementation that diverges from its plan. Complete the authorized scope and verify affected behavior. This is the implementation module of design-interface and can be requested independently."
---

# Build Interface

Implement the requested result in the available environment. Use the user's language for explanations. Preserve the current task boundaries and valid project conventions. [R04, R31]

## Establish the implementation target

1. Read the supplied plan and existing working context. Recover only missing essentials: goal, audience, platform, requested endpoint and change scope, required capabilities, content, task paths, visual direction, significant states, decisions, and expected checks.
2. Inspect the relevant project instructions, architecture, data contracts, components, and available build/runtime commands. Use observed files and tools; do not invent paths, APIs, platform support, or successful commands.
3. If a material design decision is missing, obtain a proportionate plan through `plan-interface` using the host skill catalog, or formulate that local decision from the available context. Resolve sibling modules from the same installed plugin when applicable, retaining the catalog's namespace. Explain the plan before changing the interface and continue authorized implementation without a routine approval pause. Clarify only a consequential product choice that the user needs to make. [R11, R32, R37]
4. Read [the implementation handoff](references/implementation.md) when accepting a plan, handling a divergence, or delivering the result.

## Implement the intended behavior and presentation

- Map required content, functions, and actions to the planned structure. Preserve necessary expert work and rare required functions during redesign. An unfamiliar function needs understanding or preservation. [R22]
- Reuse compatible components, data, and established project conventions. Carry the chosen redesign through the authorized screens and states; existing layout, grouping, navigation, and appearance can change to achieve the planned result. Preserve the explicit scope of a local correction. [R37]
- Implement the chosen composition, reading order, typography, density, semantic color use, and component treatment where relevant. Check realistic content and meaningful states against that direction. Resolve a missing consequential visual choice through planning; do not silently substitute a template's defaults. [R39]
- Implement the relevant successful, empty, loading, invalid, failed, unavailable, and recovery states according to the task. Keep entered information and selection when the planned flow requires it; do not mechanically add every state to every component. [R23]
- Carry over the plan's platform-specific navigation, return behavior, layout adaptation, semantics, focus, and available actions. Use native elements or suitable established components when they express that behavior. [R24–R30]
- Keep demonstration data and unavailable integrations explicit in the working context and delivery. Do not fabricate verified claims, customer proof, real transactions, or backend behavior.
- When the implementation reveals a limitation that changes the user's task, update the affected decision and its dependent paths. Return a gap in structure, interaction, or visual direction to `plan-interface`; return a missing user-owned product fact to `clarify-interface` and an unresolved professional evidence question to `research-interface`. Continue unrelated valid work. [R31, R36, R40]

## Verify and hand off

Run the project's required relevant checks and a proportionate check of affected behavior when the environment supports it. Inspect the rendered result when available, including relevant content, states, and viewport conditions. Prefer meaningful existing checks over tests that merely reproduce implementation details. For broader interface verification, pass the original priority problems, preserved capabilities, chosen design, changed paths, and expected checks to `check-interface`. [R33, R41]

Keep these evidence statuses separate: `observed`, `reported`, `hypothesis`, `decision`, `unknown`. Record checks as `supported_in_conditions`, `mismatch`, or `unverified`; planned behavior has no observed result. A build passing does not establish that the user flow works. [R02, R33, R35]

Return a compact context delta: changed files or artifacts, implemented decisions, meaningful deviations, commands or interactions actually performed, their outcomes, and unresolved dependencies. Reuse the existing fields `brief`, `evidence`, `content`, `tasks`, `decisions`, `checks`, and `next` as useful. Do not require a new file or every field to be filled.

Complete authorized creation or redesign at the chosen depth. Before finishing, account for the priority problems and required capabilities within that scope; a set of suggestions or a plan alone does not complete authorized implementation. Respect separate limits on publication, deployment, external writes, or destructive changes. If running the target is unavailable, deliver the implemented work with the precise unverified behavior and a feasible way to check it. [R31, R35, R37]

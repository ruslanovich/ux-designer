---
name: build-interface
description: "Implement a sufficiently specified interface plan in an existing project or authorized new project for websites, browser apps, native iOS, and Android. Use to turn chosen content, navigation, task flows, states, and accessibility behavior into working code, or to correct an implementation that diverges from its plan. This is the implementation module of design-interface and can be requested independently."
---

# Build Interface

Implement the requested result in the available environment. Use the user's language for explanations. Preserve the current task boundaries and valid project conventions. [R04, R31]

## Establish the implementation target

1. Read the supplied plan and existing working context. Recover only missing essentials: goal, audience, platform, scope, content, task paths, significant states, decisions, and expected checks.
2. Inspect the relevant project instructions, architecture, data contracts, components, and available build/runtime commands. Use observed files and tools; do not invent paths, APIs, platform support, or successful commands.
3. If a material design decision is missing, obtain a proportionate plan through `plan-interface` using the host skill catalog, or formulate that local decision from the available context. Select the module from the same installed plugin when applicable, retaining the catalog's namespace. Explain the plan before changing the interface. Clarify only a consequential product choice that the user needs to make. [R11, R32]
4. Read [the implementation handoff](references/implementation.md) when accepting a plan, handling a divergence, or delivering the result.

## Implement the intended behavior

- Map required content, functions, and actions to the planned structure. Preserve necessary expert work and rare required functions during redesign. An unfamiliar function needs understanding or preservation. [R22]
- Reuse compatible components, data, and established project conventions. Change structure and appearance only as needed for the authorized result.
- Implement the relevant successful, empty, loading, invalid, failed, unavailable, and recovery states according to the task. Keep entered information and selection when the planned flow requires it; do not mechanically add every state to every component. [R23]
- Carry over the plan's platform-specific navigation, return behavior, layout adaptation, semantics, focus, and available actions. Use native elements or suitable established components when they express that behavior. [R24–R30]
- Keep demonstration data and unavailable integrations explicit in the working context and delivery. Do not fabricate verified claims, customer proof, real transactions, or backend behavior.
- When the implementation reveals a limitation that changes the user's task, update the affected decision and its dependent paths. Return a structural gap to `plan-interface`; return a missing product fact to `clarify-interface`. Continue unrelated valid work. [R31, R36]

## Verify and hand off

Run the project's required relevant checks and a proportionate check of affected behavior when the environment supports it. Prefer meaningful existing checks over tests that merely reproduce implementation details. For broader interface verification, pass the changed paths and expected checks to `check-interface`.

Keep these evidence statuses separate: `observed`, `reported`, `hypothesis`, `decision`, `unknown`. Record checks as `supported_in_conditions`, `mismatch`, or `unverified`; planned behavior has no observed result. A build passing does not establish that the user flow works. [R02, R33, R35]

Return a compact context delta: changed files or artifacts, implemented decisions, meaningful deviations, commands or interactions actually performed, their outcomes, and unresolved dependencies. Reuse the existing fields `brief`, `evidence`, `content`, `tasks`, `decisions`, `checks`, and `next` as useful. Do not require a new file or every field to be filled.

Complete authorized creation or redesign. Respect separate limits on publication, deployment, external writes, or destructive changes. If running the target is unavailable, deliver the implemented work with the precise unverified behavior and a feasible way to check it. [R31, R35]

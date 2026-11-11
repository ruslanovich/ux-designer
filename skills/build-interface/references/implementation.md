# Implementation handoff

Read when accepting a design, handling an implementation constraint, or preparing delivery. These are operational requirements of the system, principally R22, R31, R33, R36, R37, and R39; the design's conditional knowledge remains with its planning reference.

## Accept the plan

Recover enough information to implement:

- The intended user result, requested endpoint, chosen depth, and authorized change.
- Required information, functions, and existing capabilities to retain.
- Content placement, navigation, actions, state transitions, and platform.
- Composition, reading order, typography, density, semantic color, and component treatment where they materially affect the result.
- Meaningful errors, cancellation, correction, return, and preservation of input or selection.
- Decisions with their reasons and important assumptions.
- Observable expected checks.

Do not require a complete formal specification for a local edit. Fill ordinary implementation choices yourself. If the plan conflicts with the current user instruction or observed project, reconcile the affected part before coding it.

For substantial redesign, ensure the key screens and states have concrete design decisions. Reuse a concept review if already performed. A remaining material design gap returns to planning; a missing minor implementation detail can be resolved directly. Continue the authorized workflow without asking the user to approve every module handoff.

## Map design to the project

For each material change, identify the relevant existing surface, data contract, component, or route. Preserve real domain terms and supplied content. Derive new structures from the task and plan, not from the convenience of a chosen template.

Keep a short preservation mapping during redesign where loss is a concrete risk: old function or information → new location or justified removal. Include rare required functions and expert operations. The mapping can remain in working notes; it need not become a separate artifact.

Apply the selected direction consistently across the affected interface. Check that reused components can express it; account for realistic content lengths, dense or empty data, and meaningful states. Avoid completing only an easy visual fragment while leaving the primary problem within the authorized scope unresolved.

When a mature product needs a staged transition, implement the authorized slice and preserve the required continuity with the broader target. Keep the target design and rollout boundary explicit. Do not treat permission to redesign one flow as permission to deploy or rebuild the whole product.

Use the existing project's execution and verification paths. When starting from scratch, select a suitable implementation approach within the request and available capabilities. Do not make a platform choice on the user's behalf when it changes their requested product.

## Handle a divergence

1. Record the observed limitation and the decision it affects.
2. Decide whether it is an implementation detail or changes the content, interaction, or visual direction.
3. Solve an ordinary implementation detail directly.
4. Revisit a changed design with `plan-interface` or the same planning reasoning. Use `research-interface` if the decision needs additional professional evidence.
5. Ask about a consequential product tradeoff only if it belongs to the user.
6. Update the context and affected expected checks.

Avoid quietly dropping a state, function, required content item, or accessible action because it is difficult to implement. An unavailable integration can remain a stated prototype boundary when consistent with the requested deliverable.

## Provide verification evidence

Pass the original priority problems, required capabilities, relevant expectations, and actual observations to `check-interface`. Include environment, state, action, and observed outcome; quote precise tool or command results only where useful. Compare the rendered result with the chosen visual direction when rendering is available. Keep a failed concept distinct from an implementation mismatch.

Keep separate:
- A project that compiles.
- A visible static artifact.
- A task that was actually executed.
- A participant's observed behavior.

Report the checks that occurred. Keep unavailable target-device, browser, integration, or assistive-technology checks `unverified`. A screenshot or a code review can support a bounded finding; it cannot stand in for every runtime behavior.

## Finish within the request

Deliver the changed artifact, reasons for material decisions, relevant verification results, and remaining assumptions. Avoid claiming better conversion, universal optimality, or complete accessibility without appropriate evidence.

Apply fixes to the discovered cause and recheck the affected path. Stop additional optional testing when the remaining concrete risks have been addressed or explicitly identified; respect project-required gates.

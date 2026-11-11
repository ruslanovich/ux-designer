---
name: check-interface
description: Verify the quality of an interface concept and its implementation against the original user task, priority problems, required capabilities, and applicable guidance. Use to review a proposed design, check a completed redesign, investigate a discrepancy, or assess a specified property from screenshots or code. Cover websites and web apps in desktop or mobile browsers, native iOS, and Android. Report what the available evidence supports and route corrections to planning, research, or implementation as needed.
---

# Check Interface

Check the stated question and the affected user path. Assess whether the design solves the original problem as well as whether implementation follows the design. Answer in the user's language and explain findings without requiring design terminology.

Use this skill independently or within design-interface. Reuse the original task, important findings, and decisions; an accepted plan remains open to correction. Send material design revisions to plan-interface. Exclude native desktop applications.

## Establish the check

1. Recover the original goal, priority problems, required capabilities, expected outcome, target platform, requested endpoint, change scope, and available artifact. Distinguish mobile browser, native iOS, and native Android; identify iPadOS separately when relevant.
2. Reuse relevant brief, evidence, content, tasks, decisions, and previous checks. Keep fields optional and use existing prose, tables, or artifacts; do not require JSON, a new context file, or a standard questionnaire.
3. If invoked alone, formulate a small checkable question from the request. Ask only when a missing fact would materially change the expectation; otherwise state a bounded assumption and continue.
4. Record the expected property and its basis: the original task, a stated requirement, an accepted decision, an applicable normative criterion, or conditional guidance. Flag an accepted decision that conflicts with the task; do not treat every difference from a reference as a defect.

Read [checks.md](references/checks.md) for the affected project, interaction, or platform property. Read [evidence-and-routing.md](references/evidence-and-routing.md) when the input is limited, the basis is conditional, a user-research question remains, or a finding needs a handoff.

## Select the available method

- For a plan or significant redesign, review the concept against the original priority problems. Check sufficient depth, coherent content, structure, interaction and visual organization, preservation of capabilities, and concrete key screens and states. Implementation fidelity alone cannot establish this. Apply R41.
- For a plan, walk through the intended task and material exceptions. Check that required information, actions, transitions, and outcomes are represented. Inspect visual organization to the extent the artifact exposes it. Report a design judgment and potential gaps; actual audience success requires appropriate observations. Apply R32.
- For screenshots, content, or code, inspect only properties that the material exposes. Keep hidden states and runtime behavior unresolved unless independently evidenced.
- For an accessible running interface, execute the affected path with supported tools in the authorized environment. Check the behavior changed by the work and the relevant consequence or exception. Apply R31 and R33.
- If execution is unavailable, finish the useful project or static review, identify the consequential unverified property, and describe a small feasible follow-up. Do not block all work or ask the user to perform a blanket audit.

Match breadth to the request and priority problems. For a local check, cover the relevant property and dependencies. For a broad redesign, inspect the chosen solution across applicable content, structure, interaction, visual quality, consistency, and use conditions. A narrow implementation diff does not set the review boundary when the original task is broader. Treat mock data, simulated responses, and isolated component previews as limits on the observed result.

## Preserve evidence and status

Carry forward stable decision and evidence IDs when present. For each material check, retain expectation, method, conditions, observation, and status; add the relevant rule ID and source or decision when useful for traceability.

- Use supported_in_conditions only for the property actually supported by the stated method and conditions.
- Use mismatch for an observed or demonstrable conflict with the applicable expectation; show the evidence and practical consequence.
- Use unverified when the check was not performed or the evidence is insufficient. Leave observation absent for a planned check; never write a predicted result as an observation.

Keep evidence statuses separate from check statuses. Use observed for inspected or executed evidence, reported for another person's account, hypothesis for an inference, decision for an adopted choice, and unknown for missing information. Scope an observed code or document property to that artifact rather than promoting it to observed runtime behavior.

## Return a useful result

Lead with the answer to the check question. Explain material findings, their evidence, the affected task, and a correction that addresses the cause at its necessary scope. Distinguish a weak concept from an implementation mismatch. State what was checked, in which conditions, and what remains unknown. Translate status labels naturally for the user while retaining the shared values when passing context. Apply R35.

Do not infer audience understanding, conversion improvement, universal usability, or complete accessibility from an agent walkthrough, a static review, or one automated result. When an audience question is material, use R34 in the evidence reference to select an appropriate optional method; do not require recruitment as a condition of progress.

Route a correction by cause using R36:

- Send a consequential unknown about the goal or required content to clarify-interface.
- Send an incomplete task path or unsuitable structure, interaction, or visual direction to plan-interface.
- Send behavior that conflicts with the accepted plan to build-interface.
- Send a specific missing artifact or state to inspect-interface.
- Send a consequential guidance gap, conflicting recommendation, or current platform question to research-interface. Apply R40.

Pass next as owner, question/action, and reason, together with the relevant finding and decision dependencies. Resolve sibling skills by name through the host catalog, selecting the same installed plugin and its catalog namespace when applicable, without assuming filesystem locations. If a sibling is unavailable, provide or perform the equivalent bounded next step within current authorization. Continue authorized corrections through the appropriate module; do not invent an approval checkpoint.

Finish a review-only request with the findings and proposed corrections. For authorized corrections, recheck the affected path and material dependent behavior. Preserve valid decisions and finish when the question is answered within the available evidence.

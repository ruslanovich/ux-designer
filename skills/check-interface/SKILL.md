---
name: check-interface
description: Verify an interface plan or implementation against a user task, expected behavior, and applicable platform guidance. Use to review the coherence of a proposed flow, check changed behavior after implementation, investigate an interaction discrepancy, or assess a specified property from screenshots or code. Cover websites and web apps in desktop or mobile browsers, native iOS, and Android. Report what the available evidence supports and route concrete corrections to the relevant design module.
---

# Check Interface

Check the stated question and the affected user path. Answer in the user's language and explain findings without requiring design terminology.

Use this skill independently or within design-interface. Reuse the accepted task and decisions; send structural redesign decisions to plan-interface instead of designing a replacement during verification. Exclude native desktop applications.

## Establish the check

1. Recover the goal, expected outcome, target platform, changed scope, and available artifact from the conversation or shared context. Distinguish mobile browser, native iOS, and native Android; identify iPadOS separately when relevant.
2. Reuse relevant brief, evidence, content, tasks, decisions, and previous checks. Keep fields optional and use existing prose, tables, or artifacts; do not require JSON, a new context file, or a standard questionnaire.
3. If invoked alone, formulate a small checkable question from the request. Ask only when a missing fact would materially change the expectation; otherwise state a bounded assumption and continue.
4. Record the expected property and its basis: an accepted decision, stated requirement, applicable normative criterion, or conditional platform guidance. Do not treat every difference from a reference as a defect.

Read [checks.md](references/checks.md) for the affected project, interaction, or platform property. Read [evidence-and-routing.md](references/evidence-and-routing.md) when the input is limited, the basis is conditional, a user-research question remains, or a finding needs a handoff.

## Select the available method

- For a plan, walk through the intended task and material exceptions. Check that required information, actions, transitions, and outcomes are represented. Report coherence and potential gaps, not actual user success. Apply R32.
- For screenshots, content, or code, inspect only properties that the material exposes. Keep hidden states and runtime behavior unresolved unless independently evidenced.
- For an accessible running interface, execute the affected path with supported tools in the authorized environment. Check the behavior changed by the work and the relevant consequence or exception. Apply R31 and R33.
- If execution is unavailable, finish the useful project or static review, identify the consequential unverified property, and describe a small feasible follow-up. Do not block all work or ask the user to perform a blanket audit.

Match breadth to the change. Expand only to resolve a concrete remaining discrepancy or a required project condition. Treat mock data, simulated responses, and isolated component previews as limits on the observed result.

## Preserve evidence and status

Carry forward stable decision and evidence IDs when present. For each material check, retain expectation, method, conditions, observation, and status; add the relevant R24–R36 rule ID and source or decision when useful for traceability.

- Use supported_in_conditions only for the property actually supported by the stated method and conditions.
- Use mismatch for an observed or demonstrable conflict with the applicable expectation; show the evidence and practical consequence.
- Use unverified when the check was not performed or the evidence is insufficient. Leave observation absent for a planned check; never write a predicted result as an observation.

Keep evidence statuses separate from check statuses. Use observed for inspected or executed evidence, reported for another person's account, hypothesis for an inference, decision for an adopted choice, and unknown for missing information. Scope an observed code or document property to that artifact rather than promoting it to observed runtime behavior.

## Return a useful result

Lead with the answer to the check question. Explain material findings, their evidence, the affected task, and the smallest useful correction. State what was checked, in which conditions, and what remains unknown. Translate status labels naturally for the user while retaining the shared values when passing context. Apply R35.

Do not infer audience understanding, conversion improvement, universal usability, or complete accessibility from an agent walkthrough, a static review, or one automated result. When an audience question is material, use R34 in the evidence reference to select an appropriate optional method; do not require recruitment as a condition of progress.

Route a correction by cause using R36:

- Send a consequential unknown about the goal or required content to clarify-interface.
- Send an incomplete task path or unsuitable organization to plan-interface.
- Send behavior that conflicts with the accepted plan to build-interface.
- Send a specific missing artifact or state to inspect-interface.

Pass next as owner, question/action, and reason, together with the relevant finding and decision dependencies. Resolve sibling skills by name through the host catalog, selecting the same installed plugin and its catalog namespace when applicable, without assuming filesystem locations. If a sibling is unavailable, provide or perform the equivalent bounded next step within current authorization. Continue authorized corrections through the appropriate module; do not invent an approval checkpoint.

After a correction, recheck the affected path and material dependent behavior. Preserve valid decisions and finish when the question is answered within the available evidence.

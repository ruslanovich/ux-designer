# Evidence, conclusions, and handoffs

## Match the conclusion to the input — R32, R33, R35

Use the strongest available evidence for the specific property. Keep a useful partial review when another method is unavailable.

| Input | Inspect | Preserve as unverified |
| --- | --- | --- |
| Idea, brief, or content | Inspect the stated outcome, relationships, and consistency of a proposed path. | Keep existing behavior, audience expectations, and execution outcomes unresolved. |
| Plan or prototype | Inspect represented transitions, required content, and material states. Execute only interactions actually supported. | Keep omitted behavior and production integration unresolved; identify simulated outcomes. |
| Screenshot | Inspect visible content, labels, grouping, and the pictured state. | Keep unseen states, return behavior, semantic roles, focus, and actual target bounds unresolved. |
| Code or markup | Inspect represented logic, configuration, and semantics; cite the artifact. | Keep actual behavior in unexecuted conditions unresolved. |
| Running interface | Observe selected actions and results in stated data, environment, and input conditions. | Keep other conditions and audience-level outcomes unresolved. |
| Another person's report | Preserve the account with reported evidence status and context. | Keep independent confirmation unresolved until performed. |

Do not treat a state absent from a screenshot as absent from the product. Treat a planned check as unverified, without an observation. Mark a proposed interpretation as hypothesis and an adopted expectation as decision.

## Record a finding — R35

Keep expectation, method, conditions, observation, and status together. Include relevant decision or evidence IDs and the applicable rule ID when available. Use existing prose or a compact table; require neither a fixed document nor every field for a trivial check.

- Use supported_in_conditions for a property demonstrated by the chosen method. State the scope, such as the inspected plan, source file, browser, viewport, entry point, data, or input method.
- Use mismatch for a supported conflict with an applicable expectation. Explain the affected task or lost capability; separate it from a preference or speculative audience reaction.
- Use unverified for missing evidence, inaccessible runtime, an unperformed check, or an unresolved hypothesis. Identify the consequential gap and a feasible next observation.

Separate the basis of an expectation:

| Basis | Interpret |
| --- | --- |
| Accepted requirement or decision | Compare against adopted intent; flag a contradiction or changed assumption. |
| WCAG criterion | Apply its exact conditions and scope. Identify the criterion; do not claim complete conformance from a subset. |
| Understanding, COGA, or APG | Use the informative explanation or pattern with its conditions. Do not label it an additional normative criterion. |
| Platform guidance | Establish platform, component role, and applicability. Treat a justified alternative as a design question rather than an automatic failure. |
| Our process | Use it to organize verification and handoffs. Do not attribute its exact steps or status schema to an external standard. |

Report the observed result and important uncertainty. Do not infer universal usability, audience comprehension, conversion gains, or complete accessibility from expert review or an agent walkthrough. Do not call successful compilation, a screenshot, or one automated result proof of user-task success.

## Address a remaining audience question — R34

State the specific uncertainty and how its answer would change the decision. Consider further research only for a material unresolved question; do not make it a standard prerequisite.

| Question | Consider | Preserve the limitation |
| --- | --- | --- |
| How does the audience group content? | Consider card sorting with relevant participants. | Do not treat the agent's grouping as user evidence. |
| Can people locate a destination in the hierarchy? | Consider tree testing. | Account for missing visual and interaction cues of the real interface. |
| Can people complete the task or understand a result? | Consider observation of realistic tasks with audience representatives. | Separate expert predictions from observed participant behavior. |
| Which alternative performs better for a defined outcome? | Consider comparable tasks, conditions, audience, and measures. | Do not infer causation or quantified improvement from an anecdote or unlike conditions. |

If participants or suitable evidence are unavailable, retain the hypothesis and continue feasible work. Do not impose a participant quota, require the user to recruit, or substitute a standard questionnaire for the unresolved question.

Use [Card Sorting vs. Tree Testing](https://www.nngroup.com/articles/card-sorting-tree-testing-differences/), [Usability (User) Testing 101](https://www.nngroup.com/articles/usability-testing-101/), and [Competitive Usability Evaluations](https://www.nngroup.com/articles/competitive-usability-evaluations/) as method guidance. Treat requesting additional evidence and formatting handoffs as our process.

## Route by cause — R31, R36

| Cause | Next owner | Pass |
| --- | --- | --- |
| An unknown goal, audience condition, or required content changes the expected outcome | clarify-interface | Pass the single material question, existing evidence, and affected decision. |
| Organization or sequence cannot support the task, or a material state was never designed | plan-interface | Pass the broken step, expected outcome, constraint, and dependency. |
| Intended behavior is clear but implementation differs | build-interface | Pass expected versus observed behavior, reproduction conditions, and relevant decision. |
| A particular artifact, state, or observation is missing | inspect-interface | Pass the precise missing material and the question it would resolve. |

Retain shared next fields: owner, question/action, and reason. Carry brief, evidence, content, tasks, decisions, and checks only as needed for continuity. Keep the full contract with design-interface; do not create a second required schema here.

Update affected assumptions and decisions after new evidence. Preserve unrelated valid work. Recheck the corrected path and material consequences without restarting the process. Finish the question when its result is supported within scope or the remaining limitation is explicit.

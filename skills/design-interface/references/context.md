# Shared working context

Use this contract when entering the workflow, handing off a module, or revising a material decision. Keep it in the existing conversation or the project's established design notes. Persist a separate document only when useful for the requested work. Use ordinary prose, tables, or structured data as appropriate; no field is an obligatory interview question.

## Context fields

| Field | Record only what matters |
|---|---|
| brief | Goal, audience, platform, requested endpoint, chosen change scope and reason, explicit boundaries |
| evidence | Statement, status, source or reason, inspected conditions, relevant coverage and research limits |
| content | Required information, entities, functions, permissions, relationships, and preservation constraints |
| tasks | Starting circumstance, actions, result, and significant exceptions |
| decisions | Coherent direction, choices, reasons, consequential alternatives, research effects, and dependencies |
| checks | Original problem or preserved capability, expected result, method, conditions, observation, and status |
| next | Owning module, specific question or action, and why it matters |

Use stable identifiers only where they help connect a decision to evidence or a check. Leave absent information unknown or omit it. Do not expand a small edit into a full product inventory.

The agent maintains this record. Topic coverage and research notes are not extra user questionnaires or mandatory documents. Retain only findings, sources, and decisions that matter to the next action. A broad redesign includes important visual decisions; a requested endpoint remains independent of its change scope. [R37–R40]

## Evidence status

- `observed`: Directly seen in a supplied artifact or performed in an accessible environment. Name the artifact or conditions. A visible claim in marketing copy is evidence that the claim is written there, not that it is true.
- `reported`: Said by the user or another identified source. Record who reports it and any relevant limits.
- `hypothesis`: An inference or working assumption with its reason and consequences.
- `decision`: A chosen future behavior, priority, or constraint. State who chose it when relevant.
- `unknown`: Information not established. Explain only consequential gaps.

Keep the status on substantive statements; a brief can contain more than one status. A client's target-audience choice is a decision, while assumptions about that audience remain hypotheses. An agent-generated journey does not reveal actual emotions, habits, or pain points. [R02–R03]

A professional publication supports what its author found or recommends under the reported conditions. Carry its source type, applicability, and limitations with the resulting design decision. Reading a case study does not establish the same audience behavior in this product. Reuse previously read evidence when it still answers the question. [R40]

## Checks and expected checks

Use `supported_in_conditions`, `mismatch`, or `unverified`.

A planned check has an expectation and method, but no observed outcome; keep it `unverified`. For an executed check, record what was actually observed and under which conditions. A source-code review, screenshot inspection, running-browser interaction, and participant study support different conclusions.

A failed behavior is a `mismatch` against a named expectation. An unavailable environment or missing observation stays `unverified`. Never convert unverified into supported because the intended code exists.

## Pass a delta

Before using a module, pass the current brief, relevant evidence and decisions, requested contribution, available materials, and access limitations. After it finishes:

1. Merge new observations, hypotheses, choices, and unresolved questions.
2. Preserve earlier answers and the evidence behind them.
3. Mark a revised assumption and identify affected decisions.
4. Revisit only those decisions and checks that depend on the change.
5. State the next useful action within the user's request.

Do not make the user restate their idea at each handoff. Do not require a module to recreate a correct brief or repeat an earlier inspection. [R04–R05, R36]

## Enough context to proceed

Proceed when the task, necessary content, likely path, platform constraints, and consequential unknowns can support a coherent next action. Missing minor details can remain explicit working assumptions. If a major ambiguity changes the result, ask one focused question with ordinary-language consequences.

For small work, the full context may fit in a paragraph. For a connected flow, include meaningful entry points, states, and dependencies. Use a wider journey only when it changes the product decisions.

## Basis

The shared schema and handoff process are this system's operational design, grounded in the user's requirements; they are not a validated universal design method. R01–R05 define these responsibilities.

- [Maria Rosala, Task Analysis](https://www.nngroup.com/articles/task-analysis/) supports reasoning from users' goals and work.
- [Kate Kaplan, Journey-Mapping Approaches](https://www.nngroup.com/articles/journey-mapping-approaches/) supports distinguishing research-based maps from assumption-based maps.
- [Indi Young, A New Way to Listen](https://alistapart.com/article/a-new-way-to-listen/) supports keeping interpretations separate from what a person actually says.

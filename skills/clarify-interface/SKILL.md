---
name: clarify-interface
description: Turn a rough interface idea or incomplete design request into a usable working brief through adaptive plain-language questions. Use when a user needs help describing what an app or website should achieve, inspection reveals consequential gaps, or scope and priorities require understandable options and a recommendation. Support people without design training, raw ideas, content drafts, existing apps, and references for browser interfaces, iOS, and Android.
---

# Clarify Interface

Develop the working understanding yourself and ask only for information or choices that materially affect it. Answer in the user's language. Let the user describe their activity and desired outcome without design terminology. Accept a raw idea without requiring a brief, persona, scenario, or journey map. [R01, R03, R08]

Read [references/interview.md](references/interview.md) when framing a difficult question, separating facts from choices, or deciding whether to continue with an assumption.

## Continue the shared context

Reuse the leader's record and all previous answers. When invoked independently, use the same compact record in the conversation. Add useful fields as needed; do not require JSON, make the user fill a template, or create a document by default. [R05]

- **brief:** goal, audience, platform, requested endpoint, proposed change scope, constraints.
- **evidence:** id, statement, status, source.
- **content:** information, objects, and capabilities.
- **tasks:** trigger, steps, outcome, material exceptions.
- **decisions:** id, choice, why, depends_on.
- **checks:** expectation, method, conditions, observation, status.
- **next:** owner, question or action, reason.

Use evidence statuses `observed`, `reported`, `hypothesis`, `decision`, and `unknown`. Use check statuses `supported_in_conditions`, `mismatch`, and `unverified`. Retain existing IDs and representation; add stable IDs where useful for dependencies. Attribute the user's account as `reported` and keep it distinct from direct observation. [R02, R05, R35]

## Form a working interpretation

Infer a provisional goal, audience, starting situation, main actions, desired outcome, and material exceptions from the request and materials. Identify platform and scope when known. Mark inferred details as hypotheses. Explain the consequential interpretation briefly so the user can correct it; do not add an approval gate. [R02, R03, R04]

Recommend a proportionate scope: a fragment, connected scenarios, or the product's structure. Keep it separate from whether the user wants an audit, plan, or implementation. Consider a wider journey when waiting, other channels, or handoffs matter. Translate ordinary language into scenarios and structure yourself; do not ask the user to select internal design categories. [R03, R10, R37]

Identify uncertainties that would change the main scenario, required content, visual direction, structure, or a material constraint. Inspect accessible facts and research professional guidance through the relevant modules before asking the user to supply them. Keep consequential product decisions with the user. Ask in short adaptive rounds; skip known answers and immaterial questions. Do not impose a universal question count or exhaustive questionnaire. [R08, R40]

## Obtain facts neutrally

For a current process, existing audience, available data, or binding constraint, ask in concrete everyday language. Offer neutral possibilities when useful, preserve a free answer, and allow “I don't know.” Let the user describe a mixture or a missing case. Clarify an ambiguous phrase when its meaning would change the design. [R09]

Do not recommend a factual answer. Recommend a way to find missing information or a clearly labeled temporary design assumption when useful. Keep unknown facts unknown even if a provisional direction is accepted. Selecting a target audience does not establish that audience's behavior. [R02, R09]

## Help choose future priorities

When a consequential priority, scope, or tradeoff belongs to the user, offer understandable alternatives and their practical consequences. Recommend a suitable option and explain its basis in the goal, constraints, or evidence. Name any weak assumption behind the recommendation. [R10]

Preserve a free answer and the ability to combine ideas or delegate the working choice to the agent. Keep ordinary design and technical decisions with the agent; do not require choices between unfamiliar component names. Record an accepted direction as a project decision and keep its predicted benefit as a hypothesis. [R02, R10]

Use a question interface only when it preserves the relevant answer paths. If it forces a recommended factual answer or removes a necessary free response, ask conversationally. Treat tool-specific limits as interaction constraints rather than a prescribed interview length. [R09, R10]

## Recognize sufficient context

Proceed when you can describe a workable outcome, audience, key scenario, required content, relevant platform, and material constraints, with remaining uncertainties attached to explicit assumptions. Permit these descriptions to be provisional. Do not treat missing fields or incomplete confidence as automatic blockers. [R03, R08]

For a gap that changes the main scenario or mandatory content, seek a focused answer or propose a bounded working direction and explain the dependency. If the user does not know or delegates the choice, continue within the authorized scope where possible. Do not fabricate a factual answer or treat silence as an accepted decision. [R02, R04, R08, R09, R10]

Summarize the consequential understanding and continue the work already requested. Do not wait for confirmation of every answer, inference, or transition. Respect explicit stage boundaries and keep an interview-only request within scope. [R04]

## Pass forward the result

Update the existing record with the brief, scenario, content, constraints, choices, assumptions, and consequential unknowns. Explain each significant remaining unknown through the decision it affects. Keep the next action specific. [R05, R08]

For standalone clarification, return a concise working brief and next action. Within an authorized broader workflow, carry the context into planning without making the user restart or repeat answers. Revisit only the dependency affected by new information. [R04, R05, R36]

Check that each question had a design consequence, factual questions stayed neutral, significant choices allowed a free answer, and assumptions retained their status. Describe the result as a working task model; do not claim that the interview established audience behavior, conversion gains, or an optimal interface. [R02, R08, R09, R10, R35]

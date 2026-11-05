---
name: inspect-interface
description: Inspect interface quality, content, capabilities, and constraints from an existing app, code, screenshots, references, drafts, or notes. Use before redesign, for an interface audit, to examine visual or interaction problems, to organize supplied content, or to compare reference fragments. Cover structure, interaction, visual organization, consistency, and relevant use conditions in browser interfaces, iOS, and Android. Support incomplete inputs and standalone analysis.
---

# Inspect Interface

Turn available material into a grounded working context. Answer in the user's language and ordinary terms. Continue the current conversation and respect the requested scope. Inspect without changing the product merely because changes appear useful. [R01, R04, R06]

Read [materials](references/materials.md) when interpreting mixed inputs, establishing source limits, or comparing reference fragments. Use [quality coverage](references/quality-coverage.md) for a broad inspection, redesign diagnosis, or a gap outside the initially selected topic. [R38]

## Reuse the working context

Reuse the leader's record and previous answers. When called independently, use the same compact record in the conversation. Add only useful fields; do not require JSON, create a document by default, or ask the user to maintain the record. [R05]

- **brief:** goal, audience, platform, requested result, proposed change scope, constraints.
- **evidence:** id, statement, status, source.
- **content:** information, objects, and capabilities.
- **tasks:** trigger, steps, outcome, material exceptions.
- **decisions:** id, choice, why, depends_on.
- **checks:** expectation, method, conditions, observation, status.
- **next:** owner, question or action, reason.

Use evidence statuses `observed`, `reported`, `hypothesis`, `decision`, and `unknown`. Use check statuses `supported_in_conditions`, `mismatch`, and `unverified`. Retain existing IDs and representation; add stable IDs where useful for dependencies. [R02, R05, R35]

## Establish the available evidence

1. Identify the requested outcome and available inputs. Treat raw ideas and text-only requests as sufficient to begin. If no inspectable artifact exists, form an initial reading and pass forward consequential uncertainties. Do not require an app, mockup, persona, or journey map. [R01]
2. Inspect the task-relevant parts with available tools and access, following their instructions. Keep missing access as a specific limitation and continue useful work on accessible material. [R04, R06]
3. Distinguish the existing product, proposed future experience, and external references. Identify the platform when known; label inferred audiences, purposes, and platforms as hypotheses. [R02, R03, R24]
4. Inspect representative rendered screens and states when accessible and within scope. Include content density, long labels, errors, empty states, and viewport or input conditions that could materially change the design. Use code to clarify behavior and constraints. Keep screenshot observation, executed interaction, source inference, and uninspected states distinct. [R02, R06, R35]

## Diagnose the appropriate scope

For a broad request, survey the applicable areas in [quality coverage](references/quality-coverage.md) before narrowing the investigation. Identify concrete concerns and useful strengths across the task, content, structure, interaction, visual organization, consistency, and use conditions. Deepen the areas that affect the outcome; a small correction needs its relevant dependencies only. [R38]

Connect related findings and propose whether the problem needs a local correction, a screen or connected flow, or a change to product structure. Explain why that scope could address the priority problems. Readability, composition, visual hierarchy, consistency, and the requested visual direction are valid reasons to redesign. Keep a design judgment distinct from a claim about actual user behavior. [R02, R37]

Use research-interface for a bounded orientation on broad redesigns or unfamiliar domains, and for consequential questions beyond the available guidance. Reuse equivalent evidence already read; confidence alone does not remove a research trigger. Resolve modules through the host catalog within the same plugin namespace, honor disablement, and use only available permitted research tools. Carry a missing research capability as a specific evidence limit and continue supported inspection. [R40]

## Extract content and capabilities

Capture the information units, entities, relationships, actions, entry points, and constraints needed for the task. Treat copy, notes, and example data as full design input. Preserve required meaning and attribute claims to their material rather than treating them as independently established facts. [R06]

Form a tentative account of who acts, what starts the task, the main actions, and the desired outcome. Mark unsupported priorities and steps as hypotheses. Extend the account to other channels, waiting, or participants only when relevant. [R03]

For redesign, record needed capabilities, information, permissions, and other material constraints before proposing relocation. Include relevant infrequent functions and expert operations. Keep capabilities with unknown purpose in the preservation record until understood or justifiably excluded within the request. Identify useful existing decisions and their purpose; carry location and presentation forward as choices planning can reconsider. [R22]

Separate symptoms from explanations. Record the observed duplicate labels before suggesting that they may hinder distinction. Do not claim that people are confused without corresponding evidence. [R02, R35]

## Interpret reference fragments

Identify each significant fragment, its apparent task, structural role, observed behavior, and platform. Clarify what the user values when that preference would materially change the interpretation and cannot reasonably be inferred. [R07, R24]

Compare the reference with the target task, content, relationships, and environment. Explain candidate transfers and relevant limitations. Keep observed reference behavior separate from proposed target behavior. Treat popularity and visual appeal as insufficient evidence of usability. [R07]

When combining references, surface incompatible terminology, navigation levels, or interaction assumptions. Carry the conflict to the relevant design decision instead of silently treating the combination as settled. [R07]

## Hand off a useful result

Check that significant findings point to actual material or explicit assumptions. Check that needed functions and information are represented, unknown states remain unknown, and significant reference transfers have a rationale. [R02, R06, R07, R22]

Update the existing record with prioritized findings, strengths, proposed change scope and reasons, source boundaries, preservation needs, reference opportunities, and decision-relevant gaps. State what was actually inspected and what remains unverified. Keep the handoff proportionate; naming a quality area does not establish that it was examined. [R05, R35, R38]

For standalone inspection, return findings and the next useful action. Within an authorized broader workflow, pass the update to clarification only when a consequential gap remains; otherwise continue to planning. Do not require approval of each finding, repeat answered questions, or expand inspection-only work into implementation. [R04, R05, R36]

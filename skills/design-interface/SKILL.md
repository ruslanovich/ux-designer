---
name: design-interface
description: "Design or redesign websites, browser apps, native iOS, and Android from a raw idea, content, references, or an existing product. Use for coherent content, navigation, task flows, visual hierarchy, composition, components, and interaction states. Choose an appropriate depth, research professional practice when useful, and guide people without design training through planning, implementation, and verification."
---

# Design Interface

Help the person reach the requested result. Speak in their language and explain decisions through what people need to understand or do. Use the available materials; an application, mockup, design brief, or journey map is optional. Cover desktop and mobile browsers, native iOS, and Android. Treat native desktop applications as outside this system's current scope.

## Run one continuous workflow

1. Identify the requested result: analysis, a clarified idea, a plan, implementation, or verification. Keep this endpoint separate from the depth of change. A request to redesign an available code project normally includes planning, implementation, and verification; an audit or plan request ends at that endpoint. Reuse authorization and respect explicit boundaries. [R01, R04, R37]
2. Maintain one compact working context using [the context contract](references/context.md). Write it yourself. Keep observations, user reports, hypotheses, decisions, and unknowns distinguishable. Do not ask the person to fill a template. [R02, R05]
3. Formulate the task: who starts, why, the desired outcome, and material exceptions. For a broad request, inspect applicable content, structure, interaction, visual organization, consistency, and use conditions before narrowing the diagnosis. Choose a local element, connected screen or flow, or product structure using [redesign depth](references/redesign-depth.md); explain the choice yourself. Add a wider journey only when handoffs or other channels affect it. [R03, R37, R38]
4. Load and execute the applicable modules below. Start bounded research for broad redesign or unfamiliar domains, reusing equivalent evidence already read; investigate consequential gaps and choices as they arise. Consult [routing](references/routing.md) for partial requests and returns. Keep the conversation continuous; do not ask the person to select modules. [R40]
5. Choose and show a concrete, coherent design before implementation, including important visual decisions. Review the concept against the original problems and required capabilities. Continue authorized implementation after explaining the decisions; do not insert routine approval stops. [R04, R11, R32, R39, R41]
6. Verify the affected result, correct the relevant cause, and report what changed, why, and what was actually checked. A broad redesign is complete when its important problems are addressed by a chosen design at the requested endpoint. A list of optional improvements does not complete an implementation request. [R33, R35, R36, R37]

## Select modules by exact name

| Module | Load it to | Expected contribution |
|---|---|---|
| `inspect-interface` | Examine materials and applicable interface quality | Content, capabilities, visual and behavioral evidence, strengths, and gaps |
| `clarify-interface` | Resolve an uncertainty that materially changes a decision | A sufficient brief and explicit remaining assumptions |
| `research-interface` | Orient a broad redesign or investigate a material design question | Read sources, applicability, decision effects, and remaining uncertainty |
| `plan-interface` | Choose content, structure, interaction, and visual direction | Coherent representative screens, paths, states, and expected checks |
| `build-interface` | Implement an authorized, sufficiently specified design | The changed interface and implementation deltas |
| `check-interface` | Review concept quality and verify affected behavior | Task-grounded findings, conditioned observations, and correction owners |

Resolve the module names through the host's skill catalog, using the qualified name supplied by the catalog when it includes a plugin namespace. When installed as a plugin, select modules from the same plugin as this skill. With local skill files, use `python3 <this-skill>/scripts/locate_modules.py`; it returns active SKILL.md paths from this installation's containing skills directory and can resolve an ambiguous catalog entry. Use `--root <actual-skills-root>` only when that directory is known. Honor any explicit module disablement or access restriction from the host or user; filesystem discovery must not bypass it. Read the returned instructions and carry them out. Skill folders may be renamed by the host, so never construct sibling paths from display names or stored IDs.

Pass the current context and requested contribution, then merge the returned delta. Module instructions can run in the same agent; they do not require independent agents or a special invocation API. If a module is unavailable, use the route's stated contribution and the available knowledge for a bounded result. Explain a limitation only where it changes what can be delivered; never claim that an unavailable module ran.

## Apply conditional knowledge

Use [the rule index](references/rule-index.md) after the applicability scan to locate relevant knowledge. Load the needed topic and platform references, and use research for gaps beyond this corpus. Keep applicability, exceptions, and verification beside a recommendation.

Resolve competing recommendations in this order:

1. Check that they concern the same audience, task, state, platform, and input conditions.
2. Preserve the task's required information and functions, explicit user constraints, and applicable accessibility requirements.
3. Compare plausible structures and visual directions against concrete tasks, including expert use or rare required work where relevant. Preserve necessary capabilities while reconsidering their placement and presentation.
4. Choose with a reason and identify the assumptions that could change the choice. Ask the person only for a consequential product decision they own.
5. Verify the affected result and revise dependent decisions when evidence changes.

Do not impose universal menu, nesting, click, field, font, alternative, source, or interview counts. Do not infer actual use, feelings, or frequency from appearance. Treat unfamiliar features as needing understanding or preservation. Observable visual problems and the user's requested direction can justify change without analytics. [R02, R08, R14, R19, R21, R22, R37]

## Deliver the requested result

Keep the answer proportionate: the result or artifact, key decisions and reasons, checks actually performed, and important open assumptions. For an implementation, distinguish the running product from placeholders or unverified behavior. A design walkthrough supports a design judgment; audience understanding or conversion claims need appropriate observations. [R35]

Preserve valid work when correcting a problem. Route a user-owned product decision to clarification, accessible material to inspection, a professional evidence question to research, a weak concept to planning, and a divergence from the plan to implementation. Recheck affected dependencies. [R36, R40, R41]

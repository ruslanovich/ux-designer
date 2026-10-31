---
name: design-interface
description: "Coordinate interface design and redesign from a raw idea, content notes, references, or an existing product. Use for organizing content, navigation, nesting, task flows, forms, collections, and interaction states in websites, browser apps, native iOS, and Android. Guide people without design training through the relevant inspection, clarification, planning, implementation, and verification modules."
---

# Design Interface

Help the person reach the requested result. Speak in their language and explain decisions through what people need to understand or do. Use the available materials; an application, mockup, design brief, or journey map is optional. Cover desktop and mobile browsers, native iOS, and Android. Treat native desktop applications as outside this system's current scope.

## Run one continuous workflow

1. Identify the requested result and its boundary: analysis, a clarified idea, a plan, implementation, or verification. Reuse prior authorization and decisions. A request to build normally includes proportionate planning and verification; a request for an audit ends with an audit. Respect explicit stage gates. [R01, R04]
2. Maintain one compact working context using [the context contract](references/context.md). Write it yourself. Keep observations, user reports, hypotheses, decisions, and unknowns distinguishable. Do not ask the person to fill a template. [R02, R05]
3. Formulate the target task: who starts, why, what they need to do, the result, and material exceptions. Select a fragment, related tasks, or product structure according to the problem. Add a wider journey only when waiting, other channels, or handoffs affect the interface. Treat an inferred journey as a model. [R03]
4. Load and execute only the applicable modules below. Consult [routing](references/routing.md) for partial requests, handoffs, or returns. Keep the conversation continuous; do not ask the person to select internal modules.
5. Show a proportionate design before changing the interface. Continue authorized implementation after explaining the key decisions; do not insert routine approval stops. [R04, R11, R32]
6. Check the changed path, repair the relevant cause, and report what changed, why, and what was actually verified. Stop when the requested result has been delivered and material unresolved issues are identified. [R33, R35, R36]

## Select modules by exact name

| Module | Load it to | Expected contribution |
|---|---|---|
| `inspect-interface` | Examine useful supplied materials or an existing interface | Content, capabilities, reference intent, evidence, and gaps |
| `clarify-interface` | Resolve an uncertainty that materially changes a decision | A sufficient brief and explicit remaining assumptions |
| `plan-interface` | Create or revise structure and interaction before implementation | Content placement, paths, states, decisions, and expected checks |
| `build-interface` | Implement an authorized, sufficiently specified design | The changed interface and implementation deltas |
| `check-interface` | Review a plan or verify affected behavior | Conditioned observations, findings, and targeted next actions |

Resolve the module names through the host's skill catalog, using the qualified name supplied by the catalog when it includes a plugin namespace. When installed as a plugin, select modules from the same plugin as this skill. With local skill files, use `python3 <this-skill>/scripts/locate_modules.py`; it returns active SKILL.md paths from this installation's containing skills directory and can resolve an ambiguous catalog entry. Use `--root <actual-skills-root>` only when that directory is known. Honor any explicit module disablement or access restriction from the host or user; filesystem discovery must not bypass it. Read the returned instructions and carry them out. Skill folders may be renamed by the host, so never construct sibling paths from display names or stored IDs.

Pass the current context and requested contribution, then merge the returned delta. Module instructions can run in the same agent; they do not require independent agents or a special invocation API. If a module is unavailable, use the route's stated contribution and the available knowledge for a bounded result. Explain a limitation only where it changes what can be delivered; never claim that an unavailable module ran.

## Apply conditional knowledge

Use [the rule index](references/rule-index.md) to locate the relevant knowledge owner. Load only the task's topic and platform references. Keep applicability, exceptions, and verification beside a design recommendation.

Resolve competing recommendations in this order:

1. Check that they concern the same audience, task, state, platform, and input conditions.
2. Preserve the task's required information and functions, explicit user constraints, and applicable accessibility requirements.
3. Compare the candidate structures against concrete tasks, including expert use or rare required work where relevant.
4. Choose with a reason and identify the assumptions that could change the choice. Ask the person only for a consequential product decision they own.
5. Verify the affected result and revise dependent decisions when evidence changes.

Do not impose a universal number of menu items, nesting levels, clicks, fields per page, visible records, or interview questions. Do not infer actual use, feelings, or frequency from an interface's appearance. Treat unfamiliar features as needing understanding or preservation. [R02, R08, R14, R19, R21, R22]

## Deliver the requested result

Keep the answer proportionate: the result or artifact, key decisions and reasons, checks actually performed, and important open assumptions. For an implementation, distinguish the running product from placeholders or unverified behavior. A design walkthrough supports a design judgment; audience understanding or conversion claims need appropriate observations. [R35]

Preserve valid work when correcting a problem. Return a missing fact to clarification, missing evidence to inspection, a structural gap to planning, and a divergence from the plan to implementation. Recheck the affected path. [R36]

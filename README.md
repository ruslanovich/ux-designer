# UX Designer

**Turn a rough idea or an existing product into a clearer interface.**

UX Designer is a set of seven connected skills for Claude Code and Codex. It helps choose the right redesign scope, research relevant professional guidance, and develop a coherent interface across content, navigation, interactions, and visual organization. It can then implement and check the result. Start with an idea, an app, screenshots, references, or content notes. You can describe the problem in everyday language.

Supports websites, browser apps, and native iOS and Android interfaces. The agent responds in your language. Repository documentation and packaged instructions are in English.

> **0.2.0 development candidate:** this branch contains the unreleased seven-skill package. The ordinary remote installation commands below select the published release on `main`, currently 0.1.0 with six skills. To test this iteration, follow [the candidate installation instructions](docs/evaluation-report.md#trying-the-candidate).

## Install once, use across projects

### Claude Code

Run in your terminal:

```sh
claude plugin marketplace add ruslanovich/ux-designer
claude plugin install ux-designer@ux-designer-marketplace --scope user
```

Start a new session in your project, or run `/reload-plugins` in an existing one. Then type:

```text
/ux-designer:design-interface Redesign this app around what people need to understand and do.
```

### Codex CLI

Run in your terminal:

```sh
codex plugin marketplace add ruslanovich/ux-designer
codex plugin add ux-designer@ux-designer-marketplace
```

Start a new session in your project. Type `$` and select the packaged skill, or open `/skills`:

```text
$ux-designer:design-interface Redesign this app around what people need to understand and do.
```

### Codex IDE extension or standalone skills

The Codex IDE extension currently uses standalone skills. This route also works in Codex CLI and Claude Code and gives you the shorter command name.

Requires Git and Python 3.10 or newer:

```sh
git clone https://github.com/ruslanovich/ux-designer.git
cd ux-designer
python3 scripts/install.py --target codex
```

Use `$design-interface` in Codex. For Claude Code, install with `--target claude` and invoke `/design-interface`. `--target both` installs both sets.

The installer copies all seven skills into your user-level skills directory. Re-running it updates its own unchanged installations, including adding the research module to a 0.1.0 installation. It checks ownership and local edits before replacing files. Use `--dry-run` to preview changes.

Choose one installation method per client to avoid duplicate skills. See [installation, updates, and removal](docs/installation.md) for all options.

## What happens when you run it

1. **Inspect useful materials.** Identify the content, capabilities, constraints, visual organization, and intent behind reference examples. For a broad request, scan the relevant areas before deciding where to investigate further. This step is optional when you only have an idea.
2. **Clarify the task.** Ask consequential questions in plain language, suggest options with a recommendation, and accept your own answer.
3. **Research relevant decisions.** For broad redesigns, unfamiliar domains, or material gaps, read applicable professional sources when browsing is available. Explain how their findings affect the task; reuse suitable evidence already read.
4. **Plan the interface.** Choose an appropriate scope and coherent direction. Resolve content placement, navigation, user paths, visual hierarchy, composition, and significant states before implementation.
5. **Implement authorized changes.** Complete the selected design in the project and platform, preserving required capabilities, data, and constraints.
6. **Check the concept and result.** Review whether the design addresses the original problems, then verify affected behavior and visual decisions in the implementation. Report the evidence and route corrections to their cause.

The workflow adapts to your request. You can ask for an audit, planning only, a focused change, or a complete implementation. Research can be called during inspection, planning, or review. The agent recommends redesign depth in plain language and keeps it separate from the requested endpoint. Explicit stage boundaries are respected; already authorized work continues without routine approval stops.

## Example requests

After the main skill command, try:

- "People keep getting lost between projects, tasks, and settings. Inspect this app and propose a clearer structure before changing code."
- "This prototype feels unfinished. Redesign and implement its key screens, including layout, typography, hierarchy, and interactions. Keep the existing capabilities."
- "I want a simple app for tracking shared household expenses. I only have the idea; help me work out what the interface needs."
- "Turn these notes into a landing-page structure. Explain the order of sections and what each section should help a visitor understand."
- "Use the filtering interaction from this reference and the detail page from that one. Explain how they fit our users' task."
- "Review this checkout flow, including validation, loading, and recovery from errors. Keep this run to analysis."

## Modules

Use **`design-interface`** as the normal entry point. The coordinator loads the relevant specialists and carries one working context between them.

| Skill | Purpose |
| --- | --- |
| [design-interface](skills/design-interface/SKILL.md) | Choose scope, coordinate the workflow, and preserve context |
| [inspect-interface](skills/inspect-interface/SKILL.md) | Examine materials, applicable quality areas, and existing capabilities |
| [clarify-interface](skills/clarify-interface/SKILL.md) | Establish a usable brief with adaptive questions |
| [research-interface](skills/research-interface/SKILL.md) | Connect professional evidence to the current design question |
| [plan-interface](skills/plan-interface/SKILL.md) | Design structure, content, interactions, visual direction, and states |
| [build-interface](skills/build-interface/SKILL.md) | Implement the selected design in the project |
| [check-interface](skills/check-interface/SKILL.md) | Review concept quality and verify the implemented result |

Specialists remain available for explicit use. The coordinator is the intended starting point for people without design training.

## Design knowledge and scope

The [rule index](skills/design-interface/references/rule-index.md) connects 41 conditional rules to focused reference files. Recommendations consider the task, audience, platform, evidence, and exceptions. The package avoids fixed limits on menu items, nesting, clicks, or form fields.

Supporting references link to professional design research and practice, platform guidance from Apple and Google, and accessibility standards. They record sources alongside the relevant decisions. Third-party articles remain on their publishers' sites.

Planning covers visual organization alongside structure and interaction. Broad redesigns should produce a concrete chosen solution for the relevant screens and states. Necessary functions and constraints remain explicit while their layout and presentation can change.

Native desktop applications are outside the current scope. Browsing, rendering, and native execution depend on the tools available in your coding agent; UX Designer adds no required service or API key. When a capability is unavailable, the agent completes the supported work and identifies the relevant limit. An agent review alone does not establish improved usability or conversion.

## Development

See [development and validation](docs/development.md) for package checks, client integration, behavioral evaluation, and archive creation. Current package version: **0.2.0**.

Contributions are welcome through issues and pull requests. Include the user task, relevant constraints, observed behavior, and a reproducible example. Use synthetic or anonymized project material.

## License

[MIT](LICENSE). The license covers this repository's original instructions, scripts, and assets. Linked third-party materials retain their own terms.

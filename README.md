# UX Designer

**Turn a rough idea or an existing product into a clearer interface.**

UX Designer is a set of six connected skills for Claude Code and Codex. It helps organize content, navigation, nesting, forms, collections, and task flows, then implement and check the result. Start with an idea, an app, screenshots, references, or content notes. You can describe the problem in everyday language.

Supports websites, browser apps, and native iOS and Android interfaces. The agent responds in your language. Repository documentation and packaged instructions are in English.

## Install once, use across projects

### Claude Code

Run in your terminal:

```sh
claude plugin marketplace add ruslanovich/ux-designer
claude plugin install ux-designer@ux-designer-marketplace --scope user
```

Start a new session in your project, or run `/reload-plugins` in an existing one. Then type:

```text
/ux-designer:design-interface Help me improve the navigation in this app.
```

### Codex CLI

Run in your terminal:

```sh
codex plugin marketplace add ruslanovich/ux-designer
codex plugin add ux-designer@ux-designer-marketplace
```

Start a new session in your project. Type `$` and select the packaged skill, or open `/skills`:

```text
$ux-designer:design-interface Help me improve the navigation in this app.
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

The installer copies all six skills into your user-level skills directory. Re-running it updates its own unchanged installations. It checks ownership and local edits before replacing files. Use `--dry-run` to preview changes.

Choose one installation method per client to avoid duplicate skills. See [installation, updates, and removal](docs/installation.md) for all options.

## What happens when you run it

1. **Inspect useful materials.** Identify the content, capabilities, constraints, and intent behind reference examples. This step is optional when you only have an idea.
2. **Clarify the task.** Ask consequential questions in plain language, suggest options with a recommendation, and accept your own answer.
3. **Plan the interface.** Explain content placement, navigation, user paths, interaction states, and the reasoning before implementation.
4. **Implement authorized changes.** Work within the project and platform, preserving required capabilities and valid existing work.
5. **Check the result.** Walk through affected tasks, report actual evidence, and route corrections to the appropriate step.

The workflow adapts to your request. You can ask for an audit, planning only, a focused change, or a complete implementation. Explicit stage boundaries are respected; already authorized work continues without routine approval stops.

## Example requests

After the main skill command, try:

- "People keep getting lost between projects, tasks, and settings. Inspect this app and propose a clearer structure before changing code."
- "I want a simple app for tracking shared household expenses. I only have the idea; help me work out what the interface needs."
- "Turn these notes into a landing-page structure. Explain the order of sections and what each section should help a visitor understand."
- "Use the filtering interaction from this reference and the detail page from that one. Explain how they fit our users' task."
- "Review this checkout flow, including validation, loading, and recovery from errors. Keep this run to analysis."

## Modules

Use **`design-interface`** as the normal entry point. The coordinator loads the relevant specialists and carries one working context between them.

| Skill | Purpose |
| --- | --- |
| [design-interface](skills/design-interface/SKILL.md) | Coordinate the workflow and preserve context |
| [inspect-interface](skills/inspect-interface/SKILL.md) | Understand supplied materials and the existing product |
| [clarify-interface](skills/clarify-interface/SKILL.md) | Establish a usable brief with adaptive questions |
| [plan-interface](skills/plan-interface/SKILL.md) | Design structure, content, interactions, and states |
| [build-interface](skills/build-interface/SKILL.md) | Implement the selected design in the project |
| [check-interface](skills/check-interface/SKILL.md) | Verify affected tasks and identify concrete corrections |

Specialists remain available for explicit use. The coordinator is the intended starting point for people without design training.

## Design knowledge and scope

The [rule index](skills/design-interface/references/rule-index.md) connects 36 conditional rules to focused reference files. Recommendations consider the task, audience, platform, evidence, and exceptions. The package avoids fixed limits on menu items, nesting, clicks, or form fields.

Supporting references link to professional design research and practice, platform guidance from Apple and Google, and accessibility standards. They record sources alongside the relevant decisions. Third-party articles remain on their publishers' sites.

Native desktop applications are outside the current scope. Visual styling can be developed during implementation; the workflow starts with what people need to understand and accomplish. Verification depends on the project and tools available: an agent review alone does not establish improved usability or conversion.

## Development

See [development and validation](docs/development.md) for package checks, installer tests, and archive creation. Current package version: **0.1.0**.

Contributions are welcome through issues and pull requests. Include the user task, relevant constraints, observed behavior, and a reproducible example. Use synthetic or anonymized project material.

## License

[MIT](LICENSE). The license covers this repository's original instructions, scripts, and assets. Linked third-party materials retain their own terms.

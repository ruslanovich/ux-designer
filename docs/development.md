# Development and validation

## Repository structure

| Location | Purpose |
| --- | --- |
| `skills/` | Shared instructions, conditional references, icons, and module locator |
| `plugin.json` | Portable Agent Plugins manifest and OpenAI presentation metadata |
| `.claude-plugin/plugin.json` | Claude Code manifest |
| `.codex-plugin/plugin.json` | Compatibility manifest for Codex clients using that format |
| `.claude-plugin/marketplace.json` | Claude Code catalog pointing to this repository's root |
| `.agents/plugins/marketplace.json` | Codex catalog pointing to this repository's root |
| `scripts/install.py` | Standalone installation, update, and removal |
| `scripts/validate.py` | Offline package consistency and module-discovery checks |
| `scripts/build.py` | Reproducible installable plugin archive |
| `tests/` | Installer lifecycle and six-to-seven-module migration checks with temporary home directories |
| `evals/` | Synthetic tasks, isolated-run preparation, and evaluator-only acceptance guidance |

The seven skills share a single content tree. Their frontmatter names remain unqualified. A client may add the `ux-designer:` namespace when loading them as a plugin.

## Run checks

Use Python 3.10 or newer. From the repository root:

```sh
python3 -m venv .venv
```

Activate the environment with the command appropriate to your shell, then:

```sh
python3 -m pip install -r requirements-dev.txt
python3 scripts/validate.py
python3 -m unittest discover -s tests -v
```

PyYAML is a development dependency for metadata validation. The installed workflow helper and standalone installer only use the Python standard library.

The validator checks package identity, synchronized versions, catalog paths, required skills, metadata, bundled references, content hygiene, and module discovery. Installer tests exercise temporary homes, conflicts, local edits, updates, removal, and rollback.

The migration tests run the exact published 0.1.0 installer from `tests/fixtures/v0.1.0/install.py` against a minimal six-skill package, then upgrade with the current installer. The installer fixture is pinned to its original commit and checksum in `tests/test_install.py`. Its skill payloads are synthetic and exercise the ownership format and folder lifecycle. The tests cover adding the seventh module, preserving user edits, preventing partial updates when a new-module destination conflicts, and restoring the six-module installation after a replacement failure.

These checks establish package integrity and installation behavior in the tested environment. They do not exercise a model-based design task or authenticate to either client.

## Test the standalone installation

Use a separate directory for an isolated smoke test:

```sh
python3 scripts/install.py --target both --home /path/to/temporary-home
python3 /path/to/temporary-home/.agents/skills/design-interface/scripts/locate_modules.py
python3 scripts/install.py --target both --home /path/to/temporary-home --uninstall
```

Use a test path you control. `--home` only chooses this installer's destinations; it does not reconfigure either coding client.

## Test native loading

For Claude Code, validate both manifests and test the plugin locally:

```sh
claude plugin validate .claude-plugin/plugin.json
claude plugin validate .claude-plugin/marketplace.json
claude --plugin-dir .
```

Inside that session, invoke `/ux-designer:design-interface` on a small sample project. For Codex, register a local checkout using `codex plugin marketplace add .`, then use the installation command in [the installation guide](installation.md). Native installation affects your client's plugin configuration; the Python unit tests do not perform it.

Check that all seven modules are discoverable and the coordinator reads the selected module from this package. Record the actual client and version. A plugin appearing in a list establishes discovery; invocation and module loading need their own observations.

## Evaluate design behavior

Keep three forms of validation distinct:

| Layer | Evidence |
| --- | --- |
| Package and installation | Metadata checks, locator results, archive contents, and installer lifecycle outcomes |
| Client integration | Actual discovery, invocation, and module loading in the stated client version |
| Agent behavior | Completed task artifacts and observations under the stated prompt, materials, model, and tools |

Use a frozen baseline and candidate with the same starting project, prompt, user answers, tools, and resource limits. Start each run in a fresh workspace and conversation. Give the execution agent the ordinary task and its materials; keep evaluator expectations, the suspected defect, and previous runs' outputs out of that context.

Evaluate whether the result addresses the priority problems at the right depth, forms a coherent design, preserves required capabilities, and completes the requested endpoint. Research should connect a source actually read to a current decision and its limits. Include controls for a small correction on a good interface and a request for audit only. Also check a weak concept whose implementation follows its plan correctly.

Retain observable traces and artifacts: loaded modules when visible, inspected states, opened sources, meaningful questions, selected scope, implementation changes, and checks performed. A short decision rationale is enough; private chain-of-thought is not required. Separate expected results from observations and record unavailable checks as unverified.

Repeat the important cases to investigate consistency, and compare outputs without revealing package versions to the reviewer where feasible. Keep evaluation fixtures, rubrics, and run reports outside `skills/` so they do not become runtime instructions. Use only executed evidence to make effectiveness or compatibility claims. User studies or appropriate product observations are needed for claims about audience usability or commercial outcomes.

See [behavioral evaluation setup](../evals/README.md) and [the candidate evaluation report](evaluation-report.md) for reproducible case inputs and the actual evidence collected.

## Build an archive

```sh
python3 scripts/build.py
```

This validates the package and writes `dist/ux-designer-<version>.zip` and its SHA-256 checksum. The archive contains one `ux-designer/` package with skills, manifests, assets, and the license. It excludes marketplace catalogs, tests and historical fixtures, evaluation material, development files, and local caches. For standalone installation, use a repository clone or GitHub's source download.

Archive entries use fixed timestamps and permissions. Building the same file contents twice produces the same archive bytes.

## Make a release

1. Update the version in all three plugin manifests, the Claude marketplace entry and metadata, the README, and the changelog. The Codex catalog resolves the version from the plugin manifest.
2. Run the validator, installer tests, and archive build. Review the diff for unintended project-specific data.
3. Check installation and a representative workflow in the intended client versions. Run the relevant behavioral comparisons and report their conditions and limitations separately from package checks.
4. Commit the release and publish a version tag or GitHub release when desired. Attach the generated ZIP and checksum if offering a direct plugin download.

GitHub source distribution and native marketplace installation are available independently of any submission to a platform's public plugin directory.

## Contributing design guidance

Keep recommendations conditional: name the relevant task, audience, platform, constraint, and exceptions. Put detailed knowledge in the owning module's references and link it from the rule index. Preserve the distinction between observed facts, user reports, assumptions, decisions, and unverified claims.

When reporting a problem, include a minimal prompt, the available input, the chosen module, what the agent did, and what made that result unsuitable. Remove private project material. Keep repository content in English; the skill should continue to converse in the user's language.

Feedback from personal and commercial projects informed the 0.2.0 changes. Record subsequent evaluation results with their actual scope and conditions; the changed instructions alone do not demonstrate improved design quality.

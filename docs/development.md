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
| `tests/` | Installer lifecycle checks with temporary home directories |

The six skills share a single content tree. Their frontmatter names remain unqualified. A client may add the `ux-designer:` namespace when loading them as a plugin.

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

The validator checks package identity, synchronized versions, catalog paths, required skills, metadata, bundled references, content hygiene, and module discovery. Installer tests exercise temporary homes, conflicts, local edits, updates, removal, and rollback. These checks establish package integrity and installation behavior; a product's usability still requires appropriate evaluation in its own context.

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

Check that all six modules are discoverable, the coordinator reads the selected module from this package, and the agent respects the requested scope. Use the same real task for before/after comparisons when evaluating changes to the design guidance.

## Build an archive

```sh
python3 scripts/build.py
```

This validates the package and writes `dist/ux-designer-<version>.zip` and its SHA-256 checksum. The archive contains one `ux-designer/` package with skills, manifests, assets, and the license. It excludes marketplace catalogs, tests, development files, and local caches. For standalone installation, use a repository clone or GitHub's source download.

Archive entries use fixed timestamps and permissions. Building the same file contents twice produces the same archive bytes.

## Make a release

1. Update the version in all three plugin manifests, the Claude marketplace entry and metadata, the README, and the changelog. The Codex catalog resolves the version from the plugin manifest.
2. Run the validator, installer tests, and archive build. Review the diff for unintended project-specific data.
3. Check installation and a representative workflow in the intended client versions.
4. Commit the release and publish a version tag or GitHub release when desired. Attach the generated ZIP and checksum if offering a direct plugin download.

GitHub source distribution and native marketplace installation are available independently of any submission to a platform's public plugin directory.

## Contributing design guidance

Keep recommendations conditional: name the relevant task, audience, platform, constraint, and exceptions. Put detailed knowledge in the owning module's references and link it from the rule index. Preserve the distinction between observed facts, user reports, assumptions, decisions, and unverified claims.

When reporting a problem, include a minimal prompt, the available input, the chosen module, what the agent did, and what made that result unsuitable. Remove private project material. Keep repository content in English; the skill should continue to converse in the user's language.

This initial release has a reported successful use on one personal project. That is early feedback, not a systematic effectiveness study.

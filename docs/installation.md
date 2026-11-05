# Installation and updates

Install UX Designer once for your local user to use it across projects. The package contains seven cooperating skills; keep them together. Choose either a plugin installation or standalone skills for each client.

> **Unreleased 0.2.0 candidate:** the remote marketplace and default-branch clone commands in this guide install the published `main` release, currently 0.1.0 with six skills. Use [the candidate instructions](evaluation-report.md#trying-the-candidate) to test the seven-skill branch.

## Claude Code plugin

In a terminal:

```sh
claude plugin marketplace add ruslanovich/ux-designer
claude plugin install ux-designer@ux-designer-marketplace --scope user
```

In your project, open a new Claude Code session. For an existing session, run `/reload-plugins`. Invoke:

```text
/ux-designer:design-interface Help me organize this app around the user's task.
```

`user` scope applies across projects on this computer. To update:

```sh
claude plugin marketplace update ux-designer-marketplace
claude plugin update ux-designer@ux-designer-marketplace --scope user
```

To remove the plugin:

```sh
claude plugin uninstall ux-designer@ux-designer-marketplace --scope user
```

The marketplace can remain registered for later use. To remove it too, run `claude plugin marketplace remove ux-designer-marketplace`.

## Codex CLI plugin

In a terminal:

```sh
codex plugin marketplace add ruslanovich/ux-designer
codex plugin add ux-designer@ux-designer-marketplace
```

Open a new session in your project. Type `$` to select the skill, or open `/skills`:

```text
$ux-designer:design-interface Help me organize this app around the user's task.
```

Plugin skills include their plugin namespace. Selecting the skill from the client menu uses the name exposed by that client version.

To fetch the latest catalog and install its current package:

```sh
codex plugin marketplace upgrade ux-designer-marketplace
codex plugin add ux-designer@ux-designer-marketplace
```

To remove it:

```sh
codex plugin remove ux-designer@ux-designer-marketplace
```

To also remove the catalog, run `codex plugin marketplace remove ux-designer-marketplace`.

If your client does not recognize `plugin`, use the standalone installation below or update the client through its normal update mechanism. The Codex IDE extension currently supports standalone skills rather than plugin installation.

## Standalone skills

Requires Python 3.10 or newer. Git is needed to clone and update the checkout. The installer uses only the Python standard library.

```sh
git clone https://github.com/ruslanovich/ux-designer.git
cd ux-designer
python3 scripts/install.py --target codex
```

| Target | User-level destination | Invocation |
| --- | --- | --- |
| `codex` | `~/.agents/skills/` | `$design-interface` or `/skills` |
| `claude` | `~/.claude/skills/` | `/design-interface` |
| `both` | Both directories | Use the corresponding client command |

`~` means your home directory. On Windows, use the Python 3 interpreter command available on your machine, such as `py -3`, in place of `python3`.

Preview an installation:

```sh
python3 scripts/install.py --target both --dry-run
```

Open a new conversation in the client after installation if its skill list has not refreshed. All seven folders are copied into the destination. The installer does not create links back into the plugin repository.

### Update

From your clone:

```sh
git pull --ff-only
python3 scripts/install.py --target codex
```

Use the same target you installed originally. The installer checks every selected destination before replacing any skill and records file hashes to detect local changes. An interrupted replacement is rolled back when possible; if recovery needs manual action, the command reports where backups remain.

Updating from 0.1.0 adds `research-interface` alongside the existing six modules. If a destination with that name already belongs to another installation, or an existing UX Designer skill has local edits, the installer stops before replacing any selected skill. Resolve the reported conflict and rerun the update.

### Remove

```sh
python3 scripts/install.py --target codex --uninstall
```

Removal only touches unchanged skill directories owned by this installer. The command leaves unrelated skills and client settings in place. Use `--target both` only when you want to remove both installations.

### Existing or modified skill folders

An older manual installation or a directory with local changes will cause the installer to stop before replacing skills. Review those folders and move the ones you want to preserve to a backup location outside the client's skills directory. Then rerun the installation. The installer deliberately has no overwrite switch.

The ownership record is `.ux-designer-install.json` inside each installed skill folder. Keep it intact so updates and removal can verify the installation.

### Manual installation

You can copy the seven directories inside `skills/` into your client's user-level skills directory yourself. Each destination must have the shape `<skills-directory>/design-interface/SKILL.md`, with the other six modules next to it. Preserve `references/`, `scripts/`, `agents/`, and `assets/`.

Manual copies are managed manually. The provided installer will not claim ownership of them. Copy the directories as actual files; linking them into this plugin repository can cause a client to apply the plugin's namespace.

## Which command should I use?

| Installation | Claude Code | Codex |
| --- | --- | --- |
| Plugin | `/ux-designer:design-interface` | `$ux-designer:design-interface` |
| Standalone | `/design-interface` | `$design-interface` |

The main skill handles the workflow. Specialists are also available by their own names for focused work; add the same plugin prefix when using a plugin installation.

## Troubleshooting

- **A skill appears twice:** remove the duplicate installation method for that client. Repository-level skills may also duplicate a user-level installation.
- **A module is missing:** ensure all seven skills were installed together. From the checkout, run `python3 scripts/validate.py` after installing the development dependency, or run the installed coordinator's `scripts/locate_modules.py` directly with Python 3.
- **A marketplace is missing:** run the matching `marketplace add` command before installing the plugin. Both catalogs are in this repository.
- **A skill is unavailable:** check the client's skill/plugin settings and any applicable workspace policy. Disabled modules should remain disabled until you choose to enable them.
- **A script is blocked:** allow only the operations required for your task through the client's normal permissions. Module instructions can be read directly if the helper is unavailable.

Global installation applies to this local user and computer. Other machines and cloud sessions need their own supported installation setup. UX Designer itself has no server, account signup, or API key; the selected coding agent retains its own requirements.

Research uses the search and source-reading tools exposed by that agent. The skill cannot enable browsing by itself. If browsing or interface rendering is unavailable, it should explain the relevant limitation and continue with the available materials.

## Official client documentation

Compatibility references checked on 2026-10-31:

- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [Claude Code plugin commands](https://code.claude.com/docs/en/plugins/cli-reference)
- [Claude Code marketplace layout](https://code.claude.com/docs/en/plugins/marketplace-reference)
- [Codex skills](https://learn.chatgpt.com/docs/build-skills)
- [Codex CLI commands](https://learn.chatgpt.com/docs/cli/reference)
- [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins)

#!/usr/bin/env python3
"""Install or remove UX Designer skills for the current user's local projects."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path

SKILLS = (
    "design-interface", "inspect-interface", "clarify-interface",
    "plan-interface", "build-interface", "check-interface",
)
OWNER = "https://github.com/ruslanovich/ux-designer"
MARKER = ".ux-designer-install.json"
LOCK = ".ux-designer-install.lock"
TARGETS = {"codex": Path(".agents/skills"), "claude": Path(".claude/skills")}
PACKAGE_ROOT = Path(__file__).resolve().parents[1]


class InstallError(Exception):
    """An installation cannot proceed without risking an existing file."""


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def snapshot(folder: Path) -> tuple[dict[str, str], list[str]]:
    """Include extra files and empty directories when detecting local changes."""
    files, directories = {}, []
    for path in sorted(folder.rglob("*")):
        relative = path.relative_to(folder).as_posix()
        if path.is_symlink():
            raise InstallError(f"Refusing a symbolic link: {path}")
        if path.is_dir():
            directories.append(relative)
        elif path.is_file():
            if relative != MARKER:
                files[relative] = digest(path.read_bytes())
        else:
            raise InstallError(f"Refusing an unsupported file: {path}")
    return files, directories


def installed_state(folder: Path, name: str) -> dict | None:
    if folder.is_symlink():
        raise InstallError(f"Refusing a symbolic link: {folder}")
    if not folder.exists():
        return None
    marker = folder / MARKER
    if not folder.is_dir() or not marker.is_file() or marker.is_symlink():
        raise InstallError(f"Existing directory is not owned by this installer: {folder}")
    try:
        state = json.loads(marker.read_text(encoding="utf-8"))
    except (ValueError, UnicodeError) as error:
        raise InstallError(f"Invalid installation record: {marker}") from error
    if not isinstance(state, dict) or any(
        state.get(key) != value
        for key, value in {"schema": 1, "owner": OWNER, "skill": name}.items()
    ):
        raise InstallError(f"Existing directory is not owned by this installer: {folder}")
    files, directories = snapshot(folder)
    if files != state.get("files") or directories != state.get("directories"):
        raise InstallError(
            f"Local changes detected in {folder}. Move or back up that directory "
            "before retrying; no skill directories have been changed."
        )
    return state


def read_package() -> tuple[str, dict]:
    try:
        manifest = json.loads((PACKAGE_ROOT / "plugin.json").read_text(encoding="utf-8"))
    except (OSError, ValueError) as error:
        raise InstallError("Run this installer from a complete UX Designer checkout.") from error
    if not isinstance(manifest, dict):
        raise InstallError("The package manifest must be a JSON object.")
    version = manifest.get("version")
    if manifest.get("name") != "ux-designer" or not isinstance(version, str) or not version:
        raise InstallError("The package manifest must name ux-designer and include a version.")
    package = {}
    for name in SKILLS:
        folder = PACKAGE_ROOT / "skills" / name
        if not folder.is_dir() or folder.is_symlink():
            raise InstallError(f"Missing or invalid source directory: {folder}")
        payload, directories = {}, []
        for path in sorted(folder.rglob("*")):
            relative = path.relative_to(folder)
            if any(part.startswith(".") or part == "__pycache__" for part in relative.parts):
                continue
            if path.suffix in (".pyc", ".pyo"):
                continue
            if path.is_symlink():
                raise InstallError(f"Refusing a source symbolic link: {path}")
            if path.is_dir():
                directories.append(relative.as_posix())
            elif path.is_file():
                payload[relative.as_posix()] = (path.read_bytes(), path.stat().st_mode & 0o777)
            else:
                raise InstallError(f"Unsupported source file: {path}")
        if "SKILL.md" not in payload:
            raise InstallError(f"Missing SKILL.md for {name}")
        text = payload["SKILL.md"][0].decode("utf-8")
        frontmatter = text.split("---", 2)
        if len(frontmatter) != 3 or frontmatter[0].strip() or not re.search(
            rf"(?m)^name:\s*['\"]?{re.escape(name)}['\"]?\s*$", frontmatter[1]
        ):
            raise InstallError(f"Unexpected skill name in {folder / 'SKILL.md'}")
        package[name] = (payload, directories)
    return version, package


def stage_skill(destination: Path, name: str, version: str, contents: tuple) -> None:
    payload, directories = contents
    destination.mkdir(parents=True)
    for relative in directories:
        (destination / relative).mkdir(parents=True, exist_ok=True)
    for relative, (data, mode) in payload.items():
        path = destination / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        path.chmod(mode)
    state = {
        "schema": 1, "owner": OWNER, "skill": name, "version": version,
        "files": {relative: digest(data) for relative, (data, _) in payload.items()},
        "directories": directories,
    }
    (destination / MARKER).write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")


def install(args: argparse.Namespace) -> None:
    names = list(TARGETS) if args.target == "both" else [args.target]
    roots = [args.home.expanduser().resolve() / TARGETS[name] for name in names]
    version, package = (None, {}) if args.uninstall else read_package()
    jobs = [(root, name, root / name) for root in roots for name in SKILLS]
    before = {path: installed_state(path, name) for _, name, path in jobs}
    verb = "Remove" if args.uninstall else "Install"
    if args.dry_run:
        for _, name, path in jobs:
            action = "Already absent" if args.uninstall and before[path] is None else verb
            print(f"{action}: {path}")
        print("Dry run complete; no files changed.")
        return

    locks, staging, changed = [], {}, []
    preserve_backups = False
    try:
        for root in roots:
            root.mkdir(parents=True, exist_ok=True)
            lock = root / LOCK
            try:
                descriptor = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
            except FileExistsError as error:
                raise InstallError(
                    f"Another installation may be running: {lock}. If an earlier run "
                    "was interrupted, check its state before removing this lock."
                ) from error
            locks.append(lock)
            with os.fdopen(descriptor, "w") as stream:
                stream.write(f"{os.getpid()}\n")
            staging[root] = Path(tempfile.mkdtemp(prefix=".ux-designer-stage-", dir=root))
        for root, name, _ in jobs:
            if not args.uninstall:
                stage_skill(staging[root] / "new" / name, name, version, package[name])
        # Check again after staging, before replacing any installed directory.
        for _, name, path in jobs:
            if installed_state(path, name) != before[path]:
                raise InstallError(f"Installation changed during preparation: {path}. Retry.")
        for root, name, path in jobs:
            if args.uninstall and before[path] is None:
                continue
            backup = staging[root] / "old" / name
            backup.parent.mkdir(parents=True, exist_ok=True)
            new = None if args.uninstall else staging[root] / "new" / name
            action = {"path": path, "backup": backup, "new": new}
            changed.append(action)
            if before[path] is not None:
                path.rename(backup)
            if not args.uninstall:
                new.rename(path)
    except BaseException as error:
        rollback_errors = []
        for action in reversed(changed):
            try:
                if action["new"] is not None and not action["new"].exists() and action["path"].exists():
                    shutil.rmtree(action["path"])
                if action["backup"].exists():
                    action["backup"].rename(action["path"])
            except OSError as rollback_error:
                rollback_errors.append(str(rollback_error))
        if rollback_errors:
            preserve_backups = True
            locations = ", ".join(str(path) for path in staging.values())
            raise InstallError(
                f"Installation failed; some backups require manual recovery at {locations}. "
                + "; ".join(rollback_errors)
            ) from error
        raise
    finally:
        if not preserve_backups:
            for path in staging.values():
                try:
                    shutil.rmtree(path)
                except OSError as error:
                    print(f"Warning: could not remove temporary directory {path}: {error}", file=sys.stderr)
        for lock in locks:
            lock.unlink(missing_ok=True)
    for target, root in zip(names, roots):
        if args.uninstall:
            print(f"Removed UX Designer skills from {target}: {root}")
        else:
            print(f"Installed UX Designer {version} ({len(SKILLS)} skills) for {target}: {root}")
    if not args.uninstall:
        print("Claude Code: /design-interface. Codex: $design-interface or /skills.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", required=True, choices=("codex", "claude", "both"),
                        help="Install all six skills for the selected local client(s).")
    parser.add_argument("--home", type=Path, default=Path.home(),
                        help="Home directory containing .agents and/or .claude (default: your home).")
    parser.add_argument("--uninstall", action="store_true",
                        help="Remove only unmodified installations owned by this installer.")
    parser.add_argument("--dry-run", action="store_true",
                        help="Check sources and destinations without changing files.")
    args = parser.parse_args()
    try:
        install(args)
    except (InstallError, OSError, UnicodeError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

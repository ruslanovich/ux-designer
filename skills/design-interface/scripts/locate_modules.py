#!/usr/bin/env python3
"""Locate active interface modules by exact frontmatter name without changing files."""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

MODULES = (
    "inspect-interface",
    "clarify-interface",
    "research-interface",
    "plan-interface",
    "build-interface",
    "check-interface",
)
NAME = re.compile(r"""^name:\s*(?:'([a-z0-9-]+)'|"([a-z0-9-]+)"|([a-z0-9-]+))\s*$""")


def frontmatter_name(path: Path) -> str | None:
    try:
        lines = path.read_text(encoding="utf-8-sig").splitlines()
    except (OSError, UnicodeError):
        return None
    if not lines or lines[0].strip() != "---":
        return None
    for line in lines[1:]:
        if line.strip() == "---":
            break
        match = NAME.fullmatch(line)
        if match:
            return next(value for value in match.groups() if value is not None)
    return None


def index(root: Path) -> dict[str, list[str]]:
    result: dict[str, list[str]] = {}
    if not root.is_dir():
        return result
    for folder in sorted(root.iterdir(), key=lambda item: item.name):
        if folder.name.startswith(".") or folder.name == "uninstalled" or not folder.is_dir():
            continue
        path = folder / "SKILL.md"
        name = frontmatter_name(path)
        if name:
            result.setdefault(name, []).append(str(path.resolve()))
    return result


def locate(root: Path, names: list[str]) -> dict:
    active = index(root)
    disabled = index(root / "uninstalled")
    modules = {}
    for name in names:
        candidates = active.get(name, [])
        if len(candidates) == 1:
            modules[name] = {"status": "found", "path": candidates[0]}
        elif len(candidates) > 1:
            modules[name] = {"status": "ambiguous", "candidates": candidates}
        elif disabled.get(name):
            modules[name] = {"status": "disabled", "candidates": disabled[name]}
        else:
            modules[name] = {"status": "missing"}
    return {"root": str(root.resolve()), "modules": modules}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[2],
                        help="Actual containing skills directory; defaults to this installation.")
    parser.add_argument("names", nargs="*", choices=(*MODULES, "design-interface"),
                        help="Exact skill names; default: the six workflow modules.")
    args = parser.parse_args()
    root = args.root.expanduser().resolve()
    if not root.is_dir():
        print(json.dumps({"root": str(root), "error": "skills_root_not_found"}))
        return 1
    result = locate(root, args.names or list(MODULES))
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if all(m["status"] == "found" for m in result["modules"].values()) else 2


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Validate the UX Designer release structure offline; does not test client installation."""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlsplit

try:
    import yaml
except ImportError:
    yaml = None


PLUGIN = "ux-designer"
CATALOG = "ux-designer-marketplace"
SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
LEAD = "design-interface"
SPECIALISTS = (
    "inspect-interface", "clarify-interface", "plan-interface",
    "build-interface", "check-interface",
)
SKILLS = (LEAD, *SPECIALISTS)
SEMVER = re.compile(
    r"(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)"
    r"(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)"
    r"(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?"
    r"(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?"
)
CYRILLIC = re.compile(r"[\u0400-\u052f\u2de0-\u2dff\ua640-\ua69f]")
PRIVATE = re.compile(
    r"/(?:workspace/scratch|mnt/data|root/\.codex)(?:/|\b)"
    r"|/(?:Users|home)/[^/\s]+/"
    r"|\bskill-[a-f0-9]{24,}\b"
    r"|\b(?:libfile_|page_)[a-f0-9]{24,}\b"
    r"|https://chatgpt\.com/(?:library\?|space/page_)"
    r"|https://chatgpt\.com/backend-api/git-authed/"
)
IGNORED = {".git", ".venv", "venv", "node_modules", "__pycache__",
           ".pytest_cache", ".mypy_cache", ".ruff_cache", "dist", "build"}
TEXT_SUFFIXES = {".md", ".json", ".yaml", ".yml", ".py", ".sh", ".ps1",
                 ".toml", ".txt", ".svg"}


class Validator:
    def __init__(self, root: Path) -> None:
        self.root = root.resolve()
        self.errors: list[str] = []
        self.link_count = 0
        self.text_count = 0

    def label(self, path: Path) -> str:
        try:
            return str(path.relative_to(self.root)) or "."
        except ValueError:
            return str(path)

    def error(self, path: Path, message: str) -> None:
        self.errors.append(f"{self.label(path)}: {message}")

    def text(self, path: Path) -> str | None:
        try:
            return path.read_text(encoding="utf-8")
        except (OSError, UnicodeError) as exc:
            self.error(path, f"cannot read UTF-8 text ({exc})")
            return None

    def document(self, path: Path, *, is_yaml: bool = False) -> dict[str, Any]:
        source = self.text(path)
        if source is None:
            return {}
        try:
            if is_yaml:
                value = yaml.safe_load(source)
            else:
                value = json.loads(source, object_pairs_hook=self.unique_json_keys)
        except (ValueError, yaml.YAMLError) as exc:
            self.error(path, f"invalid {'YAML' if is_yaml else 'JSON'} ({exc})")
            return {}
        if not isinstance(value, dict):
            self.error(path, "document must be an object")
            return {}
        return value

    @staticmethod
    def unique_json_keys(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
        value = {}
        for key, item in pairs:
            if key in value:
                raise ValueError(f"duplicate key: {key}")
            value[key] = item
        return value

    def string(self, path: Path, value: Any, field: str) -> bool:
        if not isinstance(value, str) or not value.strip():
            self.error(path, f"{field} must be a nonempty string")
            return False
        return True

    def bundled_path(self, source: Path, value: Any, *, base: Path,
                     field: str, kind: str | None = None) -> Path | None:
        if not self.string(source, value, field):
            return None
        if "\\" in value or Path(value).is_absolute() or urlsplit(value).scheme:
            self.error(source, f"{field} must be a portable relative path")
            return None
        target = (base / value).resolve()
        try:
            target.relative_to(self.root)
        except ValueError:
            self.error(source, f"{field} escapes the repository")
            return None
        if not target.exists():
            self.error(source, f"{field} points to a missing file or directory: {value}")
        elif kind == "file" and not target.is_file():
            self.error(source, f"{field} must point to a file: {value}")
        elif kind == "directory" and not target.is_dir():
            self.error(source, f"{field} must point to a directory: {value}")
        return target

    def manifest(self, relative: str, version: str | None = None) -> dict[str, Any]:
        path = self.root / relative
        data = self.document(path)
        if data.get("name") != PLUGIN:
            self.error(path, f"name must be {PLUGIN!r}")
        current = data.get("version")
        if not isinstance(current, str) or SEMVER.fullmatch(current) is None:
            self.error(path, "version must be a semantic version string")
        elif version is not None and current != version:
            self.error(path, f"version must match root plugin.json ({version})")
        self.string(path, data.get("description"), "description")
        for component in ("skills", "commands", "agents"):
            if component not in data:
                continue
            values = data[component]
            if not isinstance(values, list):
                values = [values]
            for value in values:
                self.bundled_path(path, value, base=self.root,
                                  field=component, kind="directory")
        for field in ("hooks", "mcpServers", "apps"):
            if isinstance(data.get(field), str):
                self.bundled_path(path, data[field], base=self.root,
                                  field=field, kind="file")
        self.manifest_assets(path, data.get("interface"))
        extensions = data.get("extensions", {})
        if not isinstance(extensions, dict):
            self.error(path, "extensions must be an object")
        else:
            openai = extensions.get("com.openai", {})
            if not isinstance(openai, dict):
                self.error(path, "extensions.com.openai must be an object")
            else:
                self.manifest_assets(path, openai.get("interface"))
                for field in ("apps", "hooks", "onboardingSkill"):
                    if field in openai:
                        self.bundled_path(path, openai[field], base=self.root,
                                          field=f"extensions.com.openai.{field}",
                                          kind="file")
        return data

    def manifest_assets(self, path: Path, interface: Any) -> None:
        if interface is None:
            return
        if not isinstance(interface, dict):
            self.error(path, "interface must be an object")
            return
        for key in ("displayName", "shortDescription", "longDescription", "developerName"):
            if key in interface:
                self.string(path, interface[key], f"interface.{key}")
        for key in ("composerIcon", "logo"):
            if key in interface:
                self.bundled_path(path, interface[key], base=self.root,
                                  field=f"interface.{key}", kind="file")
        if "screenshots" in interface:
            if not isinstance(interface["screenshots"], list):
                self.error(path, "interface.screenshots must be an array")
            else:
                for screenshot in interface["screenshots"]:
                    self.bundled_path(path, screenshot, base=self.root,
                                      field="interface.screenshots", kind="file")

    def marketplace(self, relative: str, version: str, *, codex: bool) -> None:
        path = self.root / relative
        data = self.document(path)
        if data.get("name") != CATALOG:
            self.error(path, f"name must be {CATALOG!r}")
        if codex:
            interface = data.get("interface")
            if not isinstance(interface, dict):
                self.error(path, "interface must be an object with displayName")
            else:
                self.string(path, interface.get("displayName"), "interface.displayName")
        else:
            owner = data.get("owner")
            if not isinstance(owner, dict):
                self.error(path, "owner must be an object with name")
            else:
                self.string(path, owner.get("name"), "owner.name")
        entries = data.get("plugins")
        if not isinstance(entries, list) or len(entries) != 1 or not isinstance(entries[0], dict):
            self.error(path, "plugins must contain exactly one plugin object")
            return
        entry = entries[0]
        if entry.get("name") != PLUGIN:
            self.error(path, f"plugin entry name must be {PLUGIN!r}")
        if "version" in entry and entry["version"] != version:
            self.error(path, "plugin entry version must match root plugin.json")
        source = entry.get("source")
        if isinstance(source, dict) and codex:
            if source.get("source") != "local":
                self.error(path, "the bundled plugin source must have source='local'")
            source = source.get("path")
        if source != "./":
            self.error(path, "the bundled plugin source must point to './'")
        else:
            self.bundled_path(path, source, base=self.root, field="source", kind="directory")
        if codex:
            policy = entry.get("policy")
            if not isinstance(policy, dict):
                self.error(path, "plugin policy must be an object")
            else:
                if policy.get("installation") != "AVAILABLE":
                    self.error(path, "policy.installation must be AVAILABLE")
                if policy.get("authentication") != "ON_INSTALL":
                    self.error(path, "policy.authentication must be ON_INSTALL")
            self.string(path, entry.get("category"), "category")

    def skill(self, name: str) -> None:
        folder = self.root / "skills" / name
        path = folder / "SKILL.md"
        source = self.text(path)
        if source is None:
            return
        lines = source.splitlines()
        if not lines or lines[0] != "---" or "---" not in lines[1:]:
            self.error(path, "SKILL.md must start with a closed YAML frontmatter block")
            return
        boundary = lines.index("---", 1)
        try:
            frontmatter = yaml.safe_load("\n".join(lines[1:boundary]))
        except yaml.YAMLError as exc:
            self.error(path, f"invalid YAML frontmatter ({exc})")
            return
        if not isinstance(frontmatter, dict):
            self.error(path, "frontmatter must be an object")
            return
        if frontmatter.get("name") != name:
            self.error(path, f"frontmatter name must match the directory ({name})")
        description = frontmatter.get("description")
        if self.string(path, description, "description") and len(description) > 1024:
            self.error(path, "description exceeds 1024 characters")
        if not "\n".join(lines[boundary + 1:]).strip():
            self.error(path, "skill instructions are empty")
        for flag in ("user-invocable", "disable-model-invocation"):
            if flag in frontmatter and not isinstance(frontmatter[flag], bool):
                self.error(path, f"{flag} must be a YAML boolean")
        if frontmatter.get("disable-model-invocation") is True:
            self.error(path, "disable-model-invocation would prevent workflow module routing")
        if name == LEAD and frontmatter.get("user-invocable") is False:
            self.error(path, "the leading skill must remain user-invocable")

        metadata_path = folder / "agents" / "openai.yaml"
        metadata = self.document(metadata_path, is_yaml=True)
        interface = metadata.get("interface")
        if not isinstance(interface, dict):
            self.error(metadata_path, "interface must be an object")
        else:
            for field in ("display_name", "short_description", "default_prompt"):
                value = interface.get(field)
                if self.string(metadata_path, value, f"interface.{field}"):
                    if re.search(r"[A-Za-z]", value) is None:
                        self.error(metadata_path, f"interface.{field} must contain English text")
            for field in ("icon_small", "icon_large"):
                if field in interface:
                    self.bundled_path(metadata_path, interface[field], base=folder,
                                      field=f"interface.{field}", kind="file")
        policy = metadata.get("policy")
        if not isinstance(policy, dict) or policy.get("allow_implicit_invocation") is not (name == LEAD):
            self.error(metadata_path, f"allow_implicit_invocation must be {name == LEAD}")
        if isinstance(policy, dict) and "products" in policy:
            self.error(metadata_path, "remove host-generated policy.products from the portable package")

    def text_files(self) -> list[Path]:
        return sorted(path for path in self.root.rglob("*")
                      if path.is_file()
                      and not any(part in IGNORED for part in path.relative_to(self.root).parts)
                      and (path.suffix in TEXT_SUFFIXES or path.name in {"LICENSE", ".gitignore"}))

    def markdown_links(self, path: Path, source: str) -> None:
        # Ignore fenced examples; check file targets, while leaving anchors to the renderer.
        prose = []
        fence = None
        for line in source.splitlines():
            marker = re.match(r"^\s*(`{3,}|~{3,})", line)
            if marker:
                token = marker.group(1)
                if fence is None:
                    fence = token
                elif token[0] == fence[0] and len(token) >= len(fence):
                    fence = None
                continue
            if fence is None:
                prose.append(line)
        visible = "\n".join(prose)
        targets = re.findall(r"!?\[[^\]\n]*\]\(\s*(<[^>]*>|[^\s)]+)", visible)
        targets += re.findall(r"^\s{0,3}\[[^\]\n]+\]:\s*(<[^>]*>|\S+)", visible, re.M)
        for raw in targets:
            target = raw.strip("<>")
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            local = unquote(parsed.path)
            self.bundled_path(path, local, base=path.parent, field=f"link {target!r}")
            self.link_count += 1

    def hygiene(self) -> None:
        for path in self.text_files():
            source = self.text(path)
            if source is None:
                continue
            self.text_count += 1
            for pattern, message in ((CYRILLIC, "Cyrillic text must be translated to English"),
                                     (PRIVATE, "private workspace path or host-generated identifier")):
                match = pattern.search(source)
                if match:
                    line = source.count("\n", 0, match.start()) + 1
                    self.error(path, f"line {line}: {message}")
            if path.suffix == ".md":
                self.markdown_links(path, source)

    def locator(self) -> None:
        helper = self.root / "skills" / LEAD / "scripts" / "locate_modules.py"
        if not helper.is_file():
            self.error(helper, "module locator is missing")
            return
        try:
            completed = subprocess.run([sys.executable, str(helper)], cwd=self.root,
                                       text=True, capture_output=True, timeout=15, check=False)
        except (OSError, subprocess.TimeoutExpired) as exc:
            self.error(helper, f"could not execute module locator ({exc})")
            return
        if completed.returncode != 0:
            self.error(helper, f"module locator failed (exit {completed.returncode}): "
                       + (completed.stderr or completed.stdout).strip()[:500])
            return
        try:
            result = json.loads(completed.stdout)
        except json.JSONDecodeError:
            self.error(helper, "module locator did not return JSON")
            return
        if not isinstance(result, dict) or not isinstance(result.get("modules"), dict):
            self.error(helper, "module locator must return a modules object")
            return
        modules = result["modules"]
        if set(modules) != set(SPECIALISTS):
            self.error(helper, "module locator must resolve exactly the five specialists")
        for name in SPECIALISTS:
            value = modules.get(name)
            expected = (self.root / "skills" / name / "SKILL.md").resolve()
            if not isinstance(value, dict) or value.get("status") != "found":
                self.error(helper, f"module locator did not find {name}")
            elif not isinstance(value.get("path"), str) or Path(value["path"]).resolve() != expected:
                self.error(helper, f"module locator resolved {name} outside its bundled directory")

    def run(self) -> int:
        portable = self.manifest("plugin.json")
        if portable.get("$schema") != SCHEMA:
            self.error(self.root / "plugin.json", "missing or unsupported portable Agent Plugins schema")
        version = portable.get("version")
        self.manifest(".claude-plugin/plugin.json", version=version)
        compatibility = self.root / ".codex-plugin/plugin.json"
        if compatibility.exists():
            self.manifest(".codex-plugin/plugin.json", version=version)
        self.marketplace(".claude-plugin/marketplace.json", version, codex=False)
        self.marketplace(".agents/plugins/marketplace.json", version, codex=True)
        actual = {path.parent.name for path in (self.root / "skills").glob("*/SKILL.md")}
        if actual != set(SKILLS):
            self.error(self.root / "skills", f"expected exactly six skills; found {sorted(actual)}")
        for name in SKILLS:
            self.skill(name)
        self.hygiene()
        self.locator()
        if self.errors:
            print(f"Package validation failed ({len(self.errors)} issue(s)):", file=sys.stderr)
            for error in self.errors:
                print(f"- {error}", file=sys.stderr)
            return 1
        print(f"Package validation passed: {len(SKILLS)} skills, {self.link_count} local links, "
              f"{self.text_count} text files, manifests, catalogs, metadata, and module discovery.")
        print("This checks release structure offline; it does not verify installation in a client.")
        return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", type=Path,
                        default=Path(__file__).resolve().parents[1],
                        help="repository root (defaults to the parent of this script's directory)")
    args = parser.parse_args()
    if yaml is None:
        parser.exit(2, "PyYAML is required. Install development dependencies with "
                    "python3 -m pip install -r requirements-dev.txt\n")
    root = args.root.expanduser().resolve()
    if not root.is_dir():
        parser.error(f"repository root is not a directory: {root}")
    return Validator(root).run()


if __name__ == "__main__":
    raise SystemExit(main())

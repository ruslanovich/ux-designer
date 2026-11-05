"""Exercise real installation lifecycles in temporary home directories."""
from __future__ import annotations

import importlib.util
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

REPOSITORY = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("ux_designer_install", REPOSITORY / "scripts/install.py")
INSTALLER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(INSTALLER)

PACKAGE_VERSION = json.loads((REPOSITORY / "plugin.json").read_text(encoding="utf-8"))["version"]
# General lifecycle fixtures use independent versions; migration uses the published baseline.
INITIAL_VERSION = "1.0.0"
UPDATE_VERSION = "1.1.0"
LEGACY_SKILLS = (
    "design-interface", "inspect-interface", "clarify-interface",
    "plan-interface", "build-interface", "check-interface",
)
# Exact scripts/install.py from commit 65114f479a66e3e9806457bb59018d85f10162f2:
# https://github.com/ruslanovich/ux-designer/blob/65114f479a66e3e9806457bb59018d85f10162f2/scripts/install.py
LEGACY_INSTALLER = REPOSITORY / "tests/fixtures/v0.1.0/install.py"
LEGACY_INSTALLER_SHA256 = "22874bba2d5f6f81bd1166934ca3631883b4032d2a4da00ccf6d6e0d39b49824"


class InstallerTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.package = self.root / "package"
        self.home = self.root / "home"
        (self.package / "scripts").mkdir(parents=True)
        shutil.copy2(REPOSITORY / "scripts/install.py", self.package / "scripts/install.py")
        shutil.copytree(REPOSITORY / "skills", self.package / "skills")
        self.manifest(INITIAL_VERSION)

    def manifest(self, version):
        (self.package / "plugin.json").write_text(
            json.dumps({"name": "ux-designer", "version": version}), encoding="utf-8"
        )

    def run_installer(self, *arguments, succeeds=True):
        result = subprocess.run(
            [sys.executable, str(self.package / "scripts/install.py"),
             "--home", str(self.home), *arguments],
            text=True, capture_output=True,
        )
        if succeeds:
            self.assertEqual(result.returncode, 0, result.stderr)
        else:
            self.assertNotEqual(result.returncode, 0, result.stdout)
        return result

    def target(self, name="codex"):
        return self.home / INSTALLER.TARGETS[name]

    def assert_modules_found(self, root):
        result = subprocess.run(
            [sys.executable, str(root / "design-interface/scripts/locate_modules.py")],
            text=True, capture_output=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        modules = json.loads(result.stdout)["modules"]
        self.assertEqual(set(modules), {
            "inspect-interface", "clarify-interface", "research-interface",
            "plan-interface", "build-interface", "check-interface",
        })
        for name, item in modules.items():
            self.assertEqual(item["status"], "found")
            self.assertEqual(Path(item["path"]), (root / name / "SKILL.md").resolve())

    def installed_files(self, target):
        root = self.target(target)
        return {path.relative_to(root).as_posix(): path.read_bytes()
                for path in root.rglob("*") if path.is_file()}

    def install_legacy(self):
        """Run the real old installer with a minimal, explicitly synthetic six-skill payload."""
        self.assertEqual(hashlib.sha256(LEGACY_INSTALLER.read_bytes()).hexdigest(),
                         LEGACY_INSTALLER_SHA256)
        legacy = self.root / "legacy-package"
        (legacy / "scripts").mkdir(parents=True)
        shutil.copy2(LEGACY_INSTALLER, legacy / "scripts/install.py")
        (legacy / "plugin.json").write_text(
            json.dumps({"name": "ux-designer", "version": "0.1.0"}), encoding="utf-8",
        )
        for name in LEGACY_SKILLS:
            folder = legacy / "skills" / name
            folder.mkdir(parents=True)
            (folder / "SKILL.md").write_text(
                f"---\nname: {name}\ndescription: Synthetic migration fixture.\n---\n"
                f"Minimal legacy payload for {name}.\n", encoding="utf-8",
            )
        old_reference = legacy / "skills/design-interface/references/legacy-only.md"
        old_reference.parent.mkdir()
        old_reference.write_text("Legacy-only migration fixture.\n", encoding="utf-8")
        result = subprocess.run(
            [sys.executable, str(legacy / "scripts/install.py"),
             "--home", str(self.home), "--target", "both"],
            text=True, capture_output=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        for target in ("codex", "claude"):
            root = self.target(target)
            self.assertEqual({path.name for path in root.iterdir()}, set(LEGACY_SKILLS))
            for name in LEGACY_SKILLS:
                self.assertEqual(INSTALLER.installed_state(root / name, name)["version"], "0.1.0")

    def test_install_both_and_locate_all_modules(self):
        self.run_installer("--target", "both")
        for target in ("codex", "claude"):
            root = self.target(target)
            for name in INSTALLER.SKILLS:
                self.assertTrue((root / name / "SKILL.md").is_file())
                self.assertIsNotNone(INSTALLER.installed_state(root / name, name))
            self.assert_modules_found(root)
            self.assertFalse(any(root.glob(".ux-designer-stage-*")))
            self.assertFalse((root / INSTALLER.LOCK).exists())

    def test_rerun_update_removes_obsolete_files_and_uninstall(self):
        obsolete = self.package / "skills/design-interface/references/obsolete.txt"
        obsolete.write_text("Old package content", encoding="utf-8")
        self.run_installer("--target", "codex")
        self.run_installer("--target", "codex")
        obsolete.unlink()
        self.manifest(UPDATE_VERSION)
        self.run_installer("--target", "codex")
        lead = self.target() / "design-interface"
        self.assertFalse((lead / "references/obsolete.txt").exists())
        self.assertEqual(INSTALLER.installed_state(lead, "design-interface")["version"], UPDATE_VERSION)
        self.run_installer("--target", "codex", "--uninstall")
        self.assertFalse(any(self.target().iterdir()))
        self.run_installer("--target", "codex", "--uninstall")

    def test_conflict_in_second_client_prevents_all_installations(self):
        conflicting = self.target("claude") / "check-interface"
        conflicting.mkdir(parents=True)
        (conflicting / "SKILL.md").write_text("Existing personal skill", encoding="utf-8")
        result = self.run_installer("--target", "both", succeeds=False)
        self.assertIn("not owned", result.stderr)
        self.assertFalse(self.target().exists())
        self.assertEqual((conflicting / "SKILL.md").read_text(), "Existing personal skill")

    def test_local_changes_block_update_and_uninstall(self):
        self.run_installer("--target", "both")
        edited = self.target("claude") / "check-interface/SKILL.md"
        edited.write_text(edited.read_text() + "\nMy local changes.\n", encoding="utf-8")
        self.manifest(UPDATE_VERSION)
        for operation in ([], ["--uninstall"]):
            result = self.run_installer("--target", "both", *operation, succeeds=False)
            self.assertIn("Local changes", result.stderr)
            self.assertIn("My local changes", edited.read_text())
            state = INSTALLER.installed_state(self.target() / "design-interface", "design-interface")
            self.assertEqual(state["version"], INITIAL_VERSION)

    def test_added_empty_directory_is_preserved(self):
        self.run_installer("--target", "codex")
        extra = self.target() / "design-interface/my-work"
        extra.mkdir()
        self.run_installer("--target", "codex", "--uninstall", succeeds=False)
        self.assertTrue(extra.is_dir())

    def test_dry_run_creates_no_home(self):
        result = self.run_installer("--target", "both", "--dry-run")
        self.assertIn("no files changed", result.stdout)
        self.assertFalse(self.home.exists())

    def test_local_package_cache_files_are_not_installed(self):
        source = self.package / "skills/design-interface"
        (source / ".DS_Store").write_bytes(b"Local metadata")
        (source / "scripts/__pycache__").mkdir(exist_ok=True)
        (source / "scripts/__pycache__/cached.pyc").write_bytes(b"Bytecode cache")
        self.run_installer("--target", "codex")
        installed = self.target() / "design-interface"
        self.assertFalse((installed / ".DS_Store").exists())
        self.assertFalse((installed / "scripts/__pycache__").exists())

    def test_symlink_destination_is_untouched(self):
        foreign = self.root / "foreign"
        foreign.mkdir()
        self.target().mkdir(parents=True)
        link = self.target() / "design-interface"
        try:
            link.symlink_to(foreign, target_is_directory=True)
        except (OSError, NotImplementedError):
            self.skipTest("Symbolic links are unavailable on this platform")
        result = self.run_installer("--target", "codex", succeeds=False)
        self.assertIn("symbolic link", result.stderr)
        self.assertTrue(link.is_symlink())
        self.assertFalse(any(foreign.iterdir()))

    def test_failed_replacement_rolls_back_previous_version(self):
        self.run_installer("--target", "codex")
        original_rename = Path.rename
        failed = False

        def fail_once(path, target):
            nonlocal failed
            if path.name == "clarify-interface" and path.parent.name == "new" and not failed:
                failed = True
                raise OSError("Simulated interrupted replacement")
            return original_rename(path, target)

        args = type("Args", (), {"target": "codex", "home": self.home,
                                  "uninstall": False, "dry_run": False})()
        self.manifest(UPDATE_VERSION)
        with patch.object(INSTALLER, "PACKAGE_ROOT", self.package), patch.object(Path, "rename", fail_once):
            with self.assertRaises(OSError):
                INSTALLER.install(args)
        for name in INSTALLER.SKILLS:
            self.assertEqual(INSTALLER.installed_state(self.target() / name, name)["version"], INITIAL_VERSION)
        self.assertFalse(any(self.target().glob(".ux-designer-stage-*")))

    def test_upgrade_six_modules_to_seven_and_remove(self):
        self.install_legacy()
        self.manifest(PACKAGE_VERSION)
        self.run_installer("--target", "both")
        self.run_installer("--target", "both")
        for target in ("codex", "claude"):
            root = self.target(target)
            self.assertEqual({path.name for path in root.iterdir()}, set(INSTALLER.SKILLS))
            for name in INSTALLER.SKILLS:
                state = INSTALLER.installed_state(root / name, name)
                self.assertEqual(state["version"], PACKAGE_VERSION)
                self.assertEqual((root / name / "SKILL.md").read_bytes(),
                                 (self.package / "skills" / name / "SKILL.md").read_bytes())
            self.assert_modules_found(root)
            self.assertFalse((root / "design-interface/references/legacy-only.md").exists())
        self.run_installer("--target", "both", "--uninstall")
        for target in ("codex", "claude"):
            self.assertFalse(any(self.target(target).iterdir()))

    def test_new_module_conflict_preserves_both_legacy_installations(self):
        self.install_legacy()
        foreign = self.target("claude") / "research-interface"
        foreign.mkdir()
        (foreign / "SKILL.md").write_text("An independently managed skill.\n", encoding="utf-8")
        before = {target: self.installed_files(target) for target in ("codex", "claude")}
        self.manifest(PACKAGE_VERSION)
        result = self.run_installer("--target", "both", succeeds=False)
        self.assertIn("not owned", result.stderr)
        for target, files in before.items():
            self.assertEqual(self.installed_files(target), files)
        self.assertFalse((self.target("codex") / "research-interface").exists())

    def test_legacy_local_edit_prevents_upgrade(self):
        self.install_legacy()
        edited = self.target("claude") / "plan-interface/SKILL.md"
        edited.write_text(edited.read_text(encoding="utf-8") + "\nKeep my local instruction.\n",
                          encoding="utf-8")
        before = {target: self.installed_files(target) for target in ("codex", "claude")}
        self.manifest(PACKAGE_VERSION)
        result = self.run_installer("--target", "both", succeeds=False)
        self.assertIn("Local changes", result.stderr)
        for target, files in before.items():
            self.assertEqual(self.installed_files(target), files)
            self.assertFalse((self.target(target) / "research-interface").exists())

    def test_failed_migration_restores_six_modules_in_both_clients(self):
        self.install_legacy()
        before = {target: self.installed_files(target) for target in ("codex", "claude")}
        self.manifest(PACKAGE_VERSION)
        original_rename = Path.rename
        failed = False

        def fail_once(path, target):
            nonlocal failed
            if (path.name == "check-interface" and path.parent.name == "new"
                    and self.target("claude") in path.parents and not failed):
                failed = True
                raise OSError("Simulated interrupted migration")
            return original_rename(path, target)

        args = type("Args", (), {"target": "both", "home": self.home,
                                  "uninstall": False, "dry_run": False})()
        with patch.object(INSTALLER, "PACKAGE_ROOT", self.package), patch.object(Path, "rename", fail_once):
            with self.assertRaises(OSError):
                INSTALLER.install(args)
        self.assertTrue(failed)
        for target, files in before.items():
            root = self.target(target)
            self.assertEqual(self.installed_files(target), files)
            self.assertEqual({path.name for path in root.iterdir()}, set(LEGACY_SKILLS))


if __name__ == "__main__":
    unittest.main()

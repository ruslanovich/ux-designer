"""Exercise real installation lifecycles in temporary home directories."""
from __future__ import annotations

import importlib.util
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
        self.manifest("0.1.0")

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

    def test_install_both_and_locate_all_modules(self):
        self.run_installer("--target", "both")
        for target in ("codex", "claude"):
            root = self.target(target)
            for name in INSTALLER.SKILLS:
                self.assertTrue((root / name / "SKILL.md").is_file())
                self.assertIsNotNone(INSTALLER.installed_state(root / name, name))
            result = subprocess.run(
                [sys.executable, str(root / "design-interface/scripts/locate_modules.py")],
                text=True, capture_output=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            modules = json.loads(result.stdout)["modules"]
            self.assertEqual(len(modules), 5)
            self.assertTrue(all(item["status"] == "found" for item in modules.values()))
            self.assertFalse(any(root.glob(".ux-designer-stage-*")))
            self.assertFalse((root / INSTALLER.LOCK).exists())

    def test_rerun_update_removes_obsolete_files_and_uninstall(self):
        obsolete = self.package / "skills/design-interface/references/obsolete.txt"
        obsolete.write_text("Old package content", encoding="utf-8")
        self.run_installer("--target", "codex")
        self.run_installer("--target", "codex")
        obsolete.unlink()
        self.manifest("0.2.0")
        self.run_installer("--target", "codex")
        lead = self.target() / "design-interface"
        self.assertFalse((lead / "references/obsolete.txt").exists())
        self.assertEqual(INSTALLER.installed_state(lead, "design-interface")["version"], "0.2.0")
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
        self.manifest("0.2.0")
        for operation in ([], ["--uninstall"]):
            result = self.run_installer("--target", "both", *operation, succeeds=False)
            self.assertIn("Local changes", result.stderr)
            self.assertIn("My local changes", edited.read_text())
            state = INSTALLER.installed_state(self.target() / "design-interface", "design-interface")
            self.assertEqual(state["version"], "0.1.0")

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
        self.manifest("0.2.0")
        with patch.object(INSTALLER, "PACKAGE_ROOT", self.package), patch.object(Path, "rename", fail_once):
            with self.assertRaises(OSError):
                INSTALLER.install(args)
        for name in INSTALLER.SKILLS:
            self.assertEqual(INSTALLER.installed_state(self.target() / name, name)["version"], "0.1.0")
        self.assertFalse(any(self.target().glob(".ux-designer-stage-*")))


if __name__ == "__main__":
    unittest.main()

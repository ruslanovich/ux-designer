#!/usr/bin/env python3
"""Validate and build a reproducible UX Designer plugin archive."""
from __future__ import annotations

import argparse
import hashlib
import json
import stat
import subprocess
import sys
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]


def package_files() -> list[Path]:
    files = [ROOT / name for name in (
        "plugin.json", ".claude-plugin/plugin.json", ".codex-plugin/plugin.json", "LICENSE",
    )]
    for folder in (ROOT / "skills", ROOT / "assets"):
        for path in sorted(folder.rglob("*")):
            relative = path.relative_to(folder)
            if any(part.startswith(".") or part == "__pycache__" for part in relative.parts):
                continue
            if path.suffix in (".pyc", ".pyo"):
                continue
            if path.is_symlink():
                raise ValueError(f"Symbolic links cannot be packaged: {path}")
            if path.is_file():
                files.append(path)
    return sorted(files, key=lambda path: path.relative_to(ROOT).as_posix())


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=ROOT / "dist")
    args = parser.parse_args()
    subprocess.run([sys.executable, str(ROOT / "scripts/validate.py"), str(ROOT)], check=True)
    manifest = json.loads((ROOT / "plugin.json").read_text(encoding="utf-8"))
    output = args.output_dir.expanduser().resolve()
    output.mkdir(parents=True, exist_ok=True)
    archive = output / f"ux-designer-{manifest['version']}.zip"
    expected = []
    with ZipFile(archive, "w", compression=ZIP_DEFLATED, compresslevel=9) as package:
        for path in package_files():
            relative = path.relative_to(ROOT).as_posix()
            name = "ux-designer/" + relative
            info = ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = (stat.S_IFREG | 0o644) << 16
            info.compress_type = ZIP_DEFLATED
            package.writestr(info, path.read_bytes(), compresslevel=9)
            expected.append(name)
    with ZipFile(archive) as package:
        if package.testzip() is not None or package.namelist() != expected:
            raise ValueError("Archive verification failed")
        for skill in (ROOT / "skills").iterdir():
            if (skill / "SKILL.md").is_file():
                if f"ux-designer/skills/{skill.name}/SKILL.md" not in package.namelist():
                    raise ValueError(f"Archive is missing skill {skill.name}")
    checksum = hashlib.sha256(archive.read_bytes()).hexdigest()
    archive.with_suffix(archive.suffix + ".sha256").write_text(
        f"{checksum}  {archive.name}\n", encoding="utf-8"
    )
    print(f"Built {archive.name}: {len(expected)} files, {archive.stat().st_size} bytes")
    print(f"SHA-256: {checksum}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        print(f"Error: {error}", file=sys.stderr)
        raise SystemExit(1)

#!/usr/bin/env python3
"""Prepare one isolated behavioral task without copying the evaluator rubric."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--package', required=True, type=Path)
    parser.add_argument('--case', required=True)
    parser.add_argument('--destination', required=True, type=Path)
    args = parser.parse_args()
    cases = json.loads((ROOT / 'cases.json').read_text())
    case = next((x for x in cases if x['id'] == args.case), None)
    if case is None:
        parser.error('Unknown case; see cases.json.')
    target = args.destination.resolve()
    if target.exists():
        parser.error('Destination must be new; preserve earlier runs.')
    package = args.package.resolve() / 'skills'
    if not (package / case['entry'] / 'SKILL.md').is_file():
        parser.error('Package does not contain the requested entry skill.')
    target.mkdir(parents=True)
    shutil.copytree(package, target / 'skills', ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
    project = target / 'project'
    fixture = ROOT / 'fixtures' / case['fixture']
    if fixture.is_dir():
        shutil.copytree(fixture, project)
    else:
        project.mkdir()
        shutil.copy2(fixture, project / 'BRIEF.md')
    task = ('Use the local skill at ' + str(target / 'skills' / case['entry'] / 'SKILL.md')
            + '. Work in ' + str(project) + '.\n\n' + case['prompt']
            + '\n\nRead the supplied project material. Keep changes within this project and leave the skill files unchanged. '
            + 'Finish with the delivered result, key decisions, and checks actually performed.\n')
    (target / 'TASK.md').write_text(task)
    print(json.dumps({'directory': str(target), 'task': str(target / 'TASK.md'),
                      'project': str(project), 'case': case['id'],
                      'fixture_sha256': hashlib.sha256(b''.join(p.relative_to(project).as_posix().encode()+b'\0'+p.read_bytes() for p in sorted(project.rglob('*')) if p.is_file())).hexdigest()}, indent=2))

if __name__ == '__main__':
    main()

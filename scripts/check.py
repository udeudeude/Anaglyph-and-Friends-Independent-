"""Run meaningful retained regressions and independent integration checks."""
from pathlib import Path
import subprocess, sys
root = Path(__file__).resolve().parents[1]
for test in sorted((root / 'backend').glob('test_*.py')):
 subprocess.run([sys.executable, str(test)], cwd=root, check=True)
for test in sorted((root / 'frontend/src').glob('*.test.mjs')):
 subprocess.run(['node', '--experimental-strip-types', str(test)], cwd=root/'frontend', check=True)
subprocess.run([sys.executable, str(root/'macos/test_desktop.py')], check=True)

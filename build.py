"""Build a standalone desktop app with PyInstaller.

Usage:  python build.py
Output: dist/Pomodoro (.exe on Windows, app binary on macOS/Linux)

PyInstaller does not cross-compile: run this on the OS you are building for
(or use the GitHub Actions workflow, which builds for Windows, macOS and Linux).
"""

import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SEP = ";" if os.name == "nt" else ":"

cmd = [
    sys.executable, "-m", "PyInstaller",
    "--noconfirm",
    "--clean",
    "--onefile",
    "--windowed",                       # no console window
    "--name", "Pomodoro",
    "--icon", os.path.join(HERE, "web", "favicon.ico"),
    "--add-data", os.path.join(HERE, "web") + SEP + "web",
    os.path.join(HERE, "main.py"),
]
print(" ".join(cmd))
sys.exit(subprocess.call(cmd, cwd=HERE))

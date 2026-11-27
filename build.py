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
IS_MAC = sys.platform == "darwin"

cmd = [
    sys.executable, "-m", "PyInstaller",
    "--noconfirm",
    "--clean",
    # macOS apps are folders (.app), so a single-file build does not apply there.
    "--onedir" if IS_MAC else "--onefile",
    "--windowed",                       # no console window
    "--name", "Pomodoro",
    "--add-data", os.path.join(HERE, "web") + SEP + "web",
    os.path.join(HERE, "main.py"),
]
if not IS_MAC:  # .ico works on Windows; macOS would need a different (.icns) file
    cmd[cmd.index("--add-data"):cmd.index("--add-data")] = ["--icon", os.path.join(HERE, "web", "favicon.ico")]
print(" ".join(cmd))
sys.exit(subprocess.call(cmd, cwd=HERE))

"""Pomodoro mini app - desktop launcher.

Opens web/index.html in a small standalone (app-mode) window using Eel.
Works both from source (`python main.py`) and when bundled with PyInstaller.
"""

import os
import signal
import sys

import eel

# Window size (outer size, includes the title bar). The page content is about
# 320x405, so this leaves just enough room for the title bar.
WINDOW_SIZE = (320, 445)


def resource_path(relative):
    """Return the absolute path to a bundled resource (works with PyInstaller)."""
    base = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base, relative)


def quit_app(*_args):
    """Stop the whole process (used for Ctrl+C and for window close)."""
    os._exit(0)


def on_close(page, sockets):
    """Called by Eel when the app window is closed."""
    quit_app()


def start(mode):
    eel.start(
        "index.html",
        mode=mode,
        size=WINDOW_SIZE,
        port=0,  # pick any free port so the app never clashes with another one
        cmdline_args=["--window-size=%d,%d" % WINDOW_SIZE],
        close_callback=on_close,
    )


def main():
    signal.signal(signal.SIGINT, quit_app)
    eel.init(resource_path("web"))

    # Prefer a standalone app window (Chrome, then Edge). Fall back to the
    # default browser if neither is installed, so the app still opens.
    for mode in ("chrome", "edge", "default"):
        try:
            start(mode)
            return
        except EnvironmentError:
            continue


if __name__ == "__main__":
    try:
        main()
    except (SystemExit, KeyboardInterrupt):
        quit_app()

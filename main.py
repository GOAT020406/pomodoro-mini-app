import os
import signal
import sys

import eel


@eel.expose
def close_app():
    print("\n[INFO] User closed the Pomodoro app.")
    os._exit(0)


def exit_gracefully(sig=None, frame=None):
    print("\n[INFO] Ctrl+C received. Closing Pomodoro App...")
    os._exit(0)


signal.signal(signal.SIGINT, exit_gracefully)

eel.init('web')

print("[INFO] Launching Pomodoro Desktop App...")

try:
    eel.start('index.html', size=(380, 520), close_callback=lambda page, sockets: close_app())
except (SystemExit, KeyboardInterrupt):
    print("[INFO] Pomodoro App closed cleanly.")
    sys.exit(0)
except Exception as exc:
    print(f"[ERROR] Failed to start app: {exc}")
    raise


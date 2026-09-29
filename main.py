
import eel
import os
from pathlib import Path
import signal
import sys



def exit_gracefully(sig, frame):
    os._exit(0)


signal.signal(signal.SIGINT, exit_gracefully)

app_directory = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
eel.init(str(app_directory / "web"))


@eel.expose
def close_app():
    os._exit(0)

print("[INFO] Launching Pomodoro Desktop App...")

try:
    # Explicitly set compact width and height in pixels
    eel.start(
        'index.html',
        size=(350, 520),
        port=0,
        cmdline_args=['--window-size=350,520', '--force-device-scale-factor=1'],
        close_callback=lambda p, s: os._exit(0)
    )
except (SystemExit, KeyboardInterrupt):
    print("[INFO] Pomodoro App closed cleanly.")
    sys.exit(0)
except Exception as exc:
    print(f"[ERROR] Failed to start app: {exc}")
    raise



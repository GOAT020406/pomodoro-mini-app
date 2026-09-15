import eel
import os
import signal

# Clean exit handler that forces a true 0 exit code
def exit_gracefully(sig, frame):
    print("\n[INFO] Closing Pomodoro App...")
    os._exit(0)  # Immediately exits with code 0 (Success)

# Intercept Ctrl+C / SIGINT
signal.signal(signal.SIGINT, exit_gracefully)

eel.init('web')

print("[INFO] Launching Pomodoro Desktop App...")

try:
    eel.start('index.html', size=(380, 520), close_callback=lambda page, sockets: os._exit(0))
except (SystemExit, KeyboardInterrupt):
    os._exit(0)
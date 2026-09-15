import eel
import sys
import signal

# Clean exit handler
def exit_gracefully(sig, frame):
    print("\n[INFO] Closing Pomodoro App...")
    sys.exit(0)

# Intercept Ctrl+C / interrupt signals
signal.signal(signal.SIGINT, exit_gracefully)

# 1. Initialize web directory
eel.init('web')

# 2. Print startup status
print("[INFO] Launching Pomodoro Desktop App...")

try:
    # 3. Start window (Blocking call)
    eel.start('index.html', size=(380, 520))
    print("\n[INFO] App window closed by user.")
except (SystemExit, KeyboardInterrupt):
    print("\n[INFO] Exiting Pomodoro App cleanly.")
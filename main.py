import signal

import eel
import os

import sys

eel.init('web')

def exit_gracefully(sig, frame):
    os._exit(0)


signal.signal(signal.SIGINT, exit_gracefully)





@eel.expose
def close_app():
    os._exit(0)

def on_close(page, sockets):
    # Force-kill the entire Python process immediately when window closes
    os._exit(0)

print("[INFO] Launching Pomodoro Desktop App...")


try:


    eel.start(
        'index.html',
        size=(350, 520),
        port=0,
        cmdline_args=['--window-size=350,520', '--force-device-scale-factor=1'],
        close_callback=on_close
    )
except (SystemExit, KeyboardInterrupt):
    os._exit(0)
finally:
    os._exit(0)
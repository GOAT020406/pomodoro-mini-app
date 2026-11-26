import os
import signal

import eel


eel.init("web")





def exit_gracefully(sig, frame):
    print("\n[INFO] App closed function triggered. Stopping app...", flush=True)
    os._exit(0)



signal.signal(signal.SIGINT, exit_gracefully)






@eel.expose
def close_app():
    print("[INFO] App closed function triggered. Stopping app...", flush=True)
    os._exit(0)


def on_close(page, sockets):
    print("[INFO] App closed function triggered. Stopping app...", flush=True)
    os._exit(0)

def main():
    print("[INFO] Launching Pomodoro App...", flush=True)
    try:
        eel.start(
            "index.html",
            size=(350, 520),
            port=0,
            cmdline_args=["--window-size=350,520", "--force-device-scale-factor=1"],
            close_callback=on_close,
        )
    except (SystemExit, KeyboardInterrupt):
        print("[INFO] App closed function triggered. Stopping app...", flush=True)
        os._exit(0)
    finally:
        os._exit(0)


if __name__ == "__main__":
    main()
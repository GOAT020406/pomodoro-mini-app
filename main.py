import os
import signal

import eel


def handle_sigint(sig, frame):
    os._exit(0)


signal.signal(signal.SIGINT, handle_sigint)


def on_close(page, sockets):

    os._exit(0)


def main():
    eel.init("web")
    try:
        eel.start(
            "index.html",
            size=(320, 475),
            port=0,
            cmdline_args=["--window-size=320,475"],
            close_callback=on_close,
        )
    except (SystemExit, KeyboardInterrupt):
 
        os._exit(0)


if __name__ == "__main__":
    main()
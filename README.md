# Pomodoro Mini App

A small Pomodoro timer with adjustable session and break lengths, a snooze
button and an alarm. It runs two ways from the same code:

- **Web app / PWA** – the `web/` folder, hosted on GitHub Pages. Installable from the browser and works offline.
- **Desktop app** – `main.py` opens the same page in a small standalone window using [Eel](https://github.com/python-eel/Eel).

## Run the desktop app from source

```bash
pip install -r requirements.txt
python main.py
```

Needs Google Chrome or Microsoft Edge (Edge ships with Windows 10/11). If neither is found, it opens in your default browser instead.

## Run the web version locally

```bash
python -m http.server 8000 --directory web
```

Then open <http://localhost:8000>.

## Build a standalone desktop app

```bash
pip install -r requirements-dev.txt
python build.py
```

The result is in `dist/`. PyInstaller builds for the OS you run it on, so build on Windows for a Windows `.exe`. Pushing a tag such as `v1.0.0` (or running the **Build desktop app** workflow) builds Windows, macOS and Linux versions on GitHub and attaches them to a release.

## Publish the web app

In the repository: **Settings → Pages → Source: GitHub Actions**. After that every push to `main` deploys `web/` to `https://<your-username>.github.io/pomodoro-mini-app/`.

## How to use

- **Start / Pause** – start or pause the countdown.
- **Reset** – back to a fresh session.
- **Snooze** – enabled while the alarm rings; stops the alarm sound (the timer keeps running).
- **+ / −** – change break and session length (1–60 minutes) while the timer is stopped.

## License

See [LICENSE](LICENSE).

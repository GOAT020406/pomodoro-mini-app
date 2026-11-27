// ---------------------------------------------------------------
// Pomodoro timer
// The timer is timestamp based (endAt), so it stays accurate even if
// the window is in the background and the browser throttles timers.
// ---------------------------------------------------------------

// --- 1. STATE ---
const MIN_LENGTH = 1;
const MAX_LENGTH = 60;
const SNOOZE_SECONDS = 2 * 60;
const MAX_RING_MS = 30 * 1000;   // alarm rings at most this long

let sessionMins = 25;
let breakMins = 5;
let isWorkPhase = true;          // true = Session, false = Break
let remaining = sessionMins * 60; // seconds left (exact while paused)
let endAt = 0;                   // timestamp (ms) when the phase ends
let timerId = null;              // setInterval handle (null = paused)
let ringing = false;             // alarm is currently sounding
let ringTimeoutId = null;

// --- 2. DOM ---
const timerDisplay = document.getElementById('timer-display');
const phaseLabel = document.getElementById('phase-label');
const startBtn = document.getElementById('start-btn');
const snoozeBtn = document.getElementById('snooze-btn');
const resetBtn = document.getElementById('reset-btn');
const breakVal = document.getElementById('break-val');
const sessionVal = document.getElementById('session-val');

const alarmSound = new Audio('alarm.mp3');
alarmSound.preload = 'auto';
alarmSound.loop = true;

const isRunning = () => timerId !== null;
const phaseSeconds = () => (isWorkPhase ? sessionMins : breakMins) * 60;

// --- 3. DISPLAY ---
function render() {
    const m = Math.floor(remaining / 60).toString().padStart(2, '0');
    const s = (remaining % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
    phaseLabel.textContent = isWorkPhase ? 'SESSION' : 'BREAK';
    startBtn.textContent = isRunning() ? 'Pause' : 'Start';
    snoozeBtn.disabled = !ringing;
    document.title = isRunning()
        ? `${m}:${s} • ${isWorkPhase ? 'Session' : 'Break'}`
        : 'Pomodoro Timer';
}

// --- 4. ALARM ---
function startRinging() {
    ringing = true;
    alarmSound.currentTime = 0;
    alarmSound.play().catch((err) => console.log('Audio play error:', err));
    clearTimeout(ringTimeoutId);
    ringTimeoutId = setTimeout(stopRinging, MAX_RING_MS);
}

function stopRinging() {
    if (!ringing) return;
    ringing = false;
    clearTimeout(ringTimeoutId);
    alarmSound.pause();
    alarmSound.currentTime = 0;
    render();
}

// --- 5. TICK ---
function secondsLeft() {
    return Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
}

function tick() {
    remaining = secondsLeft();
    if (remaining === 0) {
        // Phase finished: ring and move on to the next phase.
        isWorkPhase = !isWorkPhase;
        remaining = phaseSeconds();
        endAt = Date.now() + remaining * 1000;
        startRinging();
    }
    render();
}

// --- 6. START / PAUSE ---
function toggleTimer() {
    stopRinging();
    if (isRunning()) {
        remaining = secondsLeft();
        clearInterval(timerId);
        timerId = null;
    } else {
        endAt = Date.now() + remaining * 1000;
        timerId = setInterval(tick, 250);
    }
    render();
}

// --- 7. SNOOZE ---
// While the alarm rings, go back to the phase that just ended for 2 more minutes.
function snoozeTimer() {
    if (!ringing) return;
    stopRinging();
    isWorkPhase = !isWorkPhase;
    remaining = SNOOZE_SECONDS;
    endAt = Date.now() + remaining * 1000;
    render();
}

// --- 8. RESET ---
function resetTimer() {
    stopRinging();
    clearInterval(timerId);
    timerId = null;
    isWorkPhase = true;
    remaining = sessionMins * 60;
    render();
}

// --- 9. LENGTH ADJUSTMENT ---
function changeLength(type, delta) {
    if (isRunning()) return; // lengths are locked while the clock runs

    if (type === 'session') {
        const next = sessionMins + delta;
        if (next < MIN_LENGTH || next > MAX_LENGTH) return;
        sessionMins = next;
        sessionVal.textContent = sessionMins;
        if (isWorkPhase) remaining = sessionMins * 60;
    } else {
        const next = breakMins + delta;
        if (next < MIN_LENGTH || next > MAX_LENGTH) return;
        breakMins = next;
        breakVal.textContent = breakMins;
        if (!isWorkPhase) remaining = breakMins * 60;
    }
    render();
}

// --- 10. EVENTS ---
startBtn.addEventListener('click', toggleTimer);
snoozeBtn.addEventListener('click', snoozeTimer);
resetBtn.addEventListener('click', resetTimer);

document.querySelectorAll('.btn-adjust').forEach((btn) => {
    btn.addEventListener('click', () => {
        changeLength(btn.dataset.target, Number(btn.dataset.delta));
    });
});

// --- 11. OFFLINE SUPPORT (web version only) ---
// The desktop app (Eel) serves files from disk, so it does not need the
// service worker. `eel` only exists there.
const isDesktopApp = typeof eel !== 'undefined';
if ('serviceWorker' in navigator && !isDesktopApp && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
            console.error('Service worker registration failed:', err);
        });
    });
}

render();

// --- 1. STATE VARIABLES ---
let sessionMins = 25;
let breakMins = 5;
let timeLeft = sessionMins * 60; // Total seconds remaining
let timerId = null;              // Holds the interval reference
let isWorkPhase = true;          // Track whether it's Session or Break mode

// --- 2. DOM ELEMENTS ---
const timerDisplay = document.getElementById('timer-display');
const sessionLabel = document.querySelector('.session-label');
const startBtn = document.getElementById('start-btn');
const snoozeBtn = document.getElementById('snooze-btn');
const resetBtn = document.getElementById('reset-btn');
const alarmSound = new Audio('alarm.mp3');
alarmSound.preload = 'auto';

// --- 3. DISPLAY FUNCTION ---
// Formats total seconds into MM:SS and updates the LCD screen
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// --- 4. START / PAUSE LOGIC ---
function toggleTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = 'Start';
        return;
    }

    startBtn.textContent = 'Pause';
    
    timerId = setInterval(() => {
        // 1. If time is already at 0, switch phases now
        if (timeLeft === 0) {
            // PLAY ALARM
            if (typeof alarmSound !== 'undefined') {
                alarmSound.currentTime = 0; // Reset sound to beginning
                alarmSound.play().catch(err => console.log("Audio play error:", err));
            }

            // Switch Phase
            if (isWorkPhase) {
                isWorkPhase = false;
                sessionLabel.textContent = 'BREAK';
                timeLeft = breakMins * 60;
            } else {
                isWorkPhase = true;
                sessionLabel.textContent = 'SESSION';
                timeLeft = sessionMins * 60;
            }

            updateDisplay();
            return; // Wait for next second tick before decrementing
        }

        // 2. Count down by 1 second
        timeLeft--;
        updateDisplay();

    }, 1000);
}

// --- SNOOZE LOGIC ---
function snoozeTimer() {
    // Add 2 minutes (120 seconds) to the current remaining time
    const snoozeMinutes = 2;
    timeLeft += snoozeMinutes * 60;
    
    // Update the LCD display immediately with the new time
    updateDisplay();

    // If alarm sound is playing, silence it when snoozed
    if (typeof alarmSound !== 'undefined') {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }
}

// --- 5. RESET LOGIC ---
function resetTimer() {
    // Stop the interval loop
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
    
    // Reset state back to initial session defaults
    isWorkPhase = true;
    sessionLabel.textContent = 'SESSION';
    timeLeft = sessionMins * 60;
    startBtn.textContent = 'Start';
    updateDisplay();
}

// --- 6. ADJUSTMENT LOGIC (PLUS / MINUS) ---
function changeTime(type, amount) {
    // Prevent changing lengths while the clock is actively running
    if (timerId !== null) return;

    if (type === 'session') {
        if (sessionMins + amount >= 1 && sessionMins + amount <= 60) {
            sessionMins += amount;
            // Target the session length display span
            document.querySelectorAll('.length-val')[1].textContent = sessionMins;
            
            if (isWorkPhase) {
                timeLeft = sessionMins * 60;
                updateDisplay();
            }
        }
    } else if (type === 'break') {
        if (breakMins + amount >= 1 && breakMins + amount <= 60) {
            breakMins += amount;
            // Target the break length display span
            document.querySelectorAll('.length-val')[0].textContent = breakMins;
            
            if (!isWorkPhase) {
                timeLeft = breakMins * 60;
                updateDisplay();
            }
        }
    }
}


// --- UPDATED EVENT LISTENERS ---


// --- 7. EVENT LISTENERS ---
startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
snoozeBtn.addEventListener('click', snoozeTimer); // Attached Snooze listener

// Connect the plus/minus buttons dynamically
const adjustButtons = document.querySelectorAll('.btn-adjust');
adjustButtons[0].addEventListener('click', () => changeTime('break', -1)); // Break -
adjustButtons[1].addEventListener('click', () => changeTime('break', 1));  // Break +
adjustButtons[2].addEventListener('click', () => changeTime('session', -1)); // Session -
adjustButtons[3].addEventListener('click', () => changeTime('session', 1));  // Session +

// Initial setup on page load
updateDisplay();
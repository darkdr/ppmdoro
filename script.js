(function () {
  "use strict";
  function buildUI() {
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --bg: #0f172a;
        --panel: #111827;
        --text: #e5e7eb;
        --muted: #9ca3af;
        --primary: #22c55e;
        --danger: #ef4444;
        --accent: #38bdf8;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: radial-gradient(60% 60% at 50% 40%, #111827 0%, var(--bg) 60%);
        color: var(--text);
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji";
      }
      .app {
        width: min(92vw, 720px);
        background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 16px;
        backdrop-filter: blur(6px);
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      }
      header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      h1 { font-size: 20px; margin: 0; font-weight: 700; letter-spacing: 0.4px; }
      .mode-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
      .mode-tabs button {
        background: transparent;
        color: var(--muted);
        border: 1px solid rgba(255,255,255,0.08);
        padding: 8px 12px;
        border-radius: 999px;
        cursor: pointer;
      }
      .mode-tabs button.active { color: var(--text); border-color: var(--accent); box-shadow: 0 0 0 2px rgba(56,189,248,0.15) inset; }
      .timer { display: grid; place-items: center; padding: 24px 8px 12px; text-align: center; }
      .time { font-variant-numeric: tabular-nums; font-size: clamp(40px, 12vw, 96px); line-height: 1; letter-spacing: 2px; margin: 12px 0 8px; }
      .subtext { color: var(--muted); font-size: 13px; }
      .controls { display: flex; justify-content: center; gap: 10px; margin: 14px 0 6px; flex-wrap: wrap; }
      .controls button { border: none; border-radius: 10px; padding: 10px 14px; cursor: pointer; color: #0b1020; font-weight: 700; }
      .primary { background: var(--primary); }
      .danger { background: var(--danger); color: white; }
      .ghost { background: rgba(255,255,255,0.08); color: var(--text); border: 1px solid rgba(255,255,255,0.08); }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 12px; }
      .card { background: var(--panel); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px; }
      .card h3 { margin: 0 0 8px; font-size: 14px; color: var(--muted); font-weight: 600; }
      .row { display: flex; align-items: center; gap: 8px; margin: 6px 0; }
      label { font-size: 13px; color: var(--muted); }
      input[type="number"] { width: 72px; padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.06); color: var(--text); }
      input[type="checkbox"] { transform: translateY(1px); }
      select { padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.06); color: var(--text); }
      footer { margin-top: 10px; text-align: center; color: var(--muted); font-size: 12px; }

      /* Force 25-minute simple mode: hide tabs, settings, and Skip button */
      .mode-tabs, .grid, #skipBtn { display: none !important; }
    `;
    document.head.appendChild(style);

    const app = document.createElement("div");
    app.className = "app";

    const header = document.createElement("header");
    const h1 = document.createElement("h1");
    h1.textContent = "Pomodoro";
    const modeTabs = document.createElement("div");
    modeTabs.className = "mode-tabs";
    modeTabs.id = "modeTabs";
    const btnWork = document.createElement("button");
    btnWork.dataset.mode = "work";
    btnWork.className = "active";
    btnWork.textContent = "Work";
    const btnShort = document.createElement("button");
    btnShort.dataset.mode = "short";
    btnShort.textContent = "Short break";
    const btnLong = document.createElement("button");
    btnLong.dataset.mode = "long";
    btnLong.textContent = "Long break";
    modeTabs.append(btnWork, btnShort, btnLong);
    header.append(h1, modeTabs);

    const timer = document.createElement("section");
    timer.className = "timer";
    const time = document.createElement("div");
    time.className = "time";
    time.id = "time";
    time.textContent = "25:00";
    const roundInfo = document.createElement("div");
    roundInfo.className = "subtext";
    roundInfo.id = "roundInfo";
    roundInfo.textContent = "Round 1 of 4";
    const controls = document.createElement("div");
    controls.className = "controls";
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "primary";
    toggleBtn.id = "toggleBtn";
    toggleBtn.textContent = "Start";
    const skipBtn = document.createElement("button");
    skipBtn.className = "ghost";
    skipBtn.id = "skipBtn";
    skipBtn.textContent = "Skip";
    const resetBtn = document.createElement("button");
    resetBtn.className = "danger";
    resetBtn.id = "resetBtn";
    resetBtn.textContent = "Reset";
    controls.append(toggleBtn, skipBtn, resetBtn);
    timer.append(time, roundInfo, controls);

    const grid = document.createElement("section");
    grid.className = "grid";

    const card1 = document.createElement("div");
    card1.className = "card";
    const h3a = document.createElement("h3");
    h3a.textContent = "Durations (minutes)";
    const row1 = document.createElement("div");
    row1.className = "row";
    const labWork = document.createElement("label");
    labWork.htmlFor = "workMin";
    labWork.textContent = "Work";
    const workMin = document.createElement("input");
    workMin.id = "workMin";
    workMin.type = "number";
    workMin.min = "1";
    workMin.max = "120";
    workMin.value = "25";
    const labShort = document.createElement("label");
    labShort.htmlFor = "shortMin";
    labShort.textContent = "Short";
    const shortMin = document.createElement("input");
    shortMin.id = "shortMin";
    shortMin.type = "number";
    shortMin.min = "1";
    shortMin.max = "60";
    shortMin.value = "5";
    const labLong = document.createElement("label");
    labLong.htmlFor = "longMin";
    labLong.textContent = "Long";
    const longMin = document.createElement("input");
    longMin.id = "longMin";
    longMin.type = "number";
    longMin.min = "1";
    longMin.max = "60";
    longMin.value = "15";
    row1.append(labWork, workMin, labShort, shortMin, labLong, longMin);

    const row2 = document.createElement("div");
    row2.className = "row";
    const labRounds = document.createElement("label");
    labRounds.htmlFor = "rounds";
    labRounds.textContent = "Rounds per set";
    const rounds = document.createElement("input");
    rounds.id = "rounds";
    rounds.type = "number";
    rounds.min = "1";
    rounds.max = "12";
    rounds.value = "4";
    row2.append(labRounds, rounds);

    const row3 = document.createElement("div");
    row3.className = "row";
    const labAuto = document.createElement("label");
    labAuto.htmlFor = "autoStart";
    labAuto.textContent = "Auto-start next";
    const autoStart = document.createElement("input");
    autoStart.id = "autoStart";
    autoStart.type = "checkbox";
    autoStart.checked = true;
    row3.append(labAuto, autoStart);
    card1.append(h3a, row1, row2, row3);

    const card2 = document.createElement("div");
    card2.className = "card";
    const h3b = document.createElement("h3");
    h3b.textContent = "Extras";
    const row4 = document.createElement("div");
    row4.className = "row";
    const labSound = document.createElement("label");
    labSound.htmlFor = "sound";
    labSound.textContent = "Sound";
    const sound = document.createElement("select");
    sound.id = "sound";
    const optNone = document.createElement("option");
    optNone.value = "none";
    optNone.text = "None";
    const optBell = document.createElement("option");
    optBell.value = "bell";
    optBell.text = "Bell";
    optBell.selected = true;
    const optBeep = document.createElement("option");
    optBeep.value = "beep";
    optBeep.text = "Beep";
    sound.append(optNone, optBell, optBeep);
    const testSound = document.createElement("button");
    testSound.className = "ghost";
    testSound.id = "testSound";
    testSound.textContent = "Test";
    row4.append(labSound, sound, testSound);

    const row5 = document.createElement("div");
    row5.className = "row";
    const labNotify = document.createElement("label");
    labNotify.htmlFor = "notify";
    labNotify.textContent = "Desktop notifications";
    const notify = document.createElement("input");
    notify.id = "notify";
    notify.type = "checkbox";
    row5.append(labNotify, notify);
    card2.append(h3b, row4, row5);

    grid.append(card1, card2);

    const footer = document.createElement("footer");
    footer.textContent = "Use Start/Pause to control the timer. Edit durations anytime; Reset to apply.";

    app.append(header, timer, grid, footer);
    document.body.appendChild(app);
  }

  buildUI();
  const timeEl = document.getElementById("time");
  const roundInfoEl = document.getElementById("roundInfo");
  const toggleBtn = document.getElementById("toggleBtn");
  const skipBtn = document.getElementById("skipBtn");
  const resetBtn = document.getElementById("resetBtn");
  const modeTabs = document.getElementById("modeTabs");

  const workMinInput = document.getElementById("workMin");
  const shortMinInput = document.getElementById("shortMin");
  const longMinInput = document.getElementById("longMin");
  const roundsInput = document.getElementById("rounds");
  const autoStartInput = document.getElementById("autoStart");

  const soundSelect = document.getElementById("sound");
  const testSoundBtn = document.getElementById("testSound");
  const notifyInput = document.getElementById("notify");

  const Mode = {
    Work: "work",
    Short: "short",
    Long: "long",
  };

  const FIXED_MINUTES = 25;
  let mode = Mode.Work;
  let isRunning = false;
  let remainingSeconds = minutesToSeconds(FIXED_MINUTES);
  let completedRoundsInSet = 0; // completed work sessions in the current set
  let timerId = null;

  function getNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function minutesToSeconds(m) {
    return Math.max(0, Math.round(m * 60));
  }

  function formatTime(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60)
      .toString()
      .padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function setActiveTab(newMode) {
    Array.from(modeTabs.querySelectorAll("button")).forEach((b) => {
      b.classList.toggle("active", b.dataset.mode === newMode);
    });
  }

  function getDurationForMode(_) {
    return minutesToSeconds(FIXED_MINUTES);
  }

  function updateRoundInfo() {
    const roundsPerSet = Math.max(1, getNumber(roundsInput.value));
    const displayRound = Math.min(completedRoundsInSet + (mode === Mode.Work ? 1 : 0), roundsPerSet);
    roundInfoEl.textContent = `Round ${displayRound} of ${roundsPerSet}`;
  }

  function render() {
    timeEl.textContent = formatTime(remainingSeconds);
    updateRoundInfo();
    toggleBtn.textContent = isRunning ? "Pause" : "Start";
  }

  function clearTimer() {
    if (timerId != null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    const endAt = Date.now() + remainingSeconds * 1000 + 30; // small fudge
    timerId = setInterval(() => {
      const delta = Math.ceil((endAt - Date.now()) / 1000);
      remainingSeconds = Math.max(0, delta);
      render();
      if (remainingSeconds <= 0) {
        clearTimer();
        isRunning = false;
        handleTimerEnd();
      }
    }, 250);
    render();
  }

  function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearTimer();
    render();
  }

  function resetTimer(setMode = mode) {
    clearTimer();
    isRunning = false;
    mode = setMode;
    setActiveTab(mode);
    remainingSeconds = getDurationForMode(mode);
    render();
  }

  function nextModeAfterWork() {
    return Mode.Work; 
  }

  function handleTimerEnd() {
    playSound();
    notifyIfEnabled();
   
    isRunning = false;
    remainingSeconds = 0;
    render();
  }


  let audioCtx = null;
  function ensureAudioCtx() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
  }

  function playBeepPattern() {
    ensureAudioCtx();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain).connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.value = 880; // A5
      gain.gain.setValueAtTime(0.001, now + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.3, now + i * 0.2 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.18);
      osc.start(now + i * 0.2);
      osc.stop(now + i * 0.2 + 0.2);
    }
  }

  function playBellChord() {
    ensureAudioCtx();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const freqs = [523.251, 659.255, 783.991]; 
    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      osc.connect(gain).connect(audioCtx.destination);
      const startAt = now + idx * 0.03;
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.35, startAt + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.9);
      osc.start(startAt);
      osc.stop(startAt + 1.0);
    });
  }

  function playSound() {
    const choice = soundSelect.value;
    if (choice === "beep") return playBeepPattern();
    if (choice === "bell") return playBellChord();
    return undefined;
  }

  function requestNotificationPermissionIfNeeded() {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default" && notifyInput.checked) {
      Notification.requestPermission().catch(() => {});
    }
  }

  function notifyIfEnabled() {
    if (!notifyInput.checked) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    const title = mode === Mode.Work ? "Break time!" : "Back to work!";
    const body = mode === Mode.Work ? "Nice work. Enjoy a break." : "Let's focus again.";
    try {
      new Notification(title, { body });
    } catch (_) {
      
    }
  }

  
  toggleBtn.addEventListener("click", () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  skipBtn.addEventListener("click", () => {
    
  });

  resetBtn.addEventListener("click", () => {
    completedRoundsInSet = 0;
    resetTimer(Mode.Work);
  });

  
  modeTabs.addEventListener("click", () => {
    
  });

  [workMinInput, shortMinInput, longMinInput, roundsInput].forEach((el) => {
    el.addEventListener("change", () => {
      
    });
  });

  autoStartInput.addEventListener("change", () => {
   
  });

  testSoundBtn.addEventListener("click", () => playSound());

  notifyInput.addEventListener("change", () => {
    requestNotificationPermissionIfNeeded();
  });

  
  setActiveTab(mode);
  remainingSeconds = getDurationForMode(mode);
  render();

})();




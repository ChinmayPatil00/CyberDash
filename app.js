// Sci-Fi UI Logic and Web Audio API

// --- Synthetic Audio Generator ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(type = 'short') {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  if (type === 'short') {
    // A quick, high-tech click
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'alert') {
    // A low warning buzz
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
  }
}

// --- HUD Color Management ---
function applyHudColor(color) {
  const root = document.documentElement;
  if (color === 'red') {
    root.style.setProperty('--hud-color', '#ff2a2a');
    root.style.setProperty('--hud-glow', 'rgba(255, 42, 42, 0.4)');
  } else {
    // Default Cyan
    root.style.setProperty('--hud-color', '#00f0ff');
    root.style.setProperty('--hud-glow', 'rgba(0, 240, 255, 0.4)');
  }
}

// Load saved color preference
const savedColor = localStorage.getItem('hudColor') || 'cyan';
applyHudColor(savedColor);

// --- Initialization on DOM Load ---
document.addEventListener('DOMContentLoaded', () => {
  
  // Attach beep sounds to all hardware buttons
  const buttons = document.querySelectorAll('.hw-button');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Don't prevent default if it's a link, just play the sound
      playBeep('short');
      
      // If it's the color toggle buttons on settings page
      if (btn.id === 'btn-cyan') {
        localStorage.setItem('hudColor', 'cyan');
        applyHudColor('cyan');
        document.getElementById('btn-red').classList.remove('active');
        btn.classList.add('active');
      } else if (btn.id === 'btn-red') {
        localStorage.setItem('hudColor', 'red');
        applyHudColor('red');
        document.getElementById('btn-cyan').classList.remove('active');
        btn.classList.add('active');
        playBeep('alert'); // Play alert sound for red mode!
      }
    });
  });

  // Setup UI state for settings page toggles
  if (document.getElementById('btn-cyan')) {
    if (savedColor === 'red') {
      document.getElementById('btn-red').classList.add('active');
      document.getElementById('btn-cyan').classList.remove('active');
    }
  }

  // --- Simulated Comms Log (Settings Page) ---
  const commsLog = document.getElementById('comms-log');
  if (commsLog) {
    const messages = [
      "SENSOR: Magnetic anomaly detected in Sector 4.",
      "COMMAND: Maintain current heading.",
      "SYSTEM: Purging cache...",
      "SYSTEM: Cache purge complete.",
      "WARNING: Solar flare incoming in T-minus 4 minutes."
    ];
    let msgIndex = 0;
    
    setInterval(() => {
      if (msgIndex < messages.length) {
        const p = document.createElement('p');
        const now = new Date();
        const timeStr = `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]`;
        
        let msgText = messages[msgIndex];
        if (msgText.includes("WARNING")) {
          p.innerHTML = `${timeStr} <span style="color: var(--hud-alert);">${msgText}</span>`;
          playBeep('alert');
        } else {
          p.innerHTML = `${timeStr} ${msgText}`;
          playBeep('short');
        }
        
        // Insert before the blinking cursor
        commsLog.insertBefore(p, commsLog.lastElementChild);
        commsLog.scrollTop = commsLog.scrollHeight;
        msgIndex++;
      }
    }, 4000); // New message every 4 seconds
  }
});

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
    const baseFreq = 700 + Math.random() * 200; // Randomize pitch slightly between 700 and 900
    oscillator.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(baseFreq / 2, audioCtx.currentTime + 0.1);
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
      } else if (btn.classList.contains('toggle-btn')) {
        // Handle dashboard toggle buttons
        btn.classList.toggle('active');
        const span = btn.querySelector('span');
        if (span) {
          const text = span.innerText;
          if (btn.classList.contains('active')) {
            if (!text.includes(': ON')) span.innerText = text + ': ON';
          } else {
            span.innerText = text.replace(': ON', '');
          }
        }
        
        // Handle Environmental Triggers
        if (btn.id === 'btn-floodlights') {
          document.body.classList.toggle('env-floodlights');
        } else if (btn.id === 'btn-shields') {
          document.body.classList.toggle('env-shields');
        } else if (btn.id === 'btn-cam') {
          const rec = document.getElementById('rec-indicator');
          if (rec) rec.classList.toggle('active');
        } else if (btn.id === 'btn-doors') {
          // Play heavy clunk sound
          playBeep('alert');
          const radar = document.querySelector('.radar-container');
          if (radar) {
            if (btn.classList.contains('active')) {
              radar.style.borderColor = 'red';
            } else {
              radar.style.borderColor = 'var(--hud-color)';
            }
          }
        }
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

  // --- Manual Toggle (Index Page) ---
  const btnManual = document.getElementById('btn-manual');
  const manualPanel = document.getElementById('manual-panel');
  if (btnManual && manualPanel) {
    btnManual.addEventListener('click', () => {
      if (manualPanel.style.display === 'none') {
        manualPanel.style.display = 'block';
        btnManual.classList.add('active');
      } else {
        manualPanel.style.display = 'none';
        btnManual.classList.remove('active');
      }
    });
  }

  // --- Radar Mini-Game (Dashboard Page) ---
  const radarContainer = document.getElementById('radar-container');
  if (radarContainer) {
    let score = 0;
    const scoreDisplay = document.getElementById('radar-score');
    
    // Spawn anomaly every 2.5 seconds
    setInterval(() => {
      // Create dot
      const anomaly = document.createElement('div');
      anomaly.classList.add('anomaly');
      
      // Random position roughly within the circle (20% to 80% to avoid edges)
      const topPos = 20 + Math.random() * 60;
      const leftPos = 20 + Math.random() * 60;
      anomaly.style.top = `${topPos}%`;
      anomaly.style.left = `${leftPos}%`;
      
      radarContainer.appendChild(anomaly);
      playBeep('short'); // Soft beep on spawn
      
      // Handle Click (Resolve)
      anomaly.addEventListener('click', function() {
        if (!this.classList.contains('resolved')) {
          this.classList.add('resolved');
          playBeep('short');
          
          score += 10;
          if (scoreDisplay) scoreDisplay.innerText = score;
          
          // Remove after visual confirmation
          setTimeout(() => {
            if (this.parentNode === radarContainer) radarContainer.removeChild(this);
          }, 800);
        }
      });
      
      // Auto-remove if missed after 3 seconds
      setTimeout(() => {
        if (anomaly.parentNode === radarContainer && !anomaly.classList.contains('resolved')) {
          radarContainer.removeChild(anomaly);
        }
      }, 3000);
      
    }, 2500);
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
    }, 5000); // New message every 5 seconds
    
    // --- Interactive Terminal Logic ---
    const terminalInput = document.getElementById('terminal-input');
    if (terminalInput) {
      terminalInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          const cmd = this.value.trim().toLowerCase();
          if (cmd === '') return;
          
          this.value = '';
          
          // Print user command
          const p = document.createElement('p');
          p.innerHTML = `<span style="color: #fff;">>_ ${cmd}</span>`;
          commsLog.insertBefore(p, commsLog.lastElementChild);
          
          // Process command
          setTimeout(() => {
            const resp = document.createElement('p');
            const now = new Date();
            const timeStr = `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]`;
            
            if (cmd === '/status') {
              resp.innerHTML = `${timeStr} SYSTEM: All systems nominal. O2: 84%, PWR: 62%`;
              playBeep('short');
            } else if (cmd === '/ping') {
              resp.innerHTML = `${timeStr} SYSTEM: Pong. Latency 42ms.`;
              playBeep('short');
            } else if (cmd === '/override') {
              resp.innerHTML = `${timeStr} <span style="color: var(--hud-alert);">WARNING: Manual override protocols initiated. Ensure safety harnesses are secured.</span>`;
              playBeep('alert');
            } else if (cmd === '/clear') {
              commsLog.innerHTML = '<p>_ <span style="animation: blink 1s infinite;">|</span></p>';
              playBeep('short');
              return; // skip scroll
            } else {
              resp.innerHTML = `${timeStr} ERROR: Command not recognized.`;
              playBeep('short');
            }
            
            commsLog.insertBefore(resp, commsLog.lastElementChild);
            commsLog.scrollTop = commsLog.scrollHeight;
          }, 300);
          
          commsLog.scrollTop = commsLog.scrollHeight;
        }
      });
    }
  }
});

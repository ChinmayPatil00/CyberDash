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
    // A modern, soft sci-fi holographic blip
    oscillator.type = 'sine';
    const baseFreq = 1200 + Math.random() * 100; 
    oscillator.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.05);
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

  // --- Ambient White Noise Generator ---
  let noiseNode = null;
  const btnWhiteNoise = document.getElementById('btn-whitenoise');
  
  if (btnWhiteNoise) {
    btnWhiteNoise.addEventListener('click', () => {
      if (btnWhiteNoise.classList.contains('active')) {
        // Stop noise
        if (noiseNode) {
          noiseNode.stop();
          noiseNode.disconnect();
          noiseNode = null;
        }
        btnWhiteNoise.classList.remove('active');
      } else {
        // Play noise
        btnWhiteNoise.classList.add('active');
        const bufferSize = audioCtx.sampleRate * 2; // 2 seconds of noise
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = buffer;
        noiseNode.loop = true;
        
        // Filter the noise to sound like a spaceship hum (lowpass)
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.value = 0.2; // Keep it quiet
        
        noiseNode.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        
        noiseNode.start();
      }
    });
  }

  // --- Pomodoro Focus Timer ---
  const btnTimerStart = document.getElementById('btn-timer-start');
  const btnTimerReset = document.getElementById('btn-timer-reset');
  const timerText = document.getElementById('timer-text');
  const timerRing = document.getElementById('timer-ring');
  const timerStatus = document.getElementById('timer-status');
  
  let timerInterval = null;
  let timeLeft = 25 * 60; // 25 minutes in seconds
  const totalTime = 25 * 60;
  
  function updateTimerUI() {
    if (!timerText) return;
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    timerText.innerText = `${m}:${s}`;
    
    // Update SVG Ring (circumference is ~565.48)
    if (timerRing) {
      const offset = 565.48 - (timeLeft / totalTime) * 565.48;
      timerRing.style.strokeDashoffset = offset;
    }
  }

  function startTimer() {
    if (timerInterval) {
      // Pause
      clearInterval(timerInterval);
      timerInterval = null;
      btnTimerStart.innerHTML = '<i class="fas fa-play"></i> RESUME';
      if (timerStatus) timerStatus.innerText = "PAUSED";
      playBeep('short');
    } else {
      // Start
      btnTimerStart.innerHTML = '<i class="fas fa-pause"></i> PAUSE';
      if (timerStatus) timerStatus.innerText = "IN PROGRESS";
      playBeep('short');
      
      timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          btnTimerStart.innerHTML = '<i class="fas fa-play"></i> START';
          if (timerStatus) timerStatus.innerText = "COMPLETED";
          playBeep('alert');
          setTimeout(() => playBeep('alert'), 500);
          timeLeft = totalTime;
        }
      }, 1000);
    }
  }

  if (btnTimerStart) {
    btnTimerStart.addEventListener('click', startTimer);
    updateTimerUI();
  }
  
  if (btnTimerReset) {
    btnTimerReset.addEventListener('click', () => {
      playBeep('short');
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = null;
      timeLeft = totalTime;
      btnTimerStart.innerHTML = '<i class="fas fa-play"></i> START';
      if (timerStatus) timerStatus.innerText = "STANDBY";
      updateTimerUI();
    });
  }

  // --- Mission Objectives (Kanban Board) ---
  const taskInput = document.getElementById('task-input');
  const btnAddTask = document.getElementById('btn-add-task');
  const columns = document.querySelectorAll('.kanban-dropzone');
  
  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('cyberdash_tasks')) || [];
  
  function saveTasks() {
    localStorage.setItem('cyberdash_tasks', JSON.stringify(tasks));
  }
  
  function renderTasks() {
    columns.forEach(col => col.innerHTML = '');
    
    tasks.forEach(task => {
      const taskEl = document.createElement('div');
      taskEl.className = 'kanban-task';
      taskEl.draggable = true;
      taskEl.dataset.id = task.id;
      taskEl.innerText = task.text;
      
      const delBtn = document.createElement('i');
      delBtn.className = 'fas fa-times delete-btn';
      delBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
      });
      taskEl.appendChild(delBtn);
      
      // Drag events
      taskEl.addEventListener('dragstart', (e) => {
        taskEl.classList.add('dragging');
        e.dataTransfer.setData('text/plain', task.id);
      });
      taskEl.addEventListener('dragend', () => {
        taskEl.classList.remove('dragging');
      });
      
      // Append to correct column
      const targetCol = document.querySelector(`.kanban-col[data-status="${task.status}"] .kanban-dropzone`);
      if (targetCol) targetCol.appendChild(taskEl);
    });
  }
  
  if (btnAddTask && taskInput) {
    btnAddTask.addEventListener('click', () => {
      const text = taskInput.value.trim();
      if (text) {
        tasks.push({ id: Date.now().toString(), text, status: 'pending' });
        saveTasks();
        renderTasks();
        taskInput.value = '';
        playBeep('short');
      }
    });
    
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') btnAddTask.click();
    });
    
    // Setup Dropzones
    document.querySelectorAll('.kanban-col').forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.style.background = 'rgba(255,255,255,0.1)';
      });
      col.addEventListener('dragleave', () => {
        col.style.background = 'rgba(0,0,0,0.3)';
      });
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.style.background = 'rgba(0,0,0,0.3)';
        const id = e.dataTransfer.getData('text/plain');
        const task = tasks.find(t => t.id === id);
        if (task) {
          task.status = col.dataset.status;
          saveTasks();
          renderTasks();
          playBeep('short');
        }
      });
    });
    
    // Initial Render
    renderTasks();
  }

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

  // --- Live ISS Tracker (Open-Notify API) ---
  const radarContainer = document.getElementById('radar-container');
  const issBlip = document.getElementById('iss-blip');
  const issLoc = document.getElementById('iss-loc');
  const issLatLon = document.getElementById('iss-latlon');
  const issStatus = document.getElementById('iss-status');
  
  if (radarContainer && issBlip) {
    function fetchISS() {
      fetch('http://api.open-notify.org/iss-now.json')
        .then(res => res.json())
        .then(data => {
          if (data.message === 'success') {
            const lat = parseFloat(data.iss_position.latitude);
            const lon = parseFloat(data.iss_position.longitude);
            
            // Map lat (-90 to 90) and lon (-180 to 180) to percentages (0-100%)
            const topPos = 100 - ((lat + 90) / 180) * 100;
            const leftPos = ((lon + 180) / 360) * 100;
            
            issBlip.style.display = 'block';
            issBlip.style.top = `${topPos}%`;
            issBlip.style.left = `${leftPos}%`;
            
            if (issLatLon) issLatLon.innerText = `LAT: ${lat.toFixed(2)} LON: ${lon.toFixed(2)}`;
            if (issLoc) issLoc.innerText = "ISS ORBIT";
            if (issStatus) issStatus.innerText = "TRACKING ACTIVE";
            
            // Random tiny beep on update
            if (Math.random() > 0.5) playBeep('short');
          }
        })
        .catch(err => {
          console.error("Error fetching ISS:", err);
          if (issStatus) issStatus.innerText = "UPLINK FAILED";
        });
    }
    
    fetchISS();
    setInterval(fetchISS, 5000); // Update every 5 seconds
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

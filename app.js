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

  // --- Audio Visualizer (Oscilloscope) ---
  const btnVis = document.getElementById('btn-visualizer');
  const visCanvas = document.getElementById('visualizer-canvas');
  let audioStream = null;
  let analyser = null;
  let visReq = null;

  if (btnVis && visCanvas) {
    const vctx = visCanvas.getContext('2d');
    
    btnVis.addEventListener('click', () => {
      // Toggle logic handled by generic button listener, we just check state
      if (btnVis.classList.contains('active')) {
        // Start Visualizer
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          .then(stream => {
            audioStream = stream;
            const src = audioCtx.createMediaStreamSource(stream);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            src.connect(analyser);
            
            visCanvas.style.opacity = '1';
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            function draw() {
              visCanvas.width = visCanvas.offsetWidth;
              visCanvas.height = visCanvas.offsetHeight;
              
              visReq = requestAnimationFrame(draw);
              analyser.getByteTimeDomainData(dataArray);
              
              vctx.clearRect(0, 0, visCanvas.width, visCanvas.height);
              vctx.lineWidth = 2;
              vctx.strokeStyle = '#00f0ff'; // Cyan line
              vctx.shadowBlur = 10;
              vctx.shadowColor = '#00f0ff';
              vctx.beginPath();
              
              const sliceWidth = visCanvas.width * 1.0 / bufferLength;
              let x = 0;
              for(let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * visCanvas.height / 2;
                if(i === 0) vctx.moveTo(x, y);
                else vctx.lineTo(x, y);
                x += sliceWidth;
              }
              vctx.lineTo(visCanvas.width, visCanvas.height / 2);
              vctx.stroke();
            }
            draw();
          })
          .catch(err => {
            console.error("Mic access denied", err);
            btnVis.classList.remove('active');
            alert("Microphone access is required for the visualizer.");
          });
      } else {
        // Stop Visualizer
        if (visReq) cancelAnimationFrame(visReq);
        if (audioStream) audioStream.getTracks().forEach(t => t.stop());
        visCanvas.style.opacity = '0';
      }
    });
  }

  // --- Breach Protocol (Neural Network) ---
  const nnCanvas = document.getElementById('neural-canvas');
  const nodeStatus = document.getElementById('node-status');
  if (nnCanvas) {
    const nctx = nnCanvas.getContext('2d');
    let width, height;
    
    function resizeNN() {
      width = nnCanvas.width = nnCanvas.offsetWidth;
      height = nnCanvas.height = nnCanvas.offsetHeight;
    }
    window.addEventListener('resize', resizeNN);
    resizeNN();

    const nodes = [];
    const numNodes = 40;
    for(let i=0; i<numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2 + 1
      });
    }

    let mouse = { x: null, y: null, active: false, target: null };
    nnCanvas.addEventListener('mousedown', (e) => {
      const rect = nnCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
      
      // Find closest node to grab
      let closest = null;
      let minDist = 30; // Grab radius
      nodes.forEach(n => {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < minDist) { minDist = dist; closest = n; }
      });
      mouse.target = closest;
    });
    
    nnCanvas.addEventListener('mousemove', (e) => {
      if (!mouse.active) return;
      const rect = nnCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      if (mouse.target) {
        mouse.target.x = mouse.x;
        mouse.target.y = mouse.y;
        mouse.target.vx = 0;
        mouse.target.vy = 0;
      }
    });
    
    window.addEventListener('mouseup', () => {
      if(mouse.target) {
        // Add some throw velocity
        mouse.target.vx = (Math.random() - 0.5) * 5;
        mouse.target.vy = (Math.random() - 0.5) * 5;
      }
      mouse.active = false;
      mouse.target = null;
    });

    function drawNN() {
      nctx.clearRect(0, 0, width, height);
      let connections = 0;
      
      // Update and draw nodes
      nodes.forEach(n => {
        if (mouse.target !== n) {
          n.x += n.vx;
          n.y += n.vy;
          // Bounce off walls
          if(n.x < 0 || n.x > width) n.vx *= -1;
          if(n.y < 0 || n.y > height) n.vy *= -1;
        }
        
        nctx.beginPath();
        nctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        nctx.fillStyle = '#ff2a2a'; // Alert red nodes
        nctx.shadowBlur = 5;
        nctx.shadowColor = '#ff2a2a';
        nctx.fill();
      });
      
      // Draw lines
      for(let i=0; i<nodes.length; i++) {
        for(let j=i+1; j<nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if(dist < 100) {
            connections++;
            nctx.beginPath();
            nctx.moveTo(nodes[i].x, nodes[i].y);
            nctx.lineTo(nodes[j].x, nodes[j].y);
            nctx.strokeStyle = `rgba(255, 42, 42, ${1 - dist/100})`;
            nctx.lineWidth = 1.5;
            nctx.stroke();
          }
        }
      }
      
      if(nodeStatus) nodeStatus.innerText = `NODES CONNECTED: ${connections}`;
      requestAnimationFrame(drawNN);
    }
    drawNN();
  }

  // --- Live Webcam Feed (Night Vision) ---
  const video = document.getElementById('webcam-video');
  const canvas = document.getElementById('webcam-canvas');
  if (video && canvas) {
    const ctx = canvas.getContext('2d');
    
    // Request webcam access
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("Webcam access denied:", err);
      });

    // Draw to canvas with green filter
    function drawVideo() {
      if (!video.paused && !video.ended) {
        canvas.width = video.videoWidth || 300;
        canvas.height = video.videoHeight || 150;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Apply green sci-fi tint
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      requestAnimationFrame(drawVideo);
    }
    video.addEventListener('play', drawVideo);
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

// Rover Mission Control - Advanced Core Logic

// --- Web Audio API for Deep Space Sonification ---
let audioCtx = null;
let isAudioMuted = false;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Global toggle for UI
window.toggleAudio = function() {
  isAudioMuted = !isAudioMuted;
  const sysAudio = document.getElementById('sys-audio');
  if (sysAudio) {
    sysAudio.innerText = isAudioMuted ? "MUTED [CLICK TO ENABLE]" : "ACTIVE [CLICK TO MUTE]";
    sysAudio.className = isAudioMuted ? "data-value alert" : "data-value nominal";
    if (isAudioMuted) sysAudio.style.color = "var(--text-muted)";
    else sysAudio.style.color = "";
  }
};

function playTxBurst() {
  if (isAudioMuted || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function playAckChime() {
  if (isAudioMuted || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.5);
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize audio on first click anywhere
  document.body.addEventListener('click', initAudio, { once: true });

  // --- 1. System Time Updates ---
  const timeEl = document.getElementById('sys-time');
  function updateTime() {
    if(timeEl) {
      const now = new Date();
      timeEl.innerText = `SYS_TIME: ${now.toISOString().split('T')[1].split('.')[0]} UTC`;
    }
  }
  setInterval(updateTime, 1000);
  updateTime();

  // --- 2. Live Telemetry & Environment Simulation ---
  const telLat = document.getElementById('tel-lat');
  const telLon = document.getElementById('tel-lon');
  const telHeading = document.getElementById('tel-heading');
  const telSpeed = document.getElementById('tel-speed');
  const telPitch = document.getElementById('tel-pitch');
  const telRoll = document.getElementById('tel-roll');
  const telDriveState = document.getElementById('tel-drive-state');
  
  const envTemp = document.getElementById('env-temp');
  const envPressure = document.getElementById('env-pressure');
  const envWind = document.getElementById('env-wind');
  const envRad = document.getElementById('env-rad');

  // Subsystems
  const sysArm = document.getElementById('sys-arm');
  const sysDrill = document.getElementById('sys-drill');
  const sysHga = document.getElementById('sys-hga');

  // Starting coordinates for Perseverance
  let state = {
    lat: 18.446,
    lon: 77.450,
    heading: 45.2,
    speed: 0.0,
    pitch: -1.2,
    roll: 0.4,
    isDriving: false,
    temp: -63.2,
    pressure: 741,
    wind: 14.2
  };

  // Map state
  const mapCanvas = document.getElementById('radar-map');
  let mapCtx = null;
  let trail = []; // Store path history

  if(mapCanvas) {
    mapCtx = mapCanvas.getContext('2d');
    // Handle resizing
    function resizeCanvas() {
      mapCanvas.width = mapCanvas.parentElement.clientWidth;
      mapCanvas.height = mapCanvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Add initial pos to trail
    trail.push({x: mapCanvas.width/2, y: mapCanvas.height/2});
  }

  function drawMap() {
    if(!mapCtx) return;
    
    const w = mapCanvas.width;
    const h = mapCanvas.height;
    
    // Clear bg
    mapCtx.fillStyle = '#050505';
    mapCtx.fillRect(0, 0, w, h);
    
    // Draw Grid
    mapCtx.strokeStyle = '#333333';
    mapCtx.lineWidth = 1;
    const gridSize = 40;
    
    // Pan grid based on movement (parallax effect)
    // We scale lat/lon to pixels. 0.000001 roughly = 1 pixel for visual effect
    const offsetX = ((state.lon - 77.450) * 1000000) % gridSize;
    const offsetY = ((state.lat - 18.446) * 1000000) % gridSize;

    mapCtx.beginPath();
    for(let x = -offsetX; x < w; x += gridSize) {
      mapCtx.moveTo(x, 0); mapCtx.lineTo(x, h);
    }
    for(let y = -offsetY; y < h; y += gridSize) {
      mapCtx.moveTo(0, y); mapCtx.lineTo(w, y);
    }
    mapCtx.stroke();
    
    // Draw trail
    if(trail.length > 1) {
      mapCtx.beginPath();
      mapCtx.strokeStyle = '#555555';
      mapCtx.lineWidth = 2;
      mapCtx.moveTo(w/2, h/2); // Start drawing backwards from current center
      
      let currX = w/2;
      let currY = h/2;
      
      for(let i = trail.length - 1; i > 0; i--) {
        // Calculate diff between points
        const dx = (trail[i].lon - trail[i-1].lon) * 1000000;
        const dy = -(trail[i].lat - trail[i-1].lat) * 1000000; // negative because y is inverted
        currX -= dx;
        currY -= dy;
        mapCtx.lineTo(currX, currY);
      }
      mapCtx.stroke();
    }
    
    // Draw Rover (Center)
    mapCtx.save();
    mapCtx.translate(w/2, h/2);
    mapCtx.rotate(state.heading * Math.PI / 180);
    
    // Triangle rover indicator
    mapCtx.beginPath();
    mapCtx.moveTo(0, -10);
    mapCtx.lineTo(8, 8);
    mapCtx.lineTo(-8, 8);
    mapCtx.closePath();
    
    mapCtx.fillStyle = '#ff9500'; // Amber
    mapCtx.fill();
    mapCtx.restore();
    
    // Radar sweep effect
    const time = Date.now() / 1000;
    mapCtx.save();
    mapCtx.translate(w/2, h/2);
    mapCtx.rotate(time * 2);
    const grad = mapCtx.createLinearGradient(0, 0, 0, -150);
    grad.addColorStop(0, 'rgba(255, 149, 0, 0.2)');
    grad.addColorStop(1, 'rgba(255, 149, 0, 0)');
    mapCtx.fillStyle = grad;
    mapCtx.beginPath();
    mapCtx.moveTo(0,0);
    mapCtx.arc(0, 0, 150, -0.1, 0.1);
    mapCtx.fill();
    mapCtx.restore();
    
    requestAnimationFrame(drawMap);
  }
  
  if(mapCanvas) drawMap();

  function updateTelemetry() {
    if (state.isDriving) {
      state.speed = 0.04;
      state.heading += (Math.random() - 0.5) * 0.5;
      
      const rad = state.heading * (Math.PI / 180);
      state.lat += (Math.cos(rad) * 0.000001);
      state.lon += (Math.sin(rad) * 0.000001);
      
      state.pitch = -1.0 + (Math.random() - 0.5) * 2;
      state.roll = 0.5 + (Math.random() - 0.5) * 3;
      
      // Store trail point every so often
      if(Math.random() < 0.1) {
        trail.push({lat: state.lat, lon: state.lon});
        if(trail.length > 50) trail.shift();
      }
    } else {
      state.speed = 0.0;
      state.pitch += (Math.random() - 0.5) * 0.05;
      state.roll += (Math.random() - 0.5) * 0.05;
    }
    
    // Environment fluctuates slightly
    state.temp += (Math.random() - 0.5) * 0.1;
    state.pressure += (Math.random() - 0.5) * 0.5;
    state.wind += (Math.random() - 0.5) * 0.2;
    if(state.wind < 0) state.wind = 0;

    // Update DOM
    if(telLat) telLat.innerText = `${state.lat.toFixed(6)}° N`;
    if(telLon) telLon.innerText = `${state.lon.toFixed(6)}° E`;
    if(telHeading) telHeading.innerText = `${state.heading.toFixed(1)}°`;
    if(telSpeed) telSpeed.innerText = `${state.speed.toFixed(2)} m/s`;
    if(telPitch) telPitch.innerText = `${state.pitch.toFixed(1)}°`;
    if(telRoll) telRoll.innerText = `${state.roll.toFixed(1)}°`;
    if(telDriveState) {
      telDriveState.innerText = state.isDriving ? "DRIVING" : "IDLE";
      telDriveState.className = state.isDriving ? "data-value" : "data-value nominal";
    }
    
    if(envTemp) envTemp.innerText = `${state.temp.toFixed(1)}°C`;
    if(envPressure) envPressure.innerText = `${Math.round(state.pressure)} Pa`;
    if(envWind) envWind.innerText = `${state.wind.toFixed(1)} m/s`;
  }
  
  setInterval(updateTelemetry, 500);

  // --- 3. NASA Perseverance Image Uplink ---
  const imgContainer = document.getElementById('rover-img-container');
  const btnRefreshCam = document.getElementById('btn-refresh-cam');
  
  function fetchNASAImage() {
    if(!imgContainer) return;
    imgContainer.innerHTML = '<span style="color:var(--text-muted); font-family:monospace;">ESTABLISHING DEEP SPACE NETWORK LINK...</span>';
    
    fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/latest_photos?api_key=DEMO_KEY')
      .then(res => res.json())
      .then(data => {
        if(data.latest_photos && data.latest_photos.length > 0) {
          const photo = data.latest_photos[Math.floor(Math.random() * data.latest_photos.length)];
          imgContainer.innerHTML = `
            <img src="${photo.img_src}" alt="Mars Rover Capture">
            <div class="image-meta">
              SOL: ${photo.sol} | CAM: ${photo.camera.name}<br>
              DATE: ${photo.earth_date}
            </div>
          `;
        } else {
          imgContainer.innerHTML = '<span style="color:var(--alert-color); font-family:monospace;">NO IMAGES AVAILABLE</span>';
        }
      })
      .catch(err => {
        imgContainer.innerHTML = '<span style="color:var(--alert-color); font-family:monospace;">UPLINK FAILED: CONNECTION LOST</span>';
        console.error(err);
      });
  }

  if(btnRefreshCam) btnRefreshCam.addEventListener('click', fetchNASAImage);
  fetchNASAImage();

  // --- 4. Command Uplink Queue ---
  const cmdInput = document.getElementById('cmd-input');
  const btnSendCmd = document.getElementById('btn-send-cmd');
  const cmdLog = document.getElementById('cmd-log');

  function addLogEntry(text, status, statusClass) {
    if(!cmdLog) return null;
    const li = document.createElement('li');
    li.innerHTML = `<span class="cmd-text">> ${text}</span><span class="cmd-status ${statusClass}">[${status}]</span>`;
    cmdLog.prepend(li);
    return li;
  }

  function sendCommand() {
    if(!cmdInput || !cmdInput.value.trim()) return;
    
    // Audio init requirement hack
    initAudio();
    
    const cmdText = cmdInput.value.trim().toUpperCase();
    cmdInput.value = '';
    
    playTxBurst();
    const li = addLogEntry(cmdText, 'QUEUED', 'status-queued');
    const statusSpan = li.querySelector('.cmd-status');
    
    // Subsystem Execution Logic (Pre-computation)
    let executionCallback = null;
    
    if(cmdText === 'DRIVE_FWD') executionCallback = () => state.isDriving = true;
    else if(cmdText === 'HALT') executionCallback = () => state.isDriving = false;
    else if(cmdText === 'DEPLOY_ARM') executionCallback = () => { if(sysArm) { sysArm.innerText = 'DEPLOYED'; sysArm.className='data-value nominal'; }};
    else if(cmdText === 'STOW_ARM') executionCallback = () => { if(sysArm) { sysArm.innerText = 'STOWED'; sysArm.className='data-value'; }};
    else if(cmdText === 'DRILL_START') executionCallback = () => { if(sysDrill) { sysDrill.innerText = 'ACTIVE'; sysDrill.className='data-value alert'; }};
    else if(cmdText === 'DRILL_STOP') executionCallback = () => { if(sysDrill) { sysDrill.innerText = 'SECURED'; sysDrill.className='data-value'; }};

    setTimeout(() => {
      statusSpan.innerText = '[TRANSMITTING]';
      statusSpan.className = 'cmd-status status-tx';
      
      const ackDelay = 3000 + Math.random() * 2000;
      setTimeout(() => {
        statusSpan.innerText = '[ACKNOWLEDGED]';
        statusSpan.className = 'cmd-status status-ack';
        playAckChime();
        
        // Execute the effect
        if(executionCallback) executionCallback();
        
        // Auto-stop drive
        if(cmdText === 'DRIVE_FWD') {
            setTimeout(() => {
                if(state.isDriving) {
                    addLogEntry('DRIVE_COMPLETE', 'AUTO-ACK', 'status-ack');
                    state.isDriving = false;
                    playAckChime();
                }
            }, 8000);
        }
      }, ackDelay);
      
    }, 1000);
  }

  if(btnSendCmd) btnSendCmd.addEventListener('click', sendCommand);
  if(cmdInput) {
    cmdInput.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') sendCommand();
    });
  }
});

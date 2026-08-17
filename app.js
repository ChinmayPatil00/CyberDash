// Rover Mission Control - Core Logic

document.addEventListener('DOMContentLoaded', () => {

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

  // --- 2. Live Telemetry Simulation ---
  const telLat = document.getElementById('tel-lat');
  const telLon = document.getElementById('tel-lon');
  const telHeading = document.getElementById('tel-heading');
  const telSpeed = document.getElementById('tel-speed');
  const telPitch = document.getElementById('tel-pitch');
  const telRoll = document.getElementById('tel-roll');
  const telDriveState = document.getElementById('tel-drive-state');

  // Starting coordinates for Perseverance (roughly Jezero Crater)
  let state = {
    lat: 18.446,
    lon: 77.450,
    heading: 45.2,
    speed: 0.0,
    pitch: -1.2,
    roll: 0.4,
    isDriving: false
  };

  function updateTelemetry() {
    if (state.isDriving) {
      // Simulate movement
      state.speed = 0.04; // Mars rovers are slow (4cm/s)
      state.heading += (Math.random() - 0.5) * 0.5;
      
      // Calculate very tiny lat/lon changes based on heading
      const rad = state.heading * (Math.PI / 180);
      state.lat += (Math.cos(rad) * 0.000001);
      state.lon += (Math.sin(rad) * 0.000001);
      
      // Simulate terrain bumps
      state.pitch = -1.0 + (Math.random() - 0.5) * 2;
      state.roll = 0.5 + (Math.random() - 0.5) * 3;
    } else {
      state.speed = 0.0;
      // Slight sensor noise when stopped
      state.pitch += (Math.random() - 0.5) * 0.05;
      state.roll += (Math.random() - 0.5) * 0.05;
    }

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
  }
  
  // Run telemetry loop every 500ms
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
          // Pick a random photo from the latest batch to keep it fresh
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

  if(btnRefreshCam) {
    btnRefreshCam.addEventListener('click', fetchNASAImage);
  }
  // Initial fetch
  fetchNASAImage();

  // --- 4. Command Uplink Queue ---
  const cmdInput = document.getElementById('cmd-input');
  const btnSendCmd = document.getElementById('btn-send-cmd');
  const cmdLog = document.getElementById('cmd-log');

  function addLogEntry(text, status, statusClass) {
    if(!cmdLog) return null;
    
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="cmd-text">> ${text}</span>
      <span class="cmd-status ${statusClass}">[${status}]</span>
    `;
    cmdLog.prepend(li); // Add to top
    return li;
  }

  function sendCommand() {
    if(!cmdInput || !cmdInput.value.trim()) return;
    
    const cmdText = cmdInput.value.trim().toUpperCase();
    cmdInput.value = '';
    
    // 1. Queue command
    const li = addLogEntry(cmdText, 'QUEUED', 'status-queued');
    const statusSpan = li.querySelector('.cmd-status');
    
    // Intercept specific drive commands to update telemetry simulation
    if(cmdText === 'DRIVE_FWD' || cmdText.includes('DRIVE')) {
      state.isDriving = true;
    } else if (cmdText === 'STOP' || cmdText === 'HALT') {
      state.isDriving = false;
    }

    // 2. Simulate Transmission (1s delay)
    setTimeout(() => {
      statusSpan.innerText = '[TRANSMITTING]';
      statusSpan.className = 'cmd-status status-tx';
      
      // 3. Simulate deep space light-delay and Acknowledgment (3-5s delay)
      const ackDelay = 3000 + Math.random() * 2000;
      setTimeout(() => {
        statusSpan.innerText = '[ACKNOWLEDGED]';
        statusSpan.className = 'cmd-status status-ack';
        
        // Stop driving after a set distance/time if it was a drive command
        if(cmdText === 'DRIVE_FWD') {
            setTimeout(() => {
                if(state.isDriving) {
                    addLogEntry('DRIVE_COMPLETE', 'AUTO-ACK', 'status-ack');
                    state.isDriving = false;
                }
            }, 8000);
        }
      }, ackDelay);
      
    }, 1000);
  }

  if(btnSendCmd) {
    btnSendCmd.addEventListener('click', sendCommand);
  }
  
  if(cmdInput) {
    cmdInput.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') sendCommand();
    });
  }

});

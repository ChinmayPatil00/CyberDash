// --- Venture 2.0 SPA Controller ---

// DOM Elements
const views = document.querySelectorAll('.view');
const viewAuth = document.getElementById('view-auth');
const viewHome = document.getElementById('view-home');
const viewDash = document.getElementById('view-dashboard');

const authUsername = document.getElementById('auth-username');
const btnLogin = document.getElementById('btn-login');
const userProfile = document.getElementById('user-profile');
const displayUsername = document.getElementById('display-username');
const heroName = document.getElementById('hero-name');

// View Manager
function switchView(viewId) {
  views.forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  window.scrollTo(0,0);
}

// 1. Authentication
btnLogin.addEventListener('click', () => {
  const name = authUsername.value.trim() || 'Maverick';
  displayUsername.innerText = name;
  heroName.innerText = name;
  userProfile.style.display = 'flex';
  switchView('view-home');
});

// 2. The Explorer (Home) Logic
const vibeNames = {
  'treks': 'Alpine Treks',
  'bike': 'Motorcycle Expeditions',
  'monsoon': 'Monsoon Rides',
  'roadtrip': 'Epic Roadtrips',
  'jungle': 'Jungle Safaris'
};

const indianAdventures = {
  'treks': [
    { title: 'Kalsubai Peak', region: 'Sahyadris, MH', base: 'Bari', dest: 'Kalsubai Peak', diff: 'Hard', days: 2, cost: 1200 },
    { title: 'Rajmachi Trek', region: 'Lonavala, MH', base: 'Udhewadi', dest: 'Rajmachi', diff: 'Easy', days: 1, cost: 800 },
    { title: 'Kheerganga', region: 'Parvati Valley, HP', base: 'Barshaini', dest: 'Kheerganga', diff: 'Medium', days: 3, cost: 1500 },
    { title: 'Harishchandragad', region: 'Ahmednagar, MH', base: 'Khireshwar', dest: 'Harishchandragad', diff: 'Hard', days: 2, cost: 1300 },
    { title: 'Sandhan Valley', region: 'Sahyadris, MH', base: 'Samrad', dest: 'Sandhan Valley', diff: 'Extreme', days: 2, cost: 1800 },
    { title: 'Valley of Flowers', region: 'Uttarakhand', base: 'Govindghat', dest: 'Valley of Flowers', diff: 'Medium', days: 5, cost: 2000 }
  ],
  'bike': [
    { title: 'Manali to Leh', region: 'Himalayas', base: 'Manali', dest: 'Leh', diff: 'Extreme', days: 10, cost: 3500 },
    { title: 'Mumbai to Goa', region: 'Konkan Coast', base: 'Mumbai', dest: 'Goa', diff: 'Medium', days: 4, cost: 2500 },
    { title: 'Spiti Valley Circuit', region: 'Himachal', base: 'Shimla', dest: 'Kaza', diff: 'Extreme', days: 8, cost: 3000 },
    { title: 'Meghalaya Circuit', region: 'North East', base: 'Shillong', dest: 'Cherrapunji', diff: 'Medium', days: 5, cost: 2800 }
  ],
  'monsoon': [
    { title: 'Malshej Ghat', region: 'Maharashtra', base: 'Kalyan', dest: 'Malshej Ghat', diff: 'Easy', days: 1, cost: 1500 },
    { title: 'Amboli Ghat', region: 'Sindhudurg, MH', base: 'Sawantwadi', dest: 'Amboli', diff: 'Medium', days: 2, cost: 1800 },
    { title: 'Coorg Safari', region: 'Karnataka', base: 'Madikeri', dest: 'Coorg', diff: 'Medium', days: 3, cost: 2200 },
    { title: 'Tiger Point', region: 'Lonavala, MH', base: 'Khandala', dest: 'Lonavala', diff: 'Easy', days: 1, cost: 1200 }
  ],
  'roadtrip': [
    { title: 'Golden Triangle', region: 'North India', base: 'Delhi', dest: 'Jaipur', diff: 'Easy', days: 5, cost: 2500 },
    { title: 'East Coast Road', region: 'Tamil Nadu', base: 'Chennai', dest: 'Pondicherry', diff: 'Easy', days: 2, cost: 2000 }
  ],
  'jungle': [
    { title: 'Ranthambore', region: 'Rajasthan', base: 'Sawai Madhopur', dest: 'Ranthambore National Park', diff: 'Easy', days: 3, cost: 4000 },
    { title: 'Jim Corbett', region: 'Uttarakhand', base: 'Ramnagar', dest: 'Jim Corbett National Park', diff: 'Easy', days: 4, cost: 3500 },
    { title: 'Tadoba Andhari', region: 'Maharashtra', base: 'Chandrapur', dest: 'Tadoba', diff: 'Easy', days: 3, cost: 4200 },
    { title: 'Bandhavgarh', region: 'Madhya Pradesh', base: 'Umaria', dest: 'Bandhavgarh', diff: 'Medium', days: 3, cost: 3800 }
  ]
};

// Elements
const vibeCards = document.querySelectorAll('.vibe-card');
const purposeInput = document.getElementById('input-purpose');
const sugArea = document.getElementById('suggestions-area');
const sugScroll = document.getElementById('suggestions-scroll');
const sugLabel = document.getElementById('sug-label');
const inOrigin = document.getElementById('input-origin');
const inDest = document.getElementById('input-dest');
const daysSlider = document.getElementById('input-days');
const daysVal = document.getElementById('val-days');
const travelersSlider = document.getElementById('input-travelers');
const travelersVal = document.getElementById('val-travelers');
const currencySelect = document.getElementById('input-currency');

// Modal Elements
const modal = document.getElementById('mission-modal');
const modalClose = document.getElementById('modal-close');
const mTitle = document.getElementById('m-title');
const mRegion = document.getElementById('m-region');
const mImg = document.getElementById('m-img');
const mDesc = document.getElementById('m-desc');
const mDiff = document.getElementById('m-diff');
const mDays = document.getElementById('m-days');
const mBase = document.getElementById('m-base');
const mCost = document.getElementById('m-cost');
const mSelectBtn = document.getElementById('m-select-btn');

let currentSelectedItem = null;
modalClose.addEventListener('click', () => modal.classList.remove('active'));

function openModal(item) {
  currentSelectedItem = item;
  mTitle.innerText = item.title;
  mRegion.innerText = item.region;
  mDiff.innerText = item.diff;
  mDays.innerText = `${item.days} Days`;
  mBase.innerText = item.base;
  mCost.innerText = `₹${item.cost} / day / person`;
  
  mImg.src = '';
  mDesc.innerText = 'Establishing uplink to Wikipedia for mission briefing...';
  modal.classList.add('active');

  const searchStr = `${item.dest} ${item.region}`;
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchStr)}&gsrlimit=1&prop=pageimages|extracts&piprop=thumbnail&pithumbsize=800&exsentences=4&exintro=1&explaintext=1&format=json&origin=*`;
  
  fetch(url).then(res => res.json()).then(data => {
      if(data.query && data.query.pages) {
        const p = Object.values(data.query.pages)[0];
        if(p.extract) mDesc.innerText = p.extract;
        if(p.thumbnail && p.thumbnail.source) mImg.src = p.thumbnail.source;
        else mImg.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Kalsubai_peak.jpg/800px-Kalsubai_peak.jpg';
      } else {
        mDesc.innerText = 'Wiki Database offline for this coordinate. Await manual briefing.';
      }
    });
}

mSelectBtn.addEventListener('click', () => {
  if(currentSelectedItem) {
    inOrigin.value = currentSelectedItem.base;
    inDest.value = currentSelectedItem.dest;
    daysSlider.value = currentSelectedItem.days;
    daysVal.innerText = `${currentSelectedItem.days} Days`;
    updateLiveEstimate();
    document.querySelectorAll('.suggestion-card').forEach(c => c.style.borderColor = 'var(--border)');
  }
  modal.classList.remove('active');
});

function renderSuggestions(vibe) {
  const data = indianAdventures[vibe];
  if (!data) { sugArea.style.display = 'none'; return; }
  sugArea.style.display = 'block';
  sugLabel.innerText = document.querySelector(`.vibe-card[data-vibe="${vibe}"] .vibe-title`).innerText;
  sugScroll.innerHTML = '';
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'suggestion-card';
    card.innerHTML = `
      <div class="sug-title">${item.title}</div>
      <div class="sug-meta">
        <span>📍 ${item.region}</span>
        <span>🔥 Diff: <strong style="color:var(--text-main);">${item.diff}</strong></span>
        <span>⏱️ ${item.days} Days | ⛺ Base: ${item.base}</span>
      </div>
    `;
    card.addEventListener('click', () => openModal(item));
    sugScroll.appendChild(card);
  });
}

vibeCards.forEach(card => {
  card.addEventListener('click', () => {
    vibeCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const vibe = card.getAttribute('data-vibe');
    purposeInput.value = vibe;
    renderSuggestions(vibe);
    updateLiveEstimate();
  });
});

renderSuggestions('treks');
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
document.getElementById('input-date').valueAsDate = tomorrow;

daysSlider.addEventListener('input', (e) => { daysVal.innerText = `${e.target.value} Days`; updateLiveEstimate(); });
travelersSlider.addEventListener('input', (e) => { travelersVal.innerText = `${e.target.value} People`; updateLiveEstimate(); });
currencySelect.addEventListener('change', updateLiveEstimate);

// Live Estimate
function getBaseCost(purpose) {
  const budgetData = { 'treks': 1200, 'bike': 3500, 'monsoon': 1500, 'roadtrip': 2500, 'jungle': 4000 };
  return budgetData[purpose] || 1500;
}

function updateLiveEstimate() {
  const days = parseInt(daysSlider.value, 10);
  const travelers = parseInt(travelersSlider.value, 10);
  const purpose = purposeInput.value;
  const currency = currencySelect.value;
  const rate = { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095, 'INR': 1.0 }[currency] || 1.0;
  
  const totalINR = getBaseCost(purpose) * days * travelers;
  const finalCost = totalINR * rate;
  
  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency, maximumFractionDigits: 0 });
  document.getElementById('live-cost').innerText = formatter.format(finalCost);
}
updateLiveEstimate();

// --- Autocomplete (Nominatim) ---
function setupAutocomplete(inputId, listId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  let timeout = null;
  input.addEventListener('input', () => {
    clearTimeout(timeout);
    if (!input.value) { list.style.display = 'none'; return; }
    timeout = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input.value)}&limit=5`)
        .then(res => res.json())
        .then(data => {
          list.innerHTML = '';
          if (data.length > 0) {
            list.style.display = 'block';
            data.forEach(item => {
              const div = document.createElement('div');
              div.className = 'autocomplete-item';
              div.innerText = item.display_name;
              div.addEventListener('click', () => { 
                input.value = item.display_name.split(',')[0];
                input.dataset.lat = item.lat;
                input.dataset.lon = item.lon;
                list.style.display = 'none'; 
              });
              list.appendChild(div);
            });
          } else { list.style.display = 'none'; }
        }).catch(() => { list.style.display = 'none'; });
    }, 300);
  });
  document.addEventListener('click', (e) => { if (e.target !== input && e.target !== list) list.style.display = 'none'; });
}
setupAutocomplete('input-origin', 'autocomplete-list-origin');
setupAutocomplete('input-dest', 'autocomplete-list-dest');

// --- Form Submission -> Dashboard Generator ---
document.getElementById('trip-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const plan = {
    origin: inOrigin.value,
    dest: inDest.value,
    lat: inDest.dataset.lat || '19.0760', // fallback to Mumbai if not set
    lon: inDest.dataset.lon || '72.8777',
    date: document.getElementById('input-date').value,
    currency: currencySelect.value,
    days: parseInt(daysSlider.value, 10),
    travelers: parseInt(travelersSlider.value, 10),
    purpose: purposeInput.value
  };

  generateDashboard(plan);
  switchView('view-dashboard');
});

// Edit Button
document.getElementById('btn-edit').addEventListener('click', () => {
  switchView('view-home');
  document.getElementById('app-bg').style.backgroundImage = "url('https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2000&auto=format&fit=crop')";
});

// --- Dashboard Engine ---
async function generateDashboard(plan) {
  document.getElementById('dash-dest').innerText = plan.dest;
  document.getElementById('dash-origin').innerText = plan.origin;
  document.getElementById('dash-days').innerText = plan.days;
  document.getElementById('dash-squad').innerText = plan.travelers;
  const budgetList = document.getElementById('budget-list');
  const gearList = document.getElementById('gear-list');
  const timeline = document.getElementById('itinerary-timeline');

  budgetList.innerHTML = '<li class="budget-item">Syncing Live Global Currency Markets...</li>';
  gearList.innerHTML = '<li class="gear-item">Connecting to Weather Satellites...</li>';
  timeline.innerHTML = '<div style="color:var(--text-muted);"><i class="fas fa-satellite-dish fa-spin" style="margin-right:10px;"></i> Establishing uplink with geo-satellites...</div>';

  // --- 1. Live Currency API ---
  let rate = 1.0;
  if(plan.currency !== 'INR') {
    try {
      const exRes = await fetch('https://open.er-api.com/v6/latest/INR');
      const exData = await exRes.json();
      if(exData && exData.rates && exData.rates[plan.currency]) {
        rate = exData.rates[plan.currency];
      }
    } catch(e) { console.error('Currency API offline'); rate = { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095 }[plan.currency] || 1.0; }
  }

  const budgetData = {
    'treks': { labels: ['Basecamp/Tents', 'Trail Rations', 'Transport/Guides', 'Permits'] },
    'bike': { labels: ['Stays & Motels', 'Roadhouse Meals', 'Bike Rental/Fuel', 'Tolls/Misc'] },
    'monsoon': { labels: ['Rainforest Lodges', 'Local Cafes', 'Transport', 'Fees'] },
    'roadtrip': { labels: ['Highway Motels', 'Diners & Snacks', 'Car Rental/Gas', 'Tolls/Parking'] },
    'jungle': { labels: ['Safari Lodge', 'Meals', 'Jeep & Guide Hire', 'Forest Fees'] }
  };
  const bData = budgetData[plan.purpose] || budgetData['treks'];
  const baseCost = getBaseCost(plan.purpose);
  const totalINR = baseCost * plan.days * plan.travelers;
  
  const expenses = [
    { label: bData.labels[0], amount: (totalINR * 0.4) * rate },
    { label: bData.labels[1], amount: (totalINR * 0.3) * rate },
    { label: bData.labels[2], amount: (totalINR * 0.2) * rate },
    { label: bData.labels[3], amount: (totalINR * 0.1) * rate }
  ];

  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: plan.currency, maximumFractionDigits: 0 });
  budgetList.innerHTML = '';
  expenses.forEach(exp => {
    budgetList.innerHTML += `
      <li class="budget-item">
        <span>${exp.label}</span>
        <span style="color:var(--text-main);">${formatter.format(exp.amount)}</span>
      </li>
    `;
  });
  document.getElementById('budget-total').innerText = formatter.format(totalINR * rate);

  // --- 2. Live Weather API (Open-Meteo) & Dynamic Gear ---
  let temp = 25;
  let isRaining = false;
  let windSpeed = 0;
  
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${plan.lat}&longitude=${plan.lon}&current_weather=true`;
    const weatherRes = await fetch(weatherUrl);
    const wData = await weatherRes.json();
    if(wData && wData.current_weather) {
      temp = wData.current_weather.temperature;
      windSpeed = wData.current_weather.windspeed;
      const wcode = wData.current_weather.weathercode;
      // WMO codes > 50 generally mean rain/drizzle/snow
      if(wcode >= 51) isRaining = true;
      
      document.getElementById('dash-weather-temp').innerText = `${temp}°C`;
      document.getElementById('dash-weather-desc').innerText = isRaining ? 'Precipitation Detected' : 'Clear / Cloudy';
    }
  } catch(e) {
    document.getElementById('dash-weather-temp').innerText = '--°C';
    document.getElementById('dash-weather-desc').innerText = 'Sensor Offline';
  }

  const gearMap = {
    'treks': ['65L Rucksack', 'First Aid Kit', 'Water Purifier', 'Headlamp'],
    'bike': ['Riding Jacket', 'Full-face Helmet', 'Tool Kit', 'Hydration Pack'],
    'monsoon': ['Trekking Shoes', 'Anti-leech Socks'],
    'roadtrip': ['Aux Cable', 'Car Charger', 'Snack Cooler', 'Emergency Toolkit'],
    'jungle': ['Binoculars', 'Camouflage Clothing', 'Mosquito Repellent', 'Safari Hat']
  };
  
  let finalGear = gearMap[plan.purpose] || gearMap['treks'];
  let dynamicGearHtml = '';

  finalGear.forEach(item => {
    dynamicGearHtml += `<li class="gear-item"><input type="checkbox" checked> <span>${item}</span> <span class="reason">Base</span></li>`;
  });

  // Dynamic Injections based on Live Weather
  if(temp < 15) {
    dynamicGearHtml += `<li class="gear-item"><input type="checkbox" checked> <span>Thermal Base Layers</span> <span class="reason" style="color:#00E5FF;">Temp &lt; 15°C</span></li>`;
    dynamicGearHtml += `<li class="gear-item"><input type="checkbox" checked> <span>Insulated Jacket</span> <span class="reason" style="color:#00E5FF;">Temp &lt; 15°C</span></li>`;
  }
  if(isRaining) {
    dynamicGearHtml += `<li class="gear-item"><input type="checkbox" checked> <span>Waterproof Poncho</span> <span class="reason" style="color:#B388FF;">Precipitation</span></li>`;
    dynamicGearHtml += `<li class="gear-item"><input type="checkbox" checked> <span>Dry Bags</span> <span class="reason" style="color:#B388FF;">Precipitation</span></li>`;
  }
  if(windSpeed > 20) {
    dynamicGearHtml += `<li class="gear-item"><input type="checkbox" checked> <span>Windcheater</span> <span class="reason" style="color:#FFB300;">High Wind</span></li>`;
  }
  
  gearList.innerHTML = dynamicGearHtml;

  // --- 3. Itinerary Generation & Immersive Background ---
  const routeData = {
    'treks': { search: 'mountains and hiking trails', start: 'Hit the trailhead basecamp. Do a quick fit check, secure the bags, and get moving.', end: 'Summit achieved. Catch your breath, snap the pics, and hike out.' },
    'bike': { search: 'scenic motorcycle routes', start: 'Grab the bikes. Check tire pressure, top up the fuel, and hit the open highway.', end: 'Return the motorcycles. Clean off the road dust and head out.' },
    'monsoon': { search: 'waterfalls and hills', start: 'Throw on the wet-weather gear. Enter the heavy rain zone and embrace the mud.', end: 'Dry off at the final stop. Grab some warm food and head out.' },
    'roadtrip': { search: 'famous highways', start: 'Load up the trunk, grab the aux cord, and merge onto the interstate.', end: 'Pull into the final rest stop. Return the rental and wrap it up.' },
    'jungle': { search: 'national parks and wildlife', start: 'Meet your local ranger at the edge. Apply bug spray and enter the canopy.', end: 'Emerge from the dense foliage. Debrief with the rangers and head out.' }
  };
  const rData = routeData[plan.purpose] || routeData['treks'];
  const searchStr = `${rData.search} in ${plan.dest}`;
  const attractionsUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchStr)}&gsrlimit=10&prop=pageimages|extracts&piprop=thumbnail&pithumbsize=1200&exsentences=3&exintro=1&explaintext=1&format=json&origin=*`;

  try {
    const wikiRes = await fetch(attractionsUrl);
    const wikiData = await wikiRes.json();
    let places = [];
    if (wikiData.query && wikiData.query.pages) {
      places = Object.values(wikiData.query.pages).filter(p => !p.title.includes('List of') && p.extract);
      
      // Immersive Full Screen Background injection!
      const bestImagePlace = places.find(p => p.thumbnail && p.thumbnail.source);
      if(bestImagePlace) {
        document.getElementById('app-bg').style.backgroundImage = `url('${bestImagePlace.thumbnail.source}')`;
      }
    }
    
    timeline.innerHTML = '';
    let pIndex = 0;

    for (let i = 1; i <= plan.days; i++) {
      let content = "";
      if (i === 1) {
        content = `Kicking off from ${plan.origin}. ${rData.start}`;
      } else if (i === plan.days) {
        content = `${rData.end} Heading back to ${plan.origin}.`;
      } else {
        if (places.length > 0) {
          const p = places[pIndex % places.length];
          pIndex++;
          let img = '';
          if (p.thumbnail && p.thumbnail.source) {
            img = `<img src="${p.thumbnail.source}" class="wiki-photo" alt="${p.title}">`;
          }
          content = `
            <div style="color:var(--text-main); font-weight:700; margin-bottom:10px;">📍 ${p.title}</div>
            <div>${p.extract}</div>
            ${img}
          `;
        } else {
          content = `Keep the momentum going. Execute ${vibeNames[plan.purpose]} protocols.`;
        }
      }
      timeline.innerHTML += `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-day">Day 0${i}</div>
          <div class="timeline-content">${content}</div>
        </div>
      `;
    }
  } catch(e) {
    timeline.innerHTML = '<div style="color:var(--primary);">No signal. Proceed using offline maps.</div>';
  }
}

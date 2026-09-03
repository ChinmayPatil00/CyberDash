// --- Venture 4.0 SPA Controller ---

// DOM Elements
const views = document.querySelectorAll('.view');
const viewAuth = document.getElementById('view-auth');
const viewHome = document.getElementById('view-home');
const viewDash = document.getElementById('view-dashboard');

const authUsername = document.getElementById('auth-username');
const btnLogin = document.getElementById('btn-login');
const navLinks = document.getElementById('nav-links');
const displayUsername = document.getElementById('display-username');
const heroName = document.getElementById('hero-name');
const navAvatar = document.getElementById('nav-avatar');

// View Manager
function switchView(viewId) {
  views.forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  window.scrollTo(0,0);
}

// 1. Authentication
btnLogin.addEventListener('click', () => {
  const name = authUsername.value.trim() || 'Explorer';
  displayUsername.innerText = name;
  heroName.innerText = name;
  navAvatar.src = `https://ui-avatars.com/api/?name=${name}&background=FF385C&color=fff`;
  navLinks.style.display = 'flex';
  switchView('view-home');
});

// 2. The Explorer (Home) Logic
const vibeNames = {
  'treks': 'Treks',
  'bike': 'Bike Rides',
  'monsoon': 'Monsoon',
  'roadtrip': 'Roadtrips',
  'jungle': 'Safari'
};

const indianAdventures = {
  'treks': [
    { title: 'Kalsubai Peak', region: 'Sahyadris, MH', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Kalsubai_peak.jpg/600px-Kalsubai_peak.jpg', base: 'Bari', dest: 'Kalsubai Peak', diff: 'Hard', days: 2, cost: 1200 },
    { title: 'Valley of Flowers', region: 'Uttarakhand', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Valley_of_Flowers_National_Park%2C_India.jpg/600px-Valley_of_Flowers_National_Park%2C_India.jpg', base: 'Govindghat', dest: 'Valley of Flowers', diff: 'Medium', days: 5, cost: 2000 },
    { title: 'Kheerganga', region: 'Parvati Valley, HP', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kheerganga.jpg/600px-Kheerganga.jpg', base: 'Barshaini', dest: 'Kheerganga', diff: 'Medium', days: 3, cost: 1500 },
    { title: 'Sandhan Valley', region: 'Sahyadris, MH', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Sandhan_valley_trek.jpg/600px-Sandhan_valley_trek.jpg', base: 'Samrad', dest: 'Sandhan Valley', diff: 'Extreme', days: 2, cost: 1800 }
  ],
  'bike': [
    { title: 'Manali to Leh', region: 'Himalayas', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Leh_Manali_Highway_3.jpg/600px-Leh_Manali_Highway_3.jpg', base: 'Manali', dest: 'Leh', diff: 'Extreme', days: 10, cost: 3500 },
    { title: 'Spiti Valley Circuit', region: 'Himachal', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Key_Monastery%2C_Spiti_Valley.jpg/600px-Key_Monastery%2C_Spiti_Valley.jpg', base: 'Shimla', dest: 'Kaza', diff: 'Extreme', days: 8, cost: 3000 }
  ],
  'monsoon': [
    { title: 'Malshej Ghat', region: 'Maharashtra', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Malshej_ghat_waterfall.jpg/600px-Malshej_ghat_waterfall.jpg', base: 'Kalyan', dest: 'Malshej Ghat', diff: 'Easy', days: 1, cost: 1500 }
  ],
  'roadtrip': [
    { title: 'Golden Triangle', region: 'North India', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/600px-Taj_Mahal_%28Edited%29.jpeg', base: 'Delhi', dest: 'Jaipur', diff: 'Easy', days: 5, cost: 2500 }
  ],
  'jungle': [
    { title: 'Ranthambore', region: 'Rajasthan', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Tiger_in_Ranthambhore.jpg/600px-Tiger_in_Ranthambhore.jpg', base: 'Sawai Madhopur', dest: 'Ranthambore National Park', diff: 'Easy', days: 3, cost: 4000 }
  ]
};

const vibeTabs = document.querySelectorAll('.vibe-tab');
const purposeInput = document.getElementById('input-purpose');
const sugArea = document.getElementById('suggestions-area');
const sugScroll = document.getElementById('suggestions-scroll');
const sugLabel = document.getElementById('sug-label');

const inOrigin = document.getElementById('input-origin');
const inDest = document.getElementById('input-dest');
const inputDate = document.getElementById('input-date');
const daysSlider = document.getElementById('input-days');
const daysVal = document.getElementById('val-days');
const travelersSlider = document.getElementById('input-travelers');
const travelersVal = document.getElementById('val-travelers');
const currencySelect = document.getElementById('input-currency');

// QA: Set Date Min to Today
const today = new Date().toISOString().split('T')[0];
inputDate.setAttribute('min', today);
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
inputDate.valueAsDate = tomorrow;

function renderSuggestions(vibe) {
  const data = indianAdventures[vibe];
  if (!data || data.length === 0) { sugArea.style.display = 'none'; return; }
  sugArea.style.display = 'block';
  sugLabel.innerText = vibeNames[vibe];
  sugScroll.innerHTML = '';
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'sug-card';
    card.innerHTML = `
      <img src="${item.img}" class="sug-img" alt="${item.title}">
      <div class="sug-content">
        <div class="sug-title">${item.title}</div>
        <div class="sug-loc"><i class="fas fa-map-marker-alt"></i> ${item.region}</div>
        <div class="sug-meta">
          <span>${item.days} Days</span>
          <span style="color:var(--primary);">₹${item.cost}/day</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      inOrigin.value = item.base;
      inDest.value = item.dest;
      daysSlider.value = item.days;
      daysVal.innerText = `${item.days} Days`;
      purposeInput.value = vibe;
      updateLiveEstimate();
      window.scrollTo(0, document.querySelector('.search-card').offsetTop - 100);
    });
    sugScroll.appendChild(card);
  });
}

vibeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    vibeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const vibe = tab.getAttribute('data-vibe');
    purposeInput.value = vibe;
    renderSuggestions(vibe);
    updateLiveEstimate();
  });
});

renderSuggestions('treks');

daysSlider.addEventListener('input', (e) => { daysVal.innerText = `${e.target.value} Days`; updateLiveEstimate(); });
travelersSlider.addEventListener('input', (e) => { travelersVal.innerText = `${e.target.value} People`; updateLiveEstimate(); });
currencySelect.addEventListener('change', updateLiveEstimate);

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

// Autocomplete
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

// --- Form Submission & QA Loading States ---
let currentPlan = null;
let leafletMap = null;

document.getElementById('trip-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const btnSubmitText = document.getElementById('btn-submit-text');
  const btnSubmitSpinner = document.getElementById('btn-submit-spinner');
  const btnSubmit = document.getElementById('btn-submit');
  
  btnSubmit.disabled = true;
  btnSubmitText.style.display = 'none';
  btnSubmitSpinner.style.display = 'inline-block';
  
  currentPlan = {
    origin: inOrigin.value,
    dest: inDest.value,
    lat: inDest.dataset.lat || '19.0760',
    lon: inDest.dataset.lon || '72.8777',
    date: inputDate.value,
    currency: currencySelect.value,
    days: parseInt(daysSlider.value, 10),
    travelers: parseInt(travelersSlider.value, 10),
    purpose: purposeInput.value,
    id: Date.now().toString()
  };

  await generateDashboard(currentPlan);
  
  btnSubmit.disabled = false;
  btnSubmitText.style.display = 'inline-block';
  btnSubmitSpinner.style.display = 'none';
  
  switchView('view-dashboard');
});

document.getElementById('btn-edit').addEventListener('click', () => {
  switchView('view-home');
});

// --- Dashboard Engine ---
async function generateDashboard(plan) {
  document.getElementById('dash-dest').innerText = plan.dest;
  document.getElementById('dash-origin').innerText = plan.origin;
  document.getElementById('dash-date').innerText = plan.date;
  document.getElementById('dash-squad').innerText = `${plan.travelers} Travelers`;
  document.getElementById('dash-hero-bg').style.backgroundImage = "none";

  const budgetList = document.getElementById('budget-list');
  const gearList = document.getElementById('gear-list');
  const timeline = document.getElementById('itinerary-timeline');

  // 1. Live Currency API
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
        <span style="font-weight:600;">${formatter.format(exp.amount)}</span>
      </li>
    `;
  });
  document.getElementById('budget-total').innerText = formatter.format(totalINR * rate);

  // 2. Leaflet Map
  if (leafletMap) {
    leafletMap.remove();
  }
  leafletMap = L.map('map').setView([plan.lat, plan.lon], 10);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(leafletMap);
  L.marker([plan.lat, plan.lon]).addTo(leafletMap)
    .bindPopup(`<b>${plan.dest}</b><br>Mission Coordinates`).openPopup();
  
  setTimeout(() => { leafletMap.invalidateSize(); }, 500);

  // 3. Live Weather API & Dynamic Gear
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
    dynamicGearHtml += `<li class="gear-item"><div style="display:flex; align-items:center;"><input type="checkbox" checked> <span>${item}</span></div> <span class="reason">Base</span></li>`;
  });

  if(temp < 15) {
    dynamicGearHtml += `<li class="gear-item"><div style="display:flex; align-items:center;"><input type="checkbox" checked> <span>Thermal Layers</span></div> <span class="reason" style="background:#e0f7fa; color:#006064;">Cold</span></li>`;
  }
  if(isRaining) {
    dynamicGearHtml += `<li class="gear-item"><div style="display:flex; align-items:center;"><input type="checkbox" checked> <span>Waterproof Poncho</span></div> <span class="reason" style="background:#e8eaf6; color:#283593;">Rain</span></li>`;
  }
  
  gearList.innerHTML = dynamicGearHtml;

  // 4. Itinerary Generation & Hero Image
  const routeData = {
    'treks': { search: 'mountains and hiking trails', start: 'Hit the trailhead basecamp.', end: 'Summit achieved. Hike out.' },
    'bike': { search: 'scenic motorcycle routes', start: 'Grab the bikes. Hit the highway.', end: 'Return the motorcycles.' },
    'monsoon': { search: 'waterfalls and hills', start: 'Throw on the wet-weather gear.', end: 'Dry off at the final stop.' },
    'roadtrip': { search: 'famous highways', start: 'Load up the trunk and merge onto the interstate.', end: 'Pull into the final rest stop.' },
    'jungle': { search: 'national parks and wildlife', start: 'Meet your local ranger.', end: 'Emerge from the dense foliage.' }
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
      
      const bestImagePlace = places.find(p => p.thumbnail && p.thumbnail.source);
      if(bestImagePlace) {
        document.getElementById('dash-hero-bg').style.backgroundImage = `url('${bestImagePlace.thumbnail.source}')`;
      }
    }
    
    timeline.innerHTML = '';
    let pIndex = 0;

    for (let i = 1; i <= plan.days; i++) {
      let content = "";
      if (i === 1) {
        content = `Departing ${plan.origin}. ${rData.start}`;
      } else if (i === plan.days) {
        content = `${rData.end} Return to ${plan.origin}.`;
      } else {
        if (places.length > 0) {
          const p = places[pIndex % places.length];
          pIndex++;
          let img = '';
          if (p.thumbnail && p.thumbnail.source) {
            img = `<img src="${p.thumbnail.source}" class="wiki-photo" alt="${p.title}">`;
          }
          content = `
            <div style="color:#222; font-weight:700; margin-bottom:10px;">📍 ${p.title}</div>
            <div>${p.extract}</div>
            ${img}
          `;
        } else {
          content = `Execute ${vibeNames[plan.purpose]} protocols.`;
        }
      }
      timeline.innerHTML += `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-day">Day ${i}</div>
          <div class="timeline-content">${content}</div>
        </div>
      `;
    }
  } catch(e) {
    timeline.innerHTML = '<div style="color:var(--text-muted);">Proceed using offline maps.</div>';
  }
}

// --- Save Trips & Sidebar ---
const btnSaveTrip = document.getElementById('btn-save-trip');
const sidebar = document.getElementById('trips-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const savedTripsList = document.getElementById('saved-trips-list');

btnSaveTrip.addEventListener('click', () => {
  if(!currentPlan) return;
  let savedTrips = JSON.parse(localStorage.getItem('venture_saved_trips')) || [];
  savedTrips.push(currentPlan);
  localStorage.setItem('venture_saved_trips', JSON.stringify(savedTrips));
  btnSaveTrip.innerHTML = '<i class="fas fa-check"></i> Saved';
  btnSaveTrip.classList.remove('btn-primary');
  btnSaveTrip.classList.add('btn-light');
  setTimeout(() => {
    btnSaveTrip.innerHTML = '<i class="fas fa-heart"></i> Save Trip';
    btnSaveTrip.classList.remove('btn-light');
    btnSaveTrip.classList.add('btn-primary');
  }, 2000);
});

document.getElementById('btn-my-trips').addEventListener('click', () => {
  renderSavedTrips();
  sidebar.classList.add('active');
  sidebarOverlay.classList.add('active');
});

document.getElementById('close-sidebar').addEventListener('click', () => {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
});
sidebarOverlay.addEventListener('click', () => {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
});

function renderSavedTrips() {
  let savedTrips = JSON.parse(localStorage.getItem('venture_saved_trips')) || [];
  savedTripsList.innerHTML = '';
  if(savedTrips.length === 0) {
    savedTripsList.innerHTML = '<p style="color:var(--text-muted);">No saved trips yet.</p>';
    return;
  }
  savedTrips.forEach(trip => {
    const card = document.createElement('div');
    card.className = 'saved-trip-card';
    card.innerHTML = `
      <div class="st-title">${trip.dest}</div>
      <div class="st-meta"><i class="far fa-calendar"></i> ${trip.date} • ${trip.days} Days</div>
      <div class="st-meta"><i class="fas fa-users"></i> ${trip.travelers} Travelers</div>
    `;
    card.addEventListener('click', async () => {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      currentPlan = trip;
      
      const btnSubmitText = document.getElementById('btn-submit-text');
      const btnSubmitSpinner = document.getElementById('btn-submit-spinner');
      btnSubmitText.style.display = 'none';
      btnSubmitSpinner.style.display = 'inline-block';
      
      await generateDashboard(trip);
      switchView('view-dashboard');
      
      btnSubmitText.style.display = 'inline-block';
      btnSubmitSpinner.style.display = 'none';
    });
    savedTripsList.appendChild(card);
  });
}

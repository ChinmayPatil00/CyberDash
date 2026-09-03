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
  'treks': 'Trending Treks',
  'bike': 'Bike Routes',
  'monsoon': 'Monsoon Getaways',
  'roadtrip': 'Epic Roadtrips',
  'jungle': 'Wildlife Safaris'
};

const indianAdventures = {
  'treks': [
    { title: 'Kalsubai Peak', region: 'Sahyadris, MH', img: 'https://images.unsplash.com/photo-1623120381656-788005391d8e?q=80&w=800&auto=format&fit=crop', base: 'Bari', dest: 'Kalsubai Peak', days: 2, cost: 1200 },
    { title: 'Valley of Flowers', region: 'Uttarakhand', img: 'https://images.unsplash.com/photo-1605221941655-b4618e7d23d8?q=80&w=800&auto=format&fit=crop', base: 'Govindghat', dest: 'Valley of Flowers', days: 5, cost: 2000 },
    { title: 'Kheerganga', region: 'Parvati Valley, HP', img: 'https://images.unsplash.com/photo-1626279148766-3d2b0e99ab67?q=80&w=800&auto=format&fit=crop', base: 'Barshaini', dest: 'Kheerganga', days: 3, cost: 1500 },
    { title: 'Sandhan Valley', region: 'Sahyadris, MH', img: 'https://images.unsplash.com/photo-1596706788880-9cc2e6b194a2?q=80&w=800&auto=format&fit=crop', base: 'Samrad', dest: 'Sandhan Valley', days: 2, cost: 1800 }
  ],
  'bike': [
    { title: 'Manali to Leh', region: 'Himalayas', img: 'https://images.unsplash.com/photo-1583095123963-71e19d08e5be?q=80&w=800&auto=format&fit=crop', base: 'Manali', dest: 'Leh', days: 10, cost: 3500 },
    { title: 'Spiti Valley Circuit', region: 'Himachal', img: 'https://images.unsplash.com/photo-1626027142467-96a2bd3a0c20?q=80&w=800&auto=format&fit=crop', base: 'Shimla', dest: 'Kaza', days: 8, cost: 3000 }
  ],
  'monsoon': [
    { title: 'Malshej Ghat', region: 'Maharashtra', img: 'https://images.unsplash.com/photo-1600870933215-6d0eb0cb4baf?q=80&w=800&auto=format&fit=crop', base: 'Kalyan', dest: 'Malshej Ghat', days: 1, cost: 1500 }
  ],
  'roadtrip': [
    { title: 'Golden Triangle', region: 'North India', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop', base: 'Delhi', dest: 'Jaipur', days: 5, cost: 2500 }
  ],
  'jungle': [
    { title: 'Ranthambore', region: 'Rajasthan', img: 'https://images.unsplash.com/photo-1596707328905-1a8db39fb399?q=80&w=800&auto=format&fit=crop', base: 'Sawai Madhopur', dest: 'Ranthambore National Park', days: 3, cost: 4000 }
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

const currencySelect = document.getElementById('input-currency');

// QA: Set Date Min to Today
const today = new Date().toISOString().split('T')[0];
inputDate.setAttribute('min', today);
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
inputDate.valueAsDate = tomorrow;

function renderSuggestions(vibe) {
  sugArea.style.display = 'block';
  sugLabel.innerText = vibeNames[vibe];
  sugScroll.innerHTML = '';
  const data = indianAdventures[vibe];
  if (!data || data.length === 0) { sugArea.style.display = 'none'; return; }
  
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.innerHTML = `
      <div class="card-img">
        <img src="${item.img}" alt="${item.title}">
        <div class="card-heart"><i class="far fa-heart"></i></div>
      </div>
      <div class="card-info">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <h3 style="margin-bottom:2px;">${item.title}</h3>
          <span style="font-size:0.9rem; color:#222;"><i class="fas fa-star" style="font-size:0.8rem;"></i> 4.9</span>
        </div>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">${item.region}</p>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:8px;">${item.days} Days</p>
        <div style="font-weight:600; font-size:1rem; color:#222;">
          <span style="text-decoration:underline;">₹${item.cost.toLocaleString()}</span> / person
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      inOrigin.value = item.base;
      inDest.value = item.dest;
      
      // Force geocoder on next submit
      inOrigin.dataset.resolvedFor = '';
      inDest.dataset.resolvedFor = '';

      tripDays = item.days;
      valDays.innerText = tripDays;
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

let tripDays = 2;
let tripTravelers = 4;

const valDays = document.getElementById('val-days');
const valTravelers = document.getElementById('val-travelers');

document.getElementById('btn-dec-days').addEventListener('click', () => { if(tripDays > 1) { tripDays--; valDays.innerText = tripDays; updateLiveEstimate(); } });
document.getElementById('btn-inc-days').addEventListener('click', () => { if(tripDays < 60) { tripDays++; valDays.innerText = tripDays; updateLiveEstimate(); } });
document.getElementById('btn-dec-travelers').addEventListener('click', () => { if(tripTravelers > 1) { tripTravelers--; valTravelers.innerText = tripTravelers; updateLiveEstimate(); } });
document.getElementById('btn-inc-travelers').addEventListener('click', () => { if(tripTravelers < 20) { tripTravelers++; valTravelers.innerText = tripTravelers; updateLiveEstimate(); } });

currencySelect.addEventListener('change', updateLiveEstimate);
document.getElementById('input-transport').addEventListener('change', updateLiveEstimate);

function getBaseCost(purpose) {
  const budgetData = { 'treks': 1200, 'bike': 3500, 'monsoon': 1500, 'roadtrip': 2500, 'jungle': 4000 };
  return budgetData[purpose] || 1500;
}

// Reuse Haversine for live estimate calculation
function getDist(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * (Math.PI/180);
  var dLon = (lon2 - lon1) * (Math.PI/180); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}

function updateLiveEstimate() {
  const purpose = purposeInput.value;
  const currency = currencySelect.value;
  const rate = { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095, 'INR': 1.0 }[currency] || 1.0;
  
  let baseINR = getBaseCost(purpose) * tripDays * tripTravelers;
  let transportCost = 0;
  
  const oLat = inOrigin.dataset.lat; const oLon = inOrigin.dataset.lon;
  const dLat = inDest.dataset.lat; const dLon = inDest.dataset.lon;
  
  if (oLat && dLat) {
    const dist = getDist(oLat, oLon, dLat, dLon);
    let tMode = document.getElementById('input-transport').value;
    
    if (tMode === 'auto') {
      if (dist > 1000) tMode = 'flight';
      else if (dist > 150) tMode = 'train';
      else tMode = 'drive';
    }
    
    if (tMode === 'flight') transportCost = (3000 + (dist * 2)) * tripTravelers + (800 * tripTravelers);
    else if (tMode === 'train') transportCost = (dist * 3.5) * tripTravelers + (300 * tripTravelers);
    else transportCost = (dist * 2) * tripTravelers + (150 * tripTravelers);
  }
  
  const finalCost = (baseINR + transportCost) * rate;
  
  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency, maximumFractionDigits: 0 });
  document.getElementById('live-cost').innerText = formatter.format(finalCost);
}
updateLiveEstimate();

// Autocomplete & Smart Calculation
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
                input.dataset.resolvedFor = input.value;
                list.style.display = 'none'; 
                
                // Smart Calculation logic
                if (inputId === 'input-dest' && inOrigin.dataset.lat) {
                  const dist = getDist(inOrigin.dataset.lat, inOrigin.dataset.lon, item.lat, item.lon);
                  const transportSel = document.getElementById('input-transport');
                  
                  // Suggest Transport
                  if (dist > 1000) { transportSel.value = 'flight'; }
                  else if (dist > 150) { transportSel.value = 'train'; }
                  else { transportSel.value = 'drive'; }
                  
                  // Suggest Days
                  let minDays = 1; // base adventure day
                  if (dist > 1000) minDays += 2; // flight travel time (round trip)
                  else if (dist > 500) minDays += 4; // long train time
                  else if (dist > 150) minDays += 2; // train/drive time
                  
                  tripDays = minDays;
                  valDays.innerText = tripDays;
                  document.getElementById('days-sub').innerText = `Auto-calc (${Math.round(dist)}km)`;
                }
                updateLiveEstimate();
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

async function resolveCoords(query) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: data[0].lat, lon: data[0].lon };
    }
  } catch (e) { console.error("Geocoding failed", e); }
  return null;
}

document.getElementById('trip-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const btnSubmitText = document.getElementById('btn-submit-text');
  const btnSubmitSpinner = document.getElementById('btn-submit-spinner');
  const btnSubmit = document.getElementById('btn-submit');
  
  btnSubmit.disabled = true;
  btnSubmitText.style.display = 'none';
  btnSubmitSpinner.style.display = 'inline-block';
  
  let oLat = inOrigin.dataset.lat;
  let oLon = inOrigin.dataset.lon;
  let dLat = inDest.dataset.lat;
  let dLon = inDest.dataset.lon;
  
  // Just-In-Time Geocoding: If the user didn't click autocomplete or clicked a trending card, resolve now
  if (!oLat || inOrigin.dataset.resolvedFor !== inOrigin.value) {
    const coords = await resolveCoords(inOrigin.value);
    if (coords) { oLat = coords.lat; oLon = coords.lon; inOrigin.dataset.lat = oLat; inOrigin.dataset.lon = oLon; inOrigin.dataset.resolvedFor = inOrigin.value; }
  }
  if (!dLat || inDest.dataset.resolvedFor !== inDest.value) {
    const coords = await resolveCoords(inDest.value);
    if (coords) { dLat = coords.lat; dLon = coords.lon; inDest.dataset.lat = dLat; inDest.dataset.lon = dLon; inDest.dataset.resolvedFor = inDest.value; }
  }
  
  currentPlan = {
    origin: inOrigin.value,
    originLat: oLat || '19.0760',
    originLon: oLon || '72.8777',
    dest: inDest.value,
    lat: dLat || '19.0760',
    lon: dLon || '72.8777',
    date: inputDate.value,
    currency: currencySelect.value,
    days: tripDays,
    travelers: tripTravelers,
    purpose: purposeInput.value,
    id: Date.now().toString()
  };

  await generateDashboard(currentPlan);
  
  btnSubmit.disabled = false;
  btnSubmitText.style.display = 'inline-block';
  btnSubmitSpinner.style.display = 'none';
  
  switchView('view-dashboard');

  // QA FIX: Map must initialize AFTER view transition to correctly size itself
  setTimeout(() => {
    if (leafletMap) {
      leafletMap.remove();
    }
    leafletMap = L.map('map').setView([currentPlan.lat, currentPlan.lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);
    L.marker([currentPlan.lat, currentPlan.lon]).addTo(leafletMap)
      .bindPopup(`<b>${currentPlan.dest}</b><br>Mission Coordinates`).openPopup();
    
    leafletMap.invalidateSize();
  }, 300);
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

  // --- 1. Haversine Physics & Dynamic Routing Engine ---
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * (Math.PI/180);
    var dLon = (lon2 - lon1) * (Math.PI/180); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; 
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
  let baseINR = baseCost * plan.days * plan.travelers;
  let expenses = [];

  const distance = getDistanceFromLatLonInKm(
    parseFloat(plan.originLat || 19.0760), parseFloat(plan.originLon || 72.8777),
    parseFloat(plan.lat), parseFloat(plan.lon)
  );

  let transportCost = 0;
  let transportLabel = "Transport";
  let lastMileCost = 0;
  let lastMileLabel = "Last Mile / Cab";

  if (distance < 150) {
    // Hyper-local
    transportLabel = "Local Train / Bus Route";
    transportCost = (distance * 2) * plan.travelers;
    lastMileLabel = "Shared Jeep / Auto to Base";
    lastMileCost = 150 * plan.travelers;
  } else if (distance >= 150 && distance < 1000) {
    // Medium distance
    transportLabel = "Intercity Sleeper / Express";
    transportCost = (distance * 3.5) * plan.travelers;
    lastMileLabel = "Station Taxi";
    lastMileCost = 300 * plan.travelers;
  } else {
    // Long distance
    transportLabel = "Domestic Flight";
    transportCost = (3000 + (distance * 2)) * plan.travelers;
    lastMileLabel = "Airport Transfer";
    lastMileCost = 800 * plan.travelers;
  }

  // Calculate final totals
  let remain = baseINR * 0.7; // remaining budget for stays/food
  let totalINR = transportCost + lastMileCost + remain;
  
  expenses = [
    { label: transportLabel, amount: transportCost * rate },
    { label: lastMileLabel, amount: lastMileCost * rate },
    { label: bData.labels[0] + ' / Stays', amount: (remain * 0.6) * rate },
    { label: 'Food & Logistics', amount: (remain * 0.4) * rate }
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

  // 3. Live Weather API & Dynamic Gear
  let temp = 25;
  let isRaining = false;
  try {
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${plan.lat}&longitude=${plan.lon}&current_weather=true`);
    const weatherData = await weatherRes.json();
    temp = weatherData.current_weather.temperature;
    const wCode = weatherData.current_weather.weathercode;
    isRaining = [51,53,55,61,63,65,80,81,82,95,96,99].includes(wCode);
    
    document.getElementById('dash-weather-temp').innerText = `${temp}°C`;
    document.getElementById('dash-weather-desc').innerText = isRaining ? 'Rain Expected' : 'Clear Conditions';
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
  // QA FIX: Search exactly for the destination instead of appending generic strings
  const searchStr = `${plan.dest}`;
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
      } else {
        // High quality fallback
        const fallbacks = [
          'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2000&auto=format&fit=crop'
        ];
        document.getElementById('dash-hero-bg').style.backgroundImage = `url('${fallbacks[Math.floor(Math.random() * fallbacks.length)]}')`;
      }
    } else {
       document.getElementById('dash-hero-bg').style.backgroundImage = "url('https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2000&auto=format&fit=crop')";
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

// --- PDF Export (Enterprise Feature) ---
document.getElementById('btn-download-pdf').addEventListener('click', () => {
  const element = document.getElementById('pdf-content');
  const opt = {
    margin:       0.5,
    filename:     `Venture_Itinerary_${currentPlan.dest}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  const btn = document.getElementById('btn-download-pdf');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  
  html2pdf().set(opt).from(element).save().then(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Downloaded';
    setTimeout(() => { btn.innerHTML = originalText; }, 2000);
  });
});

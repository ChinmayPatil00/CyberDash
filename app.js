// Venture (Gen-Z Adventure App) Engine

document.addEventListener('DOMContentLoaded', () => {

  // --- Page 1: Vibe Check (index.html) ---
  const tripForm = document.getElementById('trip-form');
  
  if (tripForm) {
    tripForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const planData = {
        origin: document.getElementById('input-origin').value.trim(),
        dest: document.getElementById('input-dest').value.trim(),
        days: parseInt(document.getElementById('input-days').value, 10),
        travelers: parseInt(document.getElementById('input-travelers').value, 10),
        purpose: document.getElementById('input-purpose').value,
        currency: document.getElementById('input-currency').value
      };
      
      localStorage.setItem('venture_data', JSON.stringify(planData));
      window.location.href = 'plan.html';
    });
  }

  // --- Common Retrieval ---
  const rawData = localStorage.getItem('venture_data');
  if (!rawData && (document.getElementById('budget-list') || document.getElementById('itinerary-timeline') || document.getElementById('gear-list'))) {
    window.location.href = 'index.html'; 
    return;
  }
  const plan = rawData ? JSON.parse(rawData) : null;

  // Dictionary for adventure formatting
  const vibeNames = {
    'treks': 'Alpine Trek', 'bike': 'Bike Ride', 'monsoon': 'Monsoon Ride', 
    'roadtrip': 'Epic Roadtrip', 'jungle': 'Jungle Safari', 'skydiving': 'Skydiving',
    'kayaking': 'Kayaking & Rafting', 'surf': 'Surf & Beach', 'camping': 'Wilderness Camping', 'climbing': 'Rock Climbing'
  };

  // --- Page 2: Mission Briefing (plan.html) ---
  const budgetList = document.getElementById('budget-list');
  
  if (budgetList && plan) {
    document.getElementById('display-origin').innerText = plan.origin;
    document.getElementById('display-dest').innerText = plan.dest;
    document.getElementById('display-days').innerText = plan.days;
    document.getElementById('display-travelers').innerText = plan.travelers;
    document.getElementById('display-purpose').innerText = vibeNames[plan.purpose];

    const exchangeRates = { 'USD': 1.0, 'EUR': 0.92, 'GBP': 0.79, 'INR': 83.1 };
    const rate = exchangeRates[plan.currency] || 1.0;

    // Budget Engine
    const baseDailyCostUSD = 80;
    const accommodation = ((baseDailyCostUSD * 0.4) * plan.days * plan.travelers) * rate;
    const food = ((baseDailyCostUSD * 0.3) * plan.days * plan.travelers) * rate;
    const gearRental = ((baseDailyCostUSD * 0.15) * plan.days * plan.travelers) * rate;
    const permits = ((baseDailyCostUSD * 0.15) * plan.days * plan.travelers) * rate; 

    const expenses = [
      { label: 'Basecamp / Accommodation', amount: accommodation },
      { label: 'Rations & Water', amount: food },
      { label: 'Gear Rental & Fuel', amount: gearRental },
      { label: 'Permits & Access Fees', amount: permits }
    ];

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: plan.currency, maximumFractionDigits: 0 });

    let total = 0;
    budgetList.innerHTML = '';
    
    expenses.forEach(exp => {
      total += exp.amount;
      budgetList.innerHTML += `
        <li class="budget-item">
          <span>${exp.label}</span>
          <span style="color:var(--text-main);">${formatter.format(exp.amount)}</span>
        </li>
      `;
    });

    document.getElementById('budget-total').innerText = formatter.format(total);
  }

  // --- Page 3: The Route (itinerary.html) ---
  const timeline = document.getElementById('itinerary-timeline');

  if (timeline && plan) {
    document.getElementById('display-origin').innerText = plan.origin;
    document.getElementById('display-dest-itin').innerText = plan.dest;

    timeline.innerHTML = '<div style="color:var(--primary);"><i class="fas fa-satellite-dish fa-spin"></i> Establishing uplink with Wikipedia geo-satellites...</div>';
    
    // Wikipedia Search Strings mapped to vibes
    const searchMap = {
      'treks': 'mountains and hiking trails',
      'bike': 'scenic motorcycle routes',
      'monsoon': 'waterfalls and hills',
      'roadtrip': 'famous highways',
      'jungle': 'national parks and wildlife',
      'skydiving': 'drop zones and extreme sports',
      'kayaking': 'rivers and lakes',
      'surf': 'beaches and surfing',
      'camping': 'forests and camping sites',
      'climbing': 'canyons and rock formations'
    };

    const searchStr = `${searchMap[plan.purpose]} in ${plan.dest}`;
    const attractionsUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchStr)}&gsrlimit=10&prop=pageimages|extracts&piprop=thumbnail&pithumbsize=600&exsentences=3&exintro=1&explaintext=1&format=json&origin=*`;

    fetch(attractionsUrl)
      .then(res => res.json())
      .then(data => {
        let places = [];
        if (data.query && data.query.pages) {
          places = Object.values(data.query.pages).filter(p => !p.title.includes('List of') && p.extract);
        }

        timeline.innerHTML = '';
        let pIndex = 0;

        for (let i = 1; i <= plan.days; i++) {
          let content = "";
          
          if (i === 1) {
            content = `Deploy from ${plan.origin}. Arrive at Basecamp in ${plan.dest}. Prep gear and acclimatize.`;
          } else if (i === plan.days) {
            content = `Mission accomplished. Break down camp and extract back to ${plan.origin}.`;
          } else {
            if (places.length > 0) {
              const p = places[pIndex % places.length];
              pIndex++;
              
              let img = '';
              if (p.thumbnail && p.thumbnail.source) {
                img = `<img src="${p.thumbnail.source}" class="wiki-photo" alt="${p.title}">`;
              }

              content = `
                <div style="color:var(--text-main); font-weight:900; font-size:1.3rem; margin-bottom:10px;">TARGET: ${p.title}</div>
                <div>${p.extract}</div>
                ${img}
              `;
            } else {
              content = `Push forward through the terrain. Execute ${vibeNames[plan.purpose]} protocols.`;
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
      })
      .catch(() => {
        timeline.innerHTML = '<div style="color:red;">Uplink failed. Proceed using offline maps.</div>';
      });
  }

  // --- Page 4: Survival Loadout (gear.html) ---
  const gearList = document.getElementById('gear-list');

  if (gearList && plan) {
    document.getElementById('display-purpose-gear').innerText = vibeNames[plan.purpose];
    document.getElementById('display-dest-gear').innerText = plan.dest;

    const gearMap = {
      'treks': ['Sturdy Hiking Boots', 'Carabiners', 'Thermal Layers', 'Trekking Poles', 'Altimeter Watch'],
      'bike': ['DOT-Certified Helmet', 'Armored Jacket', 'Riding Gloves', 'Chain Lube', 'Spare Visor'],
      'monsoon': ['Waterproof Poncho', 'Gore-Tex Boots', 'Dry Bags', 'Anti-Fog Spray', 'Traction Mats'],
      'roadtrip': ['Spare Tire', 'Jumper Cables', 'Portable Compressor', 'Energy Drinks', 'Road Flare'],
      'jungle': ['Machete (Optional)', 'Mosquito Repellent', 'Snake Gaiters', 'Water Purifier', 'Hammock'],
      'skydiving': ['GoPro Mount', 'Altimeter', 'Jumpsuit', 'Goggles', 'Hook Knife'],
      'kayaking': ['PFD (Life Jacket)', 'Dry Suit', 'Waterproof Matches', 'Bilge Pump', 'Throw Bag'],
      'surf': ['Wetsuit', 'Surf Wax', 'Ding Repair Kit', 'Reef Booties', 'Zinc Sunscreen'],
      'camping': ['4-Season Tent', 'Sleeping Bag', 'Camp Stove', 'Headlamp', 'Bear Canister'],
      'climbing': ['Climbing Harness', 'Chalk Bag', 'Dynamic Rope', 'Quickdraws', 'Belay Device']
    };

    const loadout = gearMap[plan.purpose] || gearMap['treks'];
    const basics = ['First Aid Kit', 'Multi-tool', 'Satellite Messenger', 'High-Calorie Rations'];
    
    const fullLoadout = [...basics, ...loadout];

    gearList.innerHTML = '';
    fullLoadout.forEach(item => {
      gearList.innerHTML += `
        <label class="gear-item">
          <input type="checkbox"> ${item}
        </label>
      `;
    });
  }
});

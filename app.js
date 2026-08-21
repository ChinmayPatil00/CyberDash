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

    // --- DEEP DYNAMIC BUDGET ENGINE ---
    const budgetData = {
      'treks': { base: 60, labels: ['Basecamp Hostels', 'Trail Rations', 'Trekking Gear Rental', 'National Park Permits'] },
      'bike': { base: 120, labels: ['Motels & Stops', 'Roadhouse Meals', 'Motorcycle Rental & Fuel', 'Tolls & Insurance'] },
      'monsoon': { base: 80, labels: ['Rainforest Lodges', 'Local Cafes', 'All-Terrain Vehicle Rent', 'Eco-Tourism Fees'] },
      'roadtrip': { base: 100, labels: ['Highway Motels', 'Diners & Snacks', 'Car Rental & Gas', 'Tolls & Parking'] },
      'jungle': { base: 150, labels: ['Safari Lodge', 'All-Inclusive Meals', 'Jeep & Guide Hire', 'Conservation Fees'] },
      'skydiving': { base: 350, labels: ['Dropzone Hotel', 'Energy Meals', 'Jump Tickets & Aircraft', 'Parachute Rental'] },
      'kayaking': { base: 90, labels: ['Riverside Cabins', 'Campfire Food', 'Kayak & PFD Rental', 'River Access Fees'] },
      'surf': { base: 110, labels: ['Beachfront Hostel', 'Seafood & Drinks', 'Surfboard Rental', 'Beach Access'] },
      'camping': { base: 30, labels: ['Campsite Fees', 'Supermarket Groceries', 'Firewood & Ice', 'Wilderness Permits'] },
      'climbing': { base: 70, labels: ['Bivouac/Hostel', 'High-Calorie Rations', 'Rope & Harness Rental', 'Crag Access Fees'] }
    };

    const bData = budgetData[plan.purpose] || budgetData['treks'];
    const baseDailyCostUSD = bData.base;
    
    const cost1 = ((baseDailyCostUSD * 0.4) * plan.days * plan.travelers) * rate;
    const cost2 = ((baseDailyCostUSD * 0.3) * plan.days * plan.travelers) * rate;
    const cost3 = ((baseDailyCostUSD * 0.2) * plan.days * plan.travelers) * rate;
    const cost4 = ((baseDailyCostUSD * 0.1) * plan.days * plan.travelers) * rate; 

    const expenses = [
      { label: bData.labels[0], amount: cost1 },
      { label: bData.labels[1], amount: cost2 },
      { label: bData.labels[2], amount: cost3 },
      { label: bData.labels[3], amount: cost4 }
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
    
    // --- DEEP DYNAMIC ITINERARY ENGINE ---
    const routeData = {
      'treks': { search: 'mountains and hiking trails', start: 'Arrive at the trailhead basecamp. Check gear, review the topographic map, and acclimatize.', end: 'Descend from the summit. Celebrate the climb and extract.' },
      'bike': { search: 'scenic motorcycle routes', start: 'Pick up the bikes. Check tire pressure, top up the fuel, and hit the open highway.', end: 'Return the motorcycles. Clean off the road dust and head home.' },
      'monsoon': { search: 'waterfalls and hills', start: 'Equip wet-weather gear. Enter the heavy rain zone and begin the slippery ascent.', end: 'Dry off at the final waypoint. Extract before the storm worsens.' },
      'roadtrip': { search: 'famous highways', start: 'Load the trunk, grab snacks, and merge onto the interstate towards the horizon.', end: 'Pull into the final rest stop. Return the rental car and head out.' },
      'jungle': { search: 'national parks and wildlife', start: 'Meet your local ranger guide at the jungle perimeter. Apply bug spray and enter the canopy.', end: 'Emerge from the dense foliage. Debrief with the rangers.' },
      'skydiving': { search: 'drop zones and extreme sports', start: 'Arrive at the dropzone. Sign waivers, complete the safety briefing, and suit up.', end: 'Log your final jump in the logbook. Pack the rig and extract.' },
      'kayaking': { search: 'rivers and lakes', start: 'Launch the kayaks into the water. Secure the dry bags and paddle downstream.', end: 'Pull the kayaks ashore. Load them onto the roof racks and depart.' },
      'surf': { search: 'beaches and surfing', start: 'Hit the beach early. Check the tide charts, wax the boards, and paddle out.', end: 'Catch the final sunset wave. Wash off the saltwater and head back.' },
      'camping': { search: 'forests and camping sites', start: 'Hike into the wilderness. Pitch the tents, gather firewood, and start the campfire.', end: 'Douse the campfire completely. Leave no trace, pack up, and hike out.' },
      'climbing': { search: 'canyons and rock formations', start: 'Arrive at the crag. Flake the ropes, rack the gear, and prepare for the first ascent.', end: 'Pull the ropes down from the final anchor. Pack the gear and hike out.' }
    };

    const rData = routeData[plan.purpose] || routeData['treks'];
    const searchStr = `${rData.search} in ${plan.dest}`;
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
            content = `Deploy from ${plan.origin}. ${rData.start}`;
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

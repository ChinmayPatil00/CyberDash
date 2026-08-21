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

    // --- DEEP DYNAMIC BUDGET ENGINE (NATIVE INR) ---
    const budgetData = {
      'treks': { base: 1200, labels: ['Basecamp/Tents', 'Trail Rations', 'Transport/Guides', 'Permits'] },
      'bike': { base: 3500, labels: ['Stays & Motels', 'Roadhouse Meals', 'Bike Rental/Fuel', 'Tolls/Misc'] },
      'monsoon': { base: 1500, labels: ['Rainforest Lodges', 'Local Cafes', 'Transport', 'Fees'] },
      'roadtrip': { base: 2500, labels: ['Highway Motels', 'Diners & Snacks', 'Car Rental/Gas', 'Tolls/Parking'] },
      'jungle': { base: 4000, labels: ['Safari Lodge', 'Meals', 'Jeep & Guide Hire', 'Forest Fees'] },
      'skydiving': { base: 15000, labels: ['Hotel', 'Meals', 'Jump Tickets', 'Gear Rental'] },
      'kayaking': { base: 2000, labels: ['Riverside Cabins', 'Food', 'Kayak Rental', 'Access Fees'] },
      'surf': { base: 2500, labels: ['Beachfront Stay', 'Seafood', 'Surfboard Rental', 'Misc'] },
      'camping': { base: 800, labels: ['Campsite Fees', 'Groceries', 'Firewood/Ice', 'Permits'] },
      'climbing': { base: 1500, labels: ['Hostel', 'Rations', 'Gear Rental', 'Crag Access'] }
    };

    const bData = budgetData[plan.purpose] || budgetData['treks'];
    const baseDailyCostINR = bData.base;
    
    const exchangeRates = { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095, 'INR': 1.0 };
    const rate = exchangeRates[plan.currency] || 1.0;
    
    const totalINR = baseDailyCostINR * plan.days * plan.travelers;
    const finalTotal = totalINR * rate;
    
    const cost1 = (totalINR * 0.4) * rate;
    const cost2 = (totalINR * 0.3) * rate;
    const cost3 = (totalINR * 0.2) * rate;
    const cost4 = (totalINR * 0.1) * rate;

    const expenses = [
      { label: bData.labels[0], amount: cost1 },
      { label: bData.labels[1], amount: cost2 },
      { label: bData.labels[2], amount: cost3 },
      { label: bData.labels[3], amount: cost4 }
    ];

    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: plan.currency, maximumFractionDigits: 0 });

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
      'treks': { search: 'mountains and hiking trails', start: 'Hit the trailhead basecamp. Do a quick fit check, secure the bags, and get moving.', end: 'Summit achieved. Catch your breath, snap the pics, and hike out.' },
      'bike': { search: 'scenic motorcycle routes', start: 'Grab the bikes. Check tire pressure, top up the fuel, and hit the open highway.', end: 'Return the motorcycles. Clean off the road dust and head out.' },
      'monsoon': { search: 'waterfalls and hills', start: 'Throw on the wet-weather gear. Enter the heavy rain zone and embrace the mud.', end: 'Dry off at the final stop. Grab some warm food and head out.' },
      'roadtrip': { search: 'famous highways', start: 'Load up the trunk, grab the aux cord, and merge onto the interstate.', end: 'Pull into the final rest stop. Return the rental and wrap it up.' },
      'jungle': { search: 'national parks and wildlife', start: 'Meet your local ranger at the edge. Apply bug spray and enter the canopy.', end: 'Emerge from the dense foliage. Debrief with the rangers and head out.' },
      'skydiving': { search: 'drop zones and extreme sports', start: 'Pull up to the dropzone. Sign waivers, get the safety brief, and suit up.', end: 'Log your final jump. Pack the rig, grab the GoPro footage, and leave.' },
      'kayaking': { search: 'rivers and lakes', start: 'Launch the kayaks. Secure the dry bags and start paddling downstream.', end: 'Pull the kayaks ashore. Load them onto the roof racks and depart.' },
      'surf': { search: 'beaches and surfing', start: 'Hit the beach early. Check the tide charts, wax the boards, and paddle out.', end: 'Catch the final sunset wave. Wash off the saltwater and head back.' },
      'camping': { search: 'forests and camping sites', start: 'Hike deep into the wilderness. Pitch the tents and start the campfire.', end: 'Douse the campfire completely. Leave no trace, pack up, and hike out.' },
      'climbing': { search: 'canyons and rock formations', start: 'Arrive at the crag. Flake the ropes, chalk up, and prepare for the first ascent.', end: 'Pull the ropes down from the final anchor. Pack the gear and hike out.' }
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
                <div style="color:var(--text-main); font-weight:900; font-size:1.3rem; margin-bottom:10px;">📍 THE SPOT: ${p.title}</div>
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
      })
      .catch(() => {
        timeline.innerHTML = '<div style="color:red;">No signal. Proceed using offline maps.</div>';
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

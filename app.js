// WanderPlan v7 - MMT Redesign & Multipage Routing Engine

document.addEventListener('DOMContentLoaded', () => {

  // --- Page 1: Trip Configurator (index.html) ---
  const tripForm = document.getElementById('trip-form');
  
  if (tripForm) {
    tripForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const planData = {
        origin: document.getElementById('input-origin').value.trim(),
        dest: document.getElementById('input-dest').value.trim(),
        days: parseInt(document.getElementById('input-days').value, 10),
        travelers: parseInt(document.getElementById('input-travelers').value, 10),
        style: document.getElementById('input-style').value,
        currency: document.getElementById('input-currency').value,
        medium: document.getElementById('input-medium').value,
        purpose: document.getElementById('input-purpose').value
      };
      
      localStorage.setItem('wanderplan_data', JSON.stringify(planData));
      window.location.href = 'plan.html';
    });
  }

  // --- Common Retrieval ---
  const rawData = localStorage.getItem('wanderplan_data');
  if (!rawData && (document.getElementById('budget-list') || document.getElementById('itinerary-timeline'))) {
    window.location.href = 'index.html'; 
    return;
  }
  const plan = rawData ? JSON.parse(rawData) : null;

  // --- Page 2: Overview & Budget (plan.html) ---
  const budgetList = document.getElementById('budget-list');
  const heroBanner = document.getElementById('hero-banner');
  
  if (budgetList && plan) {
    document.getElementById('display-dest').innerText = plan.dest;
    document.getElementById('display-days').innerText = plan.days;
    document.getElementById('display-travelers').innerText = plan.travelers;
    document.getElementById('display-style').innerText = plan.style;
    document.getElementById('display-currency').innerText = plan.currency;
    document.getElementById('display-medium').innerText = plan.medium;
    document.getElementById('display-purpose').innerText = plan.purpose;

    if (heroBanner) {
      const query = encodeURIComponent(plan.dest);
      heroBanner.style.backgroundImage = `url('https://loremflickr.com/1600/900/${query},landscape/all')`;
    }

    // Advanced Economic Engine
    const exchangeRates = { 'USD': 1.0, 'EUR': 0.92, 'GBP': 0.79, 'INR': 83.1, 'JPY': 149.5 };
    const rate = exchangeRates[plan.currency] || 1.0;

    const destLower = plan.dest.toLowerCase();
    let regionalMultiplier = 1.0; 
    const expensiveRegions = ['us', 'usa', 'america', 'uk', 'london', 'paris', 'france', 'swiss', 'switzerland', 'japan', 'tokyo', 'dubai', 'singapore', 'australia', 'sydney'];
    const cheapRegions = ['india', 'vietnam', 'thailand', 'indonesia', 'bali', 'philippines', 'mexico', 'colombia', 'peru', 'cambodia', 'nepal'];

    if (expensiveRegions.some(r => destLower.includes(r))) regionalMultiplier = 1.8;
    else if (cheapRegions.some(r => destLower.includes(r))) regionalMultiplier = 0.4;

    const styleMultiplierUSD = { 'budget': 50, 'standard': 140, 'luxury': 400 }[plan.style];
    const baseDailyCostUSD = styleMultiplierUSD * regionalMultiplier;
    const transitBaseCostUSD = { 'airplane': 350, 'train': 120, 'bus': 50, 'car': 80 }[plan.medium];

    const transitCost = ((transitBaseCostUSD + (Math.random() * 50)) * plan.travelers) * rate; 
    const accommodation = ((baseDailyCostUSD * 0.45) * plan.days * plan.travelers) * rate;
    const food = ((baseDailyCostUSD * 0.30) * plan.days * plan.travelers) * rate;
    const localTransport = ((baseDailyCostUSD * 0.10) * plan.days * plan.travelers) * rate;
    const misc = ((baseDailyCostUSD * 0.15) * plan.days * plan.travelers) * rate; 

    const expenses = [
      { label: `Main Transit (${plan.medium.charAt(0).toUpperCase() + plan.medium.slice(1)})`, amount: transitCost },
      { label: 'Accommodation', amount: accommodation },
      { label: 'Food & Dining', amount: food },
      { label: 'Local Transport (Taxis, Metros)', amount: localTransport },
      { label: 'Micro-Expenses (Coffee, Entry Fees)', amount: misc }
    ];

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: plan.currency,
      maximumFractionDigits: 0
    });

    let total = 0;
    budgetList.innerHTML = '';
    
    expenses.forEach(exp => {
      total += exp.amount;
      budgetList.innerHTML += `
        <li class="budget-item">
          <span class="budget-label">${exp.label}</span>
          <span class="budget-amount">${formatter.format(exp.amount)}</span>
        </li>
      `;
    });

    document.getElementById('budget-total').innerText = formatter.format(total);
  }

  // --- Page 3: Detailed Itinerary (itinerary.html) ---
  const timeline = document.getElementById('itinerary-timeline');

  if (timeline && plan) {
    document.getElementById('display-origin').innerText = plan.origin;
    document.getElementById('display-dest-itin').innerText = plan.dest;

    timeline.innerHTML = '<div style="color:var(--text-muted);"><i class="fas fa-spinner fa-spin"></i> Mining global databases for real locations, airports, and photos...</div>';
    
    const destQuery = encodeURIComponent(plan.dest);
    const mainSummaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${destQuery}`;
    
    // Dynamic Airport API Fetch (Using Wikipedia Search)
    const originAirportUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent('international airport in ' + plan.origin)}&utf8=&format=json&origin=*`;
    const destAirportUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent('international airport in ' + plan.dest)}&utf8=&format=json&origin=*`;

    let searchTopic = "tourist attractions";
    if (plan.purpose === 'culinary') searchTopic = "food and cuisine";
    if (plan.purpose === 'heritage') searchTopic = "historical sites";
    if (plan.purpose === 'trekking') searchTopic = "parks and nature";
    
    const attractionsUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchTopic + ' in ' + plan.dest)}&gsrlimit=10&prop=pageimages|extracts&piprop=thumbnail&pithumbsize=600&exsentences=3&exintro=1&explaintext=1&format=json&origin=*`;

    Promise.all([
      fetch(mainSummaryUrl).then(res => res.ok ? res.json() : null).catch(() => null),
      fetch(attractionsUrl).then(res => res.ok ? res.json() : null).catch(() => null),
      fetch(originAirportUrl).then(res => res.ok ? res.json() : null).catch(() => null),
      fetch(destAirportUrl).then(res => res.ok ? res.json() : null).catch(() => null)
    ]).then(([mainData, attrData, originAirData, destAirData]) => {
      
      // 1. Process Main Summary
      let wikiExtract = "";
      if (mainData && mainData.extract) {
        wikiExtract = `<br><br><div style="background:rgba(37, 99, 235, 0.05); padding:15px; border-left:4px solid var(--primary); border-radius:4px; font-size:0.95rem;"><strong>📍 Real Location Briefing (${mainData.title}):</strong> ${mainData.extract}</div>`;
      }

      // 2. Process Real Attractions
      let realAttractions = [];
      if (attrData && attrData.query && attrData.query.pages) {
        realAttractions = Object.values(attrData.query.pages).filter(p => !p.title.includes('List of') && p.extract);
      }

      // 3. Process Real Airports
      let originAirport = plan.origin + " Airport";
      if (originAirData && originAirData.query && originAirData.query.search.length > 0) {
        originAirport = originAirData.query.search[0].title;
      }
      let destAirport = plan.dest + " Airport";
      if (destAirData && destAirData.query && destAirData.query.search.length > 0) {
        destAirport = destAirData.query.search[0].title;
      }

      // 4. Transit Strings with Real Airport Injection
      const transitStrings = {
        'airplane': `Board your flight departing from <strong>${originAirport}</strong>. Upon landing at <strong>${destAirport}</strong>, proceed through customs. Take the express airport train or a pre-booked shuttle to the city center.`,
        'train': `Depart from the central railway station in <strong>${plan.origin}</strong>. Enjoy the scenic overland rail journey. Arrive at the main terminus in <strong>${plan.dest}</strong> and catch a local subway to your accommodation.`,
        'bus': `Board the long-distance coach from <strong>${plan.origin}</strong>. Enjoy the highway views during the transit. Arrive at the central bus depot in <strong>${plan.dest}</strong> and hail a local taxi to your stay.`,
        'car': `Pack your vehicle and begin the road trip from <strong>${plan.origin}</strong>. Navigate the highways, taking scenic rest stops along the way. Arrive in <strong>${plan.dest}</strong>, secure parking, and check into your accommodation.`
      };

      const departStrings = {
        'airplane': `Check out and arrange a taxi or airport express train to <strong>${destAirport}</strong>. Proceed through security and board your flight back to <strong>${originAirport}</strong>.`,
        'train': `Check out and take the local metro to the railway station. Board your return train back to <strong>${plan.origin}</strong>.`,
        'bus': `Check out and head to the bus depot. Board your long-distance coach for the return trip to <strong>${plan.origin}</strong>.`,
        'car': `Check out, load the vehicle, and begin the drive back to <strong>${plan.origin}</strong>.`
      };

      timeline.innerHTML = '';
      let attractionIndex = 0;

      for (let i = 1; i <= plan.days; i++) {
        let activity = "";
        
        if (i === 1) {
          activity = `${transitStrings[plan.medium]} Unpack, settle in, and head out on foot for a light dinner to acclimate to ${plan.dest}. ${wikiExtract}`;
        } else if (i === plan.days) {
          activity = `Enjoy a final breakfast and complete any last-minute souvenir shopping. ${departStrings[plan.medium]}`;
        } else {
          if (realAttractions.length > 0) {
            const attraction = realAttractions[attractionIndex % realAttractions.length];
            attractionIndex++;
            
            let photoHtml = '';
            if (attraction.thumbnail && attraction.thumbnail.source) {
              photoHtml = `<img src="${attraction.thumbnail.source}" style="width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin-top:15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" alt="${attraction.title}">`;
            }

            activity = `
              <div style="font-weight:600; font-size:1.1rem; color:var(--text-main); margin-bottom:8px;">
                <i class="fas fa-map-marker-alt" style="color:var(--primary);"></i> Visit: ${attraction.title}
              </div>
              <div style="color:var(--text-muted); line-height:1.6;">${attraction.extract}</div>
              ${photoHtml}
            `;
          } else {
            activity = `Explore the beautiful city of ${plan.dest}. Enjoy the local ${plan.purpose} scene.`;
          }
        }

        timeline.innerHTML += `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-day">Day ${i}</div>
            <div class="timeline-content">${activity}</div>
          </div>
        `;
      }
    });
  }
});

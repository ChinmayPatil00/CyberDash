// WanderPlan - Advanced Core Logic

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
        currency: document.getElementById('input-currency').value
      };
      
      localStorage.setItem('wanderplan_data', JSON.stringify(planData));
      window.location.href = 'plan.html';
    });
  }

  // --- Page 2: Travel Dashboard (plan.html) ---
  const timeline = document.getElementById('itinerary-timeline');
  const budgetList = document.getElementById('budget-list');
  const heroBanner = document.getElementById('hero-banner');
  
  if (timeline && budgetList) {
    const rawData = localStorage.getItem('wanderplan_data');
    if (!rawData) {
      window.location.href = 'index.html'; 
      return;
    }
    
    const plan = JSON.parse(rawData);
    
    // 1. Populate Headers & Banner
    document.getElementById('display-dest').innerText = plan.dest;
    document.getElementById('display-days').innerText = plan.days;
    document.getElementById('display-travelers').innerText = plan.travelers;
    document.getElementById('display-style').innerText = plan.style;
    document.getElementById('display-currency').innerText = plan.currency;

    if (heroBanner) {
      // Dynamic Unsplash/LoremFlickr image based on destination
      const query = encodeURIComponent(plan.dest);
      heroBanner.style.backgroundImage = `url('https://loremflickr.com/1600/900/${query},landscape/all')`;
    }

    // 2. Generate Budget with Currency Conversion
    const exchangeRates = {
      'USD': 1.0,
      'EUR': 0.92,
      'GBP': 0.79,
      'INR': 83.1,
      'JPY': 149.5
    };
    const rate = exchangeRates[plan.currency] || 1.0;

    const baseCostPerDayUSD = {
      'budget': 60,
      'standard': 150,
      'luxury': 450
    }[plan.style];

    // Estimates in USD, then converted
    const flights = ((300 + (Math.random() * 400)) * plan.travelers) * rate; 
    const accommodation = ((baseCostPerDayUSD * 0.45) * plan.days * plan.travelers) * rate;
    const food = ((baseCostPerDayUSD * 0.30) * plan.days * plan.travelers) * rate;
    const localTransport = ((baseCostPerDayUSD * 0.10) * plan.days * plan.travelers) * rate;
    const misc = ((baseCostPerDayUSD * 0.15) * plan.days * plan.travelers) * rate; 

    const expenses = [
      { label: 'Roundtrip Flights / Transit', amount: flights },
      { label: 'Accommodation', amount: accommodation },
      { label: 'Food & Dining', amount: food },
      { label: 'Local Transport (Taxis, Trains, Metro)', amount: localTransport },
      { label: 'Micro-Expenses (Coffee, Snacks, Tips, Entry Fees)', amount: misc }
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

    // 3. Generate Detailed Itinerary
    const midActivities = [
      "Embark on a comprehensive guided walking tour. Utilize the local metro system or a scenic tram to navigate between key historical districts. Stop at a local cafe for a highly-rated regional lunch.",
      "Nature exploration day! Take a regional train or chartered bus out of the city center. Spend the afternoon trekking local trails and immersing yourself in the landscape.",
      "Cultural deep dive. Hail a registered taxi or rideshare to visit renowned museums and cultural heritage sites. Enjoy a curated fine-dining experience in the evening.",
      "Free day for leisure. Use public bicycles or walk to explore hidden alleyways, boutique shopping districts, and local markets at your own pace.",
      "Adventure excursion! You'll be picked up via a local shuttle. Engage in outdoor excursions like kayaking, climbing, or wildlife spotting, depending on the local geography.",
      "Culinary immersion. Navigate via the subway to a bustling local food market. Spend the day tasting authentic street food, followed by an evening cooking class."
    ];

    timeline.innerHTML = '';
    
    for (let i = 1; i <= plan.days; i++) {
      let activity = "";
      if (i === 1) {
        activity = `Depart from ${plan.origin}. Upon arrival at the international terminal in ${plan.dest}, proceed through customs. Take the express airport train or a pre-booked transfer to the city center. Check into your accommodation, unpack, and head out on foot for a light dinner at a local bistro to acclimate to the time zone.`;
      } else if (i === plan.days) {
        activity = `Enjoy a final breakfast and complete any last-minute souvenir shopping in ${plan.dest}. Pack up, check out, and arrange a taxi or airport shuttle transfer to the terminal for your departure back to ${plan.origin}.`;
      } else {
        const randIndex = (i * 7) % midActivities.length;
        activity = midActivities[randIndex];
      }

      timeline.innerHTML += `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-day">Day ${i}</div>
          <div class="timeline-content">${activity}</div>
        </div>
      `;
    }
  }

});

// WanderPlan - Core Logic

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
        style: document.getElementById('input-style').value
      };
      
      // Save to local storage
      localStorage.setItem('wanderplan_data', JSON.stringify(planData));
      
      // Redirect to dashboard
      window.location.href = 'plan.html';
    });
  }

  // --- Page 2: Travel Dashboard (plan.html) ---
  const timeline = document.getElementById('itinerary-timeline');
  const budgetList = document.getElementById('budget-list');
  
  if (timeline && budgetList) {
    const rawData = localStorage.getItem('wanderplan_data');
    if (!rawData) {
      window.location.href = 'index.html'; // Redirect if no data
      return;
    }
    
    const plan = JSON.parse(rawData);
    
    // 1. Populate Headers
    document.getElementById('display-dest').innerText = plan.dest;
    document.getElementById('display-days').innerText = plan.days;
    document.getElementById('display-travelers').innerText = plan.travelers;
    document.getElementById('display-style').innerText = plan.style;

    // 2. Generate Budget
    const baseCostPerDay = {
      'budget': 60,
      'standard': 150,
      'luxury': 450
    }[plan.style];

    // Estimates
    const flights = (300 + (Math.random() * 400)) * plan.travelers; 
    const accommodation = (baseCostPerDay * 0.45) * plan.days * plan.travelers;
    const food = (baseCostPerDay * 0.30) * plan.days * plan.travelers;
    const localTransport = (baseCostPerDay * 0.10) * plan.days * plan.travelers;
    const misc = (baseCostPerDay * 0.15) * plan.days * plan.travelers; // Coffee, snacks, tips

    const expenses = [
      { label: 'Roundtrip Flights / Transit', amount: flights },
      { label: 'Accommodation', amount: accommodation },
      { label: 'Food & Dining', amount: food },
      { label: 'Local Transport (Taxis, Trains)', amount: localTransport },
      { label: 'Micro-Expenses (Coffee, Snacks, Tips)', amount: misc }
    ];

    let total = 0;
    budgetList.innerHTML = '';
    
    expenses.forEach(exp => {
      total += exp.amount;
      budgetList.innerHTML += `
        <li class="budget-item">
          <span class="budget-label">${exp.label}</span>
          <span class="budget-amount">$${Math.round(exp.amount).toLocaleString()}</span>
        </li>
      `;
    });

    document.getElementById('budget-total').innerText = `$${Math.round(total).toLocaleString()}`;

    // 3. Generate Itinerary
    const midActivities = [
      "Guided walking tour of the main historical district.",
      "Nature exploration and local sightseeing.",
      "Visit to renowned museums and cultural heritage sites.",
      "Free day for shopping, cafe hopping, and relaxation.",
      "Adventure day! Local trekking or outdoor excursions.",
      "Culinary tour focusing on authentic local cuisine."
    ];

    timeline.innerHTML = '';
    
    for (let i = 1; i <= plan.days; i++) {
      let activity = "";
      if (i === 1) {
        activity = `Depart from ${plan.origin}. Arrive in ${plan.dest}, check into accommodation, and enjoy a light local dinner to adjust to the timezone.`;
      } else if (i === plan.days) {
        activity = `Final souvenir shopping in ${plan.dest}. Pack up and transfer to the terminal for your departure back to ${plan.origin}.`;
      } else {
        // Pick random activity based on day to make it deterministic for the session
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

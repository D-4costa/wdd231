// script.js -- handles weather and member spotlights
const CHAMBER_CITY = 'Bogotá, CO';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  setupMenu();
  loadWeather();
  loadSpotlights();
});

function setupMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navList');
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? 'none' : 'flex';
  });
}

// --- Simulated Weather for Bogotá (no API calls)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function loadWeather() {
  try {
    const weatherCurrent = document.getElementById('weatherCurrent');
    const weatherForecast = document.getElementById('weatherForecast');

    const conditions = ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Mostly sunny', 'Overcast', 'Breezy'];
    const descriptions = {
      'Sunny': 'clear sky',
      'Partly cloudy': 'partly cloudy',
      'Cloudy': 'cloudy',
      'Light rain': 'light rain',
      'Mostly sunny': 'mostly sunny',
      'Overcast': 'overcast',
      'Breezy': 'light breeze'
    };

    const baseTemp = randomInt(18, 24);
    const currentCondition = pick(conditions);
    weatherCurrent.innerHTML = `<p><strong>Weather in ${CHAMBER_CITY.split(',')[0]}: ${currentCondition}, ${baseTemp}°C</strong> — ${descriptions[currentCondition]}</p>`;

    const forecastDays = [];
    for (let i = 1; i <= 3; i++) {
      const temp = baseTemp + randomInt(-2, 2);
      const cond = pick(conditions);
      const date = new Date();
      date.setDate(date.getDate() + i);
      const label = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      forecastDays.push({ label, temp, cond });
    }

    weatherForecast.innerHTML = '';
    forecastDays.forEach(d => {
      const el = document.createElement('div');
      el.className = 'forecast-item muted';
      el.innerHTML = `<strong>${d.label}</strong>: ${d.temp}°C — ${d.cond}`;
      weatherForecast.appendChild(el);
    });
  } catch (err) {
    console.error('Weather simulation failed', err);
  }
}

// --- Member spotlights using data/members.json
async function loadSpotlights() {
  try {
    const resp = await fetch('data/members.json');
    if (!resp.ok) throw new Error('Member data could not be loaded');
    const members = await resp.json();

    const candidates = members.filter(m => ['gold', 'silver'].includes(m.membership.toLowerCase()));
    shuffleArray(candidates);

    const pickCount = Math.min(3, Math.max(2, Math.floor(Math.random() * 3) + 1));
    const selection = candidates.slice(0, pickCount);

    const container = document.getElementById('spotlightContainer');
    container.innerHTML = '';
    selection.forEach(m => {
      const card = document.createElement('div');
      card.className = 'spotlight';
      card.innerHTML = `
        <img src="${m.logo}" alt="${m.companyName} logo">
        <h3>${m.companyName}</h3>
        <p class="muted">${m.membership.toUpperCase()} Member</p>
        <p>${m.phone}<br>${m.address}</p>
        <p><a href="${m.website}" target="_blank" rel="noopener">Visit website</a></p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

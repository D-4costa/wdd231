
import places from '../data/places.mjs';

document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.getElementById('cards');
  const messageArea = document.getElementById('visit-message');

  // Build cards from imported data
  function buildCard(place){
    const article = document.createElement('article');
    article.className = 'card';
    article.innerHTML = `
      <h2>${place.title}</h2>
      <figure>
        <img src="${place.image}" alt="${place.title}" width="300" height="200" loading="lazy">
      </figure>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <button class="btn" aria-label="Learn more about ${place.title}">Learn More</button>
    `;
    return article;
  }

  places.forEach(p => {
    cardsContainer.appendChild(buildCard(p));
  });

  // localStorage visit message logic
  const LAST_VISIT_KEY = 'chamber_last_visit';
  const now = Date.now();
  const last = localStorage.getItem(LAST_VISIT_KEY);
  if(!last){
    // first visit
    messageArea.textContent = 'Welcome! Let us know if you have any questions.';
  } else {
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.floor((now - parseInt(last,10)) / msPerDay);
    if(days < 1){
      messageArea.textContent = 'Back so soon! Awesome!';
    } else if(days === 1){
      messageArea.textContent = 'You last visited 1 day ago.';
    } else {
      messageArea.textContent = `You last visited ${days} days ago.`;
    }
  }
  // store current visit
  localStorage.setItem(LAST_VISIT_KEY, String(now));
});

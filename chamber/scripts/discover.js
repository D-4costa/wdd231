
import { places } from '../data/places.mjs';

function daysBetween(ms1, ms2){
  const msInDay = 1000*60*60*24;
  return Math.floor(Math.abs(ms2 - ms1) / msInDay);
}

function formatVisitMessage(lastMs){
  if(lastMs === null) return "Welcome! Let us know if you have any questions.";
  const now = Date.now();
  const days = daysBetween(now, lastMs);
  if(days === 0) return "Back so soon! Awesome!";
  if(days === 1) return "You last visited 1 day ago.";
  return `You last visited ${days} days ago.`;
}

function saveVisit(){
  localStorage.setItem('chamber-last-visit', Date.now().toString());
}

function buildCards(container){
  places.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.gridArea = `card${idx+1}`;

    const fig = document.createElement('figure');
    const img = document.createElement('img');
    img.src = p.image;
    img.alt = p.alt || p.title;
    img.loading = 'lazy';
    fig.appendChild(img);
    card.appendChild(fig);

    const body = document.createElement('div');
    body.className = 'card-body';
    const h2 = document.createElement('h2');
    h2.textContent = p.title;
    const addr = document.createElement('address');
    addr.textContent = p.address;
    const desc = document.createElement('p');
    desc.textContent = p.description;

    body.appendChild(h2);
    body.appendChild(addr);
    body.appendChild(desc);
    card.appendChild(body);

    const actions = document.createElement('div');
    actions.className = 'actions';
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Learn More';
    btn.addEventListener('click', () => {
      alert(`${p.title}\n\n${p.address}\n\n${p.description}`);
    });
    actions.appendChild(btn);
    card.appendChild(actions);

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.discover-grid');
  buildCards(container);

  const last = localStorage.getItem('chamber-last-visit');
  const lastMs = last ? Number(last) : null;
  const msgEl = document.querySelector('.visit-text');
  msgEl.textContent = formatVisitMessage(lastMs);
  // Save current visit for next time
  saveVisit();
});

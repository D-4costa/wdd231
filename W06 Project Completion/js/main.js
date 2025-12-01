// js/main.js
import { fetchRecipes } from './data.js';
import { openModal } from './modal.js';
import { formatList, escapeHtml } from './utils.js';

const collectionEl = document.getElementById('collection');
const categorySelect = document.getElementById('category-select');
const searchInput = document.getElementById('search-input');
const showFavoritesBtn = document.getElementById('show-favorites');
const clearFavoritesBtn = document.getElementById('clear-favorites');

let allRecipes = [];
let favorites = new Set(JSON.parse(localStorage.getItem('ps_favorites') || '[]'));

export async function initRecipes() {
  setupNavToggles();
  try {
    // ✅ RUTA ARREGLADA PARA GITHUB Y HOSTING LOCAL
    const data = await fetchRecipes('./data/recipes.json');

    allRecipes = data;
    populateCategories(data);
    renderRecipes(data);

    categorySelect.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', debounce(applyFilters, 200));
    showFavoritesBtn.addEventListener('click', () =>
      renderRecipes(allRecipes.filter(r => favorites.has(r.id)))
    );
    clearFavoritesBtn.addEventListener('click', () => {
      favorites.clear();
      localStorage.setItem('ps_favorites', JSON.stringify([]));
      renderRecipes(allRecipes);
    });
  } catch (err) {
    if (collectionEl)
      collectionEl.innerHTML = '<p class="error">Unable to load recipes.</p>';
  }
}

function setupNavToggles() {
  Array.from(document.querySelectorAll('[id^="nav-toggle"]')).forEach(btn => {
    const controls = btn.getAttribute('aria-controls');
    const nav = document.getElementById(controls);
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (nav) nav.setAttribute('aria-hidden', String(expanded));
    });
  });
}

function populateCategories(items) {
  const cats = Array.from(new Set(items.map(i => i.category)));
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });
}

function renderRecipes(items) {
  if (!collectionEl) return;
  collectionEl.innerHTML = '';

  const toShow = items.slice(0, Math.max(15, items.length));

  toShow.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card recipe';

    card.innerHTML = `
      <img loading="lazy" decoding="async" alt="${escapeHtml(item.title)}" src="${item.image}" width="400" height="300">
      <div class="card-body">
        <h3>${escapeHtml(item.title)}</h3>
        <p class="muted">${escapeHtml(item.desc)}</p>
        <p><strong>Time:</strong> ${escapeHtml(item.time)} • <strong>Serves:</strong> ${escapeHtml(item.servings)}</p>
        <div class="meta">
          <div class="cat">${escapeHtml(item.category)}</div>
          <div>
            <button class="details" data-id="${item.id}">Details</button>
            <button class="favorite" data-id="${item.id}" aria-pressed="${favorites.has(item.id)}">❤</button>
          </div>
        </div>
      </div>
    `;

    card.querySelector('.details').addEventListener('click', () => {
      openModal(
        item.title,
        `
        <img loading="lazy" decoding="async" alt="${escapeHtml(item.title)}" src="${item.image}" style="max-width:100%;border-radius:8px;"/>
        <h3>Ingredients</h3>
        <ul>${formatList(item.ingredients)}</ul>
        <h3>Instructions</h3>
        <p>${escapeHtml(item.desc)} — follow standard prep steps for this recipe.</p>
        <p><strong>Time:</strong> ${escapeHtml(item.time)} • <strong>Serves:</strong> ${escapeHtml(item.servings)}</p>
      `
      );
    });

    card.querySelector('.favorite').addEventListener('click', e => {
      toggleFavorite(item.id, e.currentTarget);
    });

    collectionEl.appendChild(card);
  });
}

function toggleFavorite(id, btn) {
  if (favorites.has(id)) {
    favorites.delete(id);
    btn.setAttribute('aria-pressed', 'false');
  } else {
    favorites.add(id);
    btn.setAttribute('aria-pressed', 'true');
  }
  localStorage.setItem('ps_favorites', JSON.stringify(Array.from(favorites)));
}

function applyFilters() {
  const cat = categorySelect?.value || 'all';
  const q = (searchInput?.value || '').trim().toLowerCase();

  let results = allRecipes.slice();

  if (cat !== 'all') results = results.filter(i => i.category === cat);

  if (q)
    results = results.filter(i =>
      (i.title + ' ' + i.desc + ' ' + (i.ingredients || []).join(' '))
        .toLowerCase()
        .includes(q)
    );

  renderRecipes(results);
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export default { initRecipes };

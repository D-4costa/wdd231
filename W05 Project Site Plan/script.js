
// script.js: fetch pets, modal handling, localStorage for adoption drafts/submissions
document.addEventListener('DOMContentLoaded', () => {
  // update footer years
  const years = document.querySelectorAll('.site-footer p, .site-footer span');
  // pets grid
  if(document.getElementById('pets-grid')){
    loadPets();
    setupModal();
  }

  // adopt form logic
  const form = document.getElementById('adopt-form');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const obj = Object.fromEntries(data.entries());
      try {
        const subs = JSON.parse(localStorage.getItem('submissions') || '[]');
        subs.push({...obj, submittedAt: new Date().toISOString()});
        localStorage.setItem('submissions', JSON.stringify(subs));
        document.getElementById('form-status').textContent = 'Application submitted and saved locally.';
        form.reset();
      } catch(err){
        document.getElementById('form-status').textContent = 'Error saving application.';
      }
    });

    const saveBtn = document.getElementById('save-local');
    if(saveBtn){
      saveBtn.addEventListener('click', () => {
        const data = new FormData(form);
        const obj = Object.fromEntries(data.entries());
        localStorage.setItem('draftAdoption', JSON.stringify(obj));
        document.getElementById('form-status').textContent = 'Draft saved locally.';
      });
    }

    // load draft
    try {
      const draft = JSON.parse(localStorage.getItem('draftAdoption') || 'null');
      if(draft){
        Object.keys(draft).forEach(k => {
          const el = document.getElementById(k);
          if(el) el.value = draft[k];
        });
        document.getElementById('form-status').textContent = 'Loaded saved draft.';
      }
    } catch(e){}
  }
});

async function loadPets(){
  const grid = document.getElementById('pets-grid');
  try {
    const res = await fetch('pets.json');
    if(!res.ok) throw new Error('Failed to load pets.json');
    const pets = await res.json();
    window.__pets = pets;
    grid.innerHTML = '';
    pets.forEach(pet => {
      const card = document.createElement('article');
      card.className = 'pet-card';
      card.innerHTML = `
        <div class="pet-thumb"><img src="${pet.image}" alt="${pet.name} thumbnail" style="max-height:120px; border-radius:8px;"></div>
        <h3>${pet.name}</h3>
        <p class="muted">${pet.age} • ${pet.breed}</p>
        <p>${pet.short}</p>
        <p><button class="btn" data-id="${pet.id}">View details</button></p>
      `;
      grid.appendChild(card);
    });

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-id]');
      if(btn) openPetModal(btn.getAttribute('data-id'));
    });
  } catch(err){
    grid.innerHTML = '<p class="muted">Error loading pets.</p>';
    console.error(err);
  }
}

let petsCache = null;
async function openPetModal(id){
  try {
    if(!window.__pets) {
      const res = await fetch('pets.json');
      window.__pets = await res.json();
    }
    const pet = window.__pets.find(p => String(p.id) === String(id));
    if(!pet) throw new Error('Pet not found');
    const modal = document.getElementById('pet-modal');
    modal.setAttribute('aria-hidden','false');
    document.getElementById('modal-title').textContent = pet.name + ' — ' + pet.age;
    document.getElementById('modal-desc').textContent = pet.description;
    document.getElementById('modal-image').innerHTML = `<img src="${pet.image}" alt="${pet.name}" style="max-width:100%; border-radius:10px;">`;
    const list = document.getElementById('modal-list');
    list.innerHTML = '';
    ['breed','size','sex','location'].forEach(k => {
      if(pet[k]) {
        const li = document.createElement('li');
        li.textContent = k.charAt(0).toUpperCase() + k.slice(1) + ': ' + pet[k];
        list.appendChild(li);
      }
    });
    const adoptBtn = document.getElementById('adopt-btn');
    adoptBtn.onclick = () => {
      try {
        const draft = JSON.parse(localStorage.getItem('draftAdoption') || 'null') || {};
        draft.petName = pet.name;
        localStorage.setItem('draftAdoption', JSON.stringify(draft));
      } catch(e){}
      window.location.href = 'adopt.html';
    };
  } catch(err){
    alert('Error: ' + err.message);
  }
}

function setupModal(){
  const modal = document.getElementById('pet-modal');
  const close = modal.querySelector('.modal-close');
  close.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
  modal.addEventListener('click', (e)=> { if(e.target===modal) modal.setAttribute('aria-hidden','true'); });
  document.addEventListener('keydown', (e)=> { if(e.key==='Escape') modal.setAttribute('aria-hidden','true'); });
}

// js/modal.js
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
let previouslyFocused = null;

export function initModal(){
  if(!modal) return;
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });
}

export function openModal(title, html){
  previouslyFocused = document.activeElement;
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.setAttribute('aria-hidden','false');
  const focusable = modal.querySelector('.modal-content');
  if(focusable) focusable.focus();
}

export function closeModal(){
  modal.setAttribute('aria-hidden','true');
  modalTitle.textContent = '';
  modalBody.innerHTML = '';
  if(previouslyFocused) previouslyFocused.focus();
}

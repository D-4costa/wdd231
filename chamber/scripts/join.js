// join.js - timestamp, menu toggle, modals, accessibility
(() => {
  // ====== Timestamp ======
  const tsInput = document.getElementById('timestamp');
  if (tsInput) tsInput.value = new Date().toISOString(); // sobrescribe valor inicial

  // ====== Menu Toggle ======
  const menuToggle = document.getElementById('menuToggle');
  const menuList = document.getElementById('menuList');
  if (menuToggle && menuList) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      menuList.toggleAttribute('hidden');
    });
  }

  // ====== Modals ======
  const modals = document.querySelectorAll('.modal');
  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modal);
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'false');
      const focusEl = modal.querySelector('button, a, input, textarea, select');
      if (focusEl) focusEl.focus();
    });
  });

  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.setAttribute('aria-hidden', 'true'));
    modal.addEventListener('keydown', e => {
      if (e.key === 'Escape') modal.setAttribute('aria-hidden', 'true');
    });
  });

  // ====== Form Validation ======
  const form = document.getElementById('joinForm');
  if (form) {
    form.addEventListener('submit', e => {
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
      } else if (tsInput) {
        tsInput.value = new Date().toISOString(); // actualiza timestamp al enviar
      }
    });
  }
})();

// join.js - timestamp, menu toggle, modals, accessibility
(function(){
  // timestamp: ISO string
  const ts = new Date();
  const input = document.getElementById('timestamp');
  if(input) input.value = ts.toISOString();

  // menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const menuList = document.getElementById('menuList');
  if(menuToggle){
    menuToggle.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      if(menuList){
        if(menuList.hasAttribute('hidden')) menuList.removeAttribute('hidden');
        else menuList.setAttribute('hidden','');
      }
    });
  }

  // modals (open/close + ESC)
  const openButtons = document.querySelectorAll('.open-modal');
  const modals = document.querySelectorAll('.modal');
  openButtons.forEach(btn=>{
    btn.addEventListener('click', function(){
      const id = this.dataset.modal;
      const modal = document.getElementById(id);
      if(modal){
        modal.setAttribute('aria-hidden','false');
        // focus first focusable element
        const focusEl = modal.querySelector('button, a, input, textarea, select');
        if(focusEl) focusEl.focus();
      }
    });
  });
  modals.forEach(mod=>{
    const close = mod.querySelector('.close-modal');
    if(close){
      close.addEventListener('click', ()=> mod.setAttribute('aria-hidden','true'));
    }
    mod.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') mod.setAttribute('aria-hidden','true');
    });
  });

  // basic client-side validation feedback
  const form = document.getElementById('joinForm');
  if(form){
    form.addEventListener('submit', function(e){
      if(!form.checkValidity()){
        e.preventDefault();
        form.reportValidity();
      }
    });
  }

})();
// -- HAMBURGER MENU --
const hamburgerBtn = document.getElementById('hamburger');
const hamburgerMenu = document.getElementById('hamburgerMenu');
const hamOverlay = document.getElementById('hamOverlay');
function openHamMenu(){
  hamburgerMenu.classList.add('open');
  hamburgerMenu.setAttribute('aria-hidden','false');
  hamburgerBtn.setAttribute('aria-expanded','true');
  hamburgerBtn.classList.add('is-open');
  document.body.style.overflow='hidden';
}
function closeHamMenu(){
  hamburgerMenu.classList.remove('open');
  hamburgerMenu.setAttribute('aria-hidden','true');
  hamburgerBtn.setAttribute('aria-expanded','false');
  hamburgerBtn.classList.remove('is-open');
  document.body.style.overflow='';
}
hamburgerBtn.addEventListener('click',()=>{ hamburgerMenu.classList.contains('open') ? closeHamMenu() : openHamMenu(); });
hamOverlay.addEventListener('click', closeHamMenu);

// ── PAGE SWITCH ──
function showMain(){
  document.getElementById('main-page').style.display='block';
  document.getElementById('contact-page').style.display='none';
  window.scrollTo(0,0);
  nav.classList.toggle('scrolled', window.scrollY > 60);
}
function showContact(){
  document.getElementById('main-page').style.display='none';
  document.getElementById('contact-page').style.display='block';
  nav.classList.remove('scrolled');
  window.scrollTo(0,0);
}

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

// ── ACCORDION ──
function toggleWeek(btn){
  const item = btn.closest('.week-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.week-item.open').forEach(el => el.classList.remove('open'));
  if(!isOpen) item.classList.add('open');
}

// ── PAIN ROW SCROLL SPY ──
const painRows = document.querySelectorAll('.pain-row');
let painActiveIdx = 0;
let lastPainScrollY = window.scrollY;
let painSnapTimer = null;

function getPainTargetIdx(){
  const list = document.querySelector('.pain-list');
  if(!list) return 0;
  const rect = list.getBoundingClientRect();
  const vh = document.documentElement.clientHeight || window.innerHeight;
  const progress = Math.max(0, Math.min(1, (vh * 0.5 - rect.top) / rect.height));
  return Math.min(painRows.length - 1, Math.floor(progress * painRows.length));
}

function applyPainActive(){
  painRows.forEach((row, i) => row.classList.toggle('active', i === painActiveIdx && row.classList.contains('visible')));
}

function updateActivePainRow(){
  const target = getPainTargetIdx();
  const dy = window.scrollY - lastPainScrollY;
  lastPainScrollY = window.scrollY;
  if(dy > 0 && target > painActiveIdx) painActiveIdx = Math.min(painActiveIdx + 1, target);
  else if(dy < 0 && target < painActiveIdx) painActiveIdx = Math.max(painActiveIdx - 1, target);
  applyPainActive();
  clearTimeout(painSnapTimer);
  painSnapTimer = setTimeout(() => { painActiveIdx = getPainTargetIdx(); applyPainActive(); }, 400);
}

window.addEventListener('scroll', updateActivePainRow, {passive:true});
window.addEventListener('resize', () => { lastPainScrollY = window.scrollY; }, {passive:true});

// ── SCROLL ANIMATIONS ──
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const delay = +(entry.target.dataset.delay || 0);
      const isPainRow = entry.target.classList.contains('pain-row');
      setTimeout(() => {
        entry.target.classList.add('visible');
        entry.target.classList.add('visible-fade');
        if(isPainRow) updateActivePainRow();
      }, delay);
      io.unobserve(entry.target);
    }
  });
}, {threshold: 0.08});

document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
const painStagger = window.innerWidth < 768 ? 55 : 100;
document.querySelectorAll('.pain-row').forEach((el,i) => { el.dataset.delay = i*painStagger; io.observe(el); });
document.querySelectorAll('.result-card').forEach((el,i) => { el.dataset.delay = i*90; io.observe(el); });
document.querySelectorAll('.week-item').forEach((el,i) => { el.dataset.delay = i*60; io.observe(el); });
document.querySelectorAll('.offer-card').forEach((el,i) => { el.dataset.delay = i*80; io.observe(el); });

// ── CONTACT FORM ──
function handleSubmit(e){
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Bezig met versturen…';
  fetch('https://formspree.io/f/xbdbrroa', {
    method: 'POST',
    headers: {'Accept': 'application/json'},
    body: new FormData(form)
  })
  .then(res => {
    if(res.ok){
      form.style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
    } else {
      btn.disabled = false;
      btn.textContent = 'Verstuur bericht';
      alert('Er ging iets mis. Probeer het opnieuw of stuur een e-mail naar sja.pennings@gmail.com');
    }
  })
  .catch(() => {
    btn.disabled = false;
    btn.textContent = 'Verstuur bericht';
    alert('Er ging iets mis. Probeer het opnieuw of stuur een e-mail naar sja.pennings@gmail.com');
  });
}

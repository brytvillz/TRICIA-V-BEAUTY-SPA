/* TRICIA-V site script: small vanilla helpers, plus GSAP + Lenis loaded after the page is ready. */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
let lenis = null;

/* Fonts load without blocking first paint (the link starts as media="print"). */
document.querySelectorAll('link[data-fonts]').forEach((l) => { l.media = 'all'; });

/* ── Header: scrolled state ── */
const nav = $('#nav');
function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 40); }
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile menu: a full-screen panel that lives directly under <body> ── */
const burger = $('#burger');
const panel = $('#menuPanel');
const menuClose = $('#menuClose');
const pageParts = () => ['#nav', '#main', 'footer', '.wa-float', '#lb'].map((q) => $(q)).filter(Boolean);
function menuIsOpen() { return !!panel && panel.classList.contains('open'); }
function openMenu() {
  if (!panel || menuIsOpen()) return;
  panel.removeAttribute('inert');
  pageParts().forEach((el) => el.setAttribute('inert', ''));   // page behind is not focusable or readable
  panel.classList.add('open');
  root.classList.add('menu-open');                               // locks page scroll, hides the WhatsApp button
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Close menu');
  if (lenis) lenis.stop();
  // the panel was visibility:hidden a moment ago: flush styles so the close button is focusable (WebKit)
  void panel.offsetWidth;
  menuClose.focus();
  if (!panel.contains(document.activeElement)) requestAnimationFrame(() => menuClose.focus());
}
function closeMenu(restoreFocus = true) {
  if (!panel || !menuIsOpen()) return;
  panel.classList.remove('open');
  panel.setAttribute('inert', '');
  pageParts().forEach((el) => el.removeAttribute('inert'));
  root.classList.remove('menu-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open menu');
  if (lenis) lenis.start();
  if (restoreFocus) burger.focus();
}
if (burger && panel) {
  burger.addEventListener('click', openMenu);
  menuClose.addEventListener('click', () => closeMenu());
  // tapping any link closes the menu (the page then scrolls or navigates)
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(false); });
  // keep keyboard focus inside the menu while it is open
  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = [...panel.querySelectorAll('a[href], button:not([disabled])')].filter((el) => el.getClientRects().length);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  // Safari skips links when tabbing, so the check above can be bypassed: if focus ever lands outside, pull it back in
  panel.addEventListener('focusout', (e) => {
    if (!menuIsOpen() || (e.relatedTarget && panel.contains(e.relatedTarget))) return;
    setTimeout(() => { if (menuIsOpen() && !panel.contains(document.activeElement)) menuClose.focus(); }, 0);
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) closeMenu(false); });
  window.addEventListener('pageshow', () => closeMenu(false));  // back/forward cache: never come back with it open
}

/* ── Services menu (button + list, works by keyboard and touch) ── */
const menu = $('#svcMenu');
const menuBtn = $('#svcMenuBtn');
function setSub(open) {
  if (!menu || !menuBtn) return;
  menu.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
if (menu && menuBtn) {
  menuBtn.addEventListener('click', () => setSub(!menu.classList.contains('open')));
  menuBtn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); setSub(true); const a = menu.querySelector('.submenu a'); if (a) a.focus(); }
  });
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const items = [...menu.querySelectorAll('.submenu a')];
      const i = items.indexOf(document.activeElement);
      if (i > -1) { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus(); }
    }
  });
  menu.addEventListener('focusout', (e) => { if (!menu.contains(e.relatedTarget)) setSub(false); });
  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) setSub(false); });
}

/* ── Theme toggle (one in the header, one in the mobile menu) ── */
const toggles = [...document.querySelectorAll('[data-theme-toggle]')];
function syncThemeUi() {
  const dark = root.getAttribute('data-theme') === 'dark';
  toggles.forEach((t) => t.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode'));
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', dark ? '#0B0A09' : '#FBF8F2');
}
syncThemeUi();
toggles.forEach((t) => t.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.classList.add('theme-anim');
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: choice lasts for this visit */ }
  syncThemeUi();
  setTimeout(() => root.classList.remove('theme-anim'), 400);
}));

/* ── Open / closed status (Africa/Lagos) ── */
const status = $('#status');
function lagosNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const day = get('weekday'); // Mon..Sun
  return { day, mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
}
function updateStatus() {
  if (!status) return;
  let n;
  try { n = lagosNow(); } catch (e) { return; }
  const workDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(n.day);
  const OPEN = 8 * 60, CLOSE = 21 * 60;
  let state, title, sub;
  if (workDay && n.mins >= OPEN && n.mins < CLOSE) { state = 'open'; title = 'Open now'; sub = 'Until 9pm'; }
  else {
    state = 'closed'; title = 'Closed now';
    const toMonday = n.day === 'Sun' || (n.day === 'Sat' && n.mins >= CLOSE);
    sub = toMonday ? 'Opens Monday 8am' : 'Opens 8am';
  }
  status.setAttribute('data-state', state);
  $('#statusTitle').textContent = title;
  $('#statusSub').textContent = sub;
}
updateStatus();
if (status) setInterval(updateStatus, 60000);

/* ── Hero video: starts only after the load event; poster only under reduced motion ── */
const video = $('#heroVideo');
if (video && !reduce) {
  video.muted = true;
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    video.querySelectorAll('source').forEach((s) => { s.src = s.getAttribute('data-src'); });
    video.load();
    const p = video.play(); if (p && p.catch) p.catch(() => {});
  };
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!started) return;
        if (e.isIntersecting) { const p = video.play(); if (p && p.catch) p.catch(() => {}); } else video.pause();
      });
    }).observe(video);
  }
}

/* ── Lightbox (home gallery) ── */
const lb = $('#lb');
if (lb) {
  const lbImg = $('#lbImg');
  const lbClose = $('#lbClose');
  let lastFocus = null;
  const open = (src, alt) => {
    lastFocus = document.activeElement;
    lbImg.src = src; lbImg.alt = alt;
    lb.classList.add('open');
    if (lenis) lenis.stop(); else root.style.overflow = 'hidden';
    lbClose.focus();
  };
  const close = () => {
    if (!lb.classList.contains('open')) return;
    lb.classList.remove('open');
    lbImg.removeAttribute('src');
    if (lenis) lenis.start(); else root.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };
  document.querySelectorAll('.gal-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      if (img) open(img.getAttribute('src'), img.alt);
    });
  });
  lb.addEventListener('click', (e) => { if (e.target !== lbImg) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (menuIsOpen()) { closeMenu(); return; }
  if (menu && menu.classList.contains('open')) { setSub(false); if (menuBtn) menuBtn.focus(); }
});

/* ── In-page anchors (smooth with Lenis when it is running) ── */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href*="#"]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin || u.pathname !== location.pathname || !u.hash) return;
  const target = u.hash === '#' ? document.body : document.querySelector(u.hash);
  if (!target) return;
  e.preventDefault();
  if (target.classList && target.classList.contains('svc')) { target.classList.remove('flash'); void target.offsetWidth; target.classList.add('flash'); }
  // header clearance comes from the scroll-margin-top on sections and cards (honoured by Lenis and by scrollIntoView)
  if (lenis) lenis.scrollTo(target);
  else target.scrollIntoView({ behavior: 'auto', block: 'start' });
  history.replaceState(null, '', u.hash);
});

/* ── Motion: GSAP + ScrollTrigger + Lenis, loaded after the page is ready ── */
async function motion() {
  if (reduce) return;
  const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
    import('gsap'), import('gsap/ScrollTrigger'), import('lenis'),
  ]);
  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);                       // Lenis drives ScrollTrigger
  gsap.ticker.add((t) => lenis.raf(t * 1000));                    // GSAP's ticker drives Lenis
  gsap.ticker.lagSmoothing(0);
  if (burger && burger.getAttribute('aria-expanded') === 'true') lenis.stop();

  /* Reveals for everything below the fold, batched per row */
  const items = gsap.utils.toArray('[data-reveal]').filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.9);
  if (items.length) {
    gsap.set(items, { y: 44, opacity: 0 });
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.12, overwrite: true, clearProps: 'transform,opacity' }),
    });
  }

  /* Gallery: a few percent of scale as each image crosses the viewport */
  gsap.utils.toArray('.gal-item img').forEach((img) => {
    gsap.fromTo(img, { scale: 1.06 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: img.parentElement.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  ScrollTrigger.refresh();
}
const startMotion = () => (window.requestIdleCallback ? window.requestIdleCallback(motion, { timeout: 2000 }) : setTimeout(motion, 300));
if (document.readyState === 'complete') startMotion(); else window.addEventListener('load', startMotion, { once: true });

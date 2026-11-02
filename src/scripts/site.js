/* TRICIA-V site script: small vanilla helpers, plus GSAP + Lenis loaded after the page is ready. */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
let lenis = null;

/* ── Photos: a placeholder colour (CSS), then a 300ms fade as each one arrives. Photos that are already loaded are left alone. ── */
document.querySelectorAll('img.ph').forEach((img) => {
  if (img.complete || img.getAttribute('fetchpriority') === 'high') return;   // already there (or the hero photo, which must paint at once)
  img.classList.add('ph-wait');
  const show = () => img.classList.remove('ph-wait');
  img.addEventListener('load', () => { (img.decode ? img.decode() : Promise.resolve()).then(show, show); }, { once: true });   // decoded first, so it never pops in half-ready
  img.addEventListener('error', show, { once: true });
});

/* ── Splash: leaves as soon as the hero is ready (never before 400ms, never after 3s) ──
   Ready = the splash logo, the video bubble's poster and every photo above the fold are loaded and decoded, and the fonts are in. */
const splash = $('#splash');
if (splash && root.classList.contains('splash-on')) {
  const MIN = 430, MAX = 3000;   // MIN carries a ~30ms margin for the frame between 'started' and 'actually painted', so at least 400ms is really shown
  // the clock starts when the overlay was really painted (the first-paint entry), not when the head script ran:
  // the first paint can come noticeably later, and 400ms means 400ms on screen
  const ring = splash.querySelector('circle');
  const anim = ring && ring.getAnimations ? ring.getAnimations()[0] : null;
  const paintedAt = () => new Promise((res) => {
    const seen = performance.getEntriesByName ? performance.getEntriesByName('first-paint')[0] : null;
    if (seen) return res(seen.startTime);
    const fallback = () => res(anim && typeof anim.startTime === 'number' ? anim.startTime : parseInt(root.getAttribute('data-st') || '0', 10));
    if (!('PerformanceObserver' in window)) return fallback();
    let done = false;
    const finish = (fn) => { if (!done) { done = true; fn(); } };
    try {
      const po = new PerformanceObserver((list) => { const e = list.getEntriesByName('first-paint')[0]; if (e) { po.disconnect(); finish(() => res(e.startTime)); } });
      po.observe({ type: 'paint', buffered: true });
    } catch (e) { return fallback(); }
    setTimeout(() => finish(fallback), 300);   // engines that never report first-paint: the animation's start time
  });
  let gone = false, start = 0;
  const hide = (why) => {
    if (gone) return; gone = true;
    if (import.meta.env.DEV) console.info(`[splash] dismissed ${Math.round(performance.now() - start)}ms after first paint (${why})`);
    splash.classList.add('is-out');                                // 300ms fade, pointer-events none
    setTimeout(() => { splash.remove(); root.classList.remove('splash-on'); root.removeAttribute('data-st'); }, 340);
  };
  const decoded = (img) => (img.complete ? Promise.resolve() : new Promise((res) => { img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true }); }))
    .then(() => (img.decode ? img.decode().catch(() => {}) : null));
  const inView = (img) => { const r = img.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth; };
  const waits = [...document.images].filter((i) => splash.contains(i) || inView(i)).map(decoded);   // the splash logo + everything above the fold
  const poster = $('#heroVideo') && $('#heroVideo').getAttribute('poster');
  if (poster) { const im = new Image(); im.src = poster; waits.push(decoded(im)); }
  const link = $('link[data-fonts]');   // fonts: the stylesheet is in, a frame has laid text out (so the faces are requested), then document.fonts.ready
  waits.push(new Promise((res) => { if (!link || link.sheet) res(); else { link.addEventListener('load', res, { once: true }); link.addEventListener('error', res, { once: true }); } })
    .then(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))))
    .then(() => document.fonts && document.fonts.ready));
  paintedAt().then((t0) => {
    start = t0;
    setTimeout(() => hide('3s limit'), Math.max(0, t0 + MAX - performance.now()));
    Promise.all(waits.map((w) => w.catch(() => {}))).then(() => setTimeout(() => hide('ready'), Math.max(0, t0 + MIN - performance.now())));
  });
}

/* Focus rings are for keyboard users: remember the last kind of input (CSS hides the ring after a tap or click). */
const setInput = (v) => { if (root.getAttribute('data-input') !== v) root.setAttribute('data-input', v); };
document.addEventListener('keydown', (e) => { if (!e.metaKey && !e.ctrlKey && !e.altKey) setInput('keyboard'); }, true);
['pointerdown', 'mousedown', 'touchstart'].forEach((t) => document.addEventListener(t, () => setInput('pointer'), { capture: true, passive: true }));

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
  let state, text;
  if (workDay && n.mins >= OPEN && n.mins < CLOSE) { state = 'open'; text = 'Open now · until 9pm'; }
  else {
    state = 'closed';
    const toMonday = n.day === 'Sun' || (n.day === 'Sat' && n.mins >= CLOSE);
    text = toMonday ? 'Opens Monday 8am' : 'Closed now · opens 8am';
  }
  status.setAttribute('data-state', state);
  $('#statusText').textContent = text;
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

/* ── Tour video: the bubble's video full screen in a native <dialog>, with controls and sound ── */
const tourDialog = $('#tourDialog');
const tourBtn = $('#tourBtn');
if (tourDialog && tourBtn && typeof tourDialog.showModal === 'function') {
  const tourVideo = $('#tourVideo');
  tourBtn.hidden = false;
  tourBtn.addEventListener('click', () => {
    if (!tourVideo.querySelector('source')) {
      ['webm', 'mp4'].forEach((ext) => {
        const src = document.createElement('source');
        src.src = `/videos/about-loop.${ext}`; src.type = `video/${ext}`;
        tourVideo.appendChild(src);
      });
      tourVideo.load();
    }
    if (video) video.pause();
    tourDialog.showModal();
    if (lenis) lenis.stop(); else root.style.overflow = 'hidden';
    tourVideo.controls = true; tourVideo.muted = false;   // controls are added on opening: a closed dialog carries no player UI
    const p = tourVideo.play(); if (p && p.catch) p.catch(() => {});
    $('#tourClose').focus();
  });
  $('#tourClose').addEventListener('click', () => tourDialog.close());
  tourDialog.addEventListener('close', () => {   // Escape, the close button or anything else
    tourVideo.pause();
    if (lenis) lenis.start(); else root.style.overflow = '';
    tourBtn.focus();
    if (video && !reduce && video.querySelector('source[src]')) { const p = video.play(); if (p && p.catch) p.catch(() => {}); }
  });
}

/* ── Home page: the floating WhatsApp button steps aside while the hero booking card is on screen ── */
const heroBook = $('.hero-book'), waFloat = $('.wa-float');
if (heroBook && waFloat && 'IntersectionObserver' in window) {
  new IntersectionObserver((entries) => { waFloat.classList.toggle('is-away', entries[entries.length - 1].isIntersecting); }).observe(heroBook);   // .hero-book includes the room the bubble overhangs
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
  // the viewer's "View photo larger" button opens the current photo (full-size .jpg) in the lightbox
  const enlarge = $('#storyEnlarge');
  if (enlarge) enlarge.addEventListener('click', () => {
    const img = document.querySelector('.story-slide.is-current img.story-photo');
    if (img) open(img.getAttribute('src'), img.alt);
  });
  lb.addEventListener('click', (e) => { if (e.target !== lbImg) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (menuIsOpen()) { closeMenu(); return; }
  if (menu && menu.classList.contains('open')) { setSub(false); if (menuBtn) menuBtn.focus(); }
});

/* ── About image: bounce only while it is on screen (CSS does the motion; none under reduced motion) ── */
const aboutArt = $('#aboutArt');
if (aboutArt && !reduce && 'IntersectionObserver' in window) {
  new IntersectionObserver((es) => es.forEach((e) => aboutArt.classList.toggle('is-live', e.isIntersecting)), { threshold: 0.3 }).observe(aboutArt);
}

/* ── In-page anchors (smooth with Lenis when it is running) ── */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href*="#"]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin || u.pathname !== location.pathname || !u.hash) return;
  const target = u.hash === '#' ? document.body : document.querySelector(u.hash);
  if (!target) return;
  e.preventDefault();
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

  /* Service stack: as each card reaches its sticky position the previous one scales back and dims,
     the new photo settles from 1.08 to 1 (scrubbed), and the pills slide in. Transforms and opacity only. */
  const cards = gsap.utils.toArray('.gcard');
  const stickTop = (card) => parseFloat(getComputedStyle(card).top) || 0;
  cards.forEach((card, i) => {
    const img = card.querySelector('.g-photo img');
    gsap.fromTo(img, { scale: 1.08 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: card, start: 'top bottom', end: () => 'top top+=' + stickTop(card), scrub: true, invalidateOnRefresh: true },
    });
    if (i > 0) {
      const prev = cards[i - 1];
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: card, scrub: true, invalidateOnRefresh: true,
          start: () => 'top top+=' + (stickTop(prev) + prev.offsetHeight),   // this card's top meets the previous card's bottom
          end: () => 'top top+=' + stickTop(card),                           // ...until it reaches its own sticky spot
        },
      });
      tl.fromTo(prev, { scale: 1 }, { scale: 0.94, transformOrigin: '50% 0%' }, 0)
        .fromTo(prev.querySelector('.g-dim'), { opacity: 0 }, { opacity: 0.38 }, 0);
    }
    const pills = card.querySelectorAll('.pill');
    gsap.from(pills, {
      y: 14, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out', clearProps: 'transform,opacity',
      scrollTrigger: { trigger: card, start: 'top 75%', end: 'max', once: true },
    });
  });

  ScrollTrigger.refresh();
}
const startMotion = () => (window.requestIdleCallback ? window.requestIdleCallback(motion, { timeout: 2000 }) : setTimeout(motion, 300));
if (document.readyState === 'complete') startMotion(); else window.addEventListener('load', startMotion, { once: true });

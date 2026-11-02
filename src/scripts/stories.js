/* Phone stories viewer for "Our Work": auto-advance every 4s, tap/swipe/arrow keys, thumbnails. No libraries. */
const viewer = document.getElementById('storyViewer');
if (viewer) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const slides = [...viewer.querySelectorAll('.story-slide')];
  const bars = [...viewer.querySelectorAll('.bar')];
  const thumbs = [...document.querySelectorAll('#storyThumbs .thumb')];
  const thumbsBox = document.getElementById('storyThumbs');
  const label = document.getElementById('storyLabel');
  const live = document.getElementById('storyLive');
  const pauseBtn = document.getElementById('storyPause');
  const labels = slides.map((s) => s.dataset.label);
  const alts = slides.map((s) => s.querySelector('img.story-photo').alt);
  const n = slides.length;
  let cur = 0;
  // anything that should hold the story still
  const hold = { pressed: false, hovered: false, focused: false, offscreen: true, user: false, hidden: document.hidden };

  function applyPause() {
    const why = Object.keys(hold).filter((k) => hold[k]);
    viewer.classList.toggle('is-paused', why.length > 0);
    viewer.dataset.hold = why.join(',');   // which reasons are holding it (handy when testing)
  }

  function render(announce) {
    slides.forEach((s, i) => { const on = i === cur; s.classList.toggle('is-current', on); if (on) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true'); });
    bars.forEach((b, i) => {
      b.classList.toggle('is-done', i < cur);
      const on = i === cur; b.classList.toggle('is-current', on);
      if (on) { const f = b.firstElementChild; f.style.animation = 'none'; void f.offsetWidth; f.style.animation = ''; }   // restart the 4s fill
    });
    thumbs.forEach((t, i) => { t.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
    label.textContent = labels[cur];
    // keep the current thumbnail in view in the mobile row (scrolls the row only, never the page)
    const t = thumbs[cur];
    if (thumbsBox.scrollWidth > thumbsBox.clientWidth + 2) thumbsBox.scrollTo({ left: t.offsetLeft - (thumbsBox.clientWidth - t.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    // spoken only for things the visitor did: an announcement every 4s while auto-playing would be unbearable
    if (announce) live.textContent = alts[cur];
  }
  const go = (i, announce) => { cur = (i + n) % n; render(announce); };

  // 4s auto-advance is the progress bar's CSS animation; when it ends, move on (and loop)
  bars.forEach((b) => b.firstElementChild.addEventListener('animationend', () => { if (b.classList.contains('is-current')) go(cur + 1, false); }));

  // tap zones
  let swiped = false;
  document.getElementById('storyNext').addEventListener('click', () => { if (swiped) { swiped = false; return; } go(cur + 1, true); });
  document.getElementById('storyPrev').addEventListener('click', () => { if (swiped) { swiped = false; return; } go(cur - 1, true); });

  // press-and-hold pauses; a horizontal swipe changes photo
  let sx = 0, sy = 0;
  viewer.addEventListener('pointerdown', (e) => { hold.pressed = true; applyPause(); sx = e.clientX; sy = e.clientY; swiped = false; });
  const release = (e) => {
    if (!hold.pressed) return; hold.pressed = false; applyPause();
    if (e.type === 'pointerup') {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) { swiped = true; go(cur + (dx < 0 ? 1 : -1), true); }
    }
  };
  viewer.addEventListener('pointerup', release); viewer.addEventListener('pointercancel', release);
  // hover-to-pause only where a real mouse exists (phones can report a phantom hover after a tap)
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  viewer.addEventListener('pointerenter', (e) => { if (canHover && e.pointerType === 'mouse') { hold.hovered = true; applyPause(); } });
  viewer.addEventListener('pointerleave', () => { hold.hovered = false; if (hold.pressed) hold.pressed = false; applyPause(); });
  // hold still for keyboard focus only: a tap or click also focuses a button, and that must not freeze the story
  viewer.addEventListener('focusin', (e) => { let kb = false; try { kb = e.target.matches(':focus-visible'); } catch (err) { /* old browser: never hold on focus */ } hold.focused = kb; applyPause(); });
  viewer.addEventListener('focusout', (e) => { if (!viewer.contains(e.relatedTarget)) { hold.focused = false; applyPause(); } });

  // keyboard
  viewer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1, true); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1, true); }
  });

  // thumbnails
  thumbs.forEach((t, i) => t.addEventListener('click', () => go(i, true)));

  // Pause / Play
  if (reduce) { pauseBtn.hidden = true; }
  else pauseBtn.addEventListener('click', () => {
    hold.user = !hold.user; applyPause();
    pauseBtn.setAttribute('aria-pressed', String(hold.user));
    pauseBtn.setAttribute('aria-label', hold.user ? 'Play' : 'Pause');
    pauseBtn.classList.toggle('is-paused', hold.user);
  });

  // only run while on screen and while the tab is visible
  if ('IntersectionObserver' in window) new IntersectionObserver((es) => { hold.offscreen = !es[0].isIntersecting; applyPause(); }, { threshold: 0.35 }).observe(viewer);
  else hold.offscreen = false;
  document.addEventListener('visibilitychange', () => { hold.hidden = document.hidden; applyPause(); });
  applyPause();
  render(false);
}

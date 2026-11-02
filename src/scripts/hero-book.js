/* Home hero booking card: validates service, day and time, then opens WhatsApp with the request written out.
   No backend, no storage. The "Full booking form" link carries the choices over to /booking. */
import { WA, lagosToday, DAY_ERRORS, dayProblem as dayProblemOf, dayLabel } from './bookdate.js';
const form = document.getElementById('heroForm');
if (form) {
  const $ = (id) => document.getElementById(id);
  const service = $('h-service'), day = $('h-day'), full = $('heroFull');
  const radios = [...form.querySelectorAll('input[name="htime"]')];

  // the form works: hide the plain-link fallback, show the form
  form.hidden = false; $('heroFallback').hidden = true;

  const today = lagosToday();
  day.min = today;
  const dayProblem = () => dayProblemOf(day.value, today);

  /* errors: inline, linked with aria-describedby, announced */
  const errEl = (el) => $(el.name === 'htime' ? 'h-time-err' : `${el.id}-err`);
  const marker = (el) => (el.name === 'htime' ? $('hfield-time') : el);
  function setError(el, msg) {
    const e = errEl(el); e.textContent = msg; e.hidden = false; e.setAttribute('role', 'alert');
    marker(el).setAttribute('aria-invalid', 'true'); marker(el).closest('.field').classList.add('has-error');
  }
  function clearError(el) {
    const e = errEl(el); e.textContent = ''; e.hidden = true; e.removeAttribute('role');
    marker(el).removeAttribute('aria-invalid'); marker(el).closest('.field').classList.remove('has-error');
  }
  const liveDay = () => { const p = dayProblem(); if (p && p !== 'none') setError(day, DAY_ERRORS[p]); else clearError(day); };

  /* keep the "Full booking form" link in step with the choices */
  function carry() {
    const q = new URLSearchParams();
    if (service.value) q.set('service', service.value);
    if (day.value && !dayProblem()) q.set('day', day.value);
    const t = radios.find((r) => r.checked); if (t) q.set('time', t.dataset.key);
    const s = q.toString(); full.setAttribute('href', s ? `/booking?${s}` : '/booking');
  }
  service.addEventListener('change', () => { if (service.value) clearError(service); carry(); });
  day.addEventListener('input', () => { liveDay(); carry(); }); day.addEventListener('change', () => { liveDay(); carry(); });
  radios.forEach((r) => r.addEventListener('change', () => { clearError(radios[0]); carry(); }));

  function validate() {
    const bad = [];
    const check = (el, msg) => { if (msg) { setError(el, msg); bad.push(el); } else clearError(el); };
    check(service, service.value ? '' : 'Please choose a service.');
    const dp = dayProblem(); check(day, dp ? DAY_ERRORS[dp] : '');
    check(radios[0], radios.some((r) => r.checked) ? '' : 'Please choose a time.');
    return bad;
  }
  const message = () => [
    "Hello TRICIA-V, I'd like to book an appointment.",
    `Service: ${service.value}`,
    `Day: ${dayLabel(day.value)}`,
    `Time: ${radios.find((r) => r.checked).value}`,
    '(Sent from your website)',
  ].join('\n');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = validate();
    if (bad.length) { bad[0].focus(); return; }
    window.location.href = WA + encodeURIComponent(message());   // same tab
  });
}

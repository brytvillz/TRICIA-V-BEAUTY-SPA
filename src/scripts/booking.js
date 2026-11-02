/* Booking form: validates in the browser, then opens WhatsApp with the request written out. No backend, no storage. */
import { WA, lagosToday, parseDay, DAY_ERRORS, dayProblem as dayProblemOf, dayLabel } from './bookdate.js';
const form = document.getElementById('bookingForm');
if (form) {
  const $ = (id) => document.getElementById(id);
  const service = $('f-service'), day = $('f-day'), name = $('f-name'), home = $('f-home'), loc = $('f-location'), note = $('f-note');
  const radios = [...form.querySelectorAll('input[name="time"]')];

  // the form works: hide the plain-link fallback, show the form
  form.hidden = false; $('bookingFallback').hidden = true;

  /* ── helpers ── */
  const key = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
  const oneLine = (s) => s.replace(/\s+/g, ' ').trim();
  const today = lagosToday();
  day.min = today;

  /* ── pre-select from ?service= (a service name, or a group such as "facials") ── */
  const options = [...service.querySelectorAll('option')].filter((o) => o.value);
  const ALIAS = { manicureandnaildesigns: 'Manicure', tattoos: 'Tattoo' };   // service-page names that differ from the form's wording
  const wanted = new URLSearchParams(location.search).get('service');
  if (wanted) {
    const k = key(wanted);
    const exact = options.find((o) => key(o.value) === k) || options.find((o) => ALIAS[k] && o.value === ALIAS[k]);
    const group = [...service.querySelectorAll('optgroup')].find((g) => key(g.dataset.slug) === k || key(g.label) === k);
    if (exact) service.value = exact.value;
    else if (group) {   // several treatments in this group: put it first and ask, rather than guess one
      service.insertBefore(group, service.querySelector('optgroup'));
      service.options[0].textContent = `Choose a treatment (${group.label} shown first)`;
    } else if (k === 'homeservice') { home.checked = true; }
  }

  /* ── ?day=2026-11-08 and ?time=morning|afternoon|evening (carried over from the home hero card) ── */
  const q = new URLSearchParams(location.search);
  const wantDay = q.get('day'), wantTime = q.get('time');
  if (wantDay && parseDay(wantDay)) day.value = wantDay;   // a Sunday or past day still shows its error, below
  if (wantTime) { const r = radios.find((x) => key(x.value).startsWith(key(wantTime))); if (r) r.checked = true; }

  /* ── home service toggle ── */
  const locField = $('field-location');
  function syncHome() {
    locField.hidden = !home.checked; loc.required = home.checked;
    if (!home.checked) clearError(loc);
  }
  home.addEventListener('change', syncHome);   // (first run is below, once the error helpers exist)

  /* ── note counter ── */
  const count = () => { $('f-note-n').textContent = String(note.value.length); };
  note.addEventListener('input', count); count();

  /* ── errors: inline, linked with aria-describedby, announced ── */
  const errEl = (el) => $(el.name === 'time' ? 'f-time-err' : `${el.id}-err`);
  function setError(el, msg) {
    const e = errEl(el); e.textContent = msg; e.hidden = false; e.setAttribute('role', 'alert');
    const field = el.name === 'time' ? $('field-time') : el;
    field.setAttribute('aria-invalid', 'true'); field.closest('.field').classList.add('has-error');
  }
  function clearError(el) {
    const e = errEl(el); e.textContent = ''; e.hidden = true; e.removeAttribute('role');
    const field = el.name === 'time' ? $('field-time') : el;
    field.removeAttribute('aria-invalid'); field.closest('.field').classList.remove('has-error');
  }
  const dayProblem = () => dayProblemOf(day.value, today);
  // tell people about a Sunday (or a past day) as soon as they pick it, not only when they press send
  const liveDay = () => { const p = dayProblem(); if (p && p !== 'none') setError(day, DAY_ERRORS[p]); else clearError(day); };
  day.addEventListener('change', liveDay); day.addEventListener('input', liveDay);
  service.addEventListener('change', () => { if (service.value) clearError(service); });
  radios.forEach((r) => r.addEventListener('change', () => clearError(radios[0])));
  name.addEventListener('input', () => { if (name.value.trim()) clearError(name); });
  loc.addEventListener('input', () => { if (loc.value.trim()) clearError(loc); });

  if (day.value) liveDay();
  syncHome();   // initial state (may have been ticked by ?service=home-service)

  /* ── validate, in page order; focus the first problem ── */
  function validate() {
    const bad = [];
    const check = (el, msg) => { if (msg) { setError(el, msg); bad.push(el); } else clearError(el); };
    check(service, service.value ? '' : 'Please choose a service.');
    const dp = dayProblem(); check(day, dp ? DAY_ERRORS[dp] : '');
    check(radios[0], radios.some((r) => r.checked) ? '' : 'Please choose a time.');
    check(name, name.value.trim() ? '' : 'Please enter your name.');
    if (home.checked) check(loc, loc.value.trim() ? '' : 'Please enter your town or area.');
    return bad;
  }

  /* ── the WhatsApp message ── */
  function message() {
    const lines = [
      "Hello TRICIA-V, I'd like to book an appointment.",
      `Service: ${service.value}`,
      `Day: ${dayLabel(day.value)}`,
      `Time: ${radios.find((r) => r.checked).value}`,
      `Name: ${oneLine(name.value)}`,
    ];
    if (home.checked) lines.push(`Home service: Yes, at ${oneLine(loc.value)}`);
    if (note.value.trim()) lines.push(`Note: ${oneLine(note.value)}`);
    lines.push('(Sent from your website)');
    return lines.join('\n');
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = validate();
    if (bad.length) { bad[0].focus(); return; }
    window.location.href = WA + encodeURIComponent(message());   // same tab
  });
}

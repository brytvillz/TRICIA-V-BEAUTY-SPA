/* Shared by the booking page and the home hero card: WhatsApp number, Lagos "today", day parsing and the Sunday rule. */
export const WA = 'https://wa.me/2348061172417?text=';
export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Today's date in Nigeria (WAT) as "2026-11-08", whatever the visitor's own time zone. */
export function lagosToday() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const g = (t) => parts.find((p) => p.type === t).value;
  return `${g('year')}-${g('month')}-${g('day')}`;
}

/** "2026-11-08" -> a calendar date (built from its parts, so no time-zone shift), or null. */
export function parseDay(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || ''); if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]); return d.getMonth() === +m[2] - 1 ? d : null;
}

export const DAY_ERRORS = { none: 'Please choose a day.', bad: 'Please choose a valid day.', past: 'Please pick today or a later day.', sunday: "We're closed on Sundays. Please pick Monday to Saturday." };

/** null when the day can be booked, otherwise a key of DAY_ERRORS. */
export function dayProblem(value, today) {
  if (!value) return 'none'; const d = parseDay(value); if (!d) return 'bad';
  if (value < today) return 'past'; if (d.getDay() === 0) return 'sunday'; return null;
}

/** "Saturday 8 November" */
export function dayLabel(value) {
  const d = parseDay(value); return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

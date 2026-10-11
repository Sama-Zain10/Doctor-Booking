const TZ = "Africa/Cairo";

export const cairoNow = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
};

export const parseDate = (dateStr) => {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== dateStr ? null : d;
};

export const isFuture = (dateStr, time) => {
  const now = cairoNow();
  return dateStr > now.date || (dateStr === now.date && time > now.time);
};

const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const toTime = (mins) =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

export const generateSlots = (doctor, dateStr) => {
  if (!doctor.is_active) return [];

  const isDayOff = (doctor.days_off || []).some(
    (d) => new Date(d).toISOString().slice(0, 10) === dateStr
  );
  if (isDayOff) return [];

  const dayOfWeek = new Date(`${dateStr}T00:00:00.000Z`).getUTCDay(); 
  const step = doctor.slot_duration_minutes || 30;
  const slots = [];

  for (const w of doctor.availability || []) {
    if (w.day_of_week !== dayOfWeek) continue;
    for (let t = toMinutes(w.start_time); t + step <= toMinutes(w.end_time); t += step) {
      slots.push(toTime(t));
    }
  }
  return [...new Set(slots)].sort();
};
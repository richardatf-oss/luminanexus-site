const TORAH_REF = /^(Genesis|Exodus|Leviticus|Numbers|Deuteronomy) \d+:\d+(?:-(?:\d+:)?\d+)?$/;

export function calendarOptions(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Invalid reading calendar.');
  const diaspora = input.diaspora ?? '1';
  const timezone = input.timezone ?? 'UTC';
  if (!['0', '1'].includes(diaspora) || typeof timezone !== 'string' || timezone.length > 80) throw Error('Invalid reading calendar.');
  try { new Intl.DateTimeFormat('en', { timeZone: timezone }).format(); }
  catch { throw Error('Choose a valid time zone.'); }
  return { diaspora, timezone };
}

export function studyWeek(now, timezone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now).map(part => [part.type, part.value]));
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  const local = new Date(`${date}T12:00:00Z`);
  const day = local.getUTCDay();
  local.setUTCDate(local.getUTCDate() + (6 - day));
  return { date, shabbat: local.toISOString().slice(0, 10), studyDay: day + 1 };
}

export function normalizePortion(payload, options, week) {
  if (payload?.date !== week.shabbat) throw Error('The calendar returned a different date.');
  const item = payload?.calendar_items?.find(item => item?.title?.en?.toLowerCase() === 'parashat hashavua');
  if (!item?.displayValue?.en || !TORAH_REF.test(item.ref)) throw Error('No verified weekly Torah reading was returned.');
  const readings = (item.extraDetails?.aliyot || []).slice(0, 7).filter(ref => typeof ref === 'string' && TORAH_REF.test(ref));
  return {
    ...options, ...week,
    name: item.displayValue.en,
    hebrewName: item.displayValue.he || '',
    ref: item.ref,
    url: sourceUrl(item.ref),
    description: typeof item.description?.en === 'string' ? item.description.en : '',
    readings: readings.length === 7 ? readings : [item.ref],
    source: 'Sefaria',
  };
}

export function sourceUrl(ref) {
  return `https://www.sefaria.org/${encodeURIComponent(ref.replaceAll(' ', '_').replaceAll(':', '.'))}`;
}

export async function loadWeeklyPortion(input = {}, { now = new Date(), fetcher = fetch } = {}) {
  const options = calendarOptions(input);
  const week = studyWeek(now, options.timezone);
  const [year, month, day] = week.shabbat.split('-');
  const params = new URLSearchParams({ ...options, year, month, day });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetcher(`https://www.sefaria.org/api/calendars?${params}`, {
      headers: { Accept: 'application/json' }, signal: controller.signal,
    });
    if (!response.ok) throw Error('The reading calendar is temporarily unavailable.');
    return normalizePortion(await response.json(), options, week);
  } finally { clearTimeout(timeout); }
}

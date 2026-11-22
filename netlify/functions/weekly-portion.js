import { calendarOptions, loadWeeklyPortion } from './lib/weeklyPortion.js';

export async function handler(event) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Use GET.' }) };
  let options;
  try { options = calendarOptions(event.queryStringParameters || {}); }
  catch (error) { return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) }; }
  try {
    return { statusCode: 200, headers, body: JSON.stringify(await loadWeeklyPortion(options)) };
  } catch {
    return { statusCode: 503, headers, body: JSON.stringify({ error: 'The weekly reading could not be verified. Please retry or use the Sefaria calendar.' }) };
  }
}

/**
 * Global Equity Valuations Database Free API — JavaScript / TypeScript client example.
 *
 * Demonstrates how to fetch equity valuation ratios from the public
 * Global Equity Valuations Database Free API. No authentication required. Uses the native `fetch`
 * API, which is built into Node.js 18+ and every modern browser.
 *
 * Run in Node.js:
 *     node javascript_client.js
 *
 * Or paste the functions into a browser console at any URL — the API
 * supports CORS, so it works from any frontend.
 *
 * What you'll see when you run this:
 *   - The full list of indices currently in the free tier
 *   - The historical month-ends for which data is available
 *   - The NASDAQ 100 forward P/E ratio for each of those month-ends
 */

const BASE_URL = "https://siblisresearch.supabase.co/functions/v1/free-data-api";

/** Return the list of indices currently exposed in the free tier. */
async function listIndices() {
  const r = await fetch(`${BASE_URL}/v1/indices`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()).indices;
}

/** Return the list of historical month-ends available in the free tier. */
async function listDates() {
  const r = await fetch(`${BASE_URL}/v1/dates`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()).dates;
}

/**
 * Fetch a single valuation ratio time-series for a single ticker.
 *
 * @param {string} ticker - Symbol from /v1/indices, e.g. 'NDX', 'FTSE'.
 * @param {string} ratio  - 'pe-trailing' | 'pe-forward' | 'cape'
 *                          | 'dividend-yield'
 * @returns {Promise<Array<{ "trading_day (EOD)": string, value: number }>>}
 */
async function fetchRatio(ticker, ratio) {
  const r = await fetch(`${BASE_URL}/v1/${ticker}/${ratio}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()).data;
}

// ---- Demo --------------------------------------------------------------
(async () => {
  console.log("=== Available indices ===");
  for (const idx of await listIndices()) {
    console.log(`  ${idx.ticker.padEnd(14)} ${idx.index_name} (${idx.currency})`);
  }

  console.log("\n=== Available month-ends ===");
  for (const d of await listDates()) {
    console.log(`  ${d}`);
  }

  console.log("\n=== NASDAQ 100 forward P/E ===");
  for (const point of await fetchRatio("NDX", "pe-forward")) {
    console.log(`  ${point["trading_day (EOD)"]}  ${point.value}`);
  }

  console.log(
    "\nNeed daily data, the full ticker universe, or sector indices?\n" +
    "See https://siblisresearch.com/valuations-database-pricing/"
  );
})();

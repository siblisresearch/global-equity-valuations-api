# Global Equity Valuations Database - Free API

Free, no-key, public HTTP API of key valuation ratios & multiples for the most followed U.S. and global stock indices, including sector-based indices.

For country and regional indices, historical trailing P/E, forward P/E, CAPE ratio, and dividend yield are available. For U.S. sector indices, trailing P/E, CAPE ratio, P/B, dividend yield, and EV/EBITDA is available. Global sector indices will be added to the database in Q3 2026.

To examine how the ratios is calculated, [read the full data methodology document (PDF)](https://siblisresearch.com/wp-content/uploads/2026/06/Siblis-Research-Data-Methodology.pdf).

This is the **free promotional tier** of the [Siblis Research](https://siblisresearch.com) Global Equity Valuations Database. The full API delivers **daily** data for **~70 indices** across decades of history, plus statistics endpoints and bulk CSV downloads. [Get your API key →](https://siblisresearch.com/global-valuations-database/)

Note: The API provides valuation metrics at the stock index level only and does not include data for individual companies.

---

## What you get for free

- A subset of the most important global equity indices, including sector indices (see [/v1/indices](#list-the-free-tier-tickers))
- Historical month-end snapshots (see [/v1/dates](#list-the-available-dates))
- No signup, no API key, just `curl` / `fetch` / `requests`

## What you don't get

- Daily data — the free tier is month-end only
- Most recent data — only specific historical month-ends are exposed
- The full ticker universe (~70 indices)
- The `/stats` and bulk-download endpoints

For full access, [get your API key](https://siblisresearch.com/global-valuations-database/).

---

## Base URL

```
https://siblisresearch.supabase.co/functions/v1/free-data-api
```

All endpoints in this README append to that base.

## Endpoints

### List the free-tier tickers

```
GET /v1/indices
```

The ticker symbols returned here are the ones you use when calling the per-ticker endpoint below. They may differ from the symbols used by the commercial Siblis API — always call `/v1/indices` first to discover the exact symbols the free tier accepts.


```json
{
  "indices": [
    { "ticker": "DAX",        "index_name": "DAX Index (Germany)",                "currency": "Local", "frequency": "daily" },
    { "ticker": "NDX",        "index_name": "NASDAQ 100 Index",             "currency": "USD", "frequency": "daily" },
    { "ticker": "WORLD", "index_name": "Developed World Index",  "currency": "USD", "frequency": "daily" }
  ],
  "_meta": { "tier": "free", "commercial_api": "https://siblisresearch.com" }
}
```

### List the available dates

```
GET /v1/dates
```

```json
{
  "dates": ["2025-12-31", "2025-09-30", "2025-06-30", "2024-12-31", "2024-06-30"]
}
```

### Get a single ratio for a single ticker

```
GET /v1/<TICKER>/<ratio>
```

Where `<ratio>` is one of:
`pe-trailing`, `pe-forward`, `cape`, `pb`, `dividend-yield`, `ev-ebitda`.

```
GET /v1/US-ENER/cape
```

```json
{
  "ticker":     "US-ENER",
  "index_name": "U.S. Large Cap Energy Index",
  "currency":   "USD",
  "frequency":  "daily",
  "ratio":      "cape",
  "data": [
    { "trading_day (EOD)": "2024-06-30", "value": 28.72 },
    { "trading_day (EOD)": "2024-12-31", "value": 27.05 },
    { "trading_day (EOD)": "2025-06-30", "value": 26.67 },
    { "trading_day (EOD)": "2025-09-30", "value": 27.34 },
    { "trading_day (EOD)": "2025-12-31", "value": 26.36 }
  ]
}
```

There are no query parameters. Every call returns every available month-end for that ticker.

---

## Rate limit

500 requests per IP per UTC day. Above that you get HTTP 429:

```json
{
  "error":    "rate_limit_exceeded",
  "message":  "Free tier is capped at 500 requests per day per IP. For higher limits, see https://siblisresearch.com.",
  "reset_at": "2026-05-25T00:00:00.000Z"
}
```

Most realistic clients will never hit this because responses are cached for an hour at the browser and a day at the CDN.

---

## Examples

### curl

```bash
curl -s "$BASE/v1/SSE/cape"             # CAPE for SSE Composite Index (Mainland China)
curl -s "$BASE/v1/WORLD/pe-forward"  # forward P/E for Developed World Index
```

### Python

```python
import requests

BASE = "https://siblisresearch.supabase.co/functions/v1/free-data-api"

def fetch(ticker: str, ratio: str) -> list[dict]:
    r = requests.get(f"{BASE}/v1/{ticker}/{ratio}", timeout=30)
    r.raise_for_status()
    return r.json()["data"]

for point in fetch("N225", "cape"):
    print(point["trading_day (EOD)"], point["value"])
```

### JavaScript / TypeScript (browser or Node)

```ts
const BASE = "https://siblisresearch.supabase.co/functions/v1/free-data-api";

async function fetchRatio(ticker: string, ratio: string) {
  const r = await fetch(`${BASE}/v1/${ticker}/${ratio}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const json = await r.json();
  return json.data as Array<{ "trading_day (EOD)": string; value: number }>;
}

const cape = await fetchRatio("N225", "cape");
console.table(cape);
```

### Google Sheets

```
=IMPORTDATA("https://siblisresearch.supabase.co/functions/v1/free-data-api/v1/N225/cape")
```

(IMPORTDATA returns JSON as a single string. For a parsed table, use Apps Script or an add-on. The same call works directly inside Excel's Power Query → "From Web".)

---

## Stability and changes

The free tier's exposed tickers, dates, and naming are configured server-side and may change over time. The URL structure and response shape are stable and versioned (`/v1/`). When breaking changes are needed, a `/v2/` route will be added in parallel before `/v1/` is retired.

If you build something on top of this and need notification of changes, please open an issue on this repo.

---

## License

The code samples in this repository are MIT-licensed. The data returned by the API is © Siblis Research, Ltd. and is provided for non-commercial use. While every effort is made to ensure data accuracy, Siblis Research accepts no liability for any inaccuracies in the data. For commercial use, see [siblisresearch.com](https://siblisresearch.com).

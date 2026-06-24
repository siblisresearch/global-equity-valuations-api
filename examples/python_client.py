"""
Siblis Free API — Python client example.

Demonstrates how to fetch equity valuation ratios from the public
Siblis free API. No authentication required. Runs as-is with Python
3.7 or later and the standard `requests` library.

Install dependencies:
    pip install requests

Run:
    python python_client.py

What you'll see when you run this:
  - The full list of indices currently in the free tier
  - The historical month-ends for which data is available
  - The NASDAQ 100 forward P/E ratio for each of those month-ends
"""

import requests

BASE_URL = "https://siblisresearch.supabase.co/functions/v1/free-data-api"


def list_indices():
    """Return the list of indices currently exposed in the free tier."""
    r = requests.get(f"{BASE_URL}/v1/indices", timeout=30)
    r.raise_for_status()
    return r.json()["indices"]


def list_dates():
    """Return the list of historical month-ends available in the free tier."""
    r = requests.get(f"{BASE_URL}/v1/dates", timeout=30)
    r.raise_for_status()
    return r.json()["dates"]


def fetch_ratio(ticker, ratio):
    """
    Fetch a single valuation ratio time-series for a single ticker.

    Parameters
    ----------
    ticker : str
        Ticker symbol from /v1/indices, e.g. 'NDX', 'FTSE', 'DAX'.
    ratio : str
        One of: 'pe-trailing', 'pe-forward', 'cape', 'pb',
        'dividend-yield', 'ev-ebitda'.

    Returns
    -------
    list of dict
        Each dict has keys 'trading_day (EOD)' (ISO date string)
        and 'value' (float).
    """
    r = requests.get(f"{BASE_URL}/v1/{ticker}/{ratio}", timeout=30)
    r.raise_for_status()
    return r.json()["data"]


if __name__ == "__main__":
    print("=== Available indices ===")
    for idx in list_indices():
        print(f"  {idx['ticker']:14}  {idx['index_name']}  ({idx['currency']})")

    print("\n=== Available month-ends ===")
    for d in list_dates():
        print(f"  {d}")

    print("\n=== NASDAQ 100 forward P/E ===")
    for point in fetch_ratio("NDX", "pe-forward"):
        print(f"  {point['trading_day (EOD)']}  {point['value']}")

    print(
        "\nNeed daily data, the full ticker universe, or sector indices?\n"
        "See https://siblisresearch.com/valuations-database-pricing/"
    )

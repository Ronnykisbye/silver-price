// =========================================================
// AFSNIT 01 – API ENDPOINTS (stabile + CORS)
// =========================================================
//
// Primær sølvkilde: Gold API (gratis, ingen nøgle, CORS)
// Docs: https://gold-api.com/docs
// Pris: https://api.gold-api.com/price/XAG
//
// Valuta: Frankfurter (USD -> DKK)
//

const GOLD_API_SILVER = 'https://api.gold-api.com/price/XAG';
const FX_USD_DKK = 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=DKK';

// =========================================================
// AFSNIT 02 – HJÆLPER: SAFE FETCH (timeout + bedre fejl)
// =========================================================
async function fetchJson(url, { timeoutMs = 12000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      signal: ctrl.signal
    });

    if (!res.ok) {
      throw new Error(`${url} fejlede: HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // Gør abort-fejl mere læsbar
    if (err?.name === 'AbortError') {
      throw new Error(`${url} timeout efter ${timeoutMs} ms`);
    }
    throw err;
  } finally {
    clearTimeout(t);
  }
}

// =========================================================
// AFSNIT 03 – HENT SØLVPRIS (USD pr. troy ounce)
// =========================================================
export async function fetchSilverUsdPerOunce() {
  // Gold API returnerer typisk: { "name": "...", "price": 82.34, ... }
  const data = await fetchJson(GOLD_API_SILVER, { timeoutMs: 12000 });

  const p = Number(data?.price);
  if (!Number.isFinite(p) || p <= 0) {
    throw new Error('Gold API format ukendt (mangler price)');
  }

  return p; // USD / oz
}

// =========================================================
// AFSNIT 04 – USD → DKK
// =========================================================
export async function fetchUsdToDkk() {
  const data = await fetchJson(FX_USD_DKK, { timeoutMs: 12000 });

  const rate = Number(data?.rates?.DKK);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error('Frankfurter format ukendt (mangler DKK-rate)');
  }

  return { rate, date: data?.date ?? null };
}

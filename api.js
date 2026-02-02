// =========================================================
// AFSNIT 01 – API ENDPOINTS (kun netværk her)
// =========================================================
const METALS_LIVE_SPOT = 'https://api.metals.live/v1/spot';
const FX_USD_DKK = 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=DKK';

// =========================================================
// AFSNIT 02 – HENT SØLVPRIS (USD / troy ounce)
// =========================================================
export async function fetchSilverUsdPerOunce(){
  const res = await fetch(METALS_LIVE_SPOT, { cache: 'no-store' });
  if (!res.ok) throw new Error(`metals.live fejlede: HTTP ${res.status}`);

  const data = await res.json();

  // metals.live spot endpoint returnerer typisk et array. Vi læser robust:
  // Mulige nøgler: "silver" eller "XAG" afhængigt af API format.
  const obj = Array.isArray(data) ? data[0] : data;

  const candidates = [
    obj?.silver,
    obj?.XAG,
    obj?.xag
  ].map(Number).filter(v => Number.isFinite(v) && v > 0);

  const usdPerOunce = candidates[0];
  if (!usdPerOunce) throw new Error('metals.live format ukendt (mangler sølvpris)');

  return usdPerOunce;
}

// =========================================================
// AFSNIT 03 – USD → DKK
// =========================================================
export async function fetchUsdToDkk(){
  const res = await fetch(FX_USD_DKK, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Frankfurter fejlede: HTTP ${res.status}`);

  const data = await res.json();
  const rate = Number(data?.rates?.DKK);
  if (!(rate > 0)) throw new Error('Ugyldigt Frankfurter-format (mangler DKK-rate)');

  return { rate, date: data?.date ?? null };
}

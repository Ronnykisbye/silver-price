// =========================================================
// AFSNIT 01 – API ENDPOINTS (kun netværk her)
// =========================================================
//
// Sølv spotpris (USD pr. troy ounce) – CORS enabled, ingen nøgle:
// https://api.gold-api.com/price/XAG
//
// USD→DKK – Frankfurter (gratis):
// https://api.frankfurter.dev/v1/latest?base=USD&symbols=DKK
//
// Hvis noget ændrer sig i API’er, ret kun i DENNE FIL.

const SILVER_USD_OZ = 'https://api.gold-api.com/price/XAG';
const FX_USD_DKK = 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=DKK';

// =========================================================
// AFSNIT 02 – HENT SØLVPRIS (USD pr. troy ounce)
// =========================================================
export async function fetchSilverUsdPerOunce(){
  const res = await fetch(SILVER_USD_OZ, { cache: 'no-store' });
  if (!res.ok) throw new Error(`gold-api fejlede: HTTP ${res.status}`);

  const data = await res.json();

  // Forventet: { "price": 23.45, "currency": "USD", ... }
  const price = Number(data?.price);
  if (!(price > 0)) throw new Error('Uventet gold-api format (mangler price)');

  return price;
}

// =========================================================
// AFSNIT 03 – HENT USD→DKK
// =========================================================
export async function fetchUsdToDkk(){
  const res = await fetch(FX_USD_DKK, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Frankfurter fejlede: HTTP ${res.status}`);

  const data = await res.json();
  const rate = Number(data?.rates?.DKK);
  if (!(rate > 0)) throw new Error('Uventet Frankfurter-format (mangler DKK-rate)');

  return { rate, date: data?.date ?? null };
}

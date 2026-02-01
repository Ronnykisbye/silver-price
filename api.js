// =========================================================
// AFSNIT 01 – API ENDPOINTS (kun netværk her)
// =========================================================
//
// metals.live endpoint (gratis, ingen nøgle) bruges i eksempler i open-source plugin:
// https://api.metals.live/v1/spot  (returnerer bl.a. silver i USD pr. troy ounce)
//
// Frankfurter (gratis, ingen nøgle):
// https://api.frankfurter.dev/v1/latest?base=USD&symbols=DKK
//
// OBS: Hvis en API ændrer format, ret kun i DENNE FIL.

const METALS_LIVE_SPOT = 'https://api.metals.live/v1/spot';
const FX_USD_DKK = 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=DKK';

// =========================================================
// AFSNIT 02 – HENT SØLVPRIS (USD pr. troy ounce)
// =========================================================
export async function fetchSilverUsdPerOunce(){
  const res = await fetch(METALS_LIVE_SPOT, { cache: 'no-store' });
  if (!res.ok) throw new Error(`metals.live fejlede: HTTP ${res.status}`);
  const data = await res.json();

  // Format fra metals.live: array af arrays, sidste element er timestamp (bruges ikke).
  // Eksempel i plugin: array_pop($metals_array) før iteration. (xbar plugin)
  if (!Array.isArray(data) || data.length < 2) throw new Error('Uventet metals.live format');

  const trimmed = data.slice(0, -1);
  let silver = null;

  for (const entry of trimmed){
    if (Array.isArray(entry) && entry.length === 2){
      const [name, price] = entry;
      if (String(name).toLowerCase() === 'silver'){
        silver = Number(price);
        break;
      }
    }
    // fallback hvis formatet er {silver: price}
    if (entry && typeof entry === 'object' && !Array.isArray(entry)){
      for (const [k,v] of Object.entries(entry)){
        if (String(k).toLowerCase() === 'silver'){
          silver = Number(v);
          break;
        }
      }
    }
    if (silver != null) break;
  }

  if (!(silver > 0)) throw new Error('Kunne ikke finde “silver” i metals.live svar');
  return silver;
}

// =========================================================
// AFSNIT 03 – HENT USD→DKK
// =========================================================
export async function fetchUsdToDkk(){
  const res = await fetch(FX_USD_DKK, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Frankfurter fejlede: HTTP ${res.status}`);
  const data = await res.json();
  const dkk = data?.rates?.DKK;
  const rate = Number(dkk);
  if (!(rate > 0)) throw new Error('Uventet Frankfurter-format (mangler DKK-rate)');
  return { rate, date: data?.date ?? null };
}

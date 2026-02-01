// =========================================================
// AFSNIT 01 – API ENDPOINTS
// =========================================================

// CORS-kompatibel metals API
const METALS_API =
  "https://api.metals.dev/v1/latest?api_key=demo&symbols=XAG&currency=USD";

const FX_API =
  "https://api.frankfurter.dev/v1/latest?base=USD&symbols=DKK";

// =========================================================
// AFSNIT 02 – HENT SØLVPRIS (USD / troy ounce)
// =========================================================
export async function fetchSilverUsdPerOunce() {
  const res = await fetch(METALS_API, { cache: "no-store" });
  if (!res.ok) throw new Error("Kunne ikke hente sølvpris");

  const data = await res.json();

  if (!data?.rates?.XAG)
    throw new Error("Ugyldigt metals API-svar");

  // XAG = ounce sølv → vi vil have USD/oz
  const usdPerOunce = 1 / Number(data.rates.XAG);

  return usdPerOunce;
}

// =========================================================
// AFSNIT 03 – USD → DKK
// =========================================================
export async function fetchUsdToDkk() {
  const res = await fetch(FX_API, { cache: "no-store" });
  if (!res.ok) throw new Error("Kunne ikke hente valutakurs");

  const data = await res.json();
  const rate = Number(data?.rates?.DKK);

  if (!rate) throw new Error("Ugyldig DKK-kurs");

  return {
    rate,
    date: data.date
  };
}

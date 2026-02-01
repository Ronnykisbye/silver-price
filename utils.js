// =========================================================
// AFSNIT 01 – MATH & FORMAT
// =========================================================

export const TROY_OUNCE_GRAMS = 31.1034768;

export function usdPerOunceToDkkPer100g(usdPerOunce, usdToDkk){
  const usdPerGram = usdPerOunce / TROY_OUNCE_GRAMS;
  const usdPer100g = usdPerGram * 100;
  const dkkPer100g = usdPer100g * usdToDkk;
  return dkkPer100g;
}

export function fmtDkk(amount){
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    maximumFractionDigits: 2
  }).format(amount);
}

export function fmtDateTime(dt){
  return new Intl.DateTimeFormat('da-DK', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(dt);
}

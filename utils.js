// =========================================================
// AFSNIT 01 – BEREGNINGER
// =========================================================
export function usdPerOunceToDkkPer100g(usdPerOunce, usdToDkk){
  // 1 troy ounce = 31.1034768 g
  const usdPerGram = usdPerOunce / 31.1034768;
  const dkkPer100g = usdPerGram * 100 * usdToDkk;
  return dkkPer100g;
}

// =========================================================
// AFSNIT 02 – FORMAT
// =========================================================
export function fmtDkk(n){
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kr.';
}

export function fmtDateTime(d){
  try{
    return new Date(d).toLocaleString('da-DK');
  }catch(_){
    return '—';
  }
}

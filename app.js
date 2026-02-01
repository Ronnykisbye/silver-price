// =========================================================
// AFSNIT 01 – IMPORTS
// =========================================================
import { applyTheme, getStoredTheme, storeTheme } from './colors.js';
import { fetchSilverUsdPerOunce, fetchUsdToDkk } from './api.js';
import { usdPerOunceToDkkPer100g, fmtDkk, fmtDateTime } from './utils.js';

// =========================================================
// AFSNIT 02 – DOM
// =========================================================
const el = {
  btnTheme: document.getElementById('btnTheme'),
  btnRefresh: document.getElementById('btnRefresh'),

  updatedValue: document.getElementById('updatedValue'),
  updatedMeta: document.getElementById('updatedMeta'),
  priceValue: document.getElementById('priceValue'),
  priceMeta: document.getElementById('priceMeta'),

  statusBar: document.getElementById('statusBar'),
  statusLine: document.getElementById('statusLine'),
  infoDrawer: document.getElementById('infoDrawer'),
  techMeta: document.getElementById('techMeta'),

  cardUpdated: document.getElementById('cardUpdated'),
  cardPrice: document.getElementById('cardPrice')
};

// =========================================================
// AFSNIT 03 – STATE
// =========================================================
const state = {
  theme: getStoredTheme(),
  lastUpdatedLocal: null,
  lastSilverUsdPerOunce: null,
  lastUsdDkk: null,
  fxDate: null
};

// =========================================================
// AFSNIT 04 – INIT
// =========================================================
applyTheme(state.theme);
updateThemeButton();
wireEvents();
hydrateFromCache();
softAutoRefreshOnce();

// =========================================================
// AFSNIT 05 – EVENTS
// =========================================================
function wireEvents(){
  el.btnTheme.addEventListener('click', () => {
    state.theme = (state.theme === 'dark') ? 'light' : 'dark';
    storeTheme(state.theme);
    applyTheme(state.theme);
    updateThemeButton();
  });

  el.btnRefresh.addEventListener('click', () => refreshNow(true));

  // Klik på cards kopierer
  el.cardPrice.addEventListener('click', () => copyText(el.priceValue.textContent));
  el.cardUpdated.addEventListener('click', () => copyText(el.updatedValue.textContent));

  // Flyttet “boks”: klik på statusbar åbner/lukker drawer
  el.statusBar.addEventListener('click', () => toggleDrawer());
}

function toggleDrawer(){
  const isOpen = el.infoDrawer.classList.toggle('open');
  el.infoDrawer.setAttribute('aria-hidden', String(!isOpen));
}

function updateThemeButton(){
  const isDark = state.theme === 'dark';
  el.btnTheme.querySelector('.btn-ico').textContent = isDark ? '☾' : '☀';
  el.btnTheme.querySelector('.btn-txt').textContent = isDark ? 'Mørk' : 'Lys';
}

// =========================================================
// AFSNIT 06 – DATAFLOW
// =========================================================
async function refreshNow(userInitiated){
  setStatus(userInitiated ? 'Henter ny pris…' : 'Opdaterer…');
  setBusy(true);

  try{
    const [silverUsdPerOunce, fx] = await Promise.all([
      fetchSilverUsdPerOunce(),
      fetchUsdToDkk()
    ]);

    const dkkPer100g = usdPerOunceToDkkPer100g(silverUsdPerOunce, fx.rate);

    state.lastUpdatedLocal = new Date();
    state.lastSilverUsdPerOunce = silverUsdPerOunce;
    state.lastUsdDkk = fx.rate;
    state.fxDate = fx.date;

    render(dkkPer100g);
    persistCache(dkkPer100g);

    setStatus('Opdateret ✓');
  }catch(err){
    console.error(err);
    setStatus('Kunne ikke hente data. Tjek internet / prøv igen.');
  }finally{
    setBusy(false);
  }
}

function render(dkkPer100g){
  const updated = state.lastUpdatedLocal ? fmtDateTime(state.lastUpdatedLocal) : '—';
  el.updatedValue.textContent = updated;

  const usd = state.lastSilverUsdPerOunce?.toFixed(2);
  const fx = state.lastUsdDkk?.toFixed(4);
  const fxDate = state.fxDate ? ` (ECB-dato: ${state.fxDate})` : '';
  el.techMeta.textContent = `Silver: ${usd ?? '—'} USD/oz · USD→DKK: ${fx ?? '—'}${fxDate}`;

  el.priceValue.textContent = fmtDkk(dkkPer100g);
  el.priceMeta.textContent = 'Pris for 100 g sølv beregnet fra spot (USD/oz) og valutakurs.';
  el.updatedMeta.textContent = 'Tryk på kortet for at kopiere værdien.';
}

// =========================================================
// AFSNIT 07 – CACHE
// =========================================================
const LS_KEY = 'silver_app_cache_v1';

function persistCache(dkkPer100g){
  const payload = {
    lastUpdatedLocalISO: state.lastUpdatedLocal?.toISOString() ?? null,
    silverUsdPerOunce: state.lastSilverUsdPerOunce,
    usdDkk: state.lastUsdDkk,
    fxDate: state.fxDate,
    dkkPer100g
  };
  localStorage.setItem(LS_KEY, JSON.stringify(payload));
}

function hydrateFromCache(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;

    const c = JSON.parse(raw);
    if (!c?.dkkPer100g) return;

    state.lastUpdatedLocal = c.lastUpdatedLocalISO ? new Date(c.lastUpdatedLocalISO) : null;
    state.lastSilverUsdPerOunce = c.silverUsdPerOunce ?? null;
    state.lastUsdDkk = c.usdDkk ?? null;
    state.fxDate = c.fxDate ?? null;

    render(Number(c.dkkPer100g));
    setStatus('Viser senest kendte data (cache).');
  }catch(_){
    // ignore
  }
}

function softAutoRefreshOnce(){
  setTimeout(() => refreshNow(false), 350);
}

// =========================================================
// AFSNIT 08 – UI HELPERS
// =========================================================
function setStatus(txt){ el.statusLine.textContent = txt; }

function setBusy(isBusy){
  el.btnRefresh.disabled = isBusy;
  el.btnRefresh.style.opacity = isBusy ? 0.7 : 1;
}

async function copyText(txt){
  try{
    await navigator.clipboard.writeText(txt);
    setStatus('Kopieret 📋');
    setTimeout(() => setStatus('Klar.'), 900);
  }catch(_){
    // ignore
  }
}

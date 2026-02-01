import { fetchSilverUsdPerOunce, fetchUsdToDkk } from './api.js';

const el = {
  btnTheme: document.getElementById('btnTheme'),
  btnRefresh: document.getElementById('btnRefresh'),
  updatedValue: document.getElementById('updatedValue'),
  priceValue: document.getElementById('priceValue'),
  techMeta: document.getElementById('techMeta'),
  statusLine: document.getElementById('statusLine'),
};

let darkMode = true;

// =======================
// INIT
// =======================
wireEvents();
refreshNow();

// =======================
// EVENTS
// =======================
function wireEvents() {
  el.btnTheme.addEventListener('click', toggleTheme);
  el.btnRefresh.addEventListener('click', refreshNow);
}

// =======================
// CORE
// =======================
async function refreshNow() {
  try {
    el.statusLine.textContent = "Opdaterer…";

    const silver = await fetchSilverUsdPerOunce();
    const fx = await fetchUsdToDkk();

    const priceDKK = (silver / 31.1035) * 100 * fx.rate;

    el.updatedValue.textContent =
      new Date().toLocaleString('da-DK');

    el.priceValue.textContent =
      priceDKK.toLocaleString('da-DK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + " kr.";

    el.techMeta.textContent =
      `Silver: ${silver.toFixed(2)} USD/oz · USD→DKK: ${fx.rate.toFixed(4)} (${fx.date})`;

    el.statusLine.textContent = "Opdateret ✓";

  } catch (err) {
    console.error(err);
    el.statusLine.textContent = "Kunne ikke hente data. Tjek internet.";
  }
}

// =======================
// THEME
// =======================
function toggleTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle('light', !darkMode);
}

import { fetchSilverUsdPerOunce, fetchUsdToDkk } from './api.js';

const el = {
  refresh: document.getElementById('btnRefresh'),
  theme: document.getElementById('btnTheme'),
  updated: document.getElementById('updatedValue'),
  price: document.getElementById('priceValue'),
  status: document.getElementById('statusLine'),
  tech: document.getElementById('techMeta'),
  drawer: document.getElementById('infoDrawer'),
  statusBar: document.getElementById('statusBar')
};

el.statusBar.addEventListener('click', () => {
  el.drawer.classList.toggle('show');
});

el.refresh.addEventListener('click', refresh);

refresh();

async function refresh() {
  try {
    el.status.textContent = "Opdaterer…";

    const silver = await fetchSilverUsdPerOunce();
    const fx = await fetchUsdToDkk();

    const price = (silver / 31.1035) * 100 * fx.rate;

    el.updated.textContent = new Date().toLocaleString('da-DK');
    el.price.textContent =
      price.toLocaleString('da-DK', { minimumFractionDigits: 2 }) + " kr.";

    el.tech.textContent =
      `Silver: ${silver.toFixed(2)} USD · Kurs: ${fx.rate.toFixed(4)}`;

    el.status.textContent = "Opdateret ✓";

  } catch (e) {
    console.error(e);
    el.status.textContent = "Kunne ikke hente data";
  }
}

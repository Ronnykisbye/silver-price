# Sølvpris – 100 g i DKK (GitHub Pages)

## Hvad appen gør
- Henter live **spotpris for sølv** (USD pr. troy ounce) fra `https://api.metals.live/v1/spot`
- Henter **USD → DKK** valutakurs fra **Frankfurter**: `https://api.frankfurter.dev/v1/latest?base=USD&symbols=DKK`
- Beregner og viser **pris for 100 g sølv i danske kroner**
- Viser **seneste opdateringstid** (lokal tid på enheden)
- Har **Opdater**-knap + **LM-mode** (lys/mørk)
- Kan installeres som PWA (ikon + offline shell)

## Filer (hurtigt overblik)
- `index.html` – struktur/markup
- `styles.css` – alt design/3D/neon (kun CSS)
- `colors.js` – tema-farver (lys/mørk)
- `api.js` – alle API-kald (hvis noget ændrer sig i API’er, så ret her)
- `utils.js` – beregninger + formattering
- `app.js` – styring af UI, state, cache, events
- `manifest.json`, `sw.js` – PWA

## Upload til GitHub Pages
1. Opret et repo (fx `silver-pris`)
2. Upload alle filer fra denne mappe (samme niveau)
3. Settings → Pages → Deploy from branch (`main` / root)
4. Åbn din GitHub Pages URL

## Noter
- Frankfurter bygger på referencekurser fra ECB (dvs. ikke “intraday” bankkurs).
- Dette er spot/benchmark-pris (ikke en dansk forhandlerpris med spread).

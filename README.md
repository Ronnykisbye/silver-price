# Sølv – 100 g i DKK (PWA)

En lille neon/3D webapp (GitHub Pages), der viser **aktuel sølv spotpris** som **pris for 100 g sølv i danske kroner** – med tydelige knapper, mørk/lys mode og “app-følelse” (PWA).

## Funktioner
- ✅ Aktuel pris for **100 g sølv i DKK**
- ✅ Viser **seneste opdateringstid**
- ✅ **Opdater-knap** (henter frisk data fra nettet)
- ✅ **Mørk/Lys** (tema gemmes lokalt)
- ✅ Klik på kort = kopier værdi (pris / opdateringstid)
- ✅ PWA: kan installeres på mobil/startskærm
- ✅ Stabil “release”-struktur: automatisk opdatering ved nye versioner (cache/Service Worker)

## Data-kilder
Appen henter data direkte i browseren (CORS):

- **Sølvpris (USD/oz):** Gold API  
  Endpoint: `https://api.gold-api.com/price/XAG`  
  Dokumentation: https://gold-api.com/docs

- **Valutakurs (USD→DKK):** Frankfurter  
  Endpoint: `https://api.frankfurter.dev/v1/latest?base=USD&symbols=DKK`

> Appen beregner 100 g pris ud fra spotpris og USD→DKK-kurs.

## Beregning
- 1 troy ounce = 31,1034768 gram  
- Pris (DKK pr. 100 g) = `(USD/oz ÷ 31,1034768) × 100 × (USD→DKK)`

## Repo-struktur (stabil release)
Filer i roden:

- `index.html` (UI/layout)
- `styles.css` (design)
- `colors.js` (tema-farver)
- `api.js` (API-kald)
- `utils.js` (beregning + formatering)
- `app.js` (app-logik)
- `sw.js` (service worker/cache)
- `manifest.json` (PWA)
- `version.json` ✅ (release-version)
- ikoner: `favicon.ico`, `icon-32.png`, `icon-180.png`, `icon-192.png`, `icon-512.png`

## Release / opdatering (vigtigt)
For at sikre at **mobil + PC altid får ny version**, bruges `version.json`.

Når du laver ændringer og vil udgive en ny version:
1. Opdater `version.json` (fx `1.0.0` → `1.0.1`)
2. Commit + push
3. GitHub Pages deployer
4. Appen vil automatisk registrere ny version og opdatere

## Troubleshooting
### “Jeg ser en gammel version på mobil”
- Sørg for at `version.json` er opdateret
- Åbn appen igen – den bør selv opdatere

### “Kunne ikke hente data”
- Tjek internet
- Prøv igen (Opdater)
- Nogle netværk/AdBlock kan blokere eksterne API-kald

## Kør lokalt
Du kan åbne `index.html` direkte, men nogle browsere begrænser fetch lokalt.
Bedst: kør en simpel lokal server:

- VS Code: “Live Server”
- eller Python:
  `python -m http.server 5500`

Åbn derefter: `http://localhost:5500`

## License
Fri brug til eget projekt.

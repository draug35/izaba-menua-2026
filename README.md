# Izaba Menua 2026

Izabako udalekuko menuak antolatzeko web-aplikazio estatikoa. Egunak, gosariak, bazkariak, askariak eta afariak antolatzeko balio du, lagun kopuruaren arabera osagai-beharrak kalkulatuz.

Ez du backendik, instalaziorik, menpekotasunik edo konpilazio-pausorik behar. GitHub Pagesen argitaratzeko prestatuta dago.

## Zer egin daiteke

- Hasiera eta amaiera datak aukeratu.
- Lagun kopurua aldatu eta kantitateak automatikoki eskalatu.
- Platerak egunen eta zerbitzuen artean arrastatu.
- Mugikorrean platerak mugitu botoien bidez.
- Errezetak sortu, editatu, bikoiztu eta ezabatu.
- Eguneko osagai-beharrak eta plan osoko guztizko beharrak ikusi.
- Egunak eta zerbitzuak kolorez bereizi, egutegia azkar irakurtzeko.
- Alergeno gida bizkorra ikusi: glutena/zeliakoak, fruitu lehorrak, krustazeoak eta esnekiak.
- Plana `localStorage` bidez gorde.
- Plan osoa JSON gisa esportatu eta inportatu.
- Inprimatzeko ikuspegi garbia erabili.

## Erabilera lokalean

Ireki zuzenean `index.html` nabigatzailean.

Fitxategi nagusiak:

- `index.html`: aplikazioaren egitura.
- `styles.css`: diseinua, responsive portaera eta inprimaketa.
- `data.js`: Izabako hasierako plana eta errezeta-liburutegia.
- `app.js`: egoera, kalkuluak, edizioa, arrastatzea eta JSON kudeaketa.
- `.nojekyll`: GitHub Pagesen Jekyll prozesatzea saihesteko.

## Datuen gordetzea

Aldaketak nabigatzailean gordetzen dira `izaba-menua-planner-v1` localStorage gakoarekin.

Beste ordenagailu batera eramateko edo kopia egiteko, erabili:

- `JSON esportatu`
- `JSON inportatu`

## GitHub Pages bidez argitaratzea

1. Igo biltegia GitHubera `izaba-menua-2026` izenarekin.
2. GitHuben, sartu `Settings` atalean.
3. Ireki `Pages`.
4. `Build and deployment` atalean, aukeratu `Deploy from a branch`.
5. Aukeratu `main` adarra.
6. Aukeratu `/root` karpeta.
7. Gorde aldaketak.

Espero den URLa:

https://draug35.github.io/izaba-menua-2026/

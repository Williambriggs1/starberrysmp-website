# StarberrySMP Website

This is the public StarberrySMP Forest Guide hosted with GitHub Pages.

## Asset safety

Do **not** upload original Blockbench projects, Minecraft model JSON files, or original commissioned texture PNGs to this repository.

Only upload flattened preview images that are safe to display publicly.

Recommended structure:

```text
previews/
├── starberry.webp
├── starberry_pie.webp
└── forest_crown.webp
```

Then point a crop, food, or cosmetic entry to the preview image:

```json
"media": {
  "type": "png",
  "src": "previews/starberry.webp",
  "fallback_icon": "🍓"
}
```

The website does not need the original model or texture to display an entry.

## Creator credit

Entries can include the artist/modeler who made them:

```json
"creator": {
  "role": "Modeler",
  "name": "ArtistName",
  "url": ""
}
```

The site automatically displays the credit beneath the entry.

## Editing content

Most content lives in `data/`:

```text
data/
├── server.json
├── crops.json
├── foods.json
├── cosmetics.json
├── skills.json
├── economy.json
├── navigation.json
└── pages.json
```

### Crops
Edit `data/crops.json`.

### Foods
Edit `data/foods.json`.

### Cosmetics
Edit `data/cosmetics.json`.

### Bank / currency
Edit `data/economy.json`.

For example, changing:

```json
"output_amount": 100
```

will automatically update the displayed Diamond bank rate.

## Local testing

Because the site loads JSON files with JavaScript, run it through a small local web server instead of double-clicking `index.html`:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Important

Anything placed in a public GitHub repository can be downloaded by other people. Keep commissioned source assets somewhere private and only put website-safe preview renders in `previews/`.

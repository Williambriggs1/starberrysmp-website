# StarberrySMP — GitHub Free Safe Preview Setup

Use a **public GitHub Pages repo**, but keep commissioned originals in a local
folder that Git never uploads.

```text
private_assets/                <-- NEVER PUBLIC
├── models/
├── textures/
└── preview_manifest.json
        ↓
python tools/render_previews.py
        ↓
previews/                      <-- PUBLIC
└── starberry.webp
```

The public site gets only a flattened WebP preview. It does not get the original
model JSON, UV layout, or source texture PNG.

## Setup

1. Copy `private_assets.example`
2. Rename the copy to `private_assets`
3. Put your real model and texture inside it.
4. Install:

```bash
python -m pip install -r tools/requirements.txt
```

5. Render:

```bash
python tools/render_previews.py
```

6. Before committing:

```bash
git status
```

`private_assets/` should NOT appear in the files being committed.

## Manifest

```json
{
  "entries": [
    {
      "id": "starberry",
      "model": "models/starberry.json",
      "textures": {
        "0": "textures/starberry.png"
      },
      "output": "../previews/starberry.webp",
      "size": 512,
      "yaw": 35,
      "pitch": 25,
      "transparent": true
    }
  ]
}
```

If your model uses `"texture": "#0"`, use texture key `"0"` in the manifest.

## Website JSON

The public crop/food/cosmetic entry references only:

```json
"media": {
  "type": "png",
  "src": "previews/starberry.webp",
  "fallback_icon": "🍓"
}
```

## Important

If a private commissioned asset is ever committed once, deleting it later does
not automatically remove it from Git history. Always check `git status` before
your first push.

Current renderer supports cuboids, face UVs, multiple texture keys, transparent
WebP previews, yaw and pitch. Element rotations/pivots and parent-model
inheritance are not yet supported.

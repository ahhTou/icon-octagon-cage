# Icon Octagon Cage · 图标八角笼

A standalone icon playground with six visual styles: Classic, Gen 0, Flat, GPT Glass, Kimi Glass, and Claude Glass.

Open `index.html` directly, or serve this directory:

```sh
python3 -m http.server 8125 --bind 127.0.0.1
```

Compare icons at 56, 40, 28, and 20 pixels on light and dark backgrounds. GPT and Claude have independent colour and material controls, with settings saved in your browser.

## Editing

- `src/gpt-glass.jsx`: GPT vector geometry and material.
- `kimi-glass-icons.js` and `claude-glass-icons.js`: editable vector generators.
- `icons.js`: comparison grid and flat icons.
- `glass-controls.js` and `claude-glass-controls.js`: colour and material editors.

To regenerate GPT SVGs:

```sh
npm ci
npm run build:gpt
```

The generated browser files are included; no build is needed to view the playground. Glass studies use translucent layers, clipped blur and soft highlights. The visual reference is [Nucleo Glass](https://nucleoapp.com/); original reference assets are not distributed here.

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

## Design principles and webapp integration

This repository is the design source for Secuvy's icons. The six columns compare
alternative treatments of the same subjects; GPT Glass is the family currently used
by `secuvy-ng/webapp/src/shared/icons/GlassGlyphs.js`.

- **Meaning comes from silhouette.** Subjects must remain distinguishable at small
  sizes without relying on colour. Source is a database cylinder, Object a folded
  file, Schema a clipboard of definitions, and Policy a shield with rule bars.
  A definition must not imply an outcome: Policy has no success tick or warning mark.
- **The subject is the icon.** GPT Glass uses a transparent 48×48 viewBox without a
  container or bezel. Volume comes from the coloured body, shade, clipped blurred
  body copy, frosted pane, top-edge highlight, and soft shadow.
- **Glass needs something underneath.** Scan, Unscanned, Datatypes scanned, and
  Tag · class have panes over empty space. Their pane-shaped backing uses the body
  colour at 0.55 opacity beneath the blur. Panes already supported by the body do
  not need this extra layer. Volume's silver upper plates deliberately stay unbacked
  to preserve their separation; their contrast on light backgrounds remains limited.
- **Absence has meaning.** Unlabelled is an empty tag, without a question mark or
  glass pane. It consequently has no pane-derived rim highlight. The question mark
  belongs to Request · unverified. A future generic Tag glyph would need this
  silhouette collision resolved before both are used together.
- **Colour and material are adjustable.** Defaults identify subject groups, while
  shape and surrounding labels carry meaning independently of hue. Pane opacity is
  0.42; the shadow is blue `#2F62E0` at 0.2 opacity with blur 1.2. The React component
  accepts `color`, `size`, `glass`, and `shadow`; the last two scale their respective
  opacity from 0 to 1. Browser controls apply the same scaling to generated SVGs.

Compare both backgrounds and multiple sizes when changing geometry. Different
silhouette extents still produce different optical sizes; the common viewBox alone
is not optical normalization.

The 2026-09-10 reverse sync incorporates the webapp's four tinted backings, empty
Unlabelled tag, and softer blue shadow. All 17 subjects present in that checkout
match its SVG output; this playground additionally retains Schema and Policy.
Classic already matches the webapp in both themes.

For subsequent changes, edit `src/gpt-glass.jsx`, run `npm run build:gpt`, and commit
both source and generated `glass-icons.js`. Port approved geometry and material
changes to the webapp, keeping its subject metadata (`glassSubjects.js`) and theme
store (`iconTheme.js`) separate. The app's store and settings UI are integration
code; the playground retains its standalone editor and explanatory subject metadata.

### Agent

`agent` represents the customer-side collector and execution runtime. Its visual
metaphor deliberately follows the familiar AI-agent robot: a rounded head, antenna,
side ears, and two eyes behind a frosted visor. The visor sits on the coloured head
and uses the existing clipped blur without an extra backing. The default colour is
infrastructure blue `#247FAF`; no status light or success mark is built into the glyph.
It is available in the comparison grid and the GPT Glass editor.

#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const {
  createRequire
} = require("module");
const host = createRequire(path.join(__dirname, "..", "package.json"));
const babel = host("@babel/core");
const React = host("react");
const {
  renderToStaticMarkup
} = host("react-dom/server");
const SRC = path.join(__dirname, "..", "src", "gpt-glass.jsx");
const OUT = path.join(__dirname, "..", "glass-icons.js");
const CSS_STUB = new Proxy({}, {
  get: (_, key) => {
    if (key === "__esModule") return false;
    if (key === "default") return CSS_STUB;
    return typeof key === "string" ? key : undefined;
  }
});
const code = fs.readFileSync(SRC, "utf8");
const {
  code: cjs
} = babel.transformSync(code, {
  filename: SRC,
  babelrc: false,
  configFile: false,
  presets: [[host.resolve("@babel/preset-react"), {
    runtime: "classic"
  }]],
  plugins: [host.resolve("@babel/plugin-transform-modules-commonjs")]
});
const module_ = {
  exports: {}
};
new Function("require", "module", "exports", cjs + "\n;module.exports.__GlassIcon = GlassIcon; module.exports.__ITEMS = ITEMS;")(request => {
  if (request === "react") return React;
  if (request.endsWith(".css")) return CSS_STUB;
  throw new Error("unexpected import: " + request);
}, module_, module_.exports);
const {
  __GlassIcon: GlassIcon,
  __ITEMS: ITEMS
} = module_.exports;
function namespaceIds(markup, kind) {
  const found = markup.match(/id="([^"]+)-body"/);
  if (!found) throw new Error(`no id prefix found in the ${kind} glass icon`);
  const prefix = found[1];
  return markup.split(prefix + "-").join(`glass-${kind}-`);
}
const out = {};
const meta = {};
for (const item of ITEMS) {
  const raw = renderToStaticMarkup(React.createElement(GlassIcon, {
    kind: item.id,
    color: item.color,
    size: 56
  }));
  const key = item.row || item.id;
  out[key] = namespaceIds(raw, item.id);
  meta[key] = {
    name: item.name,
    meaning: item.meaning,
    detail: "",
    color: item.color
  };
}
const prefixes = new Set(Object.values(out).map(m => m.match(/id="([^"]+)-body"/)[1]));
if (prefixes.size !== Object.keys(out).length) {
  throw new Error(`id prefixes collide: ${[...prefixes].join(", ")}`);
}
fs.writeFileSync(OUT, `window.GLASS_ICONS = ${JSON.stringify(out, null, 1)};
window.GLASS_META = ${JSON.stringify(meta, null, 1)};
`);
console.log(`wrote ${OUT}`);
console.log(Object.keys(out).join(", "));

function glyph(palette, art, {
  bare = false
} = {}) {
  const tile = bare ? "" : '<rect x="0" y="0" width="56" height="56" rx="16" fill="var(--eg-tile)"/>';
  return `<svg viewBox="0 0 56 56" class="${palette}" aria-hidden="true" focusable="false">${tile}${art}</svg>`;
}
const SOURCE = `
  <path d="M16 18 V36 A12 5 0 0 0 40 36 V18 Z" fill="var(--eg-2)"/>
  <path d="M16 31 V36 A12 5 0 0 0 40 36 V31 A12 5 0 0 1 16 31 Z" fill="var(--eg-3)"/>
  <ellipse cx="28" cy="18" rx="12" ry="5" fill="var(--eg-1)"/>`;
const SCAN = `
  <circle cx="28" cy="30" r="13" fill="var(--eg-3)"/>
  <circle cx="28" cy="28" r="13" fill="var(--eg-2)"/>
  <circle cx="28" cy="28" r="8" fill="none" stroke="var(--eg-1)" stroke-width="1.4" opacity="0.55"/>
  <g class="sweep"><path d="M28 28 L28 16 A12 12 0 0 1 38.4 22 Z" fill="var(--eg-1)"/></g>
  <circle cx="33.6" cy="22.4" r="2.4" fill="var(--eg-accent)"/>
  <circle cx="28" cy="28" r="2.2" fill="var(--eg-1)"/>`;
const DATATYPE = `
  <rect x="14.5" y="15" width="27" height="26" rx="5.5" fill="var(--eg-3)"/>
  <rect x="14.5" y="15" width="27" height="22" rx="5.5" fill="var(--eg-2)"/>
  <g fill="var(--eg-mark)">
    <rect x="26.4" y="19.5" width="3.2" height="13" rx="1.6"/>
    <rect x="26.4" y="19.5" width="3.2" height="13" rx="1.6" transform="rotate(60 28 26)"/>
    <rect x="26.4" y="19.5" width="3.2" height="13" rx="1.6" transform="rotate(120 28 26)"/>
  </g>`;
const OBJECT_SHEET = "M18.5 15 H31 L40 24 V38.5 A2.5 2.5 0 0 1 37.5 41 H18.5 A2.5 2.5 0 0 1 16 38.5 " + "V17.5 A2.5 2.5 0 0 1 18.5 15 Z";
const OBJECT = `
  <path d="${OBJECT_SHEET}" fill="var(--eg-3)" transform="translate(0 2)"/>
  <path d="${OBJECT_SHEET}" fill="var(--eg-2)"/>
  <path d="M31 15 L40 24 H33.5 A2.5 2.5 0 0 1 31 21.5 Z" fill="var(--eg-1)"/>`;
const ENTITY = (() => {
  const bars = [18, 21.2, 32.8, 36].map(x => `<rect x="${x}" y="21" width="2.2" height="7" rx="1.1" fill="var(--eg-3)"/>`).join("");
  const dots = [25.6, 28, 30.4].map(cx => `<circle cx="${cx}" cy="24.5" r="1.2" fill="var(--eg-2)"/>`).join("");
  return `
  <rect x="14" y="17" width="28" height="24" rx="6.5" fill="var(--eg-3)"/>
  <rect x="14" y="15" width="28" height="24" rx="6.5" fill="var(--eg-1)"/>
  ${bars}${dots}
  <rect x="21" y="31.2" width="14" height="3.6" rx="1.8" fill="var(--eg-2)"/>`;
})();
const FAMILY = [["source", "p-source", SOURCE], ["scan", "p-scan", SCAN], ["dataType", "p-datatype", DATATYPE], ["object", "p-object", OBJECT], ["entity", "p-entity", ENTITY]];
const DT_CANDIDATES = [["A · definition card (in use)", DATATYPE], ["B · the mould", `<path d="M18 21 h20 a5 5 0 0 1 5 5 v8 a5 5 0 0 1 -5 5 h-20 a5 5 0 0 1 -5 -5 v-8 a5 5 0 0 1 5 -5 z
              M34 30 m-4.6 0 a4.6 4.6 0 1 0 9.2 0 a4.6 4.6 0 1 0 -9.2 0 z"
           fill="var(--eg-3)" fill-rule="evenodd" transform="translate(0 2)"/>
     <path d="M18 21 h20 a5 5 0 0 1 5 5 v8 a5 5 0 0 1 -5 5 h-20 a5 5 0 0 1 -5 -5 v-8 a5 5 0 0 1 5 -5 z
              M34 30 m-4.6 0 a4.6 4.6 0 1 0 9.2 0 a4.6 4.6 0 1 0 -9.2 0 z"
           fill="var(--eg-2)" fill-rule="evenodd"/>
     <circle cx="21" cy="30" r="4.6" fill="var(--eg-mark)"/>`], ["C · catalogue entry", `<rect x="13" y="20" width="30" height="20" rx="4.5" fill="var(--eg-3)"/>
     <rect x="13" y="18" width="30" height="20" rx="4.5" fill="var(--eg-2)"/>
     <path d="M17.5 18 H21 v20 h-3.5 a4.5 4.5 0 0 1 -4.5 -4.5 v-11 a4.5 4.5 0 0 1 4.5 -4.5 z" fill="var(--eg-1)"/>
     <rect x="25" y="23.5" width="15" height="3" rx="1.5" fill="var(--eg-mark)"/>
     <rect x="25" y="30" width="9" height="3" rx="1.5" fill="var(--eg-mark)" opacity="0.6"/>`], ["D · one kind among kinds", `<circle cx="18" cy="28" r="5" fill="var(--eg-1)"/>
     <rect x="22.5" y="22.5" width="11" height="11" rx="3.2" fill="var(--eg-2)"/>
     <path d="M38.5 22.6 L44 33 a1.6 1.6 0 0 1 -1.4 2.4 h-8.2 A1.6 1.6 0 0 1 33 33 Z" fill="var(--eg-1)"/>`]];
const NEW_FIVE = new Set(["source", "scan", "dataType", "object", "entity"]);
const COLUMNS = [{
  key: "main",
  label: "Classic",
  note: "Gradient and line icon study",
  cell: (name, theme) => window.MAIN_ICONS?.[theme]?.[name] || ""
}, {
  key: "gen0",
  label: "Gen 0",
  note: "Gradient and line art",
  cell: (name, theme) => window.OLD_ICONS ? window.OLD_ICONS[theme][name] || "" : ""
}, {
  key: "flat",
  label: "Gen 1 · flat + volume",
  note: "Solid planes and tonal palettes",
  cell: name => {
    const hit = FAMILY.find(([n]) => n === name);
    return hit ? glyph(hit[1], hit[2]) : "";
  }
}, {
  key: "glass",
  label: "GPT-Glass",
  note: "中性磨砂玻璃 · 模糊透色与顶部柔光 · 可调配色与材质",
  cell: name => window.GlassStudio.cell(name)
}, {
  key: "kimi-glass",
  label: "Kimi-Glass",
  note: "中性磨砂玻璃 · 几何形状与柔和高光",
  cell: name => window.KimiGlass ? window.KimiGlass.cell(name) : ""
}, {
  key: "claude-glass",
  label: "Claude-Glass",
  note: "磨砂玻璃叠层 · 可调配色与材质",
  cell: name => window.ClaudeGlass ? window.ClaudeGlass.cell(name) : ""
}];
let currentTheme = "light";
function allRows() {
  return (window.OLD_ICON_NAMES || []).concat(window.MAIN_EXTRA_ROWS || []);
}
function orderRows(names) {
  const filled = name => COLUMNS.reduce((n, c) => n + (c.cell(name, currentTheme) ? 1 : 0), 0);
  const onMain = name => window.MAIN_ICONS && window.MAIN_ICONS[currentTheme][name] ? 1 : 0;
  return names.map((name, i) => ({
    name,
    i,
    rank: onMain(name) * 1000 + filled(name)
  })).sort((a, b) => b.rank - a.rank || a.i - b.i).map(r => r.name);
}
function renderGrid() {
  const names = orderRows(allRows());
  const head = "<thead><tr><th class='rowhead'>construct</th>" + COLUMNS.map(c => `<th><span>${c.label}</span><em>${c.note}</em></th>`).join("") + "</tr></thead>";
  const body = names.map(name => {
    const cells = COLUMNS.map(c => {
      const markup = c.cell(name, currentTheme);
      return `<td class="${markup ? "" : "empty"}">${markup || "<i>—</i>"}</td>`;
    }).join("");
    const isNew = NEW_FIVE.has(name);
    const isExtra = (window.MAIN_EXTRA_ROWS || []).indexOf(name) !== -1;
    const cls = [isNew ? "covered" : "", isExtra ? "notConstruct" : ""].filter(Boolean).join(" ");
    return `<tr class="${cls}"><th class="rowhead">${name}</th>${cells}</tr>`;
  }).join("");
  document.getElementById("grid").innerHTML = `<table>${head}<tbody>${body}</tbody></table>`;
  document.getElementById("coverage").textContent = `${names.length} icon subjects · ${COLUMNS.length} visual styles`;
}
function renderCandidates() {
  document.getElementById("candidates").innerHTML = DT_CANDIDATES.map(([n, art]) => `<div class="cell">${glyph("p-datatype", art)}<span class="name">${n}</span></div>`).join("");
}
function renderRamps() {
  document.getElementById("ramps").innerHTML = [["source · scan (azure)", "p-source"], ["dataType (amber)", "p-datatype"], ["object · entity (teal)", "p-object"]].map(([label, cls]) => `
      <div class="stack ${cls}">
        <b>${label}</b>
        <div class="swatches">
          <i style="background:var(--eg-tile)"></i>
          <i style="background:var(--eg-1)"></i>
          <i style="background:var(--eg-2)"></i>
          <i style="background:var(--eg-3)"></i>
          <i style="background:var(--eg-ink)"></i>
          <i style="background:var(--eg-accent)"></i>
        </div>
      </div>`).join("");
}
function setTheme(mode) {
  currentTheme = mode;
  document.documentElement.dataset.theme = mode;
  document.querySelectorAll("[data-theme-btn]").forEach(b => {
    b.setAttribute("aria-pressed", String(b.dataset.themeBtn === mode));
  });
  renderGrid();
}
function setSize(px) {
  document.documentElement.style.setProperty("--size", px + "px");
  document.querySelectorAll("[data-size-btn]").forEach(b => {
    b.setAttribute("aria-pressed", String(b.dataset.sizeBtn === px));
  });
}
document.addEventListener("DOMContentLoaded", () => {
  renderCandidates();
  renderRamps();
  setSize("56");
  setTheme("light");
  document.querySelectorAll("[data-theme-btn]").forEach(b => b.addEventListener("click", () => setTheme(b.dataset.themeBtn)));
  document.querySelectorAll("[data-size-btn]").forEach(b => b.addEventListener("click", () => setSize(b.dataset.sizeBtn)));
});

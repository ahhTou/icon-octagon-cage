(() => {
  const KEY = "icon-octagon-cage-glass-studio-v1";
  const meta = window.GLASS_META || {};
  const names = Object.keys(meta);
  const validColor = value => /^#[0-9a-f]{6}$/i.test(value);
  const defaults = () => ({
    colors: {},
    opacity: 100,
    shadow: 100,
    selected: names[0]
  });
  let state = defaults();
  let serial = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && typeof saved === "object") {
      names.forEach(name => {
        if (validColor(saved.colors?.[name])) state.colors[name] = saved.colors[name];
      });
      for (const key of ["opacity", "shadow"]) {
        if (Number.isFinite(saved[key]) && saved[key] >= 0 && saved[key] <= 100) state[key] = saved[key];
      }
      if (names.includes(saved.selected)) state.selected = saved.selected;
    }
  } catch {}
  const color = name => state.colors[name] || meta[name].color;
  const escape = value => value.replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
  function icon(name) {
    const source = window.GLASS_ICONS[name];
    if (!source) return "";
    const prefix = source.match(/id="([^"]+)-body"/)[1];
    const unique = `studio-${++serial}`;
    let markup = source.split(prefix + "-").join(unique + "-");
    markup = markup.replace(/(<linearGradient\b[^>]*id="[^"]+-body"[^>]*>)([\s\S]*?)(<\/linearGradient>)/, (_, a, stops, b) => a + stops.replace(/stop-color="[^"]*"/g, `stop-color="${color(name)}"`) + b);
    markup = markup.replace(/(<linearGradient\b[^>]*id="[^"]+-glass"[^>]*>)([\s\S]*?)(<\/linearGradient>)/, (_, a, stops, b) => a + stops.replace(/stop-opacity="([^"]+)"/g, (_, opacity) => `stop-opacity="${Number(opacity) * state.opacity / 100}"`) + b);
    markup = markup.replace(/flood-opacity="([^"]+)"/g, (_, opacity) => `flood-opacity="${Number(opacity) * state.shadow / 100}"`);
    return markup;
  }
  function cell(name) {
    if (!meta[name]) return "";
    return `<div class="glass-cell" data-glass-name="${escape(name)}"><div class="glass-art">${icon(name)}</div><button class="glass-edit" type="button" data-edit-glass="${escape(name)}" aria-label="调整 ${escape(meta[name].name)}" title="${escape(meta[name].meaning)}"><span style="background:${color(name)}"></span>调整</button></div>`;
  }
  function save() {
    const status = document.getElementById("glass-status");
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      status.textContent = "已保存到当前浏览器";
    } catch {
      status.textContent = "已应用；当前浏览器无法保存，刷新后会重置";
    }
  }
  function refresh() {
    document.querySelectorAll(".glass-cell").forEach(node => {
      const name = node.dataset.glassName;
      node.querySelector(".glass-art").innerHTML = icon(name);
      node.querySelector(".glass-edit span").style.background = color(name);
    });
    document.getElementById("glass-preview").innerHTML = [64, 32, 20].map(size => `<div>${icon(state.selected).replace(/width="56" height="56"/, `width="${size}" height="${size}"`)}<small>${size}px</small></div>`).join("");
    document.getElementById("glass-meaning").textContent = meta[state.selected].detail;
    document.getElementById("glass-picker").value = color(state.selected);
    const hex = document.getElementById("glass-hex");
    hex.value = color(state.selected).toUpperCase();
    hex.setCustomValidity("");
    hex.removeAttribute("aria-invalid");
    document.getElementById("glass-selection").value = state.selected;
    for (const key of ["opacity", "shadow"]) {
      document.getElementById(`glass-${key}`).value = state[key];
      document.getElementById(`glass-${key}-value`).textContent = `${state[key]}%`;
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("glass-selection");
    names.forEach(name => select.add(new Option(meta[name].name, name)));
    select.addEventListener("change", () => {
      state.selected = select.value;
      refresh();
      save();
    });
    document.getElementById("glass-picker").addEventListener("input", event => {
      state.colors[state.selected] = event.target.value;
      refresh();
      save();
    });
    const hex = document.getElementById("glass-hex");
    hex.addEventListener("input", () => {
      const value = hex.value.trim();
      const valid = validColor(value);
      hex.setCustomValidity(valid ? "" : "请输入六位 HEX 颜色，例如 #2785D8");
      hex.setAttribute("aria-invalid", String(!valid));
      if (valid) {
        state.colors[state.selected] = value;
        refresh();
        save();
      }
    });
    document.getElementById("glass-all").addEventListener("click", () => {
      const value = color(state.selected);
      names.forEach(name => {
        state.colors[name] = value;
      });
      refresh();
      save();
    });
    document.getElementById("glass-gray").addEventListener("click", () => {
      names.forEach(name => {
        state.colors[name] = "#575757";
      });
      refresh();
      save();
    });
    document.getElementById("glass-reset-one").addEventListener("click", () => {
      delete state.colors[state.selected];
      refresh();
      save();
    });
    document.getElementById("glass-reset").addEventListener("click", () => {
      const selected = state.selected;
      state = {
        ...defaults(),
        selected
      };
      refresh();
      save();
    });
    for (const key of ["opacity", "shadow"]) {
      document.getElementById(`glass-${key}`).addEventListener("input", event => {
        state[key] = Number(event.target.value);
        refresh();
        save();
      });
    }
    document.addEventListener("click", event => {
      const edit = event.target.closest("[data-edit-glass]");
      if (!edit) return;
      state.selected = edit.dataset.editGlass;
      refresh();
      save();
      document.getElementById("glass-controls").scrollIntoView({
        block: "start"
      });
      hex.focus({
        preventScroll: true
      });
    });
    refresh();
  });
  window.GlassStudio = {
    icon,
    cell
  };
})();

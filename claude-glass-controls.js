(() => {
  const KEY = "icon-octagon-cage-claude-glass-v1";
  const meta = window.CLAUDE_GLASS || {};
  const geom = window.CLAUDE_GLASS_GEOM || {};
  const build = window.CLAUDE_GLASS_BUILD;
  const MATERIAL = window.CLAUDE_GLASS_MATERIAL || {
    blur: 4.5,
    glass: 0.6,
    light: 1
  };
  const names = Object.keys(meta);
  const valid = v => /^#[0-9a-f]{6}$/i.test(v);
  const defaults = () => ({
    colors: {},
    glass: 100,
    blur: 100,
    light: 100,
    selected: names[0]
  });
  let state = defaults();
  let serial = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && typeof saved === "object") {
      names.forEach(name => {
        if (valid(saved.colors?.[name])) state.colors[name] = saved.colors[name];
      });
      for (const k of ["glass", "blur", "light"]) {
        if (Number.isFinite(saved[k]) && saved[k] >= 0 && saved[k] <= 100) state[k] = saved[k];
      }
      if (names.includes(saved.selected)) state.selected = saved.selected;
    }
  } catch {}
  const color = name => state.colors[name] || meta[name].color;
  const esc = v => String(v).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
  function icon(name, size) {
    if (!geom[name]) return "";
    const markup = build(geom[name], {
      p: "cgs" + ++serial,
      color: color(name),
      glass: MATERIAL.glass * state.glass / 100,
      blur: MATERIAL.blur * state.blur / 100,
      light: state.light / 100
    });
    return size ? markup.replace('width="56" height="56"', `width="${size}" height="${size}"`) : markup;
  }
  function cell(name) {
    if (!meta[name]) return "";
    return `<div class="cg-cell" data-cg-name="${esc(name)}"><div class="cg-art">${icon(name)}</div>` + `<button class="cg-edit" type="button" data-edit-cg="${esc(name)}" ` + `aria-label="调整 ${esc(meta[name].name)}" title="${esc(meta[name].meaning)}">` + `<span style="background:${color(name)}"></span>调整</button></div>`;
  }
  function save() {
    const status = document.getElementById("cg-status");
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      if (status) status.textContent = "已保存到当前浏览器";
    } catch {
      if (status) status.textContent = "已应用；当前浏览器无法保存，刷新后会重置";
    }
  }
  function refresh() {
    document.querySelectorAll(".cg-cell").forEach(node => {
      const name = node.dataset.cgName;
      node.querySelector(".cg-art").innerHTML = icon(name);
      node.querySelector(".cg-edit span").style.background = color(name);
    });
    const preview = document.getElementById("cg-preview");
    if (!preview) return;
    preview.innerHTML = [64, 32, 20].map(size => `<div>${icon(state.selected, size)}<small>${size}px</small></div>`).join("");
    document.getElementById("cg-meaning").innerHTML = `<b>${esc(meta[state.selected].meaning)}</b> — ${esc(meta[state.selected].detail)}`;
    document.getElementById("cg-picker").value = color(state.selected);
    const hex = document.getElementById("cg-hex");
    hex.value = color(state.selected).toUpperCase();
    hex.setCustomValidity("");
    hex.removeAttribute("aria-invalid");
    document.getElementById("cg-selection").value = state.selected;
    for (const k of ["glass", "blur", "light"]) {
      document.getElementById("cg-" + k).value = state[k];
      document.getElementById(`cg-${k}-value`).textContent = state[k] + "%";
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("cg-selection");
    if (!select) return;
    names.forEach(name => select.add(new Option(meta[name].name, name)));
    select.addEventListener("change", () => {
      state.selected = select.value;
      refresh();
      save();
    });
    document.getElementById("cg-picker").addEventListener("input", e => {
      state.colors[state.selected] = e.target.value;
      refresh();
      save();
    });
    const hex = document.getElementById("cg-hex");
    hex.addEventListener("input", () => {
      const v = hex.value.trim();
      const ok = valid(v);
      hex.setCustomValidity(ok ? "" : "请输入六位 HEX 颜色，例如 #10A184");
      hex.setAttribute("aria-invalid", String(!ok));
      if (ok) {
        state.colors[state.selected] = v;
        refresh();
        save();
      }
    });
    document.getElementById("cg-all").addEventListener("click", () => {
      const v = color(state.selected);
      names.forEach(name => {
        state.colors[name] = v;
      });
      refresh();
      save();
    });
    document.getElementById("cg-gray").addEventListener("click", () => {
      names.forEach(name => {
        state.colors[name] = "#575757";
      });
      refresh();
      save();
    });
    document.getElementById("cg-reset-one").addEventListener("click", () => {
      delete state.colors[state.selected];
      refresh();
      save();
    });
    document.getElementById("cg-reset").addEventListener("click", () => {
      const selected = state.selected;
      state = Object.assign(defaults(), {
        selected
      });
      refresh();
      save();
    });
    for (const k of ["glass", "blur", "light"]) {
      document.getElementById("cg-" + k).addEventListener("input", e => {
        state[k] = Number(e.target.value);
        refresh();
        save();
      });
    }
    document.addEventListener("click", e => {
      const edit = e.target.closest("[data-edit-cg]");
      if (!edit) return;
      state.selected = edit.dataset.editCg;
      refresh();
      save();
      document.getElementById("cg-controls").scrollIntoView({
        block: "start"
      });
      hex.focus({
        preventScroll: true
      });
    });
    refresh();
  });
  window.ClaudeGlass = {
    icon,
    cell
  };
})();

(() => {
  const n = v => Math.round(v * 100) / 100;
  function rr(x, y, w, h, r) {
    const k = Math.min(r, w / 2, h / 2);
    return `M${n(x + k)},${n(y)} H${n(x + w - k)} A${n(k)},${n(k)} 0 0 1 ${n(x + w)},${n(y + k)} ` + `V${n(y + h - k)} A${n(k)},${n(k)} 0 0 1 ${n(x + w - k)},${n(y + h)} ` + `H${n(x + k)} A${n(k)},${n(k)} 0 0 1 ${n(x)},${n(y + h - k)} ` + `V${n(y + k)} A${n(k)},${n(k)} 0 0 1 ${n(x + k)},${n(y)} Z`;
  }
  function ci(cx, cy, r, ccw) {
    const s = ccw ? 0 : 1;
    return `M${n(cx - r)},${n(cy)} A${n(r)},${n(r)} 0 1 ${s} ${n(cx + r)},${n(cy)} ` + `A${n(r)},${n(r)} 0 1 ${s} ${n(cx - r)},${n(cy)} Z`;
  }
  const dot = (cx, cy, r) => `<path d="${ci(cx, cy, r)}" fill="%INK%"/>`;
  function rgb(hex) {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map(s => s + s).join("");
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  }
  const hex2 = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  function mix(a, b, t) {
    const A = rgb(a);
    const B = rgb(b);
    return "#" + A.map((v, i) => hex2(v + (B[i] - v) * t)).join("");
  }
  const stops = base => [mix(base, "#FFFFFF", 0.22), mix(base, "#000000", 0.4)];
  const ink = base => mix(base, "#000000", 0.62);
  const MATERIAL = {
    blur: 4.5,
    glass: 0.6,
    light: 1
  };
  function build(icon, opts) {
    const o = Object.assign({}, MATERIAL, opts || {});
    const p = o.p;
    const [lit, deep] = stops(o.color || icon.color);
    const solid = icon.solid;
    const glass = icon.glass;
    const rule = icon.evenOdd ? ' fill-rule="evenodd" clip-rule="evenodd"' : "";
    const [gy1, gy2] = icon.glassY;
    const hiY2 = gy1 + (gy2 - gy1) * 0.55;
    const alpha = v => Math.round(v * o.glass * 1000) / 1000;
    const defs = `<linearGradient id="${p}-sg" gradientUnits="userSpaceOnUse" x1="28" y1="${icon.solidY[0]}" x2="28" y2="${icon.solidY[1]}">` + `<stop stop-color="${lit}"/><stop offset="1" stop-color="${deep}"/></linearGradient>` + `<linearGradient id="${p}-gg" gradientUnits="userSpaceOnUse" x1="28" y1="${gy1}" x2="28" y2="${gy2}">` + `<stop stop-color="#E3E3E5" stop-opacity="${alpha(1)}"/>` + `<stop offset="1" stop-color="#BBBBC0" stop-opacity="${alpha(0.86)}"/></linearGradient>` + `<linearGradient id="${p}-hg" gradientUnits="userSpaceOnUse" x1="28" y1="${gy1}" x2="28" y2="${n(hiY2)}">` + `<stop stop-color="#FFFFFF" stop-opacity="${o.light}"/>` + `<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>` + `<filter id="${p}-bf" x="-100%" y="-100%" width="400%" height="400%" color-interpolation-filters="sRGB">` + `<feGaussianBlur stdDeviation="${o.blur}" edgeMode="none"/></filter>` + `<mask id="${p}-mk" maskUnits="userSpaceOnUse" x="0" y="0" width="56" height="56">` + `<rect width="56" height="56" fill="#FFFFFF"/><path d="${glass}" fill="#000000"${rule}/></mask>` + `<clipPath id="${p}-cp"><path d="${glass}"${rule}/></clipPath>`;
    const accents = (icon.accents || "").split("%SOLID%").join(`url(#${p}-sg)`).split("%INK%").join(ink(o.color || icon.color));
    return `<svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" focusable="false"><defs>${defs}</defs>` + `<g fill="none" class="nc-icon-wrapper">` + `<g data-glass="origin" mask="url(#${p}-mk)"><path d="${solid}" fill="url(#${p}-sg)"${icon.solidEvenOdd ? ' fill-rule="evenodd"' : ""}/></g>` + `<g data-glass="clone" clip-path="url(#${p}-cp)"><path d="${solid}" fill="url(#${p}-sg)" filter="url(#${p}-bf)"${icon.solidEvenOdd ? ' fill-rule="evenodd"' : ""}/></g>` + `<path data-glass="blur" d="${glass}" fill="url(#${p}-gg)"${rule}/>` + `<g clip-path="url(#${p}-cp)"><path d="${glass}" fill="none" stroke="url(#${p}-hg)" stroke-width="4"${rule}/></g>` + accents + `</g></svg>`;
  }
  const AZURE = "#0B85C8";
  const AMBER = "#E08A1E";
  const TEAL = "#10A184";
  const ROSE = "#C0466F";
  const SHEET = (x, y, w, h) => rr(x, y, w, h, 4);
  const TAG = "M31,10 H43 A4,4 0 0 1 47,14 V26 A4,4 0 0 1 45.83,28.83 L29.83,44.83 " + "A4,4 0 0 1 24.17,44.83 L11.17,31.83 A4,4 0 0 1 11.17,26.17 L27.17,10.17 " + "A4,4 0 0 1 30,9 Z" + ci(38.6, 18.4, 2.9, true);
  const PAGE = rr(11, 9, 26, 34, 4.5);
  const GEOM = {
    source: {
      color: AZURE,
      solidY: [13, 46],
      glassY: [8.5, 19.5],
      solid: "M13,15 A15,6 0 0 1 43,15 V41 A15,6 0 0 1 13,41 Z",
      glass: "M13,15 A15,6 0 0 1 43,15 A15,6 0 0 1 13,15 Z"
    },
    scan: {
      color: AZURE,
      solidY: [33, 48],
      glassY: [9, 41],
      solid: rr(8, 35, 40, 11, 4),
      glass: "M26.6,9.7 A2.8,2.8 0 0 1 29.4,9.7 L42.6,36.7 A2.6,2.6 0 0 1 40.3,40.6 " + "H15.7 A2.6,2.6 0 0 1 13.4,36.7 Z",
      accents: '<path d="M33.5,16 C34.4,19.3 35.9,20.8 39.2,21.7 C35.9,22.6 34.4,24.1 33.5,27.4 ' + 'C32.6,24.1 31.1,22.6 27.8,21.7 C31.1,20.8 32.6,19.3 33.5,16 Z" fill="%SOLID%"/>'
    },
    dataType: {
      color: AMBER,
      solidY: [11, 47],
      glassY: [23, 38],
      solid: rr(13, 11, 30, 36, 5) + rr(41, 19, 6, 10, 2.4),
      glass: rr(9, 23, 38, 15, 5),
      accents: '<g fill="%INK%" transform="translate(28 30.5)">' + `<path d="${rr(-1.4, -6, 2.8, 12, 1.4)}"/>` + `<path d="${rr(-1.4, -6, 2.8, 12, 1.4)}" transform="rotate(60)"/>` + `<path d="${rr(-1.4, -6, 2.8, 12, 1.4)}" transform="rotate(120)"/></g>`
    },
    object: {
      color: TEAL,
      solidY: [10, 47],
      glassY: [10, 41],
      solid: "M17,10 H32 L43,21 V43 A3.5,3.5 0 0 1 39.5,46.5 H17 A3.5,3.5 0 0 1 13.5,43 " + "V13.5 A3.5,3.5 0 0 1 17,10 Z",
      glass: rr(9, 26, 38, 15, 5) + "M32,10 L43,21 H35.5 A3.5,3.5 0 0 1 32,17.5 Z"
    },
    entity: {
      color: TEAL,
      solidY: [11, 45],
      glassY: [22.5, 33.5],
      solid: ci(28, 28, 17),
      glass: rr(12, 22.5, 32, 11, 5.5),
      accents: dot(23.4, 28, 1.9) + dot(28, 28, 1.9) + dot(32.6, 28, 1.9)
    },
    "tag.regulation": {
      color: TEAL,
      solidY: [9, 46],
      glassY: [23, 43],
      solidEvenOdd: true,
      solid: TAG,
      glass: ci(25, 33, 10),
      accents: `<path d="${rr(17.2, 29.4, 15.6, 2.4, 1.2)}" fill="%INK%"/>` + '<path d="M25,31.8 L30.4,36.8 H19.6 Z" fill="%INK%"/>'
    },
    "tag.class": {
      color: TEAL,
      solidY: [9, 46],
      glassY: [23, 43],
      solidEvenOdd: true,
      solid: TAG,
      glass: ci(25, 33, 10),
      accents: `<path d="${rr(20.6, 32.2, 8.8, 7.4, 2)}" fill="%INK%"/>` + '<path d="M22,32.2 V30 A3,3 0 0 1 28,30 V32.2 H26.2 V30 ' + 'A1.2,1.2 0 0 0 23.8,30 V32.2 Z" fill="%INK%"/>'
    },
    "state · unlabelled": {
      color: TEAL,
      solidY: [10, 42],
      glassY: [20, 43],
      evenOdd: true,
      solid: SHEET(7, 10, 25, 31),
      glass: "M39,20 H43.5 A3.5,3.5 0 0 1 47,23.5 V28 A3.5,3.5 0 0 1 45.97,30.47 L34.47,41.97 " + "A3.5,3.5 0 0 1 29.53,41.97 L25.03,37.47 A3.5,3.5 0 0 1 25.03,32.53 L36.53,21.03 " + "A3.5,3.5 0 0 1 39,20 Z" + ci(41.8, 25.2, 2, true)
    },
    "state · unscanned": {
      color: AZURE,
      solidY: [33, 48],
      glassY: [9, 31],
      solid: rr(9, 34, 38, 13, 4),
      glass: "M26.6,9.7 A2.8,2.8 0 0 1 29.4,9.7 L39.9,29.4 A2.6,2.6 0 0 1 37.6,31 " + "H18.4 A2.6,2.6 0 0 1 16.1,29.4 Z",
      accents: `<path d="${ci(32.5, 20.5, 4.2) + ci(32.5, 20.5, 2.2, true)}" fill="%SOLID%" fill-rule="evenodd"/>`
    },
    "metric · datatypes scanned": {
      color: AMBER,
      solidY: [9, 47],
      glassY: [27, 41],
      solid: rr(21, 9, 24, 28, 4.5) + rr(11, 18, 26, 29, 4.5),
      glass: rr(7, 27, 34, 14, 4.5),
      accents: '<path d="M16.2,34 L20.2,38 L29,29.2" fill="none" stroke="%INK%" ' + 'stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    "metric · volume": {
      color: TEAL,
      solidY: [12, 44],
      glassY: [8, 48],
      solid: rr(9, 13, 30, 9, 3.5) + rr(9, 23, 30, 9, 3.5) + rr(9, 33, 30, 9, 3.5),
      glass: rr(29, 9, 18, 38, 6)
    },
    "metric · density": {
      color: TEAL,
      solidY: [10, 46],
      glassY: [22, 38],
      solid: SHEET(13, 10, 30, 36),
      glass: rr(9, 22, 38, 16, 5),
      accents: dot(23, 27.2, 2.2) + dot(33, 27.2, 2.2) + dot(23, 33.4, 2.2) + dot(33, 33.4, 2.2)
    },
    "state · request active": {
      color: ROSE,
      solidY: [9, 43],
      glassY: [26, 46],
      evenOdd: true,
      solid: PAGE,
      glass: ci(37, 36, 10) + ci(37, 36, 5.4, true),
      accents: `<path d="${ci(37, 26, 2.7)}" fill="%SOLID%"/>`
    },
    "state · request complete": {
      color: ROSE,
      solidY: [9, 43],
      glassY: [26, 46],
      solid: PAGE,
      glass: ci(37, 36, 10),
      accents: '<path d="M31.8,36.2 L35.6,40 L42.4,32.4" fill="none" stroke="%INK%" ' + 'stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    "state · request unverified": {
      color: ROSE,
      solidY: [9, 43],
      glassY: [25, 46],
      solid: PAGE,
      glass: "M37,25.2 L46,28.6 V35.4 C46,40.4 42.4,43.8 37,45.6 C31.6,43.8 28,40.4 28,35.4 " + "V28.6 Z"
    },
    "state · request overdue": {
      color: ROSE,
      solidY: [9, 43],
      glassY: [26, 46],
      solid: PAGE,
      glass: ci(37, 36, 10),
      accents: '<path d="M37,29.6 V36 H42.2" fill="none" stroke="%INK%" stroke-width="3.2" ' + 'stroke-linecap="round" stroke-linejoin="round"/>'
    },
    "state · request unassigned": {
      color: ROSE,
      solidY: [9, 43],
      glassY: [25, 46],
      solid: PAGE,
      glass: ci(37, 30, 5) + "M27.4,46 A9.6,7.6 0 0 1 46.6,46 Z"
    }
  };
  const META = {
    source: {
      name: "Source",
      meaning: "数据源连接",
      detail: ""
    },
    scan: {
      name: "Scan",
      meaning: "一次流式分类执行",
      detail: ""
    },
    dataType: {
      name: "Data type",
      meaning: "一类可识别数据的定义",
      detail: ""
    },
    object: {
      name: "Object",
      meaning: "一个被扫描的载体",
      detail: ""
    },
    entity: {
      name: "Entity",
      meaning: "被识别出的一个具体值",
      detail: ""
    },
    "tag.regulation": {
      name: "Tag · regulation",
      meaning: "法规适用范围",
      detail: ""
    },
    "tag.class": {
      name: "Tag · class",
      meaning: "数据的敏感级别",
      detail: ""
    },
    "state · unlabelled": {
      name: "State · unlabelled",
      meaning: "尚未打任何标签的对象",
      detail: ""
    },
    "state · unscanned": {
      name: "State · unscanned",
      meaning: "尚未被任何扫描观察过",
      detail: ""
    },
    "metric · datatypes scanned": {
      name: "Metric · datatypes scanned",
      meaning: "扫到了多少种数据类型",
      detail: ""
    },
    "metric · volume": {
      name: "Metric · volume",
      meaning: "已扫描的数据总量",
      detail: ""
    },
    "metric · density": {
      name: "Metric · density",
      meaning: "每个对象里的敏感值含量",
      detail: ""
    },
    "state · request active": {
      name: "State · request active",
      meaning: "请求处理中",
      detail: ""
    },
    "state · request complete": {
      name: "State · request complete",
      meaning: "请求已完成",
      detail: ""
    },
    "state · request unverified": {
      name: "State · request unverified",
      meaning: "请求方身份尚待确认",
      detail: ""
    },
    "state · request overdue": {
      name: "State · request overdue",
      meaning: "请求已逾期",
      detail: ""
    },
    "state · request unassigned": {
      name: "State · request unassigned",
      meaning: "请求尚待指派负责人",
      detail: ""
    }
  };
  const NAMES = Object.keys(GEOM);
  const ICONS = {};
  NAMES.forEach(key => {
    ICONS[key] = Object.assign({}, META[key], {
      color: GEOM[key].color,
      svg: build(GEOM[key], {
        p: "cg-" + key.replace(/[^a-z0-9]+/gi, "-")
      })
    });
  });
  window.CLAUDE_GLASS = ICONS;
  window.CLAUDE_GLASS_GEOM = GEOM;
  window.CLAUDE_GLASS_BUILD = build;
  window.CLAUDE_GLASS_MATERIAL = MATERIAL;
})();

(() => {
  function hx(c) {
    c = c.replace('#', '');
    if (c.length === 3) c = c.split('').map(s => s + s).join('');
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  }
  function toHex(n) {
    return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  }
  function mix(a, b, t) {
    var A = hx(a),
      B = hx(b);
    return '#' + A.map((v, i) => toHex(v + (B[i] - v) * t)).join('');
  }
  function stops(base) {
    return [mix(base, '#FFFFFF', 0.26), mix(base, '#000000', 0.42)];
  }
  function build(o) {
    var p = o.p,
      st = stops(o.color);
    var defs = '<linearGradient id="' + p + '-sg" gradientUnits="userSpaceOnUse" x1="28" y1="' + o.solidY1 + '" x2="28" y2="' + o.solidY2 + '">' + '<stop offset="0" stop-color="' + st[0] + '"/><stop offset="1" stop-color="' + st[1] + '"/></linearGradient>' + '<linearGradient id="' + p + '-gg" gradientUnits="userSpaceOnUse" x1="28" y1="' + o.glassY1 + '" x2="28" y2="' + o.glassY2 + '">' + '<stop offset="0" stop-color="#E3E3E5" stop-opacity="0.6"/>' + '<stop offset="1" stop-color="#BBBBC0" stop-opacity="0.6"/></linearGradient>' + '<linearGradient id="' + p + '-hg" gradientUnits="userSpaceOnUse" x1="28" y1="' + o.hiY1 + '" x2="28" y2="' + o.hiY2 + '">' + '<stop offset="0" stop-color="#FFFFFF"/>' + '<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>' + '<filter id="' + p + '-bf" x="-100%" y="-100%" width="400%" height="400%">' + '<feGaussianBlur stdDeviation="4.5" edgeMode="none"/></filter>' + '<mask id="' + p + '-mk" maskUnits="userSpaceOnUse" x="0" y="0" width="56" height="56">' + '<rect width="56" height="56" fill="#FFFFFF"/><path d="' + o.glass + '" fill="#000000"/></mask>' + '<clipPath id="' + p + '-cp"><path d="' + o.glass + '"/></clipPath>';
    return '<svg viewBox="0 0 56 56" aria-hidden="true" focusable="false"><defs>' + defs + '</defs>' + '<g fill="none" class="nc-icon-wrapper">' + '<g data-glass="origin" mask="url(#' + p + '-mk)">' + '<path d="' + o.solid + '" fill="url(#' + p + '-sg)"/></g>' + '<g data-glass="clone" clip-path="url(#' + p + '-cp)">' + '<path d="' + o.solid + '" fill="url(#' + p + '-sg)" filter="url(#' + p + '-bf)"/></g>' + '<path data-glass="blur" d="' + o.glass + '" fill="url(#' + p + '-gg)"/>' + '<path d="' + o.highlight + '" fill="url(#' + p + '-hg)"/>' + o.accents + '</g></svg>';
  }
  const GEOM = {
    source: {
      solidY1: 4,
      solidY2: 44,
      glassY1: 10,
      glassY2: 34,
      hiY1: 10,
      hiY2: 19.5,
      solid: 'M14,44 H42 A3,3 0 0 0 45,41 V21 A17,17 0 0 0 11,21 V41 A3,3 0 0 0 14,44 Z',
      glass: 'M19,34 H37 A2,2 0 0 0 39,32 V21 A11,11 0 0 0 17,21 V32 A2,2 0 0 0 19,34 Z',
      highlight: 'M17,21 A11,11 0 0 1 39,21 L39,23 A11,11 0 0 0 17,23 Z',
      accents: '<path d="M26.5,26.5 A1.5,1.5 0 1 0 29.5,26.5 A1.5,1.5 0 1 0 26.5,26.5 Z ' + 'M27.3,27.4 L28.7,27.4 L29.1,30.4 L26.9,30.4 Z" fill="#151515"/>'
    },
    scan: {
      solidY1: 8,
      solidY2: 46,
      glassY1: 15,
      glassY2: 28,
      hiY1: 15,
      hiY2: 21,
      solid: 'M25.8,42.25 L10,14.82 A2,2 0 0 1 10.73,12.09 A38,38 0 0 1 45.27,12.09 A2,2 0 0 1 46,14.82 L30.2,42.25 A2.5,2.5 0 0 1 25.8,42.25 Z',
      glass: 'M16.75,26.51 L13.25,20.45 A1.5,1.5 0 0 1 13.80,18.40 A31,31 0 0 1 42.20,18.40 A1.5,1.5 0 0 1 42.75,20.45 L39.25,26.51 A1.5,1.5 0 0 1 37.20,27.06 A21,21 0 0 0 18.80,27.06 A1.5,1.5 0 0 1 16.75,26.51 Z',
      highlight: 'M12.5,19.2 A31,31 0 0 1 43.5,19.2 L42.5,20.9 A29,29 0 0 0 13.5,20.9 Z',
      accents: '<path d="M34,20.5 C34.5,21.6 35.2,22.3 36.4,22.7 C35.2,23.1 34.5,23.8 34,24.9 ' + 'C33.5,23.8 32.8,23.1 31.6,22.7 C32.8,22.3 33.5,21.6 34,20.5 Z" fill="#151515"/>'
    },
    dataType: {
      solidY1: 10,
      solidY2: 46,
      glassY1: 23,
      glassY2: 38,
      hiY1: 23,
      hiY2: 29,
      solid: 'M16,46 H40 A4,4 0 0 0 44,42 V18 A4,4 0 0 0 40,14 H33.4 L32.6,12.2 A2.2,2.2 0 0 0 30.4,10 H25.6 A2.2,2.2 0 0 0 23.4,12.2 L22.6,14 H16 A4,4 0 0 0 12,18 V42 A4,4 0 0 0 16,46 Z',
      glass: 'M19,38 H37 A3,3 0 0 0 40,35 V26 A3,3 0 0 0 37,23 H19 A3,3 0 0 0 16,26 V35 A3,3 0 0 0 19,38 Z',
      highlight: 'M16,26 A3,3 0 0 1 19,23 H37 A3,3 0 0 1 40,26 L40,28 A3,3 0 0 0 37,25 H19 A3,3 0 0 0 16,28 Z',
      accents: '<path d="M32.3,30.5 A1.7,1.7 0 1 0 35.7,30.5 A1.7,1.7 0 1 0 32.3,30.5 Z" fill="#151515"/>'
    },
    object: {
      solidY1: 14,
      solidY2: 45,
      glassY1: 17,
      glassY2: 30,
      hiY1: 17,
      hiY2: 22,
      solid: 'M14,14 H42 A3,3 0 0 1 45,17 L42.3,41 A4,4 0 0 1 38.3,45 H17.7 A4,4 0 0 1 13.7,41 L11,17 A3,3 0 0 1 14,14 Z',
      glass: 'M17,30 H39 A3,3 0 0 0 42,27 V20 A3,3 0 0 0 39,17 H17 A3,3 0 0 0 14,20 V27 A3,3 0 0 0 17,30 Z',
      highlight: 'M14,20 A3,3 0 0 1 17,17 H39 A3,3 0 0 1 42,20 L42,22 A3,3 0 0 0 39,19 H17 A3,3 0 0 0 14,22 Z',
      accents: '<path d="M28,35.5 L31,38.5 L28,41.5 L25,38.5 Z" fill="#F2DCBD"/>'
    },
    entity: {
      solidY1: 11,
      solidY2: 45,
      glassY1: 22,
      glassY2: 34,
      hiY1: 22,
      hiY2: 27,
      solid: 'M11,28 A17,17 0 1 1 45,28 A17,17 0 1 1 11,28 Z',
      glass: 'M17,34 H39 A3,3 0 0 0 42,31 V25 A3,3 0 0 0 39,22 H17 A3,3 0 0 0 14,25 V31 A3,3 0 0 0 17,34 Z',
      highlight: 'M14,25 A3,3 0 0 1 17,22 H39 A3,3 0 0 1 42,25 L42,27 A3,3 0 0 0 39,24 H17 A3,3 0 0 0 14,27 Z',
      accents: '<path d="M26.2,26.3 H29.8 A0.9,0.9 0 0 1 30.7,27.2 V28.8 A0.9,0.9 0 0 1 29.8,29.7 H26.2 ' + 'A0.9,0.9 0 0 1 25.3,28.8 V27.2 A0.9,0.9 0 0 1 26.2,26.3 Z" fill="#151515"/>'
    }
  };
  function make(key, name, meaning, detail, color) {
    return {
      name,
      meaning,
      detail: "",
      color,
      svg: build(Object.assign({
        p: 'kg-' + key,
        color
      }, GEOM[key]))
    };
  }
  const ICONS = {
    source: make('source', 'Source', '一扇带磨砂窗的门', "", '#2E7D5B'),
    scan: make('scan', 'Scan', '原点撑开的扫描扇', "", '#D9532B'),
    dataType: make('dataType', 'Data type', '带标签的判据卡', "", '#5356C4'),
    object: make('object', 'Object', '盛内容的敞口箱', "", '#A87B3F'),
    entity: make('entity', 'Entity', '中间打码的值牌', "", '#B83A5E')
  };
  window.KIMI_GLASS = ICONS;
  window.KimiGlass = {
    cell: name => ICONS[name] ? ICONS[name].svg : ''
  };
})();

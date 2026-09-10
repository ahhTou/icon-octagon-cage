import React, { useId } from "react";
const ITEMS = [{
  id: "source",
  name: "Source",
  meaning: "接入数据的位置",
  detail: "",
  color: "#1688FF"
}, {
  id: "scan",
  name: "Scan",
  meaning: "检查并识别内容",
  detail: "",
  color: "#1688FF"
}, {
  id: "schema",
  name: "Schema",
  meaning: "某次扫描实际使用的分类材料",
  detail: "",
  color: "#6B3FE0"
}, {
  id: "dataType",
  name: "Data type",
  meaning: "数据属于哪一类",
  detail: "",
  color: "#8B45FF"
}, {
  id: "object",
  name: "Object",
  meaning: "承载数据的单元",
  detail: "",
  color: "#4776FF"
}, {
  id: "entity",
  name: "Entity",
  meaning: "识别出的单个值",
  detail: "",
  color: "#FF9B20"
}, {
  id: "policy",
  name: "Policy",
  meaning: "规则与动作的可复用组合",
  detail: "",
  color: "#0E9BB8"
}, {
  id: "tagRegulation",
  row: "tag.regulation",
  name: "Tag · regulation",
  meaning: "法规适用范围",
  detail: "",
  color: "#8052F5"
}, {
  id: "tagClass",
  row: "tag.class",
  name: "Tag · class",
  meaning: "数据的访问敏感级别",
  detail: "",
  color: "#376CFF"
}, {
  id: "stateUnlabelled",
  row: "state · unlabelled",
  name: "State · unlabelled",
  meaning: "尚未标记的对象",
  detail: "",
  color: "#187BFF"
}, {
  id: "reqActive",
  row: "state · request active",
  name: "State · request active",
  meaning: "请求处理中",
  detail: "",
  color: "#149BE8"
}, {
  id: "reqComplete",
  row: "state · request complete",
  name: "State · request complete",
  meaning: "请求已完成",
  detail: "",
  color: "#00B894"
}, {
  id: "reqUnverified",
  row: "state · request unverified",
  name: "State · request unverified",
  meaning: "请求身份尚待验证",
  detail: "",
  color: "#9651FA"
}, {
  id: "reqOverdue",
  row: "state · request overdue",
  name: "State · request overdue",
  meaning: "请求已逾期",
  detail: "",
  color: "#FF5B67"
}, {
  id: "reqUnassigned",
  row: "state · request unassigned",
  name: "State · request unassigned",
  meaning: "请求尚待指定负责人",
  detail: "",
  color: "#FFAD19"
}, {
  id: "metricDatatypes",
  row: "metric · datatypes scanned",
  name: "Metric · datatypes scanned",
  meaning: "已扫描的数据类型数量",
  detail: "",
  color: "#9348FF"
}, {
  id: "metricVolume",
  row: "metric · volume",
  name: "Metric · volume",
  meaning: "已扫描的数据总量",
  detail: "",
  color: "#168FEF"
}, {
  id: "metricDensity",
  row: "metric · density",
  name: "Metric · density",
  meaning: "每个文件的敏感实体含量",
  detail: "",
  color: "#00BDA5"
}, {
  id: "stateUnscanned",
  row: "state · unscanned",
  name: "State · unscanned",
  meaning: "尚未扫描",
  detail: "",
  color: "#438CF5"
}];
const GLYPHS = {
  source: {
    solid: <>
        <path d="M9 12c0-4 7-6 15-6s15 2 15 6v24c0 4-7 6-15 6S9 40 9 36Z" />
      </>,
    front: ({ pane }) => <>
        <path d="M9 19c0 4 7 6 15 6s15-2 15-6v10c0 4-7 6-15 6S9 33 9 29Z" {...pane} />
        <ellipse cx="24" cy="12" rx="15" ry="6" fill="#fff" opacity=".20" />
        <path d="M10 12c0-3 6-5 14-5s14 2 14 5" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth=".8" />
      </>
  },
  scan: {
    backing: ({ ground }) => <rect x="15" y="15" width="18" height="18" rx="5" {...ground} />,
    solid: <path d="M8 17V11a4 4 0 0 1 4-4h6v4h-6v6Zm22-10h6a4 4 0 0 1 4 4v6h-4v-6h-6ZM8 31h4v6h6v4h-6a4 4 0 0 1-4-4Zm28 0h4v6a4 4 0 0 1-4 4h-6v-4h6Z" />,
    front: ({
      pane,
      body
    }) => <>
        <rect x="15" y="15" width="18" height="18" rx="5" {...pane} />
        <rect x="6" y="22" width="36" height="4" rx="2" fill={body} />
        <path d="M8 22.5h32" stroke="#fff" strokeOpacity="0.22" strokeWidth="0.6" />
      </>
  },
  schema: {
    solid: <>
        <path d="M14 7h20a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4Z" />
        <rect x="18" y="4" width="12" height="7" rx="3" />
      </>,
    front: ({
      pane,
      body
    }) => <>
        <rect x="15" y="16" width="18" height="21" rx="3" {...pane} />
        <path d="M19 22h10M19 27.5h7M19 33h10" fill="none" stroke={body} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M20 6.5h8" stroke="#fff" strokeOpacity=".28" strokeWidth=".8" />
      </>
  },
  dataType: {
    glassBehind: true,
    solid: <>
        <circle cx="8" cy="35" r="4" />
        <path d="M26 7h6v10l8-5 3 5-8 5 8 5-3 5-8-5v10h-6V27l-8 5-3-5 8-5-8-5 3-5 8 5Z" />
      </>,
    front: ({
      pane
    }) => <>
        <circle cx="8" cy="35" r="4" transform="translate(0.8 -1)" {...pane} />
        <path d="M26 7h6v10l8-5 3 5-8 5 8 5-3 5-8-5v10h-6V27l-8 5-3-5 8-5-8-5 3-5 8 5Z" transform="translate(0.8 -1)" {...pane} />
      </>
  },
  object: {
    solid: <path d="M15 6h11l10 10v23a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z" />,
    front: ({
      pane,
      body
    }) => <>
        <rect x="8" y="24" width="32" height="12" rx="4" {...pane} />
        <path d="M26 6v7a3 3 0 0 0 3 3h7Z" {...pane} />
        <path d="M24 26.5v7m-3-5.25 6 3.5m-6 0 6-3.5" fill="none" stroke={body} strokeWidth="2" strokeLinecap="round" />
      </>
  },
  entity: {
    solid: <path d="m24 7 15 16a3 3 0 0 1 0 4L26 41a3 3 0 0 1-4 0L9 27a3 3 0 0 1 0-4Z" />,
    front: ({
      pane
    }) => <path d="m24 7 15 16a3 3 0 0 1 0 4L26 41a3 3 0 0 1-2 1V7Z" {...pane} />
  },
  policy: {
    solid: <path d="M24 5 39 10v13c0 10-6 17-15 20-9-3-15-10-15-20V10Z" />,
    front: ({
      pane,
      body
    }) => <>
        <rect x="10" y="19" width="28" height="9" rx="2.5" {...pane} />
        <path d="M14 22h12M14 25.5h8" fill="none" stroke={body} strokeWidth="2" strokeLinecap="round" />
        <path d="M10.5 10.5 24 6l13.5 4.5" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth=".8" />
      </>
  },
  tagRegulation: {
    solid: <path d="M8 14c7-2 12 0 16 3 4-3 9-5 16-3v25c-6-1-11 0-16 3-5-3-10-4-16-3Z" />,
    front: ({
      pane
    }) => <>
        <path d="M5 9c7-2 13 0 19 4 6-4 12-6 19-4v26c-7-2-13 0-19 4-6-4-12-6-19-4Z" {...pane} />
        <path d="M24 13v26M8 12v20" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" />
      </>
  },
  tagClass: {
    backing: ({ ground }) => <rect x="8" y="19" width="32" height="23" rx="5" {...ground} />,
    solid: <>
        <path fillRule="evenodd" d="M13 23v-8a11 11 0 0 1 22 0v8h-5v-8a6 6 0 0 0-12 0v8Z" />
      </>,
    front: ({
      pane,
      body
    }) => <>
        <rect x="8" y="19" width="32" height="23" rx="5" {...pane} />
        <rect x="22" y="26" width="4" height="8" rx="2" fill={body} />
        <path d="M11 24v12" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" strokeLinecap="round" />
      </>
  },
  stateUnlabelled: {
    solid: <path fillRule="evenodd" d="M8 6h14a3 3 0 0 1 2 1l18 18a3 3 0 0 1 0 4L29 42a3 3 0 0 1-4 0L7 24a3 3 0 0 1-1-2V8a2 2 0 0 1 2-2Zm3 6a3 3 0 1 0 6 0 3 3 0 1 0-6 0Z" />,
    // An empty tag means unlabelled; reserve the question mark for reqUnverified.
    // No pane also means no rim highlight on this subject.
    front: () => null
  },
  reqActive: {
    solid: <>
        <rect x="10" y="6" width="28" height="5" rx="2.5" />
        <rect x="10" y="37" width="28" height="5" rx="2.5" />
        <path d="m17 15 7 9 7-9ZM16 36l8-10 8 10Z" />
      </>,
    front: ({
      pane
    }) => <>
        <path d="M13 10h22c0 8-5 11-11 14 6 3 11 6 11 14H13c0-8 5-11 11-14-6-3-11-6-11-14Z" {...pane} />
        <path d="M16 13c0 4 3 7 5 8" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" fill="none" strokeLinecap="round" />
      </>
  },
  reqComplete: {
    solid: <path d="m7 24 5-5 10 10L37 9l6 5-20 27Z" />,
    front: ({
      pane
    }) => <path d="m5 23 6-6 17 17-5 7Z" {...pane} />
  },
  reqUnverified: {
    solid: <>
        <circle cx="20" cy="14" r="7" />
        <path d="M7 37v-3c0-7 5-12 13-12s13 5 13 12v3a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3Z" />
      </>,
    front: ({
      pane,
      body
    }) => <>
        <circle cx="35" cy="33" r="9" fill="#fff" fillOpacity="0.65" />
        <circle cx="35" cy="33" r="9" {...pane} />
        <path d="M32 30c0-4 7-4 6 0-.5 2-3 2-3 4" stroke={body} strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <circle cx="35" cy="37" r="1.2" fill={body} />
      </>
  },
  reqOverdue: {
    solid: <>
        <path d="M21 9a15 15 0 1 1-12 24l12-9Z" />
        <rect x="38" y="14" width="5" height="16" rx="2.5" />
        <circle cx="40.5" cy="36" r="2.5" />
      </>,
    front: ({
      pane,
      body
    }) => <>
        <circle cx="20" cy="23" r="16" {...pane} />
        <path d="M20 14v10l-5 4" stroke={body} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M8 20a12 12 0 0 1 9-9" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" strokeLinecap="round" fill="none" />
      </>
  },
  reqUnassigned: {
    solid: <>
        <circle cx="20" cy="14" r="7" />
        <path d="M20 22c8 0 13 5 13 12v3a3 3 0 0 1-3 3H20Z" />
      </>,
    front: ({
      pane,
      body
    }) => <>
        <path d="M7 37v-3c0-7 5-12 13-12s13 5 13 12v3a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3Z" {...pane} />
        <circle cx="35" cy="33" r="9" {...pane} />
        <path d="M31 33h8M35 29v8" stroke={body} strokeWidth="2.3" strokeLinecap="round" fill="none" />
      </>
  },
  metricDatatypes: {
    backing: ({ ground }) => <rect x="12" y="12" width="24" height="24" rx="5" {...ground} />,
    solid: <path d="M5 16V9a4 4 0 0 1 4-4h7v4H9v7Zm27-11h7a4 4 0 0 1 4 4v7h-4V9h-7ZM5 32h4v7h7v4H9a4 4 0 0 1-4-4Zm34 0h4v7a4 4 0 0 1-4 4h-7v-4h7Z" />,
    front: ({
      pane,
      body
    }) => <>
        <rect x="12" y="12" width="24" height="24" rx="5" {...pane} />
        <circle cx="17" cy="30" r="2" fill={body} />
        <path d="M27 17v14m-6-10.5 12 7m-12 0 12-7" fill="none" stroke={body} strokeWidth="3" strokeLinecap="round" />
      </>
  },
  metricVolume: {
    solid: <path d="m7 30 17-7 17 7v6l-17 7-17-7Z" />,
    front: ({
      pane
    }) => <>
        <path d="m6 22 18-8 18 8v5l-18 8-18-8Z" {...pane} />
        <path d="m6 13 18-8 18 8v5l-18 8-18-8Z" {...pane} />
        <path d="m8 14 16 7 16-7" stroke="#fff" strokeOpacity="0.22" strokeWidth=".8" fill="none" />
      </>
  },
  metricDensity: {
    solid: <path d="M11 5h16l10 10v22a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z" />,
    front: ({
      pane
    }) => <>
        <path d="M27 5v7a3 3 0 0 0 3 3h7Z" fill="#fff" opacity=".22" />
        <path transform="translate(23 27) scale(.8) skewX(-12) translate(-23 -27)" d="M15 36V25c0-11 16-11 16 0 0 8-8 11-12 6v5a2 2 0 0 1-4 0Zm4-11c0 7 8 7 8 0s-8-7-8 0Z" fillRule="evenodd" {...pane} />
      </>
  },
  stateUnscanned: {
    backing: ({ ground }) => <rect x="16" y="16" width="16" height="16" rx="4" {...ground} />,
    solid: <path d="M8 17V11a4 4 0 0 1 4-4h6v4h-6v6Zm22-10h6a4 4 0 0 1 4 4v6h-4v-6h-6ZM8 31h4v6h6v4h-6a4 4 0 0 1-4-4Zm28 0h4v6a4 4 0 0 1-4 4h-6v-4h6Z" />,
    front: ({
      pane
    }) => <>
        <rect x="16" y="16" width="16" height="16" rx="4" {...pane} />
        <path d="M17 24h3m3 0h3m3 0h3" stroke="#8493A9" strokeWidth="2" strokeLinecap="round" />
      </>
  }
};
// Back only the four panes suspended outside their solid body.
const BACKING_OPACITY = 0.55;
const PANE_OPACITY = 0.42;
const SHADOW_OPACITY = 0.2;
const SHADOW_COLOR = "#2F62E0";

function GlassIcon({
  kind,
  color,
  size = 48,
  glass: paneScale = 1,
  shadow: shadowScale = 1
}) {
  const id = useId().replace(/:/g, "");
  const body = `url(#${id}-body)`;
  const glass = `url(#${id}-glass)`;
  const edge = `url(#${id}-edge)`;
  const pane = {
    fill: glass,
    "data-glass": "blur"
  };
  const glyph = GLYPHS[kind];
  if (!glyph) return null;
  color = color || ITEMS.find(item => item.id === kind).color;
  const ground = { fill: body, opacity: BACKING_OPACITY, "data-glass": "backing" };
  const backing = glyph.backing ? glyph.backing({ ground, body }) : null;
  const front = glyph.front({
    pane,
    body
  });
  const panes = [];
  function collectPanes(children) {
    React.Children.forEach(children, child => {
      if (!React.isValidElement(child)) return;
      if (child.props.fill === glass) {
        panes.push(React.cloneElement(child, {
          key: panes.length,
          fill: "white",
          stroke: "none"
        }));
      } else if (child.props.children) collectPanes(child.props.children);
    });
  }
  collectPanes(front);
  return <svg aria-hidden="true" focusable="false" width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#071321" stopOpacity="0.30" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#F1F1F3" stopOpacity={PANE_OPACITY * paneScale} />
          <stop offset="1" stopColor="#DADAE0" stopOpacity={PANE_OPACITY * paneScale} />
        </linearGradient>
        <linearGradient id={`${id}-edge`} gradientUnits="userSpaceOnUse" x1="0" y1="5" x2="0" y2="24">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-frost`} x="-100%" y="-100%" width="400%" height="400%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="3" edgeMode="none" />
        </filter>
        <filter id={`${id}-rim`} x="-10%" y="-10%" width="120%" height="120%">
          <feMorphology in="SourceAlpha" operator="erode" radius="1" result="inside" />
          <feComposite in="SourceGraphic" in2="inside" operator="out" />
        </filter>
        <mask id={`${id}-rimMask`} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
          <g filter={`url(#${id}-rim)`}>{panes}</g>
        </mask>
        <clipPath id={`${id}-panes`}>{panes}</clipPath>
        <mask id={`${id}-outside`} maskUnits="userSpaceOnUse" x="-4" y="-4" width="56" height="56">
          <rect x="-4" y="-4" width="56" height="56" fill="white" />
          {panes.map((shape, index) => React.cloneElement(shape, {
          key: index,
          fill: "black"
        }))}
        </mask>
        <filter id={`${id}-soft`} x="-40%" y="-40%" width="180%" height="190%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor={SHADOW_COLOR} floodOpacity={SHADOW_OPACITY * shadowScale} />
        </filter>
        <g id={`${id}-solid`}>{glyph.solid}</g>
      </defs>
      <g filter={`url(#${id}-soft)`}>
        <g data-glass="origin" mask={`url(#${id}-outside)`} opacity={glyph.glassBehind ? 0 : 1}>
          <use href={`#${id}-solid`} fill={body} />
          <use href={`#${id}-solid`} fill={`url(#${id}-shade)`} />
        </g>
        {backing}
        <g data-glass="clone" clipPath={`url(#${id}-panes)`}>
          <g filter={`url(#${id}-frost)`}>
            <use href={`#${id}-solid`} fill={body} />
            <use href={`#${id}-solid`} fill={`url(#${id}-shade)`} />
          </g>
        </g>
        {front}
        <rect data-glass="highlight" x="0" y="0" width="48" height="48" fill={edge} mask={`url(#${id}-rimMask)`} />
        {glyph.glassBehind && <g data-glass="foreground">
            <use href={`#${id}-solid`} fill={body} />
            <use href={`#${id}-solid`} fill={`url(#${id}-shade)`} />
          </g>}
      </g>
    </svg>;
}
export { GlassIcon, ITEMS };

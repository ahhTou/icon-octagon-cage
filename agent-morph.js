/*
 * AgentGlassMorph — “Agent” 蓝色玻璃文字 ⇄ Agent Glass Icon 的液态形变组件。
 *
 * 独立预览组件(不接入 webapp)。几何与材质 1:1 移植自
 * webapp/src/shared/icons/GlassGlyphs.js 的 `agent`:
 *   - AGENT_HEAD:三分之二侧转的圆头(故意不对称,不可改成对称圆角矩形)
 *   - AGENT_FACE:Secuvy logo 贴在脸上的 matrix(0.07 的剪切是“侧脸”的来源)
 *   - 材质栈:body 纯色 + shade 明暗 + round 侧光 + 面部磨砂(frost 模糊克隆 + glass 渐变 + rim 高光)+ 蓝色软阴影
 *
 * 形变不是淡入淡出,而是液态物理转变:字母与球体在同一个 gooey 层
 * (feGaussianBlur + alpha 阈值,即 metaball)里运动——相遇时融合、分离时
 * 拉丝,元素全程不透明度不衰减(只在缩到极小后收尾),形状连续性由流体场
 * 保证。logo 不走液体场:它从熔化的 A 里“结晶”出来,清晰可辨地飞到面部,
 * 再沉入球体。模糊强度 σ(t) 在形变中段拉满、两端归零,所以文字态和图标态
 * 依然清晰锐利。软阴影包在最外层,影子跟随融合后的整体轮廓。
 *
 * 编排(t: 0=文字 → 1=图标,单向线性主时间轴,每条轨用自己的缓动):
 *   [0.08-0.38] A 原地熔化缩小,logo 同时从同一位置结晶长出(清晰可读)
 *   [0.08-0.69] “gent” 保持体积飞抵球心,在液体场里先汇成一滩
 *   [0.42-0.97] 球体从那滩字母里平滑长出(easeOutCubic 生长 + 收尾果冻摆动)
 *   [0.44-0.88] logo 沿上弧线飞往面部(矩阵插值,终点精确等于 AGENT_FACE 合成位姿)
 *   [0.88-0.99] logo 沉入球体(同色融合),磨砂面部随后淡入“上霜”
 *   v3 变体(新图标版):不要 logo——五个字母整体聚合汇滩,0.42 起滩里长出无面小球,
 *   0.86 起小球液态长出机器人新图标(天线/底座/面罩),反向时机器人熔回小球再散成文字。
 * 反向播放即 t 1→0,所有轨道自然镜像。
 *
 * 用法:
 *   const morph = AgentGlassMorph.create(mountEl, { onChange });
 *   morph.playOnce();  morph.toggleLoop();  morph.setT(0.5);  morph.setSpeed(1.4);
 *   AgentGlassMorph.iconSVG(uid, size) → 静态参考图标 svg 字符串。
 */
(function () {
  "use strict";

  /* ---------------- 移植的几何(勿手改,与 GlassGlyphs.js 保持一致) ---------------- */

  const AGENT_HEAD =
    "M17 12C22 10 27 10 31 11.2C37.5 13 40.5 17 40.5 23v4.5c0 6-4.2 9.7-10.5 12C26.5 41 22.5 40.8 " +
    "18 39.7l-3.5-.9C8.5 37.3 6 33 6 27v-4C6 17.4 10 13.8 17 12Z";

  const AGENT_FACE_STR = "matrix(.4106667 .07 0 .3966667 9.52 17.85)";
  const AGENT_FACE = [0.4106667, 0.07, 0, 0.3966667, 9.52, 17.85];

  const SECUVY_MARK =
    "M31.2519 39.9984H26.5553C23.6416 39.9984 21.2836 37.6371 21.2836 34.7268C21.2836 31.8164 " +
    "23.6449 29.4551 26.5553 29.4551H31.2519C33.0576 29.4551 34.5273 27.9854 34.5273 26.1765V13.5078" +
    "L9.58076 38.4544C7.51991 40.5152 4.18315 40.5152 2.12231 38.4544C0.0646984 36.3935 0.0646984 " +
    "33.0568 2.12231 30.9959L30.6382 2.48006C33.0673 0.0542058 36.6818 -0.66612 39.8538 0.648556" +
    "C43.0258 1.96323 45.0738 5.02865 45.0738 8.45909V26.1733C45.0738 33.7965 38.8719 39.9952 " +
    "31.2519 39.9952V39.9984Z";

  const DOT = { cx: 26.5551, cy: 34.7241, r: 5.2749 };
  const TINT = "#0B85C8"; // glassSubjects.js 里 agent 的主题蓝
  const DOT_INK = "#141F48"; // secuvy-logo-only.svg 里圆点的深青
  const SHADOW = "#2F62E0";

  /*
   * 新 agent 机器人图标(v3 的终点):体育场形头 + 双天线 + 小底座,玻璃面罩环上有
   * 两只眼(左圆右小)。几何来自设计稿(原 24x24),材质按 GlassIcon 家族规范重做:
   * 本体 flat TINT + shade 明暗;frost 磨砂克隆 σ=2(24 画格,等效家族的 3/48);
   * pane 用家族的 0.42 玻璃渐变;rim 顶缘高光用家族的 1px 内缩环(0.5/24);
   * 软阴影沿用家族 #2F62E0。ROBOT_PANE 的环绕方向(外环逆时针、内环顺时针、
   * 眼睛同外环)是面罩成环、眼睛成点的关键,不可“整理”。
   */
  const ROBOT_SOLID =
    "M20 1C20.5523 1 21 1.44772 21 2V7C21 7.48913 20.6485 7.89473 20.1846 7.98145C20.7021 8.86834 21 " +
    "9.89912 21 11C21 14.3137 18.3137 17 15 17H14.0625L15.8848 19.6504C16.5687 20.6456 15.8561 22 " +
    "14.6484 22H9.35156C8.14389 22 7.43128 20.6456 8.11523 19.6504L9.9375 17H9C5.68629 17 3 14.3137 3 " +
    "11C3 9.89929 3.29713 8.86824 3.81445 7.98145C3.35095 7.89436 3 7.4888 3 7V2C3 1.44772 3.44772 1 4 " +
    "1C4.55228 1 5 1.44772 5 2V6.52832C6.06154 5.5781 7.46316 5 9 5H15C16.5368 5 17.9385 5.5781 19 " +
    "6.52832V2C19 1.44772 19.4477 1 20 1Z";
  const ROBOT_PANE =
    "M15 3C19.4183 3 23 6.58172 23 11C23 15.4183 19.4183 19 15 19H9C4.58172 19 1 15.4183 1 11C1 6.58172 " +
    "4.58172 3 9 3H15ZM9 6C6.23858 6 4 8.23858 4 11C4 13.7614 6.23858 16 9 16H15C17.7614 16 20 13.7614 20 " +
    "11C20 8.23858 17.7614 6 15 6H9ZM8.5 8.5C9.88071 8.5 11 9.61929 11 11C11 12.3807 9.88071 13.5 8.5 " +
    "13.5C7.11929 13.5 6 12.3807 6 11C6 9.61929 7.11929 8.5 8.5 8.5ZM15.5 10C16.8807 10 18 10 18 11C18 " +
    "12.3807 16.8807 13.5 15.5 13.5C14.1193 13.5 13 12.3807 13 11C13 10 14.1193 10 15.5 10Z";
  // rim 高光只打面罩的最外圈(设计稿如此):内边界和眼睛描边会读成“骨架线”,不可用整张 pane。
  const ROBOT_RIM_OUTER =
    "M15 3C19.4183 3 23 6.58172 23 11C23 15.4183 19.4183 19 15 19H9C4.58172 19 1 15.4183 1 11C1 6.58172 " +
    "4.58172 3 9 3H15Z";

  /* ---------------- 布局常量(页面坐标,viewBox 220x90) ---------------- */

  const VIEW = { w: 220, h: 90 };
  const ICON_SCALE = 1.25; // 48 的图标放大到 60
  const ICON_TX = 80;
  const ICON_TY = 15;
  const HEAD_C_GLYPH = { x: 23.25, y: 25.5 }; // AGENT_HEAD 的包围盒中心
  const HEAD_C_PAGE = {
    x: ICON_TX + HEAD_C_GLYPH.x * ICON_SCALE,
    y: ICON_TY + HEAD_C_GLYPH.y * ICON_SCALE,
  };
  const MARK_C = { x: 22.5, y: 19.8 }; // logo 路径局部坐标中心(约 45x40)
  const MARK_H = 40.35;
  const WORD = { cx: 110, baseline: 60, fontSize: 46 };
  const FONT_STACK = '"Arial Rounded MT Bold","Avenir Next",Avenir,"Trebuchet MS","PingFang SC",system-ui,sans-serif';

  /*
   * 两个版本配方,供对比页并排播放:
   *   v1 评审初版——球体 easeOutElastic 直接弹出(读作“凭空出现”),字母边飞边缩,
   *       σ=11 的模糊超过字母笔画宽度,缩小的字母在抵达前就被液体场吞掉。
   *   v2 现版——字母近乎原尺寸飞抵球心汇成一滩,球体从滩里平滑长出再果冻落定。
   * gooAlpha/gooBias 是 feColorMatrix 的 alpha 行:阈值 = -bias/alpha,笔画峰值
   * alpha ≈ 笔宽/(σ·2.51) 低于阈值即被吞,所以 v2 的 σ 以字母笔宽为上限。
   */
  const RECIPES = {
    v1: { gooPeak: 11, gooAlpha: 20, gooBias: -9, headElastic: true, letterTwoPhase: false, letterFade: [0.8, 0.995], pileSpread: false, aField: false, gooDown: [0.74, 0.9], robot: false, logo: true, ballPlain: false },
    v2: { gooPeak: 5.5, gooAlpha: 16, gooBias: -6, headElastic: false, letterTwoPhase: true, letterFade: [0.94, 1], pileSpread: true, aField: true, gooDown: [0.74, 0.9], robot: false, logo: true, ballPlain: false },
    // v3:不要公司 logo——Agent 五个字母整体聚合成(无面罩的)小球,小球再液态长成
    // 新机器人图标。A 不需要独立强场(没有 A↔logo 交接),和 gent 一起在公共场里飞。
    v3: { gooPeak: 5.5, gooAlpha: 16, gooBias: -6, headElastic: false, letterTwoPhase: true, letterFade: [0.94, 1], pileSpread: true, aField: false, gooDown: [0.9, 0.985], robot: true, logo: false, ballPlain: true },
  };
  // A↔logo 交接区的独立强场(v2):A 在里面是“熔化”而不是“脆缩”,logo 从熔液里结晶。
  // 阈值取 v1 的 0.45;A 的笔画够粗,被吞的过程就是熔化动画本身。
  const A_GOO = { peak: 9.5, alpha: 20, bias: -9 };

  /* ---------------- 仿射矩阵([a,b,c,d,e,f],x'=ax+cy+e, y'=bx+dy+f) ---------------- */

  const mTranslate = (x, y) => [1, 0, 0, 1, x, y];
  const mScale = (s) => [s, 0, 0, s, 0, 0];
  const mRotate = (deg) => {
    const r = (deg * Math.PI) / 180;
    return [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0];
  };
  const mMul = (m, n) => [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
  const mApply = (m, p) => ({ x: m[0] * p.x + m[2] * p.y + m[4], y: m[1] * p.x + m[3] * p.y + m[5] });
  const mLerp = (m0, m1, p) => m0.map((v, i) => v + (m1[i] - v) * p);
  const mStr = (m) => `matrix(${m.map((v) => Math.round(v * 10000) / 10000).join(" ")})`;

  /* ---------------- 缓动 ---------------- */

  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const seg = (t, a, b) => clamp01((t - a) / (b - a));
  const lerp = (a, b, p) => a + (b - a) * p;
  const smooth = (p) => p * p * (3 - 2 * p);
  const easeInCubic = (p) => p * p * p;
  const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);
  const easeInOutCubic = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const easeOutBack = (p, c = 1.70158) => 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2);
  const easeOutElastic = (p) =>
    p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;

  /* ---------------- SVG 材质与图层(与 GlassIcon 的渲染栈一致) ---------------- */

  // pane 形状的“纯白/纯黑”克隆:clip、rimMask、outside mask 里只要形状不要颜色
  const paneShapes = (fill) =>
    `<path transform="${AGENT_FACE_STR}" d="${SECUVY_MARK}" fill="${fill}"/>` +
    `<circle transform="${AGENT_FACE_STR}" cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" fill="${fill}"/>`;

  function materialDefs(u) {
    return `
      <linearGradient id="${u}-body" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="${TINT}"/><stop offset="1" stop-color="${TINT}"/>
      </linearGradient>
      <linearGradient id="${u}-shade" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#fff" stop-opacity=".28"/>
        <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
        <stop offset="1" stop-color="#071321" stop-opacity=".30"/>
      </linearGradient>
      <linearGradient id="${u}-round" gradientUnits="userSpaceOnUse" x1="8" y1="20" x2="41" y2="25">
        <stop stop-color="#fff" stop-opacity=".08"/>
        <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".72" stop-color="#071321" stop-opacity=".06"/>
        <stop offset="1" stop-color="#071321" stop-opacity=".24"/>
      </linearGradient>
      <linearGradient id="${u}-glass" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#F1F1F3" stop-opacity=".42"/>
        <stop offset="1" stop-color="#DADAE0" stop-opacity=".42"/>
      </linearGradient>
      <linearGradient id="${u}-edge" gradientUnits="userSpaceOnUse" x1="0" y1="5" x2="0" y2="24">
        <stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <filter id="${u}-frost" x="-100%" y="-100%" width="400%" height="400%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="3" edgeMode="none"/>
      </filter>
      <filter id="${u}-rim" x="-10%" y="-10%" width="120%" height="120%">
        <feMorphology in="SourceAlpha" operator="erode" radius="1" result="inside"/>
        <feComposite in="SourceGraphic" in2="inside" operator="out"/>
      </filter>
      <mask id="${u}-rimMask" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
        <g filter="url(#${u}-rim)">${paneShapes("white")}</g>
      </mask>
      <clipPath id="${u}-panes">${paneShapes("white")}</clipPath>
      <mask id="${u}-outside" maskUnits="userSpaceOnUse" x="-4" y="-4" width="56" height="56">
        <rect x="-4" y="-4" width="56" height="56" fill="white"/>
        ${paneShapes("black")}
      </mask>
      <filter id="${u}-soft" x="-40%" y="-40%" width="180%" height="190%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" flood-color="${SHADOW}" flood-opacity=".2"/>
      </filter>
      <g id="${u}-solid"><path d="${AGENT_HEAD}"/></g>`;
  }

  // 头身:pane 区域被 outside mask 挖空,由模糊克隆(磨砂)填回
  const iconBody = (u) => `
    <g mask="url(#${u}-outside)">
      <use href="#${u}-solid" fill="url(#${u}-body)"/>
      <use href="#${u}-solid" fill="url(#${u}-shade)"/>
    </g>
    <g clip-path="url(#${u}-panes)">
      <g filter="url(#${u}-frost)">
        <use href="#${u}-solid" fill="url(#${u}-body)"/>
        <use href="#${u}-solid" fill="url(#${u}-shade)"/>
      </g>
    </g>
    <path d="${AGENT_HEAD}" fill="url(#${u}-round)"/>`;

  // v3 的无面小球:字母聚合成的纯净质量团——本体 + 明暗 + 侧光,不挖 logo 洞、不带磨砂
  const iconBodyPlain = (u) => `
    <use href="#${u}-solid" fill="url(#${u}-body)"/>
    <use href="#${u}-solid" fill="url(#${u}-shade)"/>
    <path d="${AGENT_HEAD}" fill="url(#${u}-round)"/>`;

  // 磨砂面部:glass 渐变的 logo + 本体色描边的圆点 + pane 顶缘高光
  const panesReal = (u) => `
    <path transform="${AGENT_FACE_STR}" d="${SECUVY_MARK}" fill="url(#${u}-glass)"/>
    <circle transform="${AGENT_FACE_STR}" cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}"
      stroke="url(#${u}-body)" stroke-width="2.5" fill="url(#${u}-glass)"/>
    <rect x="0" y="0" width="48" height="48" fill="url(#${u}-edge)" mask="url(#${u}-rimMask)"/>`;

  /** 静态参考图标,与 GlassIcon kind="agent" 的逐层输出一致。kind="robot" 输出新机器人版。 */
  function agentIconSVG(u, size = 48, kind = "head") {
    if (kind === "robot") {
      return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">` +
        `<defs>${materialDefs(u)}${robotDefs(u)}</defs>` +
        `<g filter="url(#${u}-soft)"><g transform="translate(6 6) scale(1.5)">${robotBody(u)}${robotFace(u)}</g></g></svg>`
      );
    }
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">` +
      `<defs>${materialDefs(u)}</defs>` +
      `<g filter="url(#${u}-soft)">${iconBody(u)}${panesReal(u)}</g></svg>`
    );
  }

  /* ---------------- 新机器人图标(24 画格,家族材质规范) ---------------- */

  function robotDefs(u) {
    return `
      <linearGradient id="${u}-redge" gradientUnits="userSpaceOnUse" x1="0" y1="2.5" x2="0" y2="12.5">
        <stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="${u}-rglass" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#F1F1F3" stop-opacity=".6"/>
        <stop offset="1" stop-color="#DADAE0" stop-opacity=".6"/>
      </linearGradient>
      <filter id="${u}-rfrost" x="-100%" y="-100%" width="400%" height="400%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="5.5" edgeMode="none"/>
      </filter>
      <filter id="${u}-rrim" x="-10%" y="-10%" width="120%" height="120%">
        <feMorphology in="SourceAlpha" operator="erode" radius="0.5" result="inside"/>
        <feComposite in="SourceGraphic" in2="inside" operator="out"/>
      </filter>
      <mask id="${u}-rrimMask" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <g filter="url(#${u}-rrim)"><path d="${ROBOT_RIM_OUTER}" fill="white"/></g>
      </mask>
      <clipPath id="${u}-rpanes"><path d="${ROBOT_PANE}" fill="white"/></clipPath>
      <mask id="${u}-routside" maskUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
        <rect x="-2" y="-2" width="28" height="28" fill="white"/>
        <path d="${ROBOT_PANE}" fill="black"/>
      </mask>
      <g id="${u}-rsolid"><path d="${ROBOT_SOLID}"/></g>`;
  }

  // 机器人本体:pane 区域被 routside 挖空,磨砂克隆填回
  const robotBody = (u) => `
    <g mask="url(#${u}-routside)">
      <use href="#${u}-rsolid" fill="url(#${u}-body)"/>
      <use href="#${u}-rsolid" fill="url(#${u}-shade)"/>
    </g>
    <g clip-path="url(#${u}-rpanes)">
      <g filter="url(#${u}-rfrost)">
        <use href="#${u}-rsolid" fill="url(#${u}-body)"/>
        <use href="#${u}-rsolid" fill="url(#${u}-shade)"/>
      </g>
    </g>`;

  // 机器人面罩(细节层):玻璃环 + 双眼 + 顶缘高光。
  // 玻璃用设计稿自己的 0.6(比家族默认 0.42 更雾),frost σ=4——面罩盖住下面的结构
  const robotFace = (u) => `
    <path d="${ROBOT_PANE}" fill="url(#${u}-rglass)"/>
    <rect x="0" y="0" width="24" height="24" fill="url(#${u}-redge)" mask="url(#${u}-rrimMask)"/>`;

  /* ---------------- 组件本体 ---------------- */

  let uid = 0;

  function createAgentGlassMorph(mount, opts = {}) {
    const u = `agm${++uid}`;
    const R = RECIPES[opts.recipe] || RECIPES.v2;
    const onChange = opts.onChange || (() => {});
    const LEG_MS = opts.legMs || 1700;
    const HOLD_MS = opts.holdMs || 900;

    /*
     * 分层:gooey 液体层(字母本色 + 球体)负责“gent 汇入球体”的形状连续性;
     * logo(实心层 + 深青圆点)不进液体场——它要从熔化的 A 里“结晶”出来、
     * 清晰地飞到面部,全程可辨认。文字的高光镀层、面部磨砂 pane 是细节层,
     * 各自跟随主体变换、在端点附近交接。软阴影包在所有实体之外,影子跟随
     * 融合后的整体轮廓。
     */
    mount.innerHTML = `
      <svg viewBox="0 0 ${VIEW.w} ${VIEW.h}" xmlns="http://www.w3.org/2000/svg" role="img"
           aria-label="Agent 文字与 Agent 玻璃图标的液态形变动画" style="display:block;width:100%;height:auto">
        <defs>
          ${materialDefs(u)}
          ${robotDefs(u)}
          <linearGradient id="${u}-textShade" gradientUnits="userSpaceOnUse" x1="0" y1="22" x2="0" y2="66">
            <stop stop-color="#fff" stop-opacity=".32"/>
            <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
            <stop offset="1" stop-color="#071321" stop-opacity=".34"/>
          </linearGradient>
          <linearGradient id="${u}-textGloss" gradientUnits="userSpaceOnUse" x1="0" y1="24" x2="0" y2="48">
            <stop stop-color="#fff" stop-opacity=".6"/>
            <stop offset="1" stop-color="#fff" stop-opacity="0"/>
          </linearGradient>
          <filter id="${u}-goo" x="-45%" y="-45%" width="190%" height="190%" color-interpolation-filters="sRGB">
            <feGaussianBlur id="${u}-gooBlur" in="SourceGraphic" stdDeviation="0" result="blur"/>
            <feColorMatrix in="blur" type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${R.gooAlpha} ${R.gooBias}"/>
          </filter>
          <filter id="${u}-gooA" x="-45%" y="-45%" width="190%" height="190%" color-interpolation-filters="sRGB">
            <feGaussianBlur id="${u}-gooBlurA" in="SourceGraphic" stdDeviation="0" result="blur"/>
            <feColorMatrix in="blur" type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${A_GOO.alpha} ${A_GOO.bias}"/>
          </filter>
        </defs>

        <g filter="url(#${u}-soft)">
          <g data-r="gooA" filter="url(#${u}-gooA)"></g>
          <g data-r="goo" filter="url(#${u}-goo)">
            <g transform="translate(${ICON_TX} ${ICON_TY}) scale(${ICON_SCALE})">
              <g data-r="head" opacity="0">${R.ballPlain ? iconBodyPlain(u) : iconBody(u)}</g>
              <g data-r="robot" opacity="0"><g transform="translate(6 6) scale(1.5)">${robotBody(u)}</g></g>
            </g>
            <g data-r="word"></g>
          </g>
          <g data-r="mark" opacity="0">
            <path d="${SECUVY_MARK}" fill="${TINT}"/>
            <path d="${SECUVY_MARK}" fill="url(#${u}-shade)"/>
          </g>
          <g data-r="markFx" opacity="0">
            <circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" fill="${DOT_INK}"/>
          </g>
        </g>

        <g data-r="wordFx"></g>

        <g transform="translate(${ICON_TX} ${ICON_TY}) scale(${ICON_SCALE})">
          <g data-r="frost" opacity="0">${panesReal(u)}</g>
          <g transform="translate(6 6) scale(1.5)"><g data-r="robotFace" opacity="0">${robotFace(u)}</g></g>
        </g>
      </svg>`;

    const svg = mount.querySelector("svg");
    const $ = (role) => svg.querySelector(`[data-r="${role}"]`);
    const gooBlur = svg.querySelector(`#${u}-gooBlur`);
    const gooBlurA = svg.querySelector(`#${u}-gooBlurA`);
    const gooAEl = $("gooA");
    const headEl = $("head");
    const robotEl = $("robot");
    const robotFaceEl = $("robotFace");
    const frostEl = $("frost");
    const wordEl = $("word");
    const wordFxEl = $("wordFx");
    const markEl = $("mark");
    const markFxEl = $("markFx");

    // “Agent” 拆成 5 个字母:液体层放本色字形,细节层放明暗+高光镀层(同步变换)
    // pile:字母汇进球体时各自的落点散布,让五滩叠成一小片而不是一个点
    const PILE = [{ x: -6, y: -1 }, { x: -5, y: -3 }, { x: 4, y: 3 }, { x: -3, y: 4 }, { x: 5, y: -2 }];
    const letters = [..."Agent"].map((ch, i) => {
      const attrs = `y="${WORD.baseline}" font-family='${FONT_STACK}' font-size="${WORD.fontSize}" font-weight="700" text-anchor="left"`;
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.innerHTML = `<text ${attrs} fill="${TINT}">${ch}</text>`;
      // v2:A 进自己的强场(熔化交接给 logo);v1:A 和 gent 同在一个公共场
      (R.aField && i === 0 ? gooAEl : wordEl).appendChild(g);
      const fx = document.createElementNS("http://www.w3.org/2000/svg", "g");
      fx.innerHTML =
        `<text ${attrs} fill="url(#${u}-textShade)">${ch}</text>` +
        `<text ${attrs} fill="url(#${u}-textGloss)">${ch}</text>`;
      wordFxEl.appendChild(fx);
      return { ch, i, g, fx, texts: [...g.children, ...fx.children], home: null, spin: i % 2 ? 26 : -30, pile: PILE[i] };
    });

    /* 字间距排词 + 量出每个字母的包围盒(决定飞行轨迹的起点) */
    let A_BOX = null;
    let M0 = null; // logo 起始矩阵(精确落在字母 A 上)
    const M1 = mMul(mTranslate(ICON_TX, ICON_TY), mMul(mScale(ICON_SCALE), AGENT_FACE)); // 终点=面部位姿
    const FACE_C = mApply(M1, MARK_C); // 面部 logo 中心(页面坐标,沉入时的缩放支点)

    function layout() {
      const SPACING = 1.5;
      const base = letters.map((l) => l.texts[0]);
      const widths = base.map((t) => t.getComputedTextLength());
      const total = widths.reduce((a, b) => a + b, 0) + SPACING * (letters.length - 1);
      let x = WORD.cx - total / 2;
      letters.forEach((l, i) => {
        l.texts.forEach((t) => t.setAttribute("x", x.toFixed(2)));
        const b = base[i].getBBox();
        l.home = { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
        x += widths[i] + SPACING;
      });
      A_BOX = letters[0].home;
      const sA = A_BOX.h / MARK_H; // logo 缩放到与 A 同高
      M0 = mMul(
        mTranslate(A_BOX.x, A_BOX.y),
        mMul(mRotate(-12), mMul(mScale(sA), mTranslate(-MARK_C.x, -MARK_C.y)))
      );
    }

    const setLetter = (l, transform, opacity) => {
      l.g.setAttribute("transform", transform);
      l.g.setAttribute("opacity", opacity);
      l.fx.setAttribute("transform", transform);
    };

    /* ---------------- 位姿函数:t=0 文字态,t=1 图标态 ---------------- */

    function applyPose(t) {
      // 液态强度:中段拉满,两端归零(文字与图标保持清晰;v3 收尾延长,球→机器人也是液态)
      const goo = R.gooPeak * smooth(seg(t, 0.05, 0.22)) * (1 - smooth(seg(t, R.gooDown[0], R.gooDown[1])));
      gooBlur.setAttribute("stdDeviation", goo.toFixed(2));
      // A 的独立强场:只在交接窗口内起效,熔化早来、收场干净
      if (R.aField) {
        const gooA = A_GOO.peak * smooth(seg(t, 0.05, 0.18)) * (1 - smooth(seg(t, 0.3, 0.46)));
        gooBlurA.setAttribute("stdDeviation", gooA.toFixed(2));
      }

      // 文字镀层只在文字态附近存在,形变一开始就让位给液体层
      wordFxEl.setAttribute("opacity", (1 - seg(t, 0.02, 0.12)).toFixed(3));

      // 字母 A(仅 v1/v2 有 logo 流程):原地蓄力上跳,随后原地熔化缩小——logo 从液态形体里结晶
      if (R.logo) {
        const melt = easeInCubic(seg(t, 0.08, 0.38));
        const hop = -5 * Math.sin(Math.PI * Math.min(seg(t, 0, 0.2), 1));
        const s = Math.max(1 - melt, 0.001);
        setLetter(
          letters[0],
          `translate(${A_BOX.x} ${A_BOX.y + hop}) rotate(${(-10 * melt).toFixed(2)}) scale(${s.toFixed(4)}) ` +
            `translate(${-A_BOX.x} ${-A_BOX.y})`,
          "1"
        );
      }

      // 飞行字母:v1/v2 是 g e n t(A 留给 logo 交接);v3 不要 logo,五个字母整体聚合。
      // 近乎原尺寸飞抵球心(笔画低于模糊阈值会被吞,飞行中不收),到位叠成一滩后被球体吸收
      const flyers = R.logo ? letters.slice(1) : letters;
      flyers.forEach((l, k) => {
        const w0 = 0.08 + k * 0.05;
        const q = seg(t, w0, w0 + 0.46);
        const e = easeInCubic(q);
        const hop = -8 * Math.sin(Math.PI * Math.min(q / 0.3, 1));
        const pile = R.pileSpread ? l.pile : { x: 0, y: 0 }; // v2 落点带散布,堆成一滩而不是一个点
        const cx = lerp(l.home.x, HEAD_C_PAGE.x + pile.x, e);
        const cy = lerp(l.home.y, HEAD_C_PAGE.y + pile.y, e) + hop;
        const s = R.letterTwoPhase
          ? Math.max(lerp(1, 0.85, seg(q, 0, 0.75)) * lerp(1, 0.04, easeInCubic(seg(q, 0.75, 1))), 0.001)
          : Math.max(lerp(1, 0.06, e), 0.001);
        const r = l.spin * easeInOutCubic(q);
        setLetter(
          l,
          `translate(${cx.toFixed(2)} ${cy.toFixed(2)}) rotate(${r.toFixed(2)}) scale(${s.toFixed(4)}) ` +
            `translate(${-l.home.x} ${-l.home.y})`,
          (1 - seg(q, R.letterFade[0], R.letterFade[1])).toFixed(3)
        );
      });

      // 球体:v2 从字母滩里平滑长出 + 收尾果冻摆动;v1 easeOutElastic 直接充气弹出。
      // v3 在此基础上,机器人长出时球体缩小并入(v3 终点没有这颗球)。
      {
        let e, wob, dy, rot;
        if (R.headElastic) {
          const q = seg(t, 0.4, 0.95);
          e = easeOutElastic(q);
          wob = e - 1;
          dy = 9.6 * (1 - e);
          rot = -8 * (1 - e);
        } else {
          const base = easeOutCubic(seg(t, 0.42, 0.82));
          const qJelly = seg(t, 0.78, 0.97);
          const jelly = Math.sin(qJelly * Math.PI * 2.2) * (1 - qJelly) * 0.22;
          e = Math.max(base * (1 + jelly), 0.001);
          wob = jelly * base;
          dy = 9.6 * (1 - base);
          rot = -8 * (1 - base);
        }
        const shrink = R.robot ? lerp(1, 0.35, easeInCubic(seg(t, 0.86, 1))) : 1;
        const sx = Math.max(e, 0.001) * (1 + (R.headElastic ? 0.5 : 0.6) * wob) * shrink;
        const sy = Math.max(e, 0.001) * (1 - (R.headElastic ? 0.42 : 0.5) * wob) * shrink;
        headEl.setAttribute(
          "transform",
          `translate(${HEAD_C_GLYPH.x} ${HEAD_C_GLYPH.y}) translate(0 ${dy.toFixed(3)}) rotate(${rot.toFixed(3)}) ` +
            `scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${-HEAD_C_GLYPH.x} ${-HEAD_C_GLYPH.y})`
        );
        headEl.setAttribute(
          "opacity",
          (seg(t, R.headElastic ? 0.4 : 0.42, R.headElastic ? 0.48 : 0.5) * (R.robot ? 1 - seg(t, 0.9, 0.965) : 1)).toFixed(3)
        );
      }

      // logo(仅 v1/v2):从熔化的 A 里结晶长出 → 沿上弧线飞往面部 → 沉入球体
      if (R.logo) {
        const pop = 0.25 + 0.75 * easeOutBack(seg(t, 0.1, 0.4), 2.4);
        const qTr = seg(t, 0.44, 0.88);
        const m = mLerp(M0, M1, easeInOutCubic(qTr));
        m[5] += -9 * Math.sin(Math.PI * qTr); // 飞行弧线:从字母上方越过去
        const qBulge = seg(t, 0.44, 0.96);
        const k = pop * (1 + 0.12 * Math.sin(Math.PI * qBulge) * (1 - qBulge));
        let world = mMul(m, mMul(mTranslate(MARK_C.x, MARK_C.y), mMul(mScale(k), mTranslate(-MARK_C.x, -MARK_C.y))));
        const subWindow = R.robot ? [0.84, 0.92] : [0.88, 0.99];
        const sub = lerp(1, 0.1, easeInCubic(seg(t, subWindow[0], subWindow[1]))); // 沉入:绕面部中心缩进球体
        world = mMul(mTranslate(FACE_C.x, FACE_C.y), mMul(mScale(sub), mMul(mTranslate(-FACE_C.x, -FACE_C.y), world)));
        const tf = mStr(world);
        markEl.setAttribute("transform", tf);
        markFxEl.setAttribute("transform", tf);
        const markOut = R.robot ? [0.92, 0.965] : [0.95, 0.995];
        const dotOut = R.robot ? [0.84, 0.9] : [0.88, 0.95];
        markEl.setAttribute("opacity", (seg(t, 0.1, 0.22) * (1 - seg(t, markOut[0], markOut[1]))).toFixed(3));
        markFxEl.setAttribute("opacity", (seg(t, 0.12, 0.24) * (1 - seg(t, dotOut[0], dotOut[1]))).toFixed(3));
        // 磨砂面部:v1/v2 上霜后定格;v3 上霜成老图标后被机器人面罩接替
        frostEl.setAttribute(
          "opacity",
          (R.robot ? seg(t, 0.8, 0.88) * (1 - seg(t, 0.885, 0.95)) : seg(t, 0.84, 0.96)).toFixed(3)
        );
      }

      // v3 独有:字母聚成的小球液态长成机器人新图标——球心弹性生长。
      // 面罩玻璃与本体同拍到达([0.87,0.94]):机器人一露面就是带玻璃的完整形态,
      // 否则中途会透出内部结构和身后的小球残骸(“磨砂度不够、露出骨架”的修法)。
      if (R.robot) {
        const qR = seg(t, 0.86, 1);
        const eR = easeOutElastic(qR);
        const wR = eR - 1;
        const sx = Math.max(eR, 0.001) * (1 + 0.5 * wR);
        const sy = Math.max(eR, 0.001) * (1 - 0.42 * wR);
        const dy = 4 * (1 - eR);
        const rot = 6 * (1 - eR);
        robotEl.setAttribute(
          "transform",
          `translate(${HEAD_C_GLYPH.x} ${HEAD_C_GLYPH.y}) translate(0 ${dy.toFixed(3)}) rotate(${rot.toFixed(3)}) ` +
            `scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${-HEAD_C_GLYPH.x} ${-HEAD_C_GLYPH.y})`
        );
        robotEl.setAttribute("opacity", seg(t, 0.86, 0.915).toFixed(3));
        robotFaceEl.setAttribute("opacity", seg(t, 0.87, 0.94).toFixed(3));
      }
    }

    /* ---------------- 播放控制 ---------------- */

    let t = 0;
    let raf = null;
    let holdTimer = null;
    let looping = false;
    let speed = 1;
    let currentTarget = 0;

    const stopTimers = () => {
      if (raf) cancelAnimationFrame(raf);
      if (holdTimer) clearTimeout(holdTimer);
      raf = holdTimer = null;
    };

    function leg(target) {
      stopTimers();
      currentTarget = target;
      const from = t;
      const dur = LEG_MS / speed;
      const start = performance.now();
      const frame = (now) => {
        const p = Math.min((now - start) / dur, 1);
        t = from + (target - from) * p;
        applyPose(t);
        onChange({ t, playing: true, looping });
        if (p < 1) {
          raf = requestAnimationFrame(frame);
        } else {
          t = target;
          applyPose(t);
          raf = null;
          onChange({ t, playing: false, looping });
          if (looping) holdTimer = setTimeout(() => leg(target === 1 ? 0 : 1), HOLD_MS / speed);
        }
      };
      raf = requestAnimationFrame(frame);
    }

    const api = {
      el: svg,
      /** 单次播放:文字态 → 图标,或图标 → 文字态(取当前所在端的另一端)。 */
      playOnce() {
        if (raf) return;
        leg(t < 0.5 ? 1 : 0);
      },
      /** 循环开关。关时让当前这一程播完再停。 */
      toggleLoop() {
        looping = !looping;
        if (looping && !raf) leg(t < 0.5 ? 1 : 0);
        if (!looping && holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
        onChange({ t, playing: !!raf, looping });
        return looping;
      },
      /** 直接跳到某个位姿(0..1),并停掉播放。 */
      setT(v) {
        looping = false;
        stopTimers();
        t = clamp01(v);
        applyPose(t);
        onChange({ t, playing: false, looping });
      },
      setSpeed(v) {
        speed = Math.min(Math.max(v, 0.2), 3);
      },
      state: () => ({ t, playing: !!raf, looping, target: currentTarget }),
      destroy() {
        stopTimers();
        mount.innerHTML = "";
      },
    };

    // 字体就绪后再排版测量,避免拿到错误的字母宽度
    const ready = () => {
      layout();
      applyPose(0);
      svg.style.opacity = "1";
    };
    svg.style.opacity = "0";
    svg.style.transition = "opacity .25s";
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready);
    else setTimeout(ready, 60);

    return api;
  }

  window.AgentGlassMorph = { create: createAgentGlassMorph, iconSVG: agentIconSVG };
})();

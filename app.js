(function () {
  "use strict";

  const AGE_KEY = "pose-dict-age-ok-v1";
  let DATA = null;
  let activeLetter = "A";
  let searchQuery = "";
  let toastTimer = null;

  const $ = (sel) => document.querySelector(sel);

  /* ---------- Age gate ---------- */
  function initAgeGate() {
    const gate = $("#age-gate");
    const app = $("#app");
    if (sessionStorage.getItem(AGE_KEY) === "1") {
      gate.classList.add("hidden");
      app.classList.remove("hidden");
      return true;
    }
    $("#age-yes").addEventListener("click", () => {
      sessionStorage.setItem(AGE_KEY, "1");
      gate.classList.add("hidden");
      app.classList.remove("hidden");
      bootApp();
    });
    $("#age-no").addEventListener("click", () => {
      $("#age-denied").classList.remove("hidden");
      $("#age-yes").disabled = true;
    });
    return false;
  }

  /* ---------- Toast / copy ---------- */
  function showToast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1600);
  }

  async function copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    if (btn) {
      btn.classList.add("copied");
      btn.textContent = "복사됨!";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = "복사";
      }, 1200);
    }
    showToast("태그를 복사했습니다");
  }

  /* ---------- Helpers ---------- */
  function has(tags, ...words) {
    const t = tags.toLowerCase();
    return words.some((w) => t.includes(w.toLowerCase()));
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ================================================================
     SVG ILLUSTRATIONS — all fully clothed / SFW
     ================================================================ */


  /* Featured clothed PNG examples (SFW) — keyed by tag substrings */
  const EXAMPLE_IMAGES = [
    { match: ["seductive smile", "bedroom eyes"], src: "examples/expr-seductive-smile.png", alt: "유혹 미소" },
    { match: ["ahegao"], src: "examples/expr-ahegao-clothed.png", alt: "아헤가오(착의)" },
    { match: ["looking back"], src: "examples/pose-looking-back.png", alt: "뒤돌아봄" },
    { match: ["kneeling", "one knee"], src: "examples/pose-kneeling.png", alt: "무릎" },
    { match: ["sitting", "crossed legs"], src: "examples/pose-sitting.png", alt: "앉기" },
    { match: ["hand on hip", "peace sign", " v,", "v sign", ", v"], src: "examples/pose-standing-v.png", alt: "서서 브이" },
  ];

  function exampleImageHtml(item) {
    const id = item.id || "";
    // Per-card clothed illustration (preferred)
    if (id && window.__POSE_IMG_OK__ && window.__POSE_IMG_OK__.has(id)) {
      return `<img class="card-photo" src="examples/by-id/${id}.png" alt="${esc(item.label || id)}" loading="lazy" />`;
    }
    // Fallback: featured keyword matches
    const tags = ((item.tags || "") + " " + (item.label || "")).toLowerCase();
    for (const ex of EXAMPLE_IMAGES) {
      if (ex.match.some((m) => tags.includes(m.toLowerCase()))) {
        return `<img class="card-photo" src="${ex.src}" alt="${ex.alt}" loading="lazy" />`;
      }
    }
    return null;
  }

  function renderIllustration(item, categoryLetter) {
    const photo = exampleImageHtml(item);
    if (photo) return photo;
    const letter = (categoryLetter || "A").toUpperCase();
    if (letter === "A" || letter === "B") return renderFace(item, letter === "B");
    if (letter === "C") return renderSolo(item);
    if (letter === "D") return renderDuo(item);
    return renderGroup(item);
  }

  /* ----- A/B Faces ----- */
  function renderFace(item, male) {
    const tags = (item.tags || "") + " " + (item.label || "");
    const skin = male ? "#e8c4a8" : "#f0c9b0";
    const hair = male ? "#2a2e3a" : "#3d2a4a";
    const shirt = male ? "#3a5a8c" : "#8b5a9e";
    const shirtDark = male ? "#2a4068" : "#6a4080";

    const angry = has(tags, "angry", "v-shaped", "glaring", "annoyed", "scowl", "rage", "furrowed");
    const blush = has(tags, "blush", "embarrassed", "flustered", "aroused", "flushed", "shy", "uwu");
    const fullBlush = has(tags, "full-face blush");
    const smile = has(tags, "smile", "grin", "happy", "laugh", "smirk", "smug", "doyagao", ":d", ";d", "seductive smile");
    const ahe = has(tags, "ahegao", "torogao", "ohogao", "fucked silly", "rolling eyes", "orgasm");
    const tears = has(tags, "tear", "cry", "sobbing", "teary");
    const wink = has(tags, "wink", "one eye closed", ";p", ";d");
    const heartEyes = has(tags, "heart-shaped", "heart in eye", "heart-shaped pupil");
    const tongue = has(tags, "tongue", ":p", ";p", "akanbe", "long tongue");
    const closed = has(tags, "closed eyes", "closed eye", "xd", "sleepy", "unconscious", "sigh") && !wink && !ahe;
    const halfLid = has(tags, "half-lid", "half-closed", "bedroom", "sultry", "sleepy eyes") && !closed && !ahe;
    const openMouth = has(tags, "open mouth", "moaning", "panting", "gasping", "scream", "shouting", "yawning") || ahe;
    const pout = has(tags, "pout", "cheek bulge");
    const surprised = has(tags, "surprised", "wide-eyed", "o_o", "panick", "scared");
    const nosebleed = has(tags, "nosebleed");
    const sweat = has(tags, "sweat");
    const covering = has(tags, "covering mouth", "hand over mouth", "hand to own mouth", "facepalm");
    const fang = has(tags, "fang");
    const spiral = has(tags, "spiral", "@ @");
    const starPupil = has(tags, "star-shaped");
    const lookingSide = has(tags, "looking to the side", "looking away", "looking afar");
    const lookingUp = has(tags, "looking up");
    const lookingDown = has(tags, "looking down");
    const lookingBack = has(tags, "looking back");

    const jawRx = male ? 38 : 40;
    const jawRy = male ? 46 : 44;
    const eyeY = 88;
    let pupilDx = 0;
    let pupilDy = 0;
    if (lookingSide || lookingBack) pupilDx = 3;
    if (lookingUp) pupilDy = -2;
    if (lookingDown) pupilDy = 2;

    // Eyebrows
    let browL, browR;
    if (angry) {
      browL = `<path d="M62 72 L88 78" stroke="#2a2030" stroke-width="3" stroke-linecap="round" fill="none"/>`;
      browR = `<path d="M138 78 L162 72" stroke="#2a2030" stroke-width="3" stroke-linecap="round" fill="none"/>`;
    } else if (has(tags, "raised eyebrow", "skeptical")) {
      browL = `<path d="M62 76 Q75 70 88 76" stroke="#2a2030" stroke-width="2.5" fill="none"/>`;
      browR = `<path d="M136 68 Q150 62 162 70" stroke="#2a2030" stroke-width="2.5" fill="none"/>`;
    } else {
      browL = `<path d="M62 74 Q75 70 88 74" stroke="#2a2030" stroke-width="2.5" fill="none"/>`;
      browR = `<path d="M136 74 Q150 70 162 74" stroke="#2a2030" stroke-width="2.5" fill="none"/>`;
    }

    // Eyes
    function eye(cx, closedEye, winkEye) {
      if (closedEye || winkEye) {
        return `<path d="M${cx - 12} ${eyeY} Q${cx} ${eyeY + 6} ${cx + 12} ${eyeY}" stroke="#2a2030" stroke-width="2.5" fill="none"/>`;
      }
      if (ahe) {
        return `
          <ellipse cx="${cx}" cy="${eyeY}" rx="13" ry="15" fill="#fff" stroke="#2a2030" stroke-width="1.5"/>
          <circle cx="${cx}" cy="${eyeY - 5}" r="5" fill="#5a7ad4"/>
          <circle cx="${cx + 2}" cy="${eyeY - 7}" r="2" fill="#fff"/>
          <path d="M${cx - 6} ${eyeY + 6} Q${cx} ${eyeY + 2} ${cx + 6} ${eyeY + 6}" stroke="#2a2030" stroke-width="1.2" fill="none"/>
        `;
      }
      if (heartEyes) {
        return `
          <ellipse cx="${cx}" cy="${eyeY}" rx="12" ry="${halfLid ? 9 : 13}" fill="#fff" stroke="#2a2030" stroke-width="1.5"/>
          <path d="M${cx} ${eyeY + 5} C${cx - 8} ${eyeY - 2}, ${cx - 4} ${eyeY - 8}, ${cx} ${eyeY - 3} C${cx + 4} ${eyeY - 8}, ${cx + 8} ${eyeY - 2}, ${cx} ${eyeY + 5}" fill="#e85a7a"/>
        `;
      }
      if (spiral) {
        return `
          <ellipse cx="${cx}" cy="${eyeY}" rx="12" ry="13" fill="#fff" stroke="#2a2030" stroke-width="1.5"/>
          <path d="M${cx} ${eyeY} m-6,0 a6,6 0 1,1 12,0 a4,4 0 1,1 -8,0 a2,2 0 1,1 4,0" stroke="#6a4ac4" stroke-width="1.5" fill="none"/>
        `;
      }
      const ry = halfLid ? 8 : surprised ? 15 : 12;
      const pupil = starPupil
        ? `<polygon points="${cx + pupilDx},${eyeY - 6 + pupilDy} ${cx + 2 + pupilDx},${eyeY - 2 + pupilDy} ${cx + 6 + pupilDx},${eyeY - 2 + pupilDy} ${cx + 3 + pupilDx},${eyeY + 1 + pupilDy} ${cx + 4 + pupilDx},${eyeY + 5 + pupilDy} ${cx + pupilDx},${eyeY + 2 + pupilDy} ${cx - 4 + pupilDx},${eyeY + 5 + pupilDy} ${cx - 3 + pupilDx},${eyeY + 1 + pupilDy} ${cx - 6 + pupilDx},${eyeY - 2 + pupilDy} ${cx - 2 + pupilDx},${eyeY - 2 + pupilDy}" fill="#5a7ad4"/>`
        : `<circle cx="${cx + pupilDx}" cy="${eyeY + pupilDy}" r="5" fill="#3a4a8a"/><circle cx="${cx + 2 + pupilDx}" cy="${eyeY - 2 + pupilDy}" r="2" fill="#fff"/>`;
      return `
        <ellipse cx="${cx}" cy="${eyeY}" rx="12" ry="${ry}" fill="#fff" stroke="#2a2030" stroke-width="1.5"/>
        ${pupil}
        ${halfLid ? `<path d="M${cx - 12} ${eyeY - 2} Q${cx} ${eyeY - 8} ${cx + 12} ${eyeY - 2}" fill="${skin}" stroke="none"/>` : ""}
      `;
    }

    const leftClosed = closed;
    const rightClosed = closed || wink;
    const eyes = eye(75, leftClosed, false) + eye(149, rightClosed, wink && !closed);

    // Mouth
    let mouth = "";
    if (ahe || (openMouth && tongue)) {
      mouth = `
        <ellipse cx="112" cy="128" rx="14" ry="12" fill="#c45a6a" stroke="#2a2030" stroke-width="1.5"/>
        <ellipse cx="112" cy="124" rx="10" ry="4" fill="#8a3040"/>
        <path d="M112 128 Q108 140 112 146 Q116 140 112 128" fill="#e87a8a" stroke="#2a2030" stroke-width="1"/>
      `;
    } else if (tongue && !ahe) {
      mouth = `
        <path d="M98 124 Q112 136 126 124" stroke="#2a2030" stroke-width="2" fill="none"/>
        <ellipse cx="112" cy="132" rx="6" ry="5" fill="#e87a8a" stroke="#2a2030" stroke-width="1"/>
      `;
    } else if (openMouth || surprised) {
      mouth = `<ellipse cx="112" cy="128" rx="10" ry="9" fill="#c45a6a" stroke="#2a2030" stroke-width="1.5"/>`;
    } else if (smile || has(tags, "seductive", "teasing", "mischievous", "confident", "satisfied", "naughty")) {
      const teeth = has(tags, "grin", "teeth", "fang", ":d")
        ? `<path d="M100 122 Q112 128 124 122" fill="#fff" stroke="#2a2030" stroke-width="1"/>`
        : "";
      mouth = `
        <path d="M96 122 Q112 138 128 122" stroke="#2a2030" stroke-width="2.2" fill="${has(tags, "grin", ":d") ? "#c45a6a" : "none"}"/>
        ${teeth}
        ${fang ? `<path d="M118 124 L120 130 L122 124" fill="#fff" stroke="#2a2030" stroke-width="0.8"/>` : ""}
      `;
    } else if (pout) {
      mouth = `<ellipse cx="112" cy="126" rx="8" ry="5" fill="#d47a8a" stroke="#2a2030" stroke-width="1.5"/>`;
    } else if (has(tags, "frown", "sad", "upset", "worried", "disappointed", "depressed")) {
      mouth = `<path d="M98 130 Q112 122 126 130" stroke="#2a2030" stroke-width="2" fill="none"/>`;
    } else if (has(tags, "parted lips", "biting lip", "kissy", "pucker")) {
      mouth = `<ellipse cx="112" cy="126" rx="6" ry="4" fill="#c45a6a" stroke="#2a2030" stroke-width="1.5"/>`;
    } else if (has(tags, "clenched", "gritted", "wince", "pain", "endured")) {
      mouth = `<rect x="100" y="124" width="24" height="5" rx="1" fill="#fff" stroke="#2a2030" stroke-width="1.5"/>`;
    } else if (has(tags, ":3", "cat mouth")) {
      mouth = `<path d="M104 126 L112 130 L120 126" stroke="#2a2030" stroke-width="2" fill="none"/>`;
    } else if (has(tags, "dot mouth", "expressionless")) {
      mouth = `<circle cx="112" cy="126" r="2" fill="#2a2030"/>`;
    } else if (has(tags, "wavy mouth")) {
      mouth = `<path d="M98 126 Q104 120 110 126 Q116 132 122 126 Q128 120 132 126" stroke="#2a2030" stroke-width="2" fill="none"/>`;
    } else {
      mouth = `<path d="M100 126 Q112 130 124 126" stroke="#2a2030" stroke-width="2" fill="none"/>`;
    }

    // Blush
    let blushSvg = "";
    if (fullBlush) {
      blushSvg = `<ellipse cx="112" cy="110" rx="48" ry="40" fill="#e87a8a" opacity="0.25"/>`;
    }
    if (blush || fullBlush) {
      blushSvg += `
        <ellipse cx="68" cy="110" rx="12" ry="7" fill="#e87a8a" opacity="0.45"/>
        <ellipse cx="156" cy="110" rx="12" ry="7" fill="#e87a8a" opacity="0.45"/>
        <line x1="58" y1="108" x2="66" y2="112" stroke="#e05a6a" stroke-width="1.2" opacity="0.5"/>
        <line x1="62" y1="105" x2="70" y2="109" stroke="#e05a6a" stroke-width="1.2" opacity="0.5"/>
        <line x1="158" y1="108" x2="166" y2="112" stroke="#e05a6a" stroke-width="1.2" opacity="0.5"/>
        <line x1="154" y1="105" x2="162" y2="109" stroke="#e05a6a" stroke-width="1.2" opacity="0.5"/>
      `;
    }

    // Tears
    let tearSvg = "";
    if (tears) {
      tearSvg = `
        <path d="M66 100 Q62 112 66 120" fill="#7eb8ff" opacity="0.85"/>
        <path d="M158 100 Q162 112 158 120" fill="#7eb8ff" opacity="0.85"/>
      `;
    }

    // Sweat
    let sweatSvg = "";
    if (sweat) {
      sweatSvg = `<path d="M168 70 Q174 80 168 88" fill="#7eb8ff" opacity="0.7"/>`;
    }

    // Nosebleed
    let nbSvg = "";
    if (nosebleed) {
      nbSvg = `<path d="M112 108 L110 120 L114 120 Z" fill="#e04050"/><rect x="110" y="118" width="4" height="10" rx="1" fill="#e04050"/>`;
    }

    // Hair
    let hairSvg;
    if (male) {
      hairSvg = `
        <path d="M70 55 Q112 28 154 55 L158 70 Q112 48 66 70 Z" fill="${hair}"/>
        <path d="M68 58 Q80 50 90 58" fill="${hair}"/>
        <path d="M134 56 Q145 48 156 58" fill="${hair}"/>
      `;
    } else {
      hairSvg = `
        <path d="M55 70 Q60 30 112 25 Q164 30 169 70 L165 140 Q150 100 112 95 Q74 100 59 140 Z" fill="${hair}"/>
        <path d="M70 55 Q112 35 154 55" fill="${hair}" opacity="0.5"/>
      `;
    }

    // Hand covering mouth
    let handSvg = "";
    if (covering) {
      handSvg = `
        <ellipse cx="112" cy="130" rx="22" ry="12" fill="${skin}" stroke="#2a2030" stroke-width="1.2"/>
        <rect x="95" y="124" width="6" height="14" rx="2" fill="${skin}" stroke="#2a2030" stroke-width="0.8"/>
        <rect x="103" y="122" width="6" height="16" rx="2" fill="${skin}" stroke="#2a2030" stroke-width="0.8"/>
        <rect x="111" y="122" width="6" height="16" rx="2" fill="${skin}" stroke="#2a2030" stroke-width="0.8"/>
        <rect x="119" y="124" width="6" height="14" rx="2" fill="${skin}" stroke="#2a2030" stroke-width="0.8"/>
      `;
      mouth = "";
    }

    // Anger vein
    let veinSvg = "";
    if (has(tags, "anger vein")) {
      veinSvg = `<path d="M155 55 L160 60 M160 55 L155 60 M157.5 52 L157.5 63" stroke="#e04050" stroke-width="2"/>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 224 224" role="img" aria-label="${esc(item.label)}">
      <rect width="224" height="224" fill="#1a1d2e"/>
      <!-- shirt collar (always clothed) -->
      <path d="M40 190 Q112 160 184 190 L184 224 L40 224 Z" fill="${shirt}"/>
      <path d="M90 175 L112 195 L134 175" fill="none" stroke="${shirtDark}" stroke-width="3"/>
      <circle cx="112" cy="200" r="3" fill="${shirtDark}"/>
      <!-- neck -->
      <rect x="98" y="148" width="28" height="30" fill="${skin}"/>
      <!-- head -->
      <ellipse cx="112" cy="100" rx="${jawRx}" ry="${jawRy}" fill="${skin}" stroke="#2a2030" stroke-width="1.5"/>
      ${hairSvg}
      ${browL}${browR}
      ${eyes}
      <!-- nose -->
      <path d="M112 100 L108 112 L114 112" stroke="#c4a090" stroke-width="1.5" fill="none"/>
      ${blushSvg}
      ${mouth}
      ${tearSvg}
      ${sweatSvg}
      ${nbSvg}
      ${veinSvg}
      ${handSvg}
    </svg>`;
  }

  /* ----- Shared mannequin pieces ----- */
  function mannequinParts(ox, oy, scale, opts) {
    const o = opts || {};
    const skin = o.skin || "#e8c4a8";
    const shirt = o.shirt || "#6b8cae";
    const pants = o.pants || "#3a4560";
    const hair = o.hair || "#2a2e3a";
    const s = scale || 1;
    const tx = (x) => ox + x * s;
    const ty = (y) => oy + y * s;

    const head = `
      <circle cx="${tx(0)}" cy="${ty(-42)}" r="${18 * s}" fill="${skin}" stroke="#2a2030" stroke-width="1.2"/>
      <ellipse cx="${tx(0)}" cy="${ty(-48)}" rx="${16 * s}" ry="${10 * s}" fill="${hair}"/>
      <circle cx="${tx(-5)}" cy="${ty(-43)}" r="${2 * s}" fill="#2a2030"/>
      <circle cx="${tx(5)}" cy="${ty(-43)}" r="${2 * s}" fill="#2a2030"/>
      <path d="M${tx(-4)} ${ty(-36)} Q${tx(0)} ${ty(-34)} ${tx(4)} ${ty(-36)}" stroke="#2a2030" stroke-width="1" fill="none"/>
    `;
    return { skin, shirt, pants, hair, s, tx, ty, head, ox, oy };
  }

  function clothedTorso(m, armL, armR, legL, legR) {
    // Default standing limbs if not provided
    const body = `
      <!-- torso shirt -->
      <path d="M${m.tx(-14)} ${m.ty(-24)} L${m.tx(-16)} ${m.ty(12)} L${m.tx(16)} ${m.ty(12)} L${m.tx(14)} ${m.ty(-24)} Z" fill="${m.shirt}" stroke="#2a2030" stroke-width="1"/>
      <path d="M${m.tx(-8)} ${m.ty(-24)} L${m.tx(0)} ${m.ty(-14)} L${m.tx(8)} ${m.ty(-24)}" fill="none" stroke="#4a6080" stroke-width="1.5"/>
      ${m.head}
      ${armL || ""}
      ${armR || ""}
      ${legL || ""}
      ${legR || ""}
    `;
    return body;
  }

  function defaultStanding(m, poseHints) {
    const armsUp = poseHints && poseHints.armsUp;
    const handHip = poseHints && poseHints.handHip;
    const peace = poseHints && poseHints.peace;
    const heartHands = poseHints && poseHints.heartHands;
    const armsBehind = poseHints && poseHints.armsBehind;
    const crossed = poseHints && poseHints.crossed;

    let armL, armR;
    if (armsUp) {
      armL = `<path d="M${m.tx(-14)} ${m.ty(-20)} L${m.tx(-28)} ${m.ty(-50)}" stroke="${m.skin}" stroke-width="${7 * m.s}" stroke-linecap="round"/>`;
      armR = `<path d="M${m.tx(14)} ${m.ty(-20)} L${m.tx(28)} ${m.ty(-50)}" stroke="${m.skin}" stroke-width="${7 * m.s}" stroke-linecap="round"/>`;
    } else if (armsBehind) {
      armL = `<path d="M${m.tx(-14)} ${m.ty(-18)} Q${m.tx(-8)} ${m.ty(0)} ${m.tx(-4)} ${m.ty(8)}" stroke="${m.skin}" stroke-width="${6 * m.s}" stroke-linecap="round"/>`;
      armR = `<path d="M${m.tx(14)} ${m.ty(-18)} Q${m.tx(8)} ${m.ty(0)} ${m.tx(4)} ${m.ty(8)}" stroke="${m.skin}" stroke-width="${6 * m.s}" stroke-linecap="round"/>`;
    } else if (crossed) {
      armL = `<path d="M${m.tx(-14)} ${m.ty(-18)} L${m.tx(10)} ${m.ty(0)}" stroke="${m.skin}" stroke-width="${7 * m.s}" stroke-linecap="round"/>`;
      armR = `<path d="M${m.tx(14)} ${m.ty(-18)} L${m.tx(-10)} ${m.ty(0)}" stroke="${m.skin}" stroke-width="${7 * m.s}" stroke-linecap="round"/>`;
    } else if (handHip) {
      armL = `<path d="M${m.tx(-14)} ${m.ty(-18)} L${m.tx(-22)} ${m.ty(8)}" stroke="${m.skin}" stroke-width="${7 * m.s}" stroke-linecap="round"/>`;
      armR = `<path d="M${m.tx(14)} ${m.ty(-18)} L${m.tx(20)} ${m.ty(5)}" stroke="${m.skin}" stroke-width="${7 * m.s}" stroke-linecap="round"/><circle cx="${m.tx(20)}" cy="${m.ty(8)}" r="${4 * m.s}" fill="${m.skin}"/>`;
    } else if (peace) {
      armL = `<path d="M${m.tx(-14)} ${m.ty(-18)} L${m.tx(-20)} ${m.ty(10)}" stroke="${m.skin}" stroke-width="${7 * m.s}" stroke-linecap="round"/>`;
      armR = `<path d="M${m.tx(14)} ${m.ty(-18)} L${m.tx(26)} ${m.ty(-35)}" stroke="${m.skin}" stroke-width="${7 * m.s}" stroke-linecap="round"/>
        <path d="M${m.tx(26)} ${m.ty(-38)} L${m.tx(24)} ${m.ty(-48)}" stroke="${m.skin}" stroke-width="${2.5 * m.s}" stroke-linecap="round"/>
        <path d="M${m.tx(26)} ${m.ty(-38)} L${m.tx(32)} ${m.ty(-48)}" stroke="${m.skin}" stroke-width="${2.5 * m.s}" stroke-linecap="round"/>`;
    } else if (heartHands) {
      armL = `<path d="M${m.tx(-14)} ${m.ty(-18)} L${m.tx(-8)} ${m.ty(-5)}" stroke="${m.skin}" stroke-width="${6 * m.s}" stroke-linecap="round"/>`;
      armR = `<path d="M${m.tx(14)} ${m.ty(-18)} L${m.tx(8)} ${m.ty(-5)}" stroke="${m.skin}" stroke-width="${6 * m.s}" stroke-linecap="round"/>
        <path d="M${m.tx(-6)} ${m.ty(-8)} C${m.tx(-10)} ${m.ty(-16)}, ${m.tx(0)} ${m.ty(-18)}, ${m.tx(0)} ${m.ty(-10)} C${m.tx(0)} ${m.ty(-18)}, ${m.tx(10)} ${m.ty(-16)}, ${m.tx(6)} ${m.ty(-8)} L${m.tx(0)} ${m.ty(0)} Z" fill="#e85a7a" opacity="0.85"/>`;
    } else {
      armL = `<path d="M${m.tx(-14)} ${m.ty(-18)} L${m.tx(-20)} ${m.ty(12)}" stroke="${m.skin}" stroke-width="${7 * m.s}" stroke-linecap="round"/>`;
      armR = `<path d="M${m.tx(14)} ${m.ty(-18)} L${m.tx(20)} ${m.ty(12)}" stroke="${m.skin}" stroke-width="${7 * m.s}" stroke-linecap="round"/>`;
    }

    const legL = `
      <path d="M${m.tx(-8)} ${m.ty(12)} L${m.tx(-12)} ${m.ty(48)}" stroke="${m.pants}" stroke-width="${10 * m.s}" stroke-linecap="round"/>
      <ellipse cx="${m.tx(-12)}" cy="${m.ty(52)}" rx="${7 * m.s}" ry="${3 * m.s}" fill="#2a3040"/>
    `;
    const legR = `
      <path d="M${m.tx(8)} ${m.ty(12)} L${m.tx(12)} ${m.ty(48)}" stroke="${m.pants}" stroke-width="${10 * m.s}" stroke-linecap="round"/>
      <ellipse cx="${m.tx(12)}" cy="${m.ty(52)}" rx="${7 * m.s}" ry="${3 * m.s}" fill="#2a3040"/>
    `;
    // pants waist
    const pantsTop = `<rect x="${m.tx(-16)}" y="${m.ty(8)}" width="${32 * m.s}" height="${8 * m.s}" rx="2" fill="${m.pants}"/>`;

    return pantsTop + clothedTorso(m, armL, armR, legL, legR);
  }

  /* ----- C Solo poses ----- */
  function renderSolo(item) {
    const tags = ((item.tags || "") + " " + (item.label || "")).toLowerCase();
    const bg = `<rect width="224" height="224" fill="#1a1d2e"/>`;
    const floor = `<ellipse cx="112" cy="200" rx="70" ry="10" fill="#12151f" opacity="0.6"/>`;

    let pose = "standing";
    if (has(tags, "seiza", "sitting on heels")) pose = "seiza";
    else if (has(tags, "squat", "crouch")) pose = "squat";
    else if (has(tags, "kneel", "on one knee", "dogeza")) pose = "kneel";
    else if (has(tags, "all fours", "on all fours", "crawling", "downward dog", "top-down bottom-up")) pose = "allfours";
    else if (has(tags, "bent over", "bent over desk")) pose = "bent";
    else if (has(tags, "lying on stomach", "on stomach", "prone", "the pose", "faceplant", "prostration")) pose = "stomach";
    else if (has(tags, "lying on side", "on side", "fetal")) pose = "side";
    else if (has(tags, "lying", "on back", "spread eagle", "legs up")) pose = "back";
    else if (has(tags, "sitting", "lotus", "wariza", "indian style", "butterfly sitting", "reclining", "straddling chair", "on chair", "on bed", "on floor", "on desk", "on toilet", "window seat")) pose = "sit";
    else if (has(tags, "from behind", "looking back", "ass focus")) pose = "lookback";

    const hints = {
      armsUp: has(tags, "arms up", "arms above", "arms behind head", "hands behind head"),
      handHip: has(tags, "hand on hip", "hands on hips"),
      peace: has(tags, "peace", " v", "v,", "double v", "gyaru v", "victory"),
      heartHands: has(tags, "heart hands", "heart arms", "finger heart"),
      armsBehind: has(tags, "arms behind back", "hands behind back"),
      crossed: has(tags, "crossed arms"),
    };

    const m = mannequinParts(112, 120, 1.15, {
      shirt: has(tags, "dress", "skirt", "maid") ? "#9b6a9e" : "#6b8cae",
      pants: has(tags, "dress", "skirt", "maid") ? "#9b6a9e" : "#3a4560",
    });

    let figure = "";
    if (pose === "sit") {
      const mm = mannequinParts(112, 130, 1.1, m);
      figure = `
        <rect x="70" y="155" width="84" height="12" rx="3" fill="#2a3048"/>
        <path d="M${mm.tx(-14)} ${mm.ty(-24)} L${mm.tx(-16)} ${mm.ty(8)} L${mm.tx(16)} ${mm.ty(8)} L${mm.tx(14)} ${mm.ty(-24)} Z" fill="${mm.shirt}" stroke="#2a2030" stroke-width="1"/>
        ${mm.head}
        <path d="M${mm.tx(-14)} ${mm.ty(-18)} L${mm.tx(-22)} ${mm.ty(5)}" stroke="${mm.skin}" stroke-width="7" stroke-linecap="round"/>
        <path d="M${mm.tx(14)} ${mm.ty(-18)} L${mm.tx(22)} ${mm.ty(5)}" stroke="${mm.skin}" stroke-width="7" stroke-linecap="round"/>
        <path d="M${mm.tx(-10)} ${mm.ty(8)} L${mm.tx(-18)} ${mm.ty(28)} L${mm.tx(0)} ${mm.ty(22)}" stroke="${mm.pants}" stroke-width="9" stroke-linecap="round" fill="none"/>
        <path d="M${mm.tx(10)} ${mm.ty(8)} L${mm.tx(18)} ${mm.ty(28)} L${mm.tx(0)} ${mm.ty(22)}" stroke="${mm.pants}" stroke-width="9" stroke-linecap="round" fill="none"/>
        <rect x="${mm.tx(-16)}" y="${mm.ty(4)}" width="32" height="8" rx="2" fill="${mm.pants}"/>
      `;
    } else if (pose === "seiza") {
      const mm = mannequinParts(112, 140, 1.1, m);
      figure = `
        <path d="M${mm.tx(-14)} ${mm.ty(-24)} L${mm.tx(-16)} ${mm.ty(10)} L${mm.tx(16)} ${mm.ty(10)} L${mm.tx(14)} ${mm.ty(-24)} Z" fill="${mm.shirt}"/>
        ${mm.head}
        <path d="M${mm.tx(-14)} ${mm.ty(-18)} L${mm.tx(-18)} ${mm.ty(8)}" stroke="${mm.skin}" stroke-width="7" stroke-linecap="round"/>
        <path d="M${mm.tx(14)} ${mm.ty(-18)} L${mm.tx(18)} ${mm.ty(8)}" stroke="${mm.skin}" stroke-width="7" stroke-linecap="round"/>
        <ellipse cx="${mm.tx(-10)}" cy="${mm.ty(28)}" rx="14" ry="8" fill="${mm.pants}"/>
        <ellipse cx="${mm.tx(10)}" cy="${mm.ty(28)}" rx="14" ry="8" fill="${mm.pants}"/>
        <rect x="${mm.tx(-16)}" y="${mm.ty(6)}" width="32" height="10" fill="${mm.pants}"/>
      `;
    } else if (pose === "squat") {
      const mm = mannequinParts(112, 145, 1.05, m);
      figure = `
        <path d="M${mm.tx(-14)} ${mm.ty(-24)} L${mm.tx(-18)} ${mm.ty(5)} L${mm.tx(18)} ${mm.ty(5)} L${mm.tx(14)} ${mm.ty(-24)} Z" fill="${mm.shirt}"/>
        ${mm.head}
        <path d="M${mm.tx(-14)} ${mm.ty(-16)} L${mm.tx(-28)} ${mm.ty(5)}" stroke="${mm.skin}" stroke-width="7" stroke-linecap="round"/>
        <path d="M${mm.tx(14)} ${mm.ty(-16)} L${mm.tx(28)} ${mm.ty(5)}" stroke="${mm.skin}" stroke-width="7" stroke-linecap="round"/>
        <path d="M${mm.tx(-10)} ${mm.ty(5)} L${mm.tx(-22)} ${mm.ty(30)} L${mm.tx(-8)} ${mm.ty(35)}" stroke="${mm.pants}" stroke-width="9" stroke-linecap="round" fill="none"/>
        <path d="M${mm.tx(10)} ${mm.ty(5)} L${mm.tx(22)} ${mm.ty(30)} L${mm.tx(8)} ${mm.ty(35)}" stroke="${mm.pants}" stroke-width="9" stroke-linecap="round" fill="none"/>
      `;
    } else if (pose === "kneel") {
      const mm = mannequinParts(112, 135, 1.1, m);
      figure = `
        <path d="M${mm.tx(-14)} ${mm.ty(-24)} L${mm.tx(-16)} ${mm.ty(8)} L${mm.tx(16)} ${mm.ty(8)} L${mm.tx(14)} ${mm.ty(-24)} Z" fill="${mm.shirt}"/>
        ${mm.head}
        <path d="M${mm.tx(-14)} ${mm.ty(-18)} L${mm.tx(-20)} ${mm.ty(5)}" stroke="${mm.skin}" stroke-width="7" stroke-linecap="round"/>
        <path d="M${mm.tx(14)} ${mm.ty(-18)} L${mm.tx(20)} ${mm.ty(5)}" stroke="${mm.skin}" stroke-width="7" stroke-linecap="round"/>
        <path d="M${mm.tx(-8)} ${mm.ty(8)} L${mm.tx(-10)} ${mm.ty(35)}" stroke="${mm.pants}" stroke-width="10" stroke-linecap="round"/>
        <path d="M${mm.tx(8)} ${mm.ty(8)} L${mm.tx(18)} ${mm.ty(25)} L${mm.tx(10)} ${mm.ty(40)}" stroke="${mm.pants}" stroke-width="10" stroke-linecap="round" fill="none"/>
        <ellipse cx="${mm.tx(-10)}" cy="${mm.ty(40)}" rx="10" ry="4" fill="#2a3040"/>
      `;
    } else if (pose === "allfours") {
      // yoga-like clothed all fours
      figure = `
        <ellipse cx="112" cy="130" rx="40" ry="14" fill="#6b8cae" stroke="#2a2030" stroke-width="1"/>
        <circle cx="70" cy="115" r="16" fill="#e8c4a8" stroke="#2a2030" stroke-width="1"/>
        <ellipse cx="68" cy="108" rx="14" ry="8" fill="#2a2e3a"/>
        <circle cx="66" cy="113" r="2" fill="#2a2030"/>
        <circle cx="74" cy="113" r="2" fill="#2a2030"/>
        <path d="M80 130 L55 155" stroke="#3a4560" stroke-width="10" stroke-linecap="round"/>
        <path d="M90 138 L75 165" stroke="#3a4560" stroke-width="10" stroke-linecap="round"/>
        <path d="M140 130 L160 155" stroke="#3a4560" stroke-width="10" stroke-linecap="round"/>
        <path d="M145 138 L165 160" stroke="#3a4560" stroke-width="10" stroke-linecap="round"/>
        <path d="M80 122 L55 125" stroke="#e8c4a8" stroke-width="7" stroke-linecap="round"/>
        <path d="M85 128 L60 140" stroke="#e8c4a8" stroke-width="7" stroke-linecap="round"/>
        <text x="112" y="195" text-anchor="middle" fill="#6b728a" font-size="10">요가·스트레칭 (착의)</text>
      `;
    } else if (pose === "bent") {
      // toe-touch stretch
      figure = `
        <path d="M100 70 L95 120 L130 155" stroke="#6b8cae" stroke-width="18" stroke-linecap="round" fill="none"/>
        <circle cx="100" cy="60" r="16" fill="#e8c4a8" stroke="#2a2030" stroke-width="1"/>
        <ellipse cx="98" cy="52" rx="14" ry="8" fill="#2a2e3a"/>
        <path d="M95 120 L90 175" stroke="#3a4560" stroke-width="12" stroke-linecap="round"/>
        <path d="M105 120 L130 170" stroke="#3a4560" stroke-width="12" stroke-linecap="round"/>
        <path d="M130 155 L145 170" stroke="#e8c4a8" stroke-width="6" stroke-linecap="round"/>
        <text x="112" y="200" text-anchor="middle" fill="#6b728a" font-size="10">스트레칭 (착의)</text>
      `;
    } else if (pose === "back") {
      figure = `
        <ellipse cx="112" cy="140" rx="55" ry="18" fill="#3a4560"/>
        <ellipse cx="112" cy="125" rx="50" ry="22" fill="#6b8cae" stroke="#2a2030" stroke-width="1"/>
        <circle cx="55" cy="120" r="15" fill="#e8c4a8" stroke="#2a2030" stroke-width="1"/>
        <ellipse cx="55" cy="112" rx="13" ry="8" fill="#2a2e3a"/>
        <path d="M70 115 L40 100" stroke="#e8c4a8" stroke-width="6" stroke-linecap="round"/>
        <path d="M150 130 L175 145" stroke="#3a4560" stroke-width="10" stroke-linecap="round"/>
        <path d="M145 135 L170 155" stroke="#3a4560" stroke-width="10" stroke-linecap="round"/>
      `;
    } else if (pose === "stomach") {
      figure = `
        <ellipse cx="112" cy="135" rx="55" ry="16" fill="#3a4560"/>
        <ellipse cx="112" cy="125" rx="50" ry="18" fill="#6b8cae"/>
        <circle cx="55" cy="120" r="15" fill="#e8c4a8"/>
        <ellipse cx="55" cy="112" rx="13" ry="8" fill="#2a2e3a"/>
        <path d="M60 130 L40 145" stroke="#e8c4a8" stroke-width="6" stroke-linecap="round"/>
        <path d="M160 130 L175 115" stroke="#3a4560" stroke-width="8" stroke-linecap="round"/>
        <path d="M155 135 L180 125" stroke="#3a4560" stroke-width="8" stroke-linecap="round"/>
      `;
    } else if (pose === "side") {
      figure = `
        <ellipse cx="120" cy="140" rx="50" ry="16" fill="#3a4560" transform="rotate(-10 120 140)"/>
        <ellipse cx="115" cy="128" rx="45" ry="18" fill="#6b8cae" transform="rotate(-10 115 128)"/>
        <circle cx="65" cy="115" r="15" fill="#e8c4a8"/>
        <ellipse cx="65" cy="107" rx="13" ry="8" fill="#2a2e3a"/>
        <path d="M90 120 L75 100" stroke="#e8c4a8" stroke-width="6" stroke-linecap="round"/>
      `;
    } else if (pose === "lookback") {
      const mm = mannequinParts(112, 120, 1.15, m);
      figure = defaultStanding(mm, hints);
      // overdraw head looking back - simple cheek
      figure += `<circle cx="125" cy="72" r="4" fill="#e8c4a8" opacity="0.5"/>`;
    } else {
      // standing + gesture hints
      figure = defaultStanding(m, hints);
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 224 224" role="img" aria-label="${esc(item.label)}">${bg}${floor}${figure}</svg>`;
  }

  /* ----- D Duo ----- */
  function renderDuo(item) {
    const tags = ((item.tags || "") + " " + (item.label || "")).toLowerCase();
    const bg = `<rect width="224" height="224" fill="#1a1d2e"/>`;
    const floor = `<ellipse cx="112" cy="205" rx="80" ry="10" fill="#12151f" opacity="0.55"/>`;

    let mode = "embrace"; // default clothed embrace for explicit tags
    if (has(tags, "holding hands", "interlocked fingers", "high five", "fist bump", "pinky")) mode = "hands";
    else if (has(tags, "princess carry", "bridal carry", "carrying", "piggyback", "shoulder carry", "fireman")) mode = "carry";
    else if (has(tags, "hug from behind", "back hug")) mode = "backhug";
    else if (has(tags, "kiss", "necking", "noses touching", "forehead", "cheek-to-cheek")) mode = "kiss";
    else if (has(tags, "sitting on lap", "lap pillow", "mimikaki")) mode = "lap";
    else if (has(tags, "against wall", "pinned")) mode = "wall";
    else if (has(tags, "hug", "embrac", "glomp", "cuddling", "arm around", "waist hug")) mode = "hug";
    else if (has(tags, "back-to-back")) mode = "backtoback";
    // explicit sex tags → clothed face-to-face seated/standing embrace
    else if (
      has(
        tags,
        "sex",
        "missionary",
        "cowgirl",
        "doggystyle",
        "fellatio",
        "blowjob",
        "handjob",
        "paizuri",
        "anal",
        "penetration",
        "orgasm",
        "fingering",
        "cunnilingus",
        "69",
        "spooning",
        "straddle",
        "mating",
        "nelson",
        "congress",
        "footjob",
        "grinding"
      )
    ) {
      mode = "embrace";
    }

    const a = mannequinParts(80, 125, 0.95, { shirt: "#7a6aaf", pants: "#3a4560", hair: "#3d2a4a", skin: "#f0c9b0" });
    const b = mannequinParts(145, 120, 1.0, { shirt: "#4a7aaa", pants: "#2a3548", hair: "#2a2e3a", skin: "#e8c4a8" });

    function miniStand(m, lean) {
      const lx = lean || 0;
      return `
        <path d="M${m.tx(-12 + lx)} ${m.ty(-22)} L${m.tx(-14 + lx)} ${m.ty(10)} L${m.tx(14 + lx)} ${m.ty(10)} L${m.tx(12 + lx)} ${m.ty(-22)} Z" fill="${m.shirt}"/>
        <circle cx="${m.tx(0 + lx)}" cy="${m.ty(-38)}" r="${15 * m.s}" fill="${m.skin}" stroke="#2a2030" stroke-width="1"/>
        <ellipse cx="${m.tx(0 + lx)}" cy="${m.ty(-44)}" rx="${13 * m.s}" ry="${8 * m.s}" fill="${m.hair}"/>
        <circle cx="${m.tx(-4 + lx)}" cy="${m.ty(-39)}" r="1.8" fill="#2a2030"/>
        <circle cx="${m.tx(4 + lx)}" cy="${m.ty(-39)}" r="1.8" fill="#2a2030"/>
        <path d="M${m.tx(-12 + lx)} ${m.ty(-16)} L${m.tx(-18 + lx)} ${m.ty(8)}" stroke="${m.skin}" stroke-width="6" stroke-linecap="round"/>
        <path d="M${m.tx(12 + lx)} ${m.ty(-16)} L${m.tx(18 + lx)} ${m.ty(8)}" stroke="${m.skin}" stroke-width="6" stroke-linecap="round"/>
        <path d="M${m.tx(-7 + lx)} ${m.ty(10)} L${m.tx(-10 + lx)} ${m.ty(42)}" stroke="${m.pants}" stroke-width="9" stroke-linecap="round"/>
        <path d="M${m.tx(7 + lx)} ${m.ty(10)} L${m.tx(10 + lx)} ${m.ty(42)}" stroke="${m.pants}" stroke-width="9" stroke-linecap="round"/>
        <rect x="${m.tx(-14 + lx)}" y="${m.ty(6)}" width="${28 * m.s}" height="7" fill="${m.pants}"/>
      `;
    }

    let figures = "";
    if (mode === "hands") {
      figures = miniStand(a, 5) + miniStand(b, -5);
      figures += `<path d="M95 130 L130 128" stroke="#e8c4a8" stroke-width="5" stroke-linecap="round"/>`;
    } else if (mode === "kiss") {
      figures = miniStand(a, 12) + miniStand(b, -12);
      figures += `<circle cx="112" cy="85" r="5" fill="#e85a7a" opacity="0.7"/>`;
    } else if (mode === "hug" || mode === "embrace") {
      figures = miniStand(a, 18) + miniStand(b, -18);
      figures += `
        <path d="M95 115 Q112 125 130 112" stroke="#e8c4a8" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M98 125 Q112 135 128 122" stroke="#e8c4a8" stroke-width="5" stroke-linecap="round" fill="none"/>
      `;
      if (mode === "embrace") {
        figures += `<text x="112" y="200" text-anchor="middle" fill="#6b728a" font-size="9">착의 포옹 (SFW 대체)</text>`;
      }
    } else if (mode === "backhug") {
      figures = miniStand(b, 0);
      const a2 = mannequinParts(105, 125, 0.9, a);
      figures += miniStand(a2, 0);
      figures += `<path d="M85 120 L125 118" stroke="#f0c9b0" stroke-width="5" stroke-linecap="round"/>`;
    } else if (mode === "carry") {
      figures = miniStand(b, 0);
      figures += `
        <path d="M70 95 L65 120 L100 118 L105 95 Z" fill="#7a6aaf"/>
        <circle cx="88" cy="82" r="13" fill="#f0c9b0"/>
        <ellipse cx="88" cy="76" rx="11" ry="7" fill="#3d2a4a"/>
        <path d="M70 115 L55 130" stroke="#3a4560" stroke-width="8" stroke-linecap="round"/>
        <path d="M95 115 L110 128" stroke="#3a4560" stroke-width="8" stroke-linecap="round"/>
        <path d="M120 110 L100 100" stroke="#e8c4a8" stroke-width="5" stroke-linecap="round"/>
      `;
    } else if (mode === "lap") {
      figures = `
        <rect x="95" y="155" width="70" height="14" rx="3" fill="#2a3048"/>
        ${miniStand(mannequinParts(130, 145, 0.95, b), 0)}
        <path d="M70 110 L68 145 L105 145 L100 110 Z" fill="#7a6aaf"/>
        <circle cx="85" cy="95" r="14" fill="#f0c9b0"/>
        <ellipse cx="85" cy="88" rx="12" ry="7" fill="#3d2a4a"/>
        <path d="M75 145 L70 165" stroke="#3a4560" stroke-width="8" stroke-linecap="round"/>
        <path d="M95 145 L100 160" stroke="#3a4560" stroke-width="8" stroke-linecap="round"/>
      `;
    } else if (mode === "wall") {
      figures = `<rect x="20" y="40" width="14" height="160" fill="#2a3048"/>`;
      figures += miniStand(a, -5) + miniStand(b, -15);
      figures += `<text x="140" y="200" text-anchor="middle" fill="#6b728a" font-size="9">대화 거리 (착의)</text>`;
    } else if (mode === "backtoback") {
      figures = miniStand(a, -8) + miniStand(b, 8);
    } else {
      figures = miniStand(a, 10) + miniStand(b, -10);
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 224 224" role="img" aria-label="${esc(item.label)}">${bg}${floor}${figures}</svg>`;
  }

  /* ----- E Group ----- */
  function renderGroup(item) {
    const tags = ((item.tags || "") + " " + (item.label || "")).toLowerCase();
    const bg = `<rect width="224" height="224" fill="#1a1d2e"/>`;
    const floor = `<ellipse cx="112" cy="205" rx="90" ry="10" fill="#12151f" opacity="0.55"/>`;

    let layout = "huddle";
    if (has(tags, "line", "lineup", "train", "waiting")) layout = "line";
    else if (has(tags, "circle", "surrounded", "flanked", "sandwich")) layout = "circle";
    else if (has(tags, "group hug", "embraced from both")) layout = "huddle";

    const colors = [
      { shirt: "#7a6aaf", pants: "#3a4560", hair: "#3d2a4a", skin: "#f0c9b0" },
      { shirt: "#4a7aaa", pants: "#2a3548", hair: "#2a2e3a", skin: "#e8c4a8" },
      { shirt: "#5a9a7a", pants: "#2a4038", hair: "#3a2a20", skin: "#ecc0a0" },
    ];

    function person(x, y, sc, c) {
      const m = mannequinParts(x, y, sc, c);
      return `
        <path d="M${m.tx(-11)} ${m.ty(-20)} L${m.tx(-13)} ${m.ty(8)} L${m.tx(13)} ${m.ty(8)} L${m.tx(11)} ${m.ty(-20)} Z" fill="${m.shirt}"/>
        <circle cx="${m.tx(0)}" cy="${m.ty(-35)}" r="${13 * m.s}" fill="${m.skin}" stroke="#2a2030" stroke-width="1"/>
        <ellipse cx="${m.tx(0)}" cy="${m.ty(-40)}" rx="${11 * m.s}" ry="${7 * m.s}" fill="${m.hair}"/>
        <circle cx="${m.tx(-3)}" cy="${m.ty(-36)}" r="1.5" fill="#2a2030"/>
        <circle cx="${m.tx(3)}" cy="${m.ty(-36)}" r="1.5" fill="#2a2030"/>
        <path d="M${m.tx(-11)} ${m.ty(-14)} L${m.tx(-16)} ${m.ty(5)}" stroke="${m.skin}" stroke-width="5" stroke-linecap="round"/>
        <path d="M${m.tx(11)} ${m.ty(-14)} L${m.tx(16)} ${m.ty(5)}" stroke="${m.skin}" stroke-width="5" stroke-linecap="round"/>
        <path d="M${m.tx(-6)} ${m.ty(8)} L${m.tx(-8)} ${m.ty(35)}" stroke="${m.pants}" stroke-width="8" stroke-linecap="round"/>
        <path d="M${m.tx(6)} ${m.ty(8)} L${m.tx(8)} ${m.ty(35)}" stroke="${m.pants}" stroke-width="8" stroke-linecap="round"/>
        <rect x="${m.tx(-13)}" y="${m.ty(4)}" width="${26 * m.s}" height="6" fill="${m.pants}"/>
      `;
    }

    let figures = "";
    if (layout === "line") {
      figures = person(50, 130, 0.85, colors[0]) + person(112, 130, 0.85, colors[1]) + person(174, 130, 0.85, colors[2]);
    } else if (layout === "circle") {
      figures = person(112, 100, 0.8, colors[0]) + person(70, 145, 0.8, colors[1]) + person(154, 145, 0.8, colors[2]);
    } else {
      // huddle
      figures = person(112, 115, 0.9, colors[1]) + person(75, 135, 0.85, colors[0]) + person(150, 135, 0.85, colors[2]);
      figures += `<path d="M90 125 Q112 140 135 125" stroke="#e8c4a8" stroke-width="4" fill="none" opacity="0.6"/>`;
    }
    figures += `<text x="112" y="210" text-anchor="middle" fill="#6b728a" font-size="9">그룹 · 전원 착의 SFW</text>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 224 224" role="img" aria-label="${esc(item.label)}">${bg}${floor}${figures}</svg>`;
  }

  /* ---------- UI ---------- */
  function buildTabs() {
    const nav = $("#tabs");
    nav.innerHTML = "";
    DATA.categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tab" + (cat.letter === activeLetter ? " active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", cat.letter === activeLetter ? "true" : "false");
      btn.dataset.letter = cat.letter;
      btn.innerHTML = `${cat.letter} ${esc(cat.titleKo)} <span class="count">(${cat.count})</span>`;
      btn.addEventListener("click", () => {
        activeLetter = cat.letter;
        buildTabs();
        renderGrid();
      });
      nav.appendChild(btn);
    });
  }

  function currentCategory() {
    return DATA.categories.find((c) => c.letter === activeLetter);
  }

  function filteredItems() {
    const cat = currentCategory();
    if (!cat) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return cat.items;
    return cat.items.filter((it) => {
      const hay = `${it.label} ${it.tags} ${it.note || ""} ${it.id}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function renderGrid() {
    const grid = $("#grid");
    const empty = $("#empty");
    const items = filteredItems();
    const cat = currentCategory();
    $("#result-count").textContent = `${items.length} / ${cat ? cat.count : 0}개`;

    if (!items.length) {
      grid.innerHTML = "";
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");

    const frag = document.createDocumentFragment();
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";
      card.setAttribute("role", "listitem");
      card.innerHTML = `
        <div class="card-illust">${renderIllustration(item, activeLetter)}</div>
        <div class="card-body">
          <div class="card-id">${esc(item.id)}</div>
          <h2 class="card-label">${esc(item.label)}</h2>
          <p class="card-tags">${esc(item.tags)}</p>
          <p class="card-note">${esc(item.note || "")}</p>
          <button type="button" class="btn btn-copy" data-tags="${esc(item.tags)}">복사</button>
        </div>
      `;
      frag.appendChild(card);
    });
    grid.innerHTML = "";
    grid.appendChild(frag);

    grid.querySelectorAll(".btn-copy").forEach((btn) => {
      btn.addEventListener("click", () => copyText(btn.getAttribute("data-tags"), btn));
    });
  }

  async function loadImageManifest() {
    try {
      const res = await fetch("examples/manifest.json", { cache: "no-store" });
      if (!res.ok) { window.__POSE_IMG_OK__ = new Set(); return; }
      const list = await res.json();
      window.__POSE_IMG_OK__ = new Set(list);
    } catch {
      window.__POSE_IMG_OK__ = new Set();
    }
  }

  function bootApp() {
    $("#total-count").textContent = String(DATA.total);
    buildTabs();
    renderGrid();
    $("#search").addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderGrid();
    });
  }

  /* ---------- Init ---------- */
  async function main() {
    const entered = initAgeGate();
    try {
      const res = await fetch("data.json");
      if (!res.ok) throw new Error("data.json 로드 실패");
      DATA = await res.json();
    } catch (err) {
      console.error(err);
      showToast("데이터 로드 실패");
      return;
    }
    await loadImageManifest();
    if (entered) bootApp();
  }

  main();

  // Expose for debugging / verification
  window.renderIllustration = renderIllustration;
  window.__POSE_DICT__ = { get DATA() { return DATA; } };
})();

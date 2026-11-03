// Gerador de avatares em SVG, totalmente personalizáveis.
(function () {
  const OPTIONS = {
    skin: ["#ffdbb4", "#f1c27d", "#e0ac69", "#c68642", "#8d5524", "#5c3a21", "#9fe3a4", "#a9c6ff"],
    hair: ["none", "short", "spiky", "long", "bob", "curly", "bun", "mohawk"],
    hairColor: ["#2c1b10", "#5a3825", "#b5651d", "#e8c170", "#d9534f", "#8e5cd9", "#2f80ed", "#f2f2f2"],
    eyes: ["dots", "happy", "big", "wink", "sleepy", "stars"],
    mouth: ["smile", "grin", "o", "flat", "tongue", "smirk"],
    acc: ["none", "glasses", "shades", "crown", "party", "cap", "bow", "headphones"],
    shirt: ["#ef476f", "#f78c6b", "#ffd166", "#06d6a0", "#118ab2", "#3a5bd9", "#8338ec", "#222831"],
    bg: ["#ffe5ec", "#fff1c1", "#d8f3dc", "#caf0f8", "#e0d7ff", "#ffd6a5", "#bde0fe", "#f1f1f1"]
  };

  const CATEGORIES = [
    { key: "skin", label: "Pele" },
    { key: "hair", label: "Cabelo" },
    { key: "hairColor", label: "Cor cabelo" },
    { key: "eyes", label: "Olhos" },
    { key: "mouth", label: "Boca" },
    { key: "acc", label: "Acessório" },
    { key: "shirt", label: "Camisola" },
    { key: "bg", label: "Fundo" }
  ];

  let uid = 0;

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function random() {
    const a = {};
    for (const k in OPTIONS) a[k] = pick(OPTIONS[k]);
    if (Math.random() < 0.5) a.acc = "none";
    return a;
  }

  function hairBack(style, c) {
    if (style === "long") return `<path d="M23 46 Q21 12 50 12 Q79 12 77 46 L79 84 L21 84Z" fill="${c}"/>`;
    if (style === "bob") return `<path d="M23 46 Q21 12 50 12 Q79 12 77 46 L77 64 Q72 68 66 64 L34 64 Q28 68 23 64Z" fill="${c}"/>`;
    return "";
  }

  function hairFront(style, c) {
    switch (style) {
      case "short":
        return `<path d="M27 43 Q25 15 50 14 Q75 15 73 43 Q70 27 50 26 Q30 27 27 43Z" fill="${c}"/>`;
      case "spiky":
        return `<path d="M27 42 L29 22 L36 28 L39 13 L46 24 L51 9 L57 23 L64 13 L66 27 L72 21 L73 42 Q69 28 50 27 Q31 28 27 42Z" fill="${c}"/>`;
      case "long":
      case "bob":
        return `<path d="M27 42 Q27 15 50 15 Q73 15 73 42 Q66 28 52 27 Q48 33 40 30 Q32 32 27 42Z" fill="${c}"/>`;
      case "curly":
        return [[29, 36], [31, 25], [39, 18], [50, 15], [61, 18], [69, 25], [71, 36]]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}"/>`).join("");
      case "bun":
        return `<circle cx="50" cy="11" r="9" fill="${c}"/><path d="M27 43 Q25 15 50 15 Q75 15 73 43 Q70 27 50 26 Q30 27 27 43Z" fill="${c}"/>`;
      case "mohawk":
        return `<path d="M43 30 Q41 14 44 4 Q50 0 56 4 Q59 14 57 30Z" fill="${c}"/>`;
      default:
        return "";
    }
  }

  function eyes(style) {
    const ink = "#1d1d1f";
    switch (style) {
      case "happy":
        return `<path d="M36 47 Q41 41 46 47 M54 47 Q59 41 64 47" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      case "big":
        return `<circle cx="41" cy="45" r="5.5" fill="#fff" stroke="${ink}" stroke-width="1.2"/><circle cx="59" cy="45" r="5.5" fill="#fff" stroke="${ink}" stroke-width="1.2"/>
                <circle cx="42" cy="46" r="2.8" fill="${ink}"/><circle cx="60" cy="46" r="2.8" fill="${ink}"/>
                <circle cx="43" cy="45" r="0.9" fill="#fff"/><circle cx="61" cy="45" r="0.9" fill="#fff"/>`;
      case "wink":
        return `<circle cx="41" cy="45" r="2.8" fill="${ink}"/><path d="M54 46 Q59 42 64 46" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      case "sleepy":
        return `<path d="M36 45 Q41 49 46 45 M54 45 Q59 49 64 45" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      case "stars":
        return [41, 59].map(x =>
          `<path transform="translate(${x} 45)" d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5Z" fill="#f5b700" stroke="#b07f00" stroke-width="0.6"/>`).join("");
      default:
        return `<circle cx="41" cy="45" r="3" fill="${ink}"/><circle cx="59" cy="45" r="3" fill="${ink}"/>`;
    }
  }

  function mouth(style) {
    const ink = "#1d1d1f";
    switch (style) {
      case "grin":
        return `<path d="M40 56 Q50 70 60 56Z" fill="#7a1f2b" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round"/><path d="M42 57 L58 57 L57 59 L43 59Z" fill="#fff"/>`;
      case "o":
        return `<ellipse cx="50" cy="60" rx="4" ry="5" fill="#7a1f2b" stroke="${ink}" stroke-width="1.5"/>`;
      case "flat":
        return `<path d="M43 59 L57 59" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`;
      case "tongue":
        return `<path d="M41 57 Q50 66 59 57" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M47 61 Q47 67 51 67 Q55 67 54 60Z" fill="#ff6b8a"/>`;
      case "smirk":
        return `<path d="M42 59 Q52 61 59 54" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      default:
        return `<path d="M41 57 Q50 65 59 57" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    }
  }

  function accessory(style) {
    switch (style) {
      case "glasses":
        return `<g stroke="#1d1d1f" stroke-width="2" fill="rgba(255,255,255,.25)"><circle cx="41" cy="45" r="7"/><circle cx="59" cy="45" r="7"/></g>
                <path d="M48 45 L52 45 M34 44 L28 42 M66 44 L72 42" stroke="#1d1d1f" stroke-width="2"/>`;
      case "shades":
        return `<path d="M31 40 L48 40 L47 49 Q40 53 33 49Z M52 40 L69 40 L67 49 Q60 53 53 49Z" fill="#111"/>
                <path d="M48 42 L52 42 M31 41 L27 40 M69 41 L73 40" stroke="#111" stroke-width="2.4"/>
                <path d="M35 42 L39 42" stroke="#555" stroke-width="1.4" stroke-linecap="round"/>`;
      case "crown":
        return `<path d="M33 22 L35 5 L42 13 L50 2 L58 13 L65 5 L67 22Z" fill="#ffc83d" stroke="#c48a00" stroke-width="1.5" stroke-linejoin="round"/>
                <circle cx="50" cy="15" r="2.4" fill="#e63946"/><circle cx="41" cy="17" r="1.6" fill="#3a86ff"/><circle cx="59" cy="17" r="1.6" fill="#3a86ff"/>`;
      case "party":
        return `<path d="M37 24 L50 0 L63 24Z" fill="#8338ec"/><path d="M41 17 L59 17 M45 10 L55 10" stroke="#ffd166" stroke-width="3"/>
                <circle cx="50" cy="1.5" r="3.5" fill="#ef476f"/>`;
      case "cap":
        return `<path d="M26 34 Q26 12 50 12 Q74 12 74 34Z" fill="#e63946"/><path d="M50 32 L88 32 Q86 38 74 38 L50 36Z" fill="#b71c2b"/>
                <circle cx="50" cy="13" r="2.4" fill="#b71c2b"/>`;
      case "bow":
        return `<path d="M60 18 L72 10 L72 26Z M60 18 L48 10 L48 26Z" fill="#ff5d8f" stroke="#c2185b" stroke-width="1.2" stroke-linejoin="round"/>
                <circle cx="60" cy="18" r="3.2" fill="#c2185b"/>`;
      case "headphones":
        return `<path d="M25 46 Q25 14 50 14 Q75 14 75 46" stroke="#333" stroke-width="4" fill="none"/>
                <rect x="20" y="40" width="9" height="16" rx="4" fill="#ef476f"/><rect x="71" y="40" width="9" height="16" rx="4" fill="#ef476f"/>`;
      default:
        return "";
    }
  }

  function svg(a) {
    const id = "av" + (++uid);
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><clipPath id="${id}"><circle cx="50" cy="50" r="50"/></clipPath></defs>
      <g clip-path="url(#${id})">
        <rect width="100" height="100" fill="${a.bg}"/>
        ${hairBack(a.hair, a.hairColor)}
        <rect x="44" y="62" width="12" height="12" fill="${a.skin}"/>
        <path d="M16 104 Q18 73 50 71 Q82 73 84 104Z" fill="${a.shirt}"/>
        <path d="M43 71 Q50 78 57 71" stroke="rgba(0,0,0,.15)" stroke-width="2" fill="none"/>
        <circle cx="27" cy="47" r="5" fill="${a.skin}"/><circle cx="73" cy="47" r="5" fill="${a.skin}"/>
        <ellipse cx="50" cy="44" rx="23" ry="25" fill="${a.skin}"/>
        <circle cx="35" cy="54" r="3.5" fill="#ff7b9c" opacity=".35"/><circle cx="65" cy="54" r="3.5" fill="#ff7b9c" opacity=".35"/>
        ${hairFront(a.hair, a.hairColor)}
        ${eyes(a.eyes)}
        ${mouth(a.mouth)}
        ${accessory(a.acc)}
      </g>
    </svg>`;
  }

  window.Avatar = { OPTIONS, CATEGORIES, random, svg };
})();

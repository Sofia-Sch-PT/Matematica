(function () {
  "use strict";

  const ROUNDS = 10;
  const TIME_LIMIT = 20; // segundos por pergunta
  const MAX_POINTS = 1000;
  const MIN_POINTS = 500; // pontos mínimos por uma resposta certa (no último instante)
  const STORE_KEY = "duelo-teoremas-jogadores";
  const LETTERS = ["A", "B", "C", "D"];

  const $panel = [document.getElementById("panel-0"), document.getElementById("panel-1")];
  const $mid = document.getElementById("mid");

  // ---------- utilitários ----------
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const fmtSec = s => s.toFixed(1).replace(".", ",") + " s";
  const fmtNum = n => n.toLocaleString("pt-PT");

  // ---------- som ----------
  let audioCtx = null;
  let muted = false;
  function beep(freqs, dur = 0.12, type = "sine", gap = 0.09) {
    if (muted) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        const t = audioCtx.currentTime + i * gap;
        o.type = type;
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(audioCtx.destination);
        o.start(t);
        o.stop(t + dur + 0.02);
      });
    } catch (e) { /* sem áudio */ }
  }
  const sfx = {
    tap: () => beep([660], 0.07, "triangle"),
    good: () => beep([523, 659, 784], 0.16, "triangle"),
    bad: () => beep([220, 175], 0.2, "sawtooth", 0.12),
    go: () => beep([440, 880], 0.1, "square", 0.08),
    win: () => beep([523, 659, 784, 1047], 0.22, "triangle", 0.13)
  };

  // ---------- estado ----------
  function defaultPlayers() {
    return [
      { name: "Jogador 1", avatar: Avatar.random() },
      { name: "Jogador 2", avatar: Avatar.random() }
    ];
  }
  function loadPlayers() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY));
      if (Array.isArray(saved) && saved.length === 2 && saved.every(p => p && p.avatar && typeof p.name === "string")) {
        return saved.map(p => ({ name: p.name, avatar: Object.assign(Avatar.random(), p.avatar) }));
      }
    } catch (e) { /* ignora */ }
    return defaultPlayers();
  }
  function savePlayers() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(S.players.map(p => ({ name: p.name, avatar: p.avatar }))));
    } catch (e) { /* ignora */ }
  }

  const S = {
    phase: "setup",
    players: loadPlayers(),
    ready: [false, false],
    category: ["skin", "skin"],
    questions: [],
    round: 0,
    order: [null, null],     // ordem baralhada das respostas por jogador
    answers: [null, null],   // { choice, time }
    score: [0, 0],
    stats: [null, null],
    startAt: 0,
    raf: 0,
    timers: []
  };

  function later(fn, ms) { S.timers.push(setTimeout(fn, ms)); }
  function clearTimers() {
    S.timers.forEach(clearTimeout);
    S.timers = [];
    cancelAnimationFrame(S.raf);
  }

  const name = p => S.players[p].name.trim() || `Jogador ${p + 1}`;
  const avatarHTML = (p, cls = "") => `<div class="avatar ${cls}">${Avatar.svg(S.players[p].avatar)}</div>`;

  // ======================================================================
  // CONFIGURAÇÃO (avatares)
  // ======================================================================
  function renderSetup() {
    S.phase = "setup";
    clearTimers();
    S.ready = [false, false];
    $mid.innerHTML = `
      <div class="title flip">📐 Duelo de Teoremas</div>
      <button class="mute" data-act="mute" aria-label="Som">${muted ? "🔇" : "🔊"}</button>
      <div class="title">📐 Duelo de Teoremas</div>`;
    [0, 1].forEach(p => {
      $panel[p].innerHTML = `
        <div class="setup">
          <div class="setup-head">
            <div class="avatar" data-role="preview"></div>
            <div class="setup-id">
              <span class="who">Jogador ${p + 1}</span>
              <input type="text" maxlength="14" autocomplete="off" spellcheck="false" aria-label="Nome do jogador ${p + 1}" value="${esc(S.players[p].name)}">
              <button class="small-btn" data-act="random">🎲 Aleatório</button>
            </div>
          </div>
          <div class="chips">${Avatar.CATEGORIES.map(c =>
            `<button class="chip" data-act="cat" data-cat="${c.key}">${c.label}</button>`).join("")}</div>
          <div class="opts" data-role="opts"></div>
          <p class="hint">${ROUNDS} rondas · responde certo e rápido para ganhar mais pontos</p>
          <button class="ready-btn" data-act="ready">Pronto!</button>
        </div>`;
      const input = $panel[p].querySelector("input");
      input.addEventListener("input", () => { S.players[p].name = input.value; savePlayers(); });
      input.addEventListener("keydown", e => { if (e.key === "Enter") input.blur(); });
      updateSetup(p);
    });
  }

  function updateSetup(p) {
    const panel = $panel[p];
    const av = S.players[p].avatar;
    const cat = S.category[p];
    panel.querySelector('[data-role="preview"]').innerHTML = Avatar.svg(av);
    panel.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c.dataset.cat === cat));
    const isColor = /^#/.test(Avatar.OPTIONS[cat][0]);
    panel.querySelector('[data-role="opts"]').innerHTML = Avatar.OPTIONS[cat].map(v => {
      const inner = isColor
        ? `<span class="sw" style="background:${v}"></span>`
        : `<span class="mini">${Avatar.svg(Object.assign({}, av, { [cat]: v }))}</span>`;
      return `<button class="opt ${av[cat] === v ? "on" : ""}" data-act="opt" data-val="${v}" aria-label="${v}">${inner}</button>`;
    }).join("");
    const btn = panel.querySelector('[data-act="ready"]');
    btn.classList.toggle("on", S.ready[p]);
    btn.textContent = S.ready[p] ? `✓ À espera de ${name(1 - p)}…` : "Pronto!";
  }

  function onSetupAction(p, act, el) {
    if (act === "random") {
      S.players[p].avatar = Avatar.random();
      sfx.tap();
    } else if (act === "cat") {
      S.category[p] = el.dataset.cat;
    } else if (act === "opt") {
      S.players[p].avatar[S.category[p]] = el.dataset.val;
      sfx.tap();
    } else if (act === "ready") {
      document.activeElement && document.activeElement.blur();
      S.ready[p] = !S.ready[p];
      sfx.tap();
      if (S.ready[0] && S.ready[1]) {
        savePlayers();
        startGame();
        return;
      }
    }
    savePlayers();
    updateSetup(p);
  }

  // ======================================================================
  // JOGO
  // ======================================================================
  function startGame() {
    clearTimers();
    S.questions = shuffle(window.QUESTIONS).slice(0, ROUNDS);
    S.round = 0;
    S.score = [0, 0];
    S.stats = [{ right: 0, time: 0 }, { right: 0, time: 0 }];
    [0, 1].forEach(p => {
      $panel[p].innerHTML = `
        <div class="game">
          <div class="qbox" data-role="qbox"></div>
          <div class="answers hidden" data-role="answers">
            ${[0, 1, 2, 3].map(i => `<button class="ans c${i}" data-act="ans" data-i="${i}"><span class="k">${LETTERS[i]}</span><span class="t"></span></button>`).join("")}
          </div>
          <div class="bar">
            ${avatarHTML(p)}
            <div class="me">
              <div class="name">${esc(name(p))}</div>
              <div class="vs" data-role="vs"></div>
            </div>
            <div class="score" data-role="score">0</div>
          </div>
        </div>`;
    });
    $mid.innerHTML = `
      <div class="label flip" data-role="round"></div>
      <div class="timer"><i data-role="timer"></i></div>
      <button class="mute" data-act="mute" aria-label="Som">${muted ? "🔇" : "🔊"}</button>
      <div class="label" data-role="round"></div>`;
    updateScores();
    nextRound();
  }

  function q$(p, role) { return $panel[p].querySelector(`[data-role="${role}"]`); }

  function updateScores() {
    [0, 1].forEach(p => {
      q$(p, "score").textContent = fmtNum(S.score[p]);
      q$(p, "vs").textContent = `${name(1 - p)}: ${fmtNum(S.score[1 - p])}`;
    });
  }

  function setTimerBar(frac) {
    const bar = $mid.querySelector('[data-role="timer"]');
    if (!bar) return;
    bar.style.transform = `scaleX(${Math.max(0, frac)})`;
    bar.parentElement.classList.toggle("low", frac < 0.25);
  }

  function nextRound() {
    clearTimers();
    S.round++;
    if (S.round > ROUNDS) return renderEnd();
    S.phase = "intro";
    S.answers = [null, null];
    S.next = [false, false];
    $mid.querySelectorAll('[data-role="round"]').forEach(el => (el.textContent = `${S.round}/${ROUNDS}`));
    setTimerBar(1);
    [0, 1].forEach(p => {
      const box = q$(p, "qbox");
      box.innerHTML = `<div class="intro"><div class="big">Ronda ${S.round}</div><div class="sub">Prepara-te…</div></div>`;
      const ans = q$(p, "answers");
      ans.className = "answers hidden";
      ans.querySelector(".lockmsg") && ans.querySelector(".lockmsg").remove();
      ans.querySelectorAll(".ans").forEach(b => { b.className = `ans ${b.className.match(/c\d/)[0]}`; b.disabled = true; });
      const bar = $panel[p].querySelector(".bar");
      bar.querySelector(".next-btn") && bar.querySelector(".next-btn").remove();
    });
    later(ask, 1600);
  }

  function ask() {
    const Q = S.questions[S.round - 1];
    S.phase = "ask";
    [0, 1].forEach(p => {
      S.order[p] = shuffle([0, 1, 2, 3]); // cada jogador vê as respostas numa ordem diferente
      q$(p, "qbox").innerHTML = `<div class="tag">${esc(Q.t)}</div><p class="q">${esc(Q.q)}</p><div class="fb"></div>`;
      const ans = q$(p, "answers");
      ans.className = "answers";
      ans.querySelectorAll(".ans").forEach((b, i) => {
        b.querySelector(".t").textContent = Q.a[S.order[p][i]];
        b.disabled = false;
      });
    });
    sfx.go();
    S.startAt = performance.now();
    const tick = () => {
      const el = (performance.now() - S.startAt) / 1000;
      setTimerBar(1 - el / TIME_LIMIT);
      if (el >= TIME_LIMIT) return reveal();
      S.raf = requestAnimationFrame(tick);
    };
    S.raf = requestAnimationFrame(tick);
  }

  function onAnswer(p, i) {
    if (S.phase !== "ask" || S.answers[p]) return;
    const time = (performance.now() - S.startAt) / 1000;
    S.answers[p] = { choice: S.order[p][i], slot: i, time };
    sfx.tap();
    const ans = q$(p, "answers");
    ans.classList.add("locked");
    ans.querySelectorAll(".ans").forEach(b => (b.disabled = true));
    const msg = document.createElement("div");
    msg.className = "lockmsg";
    msg.textContent = S.answers[1 - p] ? "Resposta registada ✓" : `Resposta registada ✓\nÀ espera de ${name(1 - p)}…`;
    msg.style.whiteSpace = "pre-line";
    ans.appendChild(msg);
    if (S.answers[0] && S.answers[1]) later(reveal, 350);
  }

  function pointsFor(a) {
    if (!a || a.choice !== 0) return 0;
    const frac = Math.max(0, 1 - a.time / TIME_LIMIT);
    return Math.round(MIN_POINTS + (MAX_POINTS - MIN_POINTS) * frac);
  }

  function reveal() {
    if (S.phase !== "ask") return;
    clearTimers();
    S.phase = "reveal";
    const Q = S.questions[S.round - 1];
    let anyRight = false;
    [0, 1].forEach(p => {
      const a = S.answers[p];
      const pts = pointsFor(a);
      S.score[p] += pts;
      if (pts) { S.stats[p].right++; S.stats[p].time += a.time; anyRight = true; }

      const ans = q$(p, "answers");
      ans.className = "answers";
      ans.querySelector(".lockmsg") && ans.querySelector(".lockmsg").remove();
      ans.querySelectorAll(".ans").forEach((b, i) => {
        b.disabled = true;
        const real = S.order[p][i];
        if (real === 0) b.classList.add("right");
        else if (a && a.slot === i) b.classList.add("wrong");
        else b.classList.add("dim");
      });

      const box = q$(p, "qbox");
      let head;
      if (!a) head = `<b class="bad">⏱ Tempo esgotado!</b>`;
      else if (pts) head = `<b class="ok">✔ Certo!</b> em ${fmtSec(a.time)}`;
      else head = `<b class="bad">✘ Errado.</b>`;
      const other = S.answers[1 - p];
      const otherTxt = !other ? `${esc(name(1 - p))} não respondeu.`
        : other.choice === 0 ? `${esc(name(1 - p))} acertou (+${pointsFor(other)}).`
        : `${esc(name(1 - p))} errou.`;
      box.querySelector(".fb").innerHTML = `${head} ${otherTxt}<br>${esc(Q.e)}`;
      const gain = document.createElement("div");
      gain.className = "gain" + (pts ? "" : " zero");
      gain.textContent = pts ? `+${pts}` : "+0";
      box.appendChild(gain);
      if (!pts) { box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake"); }

      const bar = $panel[p].querySelector(".bar");
      const btn = document.createElement("button");
      btn.className = "next-btn";
      btn.dataset.act = "next";
      btn.textContent = S.round === ROUNDS ? "Resultados ▶" : "Seguinte ▶";
      bar.appendChild(btn);
    });
    anyRight ? sfx.good() : sfx.bad();
    updateScores();
  }

  function onNext(p) {
    if (S.phase !== "reveal" || S.next[p]) return;
    S.next[p] = true;
    sfx.tap();
    const btn = $panel[p].querySelector(".next-btn");
    btn.classList.add("on");
    btn.textContent = "✓ À espera…";
    if (S.next[0] && S.next[1]) later(nextRound, 250);
  }

  // ======================================================================
  // FIM
  // ======================================================================
  function renderEnd() {
    clearTimers();
    S.phase = "end";
    const [a, b] = S.score;
    const winner = a === b ? -1 : a > b ? 0 : 1;
    $mid.innerHTML = `
      <div class="title flip">🏁 Fim do duelo</div>
      <button class="mute" data-act="mute" aria-label="Som">${muted ? "🔇" : "🔊"}</button>
      <div class="title">🏁 Fim do duelo</div>`;
    [0, 1].forEach(p => {
      const st = S.stats[p];
      const res = winner === -1 ? ["🤝 Empate!", "", "🤝"]
        : winner === p ? ["🏆 Ganhaste!", "win", "🏆"]
        : ["Perdeste…", "", "🥈"];
      const avg = st.right ? fmtSec(st.time / st.right) : "—";
      const confetti = winner === p
        ? `<div class="confetti">${Array.from({ length: 28 }, () => {
            const colors = ["#ffc83d", "#ff4fa3", "#3a86ff", "#1fc77e", "#8338ec"];
            return `<i style="left:${Math.random() * 100}%;background:${colors[Math.floor(Math.random() * colors.length)]};animation-duration:${2 + Math.random() * 2.5}s;animation-delay:${-Math.random() * 3}s"></i>`;
          }).join("")}</div>`
        : "";
      $panel[p].innerHTML = `
        <div class="end">
          ${confetti}
          <div class="result ${res[1]}">${res[0]}</div>
          <div class="avatar-wrap">${avatarHTML(p)}<span class="medal">${res[2]}</span></div>
          <div class="scores"><b>${fmtNum(S.score[p])}</b> pontos · ${esc(name(1 - p))}: ${fmtNum(S.score[1 - p])}</div>
          <div class="stats">Certas: ${st.right}/${ROUNDS} · Tempo médio (certas): ${avg}</div>
          <div class="btns">
            <button class="primary" data-act="again">🔁 Revanche</button>
            <button data-act="avatars">🎨 Avatares</button>
          </div>
        </div>`;
    });
    sfx.win();
  }

  // ======================================================================
  // EVENTOS
  // ======================================================================
  function handle(e) {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const panel = el.closest(".panel");
    const p = panel ? Number(panel.dataset.player) : -1;
    const act = el.dataset.act;
    if (act === "mute") {
      muted = !muted;
      el.textContent = muted ? "🔇" : "🔊";
      return;
    }
    if (p < 0) return;
    if (S.phase === "setup") return onSetupAction(p, act, el);
    if (act === "ans") return onAnswer(p, Number(el.dataset.i));
    if (act === "next") return onNext(p);
    if (act === "again") return startGame();
    if (act === "avatars") return renderSetup();
  }

  // Respostas registadas ao tocar (pointerdown) para medir o tempo com precisão
  // e permitir que os dois jogadores toquem ao mesmo tempo.
  document.addEventListener("pointerdown", e => {
    const el = e.target.closest('[data-act="ans"]');
    if (el && !el.disabled) { e.preventDefault(); handle(e); }
  });
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-act]");
    if (el && el.dataset.act !== "ans") handle(e);
  });
  // Teclado (útil em computador): jogador 1 = 1-4, jogador 2 = 7-0
  document.addEventListener("keydown", e => {
    if (S.phase !== "ask" || e.target.tagName === "INPUT") return;
    const k1 = "1234".indexOf(e.key), k2 = "7890".indexOf(e.key);
    if (k1 >= 0) onAnswer(0, k1);
    if (k2 >= 0) onAnswer(1, k2);
  });

  renderSetup();
})();

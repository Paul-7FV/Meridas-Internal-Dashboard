/* =========================================================
   PAUL — Portfolio · main.js
   ---------------------------------------------------------
   ✏️  Pour personnaliser : modifie CONFIG juste en dessous.
   ========================================================= */
const CONFIG = {
  email: "hello@exemple.com", // ← ton adresse pro
  projects: [
    {
      name: "Meridas",
      desc: "Dashboard de pilotage des performances pour une agence de clipping.",
      tags: ["Product design", "Front-end", "Data viz"],
      year: "2025", role: "Design & Dev",
      art: "bars", bg: "#6b4dff", fg: "#f3efe4", accent: "#d4ff3a",
      url: "",
    },
    {
      name: "Neon Atlas",
      desc: "Identité visuelle générative pour un festival de musique électronique.",
      tags: ["Branding", "Génératif"],
      year: "2026", role: "Direction artistique",
      art: "rings", bg: "#ff4d2e", fg: "#0b0b10", accent: "#0b0b10",
      url: "",
    },
    {
      name: "Pulse",
      desc: "Expérience WebGL qui réagit au son et au mouvement.",
      tags: ["WebGL", "Creative code"],
      year: "2026", role: "Creative dev",
      art: "grid", bg: "#0b0b10", fg: "#f3efe4", accent: "#d4ff3a",
      url: "",
    },
    {
      name: "Lumen",
      desc: "E-shop motion-first pour une marque de cosmétiques.",
      tags: ["Web design", "Motion", "E-commerce"],
      year: "2025", role: "Design & Motion",
      art: "waves", bg: "#14141c", fg: "#f3efe4", accent: "#ff4d2e",
      url: "",
    },
    {
      name: "Orbit",
      desc: "App mobile de suivi d'habitudes, conçue main dans la main avec l'IA.",
      tags: ["UI / UX", "Mobile", "IA"],
      year: "2026", role: "Product design",
      art: "blobs", bg: "#d4ff3a", fg: "#0b0b10", accent: "#6b4dff",
      url: "",
    },
  ],
};

/* ========================================================= */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const lerp = (a, b, n) => a + (b - a) * n;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isDesktop = () => window.innerWidth > 760;

  if (!hasGsap || reduced) document.body.classList.add("no-anim");
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Email ---------- */
  $$(".js-email").forEach((a) => (a.href = "mailto:" + CONFIG.email));

  /* ---------- Clock ---------- */
  const clockEls = $$(".js-clock");
  const tick = () => {
    const s = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(new Date());
    clockEls.forEach((el) => (el.textContent = s));
  };
  tick(); setInterval(tick, 15000);

  /* ---------- Build project cards ---------- */
  const track = $(".js-track");
  CONFIG.projects.forEach((p, i) => {
    const el = document.createElement(p.url ? "a" : "article");
    if (p.url) { el.href = p.url; el.target = "_blank"; el.rel = "noopener"; }
    el.className = "card";
    el.dataset.cursor = p.url ? "Voir" : "Bientôt";
    el.style.cssText = `--card-bg:${p.bg};background:${p.bg};color:${p.fg}`;
    el.innerHTML = `
      <canvas></canvas>
      <div class="card__top">
        <span class="card__index">${String(i + 1).padStart(2, "0")}</span>
        <div class="card__tags mono">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
      </div>
      <div class="card__bottom">
        <h3 class="card__name">${p.name}</h3>
        <p class="card__desc">${p.desc}</p>
        <div class="card__meta mono"><span>${p.role}</span><span>${p.year}</span></div>
      </div>`;
    track.appendChild(el);
  });
  const end = document.createElement("a");
  end.href = "#contact"; end.className = "card card--end"; end.dataset.cursor = "Go";
  end.innerHTML = `<strong>Ton projet<br/>ici&nbsp;?</strong><span class="mono">Parlons-en</span><span class="arrow">→</span>`;
  track.appendChild(end);

  /* ---------- Generative card art ---------- */
  const ART = {
    bars(c, w, h, t, mx, my, p) {
      c.fillStyle = p.bg; c.fillRect(0, 0, w, h);
      c.strokeStyle = "rgba(243,239,228,.12)"; c.lineWidth = 1;
      for (let y = h * 0.2; y < h; y += h / 12) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
      const n = 16, bw = w / n;
      for (let i = 0; i < n; i++) {
        const x = i / n + 0.5 / n;
        const boost = Math.exp(-((x - mx) ** 2) * 60) * 0.35;
        const v = 0.18 + 0.32 * (0.5 + 0.5 * Math.sin(t * 1.6 + i * 0.7)) * (0.6 + 0.4 * Math.sin(i * 1.3)) + boost;
        c.fillStyle = boost > 0.1 ? p.accent : "rgba(243,239,228,.85)";
        c.fillRect(i * bw + bw * 0.18, h - v * h * 0.8, bw * 0.64, v * h * 0.8);
      }
      c.strokeStyle = p.accent; c.lineWidth = 3; c.beginPath();
      for (let i = 0; i <= 60; i++) {
        const x = (i / 60) * w;
        const y = h * 0.32 + Math.sin(i * 0.35 + t * 1.2) * h * 0.05 + Math.sin(i * 0.11 - t) * h * 0.06 - (i / 60) * h * 0.08;
        i ? c.lineTo(x, y) : c.moveTo(x, y);
      }
      c.stroke();
    },
    rings(c, w, h, t, mx, my, p) {
      c.fillStyle = p.bg; c.fillRect(0, 0, w, h);
      const cx = w * (0.5 + (mx - 0.5) * 0.25), cy = h * (0.45 + (my - 0.5) * 0.2), base = Math.min(w, h) * 0.035;
      for (let k = 1; k <= 13; k++) {
        const r = k * base;
        c.strokeStyle = `rgba(11,11,16,${0.15 + k * 0.04})`; c.lineWidth = 1.5;
        c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
        const n = (k % 3) + 1;
        for (let j = 0; j < n; j++) {
          const a = t * (0.25 + k * 0.06) * (k % 2 ? 1 : -1) + (j * Math.PI * 2) / n;
          c.fillStyle = k % 4 === 0 ? "#f3efe4" : "#0b0b10";
          c.beginPath(); c.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 3 + (k % 3) * 2, 0, Math.PI * 2); c.fill();
        }
      }
      c.fillStyle = "#0b0b10"; c.beginPath(); c.arc(cx, cy, base * 0.8 + Math.sin(t * 2) * 3, 0, Math.PI * 2); c.fill();
    },
    grid(c, w, h, t, mx, my, p) {
      c.fillStyle = p.bg; c.fillRect(0, 0, w, h);
      const g = 22, px = mx * w, py = my * h;
      c.fillStyle = p.accent;
      for (let y = g / 2; y < h; y += g) for (let x = g / 2; x < w; x += g) {
        const d = Math.hypot(x - px, y - py);
        const wave = 0.5 + 0.5 * Math.sin(d * 0.045 - t * 3.2);
        const s = 0.6 + wave * 4.2 * Math.exp(-d / 260);
        c.globalAlpha = 0.25 + 0.75 * Math.exp(-d / 320);
        c.fillRect(x - s / 2, y - s / 2, s, s);
      }
      c.globalAlpha = 1;
    },
    waves(c, w, h, t, mx, my, p) {
      c.fillStyle = p.bg; c.fillRect(0, 0, w, h);
      const n = 26;
      for (let i = 0; i < n; i++) {
        const y0 = h * 0.12 + (i * h * 0.62) / n;
        c.strokeStyle = i % 3 === 0 ? p.accent : `rgba(243,239,228,${0.2 + (i / n) * 0.5})`;
        c.lineWidth = i % 3 === 0 ? 2 : 1;
        c.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const env = Math.exp(-((x / w - mx) ** 2) * 10) * (30 + my * 30) + 5;
          const y = y0 + Math.sin(x * 0.012 + t * 1.4 + i * 0.35) * env * Math.sin(i * 0.2 + t * 0.5);
          x ? c.lineTo(x, y) : c.moveTo(x, y);
        }
        c.stroke();
      }
    },
    blobs(c, w, h, t, mx, my, p) {
      c.fillStyle = p.bg; c.fillRect(0, 0, w, h);
      const blobs = [
        [0.3 + Math.sin(t * 0.7) * 0.15, 0.35 + Math.cos(t * 0.5) * 0.12, "#6b4dff"],
        [0.7 + Math.cos(t * 0.6) * 0.12, 0.45 + Math.sin(t * 0.8) * 0.15, "#ff4d2e"],
        [mx, my, "#0b0b10"],
      ];
      blobs.forEach(([x, y, col], i) => {
        const r = Math.min(w, h) * (i === 2 ? 0.22 : 0.45);
        const gr = c.createRadialGradient(x * w, y * h, 0, x * w, y * h, r);
        gr.addColorStop(0, col); gr.addColorStop(1, col + "00");
        c.fillStyle = gr; c.fillRect(0, 0, w, h);
      });
      c.strokeStyle = "rgba(11,11,16,.5)"; c.lineWidth = 1;
      for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(w * 0.5, h * 0.42, 40 + k * 26 + Math.sin(t * 2 + k) * 4, 0, Math.PI * 2); c.stroke(); }
    },
  };

  const cards = $$(".card:not(.card--end)").map((el, i) => {
    const cv = $("canvas", el);
    const st = { el, cv, ctx: cv.getContext("2d"), p: CONFIG.projects[i], mx: 0.5, my: 0.5, tx: 0.5, ty: 0.5, visible: false, w: 0, h: 0 };
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      st.tx = (e.clientX - r.left) / r.width; st.ty = (e.clientY - r.top) / r.height;
      if (finePointer && !reduced) el.style.transform = `perspective(900px) rotateY(${(st.tx - 0.5) * 10}deg) rotateX(${(0.5 - st.ty) * 10}deg) scale(1.02)`;
    });
    el.addEventListener("pointerleave", () => { st.tx = 0.5; st.ty = 0.5; el.style.transform = ""; });
    new IntersectionObserver(([en]) => (st.visible = en.isIntersecting)).observe(el);
    return st;
  });
  function sizeCards() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cards.forEach((s) => {
      s.w = s.el.clientWidth; s.h = s.el.clientHeight;
      s.cv.width = s.w * dpr; s.cv.height = s.h * dpr;
      s.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
  }
  sizeCards();
  window.addEventListener("resize", sizeCards);
  const t0 = performance.now();
  (function cardLoop(now) {
    requestAnimationFrame(cardLoop);
    const t = reduced ? 4 : (now - t0) / 1000;
    cards.forEach((s) => {
      if (!s.visible) return;
      s.mx = lerp(s.mx, s.tx, 0.08); s.my = lerp(s.my, s.ty, 0.08);
      (ART[s.p.art] || ART.grid)(s.ctx, s.w, s.h, t, s.mx, s.my, s.p);
    });
  })(t0);

  /* ---------- Custom cursor ---------- */
  const cursor = $(".cursor");
  const dot = $(".cursor__dot"), ring = $(".cursor__ring"), label = $(".cursor__label");
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { x: pos.x, y: pos.y };
  if (finePointer) {
    document.body.classList.add("has-cursor");
    window.addEventListener("pointermove", (e) => {
      pos.x = e.clientX; pos.y = e.clientY;
      dot.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
    }, { passive: true });
    (function loop() {
      ringPos.x = lerp(ringPos.x, pos.x, 0.18); ringPos.y = lerp(ringPos.y, pos.y, 0.18);
      ring.style.transform = `translate3d(${ringPos.x}px,${ringPos.y}px,0)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("[data-cursor], a, button, input");
      cursor.classList.remove("is-hover", "is-label");
      if (!t) return;
      const txt = t.dataset.cursor;
      if (txt) { label.textContent = txt; cursor.classList.add("is-label"); }
      else cursor.classList.add("is-hover");
    });
    window.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-down"));
    document.addEventListener("mouseleave", () => (cursor.style.opacity = 0));
    document.addEventListener("mouseenter", () => (cursor.style.opacity = 1));
  }

  /* ---------- Magnetic ---------- */
  if (finePointer && !reduced) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        el.style.transition = "transform .15s ease-out";
        el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "transform .8s cubic-bezier(.2,1.6,.4,1)";
        el.style.transform = "";
      });
    });
  }

  /* ---------- Kinetic hero title ---------- */
  const word = $(".js-kinetic");
  const chars = [...word.textContent].map((ch) => {
    const wrap = document.createElement("span"); wrap.className = "char-wrap";
    const s = document.createElement("span"); s.className = "char"; s.textContent = ch;
    wrap.appendChild(s); return s;
  });
  word.textContent = "";
  chars.forEach((c) => word.appendChild(c.parentElement));

  function fitTitle() {
    const title = $(".hero__title");
    title.style.fontSize = "100px";
    chars.forEach((c) => (c.style.fontVariationSettings = `"wght" 800`));
    const avail = title.parentElement.clientWidth - 0;
    const size = clamp((100 * avail) / word.scrollWidth, 60, window.innerHeight * 0.4);
    title.style.fontSize = size + "px";
  }
  fitTitle();
  window.addEventListener("resize", fitTitle);
  if (document.fonts) document.fonts.ready.then(() => { fitTitle(); hasGsap && ScrollTrigger.refresh(); });

  const kin = chars.map(() => ({ w: 800, y: 0, s: 1 }));
  const hero = $(".hero");
  let inHero = false, mxp = -9999, myp = -9999;
  hero.addEventListener("pointermove", (e) => { inHero = true; mxp = e.clientX; myp = e.clientY; });
  hero.addEventListener("pointerleave", () => (inHero = false));
  if (!reduced) (function kinLoop() {
    requestAnimationFrame(kinLoop);
    chars.forEach((c, i) => {
      let tw = 800, ty = 0, ts = 1;
      if (inHero) {
        const r = c.getBoundingClientRect();
        const d = Math.hypot(mxp - (r.left + r.width / 2), myp - (r.top + r.height / 2));
        const k = Math.exp(-(d * d) / (2 * 260 * 260));
        tw = 800 - 620 * k; ty = -k * 0.06; ts = 1 + k * 0.12;
      }
      const st = kin[i];
      st.w = lerp(st.w, tw, 0.12); st.y = lerp(st.y, ty, 0.12); st.s = lerp(st.s, ts, 0.12);
      c.style.fontVariationSettings = `"wght" ${st.w.toFixed(0)}`;
      c.style.transform = `translateY(${st.y}em) scaleY(${st.s})`;
    });
  })();

  /* ---------- Counters (fallback without gsap) ---------- */
  const counters = $$("[data-count]");

  /* ---------- Particles playground ---------- */
  initParticles();

  /* =========== Everything below needs GSAP =========== */
  if (!hasGsap || reduced) {
    counters.forEach((c) => (c.textContent = c.dataset.count));
    const l = $(".loader"); if (l) l.remove();
    return;
  }

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const target = id === "#top" ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(target, { duration: 1.6 }) : window.scrollTo({ top: target ? target.offsetTop : 0, behavior: "smooth" });
  }));

  /* ---------- Preloader + intro ---------- */
  document.body.classList.add("is-loading");
  gsap.set(chars, { yPercent: 110 });
  gsap.set(".hero .reveal-line > span", { yPercent: 110 });
  gsap.set([".nav", ".hero__badge", ".hero__hint"], { autoAlpha: 0 });

  const count = { v: 0 };
  const countEl = $(".js-count");
  const tl = gsap.timeline();
  tl.to(count, {
    v: 100, duration: 1.8, ease: "power2.inOut",
    onUpdate: () => (countEl.textContent = String(Math.round(count.v)).padStart(3, "0")),
  })
    .to(".loader__bar i", { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0)
    .to(".loader__inner", { autoAlpha: 0, duration: 0.3 })
    .to(".loader__panel:first-child", { yPercent: -100, duration: 1, ease: "expo.inOut" }, "<")
    .to(".loader__panel:nth-child(2)", { yPercent: 100, duration: 1, ease: "expo.inOut" }, "<")
    .add(() => { $(".loader").remove(); document.body.classList.remove("is-loading"); lenis && lenis.start(); }, "-=0.2")
    .to(chars, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.07 }, "-=0.6")
    .to(".hero .reveal-line > span", { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.06 }, "-=1.1")
    .to([".nav", ".hero__badge", ".hero__hint"], { autoAlpha: 1, duration: 0.8 }, "-=0.8");

  /* ---------- Hero parallax on scroll ---------- */
  gsap.to(".hero__content", {
    yPercent: 25, opacity: 0.2, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  /* ---------- Velocity marquee ---------- */
  const rows = $$(".js-marquee").map((row) => {
    const inner = $(".marquee__inner", row);
    for (let i = 0; i < 3; i++) row.appendChild(inner.cloneNode(true));
    return { row, items: $$(".marquee__inner", row), dir: +row.dataset.dir, x: 0 };
  });
  let vel = 0, skew = 0;
  gsap.ticker.add(() => {
    const v = lenis ? lenis.velocity : 0;
    vel = lerp(vel, v, 0.1);
    rows.forEach((r) => {
      const w = r.items[0].offsetWidth;
      r.x += (1.2 + Math.abs(vel) * 0.6) * r.dir * (vel < -0.5 ? -1 : 1);
      if (r.x <= -w) r.x += w; if (r.x > 0) r.x -= w;
      r.items.forEach((it) => (it.style.transform = `translate3d(${r.x}px,0,0)`));
    });
    skew = lerp(skew, clamp(vel * 0.6, -12, 12), 0.1);
    $(".marquee").style.transform = `skewY(${skew * 0.3}deg)`;
  });

  /* ---------- Manifesto words ---------- */
  const words = $(".js-words");
  (function splitWords(node) {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(" "));
          else { const s = document.createElement("span"); s.className = "word"; s.textContent = part; frag.appendChild(s); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) splitWords(n);
    });
  })(words);
  gsap.fromTo($$(".word", words), { opacity: 0.12, y: 12 }, {
    opacity: 1, y: 0, stagger: 0.05, ease: "none",
    scrollTrigger: { trigger: words, start: "top 80%", end: "bottom 45%", scrub: true },
  });

  counters.forEach((c) => {
    const o = { v: 0 };
    gsap.to(o, {
      v: +c.dataset.count, duration: 2, ease: "power3.out",
      onUpdate: () => (c.textContent = Math.round(o.v)),
      scrollTrigger: { trigger: c, start: "top 90%", once: true },
    });
  });

  /* ---------- Horizontal work + stack (desktop) ---------- */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 761px)", () => {
    const head = $(".work__head");
    const dist = () => track.offsetLeft + track.scrollWidth - window.innerWidth;
    const tween = gsap.to([head, track], {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: ".work", pin: ".work__pin", start: "top top",
        end: () => "+=" + dist(), scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
    $$(".card", track).forEach((card) => {
      gsap.fromTo(card, { rotate: 4, yPercent: 8 }, {
        rotate: 0, yPercent: 0, ease: "none",
        scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "left 40%", scrub: true },
      });
    });
  });

  const stack = $$(".stack__card");
  stack.forEach((card, i) => {
    if (i === stack.length - 1) return;
    gsap.to(card, {
      scale: 0.92, filter: "brightness(.7)", ease: "none",
      scrollTrigger: { trigger: stack[i + 1], start: "top 55%", end: "top 12%", scrub: true },
    });
  });

  /* ---------- Section reveals ---------- */
  $$(".big-title, .work__title, .contact__title, .section-tag").forEach((el) => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  gsap.from(".contact__cta", { scale: 0, rotate: -90, duration: 1.4, ease: "elastic.out(1,.6)", scrollTrigger: { trigger: ".contact__cta", start: "top 92%" } });

  window.addEventListener("load", () => ScrollTrigger.refresh());

  /* ========================================================= */
  function initParticles() {
    const cv = $(".js-particles");
    const input = $(".js-word");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const colors = ["#d4ff3a", "#6b4dff", "#ff4d2e", "#f3efe4"];
    let W = 0, H = 0, dpr = 1, parts = [], visible = false;
    const m = { x: -9999, y: -9999, down: false };

    function targets(text) {
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const o = off.getContext("2d");
      let fs = H * 0.78;
      o.font = `800 ${fs}px Unbounded, sans-serif`;
      const tw = o.measureText(text).width;
      if (tw > W * 0.9) fs *= (W * 0.9) / tw;
      o.font = `800 ${fs}px Unbounded, sans-serif`;
      o.textAlign = "center"; o.textBaseline = "middle"; o.fillStyle = "#fff";
      o.fillText(text, W / 2, H / 2);
      const data = o.getImageData(0, 0, W, H).data;
      const gap = Math.max(4, Math.round(Math.sqrt((W * H) / 9000)));
      const pts = [];
      for (let y = 0; y < H; y += gap) for (let x = 0; x < W; x += gap) if (data[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
      return { pts, gap };
    }

    function build() {
      const text = (input.value || " ").toUpperCase();
      const { pts, gap } = targets(text);
      for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
      while (parts.length < pts.length) parts.push({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, c: colors[(Math.random() * colors.length) | 0], s: 0 });
      parts.length = pts.length;
      parts.forEach((p, i) => { p.hx = pts[i][0]; p.hy = pts[i][1]; p.s = gap * (0.45 + Math.random() * 0.4); });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }
    resize();
    window.addEventListener("resize", resize);
    if (document.fonts) document.fonts.ready.then(resize);
    input.addEventListener("input", () => {
      build();
      parts.forEach((p) => { p.vx += (Math.random() - 0.5) * 30; p.vy += (Math.random() - 0.5) * 30; });
    });

    cv.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; });
    cv.addEventListener("pointerleave", () => { m.x = m.y = -9999; });
    cv.addEventListener("pointerdown", (e) => {
      const r = cv.getBoundingClientRect(); const cx = e.clientX - r.left, cy = e.clientY - r.top;
      parts.forEach((p) => {
        const dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) || 1;
        const f = 60 * Math.exp(-d / 300);
        p.vx += (dx / d) * f; p.vy += (dy / d) * f;
      });
    });
    new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(cv);

    const R = 110;
    (function loop() {
      requestAnimationFrame(loop);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        const dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 6;
          p.vx += (dx / d) * f; p.vy += (dy / d) * f;
        }
        p.vx += (p.hx - p.x) * 0.045; p.vy += (p.hy - p.y) * 0.045;
        p.vx *= 0.84; p.vy *= 0.84;
        p.x += p.vx; p.y += p.vy;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
      }
    })();
  }
})();

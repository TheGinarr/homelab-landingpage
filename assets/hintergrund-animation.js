/* Interaktiver Partikelnetz-Hintergrund.
   Eigenständige Implementierung: Punkte driften langsam, nahe Punkte verbinden sich,
   der Mauszeiger "zieht" Verbindungslinien. Rücksichten:
   - respektiert prefers-reduced-motion (keine Animation)
   - pausiert automatisch, wenn der Tab unsichtbar ist
   - abschaltbar über [data-fx-toggle]-Buttons (Schlüssel "fx", optional über ein globales Store-Objekt)
   - Farben kommen aus den Theme-Variablen (hell/dunkel/Akzent) */
"use strict";
(function () {
  const HOST_ID = "fx-bg";
  if (!document.getElementById(HOST_ID)) return; // nur auf Seiten mit Host-Element
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let canvas = null, ctx = null, pts = [], raf = 0, running = false;
  const mouse = { x: -9999, y: -9999 };
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const LINK = 130;        // Verbindungsdistanz (CSS-Pixel)
  const MOUSE_LINK = 170;  // Verbindungsdistanz zur Maus

  /* Klick auf die Seite setzt einen zusätzlichen Punkt (max. EXTRA_MAX; danach ersetzt der neueste den ältesten).
     Klicks auf Bedienelemente bleiben unangetastet. */
  const EXTRA_MAX = 100;
  let extra = 0;
  function klickPunkt(e) {
    if (!running || !ctx) return;
    if (e.button !== 0) return;
    if (e.target.closest("a,button,input,select,textarea,summary,label,[role=button]")) return;
    const p = { x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: 1.4 + Math.random() * 1.6 };
    if (extra >= EXTRA_MAX) { pts.shift(); } else { extra++; }
    pts.push(p);
  }
  /* Einstellung merken: vorhandenes Store-Objekt, sonst localStorage. */
  const FX = typeof Store !== "undefined" ? Store : {
    get(k, d) { try { const v = localStorage.getItem("site-" + k); return v === null ? d : v === "1"; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("site-" + k, v ? "1" : "0"); } catch (e) {} },
  };
  function enabled() { return !!FX.get("fx", true) && !reduced; }

  function colors() {
    const cs = getComputedStyle(document.documentElement);
    return {
      dot: cs.getPropertyValue("--tx3").trim() || "#888",
      line: cs.getPropertyValue("--tx3").trim() || "#888",
      accent: cs.getPropertyValue("--ac").trim() || "#c33",
    };
  }

  function build() {
    const host = document.getElementById(HOST_ID);
    canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:-1;opacity:.68";
    ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) { canvas = null; return false; } // kein Canvas-Support -> still bleiben
    host.appendChild(canvas);
    resize();
    seed();
    return true;
  }

  function resize() {
    if (!canvas) return;
    canvas.width = Math.floor(innerWidth * DPR);
    canvas.height = Math.floor(innerHeight * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function seed() {
    extra = 0; // Klick-Punkte zählen nach Neuaufbau wieder von vorn
    const n = Math.max(24, Math.min(90, Math.floor((innerWidth * innerHeight) / 22000)));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.2 + Math.random() * 1.6,
    }));
  }

  function step() {
    if (!running || !ctx || typeof document === "undefined" || !document.documentElement) { running = false; return; }
    const c = colors();
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = innerWidth + 20; else if (p.x > innerWidth + 20) p.x = -20;
      if (p.y < -20) p.y = innerHeight + 20; else if (p.y > innerHeight + 20) p.y = -20;
    }
    // Linien zwischen nahen Punkten
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          const t = 1 - Math.sqrt(d2) / LINK;
          ctx.globalAlpha = t * 0.42;
          ctx.strokeStyle = c.line;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      // Linie zur Maus (Akzentfarbe) – die "interaktive" Komponente
      const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
      const md2 = mdx * mdx + mdy * mdy;
      if (md2 < MOUSE_LINK * MOUSE_LINK) {
        const t = 1 - Math.sqrt(md2) / MOUSE_LINK;
        ctx.globalAlpha = t * 0.5;
        ctx.strokeStyle = c.accent;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    // Punkte
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = c.dot;
    for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill(); }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(step);
  }

  function start() { if (running || !enabled()) return; if (!canvas && build() === false) return; if (!canvas) return; canvas.style.display = ""; running = true; raf = requestAnimationFrame(step); }
  function stop(hide) { running = false; cancelAnimationFrame(raf); if (canvas && hide) canvas.style.display = "none"; }

  window.SITE_FX = {
    toggle() {
      const now = !FX.get("fx", true);
      FX.set("fx", now);
      if (now) start(); else stop(true);
      syncButtons();
      return now;
    },
    active: () => running,
  };

  addEventListener("resize", () => { if (canvas) { resize(); seed(); } });
  addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });
  document.addEventListener("click", klickPunkt);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(false); else start(); });

  /* Pause-Schalter (WCAG 2.2.2): Buttons mit data-fx-toggle; bei reduzierter Bewegung bleiben sie versteckt. */
  function syncButtons() {
    const on = enabled();
    document.querySelectorAll("[data-fx-toggle]").forEach(b => {
      b.hidden = reduced;
      b.textContent = on ? "Animation pausieren" : "Animation fortsetzen";
    });
  }
  function init() {
    start();
    document.querySelectorAll("[data-fx-toggle]").forEach(b => b.addEventListener("click", () => window.SITE_FX.toggle()));
    syncButtons();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

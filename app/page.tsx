"use client";

import React, { useEffect, useMemo, useRef } from "react";

type Vec2 = { x: number; y: number };

type PanelType = "code" | "graph" | "map" | "network" | "logs";

type Panel = {
  id: string;
  type: PanelType;
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
  tilt: number;
  seed: number;
  osc: number;
  t: number;
  off: HTMLCanvasElement;
  offCtx: CanvasRenderingContext2D;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number
) {
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "rgba(110,231,183,0.25)";
  ctx.lineWidth = 1;

  const spacing = 40;
  const drift = (t * 6) % spacing;

  for (let x = -spacing; x < w + spacing; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x + drift, 0);
    ctx.lineTo(x + drift, h);
    ctx.stroke();
  }
  for (let y = -spacing; y < h + spacing; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y + drift * 0.6);
    ctx.lineTo(w, y + drift * 0.6);
    ctx.stroke();
  }

  ctx.restore();
}

function renderPanelContent(panel: Panel, dt: number) {
  const ctx = panel.offCtx;
  const w = panel.off.width;
  const h = panel.off.height;

  panel.t += dt;
  panel.osc += dt * (0.4 + panel.depth * 0.25);

  ctx.clearRect(0, 0, w, h); // background glass

  ctx.save();
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "rgba(2, 6, 23, 0.92)");
  g.addColorStop(1, "rgba(3, 7, 18, 0.86)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  drawGrid(ctx, w, h, panel.t); // subtle vignette

  ctx.save();
  const vg = ctx.createRadialGradient(
    w * 0.55,
    h * 0.5,
    10,
    w * 0.5,
    h * 0.5,
    Math.max(w, h) * 0.85
  );
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
  ctx.restore(); // content

  const neon = "rgba(56, 189, 248, 0.95)";
  const mint = "rgba(110, 231, 183, 0.90)";
  const dim = "rgba(148, 163, 184, 0.55)";

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  if (panel.type === "graph") {
    // oscilloscope graph
    ctx.strokeStyle = mint;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const mid = h * 0.55;
    for (let x = 0; x < w; x++) {
      const nx = x / w;
      const y =
        mid +
        Math.sin(nx * 10 + panel.osc * 2.2) * (h * 0.12) +
        Math.sin(nx * 24 + panel.osc * 1.1) * (h * 0.05);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke(); // markers

    ctx.globalAlpha = 0.65;
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      const y = (h * i) / 6;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  if (panel.type === "network") {
    // network nodes
    const rng = mulberry32(panel.seed);
    const nodes: Vec2[] = [];
    const n = 22;
    for (let i = 0; i < n; i++) {
      nodes.push({
        x: (0.1 + rng() * 0.8) * w,
        y: (0.12 + rng() * 0.76) * h,
      });
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < w * 0.32) {
          const a = clamp(1 - d / (w * 0.32), 0, 1);
          ctx.strokeStyle = `rgba(56,189,248,${0.22 * a})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    for (const p of nodes) {
      const pulse = 0.6 + 0.4 * Math.sin(panel.osc * 2 + (p.x + p.y) * 0.01);
      ctx.fillStyle = `rgba(110,231,183,${0.55 * pulse})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2 + 0.8 * pulse, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (panel.type === "map") {
    // abstract world map dots + arcs
    const rng = mulberry32(panel.seed);
    ctx.globalAlpha = 0.8;
    for (let i = 0; i < 420; i++) {
      const x = rng() * w;
      const y = rng() * h;
      const band = 0.28 + 0.55 * Math.sin((x / w) * Math.PI);
      if (rng() < band * 0.35) {
        ctx.fillStyle = rng() > 0.55 ? mint : neon;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = "rgba(56,189,248,0.35)";
    ctx.lineWidth = 1.2;

    const a: Vec2 = { x: w * (0.22 + 0.06 * Math.sin(panel.osc)), y: h * 0.42 };
    const b: Vec2 = {
      x: w * (0.72 + 0.04 * Math.cos(panel.osc * 0.9)),
      y: h * 0.62,
    };
    const c: Vec2 = {
      x: w * 0.52,
      y: h * (0.28 + 0.05 * Math.sin(panel.osc * 1.3)),
    };

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(c.x, c.y, b.x, b.y);
    ctx.stroke();

    ctx.fillStyle = mint;
    ctx.beginPath();
    ctx.arc(a.x, a.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  if (panel.type === "code" || panel.type === "logs") {
    // scrolling text, code and logs
    const lines =
      panel.type === "code"
        ? [
            "export const breach = async () => {",
            "  const entropy = getEntropy()",
            "  const key = deriveKey(entropy)",
            "  return vault.decrypt(key)",
            "}",
            'router.push("/lab")',
            "commit: 9f3a1c2, hardened auth",
            "ship: edge runtime, streaming",
          ]
        : [
            "[core] link established",
            "[edge] handshake ok",
            "[telemetry] spike detected",
            "[ai] model synced",
            "[vault] rotated keys",
            "[ops] staging sealed",
            "[net] route optimized",
          ];

    const speed = panel.type === "code" ? 18 : 26;
    const offset = (panel.t * speed) % (lines.length * 18);

    ctx.globalCompositeOperation = "source-over";
    ctx.font =
      '12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
    ctx.textBaseline = "top";

    for (let i = 0; i < lines.length + 6; i++) {
      const y = 10 + i * 18 - offset;
      if (y < -30 || y > h + 20) continue;
      const idx = i % lines.length;
      const alpha = clamp(1 - Math.abs((y - h * 0.5) / (h * 0.75)), 0.25, 1);
      ctx.fillStyle =
        idx % 3 === 0
          ? `rgba(110,231,183,${0.85 * alpha})`
          : `rgba(56,189,248,${0.75 * alpha})`;
      ctx.fillText(lines[idx], 14, y);
    } // cursor pulse

    const cx = w * 0.62;
    const cy = h * 0.82;
    const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(panel.osc * 3.2));
    ctx.fillStyle = `rgba(110,231,183,${0.8 * pulse})`;
    ctx.fillRect(cx, cy, 10, 2);
  } // HUD top bar

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(15,23,42,0.65)";
  ctx.fillRect(0, 0, w, 26);
  ctx.fillStyle = "rgba(148,163,184,0.60)";
  ctx.font =
    '11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  ctx.fillText(`${panel.type.toUpperCase()} , node:${panel.id}`, 12, 7); // tiny status dots

  ctx.fillStyle = "rgba(110,231,183,0.9)";
  ctx.beginPath();
  ctx.arc(w - 34, 13, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(56,189,248,0.85)";
  ctx.beginPath();
  ctx.arc(w - 20, 13, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // scan flicker

  if (Math.random() < 0.06) {
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "rgba(255,255,255,1)";
    const y = Math.random() * h;
    ctx.fillRect(0, y, w, 1);
    ctx.restore();
  }
}

function usePanels() {
  return useMemo(() => {
    const seedBase = 1337;
    const types: PanelType[] = [
      "map",
      "network",
      "graph",
      "code",
      "logs",
      "graph",
      "network",
      "code",
    ];
    const panels: Omit<Panel, "off" | "offCtx">[] = []; // layout, looks like monitors in a lab

    const layout = [
      { x: 0.06, y: 0.16, w: 0.34, h: 0.28, d: 0.9, t: -0.06 },
      { x: 0.44, y: 0.1, w: 0.5, h: 0.3, d: 0.7, t: 0.04 },
      { x: 0.1, y: 0.5, w: 0.42, h: 0.3, d: 0.6, t: 0.03 },
      { x: 0.56, y: 0.44, w: 0.36, h: 0.36, d: 0.85, t: -0.02 },
      { x: 0.24, y: 0.82, w: 0.52, h: 0.16, d: 0.45, t: 0.02 },
    ];

    for (let i = 0; i < layout.length; i++) {
      panels.push({
        id: String(100 + i),
        type: types[i % types.length],
        x: layout[i].x,
        y: layout[i].y,
        w: layout[i].w,
        h: layout[i].h,
        depth: layout[i].d,
        tilt: layout[i].t,
        seed: seedBase + i * 97,
        osc: i * 1.7,
        t: i * 0.3,
      });
    }

    return panels;
  }, []);
}

function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef<Vec2>({ x: 0.5, y: 0.5 });
  const smoothPointer = useRef<Vec2>({ x: 0.5, y: 0.5 });
  const panelsBase = usePanels();
  const panelsRef = useRef<Panel[] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let w = 0;
    let h = 0;
    let dpr = 1;

    const initPanels = () => {
      const next: Panel[] = panelsBase.map((p) => {
        const off = document.createElement("canvas"); // offscreen resolution, crisp but not too heavy
        off.width = 720;
        off.height = 420;
        const offCtx = off.getContext("2d")!;
        return { ...p, off, offCtx };
      });
      panelsRef.current = next;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      pointer.current.x = clamp(e.clientX / Math.max(1, w), 0, 1);
      pointer.current.y = clamp(e.clientY / Math.max(1, h), 0, 1);
    };

    const drawBackdrop = (t: number) => {
      // base gradient
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#020617");
      g.addColorStop(1, "#030712");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h); // subtle fog

      ctx.save();
      ctx.globalAlpha = 0.35;
      const rg = ctx.createRadialGradient(
        w * 0.6,
        h * 0.35,
        10,
        w * 0.6,
        h * 0.35,
        Math.max(w, h) * 0.75
      );
      rg.addColorStop(0, "rgba(56,189,248,0.20)");
      rg.addColorStop(0.55, "rgba(110,231,183,0.08)");
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
      ctx.restore(); // star micro noise, procedural

      ctx.save();
      ctx.globalAlpha = 0.12;
      for (let i = 0; i < 90; i++) {
        const x = (Math.sin(t * 0.13 + i * 12.1) * 0.5 + 0.5) * w;
        const y = (Math.cos(t * 0.11 + i * 9.7) * 0.5 + 0.5) * h;
        ctx.fillStyle =
          i % 3 === 0 ? "rgba(110,231,183,0.35)" : "rgba(56,189,248,0.28)";
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.restore();
    };

    const drawPanels = (dt: number, t: number) => {
      const panels = panelsRef.current;
      if (!panels) return; // smooth pointer

      smoothPointer.current.x = lerp(
        smoothPointer.current.x,
        pointer.current.x,
        0.06
      );
      smoothPointer.current.y = lerp(
        smoothPointer.current.y,
        pointer.current.y,
        0.06
      );

      const px = (smoothPointer.current.x - 0.5) * 2;
      const py = (smoothPointer.current.y - 0.5) * 2;

      for (const p of panels) {
        renderPanelContent(p, dt);

        const X = p.x * w;
        const Y = p.y * h;
        const W = p.w * w;
        const H = p.h * h;

        const parX = px * 28 * p.depth;
        const parY = py * 18 * p.depth;
        const float = Math.sin(t * 0.7 + p.seed * 0.001) * (3 + 4 * p.depth); // glass frame

        ctx.save();
        ctx.translate(X + parX + W * 0.5, Y + parY + H * 0.5 + float);
        ctx.rotate(p.tilt); // shadow, soft

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        roundRect(ctx, -W * 0.5 + 12, -H * 0.5 + 14, W, H, 18);
        ctx.fill(); // border glow

        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(110,231,183,0.30)";
        roundRect(ctx, -W * 0.5, -H * 0.5, W, H, 18);
        ctx.stroke(); // inner glow

        ctx.globalCompositeOperation = "lighter";
        ctx.shadowColor = "rgba(56,189,248,0.25)";
        ctx.shadowBlur = 24;
        ctx.strokeStyle = "rgba(56,189,248,0.18)";
        roundRect(ctx, -W * 0.5 + 2, -H * 0.5 + 2, W - 4, H - 4, 16);
        ctx.stroke(); // draw content

        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 0.98; // micro glitch slice, rare, modern

        const glitch = Math.random() < 0.015;
        if (glitch) {
          const sliceY = Math.random() * H;
          const sliceH = 6 + Math.random() * 18;
          const shift = (Math.random() - 0.5) * 26;
          ctx.drawImage(p.off, -W * 0.5, -H * 0.5, W, H);
          ctx.save();
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.rect(-W * 0.5, -H * 0.5 + sliceY, W, sliceH);
          ctx.clip();
          ctx.drawImage(p.off, -W * 0.5 + shift, -H * 0.5, W, H);
          ctx.restore();
        } else {
          ctx.drawImage(p.off, -W * 0.5, -H * 0.5, W, H);
        } // subtle highlight line

        ctx.globalAlpha = 0.25;
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.beginPath();
        ctx.moveTo(-W * 0.5 + 10, -H * 0.5 + 10);
        ctx.lineTo(W * 0.5 - 10, -H * 0.5 + 10);
        ctx.stroke();

        ctx.restore();
      }
    };

    const drawPostFX = (t: number) => {
      // vignette
      ctx.save();
      const vg = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        10,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.9
      );
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
      ctx.restore(); // scanline sweep, very subtle

      ctx.save();
      ctx.globalAlpha = 0.06;
      const y = ((t * 120) % (h + 220)) - 110;
      const sg = ctx.createLinearGradient(0, y - 30, 0, y + 30);
      sg.addColorStop(0, "rgba(56,189,248,0)");
      sg.addColorStop(0.5, "rgba(56,189,248,1)");
      sg.addColorStop(1, "rgba(56,189,248,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, y - 30, w, 60);
      ctx.restore(); // noise, procedural

      ctx.save();
      ctx.globalAlpha = 0.035;
      for (let i = 0; i < 1500; i++) {
        const x = Math.floor(Math.random() * w);
        const y = Math.floor(Math.random() * h);
        ctx.fillStyle =
          Math.random() > 0.5 ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.restore();
    };

    // Główna pętla animacji
    const animate = (t: number) => {
      const dt = Math.min((t - last) / 1000, 1 / 20);
      last = t;

      drawBackdrop(t / 1000);
      drawPanels(dt, t / 1000);
      drawPostFX(t / 1000);

      raf = requestAnimationFrame(animate);
    };

    // Inicjalizacja
    initPanels();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    resize();
    raf = requestAnimationFrame(animate);

    // Cleanup - czyszczenie przy demontażu komponentu
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [panelsBase]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}

export default CyberBackground;

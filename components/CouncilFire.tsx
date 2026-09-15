"use client";

import { useEffect, useRef } from "react";

// The council in the round: a breathing ember hearth ringed by orientation circles,
// with a place-mark for each presence around the ring. Distinct from a single door.
export default function CouncilFire({ places = 1 }: { places?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    // Non-null locals so narrowing survives inside the closures below.
    const el: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let raf = 0;
    let t0: number | null = null;

    function glow(): string {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--glow").trim();
      return v || "224,151,90";
    }

    function size() {
      const dpr = window.devicePixelRatio || 1;
      W = el.clientWidth || 600;
      H = el.clientHeight || 360;
      el.width = Math.round(W * dpr);
      el.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(intensity: number) {
      const rgb = glow();
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.4;
      ctx.clearRect(0, 0, W, H);

      // faint concentric orientation rings
      ctx.strokeStyle = `rgba(${rgb},${(0.10 * intensity).toFixed(3)})`;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (R * i) / 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // central hearth glow
      const hearth = ctx.createRadialGradient(cx, cy, 2, cx, cy, R * 0.9);
      hearth.addColorStop(0, `rgba(${rgb},${(0.9 * intensity).toFixed(3)})`);
      hearth.addColorStop(0.35, `rgba(${rgb},${(0.4 * intensity).toFixed(3)})`);
      hearth.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = hearth;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // place-marks around the ring — one per presence
      const n = Math.max(1, places);
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const px = cx + Math.cos(a) * R;
        const py = cy + Math.sin(a) * R;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${(0.85 * intensity).toFixed(3)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb},${(0.25 * intensity).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    function frame(ts: number) {
      if (t0 === null) t0 = ts;
      const elapsed = (ts - t0) / 1000;
      const breath = 0.5 - 0.5 * Math.cos(elapsed * ((2 * Math.PI) / 5.5));
      draw(0.8 + 0.2 * breath);
      raf = requestAnimationFrame(frame);
    }

    size();
    if (reduce) {
      draw(0.94);
    } else {
      raf = requestAnimationFrame(frame);
    }

    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        size();
        if (reduce) draw(0.94);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [places]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}

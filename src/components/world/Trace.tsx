"use client";

import { useEffect, useRef } from "react";
import { useScrollLoop, requestTick } from "./useScrollLoop";
import { BEAT } from "./events";

/* The trace: one heartbeat line through the whole page, built from the live
   layout. Markers in the DOM:
     [data-beat]          a beat (hero H1 uses data-beat="center")
     [data-node]          a moment in time; data-node="big" for the big ones
     [data-swing]         sections the line swings between, in page order
   The line stays in the wrap's side gutters and is strictly monotonic in y. */
type Ev =
  | { kind: "beat"; y: number }
  | { kind: "node"; y: number; big: boolean }
  | { kind: "swing"; y: number; y1: number; y2: number };

const BEAT_PTS: [number, number][] = [[0, -28], [6, -20], [-5, -14], [22, -6], [-12, 4], [4, 12], [0, 20]];
const SVG_NS = "http://www.w3.org/2000/svg";

export default function Trace() {
  const svg = useRef<SVGSVGElement>(null);
  const ghost = useRef<SVGPathElement>(null);
  const live = useRef<SVGPathElement>(null);
  const nodesG = useRef<SVGGElement>(null);
  // the reticle lives in its own small layer, moved by transform, so its
  // pulse never repaints the page-tall trace
  const reticle = useRef<SVGSVGElement>(null);
  const st = useRef({
    samples: new Float32Array(0), // [len, x, y] triples
    total: 0,
    nodes: [] as { y: number; el: SVGCircleElement; on: boolean }[],
    vh: 1,
    ok: false,
  });

  useEffect(() => {
    let t = 0;
    const build = () => {
      try {
        buildTrace();
      } catch {
        document.documentElement.classList.add("no-field");
        st.current.ok = false;
      }
    };
    const buildTrace = () => {
      const s = svg.current!, gp = ghost.current!, lp = live.current!;
      const main = document.querySelector("main");
      const wrap = main?.querySelector<HTMLElement>(".wrap");
      const hero = document.getElementById("hero");
      if (!main || !wrap || !hero) return;

      s.style.height = "0px";
      const sy = window.scrollY, sx = window.scrollX;
      const abs = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + sy, bottom: r.bottom + sy, left: r.left + sx, right: r.right + sx, h: r.height };
      };
      const wr = abs(wrap), wcs = getComputedStyle(wrap);
      const L = wr.left + parseFloat(wcs.paddingLeft) / 2;
      const R = wr.right - parseFloat(wcs.paddingRight) / 2;
      // beats are drawn for a 48px gutter; shrink them with it so they stay out of the text
      const amp = Math.min(1, parseFloat(wcs.paddingLeft) / 48);

      const evs: Ev[] = [];
      document.querySelectorAll<HTMLElement>("[data-beat]").forEach((el) => {
        const r = abs(el);
        evs.push({ kind: "beat", y: el.dataset.beat === "center" ? r.top + r.h / 2 : r.top + 28 });
      });
      document.querySelectorAll<HTMLElement>("[data-node]").forEach((el) => {
        const r = abs(el);
        evs.push({ kind: "node", y: r.top + r.h / 2, big: el.dataset.node === "big" });
      });
      const secs = Array.from(document.querySelectorAll<HTMLElement>("[data-swing]"));
      for (let i = 0; i < secs.length - 1; i++) {
        const a = secs[i], b = secs[i + 1];
        const aEnd = abs(a).bottom - parseFloat(getComputedStyle(a).paddingBottom);
        const bStart = abs(b).top + parseFloat(getComputedStyle(b).paddingTop);
        const gap = bStart - aEnd;
        if (gap <= 0) continue;
        const h = Math.min(gap * 0.8, 220), mid = (aEnd + bStart) / 2;
        evs.push({ kind: "swing", y: mid - h / 2, y1: mid - h / 2, y2: mid + h / 2 });
      }
      evs.sort((a, b) => a.y - b.y);

      const docH = document.documentElement.scrollHeight;
      let left = true, x = L, cur = abs(hero).top;
      let d = `M${L.toFixed(1)},${cur.toFixed(1)}`;
      const nodeSpecs: { x: number; y: number; big: boolean }[] = [];
      const P = (px: number, py: number) => `${px.toFixed(1)},${py.toFixed(1)}`;
      for (const e of evs) {
        if (e.y - cur < 30) continue;
        if (e.kind === "beat") {
          if (e.y - 28 <= cur) continue;
          const sgn = left ? 1 : -1;
          for (const [dx, dy] of BEAT_PTS) d += ` L${P(x + sgn * dx * amp, e.y + dy)}`;
          cur = e.y + 20;
        } else if (e.kind === "node") {
          d += ` L${P(x, e.y)}`;
          nodeSpecs.push({ x, y: e.y, big: e.big });
          cur = e.y;
        } else {
          const nx = left ? R : L, mid = (e.y1 + e.y2) / 2;
          d += ` L${P(x, e.y1)} C${P(x, mid)} ${P(nx, mid)} ${P(nx, e.y2)}`;
          x = nx;
          left = !left;
          cur = e.y2;
        }
      }
      d += ` L${P(x, Math.max(cur, docH))}`;

      s.setAttribute("width", String(document.documentElement.clientWidth));
      s.style.height = `${docH}px`;
      gp.setAttribute("d", d);
      lp.setAttribute("d", d);

      const total = lp.getTotalLength();
      const n = Math.max(2, Math.ceil(total / 6) + 1);
      const samples = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const len = Math.min(total, i * 6);
        const pt = lp.getPointAtLength(len);
        samples[i * 3] = len;
        samples[i * 3 + 1] = pt.x;
        samples[i * 3 + 2] = pt.y;
      }
      lp.style.strokeDasharray = `${total}`;

      const g = nodesG.current!;
      g.replaceChildren();
      const nodes = nodeSpecs.map(({ x: nx, y, big }) => {
        const c = document.createElementNS(SVG_NS, "circle");
        c.setAttribute("cx", nx.toFixed(1));
        c.setAttribute("cy", y.toFixed(1));
        c.setAttribute("r", big ? "7" : "4.5");
        c.setAttribute("class", "node");
        g.appendChild(c);
        return { y, el: c, on: false };
      });

      st.current = { samples, total, nodes, vh: window.innerHeight, ok: true };
      requestTick();
    };
    const schedule = () => {
      clearTimeout(t);
      t = window.setTimeout(build, 120);
    };
    build();
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    const main = document.querySelector("main");
    if (main) ro.observe(main);
    document.fonts?.ready.then(schedule);

    let beatT = 0;
    const onBeat = () => {
      const s = reticle.current;
      if (!s) return;
      s.classList.remove("fast");
      void s.getBoundingClientRect();
      s.classList.add("fast");
      clearTimeout(beatT);
      beatT = window.setTimeout(() => s.classList.remove("fast"), 950);
    };
    window.addEventListener(BEAT, onBeat);
    return () => {
      clearTimeout(t);
      clearTimeout(beatT);
      window.removeEventListener("resize", schedule);
      window.removeEventListener(BEAT, onBeat);
      ro.disconnect();
    };
  }, []);

  useScrollLoop((scrollY) => {
    const s = st.current;
    if (!s.ok || !live.current || !reticle.current) return;
    const target = scrollY + s.vh * 0.62;
    const smp = s.samples, n = smp.length / 3;
    let lo = 0, hi = n - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (smp[mid * 3 + 2] <= target) lo = mid;
      else hi = mid - 1;
    }
    const len = smp[lo * 3], x = smp[lo * 3 + 1], y = smp[lo * 3 + 2];
    live.current.style.strokeDashoffset = String(s.total - len);
    reticle.current.style.transform = `translate3d(${(x - 24).toFixed(1)}px, ${(y - 24).toFixed(1)}px, 0)`;
    for (const nd of s.nodes) {
      const on = nd.y <= y + 0.5;
      if (on !== nd.on) {
        nd.on = on;
        nd.el.classList.toggle("on", on);
      }
    }
  });

  return (
    <>
      <svg ref={svg} className="trace" aria-hidden="true" height="0">
        <path ref={ghost} className="ghost" />
        <path ref={live} className="live" />
        <g ref={nodesG} />
      </svg>
      <svg ref={reticle} className="reticle" aria-hidden="true" width="48" height="48" viewBox="-24 -24 48 48">
        <circle className="pulse" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle r="10" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M-18 0H-10M10 0H18M0 -18V-10M0 10V18" stroke="currentColor" strokeWidth="1" />
        <circle r="2" fill="currentColor" />
      </svg>
    </>
  );
}

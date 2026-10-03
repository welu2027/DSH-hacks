"use client";

import { useEffect, useRef } from "react";

/* One shared requestAnimationFrame loop for every scroll-driven layer.
   Scroll and resize only schedule a frame; the frame reads scrollY once and
   hands it to each subscriber. Subscribers must not read layout here —
   measure in their own rebuild step and cache. */
type Sub = (scrollY: number) => void;

const subs = new Set<Sub>();
let raf = 0;
let bound = false;

function frame() {
  raf = 0;
  const y = window.scrollY;
  subs.forEach((fn) => fn(y));
}

export function requestTick() {
  if (!raf) raf = requestAnimationFrame(frame);
}

function bind() {
  if (bound) return;
  bound = true;
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
}

export function useScrollLoop(fn: Sub) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    bind();
    const sub: Sub = (y) => ref.current(y);
    subs.add(sub);
    requestTick();
    return () => {
      subs.delete(sub);
    };
  }, []);
}

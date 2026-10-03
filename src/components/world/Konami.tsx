"use client";

import { useEffect } from "react";

/* ↑↑↓↓←→←→BA anywhere dithers every serif heading for five seconds. */
const CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function Konami() {
  useEffect(() => {
    let i = 0, t = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === CODE[i] ? i + 1 : k === CODE[0] ? 1 : 0;
      if (i < CODE.length) return;
      i = 0;
      const html = document.documentElement;
      html.classList.add("konami");
      clearTimeout(t);
      t = window.setTimeout(() => html.classList.remove("konami"), 5000);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, []);
  return null;
}

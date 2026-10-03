"use client";

import { useEffect, useState } from "react";

export const DEADLINE = new Date("2026-11-07T23:45:00-08:00").getTime();

export function remaining(now = Date.now()) {
  const ms = Math.max(0, DEADLINE - now);
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function countdownString(now = Date.now()) {
  const r = remaining(now);
  if (DEADLINE - now <= 0) return "submissions are closed.";
  return `${r.days}d ${pad(r.hours)}h ${pad(r.minutes)}m ${pad(r.seconds)}s until submissions close`;
}

export default function Countdown() {
  const [r, setR] = useState<ReturnType<typeof remaining> | null>(null);
  useEffect(() => {
    setR(remaining());
    const id = window.setInterval(() => setR(remaining()), 1000);
    return () => clearInterval(id);
  }, []);
  const units: [keyof ReturnType<typeof remaining>, string][] = [
    ["days", "days"], ["hours", "hours"], ["minutes", "minutes"], ["seconds", "seconds"],
  ];
  return (
    <div className="countdown" role="timer" aria-live="off">
      {units.map(([k, label]) => (
        <div key={k}>
          <div className="n">{r ? pad(r[k]) : "--"}</div>
          <div className="u">{label}</div>
        </div>
      ))}
    </div>
  );
}

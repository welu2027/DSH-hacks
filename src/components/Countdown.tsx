"use client";

import { useEffect, useState } from "react";

export const DEADLINE = new Date("2026-11-14T23:45:00-08:00").getTime();

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
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now !== null && now >= DEADLINE) {
    return <p className="cd-closed">Submissions closed — winners announced Nov 23</p>;
  }
  const r = now === null ? null : remaining(now);
  const units: [keyof ReturnType<typeof remaining>, string][] = [
    ["days", "Days"], ["hours", "Hours"], ["minutes", "Min"], ["seconds", "Sec"],
  ];
  return (
    <div className="cd">
      <div className="countdown" role="timer" aria-live="off">
        {units.map(([k, label]) => (
          <div key={k}>
            <div className="n">{r ? pad(r[k]) : "--"}</div>
            <div className="u">{label}</div>
          </div>
        ))}
      </div>
      <p className="cd-cap">until submissions close</p>
    </div>
  );
}

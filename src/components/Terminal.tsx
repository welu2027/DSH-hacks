"use client";

import { useEffect, useRef, useState } from "react";
import { countdownString } from "./Countdown";
import { emitBeat, emitOpenPlate } from "./world/events";
import { projects } from "./plates/projects";

/* The footer prompt is a real one-line shell. Nothing here collects data. */
type Line = { kind: "cmd" | "out" | "hint"; text: string };
const MAX = 8;

function run(input: string): Line[] | "clear" | "exit" {
  const [cmd, ...args] = input.trim().split(/\s+/);
  switch (cmd) {
    case "":
      return [];
    case "help":
      return [{ kind: "out", text: "help  whoami  projects  open <n>  deadline  beat  sudo submit  clear  exit" }];
    case "whoami":
      return [{ kind: "out", text: "a builder, probably" }];
    case "projects":
      return [{ kind: "out", text: `${projects.length} on file. try: open 1` }];
    case "open": {
      const n = Number(args[0]);
      if (!projects.some((p) => p.no === n)) return [{ kind: "out", text: `no project ${args[0] ?? ""}. try a number from 1 to ${projects.length}` }];
      emitOpenPlate(n);
      return [{ kind: "out", text: `opening project ${String(n).padStart(2, "0")}` }];
    }
    case "deadline":
      return [{ kind: "out", text: countdownString() }];
    case "beat":
      emitBeat();
      return [{ kind: "out", text: "♥" }];
    case "sudo":
      if (args[0] === "submit") return [{ kind: "out", text: "nice try. https://dsh-hacks-v2.devpost.com/" }];
      break;
    case "clear":
      return "clear";
    case "exit":
      return "exit";
  }
  return [{ kind: "out", text: `command not found: ${cmd}. try help` }];
}

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<Line[]>([{ kind: "hint", text: "type help" }]);
  const input = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = run(value);
    setValue("");
    if (res === "exit") {
      setOpen(false);
      input.current?.blur();
      return;
    }
    if (res === "clear") return setLines([]);
    setLines((ls) => [...ls, { kind: "cmd" as const, text: `$ ${value}` }, ...res].slice(-MAX));
  };

  return (
    <div className="term" ref={root}>
      {open && (
        <div className="term-panel" aria-live="polite">
          {lines.map((l, i) => (
            <p key={i} className={l.kind}>{l.text}</p>
          ))}
        </div>
      )}
      <form className="term-line" onSubmit={submit} onClick={() => input.current?.focus()}>
        <label htmlFor="term-in">hacker@dsh:~$</label>
        <input
          id="term-in"
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              input.current?.blur();
            }
          }}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          style={{ width: open || value ? "16ch" : "1ch" }}
        />
        {!open && !value && <span className="cursor" aria-hidden="true">▌</span>}
      </form>
    </div>
  );
}

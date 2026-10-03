"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { projects, type Project } from "./projects";
import Lightbox from "./Lightbox";
import { OPEN_PLATE } from "@/components/world/events";

/* One lightbox for the whole page. Marquee and Gallery open it with their own
   list (so prev/next walks what you were looking at); the terminal's
   `open <n>` reaches it through a window event. */
type Open = (list: Project[], index: number) => void;
const Ctx = createContext<Open>(() => {});
export const useOpenPlate = () => useContext(Ctx);

export default function PlatesProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<{ list: Project[]; index: number } | null>(null);
  const open = useCallback<Open>((list, index) => setView({ list, index }), []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const no = (e as CustomEvent<{ no: number }>).detail.no;
      const i = projects.findIndex((p) => p.no === no);
      if (i >= 0) setView({ list: projects, index: i });
    };
    window.addEventListener(OPEN_PLATE, onOpen);
    return () => window.removeEventListener(OPEN_PLATE, onOpen);
  }, []);

  return (
    <Ctx.Provider value={open}>
      {children}
      <Lightbox
        view={view}
        onIndex={(index) => setView((v) => (v ? { ...v, index } : v))}
        onClose={() => setView(null)}
      />
    </Ctx.Provider>
  );
}

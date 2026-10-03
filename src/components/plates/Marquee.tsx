"use client";

import { projects } from "./projects";
import Plate from "./Plate";
import { useOpenPlate } from "./PlatesProvider";

const winners = projects.filter((p) => p.winner);

/* Winner plates on an endless loop. The second set only exists to close the
   loop, so it is hidden from assistive tech and the tab order. */
export default function Marquee() {
  const open = useOpenPlate();
  const set = (dup: boolean) => (
    <div className="marquee-set" aria-hidden={dup || undefined} inert={dup || undefined}>
      {winners.map((p, i) => (
        <div key={p.no} style={{ height: 132 }}>
          <Plate project={p} caption={false} onOpen={() => open(winners, i)} />
        </div>
      ))}
    </div>
  );
  return (
    <section className="marquee" aria-label="V1 winning projects">
      <div className="marquee-track">
        {set(false)}
        {set(true)}
      </div>
    </section>
  );
}

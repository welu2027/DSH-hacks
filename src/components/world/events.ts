/* Window events that let the hidden terminal reach the world layers and the
   lightbox without threading props through the whole page. */
export const OPEN_PLATE = "dsh:open-plate"; // detail: { no: number }
export const BEAT = "dsh:beat";

export const emitOpenPlate = (no: number) =>
  window.dispatchEvent(new CustomEvent(OPEN_PLATE, { detail: { no } }));
export const emitBeat = () => window.dispatchEvent(new Event(BEAT));

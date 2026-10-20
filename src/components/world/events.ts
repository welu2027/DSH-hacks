/* Window event that lets the hidden terminal open the lightbox without
   threading props through the whole page. */
export const OPEN_PLATE = "dsh:open-plate"; // detail: { no: number }

export const emitOpenPlate = (no: number) =>
  window.dispatchEvent(new CustomEvent(OPEN_PLATE, { detail: { no } }));

/* Atkinson dither to two inks: diffuse 6/8 of the error to six neighbours.
   Used by the live scan fields (art/DitherField). */
export type RGB = [number, number, number];
export const INK: RGB = [10, 20, 228]; // --dsh-blue

/* Dither a luminance buffer (0-255, mutated) into `out`. off=null leaves dark
   pixels transparent. */
export function ditherLum(L: Float32Array, w: number, h: number, out: Uint8ClampedArray, off: RGB | null, on: RGB = INK) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const nv = L[i] < 128 ? 0 : 255;
      const err = (L[i] - nv) / 8;
      if (x + 1 < w) L[i + 1] += err;
      if (x + 2 < w) L[i + 2] += err;
      if (y + 1 < h) {
        if (x > 0) L[i + w - 1] += err;
        L[i + w] += err;
        if (x + 1 < w) L[i + w + 1] += err;
      }
      if (y + 2 < h) L[i + 2 * w] += err;
      const o = i * 4;
      if (nv) {
        out[o] = on[0]; out[o + 1] = on[1]; out[o + 2] = on[2]; out[o + 3] = 255;
      } else if (off) {
        out[o] = off[0]; out[o + 1] = off[1]; out[o + 2] = off[2]; out[o + 3] = 255;
      } else {
        out[o + 3] = 0;
      }
    }
  }
}

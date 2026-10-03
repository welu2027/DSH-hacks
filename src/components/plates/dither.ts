/* Atkinson dither to two inks. Darken first (gamma 1.9) so plates read as
   mostly film with cobalt highlights, then diffuse 6/8 of the error. */
export type RGB = [number, number, number];
export const COBALT: RGB = [53, 87, 255];
export const FILM: RGB = [7, 11, 22];
export const PAPER: RGB = [243, 245, 250];

/* Dither a luminance buffer (0-255, mutated) into `out`. off=null leaves dark
   pixels transparent. */
export function ditherLum(L: Float32Array, w: number, h: number, out: Uint8ClampedArray, off: RGB | null, on: RGB = COBALT) {
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

/* RGBA → darkened luminance. invert flips it first (dark marks become ink);
   gamma sets how hard it darkens (portraits use a lighter curve). */
export function toLum(src: Uint8ClampedArray, w: number, h: number, invert = false, gamma = 1.9) {
  const L = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    let lum = 0.2126 * src[o] + 0.7152 * src[o + 1] + 0.0722 * src[o + 2];
    const a = src[o + 3] / 255;
    lum = lum * a + (invert ? 255 : 0) * (1 - a);
    if (invert) lum = 255 - lum;
    L[i] = 255 * Math.pow(lum / 255, gamma);
  }
  return L;
}

export function ditherImage(img: ImageData, off: RGB | null, invert = false, gamma = 1.9) {
  const out = new ImageData(img.width, img.height);
  ditherLum(toLum(img.data, img.width, img.height, invert, gamma), img.width, img.height, out.data, off);
  return out;
}

/* Duotone film → cobalt → paper, break at 0.6. The "developed" view of a
   generated plate. */
export function duotone(img: ImageData) {
  const out = new ImageData(img.width, img.height);
  const s = img.data, d = out.data;
  for (let o = 0; o < s.length; o += 4) {
    const t = (0.2126 * s[o] + 0.7152 * s[o + 1] + 0.0722 * s[o + 2]) / 255;
    const [a, b, k] = t < 0.6 ? [FILM, COBALT, t / 0.6] : [COBALT, PAPER, (t - 0.6) / 0.4];
    d[o] = a[0] + (b[0] - a[0]) * k;
    d[o + 1] = a[1] + (b[1] - a[1]) * k;
    d[o + 2] = a[2] + (b[2] - a[2]) * k;
    d[o + 3] = 255;
  }
  return out;
}

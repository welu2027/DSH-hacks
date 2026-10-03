import type { Project } from "./projects";
import { ditherImage, duotone, FILM } from "./dither";

/* Plate sources, cached per (project, size). `dith` is the 1-bit plate at
   exactly w×h; `dev` is the developed view: the color thumbnail for real
   images (drawn at 2× so it stays crisp), or a film→cobalt→paper duotone
   for generated plates. */
export type PlateSource = { dith: HTMLCanvasElement; dev: HTMLCanvasElement; real: boolean };

const cache = new Map<string, Promise<PlateSource>>();
const images = new Map<string, Promise<HTMLImageElement>>();

export function getPlate(p: Project, w: number, h: number) {
  const key = `${p.no}:${w}x${h}`;
  let hit = cache.get(key);
  if (!hit) {
    hit = make(p, w, h);
    cache.set(key, hit);
  }
  return hit;
}

function loadImage(src: string) {
  let hit = images.get(src);
  if (!hit) {
    hit = new Promise((res, rej) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = src;
    });
    images.set(src, hit);
  }
  return hit;
}

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

function cover(ctx: CanvasRenderingContext2D, im: HTMLImageElement, w: number, h: number) {
  const s = Math.max(w / im.naturalWidth, h / im.naturalHeight);
  const dw = im.naturalWidth * s, dh = im.naturalHeight * s;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

async function make(p: Project, w: number, h: number): Promise<PlateSource> {
  const base = canvas(w, h);
  const ctx = base.getContext("2d", { willReadFrequently: true })!;
  let im: HTMLImageElement | null = null;
  if (p.img) {
    try {
      im = await loadImage(p.img);
      cover(ctx, im, w, h);
    } catch {
      im = null;
    }
  }
  if (!im) await generate(ctx, p.t, w, h);

  const src = ctx.getImageData(0, 0, w, h);
  const dith = canvas(w, h);
  dith.getContext("2d")!.putImageData(ditherImage(src, FILM), 0, 0);

  let dev: HTMLCanvasElement;
  if (im) {
    dev = canvas(w * 2, h * 2);
    cover(dev.getContext("2d")!, im, w * 2, h * 2);
  } else {
    dev = canvas(w, h);
    dev.getContext("2d")!.putImageData(duotone(src), 0, 0);
  }
  return { dith, dev, real: !!im };
}

/* Square portraits (judges): dithered at `size`, with the photo at 2×. */
const portraits = new Map<string, Promise<PlateSource>>();
export function getPortrait(src: string, size: number) {
  const key = `${src}:${size}`;
  let hit = portraits.get(key);
  if (!hit) {
    hit = loadImage(src).then((im) => {
      const base = canvas(size, size);
      const ctx = base.getContext("2d", { willReadFrequently: true })!;
      cover(ctx, im, size, size);
      const dith = canvas(size, size);
      dith.getContext("2d")!.putImageData(ditherImage(ctx.getImageData(0, 0, size, size), FILM, false, 1.1), 0, 0);
      const dev = canvas(size * 2, size * 2);
      cover(dev.getContext("2d")!, im, size * 2, size * 2);
      return { dith, dev, real: true };
    });
    portraits.set(key, hit);
  }
  return hit;
}

/* ---------- generated plates ---------- */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let serifFamily: Promise<string> | null = null;
function serif() {
  if (!serifFamily) {
    // next/font renames the family, so resolve it from the CSS variable.
    const fam = getComputedStyle(document.documentElement).getPropertyValue("--font-instrument-serif").trim() || '"Instrument Serif", serif';
    serifFamily = Promise.all([
      document.fonts.load(`100px ${fam}`),
      document.fonts.load(`italic 100px ${fam}`),
    ]).then(() => fam, () => fam);
  }
  return serifFamily;
}

async function generate(ctx: CanvasRenderingContext2D, title: string, w: number, h: number) {
  const fam = await serif();
  const r = mulberry32(hash(title));
  const g = (lo: number, hi: number) => Math.round(lo + r() * (hi - lo));

  const ang = r() * Math.PI * 2, cx = w / 2, cy = h / 2, len = Math.hypot(w, h) / 2;
  const lin = ctx.createLinearGradient(cx - Math.cos(ang) * len, cy - Math.sin(ang) * len, cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
  const g0 = g(8, 32), g1 = g(90, 170);
  lin.addColorStop(0, `rgb(${g0},${g0},${g0})`);
  lin.addColorStop(1, `rgb(${g1},${g1},${g1})`);
  ctx.fillStyle = lin;
  ctx.fillRect(0, 0, w, h);

  const blobs = 2 + Math.floor(r() * 3);
  for (let i = 0; i < blobs; i++) {
    const bx = r() * w, by = r() * h, br = (0.15 + r() * 0.35) * Math.max(w, h), v = g(200, 250);
    const rad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    rad.addColorStop(0, `rgba(${v},${v},${v},${0.5 + r() * 0.4})`);
    rad.addColorStop(1, `rgba(${v},${v},${v},0)`);
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, w, h);
  }

  // diagonal hatch band
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.translate(cx, cy);
  ctx.rotate((r() < 0.5 ? -1 : 1) * (Math.PI / 4));
  const bandW = (0.18 + r() * 0.2) * w, off = (r() - 0.5) * w * 0.6;
  ctx.beginPath();
  ctx.rect(off - bandW / 2, -len, bandW, len * 2);
  ctx.clip();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = Math.max(1, w / 128);
  for (let x = -len; x < len; x += Math.max(3, w / 40)) {
    ctx.beginPath();
    ctx.moveTo(x, -len);
    ctx.lineTo(x + len, len);
    ctx.stroke();
  }
  ctx.restore();

  // thin reticle
  const rx = (0.2 + r() * 0.6) * w, ry = (0.2 + r() * 0.6) * h, rr = w * (0.06 + r() * 0.05);
  ctx.strokeStyle = "rgba(255,255,255,.8)";
  ctx.lineWidth = Math.max(1, w / 160);
  ctx.beginPath();
  ctx.arc(rx, ry, rr, 0, Math.PI * 2);
  ctx.moveTo(rx - rr * 1.8, ry); ctx.lineTo(rx - rr, ry);
  ctx.moveTo(rx + rr, ry); ctx.lineTo(rx + rr * 1.8, ry);
  ctx.moveTo(rx, ry - rr * 1.8); ctx.lineTo(rx, ry - rr);
  ctx.moveTo(rx, ry + rr); ctx.lineTo(rx, ry + rr * 1.8);
  ctx.stroke();

  // the title's first letter, 95% of the plate's height
  const letter = (title.trim().match(/[\p{L}\p{N}]/u)?.[0] ?? "?").toUpperCase();
  const v = g(215, 245);
  ctx.fillStyle = `rgb(${v},${v},${v})`;
  ctx.font = `${r() < 0.4 ? "italic " : ""}${Math.round(h * 0.95)}px ${fam}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(letter, w * (0.42 + r() * 0.16), h * 0.8);
}

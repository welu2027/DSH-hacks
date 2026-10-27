"""Render the DSH Hacks mountain range: an original, procedurally generated
landscape in the DSH blues, split into four depth layers for parallax.

    python3 scripts/terrain.py

Writes public/terrain/layer-{0..3}.webp (0 = farthest) and
src/components/world/terrain.json (the town layer's crest, so the particle
canvas can land its lights on it).

How: a ridged multifractal heightmap, rendered with a perspective
"voxel-space" ray march (front to back with an occlusion buffer), lit by a
low sun from the left, with snow on high flat ground and aerial haze that
thickens with distance.
"""
import json
import os

import numpy as np
from PIL import Image, ImageFilter

W, H = 2400, 1100           # output frame
HORIZON = 0.56 * H          # horizon row
F = W * 0.95                # focal length in px
CAM_H = 0.075               # camera height
ZMIN, ZMAX, ZSTEPS = 0.05, 1.6, 2200
N = 2048                    # heightmap resolution
SEED = 11

# depth bands, near → far; layer files are numbered far → near
BANDS = [(ZMIN, 0.2), (0.2, 0.42), (0.42, 0.8), (0.8, ZMAX)]

rng = np.random.default_rng(SEED)


def upsample(grid, n):
    return np.asarray(Image.fromarray(grid.astype(np.float32), "F").resize((n, n), Image.BICUBIC))


def ridged(n, octaves=9, base=3):
    """Ridged multifractal: sharp crests that get rougher where they're high."""
    h = np.zeros((n, n), np.float32)
    weight = np.ones((n, n), np.float32)
    amp = 1.0
    for o in range(octaves):
        g = rng.random((base * 2 ** o + 1,) * 2) * 2 - 1
        r = 1 - np.abs(upsample(g, n))
        r = r * r * weight
        weight = np.clip(r * 2.0, 0, 1)
        h += r * amp
        amp *= 0.56
    return h / h.max()


def bilinear(a, x, z):
    """Sample a (z rows, x cols) at fractional coords in 0..1 (x wraps)."""
    n = a.shape[0]
    fx = (x % 1.0) * (n - 1)
    fz = np.clip(z, 0, 1) * (n - 1)
    x0 = np.floor(fx).astype(int); z0 = np.floor(fz).astype(int)
    x1 = np.minimum(x0 + 1, n - 1); z1 = np.minimum(z0 + 1, n - 1)
    tx = fx - x0; tz = fz - z0
    return (a[z0, x0] * (1 - tx) * (1 - tz) + a[z0, x1] * tx * (1 - tz)
            + a[z1, x0] * (1 - tx) * tz + a[z1, x1] * tx * tz)


def hexrgb(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255


# palette (matches the CSS tokens)
SHADOW = hexrgb("#1B2378")
LIT = hexrgb("#DCE1F6")
SNOW = hexrgb("#F6F7FF")
HAZE = hexrgb("#D3D9EF")
TOWN_DARK = hexrgb("#0B1060")
TOWN_LIT = hexrgb("#2A3592")

# terrain: ridged peaks scaled by distance (low foothills near, a high
# snowy range far), plus a gentle base so the valley floor isn't flat
ridge = ridged(N)
# fine rock: high octaves only, added mostly on high ground
rock = ridged(N, octaves=4, base=40)
broad = upsample(rng.random((5, 5)), N)


def mirror(x):
    """reflect instead of wrap, so the noise never shows a seam"""
    return np.abs((x % 2) - 1)


def smooth(a, b, v):
    t = np.clip((v - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def height(x, zz):
    zc = zz / ZMAX
    # a slow domain warp bends the ridges so they branch like eroded rock
    wx = (bilinear(broad, mirror(x * 0.8), zc) - 0.5) * 0.12
    r = bilinear(ridge, mirror(x * 1.3 + wx), mirror(zc * 1.1 - wx))
    b = bilinear(broad, mirror(x * 0.6), zc)
    far = smooth(0.25, 1.4, zz)
    # foothills near the camera, rising to the high range at the back
    lift = 0.057 * (1 - smooth(0.1, 0.26, zz))
    k = bilinear(rock, mirror(x * 1.3 + wx), mirror(zc * 1.1 - wx))
    near = 1 - smooth(0.08, 0.3, zz)
    return (r + 0.07 * k * r) * (0.03 * smooth(0.12, 0.35, zz) + 0.25 * far ** 1.2) + bilinear(ridge, mirror(x * 5), mirror(zc * 5)) * 0.007 * near + 0.02 * b * far + lift


cols = np.arange(W)
Z = ZMIN * (ZMAX / ZMIN) ** (np.arange(ZSTEPS) / (ZSTEPS - 1))   # geometric steps
Y = np.empty((ZSTEPS, W), np.float32)
C = np.empty((ZSTEPS, W, 3), np.float32)
sun = np.array([-0.75, 0.55, 0.35]); sun /= np.linalg.norm(sun)
eps = 0.0015

for i, zz in enumerate(Z):
    x = 0.5 + (cols - W / 2) / F * zz
    h = height(x, zz)
    Y[i] = HORIZON - (h - CAM_H) * F / zz
    # normal from finite differences (x across, z depth)
    dhx = (height(x + eps * zz, zz) - h) / (eps * zz)
    dhz = (height(x, zz * 1.01) - h) / (zz * 0.01)
    n = np.stack([-dhx, np.ones_like(h), -dhz], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    # light, plus a cheap occlusion term: low ground sits in shadow
    lit = np.clip(n @ sun, 0, 1) ** 0.9 * (0.55 + 0.45 * smooth(0.0, 0.18, h))
    if zz < BANDS[0][1]:  # the town foothills: in shadow at dusk
        col = TOWN_DARK + (TOWN_LIT - TOWN_DARK) * lit[:, None]
        fog = 0.0
    else:
        col = SHADOW + (LIT - SHADOW) * lit[:, None]
        # snow: high, fairly flat, catching light
        snow = np.clip((h - 0.17) / 0.06, 0, 1) * np.clip(n[:, 1] * 1.6 - 0.6, 0, 1)
        col = col + (SNOW * (0.6 + 0.4 * lit[:, None]) - col) * snow[:, None]
        fog = 1 - np.exp(-(zz - BANDS[0][1]) * 0.9)
    C[i] = col + (HAZE - col) * (fog * 0.78)

# occlusion: row r of a column shows the nearest step whose running-min
# projected height reaches r
cum = np.minimum.accumulate(Y, axis=0)
rows = np.arange(H)
idx = np.empty((H, W), np.int32)
for c in range(W):
    idx[:, c] = np.searchsorted(-cum[:, c], -rows, side="left")

band_of = np.searchsorted([b[1] for b in BANDS], Z, side="right").clip(0, len(BANDS) - 1)
os.makedirs("public/terrain", exist_ok=True)
for b in range(len(BANDS)):
    steps = np.where(band_of == b)[0]
    lo, hi = steps[0], steps[-1]
    vis = idx <= hi                     # this band or nearer covers the pixel
    own = (idx >= lo) & vis
    k = np.clip(idx, lo, hi)
    rgb = C[k, cols[None, :]]
    # pixels hidden behind nearer bands: fill with this band's nearest colour
    rgb[vis & ~own] = C[lo, cols[None, :].repeat(H, 0)][vis & ~own]
    a = vis.astype(np.float32)
    img = np.dstack([rgb, a]) * 255
    out = Image.fromarray(img.clip(0, 255).astype(np.uint8), "RGBA")
    if b == 0:
        # the foreground is magnified; soften it so no texel streaks show, and
        # fade its lowest rows to solid ground so it meets the CSS below it
        out = out.filter(ImageFilter.GaussianBlur(2))
        px = np.asarray(out).astype(np.float32)
        t = smooth(0.82, 1.0, rows / H)[:, None, None]
        px[..., :3] = px[..., :3] + (TOWN_DARK * 255 - px[..., :3]) * t
        px[..., 3] = np.maximum(px[..., 3], 255 * (t[..., 0] >= 1))
        out = Image.fromarray(px.clip(0, 255).astype(np.uint8), "RGBA")
    out.save(
        f"public/terrain/layer-{len(BANDS) - 1 - b}.webp", quality=82, method=6)

# crest of the town band, 240 samples across the frame, as fractions of H
crest = cum[np.where(band_of == 0)[0][-1]]
xs = np.linspace(0, W - 1, 240).astype(int)
json.dump({"w": W, "h": H, "crest": [round(float(np.clip(crest[x], 0, H)) / H, 4) for x in xs]},
          open("src/components/world/terrain.json", "w"))
print("ok", [os.path.getsize(f"public/terrain/layer-{i}.webp") // 1024 for i in range(4)], "KB")

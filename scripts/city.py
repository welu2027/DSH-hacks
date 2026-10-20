"""Generates the floating-city SVGs (skyline + hero cluster) from one set of
building primitives, so every building shares light, outline and palette."""
import random, sys

NAVY = "#0C1046"; B = "#0A14E4"; BR = "#2440F8"
B5, B10, B20, B35, B60 = "#F3F3FE", "#E6E8FC", "#CED0FA", "#A9ADF6", "#6C72EF"
SW = 1.25

DEFS = f"""<defs>
<linearGradient id="front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="{B10}"/></linearGradient>
<linearGradient id="side" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{B20}"/><stop offset="1" stop-color="{B35}"/></linearGradient>
<linearGradient id="cyl" x1="0" x2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="{B5}"/><stop offset=".75" stop-color="{B20}"/><stop offset="1" stop-color="{B35}"/></linearGradient>
<radialGradient id="dome" cx="32%" cy="28%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="{B20}"/><stop offset="1" stop-color="{B60}"/></radialGradient>
<radialGradient id="hedge" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="{B10}"/><stop offset="1" stop-color="{B60}"/></radialGradient>
<linearGradient id="rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{B35}"/><stop offset="1" stop-color="{B20}" stop-opacity="0"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{B20}"/><stop offset="1" stop-color="{B60}"/></linearGradient>
<radialGradient id="lamp"><stop offset="0" stop-color="{BR}" stop-opacity=".55"/><stop offset="1" stop-color="{BR}" stop-opacity="0"/></radialGradient>
</defs>"""

class S:
    def __init__(s, seed): s.o = []; s.r = random.Random(seed)
    def add(s, x): s.o.append(x)

def f(n): return f"{n:.1f}".rstrip("0").rstrip(".")

def windows(s, x, y, w, h, cols, rows, lit=.12, rx=2.5):
    cw, ch = w / cols, h / rows
    for i in range(cols):
        for j in range(rows):
            fill = BR if s.r.random() < lit else B35
            op = "1" if fill == BR else ".9"
            s.add(f'<rect x="{f(x+i*cw+cw*.22)}" y="{f(y+j*ch+ch*.18)}" width="{f(cw*.56)}" height="{f(ch*.62)}" rx="{rx}" fill="{fill}" fill-opacity="{op}"/>')

def box(s, x, base, w, h, d=14, cols=None, rows=None, roof_garden=False, antenna=False, cross=False):
    top = base - h
    s.add(f'<path d="M{f(x+w)} {f(base)}l{d} {-d/2}V{f(top-d/2)}l{-d} {d/2}z" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}" stroke-linejoin="round"/>')
    s.add(f'<path d="M{f(x)} {f(top)}l{d} {-d/2}h{f(w)}l{-d} {d/2}z" fill="#FFFFFF" stroke="{NAVY}" stroke-width="{SW}" stroke-linejoin="round"/>')
    s.add(f'<rect x="{f(x)}" y="{f(top)}" width="{f(w)}" height="{f(h)}" fill="url(#front)" stroke="{NAVY}" stroke-width="{SW}"/>')
    if cols:
        windows(s, x + 6, top + 10, w - 12, h - 22, cols, rows)
        # side-face windows: thin skewed slits
        for j in range(rows):
            yy = top + 10 + j * (h - 22) / rows + 4
            s.add(f'<path d="M{f(x+w+3)} {f(yy)}l{d-6} {-(d-6)/2}" stroke="{B60}" stroke-width="3" stroke-linecap="round" opacity=".55"/>')
    s.add(f'<path d="M{f(x+3)} {f(base-4)}V{f(top+4)}" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity=".9"/>')
    if roof_garden:
        for k in range(3):
            cx = x + d / 2 + (k + .5) * w / 3; cy = top - d / 4
            rr = 6 + s.r.random() * 4
            s.add(f'<path d="M{f(cx-rr)} {f(cy)}a{f(rr)} {f(rr)} 0 0 1 {f(2*rr)} 0z" fill="url(#hedge)" stroke="{NAVY}" stroke-width="1"/>')
    if antenna:
        ax = x + w * .5 + d / 2; ay = top - d / 2
        s.add(f'<path d="M{f(ax)} {f(ay)}v-34M{f(ax-6)} {f(ay-14)}h12" stroke="{NAVY}" stroke-width="1.25"/>')
        s.add(f'<circle cx="{f(ax)}" cy="{f(ay-40)}" r="10" fill="url(#lamp)"/><circle cx="{f(ax)}" cy="{f(ay-38)}" r="3" fill="{BR}"/>')
    if cross:
        cx, cy = x + w / 2, top + 22
        s.add(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="11" fill="{B}"/><path d="M{f(cx)} {f(cy-6)}v12M{f(cx-6)} {f(cy)}h12" stroke="#fff" stroke-width="3" stroke-linecap="round"/>')

def cyl(s, x, base, w, h, cols=None, rows=None, crown="dome", helix=False):
    top = base - h; rx = w / 2; ry = w * .14
    s.add(f'<path d="M{f(x)} {f(top)}V{f(base)}a{f(rx)} {f(ry)} 0 0 0 {f(w)} 0V{f(top)}" fill="url(#cyl)" stroke="{NAVY}" stroke-width="{SW}"/>')
    if cols:
        windows(s, x + 8, top + 14, w - 16, h - 26, cols, rows, rx=3)
    # floor bands follow the curve
    for k in range(1, 4):
        yy = top + k * h / 4
        s.add(f'<path d="M{f(x)} {f(yy)}a{f(rx)} {f(ry)} 0 0 0 {f(w)} 0" fill="none" stroke="{NAVY}" stroke-opacity=".35"/>')
    s.add(f'<ellipse cx="{f(x+rx)}" cy="{f(top)}" rx="{f(rx)}" ry="{f(ry)}" fill="#FFFFFF" stroke="{NAVY}" stroke-width="{SW}"/>')
    if crown == "dome":
        s.add(f'<path d="M{f(x+4)} {f(top)}a{f(rx-4)} {f(rx*.9)} 0 0 1 {f(w-8)} 0z" fill="url(#dome)" stroke="{NAVY}" stroke-width="{SW}"/>')
        s.add(f'<path d="M{f(x+rx)} {f(top-rx*.9)}V{f(top)}M{f(x+rx*.5)} {f(top-rx*.72)}q{f(rx*.2)} {f(rx*.4)} {f(rx*.1)} {f(rx*.72)}M{f(x+rx*1.5)} {f(top-rx*.72)}q{f(-rx*.2)} {f(rx*.4)} {f(-rx*.1)} {f(rx*.72)}" fill="none" stroke="{NAVY}" stroke-opacity=".35"/>')
        s.add(f'<path d="M{f(x+rx*.45)} {f(top-rx*.25)}a{f(rx*.6)} {f(rx*.6)} 0 0 1 {f(rx*.35)} {f(-rx*.5)}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>')
        top -= rx * .9
    if helix:
        hx = x + rx
        s.add(f'<path d="M{f(hx)} {f(top)}v-48" stroke="{NAVY}" stroke-width="1.25"/>')
        for col, sg in ((B, 1), (B60, -1)):
            d = f"M{f(hx)} {f(top)}" + "".join(f"c{-8*sg} -4 {-8*sg} -8 0 -12s{8*sg} -8 0 -12" for _ in range(2))
            s.add(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="1.6"/>')
        s.add(f'<circle cx="{f(hx)}" cy="{f(top-50)}" r="4.5" fill="#fff" stroke="{B}" stroke-width="1.5"/>')
    s.add(f'<path d="M{f(x+4)} {f(base-4)}V{f(base-h+8)}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>')

def dome_lab(s, x, base, w):
    h = w * .32; top = base - h
    s.add(f'<rect x="{f(x)}" y="{f(top)}" width="{f(w)}" height="{f(h)}" rx="4" fill="url(#front)" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<path d="M{f(x+w*.1)} {f(top+h*.4)}h{f(w*.8)}" stroke="{B60}" stroke-width="{f(h*.18)}" stroke-dasharray="{f(w*.07)} {f(w*.04)}" stroke-linecap="round"/>')
    s.add(f'<path d="M{f(x+w*.06)} {f(top)}a{f(w*.44)} {f(w*.4)} 0 0 1 {f(w*.88)} 0z" fill="url(#dome)" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<path d="M{f(x+w*.5)} {f(top-w*.4)}V{f(top)}M{f(x+w*.27)} {f(top-w*.33)}q{f(w*.08)} {f(w*.16)} {f(w*.06)} {f(w*.33)}M{f(x+w*.73)} {f(top-w*.33)}q{f(-w*.08)} {f(w*.16)} {f(-w*.06)} {f(w*.33)}" fill="none" stroke="{NAVY}" stroke-opacity=".35"/>')
    s.add(f'<path d="M{f(x+w*.2)} {f(top-w*.1)}a{f(w*.3)} {f(w*.3)} 0 0 1 {f(w*.18)} {f(-w*.2)}" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>')
    dw = w * .18
    s.add(f'<path d="M{f(x+w/2-dw/2)} {f(base)}v{f(-h*.55)}a{f(dw/2)} {f(dw/2)} 0 0 1 {f(dw)} 0v{f(h*.55)}z" fill="#fff" stroke="{NAVY}" stroke-width="{SW}"/>')

def bridge(s, x1, x2, y, h=12):
    s.add(f'<rect x="{f(x1)}" y="{f(y)}" width="{f(x2-x1)}" height="{h}" rx="{h/2}" fill="#fff" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<path d="M{f(x1+8)} {f(y+h/2)}H{f(x2-8)}" stroke="{B35}" stroke-width="{h*.4}" stroke-dasharray="6 4"/>')

def tree(s, x, base, h=30):
    s.add(f'<path d="M{f(x)} {f(base)}v{-h*.5}" stroke="{NAVY}" stroke-width="1.25"/>')
    s.add(f'<circle cx="{f(x)}" cy="{f(base-h*.6)}" r="{f(h*.32)}" fill="url(#hedge)" stroke="{NAVY}" stroke-width="1"/>')

def hedge(s, x, base, w):
    s.add(f'<path d="M{f(x)} {f(base)}c0-{f(w*.5)} {f(w*.25)}-{f(w*.62)} {f(w*.45)}-{f(w*.62)}s{f(w*.55)} {f(w*.2)} {f(w*.55)} {f(w*.62)}z" fill="url(#hedge)" stroke="{NAVY}" stroke-width="1"/>')

def island(s, x, base, w, depth=None):
    depth = depth or w * .32
    s.add(f'<path d="M{f(x)} {f(base+8)}h{f(w)}c{f(-w*.08)} {f(depth*.5)} {f(-w*.28)} {f(depth*.75)} {f(-w*.4)} {f(depth*.85)}-{f(w*.04)} {f(depth*.15)}-{f(w*.08)} {f(depth*.15)}-{f(w*.12)} 0c{f(-w*.18)}-{f(depth*.1)} {f(-w*.36)}-{f(depth*.4)} {f(-w*.48)}-{f(depth*.85)}z" fill="url(#rock)"/>')
    # hanging roots / crystals under the island
    for k in range(4):
        rx = x + w * (.25 + k * .17)
        s.add(f'<path d="M{f(rx)} {f(base+12)}l3 {f(depth*(.35+.1*(k%2)))}l3 {f(-depth*(.35+.1*(k%2)))}" fill="{B35}" fill-opacity=".55"/>')
    s.add(f'<rect x="{f(x-4)}" y="{f(base)}" width="{f(w+8)}" height="12" rx="6" fill="#fff" stroke="{NAVY}" stroke-width="{SW}"/>')

def silhouette(s, x, base, w, h, kind, fill=B20, op=.75):
    top = base - h
    if kind == "arch": d = f"M{f(x)} {f(base)}V{f(top+w/2)}a{f(w/2)} {f(w/2)} 0 0 1 {f(w)} 0V{f(base)}z"
    elif kind == "dome": d = f"M{f(x)} {f(base)}V{f(top+w*.4)}a{f(w/2)} {f(w*.4)} 0 0 1 {f(w)} 0V{f(base)}z"
    elif kind == "step": d = f"M{f(x)} {f(base)}V{f(top+h*.3)}h{f(w*.25)}V{f(top)}h{f(w*.5)}V{f(top+h*.3)}h{f(w*.25)}V{f(base)}z"
    else: d = f"M{f(x)} {f(base)}V{f(top)}h{f(w)}V{f(base)}z"
    s.add(f'<path d="{d}" fill="{fill}" fill-opacity="{op}"/>')

def svg(w, h, body, extra=""):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"{extra}>{DEFS}{"".join(body)}</svg>\n'

def skyline():
    from medtech import twist, geodome  # lazy: medtech imports this module
    s = S(4); W, H, G = 1600, 420, 410
    r = random.Random(9)
    # far silhouettes, two depths
    x = -20
    while x < W:
        w = r.randint(50, 110); h = r.randint(140, 300)
        silhouette(s, x, G, w, h, r.choice(["arch", "dome", "step", "box"]), B20, .55); x += w + r.randint(-10, 20)
    x = 10
    while x < W:
        w = r.randint(60, 120); h = r.randint(90, 200)
        silhouette(s, x, G, w, h, r.choice(["arch", "dome", "box"]), B35, .45); x += w + r.randint(10, 60)
    # small floating islands in the sky
    island(s, 1180, 120, 120); cyl(s, 1210, 120, 34, 70, 2, 4, helix=True); hedge(s, 1255, 120, 30)
    island(s, 300, 90, 90); dome_lab(s, 310, 90, 70)
    # near row
    box(s, 30, G, 90, 150, cols=3, rows=5, roof_garden=True)
    cyl(s, 150, G, 64, 230, 3, 8, helix=True)
    bridge(s, 214, 262, G - 160)
    box(s, 262, G, 110, 190, cols=4, rows=6, antenna=True)
    geodome(s, 475, G, 72)
    box(s, 580, G, 80, 120, cols=2, rows=4, roof_garden=True)
    cyl(s, 690, G, 90, 300, 4, 10, helix=True)
    bridge(s, 780, 830, G - 210)
    box(s, 830, G, 130, 240, cols=5, rows=8, cross=True, antenna=True)
    tree(s, 985, G, 34); tree(s, 1010, G, 26)
    dome_lab(s, 1030, G, 170)
    twist(s, 1220, G, 64, 20)
    box(s, 1310, G, 100, 210, cols=4, rows=7, roof_garden=True)
    bridge(s, 1290, 1310, G - 120)
    box(s, 1440, G, 120, 140, cols=4, rows=4, antenna=True)
    for tx in (128, 385, 566, 676, 1215, 1425, 1580): tree(s, tx, G, 22 + (tx % 3) * 5)
    s.add(f'<rect x="0" y="{G}" width="{W}" height="{H-G}" fill="{B35}"/><path d="M0 {G}H{W}" stroke="{NAVY}" stroke-width="{SW}"/>')
    return svg(W, H, s.o, ' preserveAspectRatio="xMidYMax slice"')

def hero_city():
    s = S(12); W, H = 720, 520
    # back island
    island(s, 360, 250, 300, 120)
    silhouette(s, 380, 250, 50, 120, "arch", B20, .8); silhouette(s, 600, 250, 46, 90, "dome", B20, .8)
    box(s, 440, 250, 70, 150, cols=3, rows=5, antenna=True)
    cyl(s, 530, 250, 52, 190, 2, 7, helix=True)
    hedge(s, 620, 250, 30); tree(s, 655, 250, 26)
    # front island
    island(s, 40, 430, 380, 140)
    dome_lab(s, 60, 430, 140)
    box(s, 215, 430, 90, 230, cols=3, rows=8, cross=True, roof_garden=True)
    bridge(s, 319, 350, 430 - 170)
    cyl(s, 330, 430, 56, 150, 2, 5)
    for tx in (205, 400): tree(s, tx, 430, 30)
    hedge(s, 40, 430, 26)
    # a sky bridge between the islands
    s.add(f'<path d="M386 300C420 290 440 270 450 262" fill="none" stroke="{B60}" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/>')
    return svg(W, H, s.o)


def tower():
    s = S(21); W, H, G = 300, 760, 640
    s.add(f'<circle cx="150" cy="70" r="80" fill="url(#lamp)"/>')
    island(s, 20, G, 260, 110)
    box(s, 30, G, 70, 260, d=12, cols=2, rows=8, roof_garden=True)
    box(s, 196, G, 64, 330, d=12, cols=2, rows=10, antenna=True)
    cyl(s, 98, G, 104, 470, 3, 14, helix=True)
    bridge(s, 84, 110, G - 200, 10); bridge(s, 196, 214, G - 270, 10)
    # entrance with the care cross
    s.add(f'<path d="M130 {G}v-34a20 20 0 0 1 40 0v34z" fill="#fff" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<circle cx="150" cy="{G-62}" r="12" fill="{B}"/><path d="M150 {G-69}v14M143 {G-62}h14" stroke="#fff" stroke-width="3" stroke-linecap="round"/>')
    tree(s, 22, G, 28); tree(s, 278, G, 24); hedge(s, 104, G, 22); hedge(s, 176, G, 20)
    return svg(W, H, s.o)

if __name__ == "__main__":
    out = sys.argv[1]
    open(f"{out}/skyline-city.svg", "w").write(skyline())
    open(f"{out}/hero-city.svg", "w").write(hero_city())
    open(f"{out}/tower-care.svg", "w").write(tower())

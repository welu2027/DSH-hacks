"""Healthtech pieces for the floating city: devices, wearables, robots and
biomedical hardware. Shares city.py's palette, outline weight and top-left
light. Usage: python3 scripts/medtech.py public/illustrations"""
import math, sys
from city import (S, f, svg, box, cyl, island, hedge, tree, bridge,
                  NAVY, B, BR, B5, B10, B20, B35, B60, SW)

EXTRA = f"""<defs>
<linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#151C7A"/><stop offset="1" stop-color="{NAVY}"/></linearGradient>
<radialGradient id="bore" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="{B60}"/><stop offset=".7" stop-color="{B35}"/><stop offset="1" stop-color="{B20}"/></radialGradient>
<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BR}" stop-opacity=".45"/><stop offset="1" stop-color="{BR}" stop-opacity="0"/></linearGradient>
<filter id="soft"><feGaussianBlur stdDeviation="2"/></filter>
</defs>"""
GLOW = "#8FA6FF"  # screen glow ink


def doc(w, h, body):
    return svg(w, h, [EXTRA] + body)


def ln(s, d, w=SW, c=NAVY, extra=""):
    s.add(f'<path d="{d}" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"{extra}/>')


def tube(s, pts, w):
    """A lit pipe/limb along a polyline: outline, body, shade on one side."""
    d = "M" + " L".join(f"{f(x)} {f(y)}" for x, y in pts)
    ln(s, d, w, NAVY)
    ln(s, d, w - 3, "#FFFFFF")
    # shade: offset the centerline toward the lower-right
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    L = math.hypot(x2 - x1, y2 - y1) or 1
    nx, ny = (y2 - y1) / L, -(x2 - x1) / L
    if nx + ny < 0: nx, ny = -nx, -ny
    k = (w - 3) * .22
    ds = "M" + " L".join(f"{f(x + nx * k)} {f(y + ny * k)}" for x, y in pts)
    ln(s, ds, (w - 3) * .45, B20)


def joint(s, x, y, r, led=True):
    s.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="url(#dome)" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r * .45)}" fill="#fff" stroke="{NAVY}" stroke-width="1"/>')
    if led: s.add(f'<circle cx="{f(x + r * .55)}" cy="{f(y - r * .55)}" r="2.2" fill="{BR}"/>')


def cross(s, x, y, r=10):
    s.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="{B}"/>')
    ln(s, f"M{f(x)} {f(y - r * .55)}v{f(r * 1.1)}M{f(x - r * .55)} {f(y)}h{f(r * 1.1)}", r * .28, "#fff")


def ecg(x, y, w, amp=1.0):
    u = w / 12
    return (f"M{f(x)} {f(y)}h{f(u * 3)}l{f(u * .5)} {f(-4 * amp)}l{f(u * .5)} {f(4 * amp)}h{f(u)}"
            f"l{f(u * .4)} {f(-16 * amp)}l{f(u * .5)} {f(26 * amp)}l{f(u * .4)} {f(-10 * amp)}h{f(u * 1.2)}"
            f"l{f(u * .6)} {f(-5 * amp)}l{f(u * .6)} {f(5 * amp)}H{f(x + w)}")


def arcs(s, x, y, n=3, r0=14, step=14, rot=-45):
    for i in range(n):
        r = r0 + i * step
        a0, a1 = math.radians(rot - 40), math.radians(rot + 40)
        s.add(f'<path d="M{f(x + r * math.cos(a0))} {f(y + r * math.sin(a0))}A{r} {r} 0 0 1 {f(x + r * math.cos(a1))} {f(y + r * math.sin(a1))}" fill="none" stroke="{BR}" stroke-width="2" stroke-linecap="round" opacity="{f(.8 - i * .25)}"/>')


# ---------------- robots ----------------
def robot_helper():
    s = S(1); W, H = 260, 330
    s.add(f'<ellipse cx="130" cy="312" rx="70" ry="12" fill="url(#lamp)"/>')
    s.add(f'<path d="M104 262h52l-8 22h-36z" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<ellipse cx="130" cy="294" rx="14" ry="8" fill="{BR}" opacity=".45" filter="url(#soft)"/>')
    # arms behind the body
    tube(s, [(80, 182), (56, 150), (48, 112)], 18)
    s.add(f'<circle cx="48" cy="104" r="13" fill="#fff" stroke="{NAVY}" stroke-width="{SW}"/>')
    tube(s, [(182, 186), (206, 206), (210, 232)], 18)
    # medkit in the right hand
    s.add(f'<rect x="186" y="228" width="50" height="36" rx="8" fill="#fff" stroke="{NAVY}" stroke-width="{SW}"/>')
    ln(s, "M202 228v-6h18v6")
    cross(s, 211, 246, 9)
    # body
    s.add(f'<rect x="72" y="150" width="116" height="116" rx="46" fill="url(#cyl)" stroke="{NAVY}" stroke-width="1.5"/>')
    s.add(f'<rect x="98" y="182" width="64" height="54" rx="16" fill="url(#screen)" stroke="{NAVY}" stroke-width="1"/>')
    ln(s, ecg(104, 212, 52, .7), 2, GLOW)
    s.add(f'<circle cx="152" cy="192" r="3" fill="{BR}"/>')
    # neck + head
    s.add(f'<rect x="116" y="136" width="28" height="18" rx="6" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}"/>')
    for ex in (64, 196):
        s.add(f'<circle cx="{ex}" cy="94" r="12" fill="url(#dome)" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<rect x="66" y="46" width="128" height="94" rx="42" fill="url(#front)" stroke="{NAVY}" stroke-width="1.5"/>')
    s.add(f'<rect x="82" y="62" width="96" height="62" rx="28" fill="url(#screen)" stroke="{NAVY}"/>')
    ln(s, "M102 98q8-11 16 0M142 98q8-11 16 0", 4, GLOW)
    ln(s, "M118 110q12 8 24 0", 2.5, GLOW)
    ln(s, "M92 80q8-9 22-10", 3, "#fff", ' opacity=".45"')
    ln(s, "M130 46V22")
    s.add(f'<circle cx="130" cy="16" r="16" fill="url(#lamp)"/><circle cx="130" cy="17" r="5.5" fill="{BR}" stroke="{NAVY}"/>')
    return doc(W, H, s.o)


def robot_arm():
    s = S(2); W, H = 340, 340
    island(s, 40, 290, 260, 70)
    # light beam from the tool onto a pad
    s.add(f'<path d="M262 170L226 278h76z" fill="url(#beam)"/>')
    s.add(f'<rect x="216" y="276" width="96" height="10" rx="5" fill="{B20}" stroke="{NAVY}" stroke-width="1"/>')
    cyl(s, 112, 290, 76, 44, crown="none")
    tube(s, [(150, 244), (112, 128)], 26)
    tube(s, [(112, 128), (232, 96)], 22)
    tube(s, [(232, 96), (262, 150)], 16)
    joint(s, 150, 244, 21)
    joint(s, 112, 128, 18)
    joint(s, 232, 96, 14)
    # gripper with a scalpel-light tool
    s.add(f'<rect x="250" y="146" width="24" height="18" rx="5" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}"/>')
    ln(s, "M254 164l-4 12M270 164l4 12", 3)
    s.add(f'<circle cx="262" cy="170" r="4" fill="{BR}"/>')
    ln(s, "M170 266h20", 3, BR)
    return doc(W, H, s.o)


def drone():
    s = S(3); W, H = 280, 190
    ln(s, "M100 70L48 46M180 70L232 46M110 64L76 32M170 64L204 32", 4)
    for x, y, rx in ((48, 42, 36), (232, 42, 36), (76, 28, 26), (204, 28, 26)):
        s.add(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="5" fill="{B20}" fill-opacity=".7" stroke="{B35}"/>')
        s.add(f'<rect x="{x - 5}" y="{y - 2}" width="10" height="10" rx="3" fill="url(#side)" stroke="{NAVY}" stroke-width="1"/>')
    s.add(f'<rect x="90" y="56" width="100" height="46" rx="22" fill="url(#front)" stroke="{NAVY}" stroke-width="1.5"/>')
    s.add(f'<rect x="146" y="64" width="34" height="18" rx="9" fill="url(#screen)"/>')
    ln(s, "M152 70q8-4 20 0", 2, "#fff", ' opacity=".5"')
    cross(s, 118, 79, 11)
    ln(s, "M120 102l-6 26M160 102l6 26", 1.25)
    s.add(f'<rect x="106" y="126" width="68" height="44" rx="8" fill="#fff" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<rect x="106" y="126" width="68" height="10" rx="5" fill="{B20}"/>')
    cross(s, 140, 152, 10)
    s.add(f'<circle cx="140" cy="178" r="14" fill="url(#lamp)"/>')
    return doc(W, H, s.o)


# ---------------- devices ----------------
def mri():
    s = S(4); W, H = 400, 300
    island(s, 30, 262, 340, 80)
    cx, cy = 236, 150
    s.add(f'<circle cx="{cx + 16}" cy="{cy - 8}" r="104" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<circle cx="{cx}" cy="{cy}" r="104" fill="url(#front)" stroke="{NAVY}" stroke-width="1.5"/>')
    s.add(f'<circle cx="{cx}" cy="{cy}" r="82" fill="none" stroke="{B35}" stroke-dasharray="2 8" stroke-linecap="round" stroke-width="2"/>')
    s.add(f'<circle cx="{cx}" cy="{cy}" r="94" fill="none" stroke="{BR}" stroke-width="4" stroke-dasharray="60 600" stroke-linecap="round" transform="rotate(-150 {cx} {cy})" opacity=".85"/>')
    s.add(f'<circle cx="{cx}" cy="{cy}" r="56" fill="url(#bore)" stroke="{NAVY}" stroke-width="1.5"/>')
    s.add(f'<circle cx="{cx}" cy="{cy}" r="44" fill="none" stroke="#fff" stroke-opacity=".5"/>')
    ln(s, f"M{cx - 70} {cy - 60}a96 96 0 0 1 40-28", 5, "#fff")
    # bed sliding into the bore
    s.add(f'<path d="M86 196h70v66H86z" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<rect x="40" y="178" width="220" height="20" rx="10" fill="#fff" stroke="{NAVY}" stroke-width="1.5"/>')
    s.add(f'<rect x="96" y="168" width="150" height="14" rx="7" fill="{B20}" stroke="{NAVY}" stroke-width="1"/>')
    s.add(f'<rect x="52" y="168" width="36" height="12" rx="6" fill="#fff" stroke="{NAVY}" stroke-width="1"/>')
    # control screen on the gantry
    s.add(f'<rect x="282" y="214" width="40" height="26" rx="5" fill="url(#screen)" stroke="{NAVY}"/>')
    ln(s, ecg(286, 228, 32, .4), 1.5, GLOW)
    return doc(W, H, s.o)


def monitor():
    s = S(5); W, H = 280, 320
    ln(s, "M140 176V286", 6)
    ln(s, "M140 176V286", 3, B20)
    ln(s, "M96 292h88M140 286l-34 16M140 286l34 16", 3)
    for x in (100, 180): s.add(f'<circle cx="{x}" cy="306" r="6" fill="#fff" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<path d="M248 26l14-8v146l-14 8z" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<rect x="18" y="26" width="230" height="146" rx="16" fill="url(#front)" stroke="{NAVY}" stroke-width="1.5"/>')
    s.add(f'<rect x="32" y="40" width="202" height="108" rx="8" fill="url(#screen)"/>')
    for y in range(52, 148, 16): ln(s, f"M32 {y}h202", .5, "#fff", ' opacity=".07"')
    ln(s, ecg(40, 82, 130, 1.2), 2.5, GLOW)
    s.add(f'<path d="M40 126c10-14 20-14 30 0s20 14 30 0 20-14 30 0 20 14 30 0" fill="none" stroke="{B35}" stroke-width="2"/>')
    ln(s, "M178 46v96", 1, "#fff", ' opacity=".15"')
    t = 'font-family="ui-monospace, Menlo, monospace"'
    s.add(f'<text x="186" y="60" {t} font-size="9" fill="{B35}">HR</text><text x="186" y="88" {t} font-size="26" fill="#fff">72</text>')
    s.add(f'<text x="186" y="110" {t} font-size="9" fill="{B35}">SpO2</text><text x="186" y="134" {t} font-size="20" fill="{GLOW}">98</text>')
    s.add(f'<path d="M224 54c-3-5-10-2-8 3 1 3 8 7 8 7s7-4 8-7c2-5-5-8-8-3z" fill="{BR}"/>')
    for x in (190, 206, 222): s.add(f'<circle cx="{x}" cy="160" r="4" fill="#fff" stroke="{NAVY}"/>')
    s.add(f'<rect x="34" y="155" width="40" height="8" rx="4" fill="{B20}"/>')
    ln(s, "M100 26c0-12 80-12 80 0", 3)
    return doc(W, H, s.o)


def microscope():
    s = S(6); W, H = 230, 290
    s.add(f'<circle cx="104" cy="214" r="24" fill="url(#lamp)"/>')
    s.add(f'<rect x="36" y="246" width="156" height="26" rx="10" fill="url(#front)" stroke="{NAVY}" stroke-width="1.5"/>')
    s.add(f'<path d="M192 252l12-6v20l-12 6z" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}"/>')
    # arm
    s.add(f'<path d="M150 246V140c0-40-24-62-56-66l-4 22c22 4 36 18 36 44v106z" fill="url(#cyl)" stroke="{NAVY}" stroke-width="1.5"/>')
    s.add(f'<circle cx="150" cy="190" r="12" fill="url(#dome)" stroke="{NAVY}"/><circle cx="150" cy="190" r="4" fill="#fff" stroke="{NAVY}"/>')
    # stage + slide
    s.add(f'<rect x="54" y="196" width="104" height="10" rx="4" fill="#fff" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<rect x="72" y="190" width="56" height="7" rx="2" fill="{B35}" stroke="{NAVY}" stroke-width="1"/>')
    s.add(f'<circle cx="100" cy="193" r="3" fill="{BR}"/>')
    # tube, angled
    s.add(f'<g transform="translate(14 22) rotate(-18 96 110)"><rect x="80" y="44" width="34" height="120" rx="8" fill="url(#cyl)" stroke="{NAVY}" stroke-width="1.5"/>'
          f'<rect x="84" y="22" width="26" height="26" rx="6" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}"/>'
          f'<rect x="88" y="162" width="18" height="18" rx="4" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}"/>'
          f'<path d="M86 60h22M86 140h22" stroke="{NAVY}" stroke-opacity=".4"/></g>')
    return doc(W, H, s.o)


# ---------------- wearables + sensors ----------------
def watch():
    s = S(7); W, H = 210, 280
    s.add(f'<rect x="64" y="4" width="82" height="76" rx="16" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<rect x="64" y="200" width="82" height="76" rx="16" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}"/>')
    for y in (218, 234, 250): s.add(f'<circle cx="105" cy="{y}" r="3" fill="#fff" stroke="{NAVY}"/>')
    s.add(f'<rect x="160" y="112" width="12" height="30" rx="5" fill="url(#side)" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<rect x="38" y="56" width="128" height="166" rx="40" fill="url(#front)" stroke="{NAVY}" stroke-width="1.5"/>')
    s.add(f'<rect x="50" y="68" width="104" height="142" rx="30" fill="url(#screen)"/>')
    s.add(f'<path d="M102 92c-4-7-14-3-11 4 2 4 11 9 11 9s9-5 11-9c3-7-7-11-11-4z" fill="{BR}"/>')
    t = 'font-family="ui-monospace, Menlo, monospace"'
    s.add(f'<text x="102" y="146" text-anchor="middle" {t} font-size="38" fill="#fff">72</text>')
    s.add(f'<text x="102" y="162" text-anchor="middle" {t} font-size="9" letter-spacing="2" fill="{B35}">BPM</text>')
    ln(s, ecg(62, 186, 80, .6), 2, GLOW)
    ln(s, "M54 90q6-14 20-18", 3, "#fff", ' opacity=".35"')
    arcs(s, 178, 70, rot=-60)
    return doc(W, H, s.o)


def sensor_patch():
    s = S(8); W, H = 220, 220
    s.add(f'<circle cx="104" cy="116" r="88" fill="#fff" stroke="{B35}" stroke-width="2" stroke-dasharray="3 6" stroke-linecap="round"/>')
    s.add(f'<circle cx="104" cy="116" r="74" fill="url(#front)" stroke="{NAVY}" stroke-width="1.5"/>')
    for a in range(0, 360, 45):
        r = math.radians(a)
        ln(s, f"M{f(104 + 34 * math.cos(r))} {f(116 + 34 * math.sin(r))}L{f(104 + 62 * math.cos(r))} {f(116 + 62 * math.sin(r))}", 1.5, B35)
        s.add(f'<circle cx="{f(104 + 62 * math.cos(r))}" cy="{f(116 + 62 * math.sin(r))}" r="3.5" fill="{B60}"/>')
    s.add(f'<rect x="72" y="94" width="64" height="44" rx="12" fill="url(#screen)" stroke="{NAVY}"/>')
    ln(s, ecg(78, 120, 52, .55), 2, GLOW)
    s.add(f'<circle cx="126" cy="102" r="3" fill="{BR}"/>')
    ln(s, "M56 82q10-18 30-24", 4, "#fff", ' opacity=".8"')
    arcs(s, 176, 44, rot=-45)
    return doc(W, H, s.o)


def capsules():
    s = S(9); W, H = 280, 200

    def capsule(x, y, ang, L=92, w=34, col=B):
        s.add(f'<g transform="rotate({ang} {x} {y})">'
              f'<path d="M{x - L / 2 + w / 2} {y - w / 2}H{x}v{w}H{x - L / 2 + w / 2}a{w / 2} {w / 2} 0 0 1 0 {-w}z" fill="{col}" stroke="{NAVY}" stroke-width="{SW}"/>'
              f'<path d="M{x} {y - w / 2}H{x + L / 2 - w / 2}a{w / 2} {w / 2} 0 0 1 0 {w}H{x}z" fill="#fff" stroke="{NAVY}" stroke-width="{SW}"/>'
              f'<path d="M{x - L / 2 + w / 2} {y - w / 4}H{x + L / 2 - w / 2}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/></g>')

    capsule(90, 70, -28)
    capsule(196, 120, 22, 80, 30, B60)
    capsule(110, 158, 8, 70, 26, BR)
    for x, y, r in ((214, 46, 18), (40, 150, 14), (176, 182, 11)):
        s.add(f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#dome)" stroke="{NAVY}" stroke-width="{SW}"/>')
        ln(s, f"M{x - r * .6} {y}h{r * 1.2}", 1.25, NAVY, ' opacity=".5"')
    return doc(W, H, s.o)


def dna():
    s = S(10); W, H = 150, 440
    cx, amp, n = 75, 46, 220
    a = []; b = []
    for i in range(n + 1):
        y = 20 + i * (H - 40) / n; t = i / n * math.pi * 5
        a.append((cx + amp * math.sin(t), y, math.cos(t))); b.append((cx - amp * math.sin(t), y, -math.cos(t)))
    for i in range(0, n + 1, 11):
        (x1, y, z1), (x2, _, _) = a[i], b[i]
        op = .35 + .4 * (z1 + 1) / 2
        ln(s, f"M{f(x1)} {f(y)}H{f(x2)}", 3, B35, f' opacity="{f(op)}"')
        s.add(f'<circle cx="{f(x1)}" cy="{f(y)}" r="4.5" fill="{B}" stroke="{NAVY}" stroke-width="1"/><circle cx="{f(x2)}" cy="{f(y)}" r="4.5" fill="{B20}" stroke="{NAVY}" stroke-width="1"/>')
    for strand, col in ((b, B60), (a, B)):
        ln(s, "M" + " L".join(f"{f(x)} {f(y)}" for x, y, _ in strand), 4, col)
    return doc(W, H, s.o)


def bionic_hand():
    s = S(11); W, H = 250, 340
    s.add(f'<path d="M88 214h74l10 108a12 12 0 0 1-12 12H90a12 12 0 0 1-12-12z" fill="url(#cyl)" stroke="{NAVY}" stroke-width="1.5"/>')
    ln(s, "M96 250h58M94 290h62", 1, NAVY, ' opacity=".35"')
    for y in (262, 274, 286): s.add(f'<circle cx="152" cy="{y - 10}" r="2.5" fill="{BR}"/>')
    s.add(f'<rect x="82" y="202" width="86" height="18" rx="9" fill="#fff" stroke="{NAVY}" stroke-width="{SW}"/>')
    # fingers: (x, length)
    for x, L in ((74, 74), (98, 92), (122, 88), (146, 70)):
        top = 112 - L
        s.add(f'<rect x="{x}" y="{top}" width="20" height="{f(L * .48)}" rx="10" fill="url(#cyl)" stroke="{NAVY}" stroke-width="{SW}"/>')
        s.add(f'<rect x="{x}" y="{f(top + L * .52)}" width="20" height="{f(L * .5)}" rx="10" fill="url(#cyl)" stroke="{NAVY}" stroke-width="{SW}"/>')
        s.add(f'<circle cx="{x + 10}" cy="{f(top + L * .5)}" r="4" fill="{B35}" stroke="{NAVY}" stroke-width="1"/>')
        s.add(f'<circle cx="{x + 10}" cy="{top + 9}" r="3" fill="{B20}"/>')
    s.add(f'<g transform="rotate(-38 76 150)"><rect x="40" y="140" width="40" height="20" rx="10" fill="url(#cyl)" stroke="{NAVY}" stroke-width="{SW}"/>'
          f'<rect x="10" y="140" width="34" height="20" rx="10" fill="url(#cyl)" stroke="{NAVY}" stroke-width="{SW}"/></g>')
    s.add(f'<rect x="68" y="104" width="104" height="104" rx="26" fill="url(#front)" stroke="{NAVY}" stroke-width="1.5"/>')
    s.add(f'<circle cx="120" cy="154" r="22" fill="url(#lamp)"/><circle cx="120" cy="154" r="12" fill="url(#screen)" stroke="{NAVY}"/><circle cx="120" cy="154" r="4" fill="{GLOW}"/>')
    ln(s, "M80 120v40", 3, "#fff", ' opacity=".8"')
    return doc(W, H, s.o)


# ---------------- buildings ----------------
def twist(s, x, base, w, floors, fh=14, d=12):
    """A twisting tower: each floor slab slides along a sine."""
    for i in range(floors):
        y = base - i * fh; off = 12 * math.sin(i * .32); ww = w * (1 - i * .006)
        xx = x + off + (w - ww) / 2
        s.add(f'<path d="M{f(xx + ww)} {f(y)}l{d} {-d / 2}v{-fh + 1}l{-d} {d / 2}z" fill="url(#side)" stroke="{NAVY}" stroke-width="1"/>')
        s.add(f'<rect x="{f(xx)}" y="{f(y - fh + 1)}" width="{f(ww)}" height="{fh - 1}" fill="url(#front)" stroke="{NAVY}" stroke-width="1"/>')
        s.add(f'<rect x="{f(xx + 4)}" y="{f(y - fh + 4)}" width="{f(ww - 8)}" height="{fh - 7}" rx="2" fill="{BR if i % 7 == 3 else B35}" opacity=".85"/>')
    top = base - floors * fh; tx = x + w / 2 + 12 * math.sin(floors * .32)
    s.add(f'<path d="M{f(tx - 10)} {f(top + 1)}l10-40l10 40z" fill="#fff" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<circle cx="{f(tx)}" cy="{f(top - 46)}" r="12" fill="url(#lamp)"/><circle cx="{f(tx)}" cy="{f(top - 44)}" r="3.5" fill="{BR}"/>')


def geodome(s, cx, base, r):
    s.add(f'<path d="M{f(cx - r)} {f(base)}a{f(r)} {f(r * .82)} 0 0 1 {f(2 * r)} 0z" fill="url(#dome)" stroke="{NAVY}" stroke-width="1.5"/>')
    rings = [.35, .65, .88]
    pts = []
    for k, fr in enumerate([0] + rings):
        ang = math.asin(min(fr, .999)); rr = r * math.cos(ang); yy = base - r * .82 * fr
        n = max(2, 8 - k * 2)
        pts.append([(cx - rr + 2 * rr * j / n, yy) for j in range(n + 1)])
        if fr: s.add(f'<path d="M{f(cx - rr)} {f(yy)}H{f(cx + rr)}" stroke="{NAVY}" stroke-opacity=".4"/>')
    for lo, hi in zip(pts, pts[1:]):
        for j, (x, y) in enumerate(lo):
            h = hi[min(len(hi) - 1, round(j * (len(hi) - 1) / (len(lo) - 1)))]
            ln(s, f"M{f(x)} {f(y)}L{f(h[0])} {f(h[1])}", 1, NAVY, ' opacity=".4"')
    ln(s, f"M{f(cx - r * .6)} {f(base - r * .3)}a{f(r * .7)} {f(r * .6)} 0 0 1 {f(r * .4)} {f(-r * .4)}", 4, "#fff")


def future_district():
    s = S(12); W, H = 460, 560
    island(s, 30, 470, 400, 120)
    geodome(s, 120, 470, 80)
    twist(s, 230, 470, 70, 24)
    box(s, 330, 470, 70, 150, cols=2, rows=5, roof_garden=True, cross=True)
    # cantilevered lab bridging the tower and the block
    s.add(f'<rect x="300" y="270" width="110" height="30" rx="6" fill="url(#front)" stroke="{NAVY}" stroke-width="{SW}"/>')
    s.add(f'<path d="M308 286h94" stroke="{B60}" stroke-width="8" stroke-dasharray="10 6" stroke-linecap="round"/>')
    tree(s, 40, 470, 28); hedge(s, 200, 470, 24); tree(s, 420, 470, 22)
    return doc(W, H, s.o)


if __name__ == "__main__":
    out = sys.argv[1]
    for name, fn in [("robot-helper", robot_helper), ("robot-arm", robot_arm), ("drone-med", drone),
                     ("device-mri", mri), ("device-monitor", monitor), ("device-microscope", microscope),
                     ("wear-watch", watch), ("sensor-patch", sensor_patch), ("capsules", capsules),
                     ("dna", dna), ("bionic-hand", bionic_hand), ("district-future", future_district)]:
        open(f"{out}/{name}.svg", "w").write(fn())

#!/usr/bin/env python3
"""Generate a color-palette reference sheet for medisdesign.com."""
from PIL import Image, ImageDraw, ImageFont

W = 1600
M = 64
GAP = 24
BG = "#ffffff"

FONTS = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
]


def font(size, bold=False):
    for p in ([FONTS[0]] if bold else []) + FONTS[1:] + [FONTS[0]]:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()


def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lum(h):
    def ch(c):
        c /= 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb(h)
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)


def contrast(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def ink_on(h):
    return "#0f131f" if contrast(h, "#ffffff") < 4.5 and lum(h) > 0.35 else "#ffffff"


BRAND = [
    ("Primary Gold", "#a18e37", "Links, buttons, icons, CTA fills"),
    ("Accent Hover", "#c4ae45", "Nav / link hover, highlight state"),
]
INK = [
    ("Heading Ink", "#0f131f", "H1-H6, footer & body background"),
    ("Body Text", "#35415b", "Paragraphs, secondary, button hover"),
    ("Muted Text", "#727f9f", "Captions, meta, placeholder"),
]
SURFACE = [
    ("Canvas / Card", "#ffffff", "Content background, header"),
    ("Surface Alt", "#f2f4f7", "Page canvas, top bar, stripes"),
    ("Border / Rule", "#e3e7f0", "Dividers, hairlines, inputs"),
]
DARK = [
    ("Footer BG", "#0f131f", "Footer, overlays (80%)"),
    ("Deep BG", "#1c2130", "Footer cards, alt panels"),
    ("Ink Border", "#2b3242", "Footer borders, subfooter alt"),
    ("Footer Text", "#8d9096", "Footer copy"),
]

CUSTOM = [
    ("Active Coral", "#f77656", "Current nav item, accent text"),
    ("Terracotta", "#cc7529", "Section eyebrow text"),
    ("Warm Beige", "#c7a78d", "Hero gradient start"),
    ("Sand Button", "#af9987", "Card button fill"),
    ("Charcoal", "#242b2e", "Text on sand cards"),
    ("Cool Grey", "#9b9ea3", "Item meta text"),
]

HEAD_H = 150
ROW_H = [196, 168, 156, 150, 150]
ROW_LABEL = 34
BLOCK_GAP = 52
FOOT = 96

H = (M + HEAD_H + sum(ROW_H) + sum(ROW_LABEL + BLOCK_GAP for _ in ROW_H) - BLOCK_GAP
     + FOOT + M)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

f_title = font(54, True)
f_sub = font(21)
f_sec = font(17, True)
f_name = font(21, True)
f_hex = font(34, True)
f_meta = font(15)

y = M
# ---- header -------------------------------------------------------------
d.text((M, y), "MedisDesign", font=f_title, fill="#0f131f")
w = d.textlength("MedisDesign", font=f_title)
d.text((M + w + 16, y + 22), "—  color palette", font=f_sub, fill="#727f9f")
d.text((M, y + 74), "medisdesign.com  ·  Zephyr (WordPress) theme color scheme  ·  extracted 2026-11-14",
       font=f_meta, fill="#727f9f")
d.line([(M, y + 118), (W - M, y + 118)], fill="#e3e7f0", width=2)
y += HEAD_H


def draw_row(label, items, height):
    global y
    d.text((M, y), label, font=f_sec, fill="#727f9f")
    y += ROW_LABEL
    n = len(items)
    wcard = (W - 2 * M - GAP * (n - 1)) / n
    for i, (name, hexv, role) in enumerate(items):
        x = M + i * (wcard + GAP)
        d.rounded_rectangle([x, y, x + wcard, y + height], radius=10, fill=hexv,
                            outline="#e3e7f0" if hexv.upper() in ("#FFFFFF", "#F2F4F7") else None,
                            width=2)
        fg = ink_on(hexv)
        d.text((x + 20, y + 18), name, font=f_name, fill=fg)
        d.text((x + 20, y + 50), hexv.upper(), font=f_hex, fill=fg)
        d.text((x + 20, y + height - 44), role, font=f_meta, fill=fg)
    y += height + BLOCK_GAP


draw_row("BRAND / ACCENT", BRAND, ROW_H[0])
draw_row("TEXT & INK", INK, ROW_H[1])
draw_row("SURFACES & BORDERS", SURFACE, ROW_H[2])
draw_row("DARK SURFACES (footer)", DARK, ROW_H[3])
draw_row("PAGE-BUILDER CUSTOM COLORS (one-off overrides)", CUSTOM, ROW_H[4])

y += 4
pairs = [("#a18e37", "#ffffff"), ("#35415b", "#ffffff"), ("#0f131f", "#ffffff"),
         ("#727f9f", "#ffffff"), ("#e3e7f0", "#0f131f"), ("#f77656", "#ffffff")]
labels = ["gold/white", "body/white", "ink/white", "muted/white", "border/footer", "coral/white"]
x = M
d.text((M, y), "CONTRAST (WCAG)", font=f_sec, fill="#727f9f")
y += 30
for (a, b), lab in zip(pairs, labels):
    c = contrast(a, b)
    txt = f"{lab}  {c:.1f}:1"
    d.text((x, y), txt, font=f_meta, fill="#0f131f" if c >= 4.5 else "#a18e37")
    x += d.textlength(txt, font=f_meta) + 34
d.text((M, y + 34), "Overlay: rgba(15,19,31,0.80)   ·   Primary faded: rgba(161,142,55,0.15)",
       font=f_meta, fill="#727f9f")

img.save("/Users/alishahabi/Projects/medisdesign/docs/color-palette.png")
print("saved", W, "x", H)
for a, b in pairs:
    print(f"{a} on {b}: {contrast(a,b):.2f}")

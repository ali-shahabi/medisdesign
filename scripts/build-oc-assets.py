#!/usr/bin/env python3
"""
Build the production assets for `redesign/oc-redesign.html`.

Why this exists
---------------
The mockup shipped the site's original font files unoptimised (two of them are
legacy `.woff`) and served full-resolution JPGs for plates that are displayed
at ~300 px. For production we need:

  1. fonts   — subset to the Latin + Persian ranges the site actually uses and
                re-encode as WOFF2 (the `.woff` Yekan faces were never converted).
                Metrics are untouched: same `glyf` outlines, same `hmtx`, only
                unused codepoints are dropped.
  2. images  — responsive WebP derivatives at the sizes the layout really uses,
                plus a 1200x630 Open Graph crop.

Dependencies: `fonttools[woff]` (with `brotli`), `pillow`. `cwebp` is used for
the WebP encode when available, Pillow otherwise.

Usage:
    python3 scripts/build-oc-assets.py
"""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REDESIGN = ROOT / "redesign"
SRC_FONTS = REDESIGN / "assets" / "fonts" / "site"
OUT_FONTS = REDESIGN / "assets" / "fonts" / "oc"
SRC_IMG = REDESIGN / "assets" / "img"
OUT_IMG = SRC_IMG / "mag"
MAG_DIR = SRC_IMG / "mag"
WP = ROOT / "public" / "wp-content" / "uploads"

# ---------------------------------------------------------------------------
# 1 — fonts
# ---------------------------------------------------------------------------

# Codepoints the site can actually render. Persian copy is arbitrary, so the
# whole Arabic block is kept (not a per-page subset) — the files stay reusable
# across every page of the site.
UNICODES = ",".join(
    [
        "U+0020-007E",  # ASCII printable
        "U+00A0,U+00AB,U+00BB,U+00D7",  # nbsp, guillemets, multiply
        "U+0600-06FF",  # Arabic — Persian letters, Arabic-Indic + Persian digits
        "U+0750-077F",  # Arabic Supplement
        "U+200C-200F",  # ZWNJ, ZWJ, LRM, RLM
        "U+2010-2015,U+2018-201F",  # dashes, quotes
        "U+2022,U+2026,U+2030,U+2039-203A,U+2044",  # bullet, ellipsis, dagger
        "U+2212",  # minus sign
    ]
)

# Four faces, not five. The display face (IRANYekan) carries every small
# Persian label and the body face carries everything at 300/400 — so the
# medium IRANSans file is never needed and its 23 KB never ships.
FACES = [
    # (source file, output file, weight, family label)
    ("iranyekanwebboldfanum.woff", "yekan-700.woff2", 700, "display 700"),
    ("iranyekanwebmediumfanum.woff", "yekan-500.woff2", 500, "display 500"),
    ("IRANSansWeb_Light.woff2", "sans-300.woff2", 300, "body 300"),
    ("IRANSansWeb.woff2", "sans-400.woff2", 400, "body 400"),
]


def build_fonts() -> None:
    OUT_FONTS.mkdir(parents=True, exist_ok=True)
    print("fonts")
    total_before = total_after = 0
    for src, dst, weight, label in FACES:
        s = SRC_FONTS / src
        d = OUT_FONTS / dst
        if not s.exists():
            print(f"  ! missing {src}")
            continue
        before = s.stat().st_size
        cmd = [
            sys.executable,
            "-m",
            "fontTools.subset",
            str(s),
            f"--unicodes={UNICODES}",
            "--layout-features=*",
            "--name-IDs=*",
            "--name-legacy",
            "--notdef-outline",
            "--no-hinting",
            "--desubroutinize",
            f"--flavor=woff2",
            f"--output-file={d}",
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL)
        after = d.stat().st_size
        total_before += before
        total_after += after
        print(
            f"  {label:>10}  {before / 1024:6.1f} KB -> {after / 1024:6.1f} KB"
            f"  ({100 - after / before * 100:.0f}% smaller)"
        )
    print(
        f"  total        {total_before / 1024:6.1f} KB -> {total_after / 1024:6.1f} KB"
    )


# ---------------------------------------------------------------------------
# 2 — images
# ---------------------------------------------------------------------------

# (source, output stem, widths to emit, focus point as a crop anchor 0..1)
DERIVATIVES = [
    # magazine thumbnails — 1:1 crops at card size
    (WP / "2024/10/inspire-industriehalle_750.jpg", "mag-1", [160, 320], 0.5),
    (WP / "2023/10/What-is-acoustics01.webp", "mag-2", [160, 320], 0.5),
    (SRC_IMG / "panel-2.jpg", "mag-3", [160, 320], 0.5),
    (WP / "2024/10/بیس_ترپ1.jpg", "mag-4", [160, 320], 0.5),
    # process plates — technical drawings on white
    (SRC_IMG / "mosque-wire.jpg", "plate-model", [320, 640], 0.5),
    (SRC_IMG / "drawing.jpg", "plate-section", [480, 960], 0.5),
    (SRC_IMG / "seatmap.jpg", "plate-seatmap", [320, 640], 0.5),
    # service cards — one image per practice, 16:9
    (SRC_IMG / "service-02.jpg", "svc-1", [480, 960], 0.5),
    (SRC_IMG / "service-01.jpg", "svc-2", [480, 960], 0.5),
    (SRC_IMG / "service-03.jpg", "svc-3", [480, 960], 0.5),
    (SRC_IMG / "hall-concert.jpg", "svc-4", [480, 960], 0.5),
    (SRC_IMG / "service-05.jpg", "svc-5", [480, 960], 0.5),
    (SRC_IMG / "service-04.jpg", "svc-6", [480, 960], 0.5),
]


def _focus_crop(im, ratio: float, fx: float, fy: float):
    """Crop to `ratio` (w/h) around the focus point."""
    w, h = im.size
    if w / h > ratio:
        nw = int(round(h * ratio))
        left = int(round((w - nw) * fx))
        left = max(0, min(w - nw, left))
        return im.crop((left, 0, left + nw, h))
    nh = int(round(w / ratio))
    top = int(round((h - nh) * fy))
    top = max(0, min(h - nh, top))
    return im.crop((0, top, w, top + nh))


def _trim_white(im, threshold: int = 242, pad: int = 8):
    """Trim the paper margin around a technical drawing."""
    grey = im.convert("L")
    mask = grey.point(lambda p: 0 if p > threshold else 255)
    bbox = mask.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    l = max(0, l - pad); t = max(0, t - pad)
    r = min(im.width, r + pad); b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


# Output aspect ratio per derivative stem.
RATIOS = {
    "mag-1": 1.0, "mag-2": 1.0, "mag-3": 1.0, "mag-4": 1.0,
    "plate-model": 4 / 3, "plate-section": 16 / 10, "plate-seatmap": 4 / 3,
    "svc-1": 16 / 9, "svc-2": 16 / 9, "svc-3": 16 / 9,
    "svc-4": 16 / 9, "svc-5": 16 / 9, "svc-6": 16 / 9,
}

# Stems whose source is a technical drawing on white — trim the paper margin.
TRIMMED = {"plate-model", "plate-section", "plate-seatmap"}


def build_images() -> None:
    from PIL import Image

    OUT_IMG.mkdir(parents=True, exist_ok=True)
    print("images")
    for src, stem, widths, focus in DERIVATIVES:
        if not src.exists():
            print(f"  ! missing {src}")
            continue
        im = Image.open(src)
        if im.mode != "RGB":
            bg = Image.new("RGB", im.size, (255, 255, 255))
            if im.mode in ("RGBA", "LA"):
                bg.paste(im, mask=im.split()[-1])
            else:
                bg.paste(im.convert("RGB"))
            im = bg
        for width in widths:
            ratio = RATIOS.get(stem, 16 / 9)
            src_im = _trim_white(im) if stem in TRIMMED else im
            out = _focus_crop(src_im, ratio, focus, focus)
            out = out.resize((width, max(1, int(round(width / ratio)))), Image.LANCZOS)
            target = MAG_DIR if stem.startswith("mag-") else SRC_IMG
            jpg = target / f"{stem}-{width}.jpg"
            out.save(jpg, "JPEG", quality=82, optimize=True, progressive=True)
            webp = target / f"{stem}-{width}.webp"
            out.save(webp, "WEBP", quality=80, method=6)
            print(f"  {stem:<13} {width}px  jpg {jpg.stat().st_size / 1024:5.1f} KB"
                  f"  webp {webp.stat().st_size / 1024:5.1f} KB")

    # Open Graph crop — 1200x630 from the concert hall
    og_src = SRC_IMG / "hall-concert.jpg"
    if og_src.exists():
        im = Image.open(og_src).convert("RGB")
        im = _focus_crop(im, 1200 / 630, 0.5, 0.45)
        im = im.resize((1200, 630), Image.LANCZOS)
        out = REDESIGN / "assets" / "brand" / "og-1200x630.jpg"
        im.save(out, "JPEG", quality=86, optimize=True, progressive=True)
        print(f"  og            1200x630  {out.stat().st_size / 1024:.1f} KB")


def build_manifest() -> None:
    """web app manifest so the site installs on a phone home screen."""
    out = REDESIGN / "site.webmanifest"
    out.write_text(
        """{
  "name": "گروه مهندسی مدیس",
  "short_name": "مدیس",
  "description": "طراحی آکوستیک، الکتروآکوستیک و معماری سالن‌های همایش، سینما و فضاهای فرهنگی.",
  "lang": "fa-IR",
  "dir": "rtl",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#F8F6F0",
  "theme_color": "#F8F6F0",
  "icons": [
    { "src": "assets/brand/favicon-180.png", "sizes": "180x180", "type": "image/png" },
    { "src": "assets/brand/favicon-32.png", "sizes": "32x32", "type": "image/png" }
  ]
}
""",
        encoding="utf-8",
    )
    print(f"manifest       {out.relative_to(ROOT)}")


if __name__ == "__main__":
    build_fonts()
    build_images()
    build_manifest()
    print("done")

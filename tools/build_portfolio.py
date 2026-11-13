#!/usr/bin/env python3
"""
Portfolio image pipeline.

Scans   portfolio/images/<collection>/   (JPG, JPEG, PNG, WebP)
Writes  portfolio/optimized/<collection>/<name>-<width>.webp
        portfolio/manifest.js            (read by the website)

Originals are never modified. Run this after adding, removing or
renaming photographs:

    python tools/build_portfolio.py

Options:
    --no-trim   keep images exactly as framed (by default, solid black
                screenshot bars at the top/bottom edge are trimmed from
                the optimized copies)
    --force     regenerate every optimized file

Requires Pillow:  python -m pip install pillow
"""
import json
import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is required. Install it with:  python -m pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "portfolio" / "images"
OUTPUT = ROOT / "portfolio" / "optimized"
MANIFEST = ROOT / "portfolio" / "manifest.js"

WIDTHS = [480, 800, 1200, 1800]   # responsive widths; never upscaled
QUALITY = 80                      # WebP quality
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
BAR_MAX_LUMA = 40                 # a row is a "bar" if its brightest pixel is below this
BAR_MAX_SHARE = 0.12              # never trim more than 12% from one edge


def natural_key(name):
    return [int(p) if p.isdigit() else p.lower() for p in re.split(r"(\d+)", name)]


def safe_stem(stem):
    return re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-") or "image"


def trim_bars(img):
    """Remove solid near-black bars (e.g. from phone screenshots) at top/bottom."""
    probe = img.convert("L").resize((48, img.height))
    data = probe.tobytes()
    height = img.height
    limit = int(height * BAR_MAX_SHARE)

    def is_bar(y):
        return max(data[y * 48:(y + 1) * 48]) < BAR_MAX_LUMA

    top = 0
    while top < limit and is_bar(top):
        top += 1
    bottom = 0
    while bottom < limit and is_bar(height - 1 - bottom):
        bottom += 1
    # ignore hairlines; add a small margin to clear soft edges
    top = top + 3 if top >= 4 else 0
    bottom = bottom + 3 if bottom >= 4 else 0
    if top or bottom:
        return img.crop((0, top, img.width, height - bottom))
    return img


def average_colour(img):
    r, g, b = img.convert("RGB").resize((1, 1)).getpixel((0, 0))
    return "#{:02x}{:02x}{:02x}".format(r, g, b)


def process(path, out_dir, rel_dir, trim, force):
    with Image.open(path) as opened:
        img = ImageOps.exif_transpose(opened)
        img.load()
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
    if trim:
        img = trim_bars(img)

    widths = [w for w in WIDTHS if w < img.width] + [img.width]
    stem = safe_stem(path.stem)
    sources, written = [], set()
    for width in widths:
        name = f"{stem}-{width}.webp"
        target = out_dir / name
        written.add(name)
        if force or not target.exists() or target.stat().st_mtime < path.stat().st_mtime:
            height = round(img.height * width / img.width)
            resized = img if width == img.width else img.resize((width, height), Image.LANCZOS)
            resized.save(target, "WEBP", quality=QUALITY, method=6)
        sources.append({"w": width, "src": f"{rel_dir}/{name}"})

    return {
        "file": path.name,
        "width": img.width,
        "height": img.height,
        "color": average_colour(img),
        "sources": sources,
    }, written


def main():
    trim = "--no-trim" not in sys.argv
    force = "--force" in sys.argv
    if not SOURCE.is_dir():
        sys.exit(f"Missing image directory: {SOURCE}")

    manifest, total = {}, 0
    for folder in sorted((p for p in SOURCE.iterdir() if p.is_dir()), key=lambda p: natural_key(p.name)):
        files = sorted(
            (f for f in folder.iterdir() if f.is_file() and f.suffix.lower() in EXTENSIONS),
            key=lambda f: natural_key(f.name),
        )
        out_dir = OUTPUT / folder.name
        out_dir.mkdir(parents=True, exist_ok=True)
        entries, keep = [], set()
        for f in files:
            try:
                entry, written = process(f, out_dir, f"portfolio/optimized/{folder.name}", trim, force)
            except Exception as error:  # unreadable/corrupt file: skip, keep going
                print(f"  ! skipped {folder.name}/{f.name}: {error}")
                continue
            entries.append(entry)
            keep |= written
        for stale in out_dir.glob("*.webp"):
            if stale.name not in keep:
                stale.unlink()
        manifest[folder.name] = entries
        total += len(entries)
        print(f"  {folder.name}: {len(entries)} image(s)")

    # remove optimized folders whose source collection no longer exists
    if OUTPUT.is_dir():
        for folder in OUTPUT.iterdir():
            if folder.is_dir() and folder.name not in manifest:
                for f in folder.glob("*.webp"):
                    f.unlink()
                try:
                    folder.rmdir()
                except OSError:
                    pass

    MANIFEST.write_text(
        "/* AUTO-GENERATED by tools/build_portfolio.py - do not edit by hand.\n"
        "   Re-run the script after changing anything in portfolio/images/. */\n"
        "window.PORTFOLIO_MANIFEST = " + json.dumps(manifest, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"Done: {total} image(s) in {len(manifest)} collection(s) -> {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

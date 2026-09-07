"""Regenerate checked-in web images without changing the source artwork.

Requires Pillow with WebP support; install scripts/requirements-images.txt.
Run from any directory: python scripts/optimize-images.py [--check]
"""

import argparse
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path
import re
import shutil

from PIL import Image, ImageChops, features


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src" / "assets"
OUTPUT = ASSETS / "optimized"
MANIFEST = OUTPUT / "manifest.json"
PREVIEW_WIDTHS = (480, 960, 1440)


def relative(path):
    return path.relative_to(OUTPUT).as_posix()


def encode(image, lossless):
    buffer = BytesIO()
    image.save(buffer, format="WEBP", lossless=lossless, quality=90, method=6, exact=True)
    return buffer.getvalue()


def pixels_equal(first, second):
    # Compare every RGBA channel, including RGB values under transparent pixels.
    difference = ImageChops.difference(first.convert("RGBA"), second.convert("RGBA"))
    return not any(channel.getbbox() for channel in difference.split())


def optimize(source, widths, preserve_full):
    with Image.open(source) as opened:
        image = opened.convert("RGBA" if "A" in opened.getbands() or "transparency" in opened.info else "RGB")
    destination = OUTPUT / source.relative_to(ASSETS).parent
    destination.mkdir(parents=True, exist_ok=True)
    result = {
        "source": source.relative_to(ASSETS).as_posix(),
        "sha256": sha256(source.read_bytes()).hexdigest(),
        "sourceBytes": source.stat().st_size,
        "width": image.width,
        "height": image.height,
        "previews": [],
    }
    if preserve_full:
        full_bytes = encode(image, lossless=True)
        # A JPEG source can already be smaller than an exact lossless WebP.
        # Keep its original encoding instead of recompressing it with more loss.
        if len(full_bytes) < source.stat().st_size:
            full_path = destination / f"{source.stem}-full.webp"
            full_path.write_bytes(full_bytes)
        else:
            full_path = destination / f"{source.stem}-full{source.suffix.lower()}"
            shutil.copyfile(source, full_path)
        with Image.open(full_path) as full:
            if full.size != image.size or not pixels_equal(image, full):
                raise ValueError(f"Full-resolution pixels changed: {source}")
        result["full"] = relative(full_path)
        result["fullBytes"] = full_path.stat().st_size

    for width in sorted({min(width, image.width) for width in widths}):
        height = max(1, round(image.height * width / image.width))
        preview = image.resize((width, height), Image.Resampling.LANCZOS) if width != image.width else image
        # UI screenshots sometimes compress better losslessly than as JPEG-like
        # images. Retain whichever encoding is smaller at this display size.
        lossless_bytes = encode(preview, lossless=True)
        lossy_bytes = encode(preview, lossless=False)
        is_lossless = len(lossless_bytes) <= len(lossy_bytes)
        preview_path = destination / f"{source.stem}-{width}.webp"
        preview_path.write_bytes(lossless_bytes if is_lossless else lossy_bytes)
        with Image.open(preview_path) as encoded:
            if encoded.size != (width, height):
                raise ValueError(f"Invalid preview dimensions: {preview_path}")
            if is_lossless and not pixels_equal(preview, encoded):
                raise ValueError(f"Lossless preview pixels changed: {preview_path}")
        result["previews"].append({
            "src": relative(preview_path), "width": width, "height": height,
            "bytes": preview_path.stat().st_size, "lossless": is_lossless,
        })
    return result


def sources():
    captures = sorted(
        path for path in (ASSETS / "proyectos" / "capturas").iterdir()
        if re.fullmatch(r"\d+[A-H]\.(png|jpe?g|webp|avif)", path.name, re.IGNORECASE)
    )
    entries = [(path, PREVIEW_WIDTHS, True) for path in captures]
    for name in ("crehana", "google", "utn"):
        entries.append((ASSETS / "certificaciones" / f"{name}.png", (320,), False))
    for name in ("arbusta-logo", "msa-logo"):
        entries.append((ASSETS / "experiencia" / f"{name}.png", (384,), False))
    for name in ("crehana_certificado.jpg", "utn_certificado.png"):
        entries.append((ASSETS / "certificaciones" / name, (480, 960), True))
    entries.append((ASSETS / "placeholders" / "wip.png", (480,), False))
    return entries


def check(entries):
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    expected = {source.relative_to(ASSETS).as_posix() for source, _, _ in entries}
    if set(manifest) != expected:
        raise ValueError("Source image inventory changed. Regenerate optimized images.")
    for source, widths, preserve_full in entries:
        entry = manifest[source.relative_to(ASSETS).as_posix()]
        if sha256(source.read_bytes()).hexdigest() != entry["sha256"]:
            raise ValueError(f"Source changed; regenerate images: {source}")
        with Image.open(source) as original:
            if [entry["width"], entry["height"]] != list(original.size):
                raise ValueError(f"Incorrect manifest dimensions: {source}")
            if preserve_full:
                full_path = OUTPUT / entry["full"]
                with Image.open(full_path) as full:
                    if full.size != original.size or not pixels_equal(original, full):
                        raise ValueError(f"Full-resolution pixels changed: {full_path}")
                if full_path.stat().st_size != entry["fullBytes"]:
                    raise ValueError(f"Full-resolution file size changed: {full_path}")
            if [preview["width"] for preview in entry["previews"]] != sorted({min(width, original.width) for width in widths}):
                raise ValueError(f"Preview widths changed: {source}")
        for preview in entry["previews"]:
            path = OUTPUT / preview["src"]
            with Image.open(path) as image:
                if image.size != (preview["width"], preview["height"]):
                    raise ValueError(f"Preview dimensions changed: {path}")
            if path.stat().st_size != preview["bytes"]:
                raise ValueError(f"Preview file size changed: {path}")
    print(f"Verified {len(manifest)} sources; full-resolution pixels match their originals.")
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify existing assets without rewriting them")
    args = parser.parse_args()
    if not features.check("webp"):
        raise SystemExit("Pillow must include WebP support.")
    entries = sources()
    if args.check:
        manifest = check(entries)
    else:
        with ThreadPoolExecutor(max_workers=4) as pool:
            results = list(pool.map(lambda entry: optimize(*entry), entries))
        manifest = {result["source"]: result for result in results}
        MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    catalog = {
        source: {key: value for key, value in entry.items() if key in ("width", "height", "full")}
        | {"previews": [{"src": p["src"], "width": p["width"]} for p in entry["previews"]]}
        for source, entry in manifest.items()
    }
    catalog_path = OUTPUT / "catalog.json"
    catalog_text = json.dumps(catalog, ensure_ascii=False, separators=(",", ":")) + "\n"
    if args.check:
        if not catalog_path.exists() or catalog_path.read_text(encoding="utf-8") != catalog_text:
            raise ValueError("Image catalog is stale. Regenerate optimized images.")
    else:
        catalog_path.write_text(catalog_text, encoding="utf-8")
    original_bytes = sum(entry["sourceBytes"] for entry in manifest.values())
    preview_bytes = sum(min(entry["previews"], key=lambda preview: abs(preview["width"] - 960))["bytes"] for entry in manifest.values())
    full_entries = [entry for entry in manifest.values() if "fullBytes" in entry]
    print(f"Sources: {original_bytes:,} bytes; default previews: {preview_bytes:,} bytes ({1 - preview_bytes / original_bytes:.1%} smaller).")
    print(f"Zoom originals: {sum(entry['sourceBytes'] for entry in full_entries):,} bytes; exact optimized images: {sum(entry['fullBytes'] for entry in full_entries):,} bytes.")


if __name__ == "__main__":
    main()

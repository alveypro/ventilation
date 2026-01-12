import hashlib
import json
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "data" / "ingest" / "manifest.json"
EXTRACTED_DIR = ROOT / "public" / "ingested-images"
PRODUCTS_PATH = ROOT / "src" / "data" / "ingested-products.ts"

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"}


def read_manifest():
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)


def hash_name(value: str) -> str:
    return hashlib.sha1(value.encode("utf-8")).hexdigest()


def extract_images_from_zip(file_path: Path) -> list:
    images = []
    try:
        with zipfile.ZipFile(file_path, "r") as zf:
            for member in zf.namelist():
                lower = member.lower()
                if not (lower.startswith("ppt/media/") or lower.startswith("word/media/")):
                    continue
                ext = Path(member).suffix.lower()
                if ext not in IMAGE_EXTS:
                    continue
                images.append(member)
    except zipfile.BadZipFile:
        return []
    return images


def extract_to_public(source_path: Path, member: str) -> str:
    key = f"{source_path.as_posix()}::{member}"
    hashed = hash_name(key)
    ext = Path(member).suffix.lower()
    target_name = f"{hashed}{ext}"
    target_path = EXTRACTED_DIR / target_name
    if target_path.exists():
        return f"/ingested-images/{target_name}"
    with zipfile.ZipFile(source_path, "r") as zf:
        with zf.open(member) as src, open(target_path, "wb") as dst:
            shutil.copyfileobj(src, dst)
    return f"/ingested-images/{target_name}"


def load_products():
    raw = PRODUCTS_PATH.read_text(encoding="utf-8")
    payload = raw.split("=", 1)[1].strip().rstrip(";")
    return json.loads(payload)


def save_products(products):
    PRODUCTS_PATH.write_text(
        "// 自动整合自本地课程资料\nexport const ingestedProductsData = "
        + json.dumps(products, ensure_ascii=False)
        + "\n",
        encoding="utf-8",
    )


def main():
    ensure_dir(EXTRACTED_DIR)
    manifest = read_manifest()

    image_map = {}
    for entry in manifest:
        rel_path = entry["path"]
        full_path = ROOT / "data" / "sources" / rel_path
        if not full_path.exists():
            continue
        if full_path.suffix.lower() not in {".pptx", ".docx"}:
            continue
        members = extract_images_from_zip(full_path)
        if not members:
            continue
        public_images = []
        for member in members:
            public_images.append(extract_to_public(full_path, member))
        image_map[rel_path] = public_images

    products = load_products()
    for product in products:
        sources = product.get("sourcePaths", [])
        images = []
        for source in sources:
            images.extend(image_map.get(source, []))
        if images:
            unique_images = list(dict.fromkeys(images))
            product["image"] = unique_images[0]
            product["images"] = unique_images[:8]

    save_products(products)
    print("images mapped", sum(1 for item in products if item.get("image")))


if __name__ == "__main__":
    main()

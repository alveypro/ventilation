import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "data" / "sources" / "呼吸机之家_50篇百科完整版"
CLINICAL_PATH = ROOT / "src" / "data" / "clinical-handbook.ts"
USER_PATH = ROOT / "src" / "data" / "public-user-library.ts"
SOURCE_PREFIX = "data/sources/呼吸机之家_50篇百科完整版/"


def load_array(path: Path, export_name: str):
    text = path.read_text(encoding="utf-8")
    marker = f"export const {export_name} = "
    start = text.find(marker)
    if start == -1:
        raise RuntimeError(f"{export_name} not found")
    array_start = text.find("[", start)
    array_end = text.rfind("]")
    if array_start == -1 or array_end == -1 or array_end <= array_start:
        raise RuntimeError(f"{export_name} array bounds not found")
    payload = text[array_start:array_end + 1]
    json_payload = to_json(payload)
    return text, json.loads(json_payload)


def save_array(path: Path, text: str, export_name: str, data):
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    marker = f"export const {export_name} = "
    start = text.find(marker)
    if start == -1:
        raise RuntimeError(f"{export_name} not found for save")
    array_start = text.find("[", start)
    array_end = text.rfind("]")
    if array_start == -1 or array_end == -1 or array_end <= array_start:
        raise RuntimeError(f"{export_name} array bounds not found for save")
    updated = text[:array_start] + payload + text[array_end + 1:]
    path.write_text(updated, encoding="utf-8")


def to_json(payload: str):
    # Convert JS-like object array to JSON.
    converted = payload
    converted = re.sub(r'([\s,{])([a-zA-Z0-9_]+)\s*:', r'\1"\2":', converted)
    converted = converted.replace("'", '"')
    converted = re.sub(r",\s*([}\]])", r"\1", converted)
    return converted


def extract_title(content: str, fallback: str):
    for line in content.splitlines():
        line = line.strip()
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


def extract_section(content: str, heading: str):
    pattern = re.compile(rf"^##\\s+{re.escape(heading)}\\s*$", re.M)
    match = pattern.search(content)
    if not match:
        return ""
    start = match.end()
    rest = content[start:].strip().split("\n## ")
    return rest[0].strip()


def summarize(content: str):
    summary = extract_section(content, "一句话定义")
    if summary:
        return summary.replace("\n", " ").strip()
    paragraphs = [line.strip() for line in content.splitlines() if line.strip() and not line.startswith("#")]
    return paragraphs[0] if paragraphs else "内容摘要待补充"


def keywords_from_title(title: str):
    keywords = []
    for token in re.findall(r"[A-Z0-9]{2,}", title):
        if token not in keywords:
            keywords.append(token)
    for zh in ["OSA", "AHI", "RDI", "PSG", "REM", "UARS", "T90", "ODI", "CPAP", "APAP", "BiPAP", "ST", "AVAPS", "iVAPS", "ASV", "EPAP", "IPAP", "PS", "COPD", "HFNC"]:
        if zh in title and zh not in keywords:
            keywords.append(zh)
    return keywords


def classify(index: int):
    if 1 <= index <= 15:
        return "clinical", "睡眠诊断", "基础"
    if 16 <= index <= 24:
        return "clinical", "通气治疗", "基础"
    if 25 <= index <= 35:
        return "user", "使用维护", "基础"
    if 36 <= index <= 39:
        return "clinical", "慢病管理", "进阶"
    if 40 <= index <= 44:
        return "clinical", "呼吸治疗", "进阶"
    return "user", "随访与安全", "基础"


def index_from_source_path(source_path: str):
    if not source_path:
        return 0
    name = Path(source_path).stem
    match = re.match(r"(\d+)_", name)
    return int(match.group(1)) if match else 0


def main():
    clinical_text, clinical_data = load_array(CLINICAL_PATH, "clinicalHandbookData")
    user_text, user_data = load_array(USER_PATH, "publicUserLibraryData")

    source_cache = {}
    for path in sorted(SRC_DIR.glob("*.md")):
        source_cache[str(path.relative_to(ROOT))] = path.read_text(encoding="utf-8")

    source_entries = []
    clinical_other = []
    user_other = []
    for item in clinical_data:
        if item.get("sourcePath", "").startswith(SOURCE_PREFIX):
            source_entries.append(item)
        else:
            clinical_other.append(item)
    for item in user_data:
        if item.get("sourcePath", "").startswith(SOURCE_PREFIX):
            source_entries.append(item)
        else:
            user_other.append(item)

    clinical_max = max((item["id"] for item in clinical_other), default=9000)
    user_max = max((item["id"] for item in user_other), default=8000)

    for item in sorted(source_entries, key=lambda entry: entry.get("sourcePath", "")):
        index = index_from_source_path(item.get("sourcePath", ""))
        content = source_cache.get(item.get("sourcePath", ""), "")
        target, category, level = classify(index)
        item["category"] = category
        item["level"] = level
        if content:
            item["content"] = content
            item["summary"] = summarize(content)
        if target == "clinical":
            clinical_max += 1
            item["id"] = clinical_max
            clinical_other.append(item)
        else:
            user_max += 1
            item["id"] = user_max
            user_other.append(item)

    clinical_data = clinical_other
    user_data = user_other

    existing_titles = {item["title"] for item in clinical_data} | {item["title"] for item in user_data}
    clinical_max = max((item["id"] for item in clinical_data), default=9000)
    user_max = max((item["id"] for item in user_data), default=8000)

    for path in sorted(SRC_DIR.glob("*.md")):
        name = path.stem
        match = re.match(r"(\d+)_", name)
        index = int(match.group(1)) if match else 0
        content = path.read_text(encoding="utf-8")
        title = extract_title(content, name)
        if title in existing_titles:
            continue
        target, category, level = classify(index)
        entry = {
            "title": title,
            "summary": summarize(content),
            "content": content,
            "category": category,
            "level": level,
            "docType": "百科",
            "keywords": keywords_from_title(title),
            "sourcePath": str(path.relative_to(ROOT)),
        }
        if target == "clinical":
            clinical_max += 1
            entry["id"] = clinical_max
            clinical_data.append(entry)
        else:
            user_max += 1
            entry["id"] = user_max
            user_data.append(entry)

    save_array(CLINICAL_PATH, clinical_text, "clinicalHandbookData", clinical_data)
    save_array(USER_PATH, user_text, "publicUserLibraryData", user_data)


if __name__ == "__main__":
    main()

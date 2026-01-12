import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "data" / "ingest" / "manifest.json"
EXTRACT_DIR = ROOT / "data" / "ingest" / "extracted"


KEYWORDS = [
    "无创通气", "有创通气", "呼吸机", "呼吸衰竭", "COPD", "OSA", "睡眠", "PSG", "CPAP", "BiPAP", "HFNC",
    "气道", "氧疗", "面罩", "AASM", "NIV", "机械通气", "血氧", "呼吸支持", "咳痰", "雾化", "通气",
    "睡眠监测", "滴定", "压力", "PEEP", "肺功能", "ResMed", "Philips", "DreamStation", "Trilogy",
    "V60", "A30", "A40", "E70", "Oxy100", "Alice", "OmniLab", "Actiwatch", "System One", "Sleepware",
]

CLINICAL_KEYWORDS = [
    "临床", "诊断", "治疗", "病例", "指南", "循证", "病理", "衰竭", "COPD", "OSA", "哮喘", "肺炎", "ARDS",
    "呼吸", "睡眠呼吸", "PSG", "AASM", "肺功能", "血气", "NIV", "HFNC", "通气", "气道", "氧合", "呼吸支持",
]

USER_KEYWORDS = [
    "睡眠", "面罩", "家庭", "患者", "使用", "保养", "维护", "护理", "依从", "教育", "佩戴", "培训", "操作",
    "故障", "指南", "常见问题", "FAQ", "使用技巧", "家用", "随访", "睡眠呼吸",
]

CATEGORY_RULES = [
    ("clinical", ["临床", "诊断", "治疗", "病例", "指南", "证据", "病理", "衰竭", "COPD", "OSA", "哮喘", "肺炎", "ARDS", "循证"]),
    ("product", ["产品", "设备", "参数", "型号", "配置", "系统", "平台", "软件", "产品介绍", "耗材", "面罩", "血氧", "仪器"]),
    ("usage", ["操作", "使用", "安装", "维护", "保养", "维修", "校准", "装机", "设置", "培训", "流程", "教程", "步骤", "技巧"]),
    ("business", ["销售", "市场", "话术", "渠道", "代理", "竞品", "对比", "方案", "商业", "投标", "客户"]),
    ("sleep", ["睡眠", "PSG", "AASM", "多导", "脑电", "睡眠监测", "呼吸暂停", "打鼾", "梦游"]),
]

CATEGORY_LABELS = {
    "clinical": "临床",
    "product": "产品",
    "usage": "使用",
    "business": "市场",
    "sleep": "睡眠",
    "general": "资料",
}

DOC_TYPE_WEIGHTS = {
    "课件": 5,
    "教程": 4,
    "大纲": 3,
    "资料": 2,
    "试题": 1,
}

PRODUCT_PATTERNS = [
    {"name": "Trilogy 100", "patterns": [r"Trilogy\s*100"], "type": "无创呼吸机", "brand": "飞利浦伟康"},
    {"name": "Trilogy 202", "patterns": [r"Trilogy\s*202"], "type": "无创呼吸机", "brand": "飞利浦伟康"},
    {"name": "Trilogy Oxy100", "patterns": [r"Oxy\s*100", r"Trilogy\s*Oxy"], "type": "高流量氧疗设备", "brand": "飞利浦伟康"},
    {"name": "Trilogy", "patterns": [r"Trilogy"], "type": "无创呼吸机", "brand": "飞利浦伟康"},
    {"name": "V60", "patterns": [r"\bV\s*60\b"], "type": "无创呼吸机", "brand": "飞利浦伟康"},
    {"name": "A30", "patterns": [r"\bA\s*30\b"], "type": "无创呼吸机", "brand": "飞利浦伟康"},
    {"name": "A40", "patterns": [r"\bA\s*40\b"], "type": "无创呼吸机", "brand": "飞利浦伟康"},
    {"name": "DS AVAPS AE", "patterns": [r"AVAPS\s*AE", r"DS\s*AVAPS"], "type": "无创呼吸机", "brand": "飞利浦伟康"},
    {"name": "DS ST", "patterns": [r"DS\s*ST"], "type": "无创呼吸机", "brand": "飞利浦伟康"},
    {"name": "DreamStation", "patterns": [r"Dream\s*Station", r"DreamStation"], "type": "无创呼吸机", "brand": "飞利浦伟康"},
    {"name": "System One", "patterns": [r"System\s*One"], "type": "无创呼吸机", "brand": "飞利浦伟康"},
    {"name": "OmniLab", "patterns": [r"OmniLab", r"Omni\s*Lab"], "type": "压力滴定设备", "brand": "飞利浦伟康"},
    {"name": "Alice 6", "patterns": [r"Alice\s*6"], "type": "睡眠监测设备", "brand": "飞利浦伟康"},
    {"name": "Alice PDx", "patterns": [r"PDx"], "type": "睡眠监测设备", "brand": "飞利浦伟康"},
    {"name": "Alice NightOne", "patterns": [r"NightOne"], "type": "便携式睡眠监测设备", "brand": "飞利浦伟康"},
    {"name": "Actiwatch", "patterns": [r"Actiwatch"], "type": "体动腕表", "brand": "飞利浦伟康"},
    {"name": "G3 软件", "patterns": [r"G3\s*软件", r"G3\b"], "type": "睡眠分析软件", "brand": "飞利浦伟康"},
    {"name": "E70", "patterns": [r"\bE\s*70\b", r"咳痰机"], "type": "排痰设备", "brand": "飞利浦伟康"},
    {"name": "HFNC", "patterns": [r"HFNC", r"高流量"], "type": "高流量氧疗设备", "brand": "其他"},
    {"name": "CPAP", "patterns": [r"CPAP"], "type": "睡眠呼吸机", "brand": "其他"},
    {"name": "BiPAP", "patterns": [r"BiPAP"], "type": "无创呼吸机", "brand": "其他"},
    {"name": "面罩", "patterns": [r"面罩", r"Mask"], "type": "医用面罩", "brand": "其他"},
    {"name": "血氧腕表", "patterns": [r"血氧腕表", r"700W"], "type": "血氧监测设备", "brand": "其他"},
]

PRODUCT_MODE_TOKENS = [
    "CPAP", "Auto", "AutoSet", "BiPAP", "S/T", "ST", "AVAPS", "ASV", "APAP",
    "A-Flex", "C-Flex", "PAV", "NIV", "HFNC",
]

SCENARIO_TAGS = [
    ("睡眠治疗", ["睡眠", "OSA", "PSG", "打鼾"]),
    ("慢阻肺", ["COPD", "慢阻肺", "慢性阻塞"]),
    ("家庭通气", ["家庭", "居家", "家用", "随访"]),
    ("急性呼衰", ["急性", "呼衰", "急性呼吸衰竭"]),
    ("ICU", ["ICU", "重症", "危重"]),
    ("术后支持", ["术后", "拔管", "围术期"]),
    ("气道廓清", ["咳痰", "气道廓清", "排痰"]),
    ("氧疗支持", ["氧疗", "高流量", "HFNC", "氧合"]),
    ("睡眠监测", ["睡眠监测", "多导", "AASM", "评分"]),
    ("康复护理", ["康复", "护理", "依从"]),
]

NORMALIZE_DROP = {
    "tep", "cc", "src", "level", "clinical", "product", "sleep", "rc", "tp", "t", "l",
    "新增", "试题", "测试题", "题库", "大纲", "课件", "教程", "培训", "介绍", "操作",
}


def read_manifest():
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def extract_text(rel_path: str) -> str:
    file_name = rel_path.replace("/", "__") + ".txt"
    full_path = EXTRACT_DIR / file_name
    if not full_path.exists():
        return ""
    return full_path.read_text(errors="ignore")


def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def make_summary(text: str, limit: int = 220) -> str:
    return text[:limit] if text else ""


def extract_keypoints(text: str, limit: int = 4) -> list:
    if not text:
        return []
    lines = re.split(r"[\r\n]+", text)
    points = []
    for line in lines:
        line = re.sub(r"\s+", " ", line).strip(" -•\t")
        if 18 <= len(line) <= 120 and re.match(r"^(\d+|[A-Za-z]|[一二三四五六七八九十])", line):
            points.append(line)
        if len(points) >= limit:
            break
    return points


def extract_keywords(title: str, text: str, limit: int = 8) -> list:
    hits = []
    haystack = f"{title} {text}"
    for kw in KEYWORDS:
        if kw.lower() in haystack.lower():
            hits.append(kw)
    tokens = re.findall(r"[A-Za-z0-9+\-/\.]{2,}", title)
    for token in tokens:
        if token not in hits:
            hits.append(token)
    uniq = []
    for kw in hits:
        if kw not in uniq:
            uniq.append(kw)
    return uniq[:limit]


def detect_category(path: str, text: str) -> str:
    merged = f"{path} {text}"
    for category, terms in CATEGORY_RULES:
        if any(term in merged for term in terms):
            return category
    return "general"


def detect_difficulty(path: str, tags: list, text: str) -> str:
    merged = f"{path} {text}"
    if "level1" in tags or "Level I" in merged or "LEVEL-I" in merged:
        return "基础"
    if "level2" in tags or "Level II" in merged or "LEVEL-II" in merged:
        return "中级"
    if "level3" in tags or "Level III" in merged or "LEVEL-III" in merged:
        return "高级"
    if "高级" in merged:
        return "高级"
    if "进阶" in merged or "中级" in merged:
        return "中级"
    return "基础"


def detect_doc_type(path: str) -> str:
    if "试题" in path or "题库" in path or "测试题" in path:
        return "试题"
    if "大纲" in path:
        return "大纲"
    if path.lower().endswith(".pptx") or path.lower().endswith(".ppt") or "课件" in path:
        return "课件"
    if "操作" in path or "培训" in path or "教程" in path:
        return "教程"
    return "资料"


def is_clinical(path: str, tags: list, text: str) -> bool:
    if "clinical" in tags:
        return True
    merged = f"{path} {text}"
    return any(term in merged for term in CLINICAL_KEYWORDS)


def is_user(path: str, tags: list, text: str) -> bool:
    if "sleep" in tags:
        return True
    merged = f"{path} {text}"
    return any(term in merged for term in USER_KEYWORDS)


def normalize_title(title: str) -> str:
    cleaned = re.sub(r"[【】\[\]（）()]", " ", title)
    cleaned = re.sub(r"[_\-]+", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip().lower()
    tokens = []
    for token in cleaned.split():
        token = re.sub(r"^level[-_]*", "", token)
        token = token.strip()
        if not token:
            continue
        if token in NORMALIZE_DROP:
            continue
        if token in {"i", "ii", "iii", "iv"}:
            continue
        tokens.append(token)
    return " ".join(tokens)


def extract_specs(text: str) -> dict:
    specs = {}
    if not text:
        return specs

    pressure = re.search(r"(\d{1,2})\s*[-~至]\s*(\d{1,2})\s*cmH2O", text, re.IGNORECASE)
    if pressure:
        specs["压力范围"] = f"{pressure.group(1)}-{pressure.group(2)} cmH2O"

    flow = re.search(r"(\d{1,3})\s*[-~至]\s*(\d{1,3})\s*L/?min", text, re.IGNORECASE)
    if flow:
        specs["流量范围"] = f"{flow.group(1)}-{flow.group(2)} L/min"

    noise = re.search(r"(\d{2,3})\s*dB", text, re.IGNORECASE)
    if noise:
        specs["噪音"] = f"{noise.group(1)} dB"

    weight = re.search(r"(\d+(?:\.\d+)?)\s*(kg|公斤)", text, re.IGNORECASE)
    if weight:
        specs["重量"] = f"{weight.group(1)} kg"

    power = re.search(r"(AC|DC)\s*\d{2,3}\s*V", text, re.IGNORECASE)
    if power:
        specs["供电"] = power.group(0).replace("  ", " ")

    modes = []
    for token in PRODUCT_MODE_TOKENS:
        if re.search(rf"\b{re.escape(token)}\b", text, re.IGNORECASE):
            modes.append(token)
    if modes:
        specs["通气模式"] = " / ".join(sorted(set(modes), key=modes.index))

    return specs


def extract_suitable_for(text: str) -> list:
    if not text:
        return []
    matches = []
    for pattern in [r"适用于([^。；\n]{4,60})", r"适应证[:：]?([^。；\n]{4,60})"]:
        for match in re.findall(pattern, text):
            snippet = re.sub(r"\s+", " ", match).strip()
            if snippet and snippet not in matches:
                matches.append(snippet)
    return matches[:4]


def extract_scenarios(text: str) -> list:
    if not text:
        return []
    tags = []
    for label, keys in SCENARIO_TAGS:
        if any(k.lower() in text.lower() for k in keys):
            tags.append(label)
    return tags[:6]


def calc_completeness(specs: dict, suitable_for: list, scenarios: list, source_types: list) -> int:
    score = 20
    score += min(30, len(specs) * 6)
    score += 15 if suitable_for else 0
    score += min(15, len(scenarios) * 3)
    score += min(20, len(source_types) * 4)
    return min(100, score)


def dedupe_items(items, key_fn):
    store = {}
    for item in items:
        key = key_fn(item)
        if key not in store:
            store[key] = item
            continue
        existing = store[key]
        score_existing = DOC_TYPE_WEIGHTS.get(existing.get("docType", "资料"), 1) + len(existing.get("summary", ""))
        score_new = DOC_TYPE_WEIGHTS.get(item.get("docType", "资料"), 1) + len(item.get("summary", ""))
        if score_new > score_existing:
            winner, loser = item, existing
        else:
            winner, loser = existing, item
        merged_keywords = list(dict.fromkeys((winner.get("keywords") or []) + (loser.get("keywords") or [])))
        winner["keywords"] = merged_keywords[:10]
        merged_points = list(dict.fromkeys((winner.get("keyPoints") or []) + (loser.get("keyPoints") or [])))
        winner["keyPoints"] = merged_points[:6]
        store[key] = winner
    return list(store.values())


def main():
    manifest = read_manifest()

    compiled_patterns = []
    for entry in PRODUCT_PATTERNS:
        compiled_patterns.append({
            "name": entry["name"],
            "patterns": [re.compile(pat, re.IGNORECASE) for pat in entry["patterns"]],
            "type": entry["type"],
            "brand": entry["brand"],
        })

    courses = []
    course_id = 10001
    product_map = {}
    clinical_items = []
    user_items = []

    for item in manifest:
        rel_path = item["path"]
        tags = item.get("tags", [])
        raw_text = extract_text(rel_path)
        text = clean_text(raw_text)
        if not text:
            continue

        title = re.sub(r"[\s_]+", " ", Path(rel_path).stem).strip()
        category_key = detect_category(rel_path, text[:800])
        difficulty = detect_difficulty(rel_path, tags, text[:400])
        doc_type = detect_doc_type(rel_path)

        courses.append({
            "id": course_id,
            "title": title,
            "category": CATEGORY_LABELS.get(category_key, category_key),
            "difficulty": difficulty,
            "duration": "—",
            "views": 0,
            "rating": 0,
            "content": text[:1200],
            "sourcePath": rel_path,
        })
        course_id += 1

        haystack = f"{rel_path} {text[:2000]}"
        for entry in compiled_patterns:
            if any(p.search(haystack) for p in entry["patterns"]):
                record = product_map.setdefault(entry["name"], {
                    "name": entry["name"],
                    "brand": entry["brand"],
                    "type": entry["type"],
                    "sources": [],
                    "samples": [],
                    "specs": {},
                    "suitableFor": [],
                    "scenarioTags": [],
                    "modeTags": [],
                    "sourceTypes": [],
                })
                record["sources"].append(rel_path)
                if text and len(record["samples"]) < 3:
                    record["samples"].append(text)
                record["specs"].update(extract_specs(text))
                record["suitableFor"].extend([s for s in extract_suitable_for(text) if s not in record["suitableFor"]])
                record["scenarioTags"].extend([s for s in extract_scenarios(text) if s not in record["scenarioTags"]])
                record["modeTags"].extend([s for s in PRODUCT_MODE_TOKENS if s.lower() in text.lower() and s not in record["modeTags"]])
                if doc_type not in record["sourceTypes"]:
                    record["sourceTypes"].append(doc_type)

        summary = make_summary(text, 220)
        key_points = extract_keypoints(raw_text)
        keywords = extract_keywords(title, text)

        common_fields = {
            "title": title,
            "summary": summary,
            "keyPoints": key_points,
            "keywords": keywords,
            "category": CATEGORY_LABELS.get(category_key, category_key),
            "level": difficulty,
            "docType": doc_type,
            "sourcePath": rel_path,
        }

        if is_clinical(rel_path, tags, text):
            clinical_items.append(common_fields.copy())
        if is_user(rel_path, tags, text):
            user_items.append(common_fields.copy())

    courses = dedupe_items(courses, lambda item: normalize_title(item["title"]))
    clinical_items = dedupe_items(
        clinical_items,
        lambda item: f"{normalize_title(item['title'])}|{item.get('docType', '')}",
    )
    user_items = dedupe_items(
        user_items,
        lambda item: f"{normalize_title(item['title'])}|{item.get('docType', '')}",
    )

    for idx, item in enumerate(courses, start=10001):
        item["id"] = idx
    for idx, item in enumerate(clinical_items, start=5001):
        item["id"] = idx
    for idx, item in enumerate(user_items, start=6001):
        item["id"] = idx

    products = []
    product_id = 20001
    for name, data in sorted(product_map.items(), key=lambda x: x[0].lower()):
        samples = data["samples"] or [""]
        desc = clean_text(" ".join(samples))[:360] or f"{name} 相关资料已整理。"
        specs = data["specs"]
        highlights = ["课程资料整理", "参数待补充", "权威课程来源"]
        if specs.get("压力范围"):
            highlights.insert(0, f"压力范围 {specs['压力范围']}")
        if specs.get("通气模式"):
            highlights.insert(0, f"模式 {specs['通气模式']}")
        completeness = calc_completeness(specs, data["suitableFor"], data["scenarioTags"], data["sourceTypes"])
        products.append({
            "id": product_id,
            "name": name,
            "brand": data["brand"],
            "type": data["type"],
            "price": 0,
            "rating": 0,
            "reviewCount": 0,
            "tag": "资料",
            "tagType": "info",
            "highlights": highlights[:4],
            "description": desc,
            "suitableFor": data["suitableFor"][:4],
            "specs": specs,
            "modeTags": data["modeTags"][:6],
            "scenarioTags": data["scenarioTags"][:6],
            "sourceTypes": data["sourceTypes"],
            "dataCompleteness": completeness,
            "image": None,
            "sourcePaths": data["sources"],
        })
        product_id += 1

    (ROOT / "src" / "data" / "ingested-courses.ts").write_text(
        "// 自动整合自本地课程资料\nexport const ingestedCoursesData = "
        + json.dumps(courses, ensure_ascii=False)
        + "\n",
        encoding="utf-8",
    )
    (ROOT / "src" / "data" / "ingested-products.ts").write_text(
        "// 自动整合自本地课程资料\nexport const ingestedProductsData = "
        + json.dumps(products, ensure_ascii=False)
        + "\n",
        encoding="utf-8",
    )
    (ROOT / "src" / "data" / "clinical-library.ts").write_text(
        "// 自动提炼的临床知识库\nexport const clinicalLibraryData = "
        + json.dumps(clinical_items, ensure_ascii=False, indent=2)
        + "\n",
        encoding="utf-8",
    )
    (ROOT / "src" / "data" / "user-library.ts").write_text(
        "// 自动提炼的用户知识库\nexport const userLibraryData = "
        + json.dumps(user_items, ensure_ascii=False, indent=2)
        + "\n",
        encoding="utf-8",
    )

    print("courses", len(courses))
    print("products", len(products))
    print("clinical", len(clinical_items))
    print("user", len(user_items))


if __name__ == "__main__":
    main()

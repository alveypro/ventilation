import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "src" / "data" / "catalog-products.ts"
CSV_PATH = ROOT / "data" / "sources" / "呼吸机之家_进阶交付包" / "呼吸机完整参数版.csv"

BRAND_MAP = {
    "ResMed": ("瑞思迈", 1),
    "Philips": ("飞利浦伟康", 2),
    "Yuwell": ("鱼跃", 4),
    "BMC": ("比扬", 9),
}

MODE_MAP = {
    "CPAP": "CPAP",
    "APAP": "APAP",
    "S": "S",
    "ST": "ST",
    "T": "T",
    "VAuto": "VAuto",
    "Auto": "Auto",
    "Auto-S": "AUTO_S",
    "AutoS": "AUTO_S",
    "AVAPS": "AVAPS",
    "iVAPS": "iVAPS",
}


def parse_modes(value: str):
    if not value:
        return []
    parts = re.split(r"[\\/、,]+", value)
    tags = []
    for part in parts:
        key = part.strip()
        if not key:
            continue
        mapped = MODE_MAP.get(key, key)
        if mapped not in tags:
            tags.append(mapped)
    return tags


def parse_range(value: str):
    if not value:
        return None, None
    cleaned = value.replace("–", "-").replace("—", "-").replace("－", "-")
    nums = re.findall(r"\d+(?:\.\d+)?", cleaned)
    if not nums:
        return None, None
    if len(nums) == 1:
        return float(nums[0]), float(nums[0])
    return float(nums[0]), float(nums[1])


def to_bool(value: str):
    if value is None:
        return None
    value = value.strip()
    if value in {"是", "有", "支持", "true", "True", "1"}:
        return True
    if value in {"否", "无", "不支持", "false", "False", "0", "-"}:
        return False
    return None


def load_catalog():
    text = CATALOG_PATH.read_text(encoding="utf-8")
    marker = "export const catalogProductsData = "
    start = text.find(marker)
    if start == -1:
        raise RuntimeError("catalogProductsData not found")
    array_start = text.find("[", start)
    array_end = text.rfind("]")
    if array_start == -1 or array_end == -1 or array_end <= array_start:
        raise RuntimeError("catalogProductsData array bounds not found")
    payload = text[array_start:array_end + 1]
    return text, json.loads(payload)


def save_catalog(original_text: str, data):
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    marker = "export const catalogProductsData = "
    start = original_text.find(marker)
    if start == -1:
        raise RuntimeError("catalogProductsData not found for save")
    array_start = original_text.find("[", start)
    array_end = original_text.rfind("]")
    if array_start == -1 or array_end == -1 or array_end <= array_start:
        raise RuntimeError("catalogProductsData array bounds not found for save")
    updated = original_text[:array_start] + payload + original_text[array_end + 1:]
    CATALOG_PATH.write_text(updated, encoding="utf-8")


def main():
    original_text, catalog = load_catalog()
    by_name = {item["name"].lower(): item for item in catalog}
    max_id = max(item["id"] for item in catalog) if catalog else 30000

    with CSV_PATH.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            brand_raw = row.get("\ufeffbrand", "").strip()
            model_name = row.get("model_name", "").strip()
            if not model_name:
                continue
            brand_name, brand_id = BRAND_MAP.get(brand_raw, (brand_raw, None))
            modes = row.get("modes", "").strip()
            epap_range = row.get("epap_range", "").strip()
            ipap_max = row.get("ipap_max", "").strip()
            backup_rate = to_bool(row.get("backup_rate", ""))
            target_tv = to_bool(row.get("target_tidal_volume", ""))
            price_min = row.get("price_min_CNY", "").strip()
            price_max = row.get("price_max_CNY", "").strip()

            epap_min, epap_max = parse_range(epap_range)
            ipap_max_val = float(ipap_max) if re.match(r"\\d", ipap_max) else None
            mode_tags = parse_modes(modes)

            device_type = "PAP_SLEEP"
            if any(tag in {"ST", "T", "AVAPS", "iVAPS", "AUTO_S"} for tag in mode_tags) or backup_rate or target_tv:
                device_type = "NIV_HOME"

            price_value = int(float(price_min)) if price_min else 0
            price_range = ""
            if price_min and price_max:
                price_range = f"{price_min}-{price_max} 元"

            entry = by_name.get(model_name.lower())
            if entry:
                entry["brand"] = entry.get("brand") or brand_name
                entry["brandId"] = entry.get("brandId") or brand_id
                if price_value:
                    entry["price"] = price_value
                if mode_tags:
                    entry["modeTags"] = mode_tags
                if epap_min is not None:
                    entry["epapMin"] = epap_min
                if epap_max is not None:
                    entry["epapMax"] = epap_max
                if ipap_max_val is not None:
                    entry["ipapMax"] = ipap_max_val
                if backup_rate is not None:
                    entry["backupRate"] = backup_rate
                if target_tv is not None:
                    entry["targetVentilation"] = target_tv
                entry["deviceType"] = entry.get("deviceType") or device_type
                entry["specs"] = entry.get("specs") or {}
                if epap_range:
                    entry["specs"]["EPAP"] = f"{epap_range} cmH2O"
                if ipap_max_val is not None:
                    entry["specs"]["IPAP上限"] = f"{ipap_max_val} cmH2O"
                if price_range:
                    entry["specs"]["价格区间"] = price_range
                highlights = entry.get("highlights") or []
                if price_range and all("价格区间" not in h for h in highlights):
                    highlights.append(f"价格区间 {price_range}")
                entry["highlights"] = highlights
                entry["sourceTypes"] = list(set((entry.get("sourceTypes") or []) + ["进阶包"]))
                entry["sourcePaths"] = list(set((entry.get("sourcePaths") or []) + [str(CSV_PATH.relative_to(ROOT))]))
                continue

            max_id += 1
            catalog.append({
                "id": max_id,
                "name": model_name,
                "brand": brand_name,
                "brandId": brand_id,
                "platformId": None,
                "series": model_name.split(" ")[0] if " " in model_name else model_name,
                "type": "呼吸机",
                "price": price_value,
                "rating": 0,
                "reviewCount": 0,
                "tag": "目录",
                "tagType": "success",
                "highlights": [f"模式 {modes}" if modes else "模式待补充", f"价格区间 {price_range}" if price_range else "价格待补充"],
                "description": "进阶包参数整理",
                "suitableFor": ["sleep_apnea"] if device_type == "PAP_SLEEP" else ["copd", "ohs", "neuromuscular"],
                "specs": {
                    "EPAP": f"{epap_range} cmH2O" if epap_range else "—",
                    "IPAP上限": f"{ipap_max_val} cmH2O" if ipap_max_val is not None else "—",
                    "价格区间": price_range or "—",
                },
                "image": None,
                "sourcePaths": [str(CSV_PATH.relative_to(ROOT))],
                "deviceType": device_type,
                "platformFamily": None,
                "status": "在售",
                "modeTags": mode_tags,
                "epapMin": epap_min,
                "epapMax": epap_max,
                "ipapMax": ipap_max_val,
                "backupRate": backup_rate,
                "targetVentilation": target_tv,
                "asv": False,
                "humidifier": "可选",
                "heatedTube": "可选",
                "noiseDb": None,
                "weightKg": None,
                "connectivity": [],
                "power": [],
                "channels": ["电商", "线下"],
                "refurbRisk": "中",
                "overclaimRisk": "低",
                "scenarioTags": ["睡眠治疗"] if device_type == "PAP_SLEEP" else ["家庭通气"],
                "sourceTypes": ["进阶包"],
                "dataCompleteness": 60,
                "aliasNames": [],
            })

    save_catalog(original_text, catalog)


if __name__ == "__main__":
    main()

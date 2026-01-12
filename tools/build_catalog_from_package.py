import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACKAGE_DIR = ROOT / "data" / "sources" / "呼吸机之家_站点内容包_A+B_不含ICU"


def read_csv(path: Path):
    with path.open("r", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def parse_json_list(value: str):
    if not value:
        return []
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return [item.strip() for item in value.split(",") if item.strip()]


def to_float(value: str):
    if value is None or value == "":
        return None
    try:
        return float(value)
    except ValueError:
        return None


def to_bool(value: str):
    if value is None or value == "":
        return None
    return value in {"1", "true", "TRUE", "True"}


def device_type_label(device_type: str):
    if device_type == "PAP_SLEEP":
        return "睡眠PAP"
    if device_type == "NIV_HOME":
        return "家用NIV"
    if device_type == "PAP_TRAVEL":
        return "便携/旅行"
    return "呼吸设备"


def device_type_to_type(device_type: str):
    if device_type == "PAP_SLEEP":
        return "睡眠呼吸机"
    if device_type == "NIV_HOME":
        return "家用无创NIV"
    if device_type == "PAP_TRAVEL":
        return "便携/旅行PAP"
    return "呼吸设备"


def build_specs(model):
    specs = {}
    epap_min = to_float(model.get("epap_min", ""))
    epap_max = to_float(model.get("epap_max", ""))
    ipap_max = to_float(model.get("ipap_max", ""))
    if epap_min is not None and epap_max is not None:
        specs["EPAP"] = f"{epap_min:g}-{epap_max:g} cmH2O"
    if ipap_max is not None:
        specs["IPAP上限"] = f"{ipap_max:g} cmH2O"
    if model.get("noise_db"):
        specs["噪音"] = model["noise_db"]
    if model.get("weight_kg"):
        specs["重量"] = f"{model['weight_kg']} kg"
    if model.get("humidifier"):
        specs["湿化器"] = model["humidifier"]
    if model.get("heated_tube"):
        specs["加温管路"] = model["heated_tube"]
    return specs


def build_highlights(model):
    items = []
    mode_tags = parse_json_list(model.get("mode_tags", ""))
    if mode_tags:
        items.append("模式 " + " / ".join(mode_tags[:3]))
    epap_min = to_float(model.get("epap_min", ""))
    epap_max = to_float(model.get("epap_max", ""))
    if epap_min is not None and epap_max is not None:
        items.append(f"压力范围 {epap_min:g}-{epap_max:g} cmH2O")
    if model.get("heated_tube") == "支持":
        items.append("支持加温管路")
    if model.get("humidifier") == "一体":
        items.append("一体式加湿")
    return items[:4] or ["目录资料整理"]


def build_suitable_for(device_type: str):
    if device_type == "PAP_SLEEP":
        return ["sleep_apnea"]
    if device_type == "NIV_HOME":
        return ["copd"]
    return []


def build_scenarios(device_type: str, mode_tags):
    tags = []
    if device_type == "PAP_SLEEP":
        tags.extend(["睡眠治疗", "家庭通气"])
    if device_type == "NIV_HOME":
        tags.extend(["慢阻肺", "家庭通气"])
    if device_type == "PAP_TRAVEL":
        tags.extend(["便携出行", "家庭通气"])
    if "ST" in mode_tags:
        tags.append("复杂通气")
    if "iVAPS" in mode_tags or "AVAPS" in mode_tags:
        tags.append("目标通气")
    return list(dict.fromkeys(tags))[:6]


def normalize_name(name: str):
    return re.sub(r"\s+", "", name.lower())


def main():
    brands = read_csv(PACKAGE_DIR / "brand.csv")
    platforms = read_csv(PACKAGE_DIR / "platform.csv")
    models = read_csv(PACKAGE_DIR / "model.csv")

    brand_map = {row["brand_id"]: row for row in brands}
    platform_map = {row["platform_id"]: row for row in platforms}

    catalog_brands = []
    for row in brands:
        catalog_brands.append({
            "id": int(row["brand_id"]),
            "name": row["name_cn"],
            "country": row.get("country") or "",
            "description": row.get("notes") or f"{row.get('name_en','')} 品牌",
            "marketShare": "",
            "productCount": None,
            "founded": None,
            "logo": "",
        })

    catalog_products = []
    next_id = 30001
    for row in models:
        brand = brand_map.get(row["brand_id"], {})
        platform = platform_map.get(row["platform_id"], {})
        mode_tags = parse_json_list(row.get("mode_tags", ""))
        connectivity = parse_json_list(row.get("connectivity", ""))
        channels = parse_json_list(row.get("channels", ""))
        alias_names = parse_json_list(row.get("alias_names", ""))
        device_type = row.get("device_type") or "PAP_SLEEP"
        product = {
            "id": next_id,
            "name": row.get("model_name") or "",
            "brand": brand.get("name_cn") or "",
            "brandId": int(row["brand_id"]),
            "platformId": int(row["platform_id"]),
            "series": row.get("series") or "",
            "type": device_type_to_type(device_type),
            "price": 0,
            "rating": 0,
            "reviewCount": 0,
            "tag": "目录",
            "tagType": "success",
            "highlights": build_highlights(row),
            "description": row.get("notes") or f"{row.get('series','')} 系列型号。",
            "suitableFor": build_suitable_for(device_type),
            "specs": build_specs(row),
            "image": None,
            "sourcePaths": [],
            "deviceType": device_type,
            "platformFamily": platform.get("platform_family") or row.get("series") or "",
            "status": row.get("status") or "不明",
            "modeTags": mode_tags,
            "epapMin": to_float(row.get("epap_min")),
            "epapMax": to_float(row.get("epap_max")),
            "ipapMax": to_float(row.get("ipap_max")),
            "backupRate": to_bool(row.get("backup_rate")),
            "targetVentilation": to_bool(row.get("target_ventilation")),
            "asv": to_bool(row.get("asv")),
            "humidifier": row.get("humidifier") or None,
            "heatedTube": row.get("heated_tube") or None,
            "noiseDb": row.get("noise_db") or None,
            "weightKg": to_float(row.get("weight_kg")),
            "connectivity": connectivity,
            "power": parse_json_list(row.get("power", "")),
            "channels": channels,
            "refurbRisk": row.get("refurb_risk") or None,
            "overclaimRisk": row.get("overclaim_risk") or None,
            "scenarioTags": build_scenarios(device_type, mode_tags),
            "sourceTypes": ["目录"],
            "dataCompleteness": 88,
            "aliasNames": alias_names,
            "platformNotes": platform.get("risk_notes") or "",
            "uiSignature": platform.get("ui_signature") or "",
            "dataSignature": platform.get("data_signature") or "",
            "hardwareSignature": platform.get("hardware_signature") or "",
        }
        catalog_products.append(product)
        next_id += 1

    (ROOT / "src" / "data" / "catalog-brands.ts").write_text(
        "// 自动从站点内容包生成\nexport const catalogBrandsData = "
        + json.dumps(catalog_brands, ensure_ascii=False, indent=2)
        + "\n",
        encoding="utf-8",
    )

    (ROOT / "src" / "data" / "catalog-products.ts").write_text(
        "// 自动从站点内容包生成\nexport const catalogProductsData = "
        + json.dumps(catalog_products, ensure_ascii=False, indent=2)
        + "\n",
        encoding="utf-8",
    )

    print("brands", len(catalog_brands))
    print("products", len(catalog_products))


if __name__ == "__main__":
    main()

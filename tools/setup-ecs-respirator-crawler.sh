#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-root@47.90.160.87}"
REMOTE_KEY="${REMOTE_KEY:-$HOME/Downloads/open.pem}"

ssh -i "$REMOTE_KEY" "$REMOTE_HOST" 'bash -s' <<'REMOTE'
set -euo pipefail

install -d -m 755 /opt/airivo-crawler
install -d -m 755 /home/admin/.openclaw/workspace/data/respirators

cat >/opt/airivo-crawler/crawl_respirators.py <<'PY'
#!/usr/bin/env python3
import json
import os
import re
import time
from datetime import datetime
from urllib.parse import quote_plus
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET

OUT_DIR = "/home/admin/.openclaw/workspace/data/respirators"

DOMESTIC = [
    {"brand": "鱼跃", "model": "YH-450 Auto", "features": ["自动滴定", "静音设计", "蓝牙传输"], "pressure_range": "4-20 cmH2O"},
    {"brand": "瑞迈特", "model": "G3 Auto CPAP", "features": ["智能压力调节", "数据导出", "自动启停"], "pressure_range": "4-20 cmH2O"},
    {"brand": "凯迪泰", "model": "S9 Auto", "features": ["自动调压", "加温湿化", "漏气监测"], "pressure_range": "4-20 cmH2O"},
    {"brand": "新松", "model": "S8 Auto", "features": ["自动调压", "静音运行"], "pressure_range": "4-20 cmH2O"},
]

IMPORTED = [
    {"brand": "瑞思迈", "model": "AirSense 11 AutoSet", "features": ["自动调压", "呼气缓释", "云端随访"], "pressure_range": "4-20 cmH2O"},
    {"brand": "飞利浦伟康", "model": "DreamStation Auto CPAP", "features": ["智能算法", "湿化集成", "远程管理"], "pressure_range": "4-20 cmH2O"},
    {"brand": "费雪派克", "model": "SleepStyle Auto", "features": ["智能舒适算法", "集成湿化", "低噪音"], "pressure_range": "4-20 cmH2O"},
    {"brand": "律维施泰因", "model": "Prisma SMART", "features": ["自动调压", "数据追踪"], "pressure_range": "4-20 cmH2O"},
]

RANGE_RE = re.compile(r"([1-9]\d{2,5})\s*(?:-|~|至)\s*([1-9]\d{2,5})\s*元")
SINGLE_RE = re.compile(r"(?:¥|￥)\s*([1-9]\d{2,5})|([1-9]\d{2,5})\s*元")


def fetch_rss_text(query):
    url = "https://www.bing.com/search?format=rss&q=" + quote_plus(query)
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (respirator-crawler/1.0)"})
    with urlopen(req, timeout=20) as resp:
        return resp.read().decode("utf-8", "ignore")


def extract_prices(text):
    prices = []
    for m in RANGE_RE.finditer(text):
        a = int(m.group(1))
        b = int(m.group(2))
        if 500 <= a <= 50000 and 500 <= b <= 50000:
            prices.extend([a, b])
    for m in SINGLE_RE.finditer(text):
        raw = m.group(1) or m.group(2)
        if not raw:
            continue
        v = int(raw)
        if 500 <= v <= 50000:
            prices.append(v)
    return prices


def estimate_price(item, previous_map):
    key = item["brand"] + " " + item["model"]
    query = key + " 呼吸机 价格"
    try:
        rss = fetch_rss_text(query)
        root = ET.fromstring(rss)
        texts = []
        for node in root.findall(".//item"):
            title = (node.findtext("title") or "").strip()
            desc = (node.findtext("description") or "").strip()
            texts.append(title + " " + desc)
        joined = " ".join(texts)
        values = extract_prices(joined)
        if values:
            values = sorted(values)
            low = values[0]
            high = values[-1]
            if low == high:
                high = int(low * 1.12)
            return "{}-{}".format(low, high)
    except Exception:
        pass
    prev = previous_map.get(key)
    if prev and prev.get("price"):
        return prev["price"]
    return "待更新"


def load_previous(path):
    if not os.path.exists(path):
        return {}
    try:
        arr = json.load(open(path, "r", encoding="utf-8"))
    except Exception:
        return {}
    if not isinstance(arr, list):
        return {}
    out = {}
    for it in arr:
        if not isinstance(it, dict):
            continue
        k = "{} {}".format(it.get("brand", ""), it.get("model", "")).strip()
        if k:
            out[k] = it
    return out


def build_list(base, prev_map):
    result = []
    for item in base:
        row = dict(item)
        row["price"] = estimate_price(item, prev_map)
        result.append(row)
        time.sleep(0.2)
    return result


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    domestic_path = os.path.join(OUT_DIR, "domestic.json")
    imported_path = os.path.join(OUT_DIR, "imported.json")
    params_path = os.path.join(OUT_DIR, "parameters.json")

    prev_domestic = load_previous(domestic_path)
    prev_imported = load_previous(imported_path)

    domestic = build_list(DOMESTIC, prev_domestic)
    imported = build_list(IMPORTED, prev_imported)
    generated_at = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    params = [
        {"name": "数据更新时间", "detail": generated_at},
        {"name": "来源策略", "detail": "关键词聚合抓取（Bing RSS）+ 价格正则提取 + 历史回填"},
        {"name": "压力范围", "detail": "多数家用PAP设备常见为 4-20 cmH2O，需结合评估设置"},
        {"name": "使用说明", "detail": "爬虫价格为区间估计，仅供选型初筛"},
    ]

    write_json(domestic_path, domestic)
    write_json(imported_path, imported)
    write_json(params_path, params)
    print("Generated:")
    print(domestic_path)
    print(imported_path)
    print(params_path)


if __name__ == "__main__":
    main()
PY

chmod +x /opt/airivo-crawler/crawl_respirators.py

if ! grep -q "crawl_respirators.py" /etc/crontab; then
  echo "12 * * * * root /opt/airivo-crawler/crawl_respirators.py >> /var/log/respirator-crawler.log 2>&1" >> /etc/crontab
fi

/opt/airivo-crawler/crawl_respirators.py || true
ls -lah /home/admin/.openclaw/workspace/data/respirators
tail -n 20 /var/log/respirator-crawler.log 2>/dev/null || true
REMOTE

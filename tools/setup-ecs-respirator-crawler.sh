#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-root@47.90.160.87}"
REMOTE_KEY="${REMOTE_KEY:-$HOME/Downloads/open.pem}"

ssh -i "$REMOTE_KEY" "$REMOTE_HOST" 'bash -s' <<'REMOTE'
set -euo pipefail

install -d -m 755 /opt/airivo-crawler
install -d -m 755 /home/admin/.openclaw/workspace/data/respirators
python3 -m pip install --user beautifulsoup4 lxml >/tmp/respirator-pip.log 2>&1 || true

cat >/opt/airivo-crawler/crawl_respirators.py <<'PY'
#!/usr/bin/env python3
import json
import os
import re
import time
from datetime import datetime
from urllib.parse import quote
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup

OUT_DIR = "/home/admin/.openclaw/workspace/data/respirators"
SOURCE_NAME = "made-in-china"
SOURCE_BASE = "https://www.made-in-china.com/products-search/hot-china-products/{}.html"

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

MODEL_HINTS = {
    "YH-450 Auto": ["YH-450", "Yuwell", "鱼跃"],
    "G3 Auto CPAP": ["G3", "BMC", "瑞迈特"],
    "S9 Auto": ["S9", "凯迪泰", "Canta", "Yuwell"],
    "S8 Auto": ["S8", "新松", "Sino", "Auto CPAP"],
    "AirSense 11 AutoSet": ["AirSense", "11", "ResMed", "瑞思迈"],
    "DreamStation Auto CPAP": ["DreamStation", "Philips", "飞利浦"],
    "SleepStyle Auto": ["SleepStyle", "Fisher", "Paykel", "费雪"],
    "Prisma SMART": ["Prisma", "Lowenstein", "Löwenstein", "律维施泰因"],
}

PRICE_RE = re.compile(r"US\$\s*([\d,.]+)(?:\s*-\s*([\d,.]+))?", re.I)
ALLOW_TITLE_TERMS = ["cpap", "apap", "bipap", "sleep apnea", "ventilator", "respironics"]
BLOCK_TITLE_TERMS = ["car", "auto parts", "oil filter", "telescope", "monokular", "truck", "headlight", "sensor"]


def fetch_html(keyword):
    slug = quote(keyword.replace(" ", "-"))
    url = SOURCE_BASE.format(slug)
    req = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (respirator-crawler/2.0)",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urlopen(req, timeout=20) as resp:
        return url, resp.read().decode("utf-8", "ignore")


def parse_items(html):
    soup = BeautifulSoup(html, "lxml")
    items = []
    for box in soup.select("div.products-item"):
        link_node = box.select_one("h2.product-name a")
        price_node = box.select_one(".price-new .price") or box.select_one(".price .price") or box.select_one(".price")
        if not link_node or not price_node:
            continue
        title = " ".join(link_node.get_text(" ", strip=True).split())
        t_low = title.lower()
        if not any(term in t_low for term in ALLOW_TITLE_TERMS):
            continue
        if any(term in t_low for term in BLOCK_TITLE_TERMS):
            continue
        link = link_node.get("href", "").strip()
        price_text = " ".join(price_node.get_text(" ", strip=True).split())
        company_node = box.select_one(".company-name a")
        company = " ".join(company_node.get_text(" ", strip=True).split()) if company_node else ""
        moq_node = box.select_one(".moq-new .attribute")
        moq = " ".join(moq_node.get_text(" ", strip=True).split()) if moq_node else ""
        if not title or not link or not price_text:
            continue
        items.append(
            {
                "title": title,
                "url": link,
                "price_text": price_text,
                "company": company,
                "moq": moq,
            }
        )
    return items


def parse_price(price_text):
    m = PRICE_RE.search(price_text)
    if not m:
        return None
    low = float(m.group(1).replace(",", ""))
    high = float((m.group(2) or m.group(1)).replace(",", ""))
    return low, high


def score_item(source, model):
    title = source["title"].lower()
    score = 0
    for token in MODEL_HINTS.get(model, []):
        tok = token.lower()
        if tok and tok in title:
            score += 3
    for token in model.lower().split():
        if len(token) >= 3 and token in title:
            score += 2
    return score


def crawl_external_offer(item):
    queries = [
        "{} {}".format(item["brand"], item["model"]),
        item["model"],
        "{} CPAP".format(item["brand"]),
        "CPAP",
    ]
    candidates = []
    seen = set()
    for q in queries:
        if q in seen:
            continue
        seen.add(q)
        try:
            source_url, html = fetch_html(q)
            for src in parse_items(html):
                src["from_search"] = source_url
                src["score"] = score_item(src, item["model"])
                candidates.append(src)
            time.sleep(0.4)
        except Exception:
            continue
    if not candidates:
        return None

    # 优先命中型号，再按价格文本完整度和标题长度排序。
    candidates.sort(
        key=lambda x: (
            x["score"],
            1 if parse_price(x["price_text"]) else 0,
            len(x["title"]),
        ),
        reverse=True,
    )
    for hit in candidates:
        if hit["score"] < 3:
            continue
        parsed = parse_price(hit["price_text"])
        if not parsed:
            continue
        low, high = parsed
        return {
            "price": "US${:.2f}-{:.2f}".format(low, high),
            "source_name": SOURCE_NAME,
            "source_url": hit["url"],
            "source_title": hit["title"],
            "source_company": hit["company"],
            "source_moq": hit["moq"],
            "source_price_text": hit["price_text"],
            "source_search_url": hit["from_search"],
        }
    return None


def enrich_item(item):
    row = dict(item)
    try:
        offer = crawl_external_offer(item)
        if offer:
            row.update(offer)
        else:
            row["price"] = "未抓到外部价格"
            row["source_name"] = SOURCE_NAME
            row["source_url"] = ""
            row["source_title"] = ""
            row["source_company"] = ""
            row["source_moq"] = ""
            row["source_price_text"] = ""
            row["source_search_url"] = ""
    except Exception:
        row["price"] = "抓取失败"
        row["source_name"] = SOURCE_NAME
    row["updated_at"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    return row


def build_list(base):
    result = []
    for item in base:
        row = enrich_item(item)
        result.append(row)
        time.sleep(0.3)
    return result


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    domestic_path = os.path.join(OUT_DIR, "domestic.json")
    imported_path = os.path.join(OUT_DIR, "imported.json")
    params_path = os.path.join(OUT_DIR, "parameters.json")

    domestic = build_list(DOMESTIC)
    imported = build_list(IMPORTED)
    generated_at = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    params = [
        {"name": "数据更新时间", "detail": generated_at},
        {"name": "外部数据源", "detail": SOURCE_NAME},
        {"name": "抓取策略", "detail": "按品牌/型号关键词抓取外部商品列表，提取真实报价与来源链接"},
        {"name": "说明", "detail": "若显示“未抓到外部价格”，表示当前外部源未返回可匹配型号"},
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

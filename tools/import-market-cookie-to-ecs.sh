#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <platform> \"cookie_header\""
  echo "platform: jd|taobao|tmall|xiaohongshu|alibaba"
  exit 1
fi

platform="$1"
cookie_header="$2"

REMOTE_HOST="${REMOTE_HOST:-root@47.90.160.87}"
REMOTE_KEY="${REMOTE_KEY:-$HOME/Downloads/open.pem}"

ssh -i "$REMOTE_KEY" "$REMOTE_HOST" "/usr/local/bin/import_market_cookie.sh '$platform' '$cookie_header' && node /opt/airivo-crawler/crawl_marketplaces_free.mjs && /usr/local/bin/sync_openclaw_respirators.sh && echo 'done'"

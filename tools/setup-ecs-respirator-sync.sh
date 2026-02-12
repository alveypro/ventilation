#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-root@47.90.160.87}"
REMOTE_KEY="${REMOTE_KEY:-$HOME/Downloads/open.pem}"

ssh -i "$REMOTE_KEY" "$REMOTE_HOST" 'bash -s' <<'REMOTE'
set -euo pipefail

install -d -m 755 /opt/airivo-ai-data/respirators

cat >/usr/local/bin/sync_openclaw_respirators.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

DEST="/opt/airivo-ai-data/respirators"
mkdir -p "$DEST"

CANDIDATES=(
  "/home/admin/.openclaw/workspace/data/respirators"
  "/home/admin/workspace/data/respirators"
  "/opt/openclaw/workspace/data/respirators"
  "/root/.openclaw/workspace/data/respirators"
)

FOUND=""
for dir in "${CANDIDATES[@]}"; do
  if [[ -f "$dir/domestic.json" && -f "$dir/imported.json" && -f "$dir/parameters.json" ]]; then
    FOUND="$dir"
    break
  fi
done

if [[ -z "$FOUND" ]]; then
  echo "No respirator data found in candidate paths." >&2
  exit 1
fi

cp -f "$FOUND/domestic.json" "$DEST/domestic.json"
cp -f "$FOUND/imported.json" "$DEST/imported.json"
cp -f "$FOUND/parameters.json" "$DEST/parameters.json"
for optional in source_report.json free_market_prices.json; do
  if [[ -f "$FOUND/$optional" ]]; then
    cp -f "$FOUND/$optional" "$DEST/$optional"
  fi
done
chmod 644 "$DEST/"*.json
echo "Synced from $FOUND to $DEST"
EOF

chmod +x /usr/local/bin/sync_openclaw_respirators.sh

if ! grep -q "sync_openclaw_respirators.sh" /etc/crontab; then
  echo "*/15 * * * * root /usr/local/bin/sync_openclaw_respirators.sh >> /var/log/respirator-sync.log 2>&1" >> /etc/crontab
fi

python3 - <<'PY'
from pathlib import Path
conf = Path('/etc/nginx/conf.d/ai.airivo.cn.conf')
txt = conf.read_text()
legacy = Path('/etc/nginx/conf.d/ai.airivo.cn.data.conf')
if legacy.exists():
    legacy.unlink()
txt = txt.replace('    include /etc/nginx/conf.d/ai.airivo.cn.data.conf;\n', '')
block = '''    location /data/respirators/ {
        alias /opt/airivo-ai-data/respirators/;
        add_header Access-Control-Allow-Origin "https://airivo.cn" always;
        add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
        add_header Access-Control-Allow-Headers "*" always;
        if ($request_method = OPTIONS) { return 204; }
        try_files $uri =404;
    }

'''
if 'location /data/respirators/' not in txt:
    marker = '    location / {'
    if marker in txt:
        txt = txt.replace(marker, block + marker, 1)
        conf.write_text(txt)
PY

nginx -t
systemctl reload nginx

/usr/local/bin/sync_openclaw_respirators.sh || true
ls -lah /opt/airivo-ai-data/respirators || true
REMOTE

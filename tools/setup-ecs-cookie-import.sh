#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-root@47.90.160.87}"
REMOTE_KEY="${REMOTE_KEY:-$HOME/Downloads/open.pem}"

ssh -i "$REMOTE_KEY" "$REMOTE_HOST" 'bash -s' <<'REMOTE'
set -euo pipefail

install -d -m 755 /opt/airivo-crawler
install -d -m 755 /opt/airivo-crawler/cookies

cat >/opt/airivo-crawler/import_cookie_header.mjs <<'EOF'
import fs from 'fs'

const platform = process.argv[2]
const cookieHeader = process.argv[3]
if (!platform || !cookieHeader) {
  console.error('Usage: node import_cookie_header.mjs <platform> "<cookie_header>"')
  process.exit(1)
}

const domains = {
  jd: ['.jd.com', '.3.cn'],
  taobao: ['.taobao.com'],
  tmall: ['.tmall.com', '.taobao.com'],
  xiaohongshu: ['.xiaohongshu.com'],
  alibaba: ['.alibaba.com'],
}

const targetDomains = domains[platform]
if (!targetDomains) {
  console.error(`Unsupported platform: ${platform}`)
  process.exit(1)
}

const parseCookieHeader = header => {
  return header
    .split(';')
    .map(x => x.trim())
    .filter(Boolean)
    .map(pair => {
      const idx = pair.indexOf('=')
      if (idx <= 0) return null
      const name = pair.slice(0, idx).trim()
      const value = pair.slice(idx + 1).trim()
      if (!name || !value) return null
      return { name, value }
    })
    .filter(Boolean)
}

const now = Math.floor(Date.now() / 1000)
const kvs = parseCookieHeader(cookieHeader)
if (!kvs.length) {
  console.error('No valid cookies parsed from input header.')
  process.exit(1)
}

const cookies = []
for (const kv of kvs) {
  for (const domain of targetDomains) {
    cookies.push({
      name: kv.name,
      value: kv.value,
      domain,
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'Lax',
      expires: now + 30 * 24 * 3600,
    })
  }
}

const out = `/opt/airivo-crawler/cookies/${platform}.json`
fs.writeFileSync(out, JSON.stringify(cookies, null, 2), 'utf-8')
console.log(`written ${out}, count=${cookies.length}`)
EOF

chmod +x /opt/airivo-crawler/import_cookie_header.mjs

cat >/usr/local/bin/import_market_cookie.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: import_market_cookie.sh <platform> \"cookie_header\""
  exit 1
fi

platform="$1"
cookie_header="$2"
node /opt/airivo-crawler/import_cookie_header.mjs "$platform" "$cookie_header"
echo "Cookie imported for $platform."
echo "Run crawler now: node /opt/airivo-crawler/crawl_marketplaces_free.mjs"
EOF

chmod +x /usr/local/bin/import_market_cookie.sh
ls -lah /opt/airivo-crawler/cookies
REMOTE

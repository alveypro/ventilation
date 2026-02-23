# Airivo AI Expert Server

Node.js + Express HTTPS backend for the Airivo AI Expert WeChat mini program.

## Requirements

- Node.js 18+
- HTTPS cert + key (self-signed is fine for local dev)

## Install

```bash
cd server
npm install
```

## Generate local HTTPS cert (macOS / Linux)

```bash
mkdir -p dev-certs
openssl req -x509 -newkey rsa:2048 -nodes -keyout dev-certs/localhost.key -out dev-certs/localhost.crt -days 365
```

## Run (dev)

```bash
SSL_KEY_PATH=dev-certs/localhost.key \
SSL_CERT_PATH=dev-certs/localhost.crt \
PORT=3443 \
npm run dev
```

## Enable Bailian (DashScope) model

Set environment variables and restart the server:

```bash
export LLM_PROVIDER=bailian
export DASHSCOPE_API_KEY=YOUR_API_KEY
export DASHSCOPE_MODEL=qwen-plus
# Base URL depends on your region. Default is China (Beijing):
# https://dashscope.aliyuncs.com/compatible-mode/v1
# Singapore (intl): https://dashscope-intl.aliyuncs.com/compatible-mode/v1
# US: https://dashscope-us.aliyuncs.com/compatible-mode/v1
export DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

## API

- POST `/api/chat`
- POST `/api/ai/chat` (OpenClaw bridge, for web frontend)
- GET `/api/history?openid=...&session_id=...`
- DELETE `/api/history?openid=...&session_id=...`
- POST `/api/upload` (optional; requires upload dependencies)

### Upload route behavior

- Default: `ENABLE_UPLOAD_ROUTE=1`, server will try to load upload route.
- If upload dependencies are missing, `/api/upload` returns `503` with a clear error message and other APIs keep working.
- Set `ENABLE_UPLOAD_ROUTE=0` to disable upload route explicitly.

The mini program expects the API base to be `https://api.airivo.cn` in production. For local dev, update the mini program request domain and use the local HTTPS URL (e.g. `https://localhost:3443`).

## Connect Web AI Assistant To OpenClaw

1. Configure `server/.env`:

```bash
OPENCLAW_CHAT_URL=https://your-openclaw-domain/v1/chat/completions
OPENCLAW_API_KEY=your_openclaw_key
OPENCLAW_AUTH_HEADER=Authorization
OPENCLAW_AUTH_SCHEME=Bearer
OPENCLAW_REQUEST_MODE=openai
OPENCLAW_MODEL=qwen-plus
OPENCLAW_TIMEOUT_MS=45000
OPENCLAW_RETRIES=1
```

2. Start server:

```bash
ALLOW_HTTP=true PORT=3443 npm run dev
```

3. Configure frontend env (`.env.local` in project root):

```bash
VITE_AI_API_BASE_URL=http://localhost:3443
VITE_AI_CHAT_PATH=/api/ai/chat
VITE_SHOW_AI_ASSISTANT=true
```

4. Restart frontend and test in browser.

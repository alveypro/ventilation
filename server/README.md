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
- GET `/api/history?openid=...&session_id=...`
- DELETE `/api/history?openid=...&session_id=...`

The mini program expects the API base to be `https://api.airivo.cn` in production. For local dev, update the mini program request domain and use the local HTTPS URL (e.g. `https://localhost:3443`).

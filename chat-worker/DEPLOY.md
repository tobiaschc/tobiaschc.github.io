# Chat Worker — Setup Guide

## What this does

A Cloudflare Worker that acts as a secure proxy between the CV site and the AI model.
- Credentials never reach the browser
- Rate limiting: max 10 requests per IP per hour
- CORS locked to your domain
- Runs on Cloudflare's free tier (~10k AI requests/day)

---

## Prerequisites

- A free Cloudflare account → [cloudflare.com](https://cloudflare.com)
- Node.js installed on your machine

---

## Step 1 — Configure your profile

```bash
cp chat-worker/config.example.js chat-worker/config.js
```

Edit `chat-worker/config.js`:
- Confirm `allowedOrigin` matches your live domain
- Adjust `systemPrompt` if anything changes

---

## Step 2 — Install Wrangler and log in

```bash
npm install -g wrangler
wrangler login   # opens browser to authenticate
```

---

## Step 3 — Create the KV namespace (rate limiting)

```bash
cd chat-worker
wrangler kv:namespace create RATE_LIMIT_KV
```

Copy the `id` from the output and paste it into `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "paste-your-id-here"
```

---

## Step 4 — Deploy

```bash
cd chat-worker
wrangler deploy
```

You'll get a URL like:
```
https://tobiaschc-cv-chat.yoursubdomain.workers.dev
```

---

## Step 5 — Add the Worker URL to the site config

In `chat-config.js` (repo root):
```js
const CHAT_WORKER_URL = "https://tobiaschc-cv-chat.yoursubdomain.workers.dev";
```

Commit and push — the chat is now live.

---

## Free tier limits

| Resource | Free limit |
|---|---|
| Worker requests | 100,000 / day |
| Workers AI | ~10,000 requests / day |
| KV reads | 100,000 / day |
| KV writes | 1,000 / day |

More than enough for a personal CV.

---

## Redeploy after changes

Any time you update `chat-worker/config.js`:
```bash
cd chat-worker && wrangler deploy
```

/**
 * chat-config.js
 * ─────────────────────────────────────────────────────────────
 * URL of the Cloudflare Worker that powers the AI chat widget.
 * Not secret — safe to commit. Leave empty to keep the widget hidden.
 * See chat-worker/DEPLOY.md to deploy the Worker.
 */
const CHAT_WORKER_URL = "https://tobiaschc-cv-chat.tobias-4a0.workers.dev";

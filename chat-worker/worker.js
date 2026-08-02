/**
 * Chat Proxy Worker
 * ─────────────────────────────────────────────────────────────
 * Cloudflare Worker that proxies requests to Workers AI.
 *
 * - Your API credentials never reach the browser
 * - Rate limiting: max 10 requests per IP per hour (via KV)
 * - CORS locked to your CV domain
 * - Input validation and length caps
 *
 * Setup:
 * 1. Copy chat-worker/config.example.js → chat-worker/config.js
 * 2. Fill in your domain and system prompt
 * 3. Deploy with: wrangler deploy
 *
 * Full guide: chat-worker/DEPLOY.md
 */

import { WORKER_CONFIG } from './config.js';

const MODEL        = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const MAX_TOKENS   = 512;
const MAX_MSG_LEN  = 500;
const MAX_HISTORY  = 10;
const RATE_LIMIT   = 10;
const RATE_WINDOW  = 60 * 60; // 1 hour

const ALLOWED_ORIGIN = WORKER_CONFIG.allowedOrigin;
const SYSTEM_PROMPT  = WORKER_CONFIG.systemPrompt;

async function checkRateLimit(ip, env) {
  if (!env.RATE_LIMIT_KV) return true;
  const key = `rl:${ip}`;
  const now = Math.floor(Date.now() / 1000);
  let record = { count: 0, windowStart: now };
  try {
    const stored = await env.RATE_LIMIT_KV.get(key, { type: 'json' });
    if (stored && now - stored.windowStart < RATE_WINDOW) record = stored;
  } catch (_) {}
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  await env.RATE_LIMIT_KV.put(key, JSON.stringify(record), { expirationTtl: RATE_WINDOW });
  return true;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!(await checkRateLimit(ip, env))) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      );
    }

    let body;
    try { body = await request.json(); }
    catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }); }

    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages array required' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
    }

    const sanitized = messages
      .filter(m => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
      .slice(-MAX_HISTORY)
      .map(m => ({ role: m.role, content: m.content.slice(0, MAX_MSG_LEN) }));

    try {
      const aiResponse = await env.AI.run(MODEL, {
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...sanitized],
        max_tokens: MAX_TOKENS,
        stream: false
      });
      return new Response(
        JSON.stringify({ reply: aiResponse?.response?.trim() || '…' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      );
    } catch (err) {
      console.error('Workers AI error:', err);
      return new Response(
        JSON.stringify({ error: 'AI service error. Please try again.' }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      );
    }
  }
};

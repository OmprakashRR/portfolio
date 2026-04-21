# Digital Twin — How it works

Quick reference for how the AI chatbot on the website is wired up.

## The big picture

When someone types a question into the chat widget on the website, this happens:

```
Visitor's browser  →  Cloudflare Worker  →  OpenRouter  →  GPT-4o-mini  →  answer back
   (website)         (our proxy)        (LLM gateway)     (actual AI)
```

Each arrow is an HTTP request.

## What each piece does

### 1. The website (GitHub Pages)
- Lives at **https://omprakashrr.github.io/portfolio/**
- The chat widget UI (the blue "Ask me anything" button) is in:
  - [index.html](index.html) — HTML for the chat bubble
  - [css/style.css](css/style.css) — styling (search for `.ai-chat`)
  - [js/main.js](js/main.js) — chat logic (search for `AI CHAT`)
- When a visitor sends a message, JS posts it to the Cloudflare Worker URL.

### 2. Cloudflare Worker (the "receptionist")
- URL: **https://digital-twin.omprakashrr.workers.dev/**
- Dashboard: https://dash.cloudflare.com/ → Workers & Pages → `digital-twin`
- Code lives in: [cloudflare-worker.js](cloudflare-worker.js)
- **Why it exists:** to hide the OpenRouter API key. If the key were in the website's JS, anyone could steal it and burn through your credits.
- **What it does:**
  1. Receives the visitor's message
  2. Adds the system prompt (all the facts about Omprakash from the CV)
  3. Calls OpenRouter with the API key (stored as a secret in Cloudflare, never in code)
  4. Returns the AI's answer back to the website
- **Free tier:** 100,000 requests/day (plenty).

### 3. OpenRouter (the "gateway")
- Dashboard: https://openrouter.ai/
- **What it is:** a single API that lets you use any LLM (OpenAI, Anthropic, Google, Meta, etc.) through one account and one key.
- **Why we use it:** flexible — if GPT-4o-mini stops working, we can switch to Claude, Gemini, etc. by changing one line.
- **Billing:** prepaid credits. $5 at signup, charges ~$0.00003 per question for GPT-4o-mini.
- **The model we're using:** `openai/gpt-4o-mini` (cheapest reliable option). Fallbacks defined in `cloudflare-worker.js` if the primary is down.

### 4. The system prompt
- Located inside [cloudflare-worker.js](cloudflare-worker.js) as `SYSTEM_PROMPT`
- Contains all the verified facts from the CV (supervisor names, awards, projects, publications, etc.)
- Has strict rules telling the AI to **never invent** facts and to say "I don't know" instead of guessing.
- This is how the AI "becomes" Omprakash.

## How to update things

### To add/fix facts the AI knows
1. Edit `SYSTEM_PROMPT` in [cloudflare-worker.js](cloudflare-worker.js) (local file)
2. Commit and push to GitHub (keeps local copy in sync)
3. Copy the file content → Cloudflare dashboard → Worker → "Edit code" → paste → **Deploy**

### To change the AI model
1. Edit the `MODELS` array in [cloudflare-worker.js](cloudflare-worker.js)
2. Redeploy in Cloudflare (same steps as above)
3. Models list: https://openrouter.ai/models — copy the ID (e.g. `anthropic/claude-3-5-sonnet`)

### To rotate (change) the API key
1. Go to https://openrouter.ai/settings/keys → delete old key → create new one
2. Copy the new key
3. Cloudflare → Worker → Settings → Variables and Secrets → edit `OPENROUTER_API_KEY` → paste new key → Deploy

### To update the chat widget look/behaviour
- Edit the website files ([index.html](index.html), [css/style.css](css/style.css), [js/main.js](js/main.js))
- Commit + push — GitHub Actions auto-deploys to GitHub Pages in ~1 min.

## Costs

- **GitHub Pages:** free
- **Cloudflare Workers:** free (100k req/day)
- **OpenRouter:** pay-as-you-go. GPT-4o-mini ≈ $0.00003/question → $5 = ~150,000 questions.

## Troubleshooting

- **Chat says "Sorry, I couldn't connect"** → Cloudflare Worker is down, or CORS issue. Check Worker logs in Cloudflare dashboard → `digital-twin` → "Logs".
- **AI gives weird/wrong facts** → system prompt needs a fix. Edit `cloudflare-worker.js` with the correct fact and redeploy.
- **AI stops responding entirely** → OpenRouter credits may be depleted (check https://openrouter.ai/credits), or the model was deprecated (check the fallback models, or pick a new one).

## Files in this repo related to the digital twin

| File | Purpose |
|------|---------|
| [cloudflare-worker.js](cloudflare-worker.js) | Worker code + system prompt. Source of truth. Copy this into Cloudflare when updating. |
| [index.html](index.html) | Chat widget HTML (the `ai-chat` div near the bottom) |
| [css/style.css](css/style.css) | Chat widget styling (`.ai-chat*` classes) |
| [js/main.js](js/main.js) | Chat widget logic (the `AI CHAT` section) |

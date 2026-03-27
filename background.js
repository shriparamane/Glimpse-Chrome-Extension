// background.js — service worker
const GROQ_API_KEY = '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';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const KP_COUNT = { brief: '2-3', standard: '4-5', detailed: '6-8' };

async function fetchGroq(content, title, level) {
  const prompt = `You are a web page summarizer. Summarize the following page content at a "${level}" detail level.

Return ONLY valid JSON — no markdown, no code fences — in exactly this shape:
{
  "title": "concise page title (max 80 chars)",
  "overview": "2-3 sentence overview of the main content",
  "keyPoints": ["point 1", "point 2", ...],
  "takeaway": "single sentence key takeaway"
}

Key points count: ${KP_COUNT[level] || KP_COUNT.standard}

Page title: ${title}

Page content:
${content}`;

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error ${res.status}`);
  }

  const data = await res.json();
  const raw  = data?.choices?.[0]?.message?.content || '';
  const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(json);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action !== 'claude:summarize') return;

  (async () => {
    try {
      const summary = await fetchGroq(message.content, message.title, message.level);
      sendResponse({ summary });
    } catch (err) {
      sendResponse({ error: err.message || 'Unexpected error.' });
    }
  })();

  return true;
});

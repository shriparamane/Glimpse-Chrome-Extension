// popup.js

const btnSummarize = document.getElementById('btn-summarize');
const pills        = document.querySelectorAll('.pill');
const apiKeyInput  = document.getElementById('api-key-input');
let selectedLevel  = 'standard';

// ── Load saved API key ────────────────────────────────────────────────────────
chrome.storage.local.get('groqApiKey', ({ groqApiKey }) => {
  if (groqApiKey) {
    apiKeyInput.value = groqApiKey;
    apiKeyInput.classList.add('saved');
  }
});

// ── Save API key on change ────────────────────────────────────────────────────
apiKeyInput.addEventListener('input', () => {
  apiKeyInput.classList.remove('saved');
});

apiKeyInput.addEventListener('change', () => {
  const key = apiKeyInput.value.trim();
  chrome.storage.local.set({ groqApiKey: key }, () => {
    if (key) apiKeyInput.classList.add('saved');
  });
});

// ── Detail level ─────────────────────────────────────────────────────────────
pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    selectedLevel = pill.dataset.level;
  });
});

// ── Summarize ────────────────────────────────────────────────────────────────
btnSummarize.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  try {
    await chrome.tabs.sendMessage(tab.id, {
      action: 'glimpse:summarize',
      level:  selectedLevel,
    });
  } catch {
    // Restricted page (chrome://, extensions page, etc.)
    alert('Glimpse cannot run on this page. Try a regular website.');
  }
});

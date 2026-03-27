// popup.js

const btnSummarize = document.getElementById('btn-summarize');
const pills        = document.querySelectorAll('.pill');
let selectedLevel  = 'standard';

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

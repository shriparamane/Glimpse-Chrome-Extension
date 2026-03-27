// content.js — injected at document_idle
// All summarization happens here, in the browser, with no network calls.

// ─────────────────────────────────────────────────────────────────────────────
// 1.  TEXT EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────
// Selectors for pure noise — stripped before any text is read
const NOISE_SEL = [
  'script','style','noscript','iframe','form','button','input','select','textarea',
  'nav','header','footer','aside',
  // Ads
  '.adsbygoogle','[data-ad]','[data-ads]','[data-adunit]','[data-google-query-id]',
  '[id^="div-gpt-ad"]','[class*="advert"]','[id*="advert"]',
  '[class*="ad-slot"]','[class*="ad-unit"]','[class*="ad-banner"]','[class*="ad-container"]',
  '[class*="ad-wrapper"]','[class*="sponsored"]','[id*="sponsored"]',
  // Social / share
  '[class*="social-share"]','[class*="share-button"]','[class*="sharing"]',
  '[class*="follow-us"]','[class*="social-widget"]',
  // Newsletter / subscribe
  '[class*="newsletter"]','[class*="subscribe"]','[class*="signup"]',
  // Cookie / GDPR
  '[class*="cookie"]','[class*="gdpr"]','[class*="consent-banner"]',
  // Popups / overlays
  '[class*="popup"]','[class*="lightbox"]','[class*="interstitial"]',
  // Comments
  '#disqus_thread','[id*="comment"]','[class*="comment-section"]','[class*="comments-area"]',
  // Related / recommended
  '[class*="related-post"]','[class*="recommended"]','[class*="you-may-like"]',
  // Sidebar / widgets
  '[class*="sidebar"]','[id*="sidebar"]','[class*="widget-area"]',
  // Breadcrumbs / pagination / tags
  '[class*="breadcrumb"]','[class*="pagination"]','[class*="tag-list"]','[class*="post-tags"]',
  // Author bio boxes
  '[class*="author-box"]','[class*="author-bio"]',
].join(',');

function extractPageContent() {
  // Content root candidates
  const ROOT_SELS = [
    'article','main','[role="main"]',
    '.mw-parser-output','#bodyContent',
    '#content','#main-content','#article-body',
    '.post-content','.entry-content','.article-content',
    '.story-body','.content-body','.readable',
  ];

  let root = null;
  for (const sel of ROOT_SELS) {
    const el = document.querySelector(sel);
    if (el && (el.textContent || '').trim().length > 400) { root = el; break; }
  }
  if (!root) root = document.body;

  // Clone and strip all noise from the clone
  const clone = root.cloneNode(true);
  try { clone.querySelectorAll(NOISE_SEL).forEach(n => n.remove()); } catch(_) {}

  // Collect text paragraph by paragraph from clean clone
  const chunks = [];
  const COLLECT = new Set(['P','H1','H2','H3','H4','LI','BLOCKQUOTE','TD','DT','DD']);

  function walk(el) {
    if (!el || el.nodeType !== 1) return;
    const tag = el.tagName.toUpperCase();
    if (['SCRIPT','STYLE','NOSCRIPT','IFRAME'].includes(tag)) return;
    if (COLLECT.has(tag)) {
      const t = (el.textContent || '').replace(/\s+/g,' ').trim();
      if (t.length > 25) chunks.push(t);
      return;
    }
    for (const child of el.children) walk(child);
  }
  walk(clone);

  const text = chunks.join(' ').replace(/\s+/g,' ').trim();
  return text.slice(0, 14000);
}

// Also grab all heading texts for bonus scoring
function extractHeadings() {
  return Array.from(document.querySelectorAll('h1,h2,h3'))
    .map(h => h.textContent.trim())
    .filter(Boolean)
    .join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// 2.  EXTRACTIVE SUMMARISER
// ─────────────────────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'by','from','as','is','was','are','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'this','that','these','those','it','its','they','their','there','here',
  'then','than','when','where','why','how','what','which','who','whom','so',
  'if','not','no','can','just','also','more','very','all','any','some',
  'one','two','three','into','about','over','after','before','between',
  'up','out','our','your','my','we','he','she','his','her','i','you','me',
]);

// Sentence tokeniser — handles common abbreviations to avoid false splits
function tokenizeSentences(text) {
  // Mark known abbreviation periods so they don't trigger splits
  const abbrevs = /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|eg|ie|Fig|No|Vol|pp|ed|al|approx|dept|est|avg|approx|Gov|Sgt|Cpl|Corp|Inc|Ltd|Co|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\./gi;
  const safe = text.replace(abbrevs, (m) => m.replace('.', '⟨DOT⟩'));

  // Split on sentence-ending punctuation followed by whitespace + capital
  const raw = safe.split(/(?<=[.!?]["']?)\s+(?=[A-Z"'])/);

  return raw
    .map(s => s.replace(/⟨DOT⟩/g, '.').trim())
    .filter(s => {
      const words = s.split(/\s+/);
      return words.length >= 6 && s.length >= 30;
    });
}

function computeWordScores(sentences) {
  const freq = {};
  sentences.forEach(s => {
    s.toLowerCase().match(/\b[a-z]{3,}\b/g)?.forEach(w => {
      if (!STOPWORDS.has(w)) freq[w] = (freq[w] || 0) + 1;
    });
  });
  const max = Math.max(...Object.values(freq), 1);
  const scores = {};
  Object.entries(freq).forEach(([w, f]) => { scores[w] = f / max; });
  return scores;
}

function scoreSentences(sentences, wordScores, title, headings) {
  const titleWords = new Set((title + ' ' + headings).toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  const total      = sentences.length;

  // Detect named entities: words that appear capitalised mid-sentence (not just at start)
  const entityFreq = {};
  sentences.forEach(s => {
    (s.match(/(?<!\. )[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})*/g) || []).forEach(e => {
      entityFreq[e] = (entityFreq[e] || 0) + 1;
    });
  });
  const entityWords = new Set(
    Object.entries(entityFreq).filter(([,f]) => f >= 2).map(([e]) => e.toLowerCase())
  );

  return sentences.map((text, i) => {
    const words  = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const unique = new Set(words.filter(w => !STOPWORDS.has(w)));

    // TF score
    let tfScore = 0;
    unique.forEach(w => { tfScore += (wordScores[w] || 0); });
    tfScore = unique.size > 0 ? tfScore / unique.size : 0;

    // Position bonus — opening and closing sentences carry more weight
    const r = i / total;
    const posScore = r < 0.12 ? 1.7 : r < 0.25 ? 1.25 : r > 0.90 ? 0.85 : 1.0;

    // Length — sweet spot 12-50 words
    const wc = words.length;
    const lenScore = wc < 6 ? 0.2 : wc < 12 ? 0.7 : wc > 70 ? 0.45 : wc > 55 ? 0.7 : 1.0;

    // Title / heading overlap
    const titleHits  = [...unique].filter(w => titleWords.has(w)).length;
    const titleScore = 1 + Math.min(titleHits * 0.3, 1.2);

    // Named-entity richness
    const entityHits  = [...unique].filter(w => entityWords.has(w)).length;
    const entityScore = 1 + Math.min(entityHits * 0.2, 0.8);

    // Stat / data bonus
    const numBonus = /\b\d[\d,.%$£€]*\b/.test(text) ? 1.2 : 1.0;

    // Definitional bonus
    const defBonus = /\b(is|are|was|were|refers to|defined as|known as|means|involves|consists of|describes)\b/i.test(text) ? 1.15 : 1.0;

    // Causal / insight bonus
    const insightBonus = /\b(because|therefore|however|although|despite|result|cause|lead|impact|effect|significant|critical|important|key|major|primary)\b/i.test(text) ? 1.1 : 1.0;

    return {
      text,
      index: i,
      score: tfScore * posScore * lenScore * titleScore * entityScore * numBonus * defBonus * insightBonus,
    };
  });
}

function buildSummary(content, title, headings, level) {
  const sentences = tokenizeSentences(content);

  if (sentences.length < 3) {
    // Not enough material — return raw excerpt
    return {
      title:     truncate(title || document.title, 80),
      overview:  content.slice(0, 400),
      keyPoints: [],
      takeaway:  '',
    };
  }

  const wordScores = computeWordScores(sentences);
  const scored     = scoreSentences(sentences, wordScores, title, headings);

  // How many sentences to pull for each section
  const cfg = {
    brief:    { ov: 2, kp: 3, ta: 1 },
    standard: { ov: 2, kp: 5, ta: 1 },
    detailed: { ov: 3, kp: 8, ta: 1 },
  };
  const { ov, kp, ta } = cfg[level] || cfg.standard;
  const needed = ov + kp + ta;

  // Deduplicate very similar sentences (cosine-ish overlap > 0.6)
  const top = [];
  const used = new Set();
  for (const s of [...scored].sort((a, b) => b.score - a.score)) {
    if (top.length >= needed) break;
    const words = new Set(s.text.toLowerCase().match(/\b[a-z]{4,}\b/g) || []);
    let tooSimilar = false;
    for (const prev of top) {
      const prevWords = new Set(prev.text.toLowerCase().match(/\b[a-z]{4,}\b/g) || []);
      const inter = [...words].filter(w => prevWords.has(w)).length;
      const union = new Set([...words, ...prevWords]).size;
      if (union > 0 && inter / union > 0.55) { tooSimilar = true; break; }
    }
    if (!tooSimilar) top.push(s);
  }

  // Re-order by original position
  top.sort((a, b) => a.index - b.index);

  const overviewSents = top.slice(0, ov);
  const kpSents       = top.slice(ov, ov + kp);
  const taSent        = top[top.length - 1];

  return {
    title:     truncate(title || document.title, 80),
    overview:  overviewSents.map(s => s.text).join(' '),
    keyPoints: kpSents.map(s => s.text),
    takeaway:  taSent?.text || '',
  };
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3.  MODAL  (Shadow DOM — fully isolated from the page's own CSS)
// ─────────────────────────────────────────────────────────────────────────────
const MODAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :host { all: initial; }

  .overlay {
    position: fixed; inset: 0;
    background: rgba(5, 7, 18, 0.72);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 2147483647;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    animation: g-fade 0.25s ease both;
  }
  @keyframes g-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .modal {
    width: min(700px, 100%);
    max-height: 88vh;
    background: #0d1020;
    border: 1px solid #1e2340;
    border-radius: 16px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,92,252,0.12),
                inset 0 1px 0 rgba(255,255,255,0.04);
    display: flex; flex-direction: column; overflow: hidden;
    animation: g-up 0.3s cubic-bezier(0.34, 1.3, 0.64, 1) both;
  }
  @keyframes g-up {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: none; }
  }

  /* ── Header ── */
  .modal-header {
    display: flex; align-items: center; gap: 10px;
    padding: 13px 18px 12px;
    border-bottom: 1px solid #1e2340;
    background: linear-gradient(180deg, rgba(124,92,252,0.07) 0%, transparent 100%);
    flex-shrink: 0;
  }
  .brand-icon {
    width: 26px; height: 26px;
    background: linear-gradient(135deg, #6342e8, #9d5cfc);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 10px rgba(124,92,252,0.45);
    flex-shrink: 0;
  }
  .brand-name {
    font-size: 12px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; color: #e4e8f5;
  }
  .modal-source {
    flex: 1; font-size: 11px; color: #505878;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-family: 'Consolas', 'Courier New', monospace;
  }
  .modal-close {
    width: 28px; height: 28px;
    background: transparent; border: 1px solid #1e2340; border-radius: 7px;
    color: #505878; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; line-height: 1; flex-shrink: 0; transition: all 0.15s;
    font-family: inherit;
  }
  .modal-close:hover { background: rgba(255,95,109,0.1); border-color: rgba(255,95,109,0.4); color: #ff5f6d; }

  /* ── Body ── */
  .modal-body {
    flex: 1; overflow-y: auto; padding: 24px;
    scrollbar-width: thin; scrollbar-color: #1e2340 transparent;
    min-height: 100px;
  }
  .modal-body::-webkit-scrollbar { width: 5px; }
  .modal-body::-webkit-scrollbar-thumb { background: #1e2340; border-radius: 4px; }

  /* ── Loading ── */
  .loading-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 30px 0 20px; gap: 14px; text-align: center;
  }
  .spinner {
    width: 36px; height: 36px;
    border: 3px solid rgba(124,92,252,0.18);
    border-top-color: #7c5cfc; border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-label { font-size: 13px; color: #505878; }
  .skeletons { width: 100%; display: flex; flex-direction: column; gap: 8px; margin-top: 6px; }
  .sk {
    height: 11px; border-radius: 6px;
    background: linear-gradient(90deg, #1a1e35 25%, #252b48 50%, #1a1e35 75%);
    background-size: 200% 100%; animation: shimmer 1.6s infinite;
  }
  .sk.w100{width:100%} .sk.w85{width:85%} .sk.w70{width:70%} .sk.w55{width:55%} .sk.w40{width:40%}
  @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

  /* ── Error ── */
  .error-state {
    display: flex; flex-direction: column; align-items: center;
    gap: 10px; padding: 28px 20px; text-align: center;
  }
  .error-icon {
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(255,95,109,0.1); border: 1px solid rgba(255,95,109,0.25);
    color: #ff5f6d; font-size: 20px; display: flex; align-items: center; justify-content: center;
  }
  .error-title { font-size: 14px; font-weight: 600; color: #ff5f6d; }
  .error-detail { font-size: 12px; color: #505878; max-width: 380px; line-height: 1.6; }

  /* ── Summary ── */
  .summary { display: flex; flex-direction: column; gap: 20px; }

  .summary-title {
    font-size: 20px; font-weight: 700; color: #e4e8f5;
    line-height: 1.3; letter-spacing: -0.01em;
    padding-bottom: 16px; border-bottom: 1px solid #1a1e35;
  }

  .summary-section { display: flex; flex-direction: column; gap: 9px; }

  .section-heading {
    font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase;
    font-family: 'Consolas', 'Courier New', monospace;
    display: flex; align-items: center; gap: 7px;
  }
  .section-heading::after { content: ''; flex: 1; height: 1px; }

  .heading-overview { color: #5b9cf6; }
  .heading-overview::after { background: rgba(91,156,246,0.2); }
  .overview-text {
    font-size: 13.5px; line-height: 1.78; color: #b4bcda;
    padding: 12px 14px;
    background: rgba(91,156,246,0.05);
    border: 1px solid rgba(91,156,246,0.12);
    border-radius: 10px; border-left: 3px solid rgba(91,156,246,0.5);
  }

  .heading-points { color: #a07cfd; }
  .heading-points::after { background: rgba(160,124,253,0.2); }
  .points-list {
    display: flex; flex-direction: column; gap: 7px;
    padding: 10px 12px;
    background: rgba(160,124,253,0.04);
    border: 1px solid rgba(160,124,253,0.1); border-radius: 10px;
  }
  .point-item {
    display: flex; align-items: flex-start; gap: 9px;
    font-size: 13px; line-height: 1.65; color: #c0c8e4;
  }
  .point-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #a07cfd;
    flex-shrink: 0; margin-top: 7px; box-shadow: 0 0 6px rgba(160,124,253,0.5);
  }

  .heading-takeaway { color: #3ddc84; }
  .heading-takeaway::after { background: rgba(61,220,132,0.2); }
  .takeaway-text {
    font-size: 13px; line-height: 1.72; color: #7eedb0; font-style: italic;
    padding: 10px 14px;
    background: rgba(61,220,132,0.06);
    border: 1px solid rgba(61,220,132,0.15);
    border-radius: 10px; border-left: 3px solid rgba(61,220,132,0.5);
  }

  /* ── Footer ── */
  .modal-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 18px; border-top: 1px solid #1e2340; flex-shrink: 0; gap: 8px;
  }
  .footer-left { display: flex; gap: 6px; align-items: center; }

  .btn-copy, .btn-speak {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 13px; background: #12152a;
    border: 1px solid #1e2340; border-radius: 8px;
    color: #7c8ab0; font-size: 11.5px; font-weight: 500;
    cursor: pointer; transition: all 0.15s; font-family: inherit;
  }
  .btn-copy:hover  { border-color: #7c5cfc; color: #a07cfd; background: rgba(124,92,252,0.08); }
  .btn-copy.copied { color: #3ddc84; border-color: rgba(61,220,132,0.4); background: rgba(61,220,132,0.07); }

  .btn-speak:hover   { border-color: #3ddc84; color: #3ddc84; background: rgba(61,220,132,0.07); }
  .btn-speak.speaking {
    color: #3ddc84; border-color: rgba(61,220,132,0.45);
    background: rgba(61,220,132,0.08);
  }
  .btn-speak.paused { color: #f0a05a; border-color: rgba(240,160,90,0.4); background: rgba(240,160,90,0.07); }

  .wave-bars { display: flex; align-items: center; gap: 2px; height: 12px; }
  .wave-bars span {
    display: block; width: 3px; border-radius: 2px; background: currentColor;
    animation: wv 0.9s ease-in-out infinite;
  }
  .wave-bars span:nth-child(1){height:5px;  animation-delay:0s}
  .wave-bars span:nth-child(2){height:10px; animation-delay:0.15s}
  .wave-bars span:nth-child(3){height:7px;  animation-delay:0.3s}
  .wave-bars span:nth-child(4){height:12px; animation-delay:0.1s}
  .wave-bars span:nth-child(5){height:6px;  animation-delay:0.25s}
  @keyframes wv { 0%,100%{transform:scaleY(.4);opacity:.5} 50%{transform:scaleY(1);opacity:1} }

  .powered-by {
    font-size: 10px; color: #2e3554;
    font-family: 'Consolas','Courier New', monospace;
  }
  .powered-by span { color: #505878; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// 4.  MODAL RENDERER
// ─────────────────────────────────────────────────────────────────────────────
let shadowHost = null;
let shadowRoot = null;

function getHost() {
  if (shadowHost && document.documentElement.contains(shadowHost)) return shadowHost;
  shadowHost = document.createElement('div');
  shadowHost.id = 'glimpse-host';
  shadowHost.style.cssText = 'all:unset;position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;';
  document.documentElement.appendChild(shadowHost);
  shadowRoot = shadowHost.attachShadow({ mode: 'open' });
  return shadowHost;
}

const ICON_SPEAKER = `<svg class="speak-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
const ICON_PAUSE   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
const ICON_RESUME  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const WAVE         = `<span class="wave-bars"><span></span><span></span><span></span><span></span><span></span></span>`;

function renderModal(state, data = {}) {
  getHost();

  const source = `${location.hostname || 'page'} · ${document.title.slice(0, 60)}${document.title.length > 60 ? '…' : ''}`;
  let bodyHTML  = '';

  if (state === 'loading') {
    bodyHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <div class="loading-label">Analysing page content…</div>
        <div class="skeletons">
          <div class="sk w100"></div><div class="sk w85"></div>
          <div class="sk w70"></div><div class="sk w100"></div>
          <div class="sk w55"></div><div class="sk w40"></div>
        </div>
      </div>`;

  } else if (state === 'error') {
    bodyHTML = `
      <div class="error-state">
        <div class="error-icon">!</div>
        <div class="error-title">Couldn't summarise this page</div>
        <div class="error-detail">${esc(data.error || 'Unknown error.')}</div>
      </div>`;

  } else if (state === 'summary') {
    const s      = data.summary;
    const points = (s.keyPoints || [])
      .map(p => `<div class="point-item"><div class="point-dot"></div><span>${esc(p)}</span></div>`)
      .join('');
    const takeaway = s.takeaway
      ? `<div class="summary-section">
           <div class="section-heading heading-takeaway">Takeaway</div>
           <div class="takeaway-text">${esc(s.takeaway)}</div>
         </div>` : '';

    bodyHTML = `
      <div class="summary">
        <div class="summary-title">${esc(s.title || document.title)}</div>
        <div class="summary-section">
          <div class="section-heading heading-overview">Overview</div>
          <div class="overview-text">${esc(s.overview)}</div>
        </div>
        ${points ? `<div class="summary-section">
          <div class="section-heading heading-points">Key Points</div>
          <div class="points-list">${points}</div>
        </div>` : ''}
        ${takeaway}
      </div>`;
  }

  const footerHTML = state === 'loading' ? '' : `
    <div class="modal-footer">
      <div class="footer-left">
        <button class="btn-copy" id="g-copy">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>Copy
        </button>
        ${state === 'summary' ? `<button class="btn-speak" id="g-speak">${ICON_SPEAKER} Read Aloud</button>` : ''}
      </div>
      <div class="powered-by">Runs <span>100% in browser</span></div>
    </div>`;

  shadowRoot.innerHTML = `
    <style>${MODAL_CSS}</style>
    <div class="overlay" id="g-overlay">
      <div class="modal">
        <div class="modal-header">
          <div class="brand-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div class="brand-name">Glimpse</div>
          <div class="modal-source">${esc(source)}</div>
          <button class="modal-close" id="g-close">✕</button>
        </div>
        <div class="modal-body">${bodyHTML}</div>
        ${footerHTML}
      </div>
    </div>`;

  // ── Close
  const closeBtn = shadowRoot.getElementById('g-close');
  const overlay  = shadowRoot.getElementById('g-overlay');
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', onEsc);

  // ── Copy
  shadowRoot.getElementById('g-copy')?.addEventListener('click', () => {
    const txt = state === 'summary' ? buildPlainText(data.summary) : '';
    if (!txt) return;
    navigator.clipboard.writeText(txt).then(() => {
      const btn = shadowRoot.getElementById('g-copy');
      if (!btn) return;
      btn.classList.add('copied');
      btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      setTimeout(() => {
        if (!btn) return;
        btn.classList.remove('copied');
        btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy`;
      }, 2000);
    });
  });

  // ── Read Aloud
  if (state === 'summary') {
    const btnSpeak = shadowRoot.getElementById('g-speak');
    if (btnSpeak) {
      let active = false, paused = false, utterance = null;

      function setSpeak(st) {
        const b = shadowRoot.getElementById('g-speak');
        if (!b) return;
        b.className = st !== 'idle' ? `btn-speak ${st}` : 'btn-speak';
        b.innerHTML = st === 'speaking' ? `${WAVE} Pause`
                    : st === 'paused'   ? `${ICON_RESUME} Resume`
                    :                     `${ICON_SPEAKER} Read Aloud`;
      }

      function pickVoice() {
        const vs = window.speechSynthesis.getVoices();
        return vs.find(v => v.name === 'Google US English')
            || vs.find(v => v.name.includes('Microsoft Aria'))
            || vs.find(v => v.name.includes('Samantha'))
            || vs.find(v => v.lang === 'en-US' && !v.localService)
            || vs.find(v => v.lang.startsWith('en-US'))
            || vs.find(v => v.lang.startsWith('en'))
            || null;
      }

      btnSpeak.addEventListener('click', () => {
        if (!active) {
          utterance = new SpeechSynthesisUtterance(buildReadingScript(data.summary));
          utterance.rate = 0.93; utterance.pitch = 1.0; utterance.volume = 1.0;
          const tryVoice = () => { const v = pickVoice(); if (v) utterance.voice = v; };
          if (window.speechSynthesis.getVoices().length) tryVoice();
          else window.speechSynthesis.onvoiceschanged = tryVoice;
          utterance.onstart  = () => { active = true;  paused = false; setSpeak('speaking'); };
          utterance.onpause  = () => { paused = true;  setSpeak('paused'); };
          utterance.onresume = () => { paused = false; setSpeak('speaking'); };
          utterance.onend = utterance.onerror = () => { active = false; paused = false; setSpeak('idle'); };
          window.speechSynthesis.speak(utterance);
        } else if (paused) {
          window.speechSynthesis.resume();
        } else {
          window.speechSynthesis.pause();
        }
      });
    }
  }
}

function onEsc(e) { if (e.key === 'Escape') closeModal(); }

function closeModal() {
  document.removeEventListener('keydown', onEsc);
  window.speechSynthesis.cancel();
  const overlay = shadowRoot?.getElementById('g-overlay');
  if (overlay) {
    overlay.style.animation = 'g-fade 0.2s ease reverse both';
    setTimeout(() => { if (shadowRoot) shadowRoot.innerHTML = ''; }, 200);
  }
}

function buildReadingScript(s) {
  if (!s) return '';
  return [
    `${s.title}.`,
    s.overview ? `Overview. ${s.overview}` : '',
    s.keyPoints?.length ? `Key points. ${s.keyPoints.join('. ')}.` : '',
    s.takeaway ? `Takeaway. ${s.takeaway}` : '',
  ].filter(Boolean).join(' ');
}

function buildPlainText(s) {
  if (!s) return '';
  let out = `${s.title}\n\nOverview\n${s.overview}\n\nKey Points\n`;
  out += (s.keyPoints || []).map(p => `• ${p}`).join('\n');
  if (s.takeaway) out += `\n\nTakeaway\n${s.takeaway}`;
  return out.trim();
}

function esc(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5.  MESSAGE LISTENER
// ─────────────────────────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action !== 'glimpse:summarize') return;

  // Show loading state immediately
  renderModal('loading');

  // Small delay so the loading animation is visible before CPU work
  setTimeout(() => {
    try {
      const content = extractPageContent();
      if (!content || content.length < 150) {
        renderModal('error', { error: 'Not enough readable text on this page to summarise.' });
        return;
      }

      const headings = extractHeadings();
      const summary  = buildSummary(content, document.title, headings, message.level || 'standard');
      renderModal('summary', { summary });
    } catch (err) {
      renderModal('error', { error: err.message || 'Unexpected error during summarisation.' });
    }
  }, 120);

  sendResponse({ ok: true });
  return true;
});

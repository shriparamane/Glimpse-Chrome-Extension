## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the project folder

## Files

```
manifest.json    — Extension manifest (MV3)
background.js    — Service worker (placeholder)
content.js       — Page summarization logic (injected at document_idle)
popup.html/js    — Glimpse popup UI
themes.js        — All 12 theme CSS definitions
```

## Permissions

- `activeTab` — interact with the current tab
- `scripting` — inject content scripts
- `storage` — persist theme/settings preferences
- `<all_urls>` — apply themes and summaries to any website

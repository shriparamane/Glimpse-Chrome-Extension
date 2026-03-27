# Glimpse

Instant AI-powered page summaries in your browser, powered by Groq.

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the project folder
5. Open the extension popup and paste your [Groq API key](https://console.groq.com/keys)

## Usage

1. Navigate to any webpage
2. Click the Glimpse icon in your toolbar
3. Choose a detail level — Brief, Standard, or Detailed
4. Click **Summarize This Page**

The summary appears as an overlay with an Overview, Key Points, and Takeaway. You can copy the result or have it read aloud.

## Files

```
manifest.json    — Extension manifest (MV3)
background.js    — Service worker; handles Groq API calls
content.js       — Page text extraction and modal UI (injected at document_idle)
popup.html/js    — Glimpse popup UI and API key management
```

## Permissions

- `activeTab` — interact with the current tab
- `scripting` — inject content scripts
- `storage` — persist the API key locally
- `<all_urls>` — summarize any website

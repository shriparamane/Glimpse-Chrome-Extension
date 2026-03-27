// themes.js — single source of truth for all Chameleon themes

const THEMES = {

  cyberpunk: {
    label: 'Cyberpunk',
    desc: 'Matrix green · CRT scanlines · neon glow',
    tag: 'FUTURISTIC',
    palette: ['#050505', '#00ff41', '#ff00ff', '#00ffff'],
    preview: { bg: '#050505', surface: '#0a1a0a', text: '#00ff41', accent: '#ff00ff', heading: '#ff00ff' },
    css: `
      *, *::before { background-color: #050505 !important; color: #00ff41 !important; font-family: 'Courier New', Courier, monospace !important; border-color: #00ff41 !important; text-shadow: 0 0 6px rgba(0,255,65,0.4) !important; }
      a, a * { color: #ff00ff !important; text-shadow: 0 0 8px rgba(255,0,255,0.5) !important; }
      a:hover, a:hover * { color: #00ffff !important; text-shadow: 0 0 12px rgba(0,255,255,0.7) !important; }
      h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 * { color: #ff00ff !important; text-shadow: 0 0 12px rgba(255,0,255,0.6) !important; }
      img, video, canvas { filter: saturate(2) hue-rotate(90deg) brightness(0.85) !important; border: 1px solid #00ff41 !important; }
      input, textarea, select { background-color: #0a1a0a !important; color: #00ff41 !important; border: 1px solid #00ff41 !important; }
      button { background-color: #0a1a0a !important; color: #00ff41 !important; border: 1px solid #00ff41 !important; }
      button:hover { background-color: #00ff41 !important; color: #050505 !important; }
      ::selection { background: #00ff41 !important; color: #050505 !important; }
      body::after { content: '' !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px) !important; pointer-events: none !important; z-index: 2147483646 !important; animation: chameleon-crt 0.15s infinite !important; }
      @keyframes chameleon-crt { 0% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.95; } 100% { opacity: 1; } }
    `
  },

  synthwave: {
    label: 'Synthwave',
    desc: '80s retro · purple haze · grid horizon',
    tag: 'RETRO',
    palette: ['#0d0221', '#f72585', '#7209b7', '#4cc9f0'],
    preview: { bg: '#0d0221', surface: '#1a0533', text: '#e0a0ff', accent: '#f72585', heading: '#4cc9f0' },
    css: `
      *, *::before { background-color: #0d0221 !important; color: #e0a0ff !important; font-family: 'Courier New', Courier, monospace !important; border-color: #7209b7 !important; }
      body { background: linear-gradient(180deg, #0d0221 0%, #1a0533 60%, #0d0221 100%) !important; background-attachment: fixed !important; }
      a, a * { color: #f72585 !important; text-shadow: 0 0 8px rgba(247,37,133,0.5) !important; }
      a:hover, a:hover * { color: #ff6fc8 !important; }
      h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 *, h4 *, h5 *, h6 * { color: #4cc9f0 !important; text-shadow: 0 0 15px rgba(76,201,240,0.6), 0 0 30px rgba(76,201,240,0.3) !important; }
      img, video, canvas { filter: saturate(1.8) hue-rotate(270deg) brightness(0.9) !important; border: 1px solid #7209b7 !important; }
      input, textarea, select { background-color: #1a0533 !important; color: #e0a0ff !important; border: 1px solid #7209b7 !important; }
      button { background-color: #1a0533 !important; color: #f72585 !important; border: 1px solid #f72585 !important; }
      button:hover { background-color: #f72585 !important; color: #0d0221 !important; }
      ::selection { background: #f72585 !important; color: #0d0221 !important; }
      body::before { content: '' !important; position: fixed !important; bottom: 0 !important; left: 0 !important; width: 100% !important; height: 40% !important; background: repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(247,37,133,0.06) 40px, rgba(247,37,133,0.06) 41px), repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(76,201,240,0.06) 30px, rgba(76,201,240,0.06) 31px) !important; pointer-events: none !important; z-index: 2147483645 !important; }
      body::after { content: '' !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(247,37,133,0.02) 2px, rgba(247,37,133,0.02) 4px) !important; pointer-events: none !important; z-index: 2147483646 !important; }
    `
  },

  vaporwave: {
    label: 'Vaporwave',
    desc: 'Pastel dreams · aesthetic pink · cloud soft',
    tag: 'AESTHETIC',
    palette: ['#1a0b2e', '#ff6ac1', '#bf5af2', '#79e7ff'],
    preview: { bg: '#1a0b2e', surface: '#2d1460', text: '#f0c6ff', accent: '#ff6ac1', heading: '#79e7ff' },
    css: `
      *, *::before { background-color: #1a0b2e !important; color: #f0c6ff !important; font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif !important; border-color: #bf5af2 !important; }
      body { background: linear-gradient(135deg, #1a0b2e 0%, #2d1460 40%, #1a0b2e 100%) !important; background-attachment: fixed !important; }
      a, a * { color: #ff6ac1 !important; text-decoration: none !important; }
      a:hover, a:hover * { color: #ffaadd !important; text-shadow: 0 0 10px rgba(255,106,193,0.6) !important; }
      h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 *, h4 *, h5 *, h6 * { color: #79e7ff !important; text-shadow: 0 0 12px rgba(121,231,255,0.5) !important; }
      img, video, canvas { filter: saturate(1.4) brightness(0.95) contrast(1.05) !important; border: 1px solid #bf5af2 !important; border-radius: 6px !important; }
      input, textarea, select { background-color: #2d1460 !important; color: #f0c6ff !important; border: 1px solid #bf5af2 !important; border-radius: 8px !important; }
      button { background: linear-gradient(135deg, #bf5af2, #ff6ac1) !important; color: #fff !important; border: none !important; border-radius: 20px !important; }
      ::selection { background: #ff6ac1 !important; color: #1a0b2e !important; }
      body::after { content: '' !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: radial-gradient(ellipse at 80% 10%, rgba(121,231,255,0.06) 0%, transparent 40%), radial-gradient(ellipse at 20% 80%, rgba(255,106,193,0.06) 0%, transparent 40%) !important; pointer-events: none !important; z-index: 2147483646 !important; }
    `
  },

  matrix: {
    label: 'Matrix',
    desc: 'Phosphor green · binary rain · deep scan',
    tag: 'HACKER',
    palette: ['#000000', '#39ff14', '#00cc00', '#003300'],
    preview: { bg: '#000000', surface: '#001100', text: '#39ff14', accent: '#00cc00', heading: '#39ff14' },
    css: `
      *, *::before { background-color: #000000 !important; color: #39ff14 !important; font-family: 'Courier New', Courier, monospace !important; border-color: #003300 !important; text-shadow: 0 0 5px rgba(57,255,20,0.6) !important; }
      a, a * { color: #00ff41 !important; text-shadow: 0 0 8px rgba(0,255,65,0.7) !important; }
      a:hover, a:hover * { color: #ffffff !important; text-shadow: 0 0 10px #00ff41 !important; }
      h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 *, h4 *, h5 *, h6 * { color: #00ff41 !important; text-shadow: 0 0 15px rgba(0,255,65,0.9) !important; }
      img, video, canvas { filter: grayscale(1) sepia(1) hue-rotate(80deg) brightness(0.65) saturate(4) !important; border: 1px solid #003300 !important; }
      input, textarea, select { background-color: #001100 !important; color: #39ff14 !important; border: 1px solid #003300 !important; }
      button { background-color: #001100 !important; color: #39ff14 !important; border: 1px solid #39ff14 !important; }
      button:hover { background-color: #39ff14 !important; color: #000000 !important; }
      ::selection { background: #39ff14 !important; color: #000000 !important; }
      body::after { content: '' !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,65,0.04) 1px, rgba(0,255,65,0.04) 2px) !important; pointer-events: none !important; z-index: 2147483646 !important; }
    `
  },

  neonNoir: {
    label: 'Neon Noir',
    desc: 'Crimson neon · dark alleys · rain-slicked',
    tag: 'NOIR',
    palette: ['#080808', '#ff0040', '#cc0030', '#1a1a1a'],
    preview: { bg: '#080808', surface: '#111111', text: '#c0c0c0', accent: '#ff0040', heading: '#ffffff' },
    css: `
      *, *::before { background-color: #080808 !important; color: #b8b8b8 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; border-color: #1a1a1a !important; }
      a, a * { color: #ff0040 !important; text-shadow: 0 0 8px rgba(255,0,64,0.5) !important; }
      a:hover, a:hover * { color: #ff4070 !important; text-shadow: 0 0 12px rgba(255,0,64,0.8) !important; }
      h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 *, h4 *, h5 *, h6 * { color: #ffffff !important; text-shadow: none !important; }
      strong, b, em { color: #ff0040 !important; }
      img, video, canvas { filter: grayscale(0.2) contrast(1.1) brightness(0.85) !important; border: 1px solid #1a1a1a !important; }
      input, textarea, select { background-color: #111111 !important; color: #b8b8b8 !important; border: 1px solid #2a2a2a !important; }
      button { background-color: #111111 !important; color: #b8b8b8 !important; border: 1px solid #2a2a2a !important; }
      button:hover { background-color: #ff0040 !important; color: #ffffff !important; }
      ::selection { background: #ff0040 !important; color: #ffffff !important; }
      body::after { content: '' !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: radial-gradient(ellipse at 15% 50%, rgba(255,0,64,0.05) 0%, transparent 50%), radial-gradient(ellipse at 85% 20%, rgba(255,0,64,0.03) 0%, transparent 40%) !important; pointer-events: none !important; z-index: 2147483646 !important; }
    `
  },

  midnight: {
    label: 'Midnight',
    desc: 'Deep navy · liquid gold · glass rounded',
    tag: 'ELEGANT',
    palette: ['#0a0f1e', '#ffd700', '#1c2a50', '#2a3558'],
    preview: { bg: '#0a0f1e', surface: '#111827', text: '#e8d5a3', accent: '#ffd700', heading: '#ffd700' },
    css: `
      *, *::before { background-color: #0a0f1e !important; color: #e8d5a3 !important; border-color: #1c2440 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; }
      body { background: linear-gradient(135deg, #0a0f1e 0%, #0d1530 50%, #0a0f1e 100%) !important; background-attachment: fixed !important; }
      a, a * { color: #ffd700 !important; }
      a:hover, a:hover * { color: #ffec6e !important; text-shadow: 0 0 8px rgba(255,215,0,0.4) !important; }
      h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 *, h4 *, h5 *, h6 * { color: #ffd700 !important; text-shadow: 0 1px 4px rgba(255,215,0,0.2) !important; }
      img, video, canvas { border-radius: 12px !important; border: 1px solid #1c2440 !important; filter: brightness(0.9) !important; }
      [class*="container"], [class*="card"], [class*="box"], [class*="panel"], article, section { border-radius: 10px !important; border: 1px solid #1c2440 !important; }
      input, textarea, select { background-color: #111827 !important; color: #e8d5a3 !important; border: 1px solid #2a3558 !important; border-radius: 8px !important; }
      button { background-color: #1c2a50 !important; color: #ffd700 !important; border: 1px solid #2a3558 !important; border-radius: 8px !important; }
      button:hover { background-color: #ffd700 !important; color: #0a0f1e !important; }
      ::selection { background: #ffd700 !important; color: #0a0f1e !important; }
    `
  },

  aurora: {
    label: 'Aurora',
    desc: 'Northern lights · teal sky · living gradient',
    tag: 'NATURE',
    palette: ['#050d12', '#00e5ff', '#a8ff78', '#7b2ff7'],
    preview: { bg: '#050d12', surface: '#0a1f28', text: '#7efff5', accent: '#00e5ff', heading: '#a8ff78' },
    css: `
      *, *::before { background-color: #050d12 !important; color: #7efff5 !important; border-color: #0d2b30 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; }
      body { background: #050d12 !important; }
      a, a * { color: #00e5ff !important; text-shadow: 0 0 8px rgba(0,229,255,0.4) !important; }
      a:hover, a:hover * { color: #80f5ff !important; }
      h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 *, h4 *, h5 *, h6 * { color: #a8ff78 !important; text-shadow: 0 0 15px rgba(168,255,120,0.4) !important; }
      img, video, canvas { filter: brightness(0.9) hue-rotate(170deg) saturate(0.9) !important; border: 1px solid #0d2b30 !important; }
      input, textarea, select { background-color: #0a1f28 !important; color: #7efff5 !important; border: 1px solid #0d2b30 !important; }
      button { background-color: #0a1f28 !important; color: #00e5ff !important; border: 1px solid #0d2b30 !important; }
      button:hover { background-color: #00e5ff !important; color: #050d12 !important; }
      ::selection { background: #a8ff78 !important; color: #050d12 !important; }
      body::after { content: '' !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: radial-gradient(ellipse at 30% 0%, rgba(0,229,255,0.09) 0%, transparent 45%), radial-gradient(ellipse at 75% 10%, rgba(168,255,120,0.07) 0%, transparent 38%), radial-gradient(ellipse at 60% 30%, rgba(123,47,247,0.05) 0%, transparent 30%) !important; pointer-events: none !important; z-index: 2147483646 !important; animation: chameleon-aurora 9s ease-in-out infinite alternate !important; }
      @keyframes chameleon-aurora { 0% { opacity: 0.6; transform: translateX(0) scaleX(1); } 100% { opacity: 1; transform: translateX(30px) scaleX(1.05); } }
    `
  },

  holographic: {
    label: 'Holographic',
    desc: 'Rainbow shift · iridescent · prismatic',
    tag: 'PRISMATIC',
    palette: ['#080808', '#ff00cc', '#00ffcc', '#ffff00'],
    preview: { bg: '#080808', surface: '#111111', text: '#e0e0ff', accent: '#ff00cc', heading: '#00ffcc' },
    css: `
      *, *::before { background-color: #080808 !important; color: #e0e0ff !important; border-color: #1a1a2e !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; }
      a, a * { color: #ff6ec7 !important; }
      a:hover, a:hover * { color: #00ffcc !important; }
      h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 *, h4 *, h5 *, h6 * { color: #a0f0ff !important; }
      img, video, canvas { filter: saturate(1.8) brightness(1.05) contrast(1.05) !important; border-radius: 8px !important; }
      input, textarea, select { background-color: #111111 !important; color: #e0e0ff !important; border: 1px solid #2a2a4a !important; }
      button { background-color: #111111 !important; color: #ff6ec7 !important; border: 1px solid #2a2a4a !important; }
      button:hover { background-color: #ff6ec7 !important; color: #080808 !important; }
      ::selection { background: #ff00cc !important; color: #080808 !important; }
      body { animation: chameleon-holo 12s linear infinite !important; }
      @keyframes chameleon-holo { 0% { filter: hue-rotate(0deg) saturate(1.5); } 100% { filter: hue-rotate(360deg) saturate(1.5); } }
      body::after { content: '' !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: linear-gradient(135deg, rgba(255,0,204,0.04) 0%, rgba(0,255,204,0.04) 25%, rgba(255,255,0,0.04) 50%, rgba(0,204,255,0.04) 75%, rgba(255,0,204,0.04) 100%) !important; pointer-events: none !important; z-index: 2147483646 !important; }
    `
  },

  solarFlare: {
    label: 'Solar Flare',
    desc: 'Ember glow · amber heat · scorched dark',
    tag: 'FIRE',
    palette: ['#0c0800', '#ff6b00', '#ffd700', '#ff3300'],
    preview: { bg: '#0c0800', surface: '#1a1000', text: '#ffb347', accent: '#ff6b00', heading: '#ffd700' },
    css: `
      *, *::before { background-color: #0c0800 !important; color: #ffb347 !important; border-color: #2a1500 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; }
      body { background: radial-gradient(ellipse at 50% -10%, rgba(255,100,0,0.12) 0%, transparent 55%), #0c0800 !important; background-attachment: fixed !important; }
      a, a * { color: #ff6b00 !important; text-shadow: 0 0 8px rgba(255,107,0,0.4) !important; }
      a:hover, a:hover * { color: #ff9900 !important; text-shadow: 0 0 12px rgba(255,153,0,0.6) !important; }
      h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 *, h4 *, h5 *, h6 * { color: #ffd700 !important; text-shadow: 0 0 12px rgba(255,215,0,0.35) !important; }
      img, video, canvas { filter: sepia(0.3) brightness(0.88) contrast(1.05) !important; border: 1px solid #2a1500 !important; }
      input, textarea, select { background-color: #1a1000 !important; color: #ffb347 !important; border: 1px solid #2a1500 !important; }
      button { background-color: #1a1000 !important; color: #ff6b00 !important; border: 1px solid #ff6b00 !important; }
      button:hover { background-color: #ff6b00 !important; color: #0c0800 !important; }
      ::selection { background: #ff6b00 !important; color: #0c0800 !important; }
      body::after { content: '' !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: radial-gradient(ellipse at 50% -20%, rgba(255,80,0,0.1) 0%, transparent 55%) !important; pointer-events: none !important; z-index: 2147483646 !important; animation: chameleon-flare 5s ease-in-out infinite alternate !important; }
      @keyframes chameleon-flare { 0% { opacity: 0.5; } 100% { opacity: 1; } }
    `
  },

  terminal: {
    label: 'Terminal',
    desc: 'Amber phosphor · prompt glow · command line',
    tag: 'HACKER',
    palette: ['#0d0d0d', '#e5a445', '#ffd284', '#2a1800'],
    preview: { bg: '#0d0d0d', surface: '#1a1100', text: '#e5a445', accent: '#ffc862', heading: '#ffd284' },
    css: `
      *, *::before { background-color: #0d0d0d !important; color: #e5a445 !important; font-family: 'Courier New', Courier, monospace !important; border-color: #2a1800 !important; text-shadow: 0 0 4px rgba(229,164,69,0.4) !important; }
      a, a * { color: #ffc862 !important; text-decoration: underline !important; text-shadow: 0 0 6px rgba(255,200,98,0.4) !important; }
      a:hover, a:hover * { color: #ffd284 !important; }
      h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 *, h4 *, h5 *, h6 * { color: #ffd284 !important; text-shadow: 0 0 8px rgba(255,210,132,0.5) !important; }
      h1::before, h2::before { content: '> ' !important; color: #e5a445 !important; opacity: 0.7 !important; }
      img, video, canvas { filter: sepia(1) brightness(0.65) contrast(1.1) !important; border: 1px solid #2a1800 !important; }
      input, textarea, select { background-color: #1a1100 !important; color: #e5a445 !important; border: 1px solid #2a1800 !important; }
      button { background-color: #1a1100 !important; color: #e5a445 !important; border: 1px solid #e5a445 !important; }
      button:hover { background-color: #e5a445 !important; color: #0d0d0d !important; }
      ::selection { background: #e5a445 !important; color: #0d0d0d !important; }
      body::after { content: '' !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(229,164,69,0.025) 1px, rgba(229,164,69,0.025) 2px) !important; pointer-events: none !important; z-index: 2147483646 !important; }
    `
  },

  paper: {
    label: 'Paper',
    desc: 'Solarized cream · serif prose · no ads',
    tag: 'MINIMAL',
    palette: ['#fdf6e3', '#4a4033', '#c8b89a', '#8b5e3c'],
    preview: { bg: '#fdf6e3', surface: '#f5ead0', text: '#4a4033', accent: '#8b5e3c', heading: '#2c1e0f' },
    css: `
      *, *::before, *::after { background-color: #fdf6e3 !important; color: #4a4033 !important; font-family: Georgia, 'Times New Roman', Times, serif !important; border-color: #c8b89a !important; box-shadow: none !important; text-shadow: none !important; }
      body { background-color: #fdf6e3 !important; max-width: 860px !important; margin: 0 auto !important; padding: 2rem !important; }
      a, a * { color: #5a3e28 !important; text-decoration: underline !important; }
      a:hover, a:hover * { color: #8b5e3c !important; }
      h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 *, h4 *, h5 *, h6 * { color: #2c1e0f !important; }
      img, video { filter: sepia(0.15) !important; border: 1px solid #c8b89a !important; }
      input, textarea, select { background-color: #f5ead0 !important; color: #4a4033 !important; border: 1px solid #c8b89a !important; }
      button { background-color: #e8dcc8 !important; color: #4a4033 !important; border: 1px solid #c8b89a !important; }
      ::selection { background: #c8b89a !important; color: #2c1e0f !important; }
      aside, [id*="sidebar"], [class*="sidebar"], [id*="ad-"], [class*="ad-"], [id*="-ad"], [class*="-ad"], .ad-container, .advertisement, .ads, [class*="banner"], [id*="banner"], .widget, [class*="widget-area"], [id*="promo"], [class*="promo"] { display: none !important; }
    `
  },

  obsidian: {
    label: 'Obsidian',
    desc: 'Cold steel · ice blue · professional dark',
    tag: 'MINIMAL',
    palette: ['#111318', '#5b9cf6', '#1e2230', '#b8c0d4'],
    preview: { bg: '#111318', surface: '#1a1e2a', text: '#b8c0d4', accent: '#5b9cf6', heading: '#e2e8f0' },
    css: `
      *, *::before { background-color: #111318 !important; color: #b8c0d4 !important; border-color: #1e2230 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important; }
      a, a * { color: #5b9cf6 !important; text-decoration: none !important; }
      a:hover, a:hover * { color: #93c5fd !important; text-shadow: 0 0 6px rgba(147,197,253,0.3) !important; }
      h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 *, h4 *, h5 *, h6 * { color: #e2e8f0 !important; }
      img, video, canvas { filter: brightness(0.88) contrast(1.05) !important; border: 1px solid #1e2230 !important; border-radius: 4px !important; }
      input, textarea, select { background-color: #1a1e2a !important; color: #b8c0d4 !important; border: 1px solid #2a3148 !important; border-radius: 6px !important; }
      button { background-color: #1e2535 !important; color: #b8c0d4 !important; border: 1px solid #2a3148 !important; border-radius: 6px !important; }
      button:hover { background-color: #5b9cf6 !important; color: #ffffff !important; }
      ::selection { background: #5b9cf6 !important; color: #111318 !important; }
      body::after { content: '' !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: radial-gradient(ellipse at 100% 0%, rgba(91,156,246,0.04) 0%, transparent 50%) !important; pointer-events: none !important; z-index: 2147483646 !important; }
    `
  }

};

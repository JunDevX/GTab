(function (global) {
  'use strict';

  const api = global.browser || global.chrome;

  const DEFAULTS = Object.freeze({
    theme: 'midnight',
    accent: '#0078D4',
    engine: 'google'
  });

  const THEMES = Object.freeze([
    { id: 'midnight', name: 'Полночь', note: 'Глубокий синий, по умолчанию' },
    { id: 'graphite', name: 'Графит', note: 'Нейтральный серый' },
    { id: 'amoled', name: 'AMOLED', note: 'Чистый чёрный для OLED' }
  ]);

  const ACCENTS = Object.freeze([
    { id: 'win', name: 'Системный (Windows)', hex: '#0078D4' },
    { id: 'violet', name: 'Фиолетовый', hex: '#8B5CF6' },
    { id: 'mint', name: 'Мятный', hex: '#34D399' },
    { id: 'amber', name: 'Янтарный', hex: '#F59E0B' },
    { id: 'rose', name: 'Розовый', hex: '#F472B6' },
    { id: 'crimson', name: 'Алый', hex: '#EF4444' }
  ]);

  const ENGINES = Object.freeze({
    google: {
      id: 'google',
      name: 'Google',
      search: 'https://www.google.com/search?q=',
      placeholder: 'Поиск в Google',
      note: 'Точка → G → Google'
    },
    yandex: {
      id: 'yandex',
      name: 'Яндекс',
      search: 'https://yandex.ru/search/?text=',
      placeholder: 'Поиск в Яндексе',
      note: 'Буквы поднимаются'
    },
    duckduckgo: {
      id: 'duckduckgo',
      name: 'DuckDuckGo',
      search: 'https://duckduckgo.com/?q=',
      placeholder: 'Поиск в DuckDuckGo',
      note: 'Уточка плывёт вправо'
    }
  });

  const SHORTCUTS = Object.freeze({
    google: [
      {
        name: 'Gemini',
        url: 'https://gemini.google.com/app',
        keys: ['гемини', 'джемини', 'гемини ии', 'gemini', 'google gemini', 'гугл джемини', 'гугл ии', 'гугл аи', 'google ai']
      },
      {
        name: 'Gmail',
        url: 'https://mail.google.com/',
        keys: ['email', 'имейл', 'емейл', 'мейл', 'mail', 'gmail', 'джимейл', 'гугл почта', 'гугл мейл', 'почта', 'почта google']
      }
    ],
    yandex: [
      {
        name: 'Яндекс ИИ',
        url: 'https://alice.yandex.ru/',
        keys: ['ии', 'ии яндекс', 'яндекс ии', 'яндекс аи', 'yandex ai', 'алиса', 'alice', 'яндекс алиса', 'нейро', 'яндекс нейро']
      },
      {
        name: 'Яндекс Почта',
        url: 'https://mail.yandex.ru/',
        keys: ['email', 'имейл', 'емейл', 'мейл', 'mail', 'yandex mail', 'яндекс почта', 'яндекс мейл', 'почта', 'почта яндекс']
      }
    ],
    duckduckgo: []
  });

  function hexToRgb(hex) {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex || '').trim());
    if (!match) return null;
    return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
  }

  function normalizeHex(value) {
    const rgb = hexToRgb(value);
    if (!rgb) return null;
    return '#' + rgb.map((part) => part.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  function luminance(rgb) {
    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  }

  function normalizeQuery(value) {
    return String(value)
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/\s+/g, ' ')
      .replace(/[«»"'`.,!?;:()[\]{}\-–—]+$/g, '')
      .trim();
  }

  function resolveQuery(value) {
    const query = normalizeQuery(value);
    return query;
  }

  function findShortcut(value, engineId) {
    const engine = ENGINES[engineId] || ENGINES.google;
    const query = normalizeQuery(value);
    if (!query) return null;
    const list = SHORTCUTS[engine.id] || [];
    for (const shortcut of list) {
      if (shortcut.keys.indexOf(query) !== -1) return shortcut;
    }
    return null;
  }

  function buildTarget(value, engineId) {
    const engine = ENGINES[engineId] || ENGINES.google;
    const trimmed = String(value == null ? '' : value).trim();
    const shortcut = findShortcut(trimmed, engine.id);
    if (shortcut) return { url: shortcut.url, kind: 'shortcut', name: shortcut.name };
    return {
      url: engine.search + encodeURIComponent(trimmed),
      kind: 'search',
      name: engine.name
    };
  }

  function sanitize(settings) {
    const next = Object.assign({}, DEFAULTS, settings || {});
    if (!THEMES.some((theme) => theme.id === next.theme)) next.theme = DEFAULTS.theme;
    if (!ENGINES[next.engine]) next.engine = DEFAULTS.engine;
    next.accent = normalizeHex(next.accent) || DEFAULTS.accent;
    return next;
  }

  function storageArea() {
    if (!api || !api.storage) return null;
    return api.storage.sync || api.storage.local || null;
  }

  function storageGet(defaults) {
    const area = storageArea();
    if (!area) return Promise.resolve(Object.assign({}, defaults));
    return new Promise((resolve) => {
      let settled = false;
      const done = (value) => {
        if (settled) return;
        settled = true;
        resolve(Object.assign({}, defaults, value || {}));
      };
      try {
        const result = area.get(defaults, done);
        if (result && typeof result.then === 'function') result.then(done, () => done(null));
      } catch (error) {
        done(null);
      }
    });
  }

  function storageSet(patch) {
    const area = storageArea();
    if (!area) return Promise.resolve();
    return new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      try {
        const result = area.set(patch, done);
        if (result && typeof result.then === 'function') result.then(done, done);
      } catch (error) {
        done();
      }
    });
  }

  function loadSettings() {
    return storageGet(DEFAULTS).then(sanitize);
  }

  function saveSettings(settings) {
    const next = sanitize(settings);
    return storageSet(next).then(() => next);
  }

  function applyAppearance(settings) {
    const next = sanitize(settings);
    const rgb = hexToRgb(next.accent);
    const root = document.documentElement;
    root.setAttribute('data-theme', next.theme);
    root.setAttribute('data-engine', next.engine);
    root.style.setProperty('--accent', next.accent);
    root.style.setProperty('--accent-rgb', rgb.join(', '));
    root.style.setProperty('--accent-ink', luminance(rgb) > 0.58 ? '#08111a' : '#ffffff');
    return next;
  }

  global.GT = {
    DEFAULTS: DEFAULTS,
    THEMES: THEMES,
    ACCENTS: ACCENTS,
    ENGINES: ENGINES,
    SHORTCUTS: SHORTCUTS,
    hexToRgb: hexToRgb,
    normalizeHex: normalizeHex,
    normalizeQuery: normalizeQuery,
    resolveQuery: resolveQuery,
    findShortcut: findShortcut,
    buildTarget: buildTarget,
    sanitize: sanitize,
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    applyAppearance: applyAppearance
  };
})(typeof window !== 'undefined' ? window : this);

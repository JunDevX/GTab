(function () {
  'use strict';

  const themesEl = document.getElementById('themes');
  const accentsEl = document.getElementById('accents');
  const enginesEl = document.getElementById('engines');
  const shortcutsEl = document.getElementById('shortcuts');
  const picker = document.getElementById('accentPicker');
  const accentValue = document.getElementById('accentValue');
  const replayButton = document.getElementById('replay');
  const resetButton = document.getElementById('reset');
  const toast = document.getElementById('toast');

  let state = GT.sanitize(GT.DEFAULTS);
  let toastTimer = 0;
  let saveTimer = 0;

  function notify(text) {
    toast.textContent = text;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-on');
    }, 1500);
  }

  function persist(patch, silent) {
    state = GT.sanitize(Object.assign({}, state, patch));
    GT.applyAppearance(state);
    sync();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      GT.saveSettings(state).then(function () {
        if (!silent) notify('Сохранено');
      });
    }, 120);
  }

  function playAll() {
    const selected = enginesEl.querySelector('.engine[aria-checked="true"] .brand');
    if (selected) GTBrand.play(selected, state.engine);
  }

  function buildThemes() {
    GT.THEMES.forEach(function (theme) {
      const card = document.createElement('div');
      card.className = 'card theme';
      card.dataset.theme = theme.id;
      card.setAttribute('role', 'radio');
      card.setAttribute('tabindex', '0');
      card.innerHTML =
        '<span class="swatch" data-preview="' + theme.id + '"></span>' +
        '<span class="card-body"><strong>' + theme.name + '</strong><em>' + theme.note + '</em></span>';
      card.addEventListener('click', function () {
        persist({ theme: theme.id });
      });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          persist({ theme: theme.id });
        }
      });
      themesEl.appendChild(card);
    });
  }

  function buildAccents() {
    GT.ACCENTS.forEach(function (accent) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'accent-chip';
      chip.dataset.accent = accent.hex;
      chip.style.background = accent.hex;
      chip.title = accent.name + ' · ' + accent.hex;
      chip.setAttribute('aria-label', accent.name);
      chip.setAttribute('role', 'radio');
      chip.addEventListener('click', function () {
        persist({ accent: accent.hex });
      });
      accentsEl.appendChild(chip);
    });
  }

  function buildEngines() {
    Object.keys(GT.ENGINES).forEach(function (id) {
      const engine = GT.ENGINES[id];
      const card = document.createElement('div');
      card.className = 'card engine';
      card.dataset.engine = id;
      card.setAttribute('role', 'radio');
      card.setAttribute('tabindex', '0');
      card.innerHTML =
        '<span class="preview"><span class="brand"></span></span>' +
        '<span class="card-body"><strong>' + engine.name + '</strong><em>' + engine.note + '</em></span>';
      card.addEventListener('click', function () {
        persist({ engine: id });
        GTBrand.play(card.querySelector('.brand'), id);
      });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          card.click();
        }
      });
      enginesEl.appendChild(card);
    });
  }

  function renderShortcuts() {
    shortcutsEl.textContent = '';
    const list = GT.SHORTCUTS[state.engine] || [];

    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Для этой поисковой системы ключевых слов нет — запросы уходят в обычный поиск.';
      shortcutsEl.appendChild(empty);
      return;
    }

    list.forEach(function (shortcut) {
      const row = document.createElement('div');
      row.className = 'shortcut';
      const keys = shortcut.keys
        .map(function (key) {
          return '<code>' + key + '</code>';
        })
        .join('');
      row.innerHTML = '<b>' + shortcut.name + '</b><span class="keys">' + keys + '</span>';
      shortcutsEl.appendChild(row);
    });
  }

  function sync() {
    themesEl.querySelectorAll('.theme').forEach(function (card) {
      card.setAttribute('aria-checked', String(card.dataset.theme === state.theme));
    });

    accentsEl.querySelectorAll('.accent-chip').forEach(function (chip) {
      chip.setAttribute('aria-checked', String(chip.dataset.accent === state.accent));
    });

    picker.value = state.accent;
    accentValue.textContent = state.accent;

    enginesEl.querySelectorAll('.engine').forEach(function (card) {
      card.setAttribute('aria-checked', String(card.dataset.engine === state.engine));
    });

    renderShortcuts();
  }

  picker.addEventListener('input', function () {
    persist({ accent: picker.value.toUpperCase() }, true);
  });

  picker.addEventListener('change', function () {
    notify('Сохранено');
  });

  replayButton.addEventListener('click', playAll);

  resetButton.addEventListener('click', function () {
    if (!window.confirm('Сбросить тему, акцент и поисковую систему к значениям по умолчанию?')) return;
    persist(GT.DEFAULTS);
    playAll();
  });

  buildThemes();
  buildAccents();
  buildEngines();

  GT.loadSettings().then(function (loaded) {
    state = GT.applyAppearance(loaded);
    sync();
    playAll();
  });
})();

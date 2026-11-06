(function () {
  'use strict';

  const form = document.getElementById('searchForm');
  const input = document.getElementById('q');
  const engineName = document.getElementById('engine-name');
  const brand = document.getElementById('brand');

  let settings = GT.sanitize(GT.DEFAULTS);

  function paint() {
    const engine = GT.ENGINES[settings.engine] || GT.ENGINES.google;
    input.placeholder = engine.placeholder;
    input.setAttribute('aria-label', engine.placeholder);
    engineName.textContent = engine.name;
    GTBrand.play(brand, engine.id);
  }

  function shake() {
    form.classList.remove('is-empty');
    void form.offsetWidth;
    form.classList.add('is-empty');
  }

  function go() {
    const value = input.value.trim();
    if (!value) {
      shake();
      input.focus();
      return;
    }
    const target = GT.buildTarget(value, settings.engine);
    window.location.assign(target.url);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    go();
  });

  input.addEventListener('input', function () {
    form.classList.remove('is-empty');
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && input.value) {
      event.preventDefault();
      input.value = '';
    }
  });

  window.addEventListener('focus', function () {
    if (!input.value && document.activeElement !== input) input.focus();
  });

  GT.loadSettings()
    .then(function (loaded) {
      settings = GT.applyAppearance(loaded);
      paint();
    })
    .catch(function () {
      settings = GT.applyAppearance(GT.DEFAULTS);
      paint();
    })
    .then(function () {
      input.focus({ preventScroll: true });
    });
})();

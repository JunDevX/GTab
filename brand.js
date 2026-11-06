(function (global) {
  'use strict';

  const CYCLE = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

  const GOOGLE_MARK =
    '<svg class="g-mark" viewBox="0 0 48 48" aria-hidden="true">' +
    '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
    '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
    '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
    '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
    '</svg>';

  const DUCK =
    '<svg class="d-duck" viewBox="0 0 64 44" aria-hidden="true">' +
    '<ellipse cx="28" cy="30" rx="19" ry="11.5" fill="#FBBF24"/>' +
    '<path d="M14 24c-4 1-6 4-5 7 2-2 5-2 8-1z" fill="#F59E0B"/>' +
    '<circle cx="45" cy="16" r="9.5" fill="#FDE68A"/>' +
    '<path d="M53 13.5l10 4-10 4z" fill="#F59E0B"/>' +
    '<circle cx="47.6" cy="13.4" r="1.7" fill="#111827"/>' +
    '<path d="M23 25c5 5 12 6 18 3" stroke="#F59E0B" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.75"/>' +
    '</svg>';

  const RUNNERS = {
    google: google,
    yandex: yandex,
    duckduckgo: duckduckgo
  };

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function prefersReduced() {
    return !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  async function google(root) {
    root.innerHTML = '<div class="g-dot"></div>' + GOOGLE_MARK + '<div class="g-word"><i>G</i><i>o</i><i>o</i><i>g</i><i>l</i><i>e</i></div>';
    const dot = root.querySelector('.g-dot');
    const mark = root.querySelector('.g-mark');
    const word = root.querySelector('.g-word');

    if (prefersReduced()) {
      dot.remove();
      mark.remove();
      word.classList.add('is-in');
      return;
    }

    dot.classList.add('is-in');
    await wait(200);
    if (!dot.isConnected) return;

    for (let step = 0; step < 9; step += 1) {
      if (!dot.isConnected) return;
      const color = CYCLE[step % CYCLE.length];
      dot.style.background = color;
      dot.style.boxShadow = '0 0 0.45em ' + color;
      await wait(74);
    }

    dot.classList.remove('is-in');
    dot.classList.add('is-out');
    mark.classList.add('is-in');
    await wait(300);
    dot.remove();
    await wait(230);
    mark.classList.add('is-out');
    word.classList.add('is-in');
    await wait(760);
    mark.remove();
  }

  function yandex(root) {
    const letters = 'Yandex'
      .split('')
      .map(function (char, index) {
        return '<i style="--i:' + index + '">' + char + '</i>';
      })
      .join('');
    root.innerHTML = '<div class="y-row">' + letters + '</div>';
    return Promise.resolve();
  }

  function duckduckgo(root) {
    root.innerHTML = '<div class="d-word">DuckDuckGo</div>' + DUCK;
    return Promise.resolve();
  }

  function play(root, engineId) {
    if (!root) return Promise.resolve();
    const id = RUNNERS[engineId] ? engineId : 'google';
    root.className = 'brand';
    root.dataset.engine = id;
    if (prefersReduced()) root.classList.add('is-static');
    return RUNNERS[id](root);
  }

  global.GTBrand = { play: play };
})(typeof window !== 'undefined' ? window : this);

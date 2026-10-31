'use strict';

[app, ...$$('.screen')].forEach(el =>
  el.addEventListener('scroll', () => {
    if (el.scrollTop || el.scrollLeft) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  })
);

$$('.screen').forEach(s => {
  const bar = $('.sbg', s),
    sc = $('.scroll', s);
  if (!bar || !sc) return;
  sc.addEventListener('scroll', () => s.classList.toggle('scrolled', sc.scrollTop > 66), { passive: true });
  bar.addEventListener('click', () => sc.scrollTo({ top: 0, behavior: 'smooth' }));
});

addEventListener('scroll', () => {
  if (scrollX || scrollY) scrollTo(0, 0);
});

$('#credits').innerHTML =
  `Fotos de destinos do <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a>, por ${photoCredits()}.`;

applyTheme(false);
buildHome();
updateHome();
splashSky.start();

(function boot() {
  const urls = [
    'assets/brand/gol-logo.png',
    'assets/brand/gol-logo-dark.png',
    'assets/brand/gol-logo-white.png',
    'assets/photos/' + PROMOS[0].ph + '-l.webp',
    'assets/photos/' + PROMOS[1].ph + '-l.webp',
    'assets/photos/' + DESTINATIONS[FEATURED_DESTINATIONS[0]].card + '-s.webp'
  ];
  let n = 0,
    fired = false;
  const t0 = performance.now(),
    bar = $('#splashBar');
  const finish = () => {
    if (fired) return;
    fired = true;
    setTimeout(
      () => {
        launchApp();
        setTimeout(animateMilesCounter, 750);
      },
      Math.max(0, 3000 - (performance.now() - t0))
    );
  };
  urls.forEach(u => {
    const i = new Image();
    i.onload = i.onerror = () => {
      n++;
      bar.style.transform = `scaleX(${Math.max(0.04, n / urls.length)})`;
      if (n === urls.length) finish();
    };
    i.src = u;
  });
  setTimeout(finish, 4500);
})();

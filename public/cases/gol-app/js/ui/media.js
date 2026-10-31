'use strict';

function photoMarkup(name, size = 'l', cls = '', eager = false) {
  const p = PHOTOS[name] || PHOTOS['air-1'];
  return `<div class="ph ${cls}" style="background-color:${p.c};background-image:url('${p.q}')"><img src="assets/photos/${name}-${size}.webp" alt="" ${eager ? '' : 'loading="lazy"'} decoding="async" onload="this.classList.add('ok')" style="object-position:${PHOTO_FOCUS[name] || '50% 50%'}"></div>`;
}

const logoMarkup = (cls = '') =>
  `<img class="lg-l ${cls}" src="assets/brand/gol-logo.png" alt="GOL"><img class="lg-d ${cls}" src="assets/brand/gol-logo-dark.png" alt="" aria-hidden="true">`;

function photoCredits() {
  return [...new Set(Object.values(PHOTOS).map(p => p.a))].join(', ');
}

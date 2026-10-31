'use strict';

function fitPhone() {
  const c = document.getElementById('caption'),
    ch = c ? c.offsetHeight + 14 : 40,
    de = document.documentElement;
  const W = de.clientWidth || innerWidth,
    H = de.clientHeight || innerHeight;
  const s = Math.min((H - 32 - ch) / 868, (W - 32) / 414, 1.04);
  document.documentElement.style.setProperty('--ps', Math.max(0.34, s).toFixed(4));
}

fitPhone();
addEventListener('resize', fitPhone);
document.documentElement.classList.add('is-ready');

const phoneScale = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ps')) || 1;

function updateClock() {
  const d = new Date();
  $('#clock').textContent = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
}

updateClock();
setInterval(updateClock, 15000);

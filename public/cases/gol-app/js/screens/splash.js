'use strict';

const splashSky = (() => {
  const cv = $('#splashSky'),
    ctx = cv.getContext('2d'),
    W = 390,
    H = 844,
    GAP = 9,
    TRAIL = 260;
  const icon = new Path2D(
    'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'
  );
  const bez = (p, t) => {
    const u = 1 - t;
    return [0, 1].map(
      j => u * u * u * p[0][j] + 3 * u * u * t * p[1][j] + 3 * u * t * t * p[2][j] + t * t * t * p[3][j]
    );
  };
  const ROUTES = [
    [
      [-40, 640],
      [90, 560],
      [250, 650],
      [440, 560]
    ],
    [
      [440, 300],
      [300, 220],
      [130, 340],
      [-40, 250]
    ],
    [
      [440, 770],
      [300, 830],
      [150, 720],
      [-40, 790]
    ],
    [
      [-40, 170],
      [120, 120],
      [240, 205],
      [440, 115]
    ],
    [
      [-40, 335],
      [100, 385],
      [260, 300],
      [440, 360]
    ],
    [
      [440, 605],
      [320, 555],
      [160, 600],
      [-40, 520]
    ]
  ];
  const PLAN = [
    [0, -800, 4200, 19, 0.95],
    [1, -300, 4600, 15, 0.75],
    [2, 300, 4400, 17, 0.85],
    [3, 950, 4000, 14, 0.65],
    [4, 1750, 4300, 18, 0.9],
    [5, 2550, 4500, 15, 0.75],
    [0, 3350, 4200, 19, 0.95]
  ];
  const FL = PLAN.map(([r, delay, dur, size, alpha]) => {
    const pts = ROUTES[r],
      lut = [[...bez(pts, 0), 0]];
    let L = 0;
    for (let i = 1; i <= 200; i++) {
      const q = bez(pts, i / 200),
        a = lut[i - 1];
      L += Math.hypot(q[0] - a[0], q[1] - a[1]);
      lut.push([q[0], q[1], L]);
    }
    return { lut, L, delay, dur, size, alpha };
  });
  const at = (f, s) => {
    const l = f.lut;
    s = Math.max(0, Math.min(f.L, s));
    let lo = 0,
      hi = l.length - 1;
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1;
      if (l[m][2] < s) lo = m;
      else hi = m;
    }
    const a = l[lo],
      b = l[hi],
      k = (s - a[2]) / (b[2] - a[2] || 1);
    return {
      x: a[0] + (b[0] - a[0]) * k,
      y: a[1] + (b[1] - a[1]) * k,
      ang: Math.atan2(b[1] - a[1], b[0] - a[0])
    };
  };
  let raf = 0,
    t0 = 0,
    k = 1;
  function draw(t) {
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    for (const f of FL) {
      const e = (t - f.delay) / f.dur;
      if (e <= 0 || e > 1 + TRAIL / f.L) continue;
      const s = e * f.L;
      for (
        let d = Math.max(0, Math.ceil((s - TRAIL) / GAP)) * GAP;
        d < Math.min(s - f.size * 0.7, f.L);
        d += GAP
      ) {
        const p = at(f, d),
          a = (1 - (s - d) / TRAIL) * f.alpha * 0.85;
        if (a <= 0.02) continue;
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, 6.2832);
        ctx.fill();
      }
      if (s < f.L) {
        const p = at(f, s);
        ctx.globalAlpha = f.alpha;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.ang + Math.PI / 2);
        const sc = f.size / 24;
        ctx.scale(sc, sc);
        ctx.translate(-12, -12);
        ctx.fill(icon);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
  }
  function loop(now) {
    if (!t0) t0 = now;
    draw(now - t0);
    raf = requestAnimationFrame(loop);
  }
  return {
    start() {
      k = (window.devicePixelRatio || 1) * phoneScale();
      cv.width = Math.round(W * k);
      cv.height = Math.round(H * k);
      if (prefersReducedMotion) draw(1500);
      else raf = requestAnimationFrame(loop);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
})();

function launchApp() {
  const sp = screens.splash,
    home = screens.home,
    inner = $('.splash', sp),
    D = prefersReducedMotion ? 1 : 900;
  navStack = [{ id: 'home', k: 'fade' }];
  updateHome();
  home.classList.add('on');
  sp.style.zIndex = 5;
  home.style.zIndex = 2;
  app.dataset.hb = 'dark';
  const lift = sp.animate(
    [
      { transform: 'translate3d(0,0,0)', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' },
      { transform: 'translate3d(0,-104%,0)', borderBottomLeftRadius: '64px', borderBottomRightRadius: '64px' }
    ],
    { duration: D, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }
  );
  const drift = inner.animate(
    [
      { transform: 'none', opacity: 1 },
      { transform: 'translate3d(0,-80px,0) scale(.94)', opacity: 0 }
    ],
    { duration: D * 0.55, easing: 'cubic-bezier(.55,0,.8,.2)', fill: 'forwards' }
  );
  runningTransitions = [lift];
  if (!prefersReducedMotion) {
    home.animate([{ transform: 'translate3d(0,110px,0)' }, { transform: 'translate3d(0,0,0)' }], {
      duration: D + 260,
      easing: 'cubic-bezier(.16,1,.3,1)'
    });
    const kids = [...$('#homeScroll').children].slice(0, 4).reverse();
    kids.forEach((el, i) =>
      el.animate(
        [
          { opacity: 0, transform: 'translate3d(0,22px,0)' },
          { opacity: 1, transform: 'none' }
        ],
        { duration: 620, delay: 140 + i * 110, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }
      )
    );
  }
  setTimeout(() => {
    $('#tabbar').classList.remove('off');
    $$('#tabbar .tb').forEach((b, i) => b.classList.toggle('on', i === 0));
  }, D * 0.3);
  setTimeout(() => {
    if (currentScreen() === 'home') applyScreenChrome('home');
  }, D * 0.72);
  lift.onfinish = () => {
    sp.classList.remove('on');
    lift.cancel();
    drift.cancel();
    sp.style.zIndex = '';
    home.style.zIndex = '';
    splashSky.stop();
    if (runningTransitions[0] === lift) runningTransitions = [];
  };
}

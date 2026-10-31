'use strict';

const screens = {};
$$('.screen').forEach(s => (screens[s.id.slice(2)] = s));

const SCREEN_CHROME = {
  splash: { sb: 'light', hb: 'light' },
  home: { tab: 0 },
  trips: { tab: 1 },
  pass: { tab: 3, sb: 'light', hb: 'light' },
  account: { tab: 4 },
  dest: { sb: 'light' },
  trip: { sb: 'light' },
  done: { sb: 'light', hb: 'light' }
};

let navStack = [{ id: 'splash', k: 'fade' }];
const currentScreen = () => navStack[navStack.length - 1].id;

const TRANSITIONS = {
  push: [
    [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }],
    [
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(-28%)', opacity: 0.5 }
    ]
  ],
  back: [
    [
      { transform: 'translateX(-28%)', opacity: 0.5 },
      { transform: 'translateX(0)', opacity: 1 }
    ],
    [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }]
  ],
  up: [
    [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
    [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(.95)', opacity: 0.6 }
    ]
  ],
  down: [
    [
      { transform: 'scale(.95)', opacity: 0.6 },
      { transform: 'scale(1)', opacity: 1 }
    ],
    [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }]
  ],
  fade: [
    [
      { opacity: 0, transform: 'scale(1.02)' },
      { opacity: 1, transform: 'scale(1)' }
    ],
    [{ opacity: 1 }, { opacity: 0 }]
  ]
};

const REVERSE_TRANSITION = { push: 'back', up: 'down', fade: 'fade' };
let runningTransitions = [];

function transitionScreens(fromId, toId, kind, render = true) {
  if (viewer.open) closePhotoViewer(true);
  runningTransitions.forEach(a => {
    try {
      a.finish();
    } catch {}
  });
  runningTransitions = [];
  if (document.activeElement && app.contains(document.activeElement)) document.activeElement.blur();
  const from = screens[fromId],
    to = screens[toId];
  if (render && screenRenderers[toId]) screenRenderers[toId]();
  if (!render && screenResumers[toId]) screenResumers[toId]();
  applyScreenChrome(toId);
  to.classList.add('on');
  const toFront = !(kind === 'back' || kind === 'down');
  to.style.zIndex = toFront ? 3 : 2;
  from.style.zIndex = toFront ? 2 : 3;
  const dur = prefersReducedMotion ? 1 : kind === 'fade' ? 340 : 440,
    easing = 'cubic-bezier(.2,.8,.2,1)';
  const [ai, ao] = TRANSITIONS[kind];
  const a1 = to.animate(ai, { duration: dur, easing }),
    a2 = from.animate(ao, { duration: dur, easing });
  runningTransitions = [a1, a2];
  a1.onfinish = () => {
    if (fromId !== currentScreen()) from.classList.remove('on');
    from.style.zIndex = '';
    to.style.zIndex = '';
  };
}

function applyScreenChrome(id) {
  const m = SCREEN_CHROME[id] || {};
  let sb = m.sb || 'dark';
  if (
    (id === 'dest' && $('#dTop').classList.contains('solid')) ||
    (id === 'trip' && $('#tTop').classList.contains('solid'))
  )
    sb = 'dark';
  app.dataset.sb = sb;
  app.dataset.hb = m.hb || 'dark';
  $('#tabbar').classList.toggle('off', m.tab === undefined);
  if (m.tab !== undefined) $$('#tabbar .tb').forEach((b, i) => b.classList.toggle('on', i === m.tab));
  pauseHeroCarousel(id !== 'home');
}

function navigate(id, kind = 'push') {
  const f = currentScreen();
  if (f === id) return;
  navStack.push({ id, k: kind });
  transitionScreens(f, id, kind);
}

function goBack() {
  if (navStack.length < 2) return;
  const e = navStack.pop();
  transitionScreens(e.id, currentScreen(), REVERSE_TRANSITION[e.k] || 'back', false);
}

function switchTab(id) {
  const f = currentScreen();
  if (f === id && navStack.length === 1) {
    const sc = $('.scroll', screens[id]);
    if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  navStack = [{ id, k: 'fade' }];
  transitionScreens(f, id, 'fade');
}

function resetTo(id, kind = 'fade') {
  const f = currentScreen();
  navStack = [{ id, k: kind }];
  transitionScreens(f, id, kind);
}

const screenRenderers = {},
  screenResumers = {};

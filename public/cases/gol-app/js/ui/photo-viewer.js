'use strict';

const viewer = { open: false, list: [], i: 0, z: 1, tx: 0, ty: 0, title: '', thumbs: null, hinted: false };
const VIEWER_WIDTH = 390,
  VIEWER_HEIGHT = 844,
  VIEWER_GAP = 16,
  VIEWER_EASING = 'cubic-bezier(.2,.9,.25,1)';
if (isTouchDevice) $('#viewer').classList.add('touch');

function viewerPhotoSize(n) {
  const r = (PHOTOS[n] && PHOTOS[n].r) || 0.75;
  let w = VIEWER_WIDTH,
    h = w * r;
  if (h > VIEWER_HEIGHT) {
    h = VIEWER_HEIGHT;
    w = h / r;
  }
  return { w, h };
}

function rectInApp(el) {
  const a = app.getBoundingClientRect(),
    r = el.getBoundingClientRect(),
    k = phoneScale();
  return { x: (r.left - a.left) / k, y: (r.top - a.top) / k, w: r.width / k, h: r.height / k };
}

function currentViewerImage() {
  return $$('#vwTrack .vw-img')[viewer.i];
}

function currentViewerSlide() {
  return $$('#vwTrack .vw-slide')[viewer.i];
}

function animatePhotoFlight(n, from, to, r0, r1, done) {
  const v = $('#viewer'),
    fly = document.createElement('div');
  fly.className = 'vw-fly';
  fly.style.backgroundImage = `url('assets/photos/${n}-s.webp')`;
  fly.innerHTML = `<img src="assets/photos/${n}-l.webp" alt="" draggable="false" onerror="this.remove()">`;
  v.appendChild(fly);
  const k = x => ({ left: x.x + 'px', top: x.y + 'px', width: x.w + 'px', height: x.h + 'px' });
  fly.animate(
    [
      { ...k(from), borderRadius: r0 + 'px' },
      { ...k(to), borderRadius: r1 + 'px' }
    ],
    { duration: 400, easing: VIEWER_EASING, fill: 'forwards' }
  ).onfinish = () => {
    done && done();
    fly.remove();
  };
}

function openPhotoViewer(list, i, src, title, thumbs) {
  if (viewer.open) return;
  Object.assign(viewer, { open: true, list, i, z: 1, tx: 0, ty: 0, title: title || '', thumbs });
  const v = $('#viewer'),
    tr = $('#vwTrack');
  tr.innerHTML = list
    .map((n, k) => {
      const s = viewerPhotoSize(n),
        p = PHOTOS[n];
      return `<div class="vw-slide"><div class="vw-img" style="width:${s.w}px;height:${s.h}px;background-color:${p.c};background-image:url('assets/photos/${n}-s.webp'),url('${p.q}')"><img src="assets/photos/${n}-l.webp" alt="${escapeHtml(viewer.title)}, foto ${k + 1} de ${list.length}" decoding="async" draggable="false" onload="this.classList.add('ok')"></div></div>`;
    })
    .join('');
  $('#vwThumbs').innerHTML =
    list.length > 1
      ? list
          .map(
            (n, k) =>
              `<button style="background-image:url('assets/photos/${n}-s.webp')" onclick="showViewerPhoto(${k})" aria-label="Ver foto ${k + 1}"></button>`
          )
          .join('')
      : '';
  v.setAttribute('aria-label', 'Fotos de ' + viewer.title);
  v.classList.remove('show', 'bare', 'zoomed', 'dragging');
  v.classList.add('on');
  v.setAttribute('aria-hidden', 'false');
  positionViewerTrack(false);
  updateViewerChrome();
  app.dataset.sb = 'light';
  app.dataset.hb = 'light';
  const h = $('#vwHint');
  if (!viewer.hinted) {
    viewer.hinted = true;
    h.textContent = isTouchDevice
      ? 'Toque duas vezes ou use dois dedos pra dar zoom'
      : 'Clique duas vezes pra dar zoom · Esc fecha';
    h.hidden = false;
    h.style.opacity = '';
    setTimeout(() => {
      h.style.opacity = 0;
      setTimeout(() => (h.hidden = true), 450);
    }, 3200);
  } else h.hidden = true;
  const n = list[i],
    s = viewerPhotoSize(n);
  if (src && !prefersReducedMotion) {
    tr.style.opacity = 0;
    animatePhotoFlight(
      n,
      rectInApp(src),
      { x: (VIEWER_WIDTH - s.w) / 2, y: (VIEWER_HEIGHT - s.h) / 2, w: s.w, h: s.h },
      parseFloat(getComputedStyle(src).borderTopLeftRadius) || 0,
      0,
      () => {
        tr.style.opacity = '';
      }
    );
  }
  requestAnimationFrame(() => v.classList.add('show'));
  document.addEventListener('keydown', handleViewerKey);
  setTimeout(() => {
    if (viewer.open) $('#vwClose').focus({ preventScroll: true });
  }, 80);
}

function closePhotoViewer(instant) {
  if (!viewer.open) return;
  viewer.open = false;
  document.removeEventListener('keydown', handleViewerKey);
  const v = $('#viewer'),
    tr = $('#vwTrack'),
    n = viewer.list[viewer.i],
    bg = $('.vw-bg', v);
  const done = () => {
    v.classList.remove('on', 'show', 'bare', 'zoomed', 'dragging');
    v.setAttribute('aria-hidden', 'true');
    tr.innerHTML = '';
    tr.style.opacity = '';
    bg.style.opacity = '';
    bg.style.transition = '';
    $$('.vw-fly', v).forEach(f => f.remove());
    if (currentScreen() && !$('#sheet').classList.contains('on')) applyScreenChrome(currentScreen());
  };
  if (instant || prefersReducedMotion) {
    done();
    return;
  }
  const img = currentViewerImage(),
    from = img ? rectInApp(img) : null;
  let el = viewer.thumbs ? viewer.thumbs()[viewer.i] : null,
    to = el ? rectInApp(el) : null;
  if (to && (to.y + to.h < 40 || to.y > VIEWER_HEIGHT - 40 || to.x + to.w < 0 || to.x > VIEWER_WIDTH))
    to = null;
  bg.style.transition = '';
  bg.style.opacity = '';
  v.classList.remove('show', 'dragging');
  if (from && to) {
    tr.style.opacity = 0;
    animatePhotoFlight(n, from, to, 0, parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, done);
    return;
  }
  const sl = currentViewerSlide();
  (sl || tr).animate(
    [
      { opacity: 1 },
      { opacity: 0, transform: (sl && sl.style.transform ? sl.style.transform + ' ' : '') + 'scale(.94)' }
    ],
    { duration: 240, easing: 'ease-out', fill: 'forwards' }
  ).onfinish = done;
}

function handleViewerKey(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    closePhotoViewer();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    showViewerPhoto(viewer.i + 1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    showViewerPhoto(viewer.i - 1);
  }
}

function positionViewerTrack(anim, dx = 0) {
  const t = $('#vwTrack');
  t.style.transition = anim ? `transform .38s ${VIEWER_EASING}` : 'none';
  t.style.transform = `translate3d(${-viewer.i * (VIEWER_WIDTH + VIEWER_GAP) + dx}px,0,0)`;
}

function updateViewerChrome() {
  const n = viewer.list[viewer.i],
    many = viewer.list.length > 1;
  $('#vwCount').textContent = many ? `${viewer.i + 1} de ${viewer.list.length}` : '';
  $('#vwTitle').textContent = viewer.title;
  $('#vwCredit').textContent = `Foto de ${PHOTOS[n].a} · Unsplash`;
  $$('#vwThumbs button').forEach((b, k) => {
    b.classList.toggle('on', k === viewer.i);
    b.setAttribute('aria-current', k === viewer.i ? 'true' : 'false');
  });
  $('#vwPrev').hidden = !many || viewer.i === 0;
  $('#vwNext').hidden = !many || viewer.i === viewer.list.length - 1;
}

function showViewerPhoto(k) {
  if (!viewer.open) return;
  if (k < 0 || k >= viewer.list.length) {
    positionViewerTrack(true);
    return;
  }
  if (viewer.z > 1) {
    viewer.z = 1;
    viewer.tx = viewer.ty = 0;
    applyViewerZoom(false);
  }
  viewer.i = k;
  positionViewerTrack(true);
  updateViewerChrome();
}

function clampViewerPan() {
  const s = viewerPhotoSize(viewer.list[viewer.i]),
    mx = Math.max(0, (s.w * viewer.z - VIEWER_WIDTH) / 2),
    my = Math.max(0, (s.h * viewer.z - VIEWER_HEIGHT) / 2);
  viewer.tx = Math.max(-mx, Math.min(mx, viewer.tx));
  viewer.ty = Math.max(-my, Math.min(my, viewer.ty));
}

function applyViewerZoom(anim) {
  const el = currentViewerImage();
  if (!el) return;
  el.style.transition = anim ? `transform .32s ${VIEWER_EASING}` : 'none';
  el.style.transform = viewer.z > 1 ? `translate3d(${viewer.tx}px,${viewer.ty}px,0) scale(${viewer.z})` : '';
  $('#viewer').classList.toggle('zoomed', viewer.z > 1);
}

function zoomViewer(z, px, py) {
  if (z > 1) {
    viewer.z = z;
    viewer.tx = (px - VIEWER_WIDTH / 2) * (1 - z);
    viewer.ty = (py - VIEWER_HEIGHT / 2) * (1 - z);
    clampViewerPan();
  } else {
    viewer.z = 1;
    viewer.tx = viewer.ty = 0;
  }
  applyViewerZoom(true);
}

function dragViewerToDismiss(dx, dy) {
  const sl = currentViewerSlide(),
    bg = $('#viewer .vw-bg');
  if (!sl) return;
  const d = Math.max(0, dy),
    s = Math.max(0.72, 1 - d / 1300);
  sl.style.transition = 'none';
  sl.style.transform = `translate3d(${dx * 0.7}px,${dy}px,0) scale(${s})`;
  bg.style.transition = 'none';
  bg.style.opacity = Math.max(0, 1 - d / 450);
  $('#viewer').classList.add('dragging');
}

function resetViewerDrag() {
  const sl = currentViewerSlide(),
    bg = $('#viewer .vw-bg');
  if (sl) {
    sl.style.transition = `transform .32s ${VIEWER_EASING}`;
    sl.style.transform = '';
  }
  bg.style.transition = '';
  bg.style.opacity = '';
  $('#viewer').classList.remove('dragging');
}

(function vwGestures() {
  const st = $('#vwStage'),
    P = new Map();
  let g = null,
    lastTap = 0,
    tapT = null;
  const pt = e => {
    const a = app.getBoundingClientRect(),
      k = phoneScale();
    return { x: (e.clientX - a.left) / k, y: (e.clientY - a.top) / k };
  };
  st.addEventListener('pointerdown', e => {
    if (!viewer.open) return;
    try {
      st.setPointerCapture(e.pointerId);
    } catch {}
    P.set(e.pointerId, pt(e));
    if (P.size === 2) {
      if (g && g.mode === 'dismiss') resetViewerDrag();
      if (g && g.mode === 'swipe') positionViewerTrack(true);
      const [a, b] = [...P.values()];
      g = {
        mode: 'pinch',
        d0: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        z0: viewer.z,
        m0: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        t0: { x: viewer.tx, y: viewer.ty }
      };
      clearTimeout(tapT);
      lastTap = 0;
    } else if (P.size === 1) g = { mode: null, s: pt(e), t: Date.now(), t0: { x: viewer.tx, y: viewer.ty } };
  });
  st.addEventListener('pointermove', e => {
    if (!g || !P.has(e.pointerId)) return;
    P.set(e.pointerId, pt(e));
    if (g.mode === 'pinch') {
      if (P.size < 2) return;
      const [a, b] = [...P.values()],
        d = Math.hypot(a.x - b.x, a.y - b.y),
        m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const z = Math.max(1, Math.min(4, (g.z0 * d) / g.d0)),
        di = {
          x: (g.m0.x - VIEWER_WIDTH / 2 - g.t0.x) / g.z0,
          y: (g.m0.y - VIEWER_HEIGHT / 2 - g.t0.y) / g.z0
        };
      viewer.z = z;
      viewer.tx = m.x - VIEWER_WIDTH / 2 - z * di.x;
      viewer.ty = m.y - VIEWER_HEIGHT / 2 - z * di.y;
      clampViewerPan();
      applyViewerZoom(false);
      return;
    }
    if (g.mode === 'none') return;
    const c = P.get(e.pointerId),
      dx = c.x - g.s.x,
      dy = c.y - g.s.y;
    if (!g.mode) {
      if (Math.hypot(dx, dy) < 8) return;
      g.mode = viewer.z > 1 ? 'pan' : Math.abs(dx) > Math.abs(dy) ? 'swipe' : dy > 0 ? 'dismiss' : 'none';
      clearTimeout(tapT);
      lastTap = 0;
    }
    if (g.mode === 'pan') {
      viewer.tx = g.t0.x + dx;
      viewer.ty = g.t0.y + dy;
      clampViewerPan();
      applyViewerZoom(false);
    } else if (g.mode === 'swipe') {
      const edge = (viewer.i === 0 && dx > 0) || (viewer.i === viewer.list.length - 1 && dx < 0);
      positionViewerTrack(false, edge ? dx / 3 : dx);
    } else if (g.mode === 'dismiss') dragViewerToDismiss(dx, dy);
  });
  const up = e => {
    if (!P.has(e.pointerId)) return;
    const c = pt(e);
    P.delete(e.pointerId);
    if (!g) return;
    if (g.mode === 'pinch') {
      if (!P.size) {
        if (viewer.z < 1.08) {
          viewer.z = 1;
          viewer.tx = viewer.ty = 0;
        }
        clampViewerPan();
        applyViewerZoom(true);
        g = null;
      }
      return;
    }
    if (P.size) return;
    const m = g.mode,
      dx = c.x - g.s.x,
      dy = c.y - g.s.y,
      dt = Math.max(1, Date.now() - g.t);
    g = null;
    if (e.type === 'pointercancel') {
      if (m === 'swipe') positionViewerTrack(true);
      else if (m === 'dismiss') resetViewerDrag();
      return;
    }
    if (m === 'swipe') {
      const sp = dx / dt;
      if (dx < -70 || (dx < -24 && sp < -0.5)) showViewerPhoto(viewer.i + 1);
      else if (dx > 70 || (dx > 24 && sp > 0.5)) showViewerPhoto(viewer.i - 1);
      else positionViewerTrack(true);
      return;
    }
    if (m === 'dismiss') {
      if (dy > 110 || (dy > 40 && dy / dt > 0.6)) closePhotoViewer();
      else resetViewerDrag();
      return;
    }
    if (m) return;
    const now = Date.now();
    if (now - lastTap < 300) {
      clearTimeout(tapT);
      lastTap = 0;
      zoomViewer(viewer.z > 1 ? 1 : 2.5, c.x, c.y);
      return;
    }
    lastTap = now;
    clearTimeout(tapT);
    tapT = setTimeout(() => {
      lastTap = 0;
      if (viewer.open) $('#viewer').classList.toggle('bare');
    }, 300);
  };
  st.addEventListener('pointerup', up);
  st.addEventListener('pointercancel', up);
  st.addEventListener('dragstart', e => e.preventDefault());
})();

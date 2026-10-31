'use strict';

const BASE_FARES = {
  SSA: 329,
  GIG: 199,
  SDU: 209,
  FLN: 159,
  FEN: 645,
  EZE: 429,
  IGU: 219,
  JJD: 489,
  MCZ: 389,
  GRU: 179,
  CGH: 189,
  BSB: 249,
  CNF: 239,
  CWB: 149,
  REC: 399,
  FOR: 449,
  NAT: 419,
  MVD: 389,
  SCL: 589
};

function distanceKm(a, b) {
  const A = AIRPORTS[a],
    B = AIRPORTS[b],
    r = Math.PI / 180;
  const x =
    Math.sin(((B.la - A.la) * r) / 2) ** 2 +
    Math.cos(A.la * r) * Math.cos(B.la * r) * Math.sin(((B.lo - A.lo) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
}

const flightMinutes = (a, b) => Math.round((distanceKm(a, b) / 790) * 60 + 24);

function baseFare(o, d) {
  const k = o === 'POA' ? d : d === 'POA' ? o : null;
  if (k && BASE_FARES[k]) return BASE_FARES[k];
  return Math.round(110 + distanceKm(o, d) * 0.16);
}

function routeInfo(o, d) {
  if (distanceKm(o, d) < 1900) return { hub: null };
  let hub = null,
    best = 1e9;
  for (const h of ['GRU', 'BSB', 'REC']) {
    if (h === o || h === d) continue;
    const t = distanceKm(o, h) + distanceKm(h, d);
    if (t < best) {
      best = t;
      hub = h;
    }
  }
  if (o === 'FEN' || d === 'FEN') hub = 'REC';
  return {
    hub,
    seasonal: ['POA-SSA', 'SSA-POA', 'POA-REC', 'REC-POA', 'POA-FOR', 'FOR-POA'].includes(o + '-' + d)
  };
}

function dayPriceFactor(o, d, date) {
  let f = [1.14, 0.96, 0.9, 0.92, 1.03, 1.21, 0.98][date.getDay()];
  f *= 0.92 + hashString(o + d + date.toDateString()) * 0.18;
  const n = daysBetween(date, TODAY);
  if (n < 4) f *= 1.28;
  else if (n < 8) f *= 1.12;
  const rio = (o === 'POA' && (d === 'GIG' || d === 'SDU')) || (d === 'POA' && (o === 'GIG' || o === 'SDU'));
  if (rio && date >= new Date(2026, 11, 1) && date <= new Date(2026, 11, 15)) f *= 0.65;
  return f;
}

const roundFare = v => Math.max(89, Math.round(v / 10) * 10 - 1);
const DEPARTURE_SLOTS = [
  [6, 10],
  [8, 45],
  [11, 30],
  [14, 20],
  [17, 55],
  [21, 5]
];
const SLOT_PRICE_FACTORS = [1, 1.17, 1.08, 1.12, 1.3, 1.04];
const flightCache = new Map();

function flightsFor(o, d, date) {
  const key = o + d + date.toDateString();
  if (flightCache.has(key)) return flightCache.get(key);
  const r = routeInfo(o, d),
    b = baseFare(o, d) * dayPriceFactor(o, d, date),
    out = [];
  DEPARTURE_SLOTS.forEach((s, i) => {
    const direct = !r.hub || (r.seasonal && i === 1);
    let du,
      via = null,
      lay = 0,
      l1 = 0;
    if (direct) du = flightMinutes(o, d);
    else {
      l1 = flightMinutes(o, r.hub);
      lay = 50 + Math.round(hashString(o + d + i + 'l') * 14) * 5;
      du = l1 + lay + flightMinutes(r.hub, d);
      via = r.hub;
    }
    const dep = s[0] * 60 + s[1] + Math.round(hashString(o + d + i) * 4) * 5 - 10;
    out.push({
      i,
      o,
      d,
      date: new Date(date),
      dep,
      arr: dep + du,
      dur: du,
      via,
      lay,
      l1,
      price: roundFare(b * SLOT_PRICE_FACTORS[i] * (direct && r.hub ? 1.12 : 1)),
      num: 'G3 ' + (1000 + Math.floor(hashString(o + d + i + 'n') * 8999)),
      ac: hashString(o + d + i + 'a') > 0.45 ? 'Boeing 737 MAX 8' : 'Boeing 737-800',
      left:
        hashString(o + d + date.getDate() + 'x' + i) < 0.16
          ? 2 + Math.floor(hashString(o + i + date.getDate()) * 3)
          : 0
    });
  });
  flightCache.set(key, out);
  return out;
}

const cheapestFare = (o, d, date) => Math.min(...flightsFor(o, d, date).map(f => f.price));
const bestDealCache = new Map();

function bestDeal(code, p) {
  const useWin = p && p.win && daysBetween(p.win[0], TODAY) >= 2;
  const key = code + (useWin ? 'w' : '');
  if (bestDealCache.has(key)) return bestDealCache.get(key);
  const a = useWin ? p.win[0] : addDays(TODAY, 3),
    b = useWin ? p.win[1] : addDays(TODAY, 45);
  let best = { price: 1e9, date: a };
  for (let d = new Date(a); d <= b; d = addDays(d, 1)) {
    const v = cheapestFare('POA', code, d) + cheapestFare(code, 'POA', addDays(d, 3));
    if (v < best.price) best = { price: v, date: new Date(d) };
  }
  bestDealCache.set(key, best);
  return best;
}

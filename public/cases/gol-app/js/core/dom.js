'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $('#app');
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = matchMedia('(pointer: coarse)').matches;

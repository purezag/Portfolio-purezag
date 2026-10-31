'use strict';

function markTourStep(k) {
  const li = $(`#tour li[data-k="${k}"]`);
  if (li) li.classList.add('done');
}

function runTourStep(k) {
  if (currentScreen() === 'splash') return;
  closeSheet();
  if (k === 'promo') {
    switchTab('home');
    setTimeout(() => $('#homeScroll').scrollTo({ top: 150, behavior: 'smooth' }), 350);
  } else if (k === 'buy') openSearch();
  else if (k === 'checkin') startCheckIn();
  else if (k === 'pass') switchTab('pass');
  else if (k === 'miles') {
    const i = milesSuggestion();
    if (i) openDestination(i.code, { miles: true });
  } else if (k === 'chat') openChat();
  else if (k === 'profile') {
    switchTab('account');
    setTimeout(() => navigate('me'), 380);
  } else if (k === 'dark') setTheme(app.dataset.theme === 'dark' ? 'light' : 'dark');
}

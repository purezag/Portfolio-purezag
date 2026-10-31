'use strict';

let checkInTarget = null;

function startCheckIn(id, li) {
  if (!id) {
    const c =
      upcomingLegs().find(x => canCheckIn(x.l) && !x.l.checked) || upcomingLegs().find(x => canCheckIn(x.l));
    if (!c) {
      showToast('Nenhum voo com check-in aberto agora', 'clock');
      return;
    }
    id = c.t.id;
    li = c.li;
  }
  const t = trips.find(x => x.id === id),
    l = t.legs[li];
  if (!canCheckIn(l)) {
    showToast('O check-in abre 48 horas antes do voo', 'clock');
    return;
  }
  if (l.checked) {
    openBoardingPass(id, li);
    return;
  }
  checkInTarget = { id, li, done: false };
  openSheet('checkin');
}

function confirmCheckIn(btn) {
  const decl = $('#ckDecl');
  if (!decl.checked) {
    const r = decl.closest('.ckrow');
    r.classList.remove('err');
    void r.offsetWidth;
    r.classList.add('err');
    showToast('Confirme a declaração pra seguir', 'info');
    return;
  }
  btn.classList.add('busy');
  btn.innerHTML = '<span class="spin"></span>';
  setTimeout(
    () => {
      const t = trips.find(x => x.id === checkInTarget.id),
        l = t.legs[checkInTarget.li];
      const occ = occupiedSeats(l);
      let r = 9;
      t.pax.forEach((p, pi) => {
        if (!l.seats[pi]) {
          while (['A', 'B', 'C', 'D', 'E', 'F'].every(c => occ.has(r + c))) r++;
          l.seats[pi] = ['A', 'B', 'C', 'D', 'E', 'F']
            .map(c => r + c)
            .find(id => !occ.has(id) && !l.seats.includes(id));
        }
      });
      l.checked = true;
      l.gate = String(3 + Math.floor(hashString(l.num + 'g') * 12));
      l.group = l.fare === 2 ? '1' : l.fare === 1 ? '2' : '4';
      l.board = l.dep - 40;
      notifications.unshift({
        ic: 'checkin',
        t: `Portão ${l.gate} confirmado`,
        s: `Embarque às ${formatTime(l.board)} pro voo ${l.num}.`,
        when: 'agora'
      });
      notifications = notifications.filter(n => n.t !== 'Check-in aberto');
      hasUnread = true;
      checkInTarget.done = true;
      markTourStep('checkin');
      $('#shBody').innerHTML = sheetTemplates.checkin();
      const tp = currentScreen();
      if (tp === 'home') updateHome();
      if (tp === 'trip') screenRenderers.trip();
      if (tp === 'trips') screenRenderers.trips();
      if (tp === 'pass') {
        passFocus = { id: checkInTarget.id, li: checkInTarget.li, unlock: true };
        screenRenderers.pass();
      }
    },
    prefersReducedMotion ? 50 : 1100
  );
}

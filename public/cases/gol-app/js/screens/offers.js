'use strict';

let offerCategory = 0;
const OFFER_CATEGORIES = ['Todos', 'Praia', 'Cidade', 'Natureza', 'Internacional'];

screenRenderers.offers = function () {
  const list = FEATURED_DESTINATIONS.filter(
    c => offerCategory === 0 || DESTINATIONS[c].cat === OFFER_CATEGORIES[offerCategory]
  );
  $('#offersBody').innerHTML =
    `<div class="chips" style="padding-top:12px">${OFFER_CATEGORIES.map((c, i) => `<button class="chip ${i === offerCategory ? 'on' : ''}" onclick="offerCategory=${i};screenRenderers.offers()">${c}</button>`).join('')}</div>
  <div class="olist rise">${list
    .map(
      c => `<button class="ocard" onclick="openDestination('${c}')">${photoMarkup(DESTINATIONS[c].card, 'l')}<span class="pill glass oc-cat">${DESTINATIONS[c].cat}</span>
    <div class="oc-tx"><b>${DESTINATIONS[c].name}</b><span>${DESTINATIONS[c].where}</span></div><div class="oc-p"><small>a partir de</small><b>${formatCurrency(bestDeal(c).price)}</b></div></button>`
    )
    .join('')}</div>`;
};

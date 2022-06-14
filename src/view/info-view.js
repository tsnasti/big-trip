import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const CITIES_COUNT = 3;

const addPointName = (points) => {
  if (points.length >= CITIES_COUNT) {
    return '... &mdash';
  }
  return '';
};

const getTotalCostValue = (points, offers) => {
  let totalCost = 0;
  if (points.length !== 0) {
    points.forEach((point) => {
      totalCost += point.basePrice;

      const offersByType = offers.find((offer) => offer.type === point.type);
      const offersById = offersByType.offers.filter((offer) => point.offers.includes(offer.id));
      offersById.forEach((offer) => {
        totalCost += offer.price;
      });
    });
  }
  return totalCost;
};

const createInfoTemplate = (points, offers) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${points[0].destination.name} &mdash; ${addPointName(points)}; ${points[points.length-1].destination.name}</h1>
      <p class="trip-info__dates">${dayjs(points[0].dateFrom).format('MMM D')}&nbsp;&mdash;&nbsp;${dayjs(points[points.length-1].dateTo).format('MMM D')}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalCostValue(points, offers)}</span>
    </p>
  </section>`
);

export default class InfoView extends AbstractView {
  #points = [];
  #offers = [];

  constructor(points, offers) {
    super();
    this.#points = points;
    this.#offers = offers;
  }

  get template() {
    return createInfoTemplate(this.#points,  this.#offers);
  }
}

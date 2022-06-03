import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../utils/filter.js';

const noPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createNoPointsTemplate = (filterType) => {
  const noPointTextValue = noPointsTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${noPointTextValue}
    </p>`);
};

export default class NoPointsView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}

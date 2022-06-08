import Observable from '../framework/observable.js';

export default class OfferModel extends Observable {
  #offersApiService = null;
  #offers = [];

  constructor(offersApiService) {
    super();
    this.#offersApiService = offersApiService;
  }

  init = async () => {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch (err) {
      this.#offers = [];
    }
    window.console.log(this.offers);
  };

  get offers() {
    return this.#offers;
  }
}

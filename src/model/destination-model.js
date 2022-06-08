import Observable from '../framework/observable.js';

export default class DestinationModel extends Observable {
  #destinationsApiService = null;
  #destination = [];

  constructor(destinationsApiService) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  init = async () => {
    try {
      this.#destination = await this.#destinationsApiService.destinations;
    } catch (err) {
      this.#destination = [];
    }

    window.console.log(this.destination);
  };

  get destination() {
    return this.#destination;
  }
}

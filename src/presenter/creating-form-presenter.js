import {render, remove, RenderPosition} from '../framework/render.js';
import CreatingFormView from '../view/creating-form-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class CreatingFormPresenter {
  #pointListContainer = null;
  #changeData = null;
  #creatingFormComponent = null;
  #destroyCallback = null;
  #offerModel = null;
  #destinationModel = null;

  #offers = [];
  #destinations = [];

  constructor(pointListContainer, changeData, offerModel, destinationModel) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;
    this.#offers = this.#offerModel.offers;
    this.#destinations = this.#destinationModel.destination;

    if (this.#creatingFormComponent !== null) {
      return;
    }

    this.#creatingFormComponent = new CreatingFormView(this.#offers, this.#destinations);
    this.#creatingFormComponent.setCreatingFormSubmitHandler(this.#handleFormSubmit);
    this.#creatingFormComponent.setFormDeleteHandler(this.#handleDeleteClick);

    render(this.#creatingFormComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#creatingFormComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#creatingFormComponent);
    this.#creatingFormComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#creatingFormComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#creatingFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#creatingFormComponent.shake(resetFormState);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

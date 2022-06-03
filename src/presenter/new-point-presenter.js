import {render, remove, RenderPosition} from '../framework/render.js';
import CreatingFormView from '../view/creating-form-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType} from '../const.js';

export default class CreatingFormPresenter {
  #pointListContainer = null;
  #changeData = null;
  #creatingFormComponent = null;
  #destroyCallback = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#creatingFormComponent !== null) {
      return;
    }

    this.#creatingFormComponent = new CreatingFormView();
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

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
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

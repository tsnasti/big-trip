import {render, replace, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import WaypointView from '../view/waypoint-view.js';
import EditFormView from '../view/edit-form-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #tripPointContainer = null;
  #changeData = null;
  #changeMode = null;

  #waypointComponent = null;
  #editPointComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor(tripPointContainer, changeData, changeMode) {
    this.#tripPointContainer = tripPointContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#waypointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#waypointComponent = new WaypointView(point);
    this.#editPointComponent = new EditFormView(point);

    this.#waypointComponent.setClickHandler(this.#handleEditClick);
    this.#waypointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setFormClickHandler(this.#handleFormClick);
    this.#editPointComponent.setFormDeleteHandler(this.#handleDeleteClick);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#waypointComponent, this.#tripPointContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  };

  destroy = () => {
    remove(this.#waypointComponent);
    remove(this.#editPointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#waypointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
    this.#editPointComponent.reset(this.#point);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
    this.#replaceFormToPoint();
  };

  #handleFormClick = () => {
    this.#replaceFormToPoint();
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}

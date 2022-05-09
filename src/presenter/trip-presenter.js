import CreatingFormView from '../view/creating-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import {render} from '../render.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointModel = null;
  #eventPoints = null;

  init = (tripContainer, PointModel) => {
    this.#tripContainer = tripContainer;
    this.#pointModel = PointModel;
    this.#eventPoints = [...this.#pointModel.points];

    window.console.log(this.#eventPoints);

    render(new CreatingFormView(this.#eventPoints[0]), this.#tripContainer);

    for (let i = 0; i < this.#eventPoints.length; i++) {
      this.#renderPoint(this.#eventPoints[i]);
    }
  };

  #renderPoint = (point) => {
    const pointComponent = new WaypointView(point);
    const editPointComponent = new EditFormView(point);

    const replacePointToForm = () => {
      this.#tripContainer.replaceChild(editPointComponent.element, pointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#tripContainer.replaceChild(pointComponent.element, editPointComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.addEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#tripContainer);
  };
}

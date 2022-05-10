import InfoView from '../view/info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import CreatingFormView from '../view/creating-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render} from '../render.js';
import {RenderPosition} from '../render.js';

export default class TripPresenter {
  #headerContainer = null;
  #tripContainer = null;
  #pointModel = null;
  #eventPoints = null;

  constructor(headerContainer, tripContainer, PointModel) {
    this.#headerContainer = headerContainer;
    this.#tripContainer = tripContainer;
    this.#pointModel = PointModel;
  }

  init = () => {
    this.#eventPoints = [...this.#pointModel.points];

    this.#renderPage();
  };

  #renderPoint = (point) => {
    const pointComponent = new WaypointView(point);
    const editPointComponent = new EditFormView(point);

    const replaceElement = (container, oldElement, newElement) => {
      container.replaceChild(oldElement.element, newElement.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceElement(this.#tripContainer, pointComponent, editPointComponent);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceElement(this.#tripContainer, editPointComponent, pointComponent);
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceElement(this.#tripContainer, pointComponent, editPointComponent);
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceElement(this.#tripContainer, pointComponent, editPointComponent);
      document.addEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#tripContainer);
  };

  #renderPage = () => {
    render(this.#headerContainer, this.#tripContainer, this.#pointModel);

    render(new FilterView(), this.#headerContainer, RenderPosition.AFTEREND);

    if (this.#eventPoints.length === 0 ) {
      render(new NoPointsView(), this.#tripContainer);

    } else {
      render(new InfoView(), this.#headerContainer, RenderPosition.BEFOREBEGIN);
      render(new SortView(), this.#tripContainer);
      render(new CreatingFormView(this.#eventPoints[0]), this.#tripContainer);
    }

    for (let i = 0; i < this.#eventPoints.length; i++) {
      this.#renderPoint(this.#eventPoints[i]);
    }
  };
}

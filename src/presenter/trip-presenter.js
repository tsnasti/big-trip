import InfoView from '../view/info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import CreatingFormView from '../view/creating-form-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render} from '../framework/render.js';
import {RenderPosition} from '../framework/render.js';
import PointPresenter from '../presenter/point-presenter.js';
import {updateItem} from '../mock/util.js';

export default class TripPresenter {
  #headerContainer = null;
  #tripContainer = null;
  #pointModel = null;
  #eventPoints = null;

  #infoComponent = new InfoView();
  #filterComponent = new FilterView();
  #sortComponent = new SortView();
  #noPointsComponent = new NoPointsView();

  #pointPresenter = new Map();

  constructor(headerContainer, tripContainer, PointModel) {
    this.#headerContainer = headerContainer;
    this.#tripContainer = tripContainer;
    this.#pointModel = PointModel;
  }

  init = () => {
    this.#eventPoints = [...this.#pointModel.points];

    this.#renderPage();
    window.console.log(this.#eventPoints);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    updateItem(this.#eventPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderInfo = () => {
    render(this.#infoComponent, this.#headerContainer, RenderPosition.BEFOREBEGIN);
  };

  #renderFilter = () => {
    render(this.#filterComponent, this.#headerContainer, RenderPosition.AFTEREND);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#tripContainer);
  };

  #renderCreatingForm = (point) => {
    const creatingFormComponent = new CreatingFormView(point);
    render(creatingFormComponent, this.#tripContainer);
  };

  #renderNoPoints = () => {
    render(this.#noPointsComponent, this.#tripContainer);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripContainer, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderPage = () => {
    this.#renderFilter();

    if (this.#eventPoints.length === 0 ) {
      this.#renderNoPoints();

    } else {
      this.#renderInfo();
      this.#renderSort();
      this.#renderCreatingForm(this.#eventPoints[0]);
    }

    for (let i = 0; i < this.#eventPoints.length; i++) {
      this.#renderPoint(this.#eventPoints[i]);
    }
  };
}

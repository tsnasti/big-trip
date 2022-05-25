import InfoView from '../view/info-view.js';
import SortView from '../view/sort-view.js';
import CreatingFormView from '../view/creating-form-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render} from '../framework/render.js';
import {RenderPosition} from '../framework/render.js';
import PointPresenter from '../presenter/point-presenter.js';
import {updateItem} from '../mock/util.js';
import {SortType, comparePrice, compareDuration} from '../utils/sort.js';

export default class TripPresenter {
  #headerContainer = null;
  #tripContainer = null;
  #pointModel = null;
  #eventPoints = null;

  #infoComponent = new InfoView();
  #sortComponent = new SortView();
  #noPointsComponent = new NoPointsView();
  #creatingFormComponent = null;

  #pointPresenter = new Map();

  #currentSortType = SortType.DAY;
  #sourcedPagePoints = [];

  constructor(headerContainer, tripContainer, PointModel) {
    this.#headerContainer = headerContainer;
    this.#tripContainer = tripContainer;
    this.#pointModel = PointModel;
  }

  init = () => {
    this.#eventPoints = [...this.#pointModel.points];
    this.#sourcedPagePoints = [...this.#pointModel.points];

    this.#renderPage();
    window.console.log(this.#eventPoints);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    updateItem(this.#eventPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
    this.#sourcedPagePoints = updateItem(this.#sourcedPagePoints, updatedPoint);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.TIME:
        this.#eventPoints.sort(compareDuration);
        break;
      case SortType.PRICE:
        this.#eventPoints.sort(comparePrice);
        break;
      default:
        this.#eventPoints = [...this.#sourcedPagePoints];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this. #renderListPoints(this.#eventPoints);
  };

  #renderInfo = () => {
    render(this.#infoComponent, this.#headerContainer, RenderPosition.BEFOREBEGIN);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#tripContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderCreatingForm = (point) => {
    let creatingFormComponent = new CreatingFormView(point);
    render(creatingFormComponent, this.#tripContainer);
    creatingFormComponent = this.#creatingFormComponent;
  };

  #renderNoPoints = () => {
    render(this.#noPointsComponent, this.#tripContainer);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripContainer, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderListPoints = (points) => {
    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(points[i]);
    }
  };

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderPage = () => {

    if (this.#eventPoints.length === 0 ) {
      this.#renderNoPoints();

    } else {
      this.#renderInfo();
      this.#renderSort();
      //this.#renderCreatingForm(this.#eventPoints[0]);
      this.#renderListPoints(this.#eventPoints);
    }
  };
}

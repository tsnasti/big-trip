import InfoView from '../view/info-view.js';
import SortView from '../view/sort-view.js';
import NoPointsView from '../view/no-points-view.js';
import PointPresenter from '../presenter/point-presenter.js';
import CreatingFormPresenter from '../presenter/new-point-presenter.js';
import {render, remove} from '../framework/render.js';
import {RenderPosition} from '../framework/render.js';
import {SortType, comparePrice, compareDuration} from '../utils/sort.js';
import {UserAction, UpdateType} from '../const.js';
import {filter, FilterType} from '../utils/filter.js';

const POINT_COUNT = 5;

export default class TripPresenter {
  #headerContainer = null;
  #tripContainer = null;
  #pointModel = null;
  #filterModel = null;

  #infoComponent = new InfoView();
  #noPointsComponent = null;
  #sortComponent = null;
  #pointCount = null;
  #renderedPointsCount = POINT_COUNT;

  #pointPresenter = new Map();
  #creatingFormPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor(headerContainer, tripContainer, pointModel, filterModel) {
    this.#headerContainer = headerContainer;
    this.#tripContainer = tripContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
    this.#creatingFormPresenter = new CreatingFormPresenter(this.#tripContainer, this.#handleViewAction);

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(compareDuration);
      case SortType.PRICE:
        return filteredPoints.sort(comparePrice);
    }

    return filteredPoints;
  }

  init = () => {
    this.#renderPage();
    window.console.log(this.points);
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#creatingFormPresenter.init(callback);
  };

  #handleModeChange = () => {
    this.#creatingFormPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.#renderPage();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsList({resetRenderedPointCount: true, resetSortType: true});
        this.#renderPage();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointsList({resetRenderedPointCount: true});
    this.#renderPage();
  };

  #renderInfo = () => {
    render(this.#infoComponent, this.#headerContainer, RenderPosition.BEFOREBEGIN);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#tripContainer, RenderPosition.BEFOREBEGIN);
  };

  #renderNoPoints = () => {
    this.#noPointsComponent = new NoPointsView(this.#filterType);
    render(this.#noPointsComponent, this.#tripContainer);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripContainer, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderListPoints = (points) => {
    this.#pointCount = this.points.length;
    for (let i = 0; i < this.#pointCount; i++) {
      this.#renderPoint(points[i]);
    }
  };

  #clearPointsList = ({resetRenderedPointCount = false, resetSortType = false} = {}) => {
    this.#pointCount = this.points.length;

    this.#creatingFormPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetRenderedPointCount) {
      this.#renderedPointsCount = POINT_COUNT;
    } else {
      this.#renderedPointsCount = Math.min(this.#pointCount, this.#renderedPointsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderPage = () => {
    this.#pointCount = this.points.length;
    if (this.#pointCount === 0 ) {
      this.#renderNoPoints();

    } else {
      this.#renderInfo();
      this.#renderSort();
      this.#renderListPoints(this.points);
    }
  };
}

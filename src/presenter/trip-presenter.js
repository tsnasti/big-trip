import InfoView from '../view/info-view.js';
import SortView from '../view/sort-view.js';
import NoPointsView from '../view/no-points-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from '../presenter/point-presenter.js';
import CreatingFormPresenter from '../presenter/creating-form-presenter.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {SortType, comparePrice, compareDuration} from '../utils/sort.js';
import {UserAction, UpdateType} from '../const.js';
import {filter, FilterType} from '../utils/filter.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #headerContainer = null;
  #tripContainer = null;
  #pointModel = null;
  #offerModel = null;
  #filterModel = null;
  #destinationModel = null;

  #infoComponent = new InfoView();
  #noPointsComponent = null;
  #sortComponent = null;
  #loadingComponent = new LoadingView();

  #pointCount = null;

  #pointPresenter = new Map();
  #creatingFormPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(headerContainer, tripContainer, pointModel, filterModel, offerModel, destinationModel) {
    this.#headerContainer = headerContainer;
    this.#tripContainer = tripContainer;
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
    this.#filterModel = filterModel;
    this.#creatingFormPresenter = new CreatingFormPresenter(this.#tripContainer, this.#handleViewAction, this.#offerModel, this.#destinationModel);

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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#creatingFormPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch(err) {
          this.#creatingFormPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripContainer);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripContainer, this.#handleViewAction, this.#handleModeChange, this.#offerModel, this.#destinationModel);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderListPoints = (points) => {
    this.#pointCount = this.points.length;
    for (let i = 0; i < this.#pointCount; i++) {
      this.#renderPoint(points[i]);
    }
  };

  #clearPointsList = ({resetSortType = false} = {}) => {
    this.#pointCount = this.points.length;

    this.#creatingFormPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderPage = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
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

import InfoView from './view/info-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import {render} from './render.js';
import {RenderPosition} from './render.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointModel from './model/point-model.js';

const tripHeaderElement = document.querySelector('.trip-main');
const tripFilterElement = tripHeaderElement.querySelector('.trip-controls__filters');

const tripMainElement = document.querySelector('.page-main');
const tripEventsElement = tripMainElement.querySelector('.trip-events');

const tripPresenter = new TripPresenter();
const pointModel = new PointModel();

render(new InfoView(), tripHeaderElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), tripFilterElement);
render(new SortView(), tripEventsElement);
tripPresenter.init(tripEventsElement, pointModel);

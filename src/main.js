import TripPresenter from './presenter/trip-presenter.js';
import PointModel from './model/point-model.js';
import FilterView from '../src/view/filter-view.js';
import {render} from './framework/render.js';
import {generateFilter} from '../src/mock/filter.js';

const tripHeaderElement = document.querySelector('.trip-main');
const tripFilterElement = tripHeaderElement.querySelector('.trip-controls__filters');

const tripMainElement = document.querySelector('.page-main');
const tripEventsElement = tripMainElement.querySelector('.trip-events');

const pointModel = new PointModel();
const tripPresenter = new TripPresenter(tripFilterElement, tripEventsElement, pointModel);

tripPresenter.init();

export {pointModel};

const filters = generateFilter(pointModel.points);

render(new FilterView(filters), tripFilterElement);


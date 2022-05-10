import TripPresenter from './presenter/trip-presenter.js';
import PointModel from './model/point-model.js';

const tripHeaderElement = document.querySelector('.trip-main');
const tripFilterElement = tripHeaderElement.querySelector('.trip-controls__filters');

const tripMainElement = document.querySelector('.page-main');
const tripEventsElement = tripMainElement.querySelector('.trip-events');

const pointModel = new PointModel();
const tripPresenter = new TripPresenter(tripFilterElement, tripEventsElement, pointModel);

tripPresenter.init();

import TripPresenter from './presenter/trip-presenter.js';
import PointModel from './model/point-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';

const tripHeaderElement = document.querySelector('.trip-main');
const tripFilterElement = tripHeaderElement.querySelector('.trip-controls__filters');
const newEventButton = tripHeaderElement.querySelector('.trip-main__event-add-btn');

const tripMainElement = document.querySelector('.page-main');
const tripEventsElement = tripMainElement.querySelector('.trip-events');

const pointModel = new PointModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(tripFilterElement, tripEventsElement, pointModel, filterModel);
const filterPresenter = new FilterPresenter(tripFilterElement, filterModel, pointModel);

const handleNewEventFormClose = () => {
  newEventButton.disabled = false;
};

const handleNewEventButtonClick = (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint(handleNewEventFormClose);
  newEventButton.disabled = true;
};

newEventButton.addEventListener('click', handleNewEventButtonClick);

filterPresenter.init();
tripPresenter.init();

export {pointModel};

import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';
import FilterModel from './model/filter-model.js';
import PointApiService from './service/points-api-service.js';
import OffersApiService from './service/offers-api-service.js';
import DestinationsApiService from './service/destination-api-servise.js';

const AUTHORIZATION = 'Basic rPo5kLmea6932nF';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

const tripHeaderElement = document.querySelector('.trip-main');
const tripFilterElement = document.querySelector('.trip-main__trip-controls');
const newEventButtonElement = tripHeaderElement.querySelector('.trip-main__event-add-btn');

const tripMainElement = document.querySelector('.page-main');
const tripEventsElement = tripMainElement.querySelector('.trip-events');

const pointModel = new PointModel(new PointApiService(END_POINT, AUTHORIZATION));
const offerModel = new OfferModel(new OffersApiService(END_POINT, AUTHORIZATION));
const destinationModel = new DestinationModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(tripHeaderElement, tripEventsElement, pointModel, filterModel, offerModel, destinationModel);
const filterPresenter = new FilterPresenter(tripFilterElement, filterModel, pointModel);

const handleNewEventFormClose = () => {
  newEventButtonElement.disabled = false;
};

const handleNewEventButtonClick = (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint(handleNewEventFormClose);
  newEventButtonElement.disabled = true;
};

filterPresenter.init();
tripPresenter.init();

offerModel.init()
  .then(() => destinationModel.init())
  .then(() => pointModel.init()
    .finally(() => {
      newEventButtonElement.addEventListener('click', handleNewEventButtonClick);
    }));

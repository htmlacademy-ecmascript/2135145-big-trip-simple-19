import ClientApiService from './api/client-api-service.js';
import {render} from './framework/render.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import NewEventButtonView from './view/new-event-button-view.js';

const AUTHORIZATION = 'Basic hj4hj43j234hbj234';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple';
const clientApiService = new ClientApiService(END_POINT, AUTHORIZATION);

const mainContainer = document.querySelector('.trip-main');
const filtersContainer = mainContainer.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel({
  clientApiService,
});
const destinationsModel = new DestinationsModel({
  clientApiService,
});
const offersModel = new OffersModel({
  clientApiService,
});
const filterModel = new FilterModel();
const tripPresenter = new TripPresenter({
  contentContainer: tripContainer,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});

const newEventButtonComponent = new NewEventButtonView({
  onClick: handleNewEventButtonClick,
});

function handleNewEventButtonClick() {
  tripPresenter.createPoint();
  newEventButtonComponent.element.disabled = true;
}

function handleNewPointFormClose() {
  newEventButtonComponent.element.disabled = false;
}

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel,
  pointsModel,
});

filterPresenter.init();

Promise.all([
  destinationsModel.init(),
  offersModel.init(),
]).finally(() => {
  pointsModel.init();
  render(newEventButtonComponent, mainContainer);
});



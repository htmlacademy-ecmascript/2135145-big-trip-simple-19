import {render} from './framework/render.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from "./presenter/filter-presenter";
import TripPresenter from './presenter/trip-presenter.js';
import NewEventButtonView from "./view/new-event-button-view";

const mainContainer = document.querySelector('.trip-main');
const filtersContainer = mainContainer.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();
const tripPresenter = new TripPresenter({
  contentContainer: tripContainer,
  pointsModel,
  destinationsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});

function handleNewEventButtonClick() {
  tripPresenter.createPoint();
  newEventButtonComponent.element.disabled = true;
}

function handleNewPointFormClose() {
  newEventButtonComponent.element.disabled = false;
}


const newEventButtonComponent = new NewEventButtonView({
  onClick: handleNewEventButtonClick,
});


const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel,
  pointsModel,
});

filterPresenter.init();
tripPresenter.init();
render(newEventButtonComponent, mainContainer);

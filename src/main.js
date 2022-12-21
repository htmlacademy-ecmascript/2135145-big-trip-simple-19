import DestinationsModel from './model/destinations-model.js';
import PointsModel from './model/points-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import {render} from './render.js';
import FiltersView from './view/filters-view.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter(tripContainer);
const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();

render(new FiltersView(), filtersContainer);

tripPresenter.init(pointsModel, destinationsModel);

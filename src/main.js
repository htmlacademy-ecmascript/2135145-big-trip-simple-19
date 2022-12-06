import TripPresenter from './presenter/trip-presenter.js';
import {render} from './render.js';
import FiltersView from './view/filters-view.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter(tripContainer);

render(new FiltersView(), filtersContainer);

tripPresenter.init();

import {FilterType, UpdateType} from '../const.js';
import Observable from '../framework/observable.js';
import {remove, render, replace} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';

export default class FilterPresenter extends Observable {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;


  constructor({filterContainer, filterModel, pointsModel}) {
    super();
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return Object.values(FilterType);
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView({
      filters: filters,
      currentFilter: this.#filterModel.filter,
      onFilterChange: this.#handleFilterChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);

  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterChange = (filter) => {
    if(this.#filterModel.filter === filter) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filter);
  };
}

import {FilterType, UpdateType} from '../const.js';
import Observable from '../framework/observable.js';
import {remove, render, replace} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import {filter} from '../utils/filter.js';


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
    const points = this.#pointsModel.points;
    return [
      {
        name: FilterType.EVERYTHING,
        isEnabled: points?.length > 0,
      },
      {
        name: FilterType.FUTURE,
        isEnabled: filter[FilterType.FUTURE](points)?.length > 0,
      }
    ];
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

  #handleFilterChange = (value) => {
    if(this.#filterModel.filter === value) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, value);
  };
}

import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../utils/common.js';

const createFilterTemplate = (filter, currentFilter) => (
    `
  <div class="trip-filters__filter">
      <input
      id="filter-${filter}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${filter}"
      ${filter === currentFilter ? "checked": ""}
      >
        <label class="trip-filters__filter-label" for="filter-${filter}" data-filter-type="${filter}">${capitalizeFirstLetter(filter)}</label>
    </div>
  `
);

const createFiltersTemplate = (filters, currentFilter) => (
  `<form class="trip-filters" action="#" method="get">
    ${filters.map((item) => createFilterTemplate(item, currentFilter)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView {
  #filters = [];
  #currentFilter = null;
  #handleFilterChange = null;

  constructor({filters, currentFilter, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#handleFilterChange = onFilterChange;
    this.element.addEventListener('click', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterChangeHandler = (evt) => {
    if(!evt.target.classList.contains('trip-filters__filter-label')) {
      return;
    }
    evt.preventDefault();
    this.#handleFilterChange(evt.target.dataset.filterType);
  };
}

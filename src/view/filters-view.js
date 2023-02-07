import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../utils/common.js';


const createFilterTemplate = (filter, currentFilter) => {
  const {name, isEnabled} = filter;
  return (
    `
  <div class="trip-filters__filter">
      <input
      id="filter-${name}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${name}"
      ${filter.name === currentFilter ? 'checked' : ''}
      ${isEnabled ? '' : 'disabled'}
      >
        <label class="trip-filters__filter-label" for="filter-${name}" data-filter-type="${name}">${capitalizeFirstLetter(name)}</label>
    </div>
  `
  );
};

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
    evt.preventDefault();
    if(!evt.target.classList.contains('trip-filters__filter-label') || evt.target.control.disabled) {
      return;
    }
    this.#handleFilterChange(evt.target.dataset.filterType);
  };
}

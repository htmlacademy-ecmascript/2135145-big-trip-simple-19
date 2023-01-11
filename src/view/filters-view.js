import {FilterType} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../utils/common.js';

const createFilterTemplate = (filter) => (
  `
  <div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio"
             name="trip-filter" value="${filter}">
        <label class="trip-filters__filter-label" htmlFor="filter-${filter}">${capitalizeFirstLetter(filter)}</label>
    </div>
  `
);

const createFiltersTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
    ${Object.values(FilterType).map((item) => createFilterTemplate(item)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView {
  get template() {
    return createFiltersTemplate();
  }
}

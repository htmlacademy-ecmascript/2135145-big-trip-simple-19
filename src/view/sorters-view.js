import {SortType as sortType, SortType} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../utils/common.js';


const createSorterItemTemplate = (sortItem, currentSortType) => (
  `
    <div class="trip-sort__item  trip-sort__item--${sortItem}">
      <input id="sort-${sortItem}"
      class="trip-sort__input  visually-hidden"
      type="radio" name="trip-sort"
      value="sort-${sortItem}"
       ${sortItem === currentSortType ? 'checked' : ''}
       ${sortItem !== sortType.PRICE && sortItem !== sortType.DAY ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${sortItem}" data-sort-type="${sortItem}">${capitalizeFirstLetter(sortItem)}</label>
    </div>
  `
);

const createSortersTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(SortType).map((item) => createSorterItemTemplate(item, currentSortType)).join('')}
   </form>`
);


export default class SortersView extends AbstractView {
  #handleSortChange = null;
  #currentSortType = null;

  constructor({ onSortChange, currentSortType}) {
    super();
    this.#handleSortChange = onSortChange;
    this.#currentSortType = currentSortType;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortersTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if(!evt.target.classList.contains('trip-sort__btn')) {
      return;
    }
    evt.preventDefault();
    this.#handleSortChange(evt.target.dataset.sortType);
  };
}

import {SortType} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../utils/common.js';


const createSorterItemTemplate = (sortItem) => (
  `
    <div class="trip-sort__item  trip-sort__item--${sortItem}">
      <input id="sort-${sortItem}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortItem}">
      <label class="trip-sort__btn" for="sort-${sortItem}">${capitalizeFirstLetter(sortItem)}</label>
    </div>
  `
);

const createSortersTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(SortType).map((item) => createSorterItemTemplate(item)).join('')}
   </form>`
);


export default class SortersView extends AbstractView {
  get template() {
    return createSortersTemplate();
  }
}

import {FilterType} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const NoPointText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
};


const createNoPointViewTemplate = (filter) => {
  const noPointTextValue = NoPointText[filter];
  return `<p class="trip-events__msg">${noPointTextValue}</p>`;
};

export default class NoPointView extends AbstractView {
  #filter;

  constructor({filter}) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createNoPointViewTemplate(this.#filter);
  }
}

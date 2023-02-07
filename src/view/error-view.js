import AbstractView from '../framework/view/abstract-view.js';

const createErrorViewTemplate = () => '<p class="trip-events__msg">Error while loading data...</p>';

export default class ErrorView extends AbstractView {

  get template() {
    return createErrorViewTemplate();
  }
}

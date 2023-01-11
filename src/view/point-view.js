import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../utils/common.js';
import { getDateWithSeparator, getDateWithTime, getMonthAndDay, getTime} from '../utils/time-formatter.js';


const createOfferTemplate = (offer) => (
  `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`
);

const createOffersTemplate = (offers) => (
  `<ul class="event__selected-offers">
    ${offers.map((offer) => createOfferTemplate(offer)).join('')}
    </ul>`
);

const createEventsScheduleTemplate = (startDate, startTime, endDate, endTime) => (
  `<div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" dateTime="${startDate}">${startTime}</time>
      &mdash;
      <time class="event__end-time" dateTime="${endDate}">${endTime}</time>
    </p>
  </div>`
);

const createPriceTemplate = (price) => (
  `<p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
  `
);

const createPointTemplate = (point, destination) => {
  const {dateFrom, dateTo, basePrice, type } = point;
  const dayAndMonth = getMonthAndDay(dateFrom);
  const startTime = getTime(dateFrom);
  const endTime = getTime(dateTo);
  const dateWithSeparator = getDateWithSeparator(dateFrom);
  const startDate = getDateWithTime(dateFrom);
  const endDate = getDateWithTime(dateTo);
  const {name} = destination;

  return (
    `
   <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime=${dateWithSeparator}>${dayAndMonth}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${capitalizeFirstLetter(type)} ${name}</h3>
      ${createEventsScheduleTemplate(startDate, startTime, endDate, endTime)}
      ${createPriceTemplate(basePrice)}
      <h4 class="visually-hidden">Offers:</h4>
      ${createOffersTemplate(point.offers)}
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `
  );
};

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #handleEditClick = null;

  constructor({point, destination, onEditClick }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#handleEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);

  }

  get template() {
    return createPointTemplate(this.#point, this.#destination);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}

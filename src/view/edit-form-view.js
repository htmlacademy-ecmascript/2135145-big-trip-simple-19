import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';
import {getAllDestinations} from '../mock/destinations.js';
import {getAllOffersForType, TYPES} from '../mock/offers.js';
import {capitalizeFirstLetter, getRandomFromRange} from '../utils/common.js';
import {getDateWithTimeWithSlash} from '../utils/time-formatter.js';

const BLANK_POINT = {
  'basePrice': 0,
  'dateFrom': dayjs(),
  'dateTo': dayjs(),
  'destination': getAllDestinations()[0],
  'id': getRandomFromRange(1, 50),
  'offers': [],
  'type': TYPES[0],
};

const createDestinationTemplate = ({name, description}) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">${name}</h3>
    <p class="event__destination-description">${description}</p>
   </section>
  `
);

const createEventTypeTemplate = (type) => (
  `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${type}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
    </div>
  `
);

const createEventTypesTemplate = (currentType) => (
  `
  <div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
          ${TYPES.map((type) => createEventTypeTemplate(type)).join('')}
      </fieldset>
    </div>
  </div>`
);

const createDestinationOptionTemplate = (destination) => `<option value=${destination.name}></option>`;

const createDestinationsTemplate = (type, currentDestination, destinations) => (
  `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${capitalizeFirstLetter(type)}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${currentDestination.name} list="destination-list-1">
    <datalist id="destination-list-1">
        ${destinations.map((destination) => createDestinationOptionTemplate(destination))}
    </datalist>
  </div>`
);

const createTimeTemplate = (startDate, endDate) => (
  `
   <div class="event__field-group  event__field-group--time">
     <label class="visually-hidden" for="event-start-time-1">From</label>
     <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
      &mdash;
     <label class="visually-hidden" for="event-end-time-1">To</label>
     <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
   </div>
  `
);

const createPriceTemplate = (price) => (
  `
  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
  </div>
  `
);

const createOfferTemplate = (offer, isSelected) => (
  `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-id" type="checkbox" name="event-offer-id" ${isSelected ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-id">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>
  `);

const createOffersTemplate = (type, selectedOffers) => (
  `
  <div class="event__available-offers">
    ${getAllOffersForType(type).map((offer) => createOfferTemplate(offer, selectedOffers.includes(offer)))}
  </div>
  `
);

const createEditFormTemplate = (point, destinations, currentDestination) => {
  const {type, dateFrom, dateTo, basePrice, offers} = point;
  const startDate = getDateWithTimeWithSlash(dateFrom);
  const endDate = getDateWithTimeWithSlash(dateTo);
  return (
    `
   <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      ${createEventTypesTemplate(type)}
      ${createDestinationsTemplate(type, currentDestination, destinations)}
      ${createTimeTemplate(startDate, endDate)}
      ${createPriceTemplate(basePrice)}
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        ${createOffersTemplate(type, offers)}
      </section>
      ${createDestinationTemplate(currentDestination)}
    </section>
  </form>
  `
  );
};


export default class EditFormView extends AbstractView {
  #point = null;
  #destinations = null;
  #currentDestination = null;
  #handleFormSubmit = null;
  #handleCloseClick = null;

  constructor({point = BLANK_POINT, destinations, currentDestination, onFormSubmit, onCloseClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#currentDestination = currentDestination;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeButtonClickHandler);
  }

  get template() {
    return createEditFormTemplate(this.#point, this.#destinations, this.#currentDestination);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };
}

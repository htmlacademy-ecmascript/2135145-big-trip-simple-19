import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getAllDestinations} from '../mock/destinations.js';
import {getAllOffersForType, TYPES} from '../mock/offers.js';
import {capitalizeFirstLetter, getRandomFromRange} from '../utils/common.js';
import {getDateWithTimeWithSlash} from '../utils/time-formatter.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  'basePrice': 0,
  'dateFrom': dayjs(),
  'dateTo': dayjs(),
  'destination': getAllDestinations()[0].id,
  'id': getRandomFromRange(1, 50),
  'offers': [],
  'type': TYPES[0],
};

const createPictureTemplate = ({src, description}) => (`<img class="event__photo" src=${src} alt=${description}>`);

const createDestinationTemplate = ({name, description, pictures}) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">${name}</h3>
    ${description ? (`<p class="event__destination-description">${description}</p>`) : ''}
    <div class="event__photos-container">
        <div class="event__photos-tape">
            ${pictures?.length > 0 ? pictures.map((picture) => createPictureTemplate(picture)).join('') : ''}
        </div>
      </div>
   </section>`
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

const createDestinationOptionTemplate = (destination) => `<option value="${destination.name}">`;

const createDestinationsTemplate = (type, currentDestination, destinations) => (
  `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${capitalizeFirstLetter(type)}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${currentDestination.name} list="destination-list-1">
    <datalist id="destination-list-1">
      ${destinations.map((destination) => createDestinationOptionTemplate(destination)).join('')}
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

const createEditFormTemplate = ({state}) => {
  const {type, dateFrom, destination, dateTo, basePrice, offers} = state.point;
  const destinations = state.destinations;
  const startDate = getDateWithTimeWithSlash(dateFrom);
  const endDate = getDateWithTimeWithSlash(dateTo);
  return (
    `
   <form class="event event--edit">
    <header class="event__header">
      ${createEventTypesTemplate(type)}
      ${createDestinationsTemplate(type, destination, destinations)}
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
      ${createDestinationTemplate(destination)}
    </section>
  </form>
  `
  );
};


export default class EditFormView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleCloseClick = null;
  #getDestinationById = null;
  #getDestinationByName = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point = BLANK_POINT, destinations, getDestinationById, getDestinationByName, onFormSubmit, onCloseClick}) {
    super();
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.#getDestinationById = getDestinationById;
    this.#getDestinationByName = getDestinationByName;
    this._setState(EditFormView.parseDataToState({point, destinations, getDestinationById}));
    this._restoreHandlers();
    this.#initDatepickers();
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeButtonClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('blur', this.#destinationInputBlurHandler);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if(this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset = (point) => {
    this.updateElement(
      EditFormView.parseDataToState({point, destinations: this._state.destinations, getDestinationById: this.#getDestinationById}),
    );
  };

  get template() {
    return createEditFormTemplate({state: this._state});
  }

  static parseDataToState = ({point, destinations, getDestinationById}) => {
    const data = {
      point: {...point, destination: getDestinationById(point.destination)},
      destinations: [...destinations],
    };
    return data;
  };

  static parseStateToData = ({state}) => {
    const point = {...state.point, destination: state.point.destination.id};
    return point;
  };

  #initDatepickers = () => {
    this.#datepickerFrom = flatpickr(this.element.querySelector('#event-start-time-1'), {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      defaultDate: this._state.point.dateFrom,
      onChange: this.#dateFromChangeHandler,
    });

    this.#datepickerTo = flatpickr(this.element.querySelector('#event-end-time-1'), {
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.point.dateTo,
      onChange: this.#dateToChangeHandler,
    });
  };

  #dateFromChangeHandler = ([date]) => {
    this.updateElement(({...this._state, point: {...this._state.point, dateFrom: date}}));
    this.#initDatepickers();
  };

  #dateToChangeHandler = ([date]) => {
    this.updateElement(({...this._state, point: {...this._state.point, dateTo: date }}));
    this.#initDatepickers();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit({data: EditFormView.parseStateToData({state: this._state})});
    this._restoreHandlers();
    this.#initDatepickers();
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if(evt.target.classList.contains('event__type-label')) {
      this.updateElement({...this._state, point: {...this._state.point, type: evt.target.control.value}});
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({...this._state, point: {...this._state.point, destination: {...this._state.point.destination, name: evt.target.value}}});
  };

  #destinationInputBlurHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#getDestinationByName(evt.target.value);
    if (destination) {
      this.updateElement(({...this._state, point: {...this._state.point, destination: destination }}));
    } else {
      const dest = this.#getDestinationById(this._state.point.destination.id);
      this.updateElement({...this._state, point: {...this._state.point, destination: dest}});
    }
  };
}

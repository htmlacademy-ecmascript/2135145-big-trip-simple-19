import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {capitalizeFirstLetter} from '../utils/common.js';
import {getDateWithTimeWithSlash} from '../utils/time-formatter.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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

const createEventTypeTemplate = (type, isDisabled) => (
  `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${type} ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
    </div>
  `
);

const createEventTypesTemplate = (currentType, allOffers, isDisabled) => {
  const offerTypes = allOffers.map((offer) => offer.type);
  return (
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
          ${offerTypes.map((type) => createEventTypeTemplate(type, isDisabled)).join('')}
      </fieldset>
    </div>
  </div>`
  );
};

const createDestinationOptionTemplate = (destination) => `<option value="${destination.name}">`;

const createDestinationsTemplate = (type, currentDestination, destinations, isDisabled) => (
  `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${capitalizeFirstLetter(type)}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" list="destination-list-1" ${isDisabled ? 'disabled' : ''} value=${currentDestination?.name || ''}>
    <datalist id="destination-list-1">
      ${destinations.map((destination) => createDestinationOptionTemplate(destination)).join('')}
    </datalist>
  </div>`
);

const createTimeTemplate = (startDate, endDate, isDisabled) => (
  `
   <div class="event__field-group  event__field-group--time">
     <label class="visually-hidden" for="event-start-time-1">From</label>
     <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}" ${isDisabled ? 'disabled' : ''}>
      &mdash;
     <label class="visually-hidden" for="event-end-time-1">To</label>
     <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}" ${isDisabled ? 'disabled' : ''}>
   </div>
  `
);

const createPriceTemplate = (price, isDisabled) => (
  `
  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" ${isDisabled ? 'disabled' : ''}>
  </div>
  `
);

const createOfferTemplate = (offer, isSelected, isDisabled) => (
  `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" value=${offer.id} id="event-${offer.id}" type="checkbox" name="event-${offer.id}" ${isSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>
  `);

const getAllOffersForType = (allOffers, type) => allOffers.find((offer) => offer.type === type).offers;

const createOffersTemplate = (allOffers, type, selectedOffers, isDisabled) => (
  `
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
    ${getAllOffersForType(allOffers, type).map((offer) => createOfferTemplate(offer, selectedOffers.map((item) => item.title).includes(offer.title), isDisabled))}
  </div>
  `
);

const createEditFormTemplate = ({state, allOffers, handleCloseClick}) => {
  const {isDisabled, isSaving, isDeleting, point, destinations} = state;
  const {type, dateFrom, destination, dateTo, basePrice, offers} = point;
  const startDate = getDateWithTimeWithSlash(dateFrom);
  const endDate = getDateWithTimeWithSlash(dateTo);
  const buttonDeleteText = isDeleting ? 'Deleting...' : 'Delete';
  return (
    `
   <form class="event event--edit">
    <header class="event__header">
      ${createEventTypesTemplate(type, allOffers, isDisabled)}
      ${createDestinationsTemplate(type, destination, destinations, isDisabled)}
      ${createTimeTemplate(startDate, endDate, isDisabled)}
      ${createPriceTemplate(basePrice, isDisabled)}
      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${handleCloseClick ? buttonDeleteText : 'Close'}</button>
      ${handleCloseClick ?
      `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>` : ''
    }
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
      ${ getAllOffersForType(allOffers, type)?.length > 0 > 0 ? createOffersTemplate(allOffers, type, offers, isDisabled) : ''}
      </section>
      ${destination ? createDestinationTemplate(destination) : ''}
    </section>
  </form>
  `
  );
};


export default class EditFormView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleCloseClick = null;
  #handleDeleteClick = null;
  #getDestinationById = null;
  #getDestinationByName = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #offers = [];

  constructor({point, destinations, offers, getDestinationById, getDestinationByName, onFormSubmit, onCloseClick, onDeleteClick}) {
    super();
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#getDestinationById = getDestinationById;
    this.#getDestinationByName = getDestinationByName;
    this.#offers = offers;
    this._setState(EditFormView.parseDataToState({point, destinations, getDestinationById}));
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    if (this.#handleCloseClick) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeButtonClickHandler);
    }
    this.element.querySelector('.event__type-group').addEventListener('click', this.#pointTypeChangeHandler);
    if(getAllOffersForType(this.#offers, this._state.point.type)?.length > 0) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#offerChangeHandler);
    }
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('blur', this.#destinationInputBlurHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#pointDeleteClickHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);
    this.#initDatepickers();
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset = (point) => {
    this.updateElement(
      EditFormView.parseDataToState({
        point,
        destinations: this._state.destinations,
        getDestinationById: this.#getDestinationById
      }),
    );
  };

  get template() {
    return createEditFormTemplate({
      state: this._state,
      allOffers: this.#offers,
      handleCloseClick: this.#handleCloseClick
    });
  }

  static parseDataToState = ({point, destinations, getDestinationById}) => {
    const data = {
      point: {...point,
        destination: getDestinationById(point.destination),
      },
      destinations: [...destinations],
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
    return data;
  };

  static parseStateToData = ({state}) => {
    const point = {...state.point, destination: state.point?.destination?.id};
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
    const dateTo = dayjs(this._state.point.dateTo).diff(date) < 0 ? date : this._state.point.dateTo;
    this.updateElement(({...this._state, point: {...this._state.point, dateFrom: date, dateTo}}));
    this.#initDatepickers();
  };

  #dateToChangeHandler = ([date]) => {
    const dateFrom = dayjs(this._state.point.dateFrom).diff(date) > 0 ? date : this._state.point.dateFrom;
    this.updateElement(({...this._state, point: {...this._state.point, dateTo: date, dateFrom}}));
    this.#initDatepickers();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit({data: EditFormView.parseStateToData({state: this._state})});
    this._restoreHandlers();
  };

  #pointDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditFormView.parseStateToData({state: this._state}));
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.classList.contains('event__type-label')) {
      this.updateElement({...this._state, point: {...this._state.point, type: evt.target.control.value, offers: []}});
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      ...this._state,
      point: {...this._state.point, destination: {...this._state.point.destination, name: evt.target.value}}
    });
  };

  #destinationInputBlurHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#getDestinationByName(evt.target.value);
    if (destination) {
      this.updateElement(({...this._state, point: {...this._state.point, destination: destination}}));
    } else {
      this.updateElement({...this._state, point: {...this._state.point, destination: null}});
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const price = Number(evt.target.value);
    if(price !== undefined) {
      this._setState({
        ...this._state,
        point: {...this._state.point, basePrice: price}
      });
    }
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.classList.contains('event__offer-label')) {
      const offerId = Number(evt.target.control.value);
      if (this._state.point.offers.map((offer) => offer.id).includes(offerId)) {
        this.updateElement({
          ...this._state,
          point: {...this._state.point, offers: this._state.point.offers.filter((offer) => offer.id !== offerId)}
        });
        return;
      }
      const enrichedOffer = this.#offers.find((offer) => offer.type === this._state.point.type).offers.find((item) => item.id === offerId);
      this.updateElement({
        ...this._state,
        point: {...this._state.point, offers: [...this._state.point.offers, enrichedOffer]}
      });
    }
  };
}

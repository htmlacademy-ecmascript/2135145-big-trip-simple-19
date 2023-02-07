import dayjs from 'dayjs';
import {UpdateType, UserAction} from '../const.js';
import {remove, render} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #destinationsModel = null;

  #pointEditComponent = null;
  #renderPosition = null;

  constructor({pointListContainer, destinationsModel, offersModel, handleDataChange, handleDestroy, renderPosition}) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.#handleDataChange = handleDataChange;
    this.#handleDestroy = handleDestroy;
    this.#renderPosition = renderPosition;
  }

  init = () => {
    if(this.#pointEditComponent !== null) {
      return;
    }

    const BLANK_POINT = {
      'basePrice': 80,
      'dateFrom': dayjs().toDate(),
      'dateTo': dayjs().toDate(),
      'destination': this.#destinationsModel.destinations[0].id,
      'offers': [],
      'type': 'taxi',
    };

    this.#pointEditComponent = new EditFormView({
      point: BLANK_POINT,
      destinations: this.#destinationsModel.destinations,
      offers: this.offersModel.offers,
      getDestinationById: this.#destinationsModel.getDestinationById,
      getDestinationByName: this.#destinationsModel.getDestinationByName,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onCloseClick: null,
    });

    render(this.#pointEditComponent, this.#pointListContainer, this.#renderPosition);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }
    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = ({data}) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      data,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

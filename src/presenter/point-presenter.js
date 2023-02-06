import {UpdateType, UserAction} from '../const.js';
import {remove, render, replace} from '../framework/render.js';
import {isDatesEqual, isPriceEqual} from '../utils/point.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointItemViewComponent = null;
  #editFormViewComponent = null;
  #destinationsModel = null;
  #offersModel = null;
  #point = null;
  #handleModeChange = null;
  #handleDataChange = null;
  #mode = Mode.DEFAULT;

  constructor({ pointListContainer, destinationsModel, offersModel, onModeChange, onDataChange}) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
  }

  init = (point) => {
    const allOffersForPoint = this.#offersModel.offers.find(offer => offer.type === point.type).offers;
    this.#point = {...point, offers: allOffersForPoint.filter(offer => point.offers.includes(offer.id))};
    const prevPointItemViewComponent = this.#pointItemViewComponent;
    const prevEditFormViewComponent = this.#editFormViewComponent;

    this.#pointItemViewComponent = new PointView({
      point: this.#point,
      destination: this.#destinationsModel.getDestinationById(this.#point.destination),
      onEditClick: () => {
        this.#replacePointViewToForm();
        document.addEventListener('keydown', this.#onEscKeyDown);
      }
    });

    this.#editFormViewComponent = new EditFormView({
      point: this.#point,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      getDestinationById: this.#destinationsModel.getDestinationById,
      getDestinationByName: this.#destinationsModel.getDestinationByName,
      onFormSubmit: ({data}) => {
        this.#handleFormSubmit(data);
      },
      onCloseClick: () => {
        this.resetView();
        document.removeEventListener('keydown', this.#onEscKeyDown);
      },
      onDeleteClick: (data) => {
        this.#handleDeleteClick(data);
        document.removeEventListener('keydown', this.#onEscKeyDown);
      }
    });

    if(prevPointItemViewComponent === null || prevEditFormViewComponent === null) {
      render(this.#pointItemViewComponent, this.#pointListContainer);
      return;
    }

    if(this.#mode === Mode.DEFAULT) {
      replace(this.#pointItemViewComponent, prevPointItemViewComponent);
    }

    if(this.#mode === Mode.EDITING) {
      replace(this.#editFormViewComponent, prevEditFormViewComponent);
    }

    remove(prevPointItemViewComponent);
    remove(prevEditFormViewComponent);
  };

  #handleFormSubmit = (point) => {

    const isPatchUpdate = isDatesEqual(this.#point.dateFrom, point.dateFrom) && isPriceEqual(this.#point.basePrice, point.basePrice);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isPatchUpdate ? UpdateType.PATCH : UpdateType.MINOR,
      point
    );
    this.#replaceFormToPointView();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  resetView = () => {
    if(this.#mode !== Mode.DEFAULT) {
      this.#editFormViewComponent.reset(this.#point);
      this.#replaceFormToPointView();
    }
  };

  destroy = () => {
    remove(this.#pointItemViewComponent);
    remove(this.#editFormViewComponent);
  };

  #replacePointViewToForm(){
    replace(this.#editFormViewComponent, this.#pointItemViewComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPointView(){
    replace(this.#pointItemViewComponent, this.#editFormViewComponent);
    this.#mode = Mode.DEFAULT;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editFormViewComponent.reset(this.#point);
      this.#replaceFormToPointView();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}

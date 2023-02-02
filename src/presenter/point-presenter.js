import {remove, render, replace} from '../framework/render.js';
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
  #point = null;
  #handleModeChange = null;
  #handleDataChange = null;
  #mode = Mode.DEFAULT;

  constructor({ pointListContainer, destinationsModel, onModeChange, onDataChange}) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
  }

  init = (point) => {
    this.#point = point;
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
      getDestinationById: this.#destinationsModel.getDestinationById,
      getDestinationByName: this.#destinationsModel.getDestinationByName,
      onFormSubmit: ({data}) => {
        this.#handleDataChange(data);
        this.#replaceFormToPointView();
        document.removeEventListener('keydown', this.#onEscKeyDown);
      },
      onCloseClick: () => {
        this.#replaceFormToPointView();
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

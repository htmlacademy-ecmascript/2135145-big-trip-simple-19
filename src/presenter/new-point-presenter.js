import {nanoid} from 'nanoid';
import {UpdateType, UserAction} from '../const.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #destinationsModel = null;

  #pointEditComponent = null;

  constructor({pointListContainer, destinationsModel, handleDataChange, handleDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = handleDataChange;
    this.#handleDestroy = handleDestroy;
  }

  init = () => {
    if(this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditFormView({
      point: undefined,
      destinations: this.#destinationsModel.destinations,
      getDestinationById: this.#destinationsModel.getDestinationById,
      getDestinationByName: this.#destinationsModel.getDestinationByName,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onCloseClick: null,
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
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

  #handleFormSubmit = ({data}) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...data, id: nanoid()},
    );
    this.destroy();
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

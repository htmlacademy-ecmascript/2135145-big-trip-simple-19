import {render, replace} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import NoPointView from '../view/no-point-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import SortersView from '../view/sorters-view.js';

export default class TripPresenter {
  #pointListView = new PointListView();
  #contentContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #points = null;


  constructor(contentContainer, pointsModel, destinationsModel) {
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
  }

  init = () => {
    this.#points = [...this.#pointsModel.points];
    render(new SortersView(), this.#contentContainer);
    this.#renderPointList();
  };

  #renderPointItem = (point) => {
    const pointItemView = new PointView({
      point,
      destination: this.#destinationsModel.getDestinationById(point.destination),
      onEditClick: () => {
        replacePointViewToForm();
        document.addEventListener('keydown', onEscKeyDown);
      }
    });

    const editFormView = new EditFormView({
      point,
      destinations: this.#destinationsModel.destinations,
      currentDestination: this.#destinationsModel.getDestinationById(point.destination),
      onFormSubmit: () => {
        replaceFormToPointView();
        document.removeEventListener('keydown', onEscKeyDown);
      },
      onCloseClick: () => {
        replaceFormToPointView();
        document.removeEventListener('keydown', onEscKeyDown);
      }
  });

    const replacePointViewToForm = () => {
      replace(editFormView, pointItemView);
    };

    const replaceFormToPointView = () => {
      replace(pointItemView, editFormView);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPointView();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    render(pointItemView, this.#pointListView.element);
  };

  #renderPointList = () => {
    if (this.#points === null || this.#points.length === 0) {
      render(new NoPointView(), this.#contentContainer);
    } else {
      for (let i = 0; i < this.#points.length; i += 1) {
        this.#renderPointItem(this.#points[i]);
      }
      render(this.#pointListView, this.#contentContainer);
    }
  };
}

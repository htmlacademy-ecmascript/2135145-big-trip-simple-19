import {render} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';
import PointListView from '../view/point-list-view.js';
import SortersView from '../view/sorters-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #pointListView = new PointListView();
  #contentContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #points = null;
  #pointPresenters = new Map();


  constructor(contentContainer, pointsModel, destinationsModel) {
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
  }

  init = () => {
    this.#points = [...this.#pointsModel.points];
    this.#renderBoard();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((p) => p.resetView());
}

  #renderPointItem = (point) => {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListView.element,
      destinationsModel: this.#destinationsModel,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderSort = () => {
    render(new SortersView(), this.#contentContainer);
  };

  #renderPointList = () => {
    for (let i = 0; i < this.#points.length; i += 1) {
      this.#renderPointItem(this.#points[i]);
    }
    render(this.#pointListView, this.#contentContainer);
  };

  #renderNoPointView = () => {
    render(new NoPointView(), this.#contentContainer);
  }

  #renderBoard = () => {
    this.#renderSort();
    if (this.#points === null || this.#points.length === 0) {
      this.#renderNoPointView();
    } else {
      this.#renderPointList();
    }
  }
}

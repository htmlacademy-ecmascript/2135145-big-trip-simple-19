import {SortType} from '../const.js';
import {render} from '../framework/render.js';
import {sortByPrice, sortByDate} from '../utils/point.js';
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
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #sourcedPoints = [];


  constructor(contentContainer, pointsModel, destinationsModel) {
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
  }

  init = () => {
    this.#points = [...this.#pointsModel.points.sort(sortByDate)];
    this.#sourcedPoints = [...this.#points];
    this.#renderBoard();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((p) => p.resetView());
  };

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
    this.#sortComponent = new SortersView({onSortChange: this.#handleSortChange});
    render(this.#sortComponent, this.#contentContainer);
  };

  #handleSortChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.PRICE:
        this.#currentSortType = sortType;
        this.#points.sort(sortByPrice);
        break;
      case SortType.OFFERS:
      case SortType.TIME:
      case SortType.EVENT:
        break;
      default:
        this.#currentSortType = sortType.DAY;
        this.#points = [...this.#sourcedPoints];
    }
  };

  #renderPointList = () => {
    for (let i = 0; i < this.#points.length; i += 1) {
      this.#renderPointItem(this.#points[i]);
    }
    render(this.#pointListView, this.#contentContainer);
  };

  #clearPointList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

  #renderNoPointView = () => {
    render(new NoPointView(), this.#contentContainer);
  };

  #renderBoard = () => {
    this.#renderSort();
    if (this.#points === null || this.#points.length === 0) {
      this.#renderNoPointView();
    } else {
      this.#renderPointList();
    }
  };
}

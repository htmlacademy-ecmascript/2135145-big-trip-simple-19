import {FilterType, SortType, UpdateType, UserAction} from '../const.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import {filter} from '../utils/filter.js';
import {sortByPrice, sortByDate} from '../utils/point.js';
import LoadingView from '../view/loading-view.js';
import NoPointView from '../view/no-point-view.js';
import PointListView from '../view/point-list-view.js';
import SortersView from '../view/sorters-view.js';
import NewPointPresenter from './new-point-presenter.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #pointListView = new PointListView();
  #loadingComponent = new LoadingView();
  #contentContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #sortComponent = null;
  #noPointsComponent = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor({contentContainer, pointsModel, destinationsModel, offersModel, filterModel, onNewPointDestroy}) {
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#contentContainer,
      destinationsModel: this.#destinationsModel,
      handleDataChange: this.#handleViewAction,
      handleDestroy: onNewPointDestroy,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.DAY:
      default:
        return filteredPoints.sort(sortByDate);
    }
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((p) => p.resetView());
  };

  #renderPointItem = (point) => {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListView.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderSort = () => {
    this.#sortComponent = new SortersView({
      onSortChange: this.#handleSortChange,
      currentSortType: this.#currentSortType,
    });
    render(this.#sortComponent, this.#contentContainer);
  };

  #handleSortChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType === SortType.PRICE ? sortType : SortType.DAY;
    this.#clearBoard({resetSortType: false});
    this.#renderBoard();
  };

  #handleViewAction = (actionType, updateType, updatedPoint) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, updatedPoint);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, updatedPoint);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, updatedPoint);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard({resetSortType: false});
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderPointList = () => {
    this.points.forEach((point) => this.#renderPointItem(point));
    render(this.#pointListView, this.#contentContainer);
  };

  #clearPointList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#contentContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoPointView = () => {
    this.#noPointsComponent = new NoPointView({
      filter: this.#filterType
    });
    render(this.#noPointsComponent, this.#contentContainer);
  };

  #clearBoard = ({resetSortType = false}) => {
    this.#newPointPresenter.destroy();
    this.#clearPointList();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#renderSort();
    if (this.points === null || this.points.length === 0) {
      this.#renderNoPointView();
    } else {
      this.#renderPointList();
    }
  };
}

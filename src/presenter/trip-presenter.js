import {render} from '../render.js';
import EditFormView from '../view/edit-form-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import SortersView from "../view/sorters-view";

export default class TripPresenter {
  pointListView = new PointListView();

  constructor(contentContainer) {
    this.contentContainer = contentContainer;
  }

  init = (pointsModel, destinationsModel) => {
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.points = [...this.pointsModel.getPoints()];

    render(new SortersView(), this.contentContainer);
    render(new EditFormView(this.points[0], this.destinationsModel.getDestinations(), this.destinationsModel.getDestinationById(this.points[0].destination)), this.contentContainer);
    for (let i = 0; i < this.points.length; i += 1) {
      render(new PointView(this.points[i], this.destinationsModel.getDestinationById(this.points[i].destination)), this.pointListView.getElement());
    }
    render(this.pointListView, this.contentContainer);
  }
}

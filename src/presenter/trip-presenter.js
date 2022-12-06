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

  init = () => {
    render(new SortersView(), this.contentContainer);
    render(new EditFormView(), this.contentContainer);
    for (let i = 0; i < 3; i += 1) {
      render(new PointView(), this.pointListView.getElement());
    }
    render(this.pointListView, this.contentContainer);
  }
}

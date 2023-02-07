import {UpdateType} from '../const.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = [];
  #clientApiService = null;

  constructor({clientApiService}) {
    super();
    this.#clientApiService = clientApiService;
  }

  async init(){
    try {
      const points = await this.#clientApiService.points;
      this.#points = points.map((point) => PointsModel.#adaptPointToClient(point));
    } catch (err){
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  get points() {
    return this.#points;
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#clientApiService.addPoint(update);
      const addedPoint = PointsModel.#adaptPointToClient(response);
      this.#points = [
        addedPoint,
        ...this.#points,
      ];
      this._notify(updateType, addedPoint);
    } catch (err) {
      throw new Error('Can not add point');
    }
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Provided point does not exist!');
    }

    try {
      const response = await this.#clientApiService.updatePoint(update);
      const updatedPoint = PointsModel.#adaptPointToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can not update point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Provided point does not exist!');
    }
    try {
      await this.#clientApiService.deletePoint(update)
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can not delete point');
    }
  }

  static #adaptPointToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];

    return adaptedPoint;
  }
}

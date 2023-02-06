import {UpdateType} from "../const";
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
      this.#points = points.map((point) => this.#adaptPointToClient(point));
    } catch (err){
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  get points() {
    return this.#points;
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Provided point does not exist!');
    }

    try {
      const response = await this.#clientApiService.updatePoint(update);
      const updatedPoint = this.#adaptPointToClient(response);
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

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Provided point does not exist!');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
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

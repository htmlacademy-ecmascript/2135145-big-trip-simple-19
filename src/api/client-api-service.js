import ApiService from '../framework/api-service.js';
const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ClientApiService extends ApiService {

  get points(){
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `/points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(ClientApiService.#adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    return ApiService.parseResponse(response);
  }

  async addPoint(point) {
    const response = await this._load({
      url: '/points',
      method: Method.POST,
      body: JSON.stringify(ClientApiService.#adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    return ApiService.parseResponse(response);
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
    return response;
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }
  /* eslint-disable */
  static #adaptPointToServer(point) {
    const adaptedPoint = {...point,
      base_price: point.basePrice,
      date_from: point.dateFrom,
      date_to: point.dateTo,
      offers: point.offers.map((offer) => offer.id),
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;

    return adaptedPoint;
  }
}

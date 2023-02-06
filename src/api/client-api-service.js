import ApiService from "../framework/api-service";
const Method = {
  GET: 'GET',
  PUT: 'PUT',
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
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    return ApiService.parseResponse(response);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  #adaptPointToServer(point) {
    const adaptedPoint = {...point,
      base_price: point.basePrice,
      date_from: point.dateFrom,
      date_to: point.dateTo,
      offers: point.offers.map(offer => offer.id),
    }

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;

    return adaptedPoint;
  }
}

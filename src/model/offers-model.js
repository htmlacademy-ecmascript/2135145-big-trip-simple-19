export default class OffersModel {
  #offers = [];
  #clientApiService = null;

  constructor({clientApiService}) {
    this.#clientApiService = clientApiService;
  }

  async init(){
    try {
      this.#offers = await this.#clientApiService.offers;
    } catch (err){
      this.#offers = [];
      throw new Error('Can not load offers');
    }
  }

  get offers(){
    return this.#offers;
  }
}

export default class DestinationsModel {
  #destinations = [];
  #clientApiService = null;

  constructor({clientApiService}) {
    this.#clientApiService = clientApiService;
  }

  async init(){
    try {
      this.#destinations = await this.#clientApiService.destinations;
    } catch (err){
      this.#destinations = [];
      throw new Error('Can not load destinations');
    }
  }

  get destinations(){
    return this.#destinations;
  }

  getDestinationById = (id) => this.#destinations.find((dest) => dest.id === id);

  getDestinationByName = (name)=> this.#destinations.find((dest) => dest.name === name);
}

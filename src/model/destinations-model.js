import {getAllDestinations} from '../mock/destinations.js';

export default class DestinationsModel {
  #destinations = getAllDestinations();

  get destinations(){
    return this.#destinations;
  }

  getDestinationById = (id) => this.#destinations.find((dest) => dest.id === id);

  getDestinationByName = (name)=> this.#destinations.find((dest) => dest.name === name);
}

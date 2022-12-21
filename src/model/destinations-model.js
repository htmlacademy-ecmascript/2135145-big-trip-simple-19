import {getAllDestinations} from '../mock/destinations.js';

export default class DestinationsModel {
  destinations = getAllDestinations();

  getDestinations = () => this.destinations;

  getDestinationById = (id) => this.destinations.find((dest) => dest.id === id);
}

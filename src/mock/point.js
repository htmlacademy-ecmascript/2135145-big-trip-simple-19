import dayjs from 'dayjs';
import {getRandomFromArray, getRandomFromRange} from '../utils/utils.js';
import {getRandomDestination} from './destinations.js';
import {getRandomOffersForType, TYPES} from './offers.js';

const generateDate = () => {
  const gap = getRandomFromRange(0, 3);
  return dayjs().add(gap, 'hour').toDate();
};

export const generatePoint = () => {
  const type = getRandomFromArray(TYPES);
  return (
    {
      'basePrice': getRandomFromRange(100, 3000),
      'dateFrom': dayjs(),
      'dateTo': generateDate(),
      'destination': getRandomDestination().id,
      'id': getRandomFromRange(1, 50),
      'offers': getRandomOffersForType(type),
      type,
    });
};

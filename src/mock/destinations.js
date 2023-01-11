import {getRandomFromArray, getRandomFromRange} from '../utils/common.js';

const CITIES = [
  'London',
  'Budapest',
  'Paris',
  'Berlin',
  'Prague',
  'Dresden',
  'Moscow',
  'Barcelona',
  'Rome',
  'Venice'
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const generateDestination = (index) => ({
  'id': index,
  'description': getRandomFromArray(DESCRIPTIONS),
  'name': CITIES[index],
  'pictures': [
    {
      'src': `http://picsum.photos/248/152?r=${getRandomFromRange(1, 100)}}`,
      'description': getRandomFromArray(DESCRIPTIONS)
    }
  ]
});

const destinations = Array.from({length: CITIES.length},(el, i) => generateDestination(i));

export const getAllDestinations = () => destinations;
export const getRandomDestination = () => getRandomFromArray(destinations);

import {getRandomFromArray, getRandomFromRange} from '../utils/utils.js';

export const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const offersByType = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': 1,
        'title': 'Upgrade to a business class',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 2,
        'title': 'Add luggage',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 3,
        'title': 'Switch to comfort class',
        'price': getRandomFromRange(25, 150)
      }
    ]
  },
  {
    'type': 'bus',
    'offers': [
      {
        'id': 4,
        'title': 'Book seats',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 5,
        'title': 'Add luggage',
        'price': getRandomFromRange(25, 150)
      }
    ]
  },
  {
    'type': 'train',
    'offers': [
      {
        'id': 6,
        'title': 'Book seats',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 7,
        'title': 'Add luggage',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 8,
        'title': 'Switch to comfort class',
        'price': getRandomFromRange(25, 150)
      }
    ]
  },
  {
    'type': 'ship',
    'offers': [
      {
        'id': 9,
        'title': 'Upgrade to a business class',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 10,
        'title': 'Add luggage',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 11,
        'title': 'Switch to comfort class',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 12,
        'title': 'Add meal',
        'price': getRandomFromRange(25, 150)
      }
    ]
  },
  {
    'type': 'drive',
    'offers': [
      {
        'id': 13,
        'title': 'Upgrade to a business class',
        'price': getRandomFromRange(25, 150)
      }
    ]
  },
  {
    'type': 'flight',
    'offers': [
      {
        'id': 14,
        'title': 'Upgrade to a business class',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 15,
        'title': 'Add luggage',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 16,
        'title': 'Add meal',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 17,
        'title': 'Book seats',
        'price': getRandomFromRange(25, 150)
      },
    ]
  },
  {
    'type': 'check-in',
    'offers': [
      {
        'id': 18,
        'title': 'Fast track',
        'price': getRandomFromRange(25, 150)
      }
    ]
  },
  {
    'type': 'sightseeing',
    'offers': [
      {
        'id': 19,
        'title': 'Travel with guide',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 20,
        'title': 'No queues',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 21,
        'title': 'Travel with group',
        'price': getRandomFromRange(25, 150)
      },
      {
        'id': 22,
        'title': 'All included',
        'price': getRandomFromRange(25, 150)
      },
    ]
  },
  {
    'type': 'restaurant',
    'offers': [
      {
        'id': 23,
        'title': 'Five stars',
        'price': getRandomFromRange(25, 150)
      }
    ]
  },
];

export const getAllOffersForType = (type) => offersByType.find((offer) => offer.type === type).offers;

export const getRandomOffersForType = (type) => {
  const allAvailable = getAllOffersForType(type);
  const randomOffers = Array.from({length: getRandomFromRange(0, allAvailable.length)}, () => getRandomFromArray(allAvailable));
  return [...new Set(randomOffers)];
};

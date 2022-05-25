import {getRandomInteger} from '../mock/util.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const name = [
  'Chamonix',
  'Amsterdam',
  'Geneva'
];

const nameToDescription = {
  'Chamonix': [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  ],
  'Amsterdam': [
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  ],
  'Geneva': []
};

const types = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const offersToTypes = {
  'taxi': ['Switch to comfort', 'Order Uber', ],
  'bus': ['Choose seats'],
  'train': ['Choose seats', 'Switch to comfort class', 'Book tickets'],
  'ship': ['Choose seats', 'Switch to comfort class', 'Book tickets', 'Add breakfast', 'Add meal'],
  'drive': ['Rent a car'],
  'flight': ['Choose seats', 'Add luggage', 'Switch to comfort class', 'Book tickets', 'Add breakfast', 'Add meal'],
  'sightseeing': ['Book tickets', 'Lunch in city'],
  'restaurant': [],
  'check-in': []
};

const generateRandomIndex = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

const generatePictures = () => {
  const arrayPictures = [];

  for (let i = 0; i < getRandomInteger(0, 3); i++) {
    arrayPictures.push({
      src: `http://picsum.photos/248/152?r=${Math.random()}`,
      description: 'Chamonix parliament building',
    });
  }
  return arrayPictures;
};

export const getDestination = (nameOfDestination) => ({
  name: nameOfDestination,
  description: nameToDescription[nameOfDestination],
  pictures: generatePictures(),
});

const getRandomDate = () =>
  dayjs()
    .day(getRandomInteger(1, 31))
    .set('month', getRandomInteger(1, 12))
    .set('hour', getRandomInteger(0, 23))
    .set('minute', getRandomInteger(0, 59))
    .toDate();

const createOffers = (type) => {
  const arrayOffers = [];

  for (let i = 0; i < offersToTypes[type].length; i++) {
    arrayOffers.push({
      id: i,
      title: offersToTypes[type][i],
      price: getRandomInteger(5, 200),
    });
  }

  return arrayOffers;
};

export const createOffer = (type) => ({
  type: type,
  offers: createOffers(type),
});

export const generateWaypoint = () => {

  const point = {
    basePrice: getRandomInteger(0, 1000),
    dateFrom: getRandomDate(),
    dateTo: getRandomDate(),
    destination: getDestination(generateRandomIndex(name)),
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: '',
    type: generateRandomIndex(types),
  };

  point.offers = createOffer(point.type);

  if (point.dateFrom > point.dateTo)
  {
    const tmpdate = point.dateFrom;
    point.dateFrom = point.dateTo;
    point.dateTo = tmpdate;
  }

  return point;
};

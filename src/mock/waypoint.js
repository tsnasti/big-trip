import {getRandomInteger} from '../mock/util.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const name = [
  'Chamonix',
  'Amsterdam',
  'Geneva'
];

const description = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

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

const offerTitles = [
  'Add luggage',
  'Switch to comfort class',
  'Add meal',
  'Choose seats',
  'Order Uber',
  'Switch to comfort',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city'
];

const generateRandomIndex = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

const getDestination = () => ({
  description: description.slice(getRandomInteger(0, description.length - 1)),
  name: generateRandomIndex(name),
  pictures: [
    {
      src: `http://picsum.photos/248/152?r=${Math.random()}`,
      description: 'Chamonix parliament building',
    }
  ]
});

const getRandomDate = () =>
  dayjs()
    .day(getRandomInteger(1, 31))
    .set('month', getRandomInteger(1, 12))
    .set('hour', getRandomInteger(0, 23))
    .set('minute', getRandomInteger(0, 59))
    .toDate();

const createOffers = () => {
  const arrayOffers = [];

  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    arrayOffers.push({
      id: i,
      title: generateRandomIndex(offerTitles),
      price: getRandomInteger(5, 200),
    });
  }

  return arrayOffers;
};

const createOffer = () => ({
  type: generateRandomIndex(types),
  offers: createOffers()
});

export const generateWaypoint = () => {

  const offers = createOffer();
  const point = {
    basePrice: getRandomInteger(0, 1000),
    dateFrom: getRandomDate(),
    dateTo: getRandomDate(),
    destination: getDestination(),
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: offers,
    type: offers.type
  };

  if (point.dateFrom > point.dateTo)
  {
    const tmpdate = point.dateFrom;
    point.dateFrom = point.dateTo;
    point.dateTo = tmpdate;
  }

  return point;
};

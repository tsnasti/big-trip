import dayjs from 'dayjs';

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

export {SortType};

const compareDays = (pointA, pointB) =>  dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);

const comparePrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const compareDuration = (pointA, pointB) => {
  const minutesDiffA = dayjs(pointA.dateTo).diff(pointA.dateFrom,'minute');
  const minutesDiffB = dayjs(pointB.dateTo).diff(pointB.dateFrom,'minute');
  return minutesDiffB - minutesDiffA;
};

export {compareDays, comparePrice, compareDuration};

import dayjs from 'dayjs';

const isPointPast = (date) => dayjs().isAfter(date, 'day');
const isPointFuture = (date) => dayjs().isBefore(date, 'day');
const isPointCurrent = (dateFrom, dateTo) => isPointPast(dateFrom) && isPointFuture(dateTo);

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom) || isPointCurrent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.dateTo) || isPointCurrent(point.dateFrom, point.dateTo)),
};

export {FilterType, filter};

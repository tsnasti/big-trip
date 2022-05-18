import {isPointPast, isPointFuture, isPointCurrent} from '../mock/util.js';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom) || isPointCurrent(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.dateTo) || isPointCurrent(point.dateTo)),
};

export {filter};

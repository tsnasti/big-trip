import {filter} from '../utils/filter.js';

export const generateFilter = () => Object.entries(filter).map(
  ([filterName]) => ({
    name: filterName,
    count: 5,
  }),
);

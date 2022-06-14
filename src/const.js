import dayjs from 'dayjs';

const BLANK_POINT = {
  basePrice: '',
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().add(7, 'day').toDate(),
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  id: 0,
  isFavorite: false,
  offers: [],
  type: 'flight',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {BLANK_POINT, UserAction, UpdateType, isEscapeKey};

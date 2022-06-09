import dayjs from 'dayjs';

const isPointPast = (date) => dayjs().isAfter(date, 'day');
const isPointFuture = (date) => dayjs().isBefore(date, 'day');
const isPointCurrent = (dateFrom, dateTo) => isPointPast(dateFrom) && isPointFuture(dateTo);

export {isPointPast, isPointFuture, isPointCurrent};

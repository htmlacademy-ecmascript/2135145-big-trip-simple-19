import dayjs from 'dayjs';

const getRandomFromRange = (from, to) => {
  const lower = Math.ceil(Math.min(Math.abs(from), Math.abs(to)));
  const upper = Math.floor(Math.max(Math.abs(from), Math.abs(to)));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const getRandomFromArray = (array) => {
  const index = getRandomFromRange(0, array.length - 1);
  return array[index];
};

const getMonthAndDay = (date) => dayjs(date).format('MMM D');

const getTime = (date) => dayjs(date).format('HH:mm');

const getDateWithSeparator = (date) => (dayjs(date).format('YYYY-MM-DD'));

const getDateWithTime = (date) => dayjs(date).format('YYYY-MM-DD HH:mm');

const getDateWithTimeWithSlash = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export {getRandomFromArray, getRandomFromRange, getTime, getMonthAndDay, getDateWithSeparator, getDateWithTime, capitalizeFirstLetter, getDateWithTimeWithSlash};

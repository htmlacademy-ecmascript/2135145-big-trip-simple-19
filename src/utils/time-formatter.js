import dayjs from 'dayjs';

const getMonthAndDay = (date) => dayjs(date).format('MMM D');

const getTime = (date) => dayjs(date).format('HH:mm');

const getDateWithSeparator = (date) => (dayjs(date).format('YYYY-MM-DD'));

const getDateWithTime = (date) => dayjs(date).format('YYYY-MM-DD HH:mm');

const getDateWithTimeWithSlash = (date) => dayjs(date).format('DD/MM/YY HH:mm');

export {getTime, getMonthAndDay, getDateWithSeparator, getDateWithTime, getDateWithTimeWithSlash};

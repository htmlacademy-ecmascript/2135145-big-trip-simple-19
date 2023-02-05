import dayjs from 'dayjs';

const sortByPrice = (pointA, pointB) => {
  if(pointB.basePrice > pointA.basePrice) {
    return 1;
  } else if(pointA.basePrice > pointB.basePrice){
    return -1;
  }
  return 0;
};

const sortByDate = (pointA, pointB) => dayjs(pointB.dateFrom).diff(pointA.dateFrom);

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const isPriceEqual = (priceA, priceB) => (priceA === null && priceB === null) || priceA === priceB;

export {sortByDate, sortByPrice, isDatesEqual, isPriceEqual};

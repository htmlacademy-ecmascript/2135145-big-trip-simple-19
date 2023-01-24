import dayjs from 'dayjs';

const sortByPrice = (pointA, pointB) => {
  if(pointB.basePrice > pointA.basePrice) {
    return 1
  } else if(pointA.basePrice > pointB.basePrice){
    return -1;
  }
  return 0;
};

const sortByDate = (pointA, pointB) => {
  return dayjs(pointB.dateFrom).diff(pointA.dateFrom);
};

export {sortByDate, sortByPrice};

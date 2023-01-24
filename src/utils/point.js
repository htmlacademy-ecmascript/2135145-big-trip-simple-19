import dayjs from "dayjs";

const sortByPrice = (pointA, pointB) => {

  return pointB.basePrice > pointA.basePrice ? 1
    : pointA.basePrice > pointB.basePrice  ? -1
    : 0;
}

const sortByDate = (pointA, pointB) => {
  return dayjs(pointB.dateFrom).diff(pointA.dateFrom);
}

export {sortByDate, sortByPrice};

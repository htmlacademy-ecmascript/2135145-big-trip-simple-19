import dayjs from "dayjs";
import {FilterType} from "../const";

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => (dayjs(point.dateFrom).diff(dayjs().toDate(), 'D') >= 0 || dayjs().isSame(point.dateFrom, 'date'))),
};

export {filter};

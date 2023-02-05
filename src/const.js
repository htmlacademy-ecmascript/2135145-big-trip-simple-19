const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const UserAction = {
  UPDATE_POINT: "UPDATE_POINT",
  ADD_POINT: "ADD_POINT",
  DELETE_POINT: "DELETE_POINT",
};

const UpdateType = {
  PATCH: "PATCH",
  MINOR: "MINOR",
  MAJOR: "MAJOR",
}

export {FilterType, SortType, UserAction, UpdateType};

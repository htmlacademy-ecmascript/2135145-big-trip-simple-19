const getRandomFromRange = (from, to) => {
  const lower = Math.ceil(Math.min(Math.abs(from), Math.abs(to)));
  const upper = Math.floor(Math.max(Math.abs(from), Math.abs(to)));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const getRandomFromArray = (array) => {
  const index = getRandomFromRange(0, array.length - 1);
  return array[index];
};

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export {getRandomFromArray, getRandomFromRange, capitalizeFirstLetter, updateItem};

export const getRandomNumber = (minNumber, maxNumber) => {
  return Math.floor(Math.random() * (maxNumber - minNumber) + minNumber);
};

export const getRandomValue = (arrayOfValues) => {
  return arrayOfValues[getRandomNumber(0, arrayOfValues.length)];
};


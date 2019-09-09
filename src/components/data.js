import {getRandomNumber, getRandomValue} from './utils';

export const SortType = {
  DATE_UP: `date-up`,
  DATE_DOWN: `date-down`,
  DEFAULT: `default`
};

const TagsSet = new Set([
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`,
  `keks2`,
  `keks3`,
  `kek4`,
  `kek5`
]);

const Description = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

const getRepeatingDays = () => {
  return {
    'Mo': false,
    'Tu': false,
    'We': getRandomValue([true, false]),
    'Th': false,
    'Fr': false,
    'Sa': false,
    'Su': false,
  };
};

const Colors = [
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`
];

export const Months = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`
];

export const getTaskMock = () => {
  return {
    description: getRandomValue(Description),
    dueDate: Date.now() + getRandomNumber(1000, 7 * 24 * 3600 * 1000),
    repeatingDays: getRepeatingDays(),
    tags: Array(3).fill(``).map(() => {
      return getRandomValue(Array.from(TagsSet));
    }),
    color: getRandomValue(Colors),
    isFavorite: getRandomValue([true, false]),
    isArchive: getRandomValue([true, false]),
  };
};

export const getFiltersData = (filtersCount) => {
  return [
    {
      title: `all`,
      count() {
        return filtersCount.all;
      }
    },
    {
      title: `OVERDUE`,
      count() {
        return filtersCount.overdue;
      }
    },
    {
      title: `TODAY`,
      count() {
        return filtersCount.today;
      }
    },
    {
      title: `FAVORITES`,
      count() {
        return filtersCount.favorites;
      }
    },
    {
      title: `Repeating`,
      count() {
        return filtersCount.repeating;
      }
    },
    {
      title: `TAGS`,
      count() {
        return filtersCount.tags;
      }
    },
    {
      title: `archive`,
      count() {
        return filtersCount.archive;
      }
    },

  ];
};

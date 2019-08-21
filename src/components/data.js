const MONTHS = [
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

const getTagArray = (tags) => {
  const arr = Array.from(tags);
  while (arr.length > 3) {
    arr.splice(Math.floor(Math.random() * arr.length), 1);
  }
  return arr;
};
export const getTask = () => {
  return {
    description: [
      `Изучить теорию`,
      `Сделать домашку`,
      `Пройти интенсив на соточку`
    ][Math.floor(Math.random() * 3)],
    dueDate: Date.now() + 1 + Math.floor(Math.random() * 7) * 60 * 60 * 24 * 1000,
    repeatingDays: {
      'Mo': false,
      'Tu': false,
      'We': Boolean(Math.round(Math.random())),
      'Th': false,
      'Fr': false,
      'Sa': false,
      'Su': false,
    },
    tags: getTagArray(new Set([
      `homework`,
      `theory`,
      `practice`,
      `intensive`,
      `keks`,
      `keks2`,
      `keks3`,
      `kek4`,
      `kek5`
    ])),
    color: [
      `black`,
      `yellow`,
      `blue`,
      `green`,
      `pink`
    ][Math.floor(Math.random() * 5)],
    isFavorite: Boolean(Math.round(Math.random())),
    isArchive: Boolean(Math.round(Math.random())),
  };
};

export const getFiltersData = (filtersCount) => {
  return [
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
    {
      title: `all`,
      count() {
        return filtersCount.all;
      }
    },
  ];
};
export {MONTHS};

import {getEditForm} from './edit-form';
import {getCard} from './card';
import {getTask} from './data';

const TASK_COUNT = 25;
const dataTaskArray = [];
const filterCount = {};

// получим список задач
const dataTaskList = [];
for (let i = 0; i < TASK_COUNT; i += 1) {
  dataTaskList.push(getTask());
}

// считаем количество фильтров
const getfilterCount = () => {
  let tagsList = [];
  let overdueCount = 0;
  let repeatingCount = 0;
  let todayCount = 0;
  dataTaskArray.forEach((task) => {
    if (task.dueDate < Date.now()) {
      overdueCount += 1;
    }
    if ((new Date(task.dueDate).getDate() === new Date().getDate()) &&
        (new Date(task.dueDate).getMonth() === new Date().getMonth())) {
      todayCount += 1;
    }
    repeatingCount += Object.keys(task.repeatingDays).some((day) => task.repeatingDays[day]) ? 1 : 0;
    tagsList = tagsList.concat(Array.from(task.tags)); // создаем массив тегов
  });
  // убираем дубли тегов, получаем количество уникальных
  filterCount.tags = tagsList.filter((tag, index) => tagsList.indexOf(tag) === index).length;
  filterCount.favorites = dataTaskArray.reduce((acc, el) => {
    acc += el.isFavorite ? 1 : 0;
    return acc;
  }, 0);
  filterCount.archive = dataTaskArray.reduce((acc, el) => {
    acc += el.isArchive ? 1 : 0;
    return acc;
  }, 0);
  filterCount.overdue = overdueCount;
  filterCount.today = todayCount;
  filterCount.repeating = repeatingCount;
  filterCount.all = dataTaskArray.length;
};

// формируем на основании массива с данными строку для вставки карточек
export const getCardList = (CARD_COUNT) => {
  let cards = [];

  for (let i = 0; i < CARD_COUNT && dataTaskList.length > 0; i += 1) {
    dataTaskArray.push(dataTaskList.shift());
  }

  dataTaskArray.forEach((el, index) => {
    if (index === 0) {
      cards.push(getEditForm(el));
    } else {
      cards.push(getCard(el));
    }
  });

  getfilterCount();// запускаем функцию подсчета количества карточек по фильтрам
  return cards.join(``);
};

export {filterCount, dataTaskList};

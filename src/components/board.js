import {getEditForm} from './edit-form';
import {getCard} from './card';
import {getTaskMock} from './data';

const dataTaskArray = [];
let filterCount = {};

// получим список задач(пока моковых)
const getDataTaskList = () => {
  const TASK_COUNT = 25;
  const dataTaskList = [];
  for (let i = 0; i < TASK_COUNT; i += 1) {
    dataTaskList.push(getTaskMock());
  }
  return dataTaskList;
};

// считаем количество фильтров
const getfilterCount = () => {
  let overdue = 0;
  let repeating = 0;
  let today = 0;
  let tags = 0;
  let archive = 0;
  let favorites = 0;

  dataTaskArray.forEach((task) => {
    if (task.dueDate < Date.now()) {
      overdue += 1;
    } // это просроченные

    if ((new Date(task.dueDate).getDate() === new Date().getDate()) &&
      (new Date(task.dueDate).getMonth() === new Date().getMonth())) {
      today += 1;
    } // это которые сегодня

    // повторяющиеся
    repeating += Object.keys(task.repeatingDays).some((day) => task.repeatingDays[day]) ? 1 : 0;

    // с тегами
    tags += task.tags.length > 0 ? 1 : 0;
  });

  // избранные
  favorites = dataTaskArray.reduce((acc, el) => {
    acc += el.isFavorite ? 1 : 0;
    return acc;
  }, 0);

  // архивные
  archive = dataTaskArray.reduce((acc, el) => {
    acc += el.isArchive ? 1 : 0;
    return acc;
  }, 0);

  filterCount = {tags, overdue, today, repeating, favorites, archive};
  filterCount.all = dataTaskArray.length;
};

const dataTaskList = getDataTaskList();

// формируем на основании массива с данными строку для вставки карточек
export const getCardList = (CARD_COUNT) => {
  let cards = [];

  for (let i = 0; i < CARD_COUNT && dataTaskList.length > 0; i += 1) {
    const newCard = dataTaskList.shift();
    dataTaskArray.push(newCard);// это массив уже вставленных карточек для фильтра

    if (!document.querySelector(`.card`) && i === 0) {
      cards[0] = getEditForm(newCard);
    } else {
      cards[i] = getCard(newCard);
    }
  }

  getfilterCount();// запускаем функцию подсчета количества карточек по фильтрам
  return cards.join(``);
};

export {filterCount, dataTaskList};

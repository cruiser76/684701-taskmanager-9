import Task from './components/task';
import TaskEdit from './components/task-edit';
import Search from './components/search';
import Sort from './components/sort';
import ButtonLoad from './components/button-load';
import Menu from './components/menu';
import BoardContainer from './components/board-container';
import Filters from './components/filters';
import NoTask from './components/no-task';
import {getFiltersData, getTaskMock} from './components/data';
import {render, unrender} from './components/utils';

const dataTaskArray = [];
const CARD_COUNT = 8;

// считаем количество фильтров
const getFilterCount = () => {
  let filterCount = {};
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
  return filterCount;
};

// получим список задач(пока моковых)
const getDataTaskList = () => {
  const TASK_COUNT = 10;
  const dataTaskList = [];
  for (let i = 0; i < TASK_COUNT; i += 1) {
    dataTaskList.push(getTaskMock());
  }
  return dataTaskList;
};
const dataTaskList = getDataTaskList();

// выбираем 8 карточек из массива с данными
export const getCardList = () => {
  let cards = [];

  for (let i = 0; i < CARD_COUNT && dataTaskList.length > 0; i += 1) {
    const newCard = dataTaskList.shift();
    dataTaskArray.push(newCard);// это массив уже вставленных карточек для фильтра
    cards[i] = newCard;
  }

  return cards;
};

// рендерим карточку
const renderTask = (taskMock) => {
  const task = new Task(taskMock);
  const taskEdit = new TaskEdit(taskMock);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  // вешаем обработчик открытия формы редактирования
  task.getElement()
  .querySelector(`.card__btn--edit`)
  .addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasksContainer.replaceChild(taskEdit.getElement(), task.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEdit.getElement().querySelector(`textarea`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement()
  .querySelector(`.card__save`)
  .addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(tasksContainer, task.getElement(), `beforeend`);
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);

const menu = new Menu();
render(menuContainer, menu.getElement(), `beforeend`);

const search = new Search();
render(mainContainer, search.getElement(), `beforeend`);

const boardContainer = new BoardContainer();
render(mainContainer, boardContainer.getElement(), `beforeend`);

const boardList = document.querySelector(`.board`);
const tasksContainer = document.querySelector(`.board__tasks`);
let arr = getCardList();
const filters = new Filters(getFiltersData(getFilterCount()));
if ((dataTaskArray.length === 0 && dataTaskList.length === 0) || (dataTaskList.length === 0 && dataTaskArray.length === getFilterCount().archive)) {
  const noTask = new NoTask();
  boardList.replaceChild(noTask.getElement(), tasksContainer);
  render(boardList, filters.getElement(), `before`);
} else {
  const sort = new Sort();
  render(boardList, sort.getElement(), `afterbegin`);

  if (boardList) {

    arr.forEach((el) => renderTask(el));


    render(boardList, filters.getElement(), `before`);

    // кнопка
    if (!document.querySelector(`.load-more`) && dataTaskList.length > 0) {
      const buttonLoad = new ButtonLoad();
      render(boardList, buttonLoad.getElement(), `beforeend`); // рендерим кнопку

      buttonLoad.getElement()
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        arr = getCardList();
        arr.forEach((el) => renderTask(el));

        // перерисуем фильтр
        if (document.querySelector(`.main__filter`)) {
          unrender(filters.getElement());
          filters.resetFilters(getFiltersData(getFilterCount()));
          render(boardList, filters.getElement(), `before`);
        }

        // если задач больше нет удаляем кнопку
        if (dataTaskList.length === 0) {
          unrender(buttonLoad.getElement());
          buttonLoad.removeElement();
        }
      });
    }
  }
}

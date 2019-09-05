import {render, unrender} from './utils';
import Menu from './menu';
import Search from './search';
import Task from './task';
import TaskEdit from './task-edit';
import BoardContainer from './board-container';
import ButtonLoad from './button-load';
import Filters from './filters';
import NoTask from './no-task';
import Sort from './sort';
import {getFiltersData} from './data';

export default class BoardController {
  constructor(mainContainer, menuContainer, dataTaskList) {
    this._CARD_COUNT = 8;
    this._mainContainer = mainContainer;
    this._menuContainer = menuContainer;
    this._dataTaskList = dataTaskList;
    this._dataTaskArray = [];
    this._menu = new Menu();
    this._search = new Search();
    this._boardContainer = new BoardContainer();
    this._sort = new Sort();
    this._buttonLoad = new ButtonLoad();
    this._noTaskMsg = new NoTask();
    this._cardsList = this._getCardList();
  }

  init() {
    render(this._menuContainer, this._menu.getElement(), `beforeend`);
    render(this._mainContainer, this._search.getElement(), `beforeend`);
    render(this._mainContainer, this._boardContainer.getElement(), `beforeend`);

    const filters = new Filters(getFiltersData(this._getFilterCount()));

    if ((this._dataTaskArray.length === 0 && this._dataTaskList.length === 0) || (this._dataTaskList.length === 0 && this._dataTaskArray.length === this._getFilterCount().archive)) {
      this._boardContainer.getElement().replaceChild(this._noTaskMsg.getElement(), this._boardContainer.getElement().querySelector(`.board__tasks`));
      render(this._boardContainer.getElement(), filters.getElement(), `before`);
    } else {
      render(this._boardContainer.getElement(), this._sort.getElement(), `afterbegin`);
      render(this._boardContainer.getElement(), filters.getElement(), `before`);
      this._cardsList.forEach((el) => this._renderTask(el));

      // кнопка
      if (!document.querySelector(`.load-more`) && this._dataTaskList.length > 0) {
        render(this._boardContainer.getElement(), this._buttonLoad.getElement(), `beforeend`); // рендерим кнопку

        this._buttonLoad.getElement()
        .addEventListener(`click`, (evt) => {
          evt.preventDefault();
          this._cardsList = this._getCardList();
          this._cardsList.forEach((el) => this._renderTask(el));

          // перерисуем фильтр
          if (document.querySelector(`.main__filter`)) {
            unrender(filters.getElement());
            filters.resetFilters(getFiltersData(this._getFilterCount()));
            render(this._boardContainer.getElement(), filters.getElement(), `before`);
          }

          // если задач больше нет удаляем кнопку
          if (this._dataTaskList.length === 0) {
            unrender(this._buttonLoad.getElement());
            this._buttonLoad.removeElement();
          }
        });
      }
    }
  }

  _getFilterCount() {
    let filterCount = {};
    let overdue = 0;
    let repeating = 0;
    let today = 0;
    let tags = 0;
    let archive = 0;
    let favorites = 0;

    this._dataTaskArray.forEach((task) => {
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
    favorites = this._dataTaskArray.reduce((acc, el) => {
      acc += el.isFavorite ? 1 : 0;
      return acc;
    }, 0);

    // архивные
    archive = this._dataTaskArray.reduce((acc, el) => {
      acc += el.isArchive ? 1 : 0;
      return acc;
    }, 0);

    filterCount = {tags, overdue, today, repeating, favorites, archive};
    filterCount.all = this._dataTaskArray.length;
    return filterCount;
  }

  _getCardList() {
    let cards = [];

    for (let i = 0; i < this._CARD_COUNT && this._dataTaskList.length > 0; i += 1) {
      const newCard = this._dataTaskList.shift();
      this._dataTaskArray.push(newCard);// это массив уже вставленных карточек для фильтра
      cards[i] = newCard;
    }

    return cards;
  }

  _renderTask(taskElement) {
    const task = new Task(taskElement);
    const taskEdit = new TaskEdit(taskElement);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._boardContainer.getElement().querySelector(`.board__tasks`).replaceChild(task.getElement(), taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    // вешаем обработчик открытия формы редактирования
    task.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._boardContainer.getElement().querySelector(`.board__tasks`).replaceChild(taskEdit.getElement(), task.getElement());
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
      this._boardContainer.getElement().querySelector(`.board__tasks`).replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._boardContainer.getElement().querySelector(`.board__tasks`), task.getElement(), `beforeend`);
  }
}
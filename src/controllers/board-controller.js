import {render, unrender} from '../components/utils';
import Menu from '../components/menu';
import Search from '../components/search';
import BoardContainer from '../components/board-container';
import ButtonLoad from '../components/button-load';
import Filters from '../components/filters';
import NoTask from '../components/no-task';
import Sort from '../components/sort';
import {getFiltersData, SortType} from '../components/data';
import TaskList from '../components/task-list';
import TaskController from './task-controller';

export default class BoardController {
  constructor(mainContainer, menuContainer, dataTaskList) {
    this._CARD_COUNT = 8;
    this._mainContainer = mainContainer;
    this._menuContainer = menuContainer;
    this._dataTaskList = dataTaskList;
    this._dataTaskArray = [];
    this._menu = new Menu();
    this._search = new Search();
    this._sort = new Sort();
    this._boardContainer = new BoardContainer();
    this._taskList = new TaskList();
    this._buttonLoad = new ButtonLoad();
    this._noTaskMsg = new NoTask();
    this._cardsList = this._getCardList();
    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  init() {
    render(this._menuContainer, this._menu.getElement(), `beforeend`);
    render(this._mainContainer, this._search.getElement(), `beforeend`);
    render(this._mainContainer, this._boardContainer.getElement(), `beforeend`);

    const filters = new Filters(getFiltersData(this._getFilterCount()));

    if ((this._dataTaskArray.length === 0 && this._cardsList === 0) || (this._dataTaskList.length === 0 && this._dataTaskArray.length === this._getFilterCount().archive)) {
      render(this._boardContainer.getElement(), filters.getElement(), `before`);
      render(this._boardContainer.getElement(), this._noTaskMsg.getElement(), `beforeend`);
    } else {
      render(this._boardContainer.getElement(), this._sort.getElement(), `afterbegin`);
      render(this._boardContainer.getElement(), filters.getElement(), `before`);
      render(this._boardContainer.getElement(), this._taskList.getElement(), `beforeend`);
      this._sort.getElement().addEventListener(`click`, (evt) => this._onSortButtonClick(evt));

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

  _renderBoard(tasks) {
    this._taskList.getElement().innerHTML = ``;
    tasks.forEach((taskMock) => this._renderTask(taskMock));
  }

  // считаем фильтры
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

  // добавляем карточки для рендеринга
  _getCardList() {
    let cards = [];

    for (let i = 0; i < this._CARD_COUNT && this._dataTaskList.length > 0; i += 1) {
      const newCard = this._dataTaskList.shift();
      this._dataTaskArray.push(newCard);// это массив уже вставленных карточек для фильтра
      cards[i] = newCard;
    }

    return cards;
  }

  _renderTask(taskData) {
    const taskController = new TaskController(this._taskList, taskData, this._onDataChange, this._onChangeView);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    this._dataTaskArray[this._dataTaskArray.findIndex((it) => it === oldData)] = newData;
    this._renderBoard(this._dataTaskArray);
  }
  // сортировка
  _onSortButtonClick(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A`) {
      return;
    }
    this._taskList.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case SortType.DATE_UP:
        const sortedByDateUpTasks = this._dataTaskArray.slice().sort((a, b) => a.dueDate - b.dueDate);
        sortedByDateUpTasks.forEach((taskMock) => this._renderTask(taskMock));
        break;
      case SortType.DATE_DOWN:
        const sortedByDateDownTasks = this._dataTaskArray.slice().sort((a, b) => b.dueDate - a.dueDate);
        sortedByDateDownTasks.forEach((taskMock) => this._renderTask(taskMock));
        break;
      case SortType.DEFAULT:
        this._dataTaskArray.slice().forEach((taskMock) => this._renderTask(taskMock));
        break;
    }
  }
}

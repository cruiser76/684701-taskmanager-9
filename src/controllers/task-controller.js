import {render} from '../components/utils';
import Task from '../components/task';
import TaskEdit from '../components/task-edit';

export default class TaskController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._data = data;
    this._task = new Task(data);
    this._taskEdit = new TaskEdit(data);
    this.init();
  }

  init() {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.getElement().replaceChild(this._task.getElement(), this._taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    // вешаем обработчик открытия формы редактирования
    this._task.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._onChangeView();
      this._container.getElement().replaceChild(this._taskEdit.getElement(), this._task.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    // удаляем обработчик при активном поле ввода
    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    // назначаем обработчик при потере фокуса полем ввода
    this._taskEdit.getElement().querySelector(`textarea`)
    .addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._taskEdit.getElement()
    .querySelector(`.card__save`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();

      // Получим данные с формы
      const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));
      const entry = {
        description: formData.get(`text`),
        color: formData.get(`color`),
        tags: Array.from(new Set(formData.getAll(`hashtag`))),
        dueDate: new Date(formData.get(`date`)),
        repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
          acc[it] = true;
          return acc;
        }, {
          'mo': false,
          'tu': false,
          'we': false,
          'th': false,
          'fr': false,
          'sa': false,
          'su': false,
        })
      };

      this._onDataChange(entry, this._data);
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._container.getElement(), this._task.getElement(), `beforeend`);
  }

  setDefaultView() {
    if (this._container.getElement().contains(this._taskEdit.getElement())) {
      this._container.getElement().replaceChild(this._task.getElement(), this._taskEdit.getElement());
    }
  }
}

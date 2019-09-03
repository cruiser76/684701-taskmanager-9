import {createElement} from "./utils";

export default class NoTask {
  constructor() {
    this._element = undefined;
  }

  getElement() {
    if (this._element === undefined) {
      this._element = createElement(this.getTemplate().trim());
    }
    return this._element;
  }

  getTemplate() {
    return `<p class="board__no-tasks">
          Congratulations, all tasks were completed! To create a new click on
          «add new task» button.
        </p>`;
  }
}

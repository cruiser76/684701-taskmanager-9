import {createElement} from './utils';

export default class BoardContainer {
  constructor() {
    this._element = undefined;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate().trim());
    }
    return this._element;
  }

  getTemplate() {
    return `<section class="board container">
      <div class="board__tasks">
      </div>
    </section>`;
  }
}

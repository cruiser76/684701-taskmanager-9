import {createElement} from './utils';

export default class ButtonLoad {
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
    return `
    <button class="load-more" type="button">load more</button>`;
  }

  removeElement() {
    this._element = undefined;
  }
}

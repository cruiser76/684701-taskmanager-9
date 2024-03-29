import {createElement} from "./utils";

export default class AbstractComponent {
  constructor() {
    this._element = null;
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate().trim());
    }
    return this._element;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  removeElement() {
    this._element = null;
  }
}

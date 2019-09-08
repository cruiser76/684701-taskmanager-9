import AbstractComponent from './abstract-component';

export default class BoardContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="board container">
    </section>`;
  }
}

import AbstractComponent from './abstract-component';

export default class BoardContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="board container">
      <div class="board__tasks">
      </div>
    </section>`;
  }
}

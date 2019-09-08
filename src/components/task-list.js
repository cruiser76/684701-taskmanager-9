import AbstractComponent from "./abstract-component";

export default class TaskList extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return ` <div class="board__tasks">
    </div>`;
  }
}
